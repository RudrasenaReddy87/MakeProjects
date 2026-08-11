/**
 * SEO Regression Test Script for MakeProjects.in
 * Run with: node seo-test.js
 * 
 * Checks all HTML files for basic SEO requirements:
 * - <title> tag exists and is unique
 * - <meta name="description"> exists
 * - <link rel="canonical"> exists and uses HTTPS
 * - No accidental noindex
 * - robots.txt exists
 * - sitemap.xml exists
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const htmlFiles = [];
const issues = [];
let passCount = 0;
let failCount = 0;

// Recursively find all HTML files
function findHtmlFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'Desktop_View' && entry.name !== 'Mobile_View') {
            findHtmlFiles(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== '404.html') {
            htmlFiles.push(fullPath);
        }
    }
}

function check(condition, message, file) {
    if (condition) {
        passCount++;
    } else {
        failCount++;
        issues.push({ file: path.relative(ROOT, file || ''), message });
    }
}

findHtmlFiles(ROOT);

console.log('=== MakeProjects.in SEO Regression Tests ===\n');
console.log(`Found ${htmlFiles.length} HTML files to check.\n`);

const titles = {};
const descriptions = {};
const canonicals = {};

// Check each HTML file
for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relPath = path.relative(ROOT, file);
    
    // 1. Title exists
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    check(titleMatch, `Missing <title> tag`, file);
    
    if (titleMatch) {
        const title = titleMatch[1].trim();
        // Check for generic titles
        check(title !== 'Home' && title !== 'Page' && title.length > 10, `Title is too generic: "${title}"`, file);
        
        // Track duplicates
        if (titles[title]) {
            check(false, `Duplicate title "${title}" (also in ${titles[title]})`, file);
        } else {
            titles[title] = relPath;
        }
    }
    
    // 2. Meta description exists
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    check(descMatch, `Missing <meta name="description">`, file);
    
    if (descMatch) {
        const desc = descMatch[1].trim();
        check(desc.length >= 50, `Meta description too short (${desc.length} chars): "${desc.substring(0, 60)}..."`, file);
        check(desc.length <= 200, `Meta description too long (${desc.length} chars)`, file);
        
        if (descriptions[desc]) {
            check(false, `Duplicate description (also in ${descriptions[desc]})`, file);
        } else {
            descriptions[desc] = relPath;
        }
    }
    
    // 3. Canonical URL exists
    const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    check(canonicalMatch, `Missing <link rel="canonical">`, file);
    
    if (canonicalMatch) {
        const canonical = canonicalMatch[1];
        check(canonical.startsWith('https://'), `Canonical URL not HTTPS: "${canonical}"`, file);
        check(canonical.includes('makeprojects.in'), `Canonical URL doesn't point to makeprojects.in: "${canonical}"`, file);
        
        if (canonicals[canonical] && !file.includes('project-list') && !file.includes('project-detail')) {
            check(false, `Duplicate canonical URL "${canonical}" (also in ${canonicals[canonical]})`, file);
        } else {
            canonicals[canonical] = relPath;
        }
    }
    
    // 4. No accidental noindex
    const noindexMatch = content.match(/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i);
    if (!file.includes('404')) {
        check(!noindexMatch, `Page has noindex directive`, file);
    }
    
    // 5. Has lang attribute on <html>
    const langMatch = content.match(/<html\s[^>]*lang=["']([^"']+)["']/i);
    check(langMatch, `Missing lang attribute on <html>`, file);
    
    // 6. Has viewport meta
    const viewportMatch = content.match(/<meta\s+name=["']viewport["']/i);
    check(viewportMatch, `Missing viewport meta tag`, file);
}

// Check infrastructure files
console.log('\n--- Infrastructure Checks ---');

check(fs.existsSync(path.join(ROOT, 'robots.txt')), 'robots.txt exists');
check(fs.existsSync(path.join(ROOT, 'sitemap.xml')), 'sitemap.xml exists');
check(fs.existsSync(path.join(ROOT, '.htaccess')), '.htaccess exists');
check(fs.existsSync(path.join(ROOT, '404.html')), '404.html exists');

// Check robots.txt content
if (fs.existsSync(path.join(ROOT, 'robots.txt'))) {
    const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf-8');
    check(robots.includes('Sitemap:'), 'robots.txt contains Sitemap directive');
    check(robots.includes('https://makeprojects.in/sitemap.xml'), 'robots.txt sitemap URL is correct');
    check(!robots.includes('Disallow: /\n') && !robots.includes('Disallow: / '), 'robots.txt does not block root');
}

// Check sitemap.xml content
if (fs.existsSync(path.join(ROOT, 'sitemap.xml'))) {
    const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf-8');
    check(sitemap.includes('https://makeprojects.in/'), 'Sitemap contains homepage URL');
    const locUrls = sitemap.match(/<loc>([^<]+)<\/loc>/g) || [];
    const hasHttpLoc = locUrls.some(u => u.includes('http://'));
    check(!hasHttpLoc, 'Sitemap uses HTTPS for all <loc> URLs');
    check(sitemap.includes('IEEE_Projects.html'), 'Sitemap includes IEEE Projects page');
    check(sitemap.includes('General_projects.html'), 'Sitemap includes General Projects page');
}

// Print results
console.log('\n=== Results ===\n');
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);

if (issues.length > 0) {
    console.log('\n--- Issues Found ---\n');
    for (const issue of issues) {
        console.log(`❌ ${issue.file || 'INFRASTRUCTURE'}: ${issue.message}`);
    }
}

console.log('\n=== Test Complete ===');
process.exit(failCount > 0 ? 1 : 0);
