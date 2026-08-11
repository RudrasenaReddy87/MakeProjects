document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const domainTitle = document.getElementById('domain-title');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const projectsGrid = document.getElementById('projects-grid');
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
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
        { "Domain": "AI", "Project_CSV": "Agentic_AI.csv" },
        { "Domain": "Cybersecurity", "Project_CSV": "Agentic_AI.csv" },
        { "Domain": "Data Science", "Project_CSV": "Agentic_AI.csv" },
        { "Domain": "Deep Learning", "Project_CSV": "Agentic_AI.csv" },
        { "Domain": "Machine Learning", "Project_CSV": "Agentic_AI.csv" },
        { "Domain": "NLP", "Project_CSV": "Agentic_AI.csv" },
        { "Domain": "Quantum Inspired ML", "Project_CSV": "Agentic_AI.csv" }
    ];

    // Find the domain configuration
    const domainConfig = domainsConfig.find(d => d.Domain === requestedDomain);
    
    if (!domainConfig) {
        showError(`Domain "${requestedDomain}" not found in our database.`);
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
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function(results) {
                        if (results.errors && results.errors.length > 0 && results.data.length === 0) {
                            showError("Error parsing the projects data file.");
                            console.error(results.errors);
                            return;
                        }
                        
                        renderProjects(results.data);
                    }
                });
            })
            .catch(err => {
                showError(err.message);
                console.error(err);
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
                    <a href="../project-detail/show.html?project=${encodeURIComponent(code)}&domain=${encodeURIComponent(requestedDomain)}" class="btn-primary">View Details</a>
                    ${paperLink && paperLink !== '#' ? `<a href="${paperLink}" target="_blank" class="btn-secondary">IEEE Paper</a>` : ''}
                </div>
            `;
            
            projectsGrid.appendChild(card);
        });
    }

    // Helper: Show error message
    function showError(message) {
        loadingSpinner.style.display = 'none';
        projectsGrid.style.display = 'none';
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
});
