document.addEventListener('DOMContentLoaded', () => {
    // ── UI Elements ──
    const domainTitle = document.getElementById('domain-title');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const projectsGrid = document.getElementById('projects-grid');

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            mainNav.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') || mainNav.classList.contains('show')) {
                if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    mainNav.classList.remove('active', 'show');
                }
            }
        });
    }

    // 1. Get domain from URL
    const urlParams = new URLSearchParams(window.location.search);
    const requestedDomain = urlParams.get('domain');

    if (!requestedDomain) {
        showError("No domain specified in the URL. Please go back and select a domain.");
        return;
    }

    // Update title and SEO meta tags
    domainTitle.textContent = requestedDomain + " Projects";
    document.title = `${requestedDomain} Projects for Final Year Students | MakeProjects.in`;

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://makeprojects.in/Templates/project-list/Project_display.html?domain=${encodeURIComponent(requestedDomain)}`;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = `Browse ${requestedDomain} projects for B.Tech and M.Tech final year students. Each project includes source code, IEEE paper reference, and technologies used.`;

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${requestedDomain} Projects | MakeProjects.in`;
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = `Browse ${requestedDomain} projects for engineering students.`;

    // Domain configuration mapping
    const domainsConfig = [
        { "Domain": "Agentic AI", "Project_CSV": "Agentic_AI.csv" },
        { "Domain": "AI", "Project_CSV": "AI.csv" },
        { "Domain": "Cybersecurity", "Project_CSV": "Cyber_Security.csv" },
        { "Domain": "Data Science", "Project_CSV": "Data_Science.csv" },
        { "Domain": "Deep Learning", "Project_CSV": "Coming_Soon" },
        { "Domain": "Machine Learning", "Project_CSV": "Coming_Soon" },
        { "Domain": "NLP", "Project_CSV": "Coming_Soon" },
        { "Domain": "Quantum Inspired ML", "Project_CSV": "Coming_Soon" }
    ];

    // Find the domain configuration
    const domainConfig = domainsConfig.find(d => d.Domain === requestedDomain);

    if (!domainConfig) {
        showError(`Domain "${requestedDomain}" not found in our database.`);
        return;
    }

    if (domainConfig.Project_CSV === "Coming_Soon") {
        showComingSoon();
        return;
    }

    loadProjectsFromCSV(domainConfig.Project_CSV);

    // 3. Load and parse the CSV file
    function loadProjectsFromCSV(fileName) {
        let csvUrl = `../../CSV_files/${fileName}`;

        fetch(csvUrl)
            .then(response => {
                if (!response.ok) {
                    // Fallback to lowercase folder name just in case
                    const fallbackUrl = `../../csv_files/${fileName}`;
                    return fetch(fallbackUrl).then(res => {
                        if (!res.ok) {
                            throw new Error(`Failed to load projects file: ${fileName}. Ensure the CSV_files folder is correctly uploaded to your server.`);
                        }
                        return res;
                    });
                }
                return response;
            })
            .then(response => response.text())
            .then(csvText => {
                parseCSV(csvText);
            })
            .catch(err => {
                console.warn("Fetch failed, trying fallback variable.", err);
                if (fileName === 'Agentic_AI.csv' && typeof AgenticAICsvData !== 'undefined') {
                    parseCSV(AgenticAICsvData);
                } else if (fileName === 'Cyber_Security.csv' && typeof CyberSecurityCsvData !== 'undefined') {
                    parseCSV(CyberSecurityCsvData);
                } else if (fileName === 'AI.csv' && typeof AICsvData !== 'undefined') {
                    parseCSV(AICsvData);
                } else if (fileName === 'Data_Science.csv' && typeof DataScienceCsvData !== 'undefined') {
                    parseCSV(DataScienceCsvData);
                } else {
                    showError(err.message || `Failed to load projects file: ${fileName}.`);
                    console.error(err);
                }
            });
    }

    function parseCSV(csvText) {
        if (typeof Papa === 'undefined') {
            showError("PapaParse library not loaded. Please check your internet connection.");
            return;
        }
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                if (results.errors && results.errors.length > 0 && results.data.length === 0) {
                    showError("Error parsing the projects data file.");
                    console.error(results.errors);
                    return;
                }

                renderProjects(results.data);
            }
        });
    }

    // 4. Render projects to the UI
    function renderProjects(projects) {
        if (!projects || projects.length === 0) {
            showError("No projects found for this domain yet.");
            return;
        }

        loadingSpinner.style.display = 'none';
        projectsGrid.style.display = 'grid';
        projectsGrid.innerHTML = '';

        projects.forEach(project => {
            // Some basic validation to ensure we have the required fields
            const code = project['Project Code'] || 'TBD';
            const title = project['Project Title'] || 'Untitled Project';
            const paperTitle = project['IEEE Paper Title'] || '';
            const paperLink = project['IEEE Paper Link'] || '#';
            const techString = project['Technologies Used'] || '';

            // Create tech tags
            let techTagsHtml = '';
            if (techString) {
                const techArray = techString.split(',').map(t => t.trim()).slice(0, 4); // Show max 4 tags
                techTagsHtml = techArray.map(t => `<span class="tech-tag">${t}</span>`).join('');
                if (techString.split(',').length > 4) {
                    techTagsHtml += `<span class="tech-tag">...</span>`;
                }
            }

            const card = document.createElement('div');
            card.className = 'project-card';

            card.innerHTML = `
                <div class="card-header">
                    <span class="project-code">${code}</span>
                </div>
                <h3 class="project-title">${title}</h3>
                ${paperTitle ? `<p class="paper-title" title="${paperTitle}">Base Paper: ${paperTitle}</p>` : ''}
                
                <div class="tech-stack">
                    ${techTagsHtml}
                </div>
                
                <div class="card-actions">
                    <a href="../project-detail/show.html?project=${encodeURIComponent(code)}&domain=${encodeURIComponent(requestedDomain)}&t=${Date.now()}" class="btn-primary">View Details</a>
                    ${paperLink && paperLink !== '#' ? `<a href="${paperLink}" target="_blank" class="btn-secondary">IEEE Paper</a>` : ''}
                </div>
            `;

            projectsGrid.appendChild(card);
        });

        // Initialize Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 100); // Staggered animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all project cards
        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Helper: Show error message
    function showError(message) {
        loadingSpinner.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1rem; display: block; color: #f87171;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>${message}</p>
        `;
    }

    // Helper: Show Coming Soon message
    function showComingSoon() {
        loadingSpinner.style.display = 'none';
        errorMessage.style.display = 'flex';
        errorMessage.style.justifyContent = 'center';
        errorMessage.style.alignItems = 'center';
        errorMessage.style.background = 'transparent';
        errorMessage.style.border = 'none';
        errorMessage.style.padding = '1rem'; /* Safe padding to avoid edge-touching */
        errorMessage.style.maxWidth = '100%';
        errorMessage.style.width = '100%';
        errorMessage.style.margin = '0 auto';
        errorMessage.style.boxSizing = 'border-box';
        errorMessage.innerHTML = `
            <style>
                @keyframes float-icon {
                    0% { transform: translateY(0px); filter: drop-shadow(0 5px 15px rgba(22, 163, 74, 0.2)); }
                    50% { transform: translateY(-10px); filter: drop-shadow(0 15px 20px rgba(22, 163, 74, 0.4)); }
                    100% { transform: translateY(0px); filter: drop-shadow(0 5px 15px rgba(22, 163, 74, 0.2)); }
                }
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes expand-line {
                    0% { width: 0; opacity: 0; }
                    100% { width: 80px; opacity: 1; }
                }
                @keyframes gradient-pan {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .cs-container {
                    padding: clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem);
                    text-align: center;
                    animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    background: rgba(22, 163, 74, 0.03);
                    border: 1px solid rgba(22, 163, 74, 0.15);
                    border-radius: 20px;
                    max-width: 800px;
                    width: 100%;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.02);
                    position: relative;
                    overflow: hidden;
                }
                .cs-container::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, transparent, #16a34a, transparent);
                    opacity: 0.5;
                }
                .cs-icon {
                    margin: 0 auto 2rem;
                    display: block;
                    width: clamp(54px, 10vw, 76px);
                    height: clamp(54px, 10vw, 76px);
                    color: #07722fff;
                    animation: float-icon 4s ease-in-out infinite;
                }
                .cs-title {
                    margin-bottom: 1.5rem;
                    font-size: clamp(2rem, 6vw, 3.5rem);
                    font-weight: 800;
                    letter-spacing: -0.01em;
                    background: linear-gradient(135deg, #179b4cff, #0a361fff, #179b4cff);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradient-pan 4s linear infinite;
                }
                .cs-divider {
                    height: 3px;
                    background: linear-gradient(90deg, transparent, #16a34a, transparent);
                    border-radius: 2px;
                    margin: 0 auto;
                    animation: expand-line 1s ease-out 0.5s forwards;
                    width: 0;
                    opacity: 0;
                }
            </style>
            <div class="cs-container">
                <svg class="cs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h3 class="cs-title">Coming Soon</h3>
                <div class="cs-divider"></div>
            </div>
        `;
    }
});


// --- Hover Flow Pill Logic ---
document.addEventListener("DOMContentLoaded", () => {
    const mainNavUlList = document.querySelectorAll('.main-nav ul');
    mainNavUlList.forEach(mainNavUl => {
        if (mainNavUl.querySelector('.hover-pill')) return; 

        const pill = document.createElement('li');
        pill.className = 'hover-pill';
        mainNavUl.appendChild(pill);

        const navLinks = mainNavUl.querySelectorAll('li a');
        const activeLink = mainNavUl.querySelector('a.nav-active');

        function setPillTo(element) {
            if (!element) {
                pill.style.opacity = '0';
                return;
            }
            requestAnimationFrame(() => {
                pill.style.width = `${element.offsetWidth}px`;
                pill.style.height = `${element.offsetHeight}px`;
                pill.style.left = `${element.offsetLeft}px`;
                pill.style.top = `${element.offsetTop}px`;
                pill.style.opacity = '1';
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                setPillTo(this.parentElement);
            });
            link.addEventListener('touchstart', function() {
                setPillTo(this.parentElement);
            }, {passive: true});
        });

        mainNavUl.addEventListener('mouseleave', () => {
            if (activeLink) {
                setPillTo(activeLink.parentElement);
            } else {
                pill.style.opacity = '0';
            }
        });

        setTimeout(() => {
            if (activeLink && activeLink.offsetWidth > 0) {
                setPillTo(activeLink.parentElement);
                pill.style.transition = 'none';
                setTimeout(() => pill.style.transition = '', 50);
            }
        }, 100);

        window.addEventListener('resize', () => {
            if (activeLink && activeLink.offsetWidth > 0) {
                setPillTo(activeLink.parentElement);
            }
        });
        
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('.mobile-menu-btn');
            if (toggle) {
                setTimeout(() => {
                    if (activeLink && activeLink.offsetWidth > 0) {
                        setPillTo(activeLink.parentElement);
                    }
                }, 100);
            }
        });
    });
});

// Dynamic Scroll Gradient Listener
function syncScrollGradient() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
    const progress = Math.min(Math.max(scrollHeight > 0 ? scrollTop / scrollHeight : 0, 0), 1);
    document.documentElement.style.setProperty('--scroll-p', progress.toFixed(4));
}
window.addEventListener('scroll', syncScrollGradient, { passive: true });
window.addEventListener('resize', syncScrollGradient, { passive: true });
document.addEventListener('DOMContentLoaded', syncScrollGradient);
syncScrollGradient();

// =====================================================
// BUBBLE SPOTLIGHT — mouse-tracking glow on cards
// =====================================================
(function initBubbleEffects() {
    function updateBubble(e) {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        el.style.setProperty('--mx', x);
        el.style.setProperty('--my', y);
    }

    function resetBubble() {
        this.style.setProperty('--mx', '50%');
        this.style.setProperty('--my', '50%');
    }

    function addRipple(e) {
        const el  = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 0.6;
        const ring = document.createElement('span');
        ring.className = 'ripple-ring';
        ring.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
        el.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove(), { once: true });
    }

    function attachToCards() {
        document.querySelectorAll('.project-card').forEach(el => {
            if (el.dataset.bubble) return;
            el.dataset.bubble = '1';
            // initialise to centre so first hover looks natural
            el.style.setProperty('--mx', '50%');
            el.style.setProperty('--my', '50%');
            el.addEventListener('mousemove',  updateBubble);
            el.addEventListener('mouseleave', resetBubble);
            el.addEventListener('click',      addRipple);
        });
    }

    const grid = document.getElementById('projects-grid');
    if (grid) new MutationObserver(attachToCards).observe(grid, { childList: true });
    document.addEventListener('DOMContentLoaded', attachToCards);
})();
