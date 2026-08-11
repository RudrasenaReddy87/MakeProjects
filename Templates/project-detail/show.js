document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const statusContainer = document.getElementById('status-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const projectMain = document.getElementById('project-main');
    
    // Hero Elements
    const displayDomain = document.getElementById('display-domain');
    const displayTitle = document.getElementById('display-title');
    const displayCode = document.getElementById('display-code');
    
    // Details Container
    const dynamicFieldsContainer = document.getElementById('dynamic-fields-container');
    
    // Buttons
    const btnBuy = document.getElementById('btn-buy');
    const btnInquire = document.getElementById('btn-inquire');

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // 1. Get parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const requestedProjectCode = urlParams.get('project');
    const requestedDomain = urlParams.get('domain');

    if (!requestedProjectCode || !requestedDomain) {
        showError("Invalid link. Missing project code or domain in the URL.");
        return;
    }

    // Set initial loading states
    displayDomain.textContent = requestedDomain;
    displayCode.textContent = requestedProjectCode;

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

    const domainConfig = domainsConfig.find(d => d.Domain === requestedDomain);
    
    if (!domainConfig) {
        showError(`Domain "${requestedDomain}" not found in our database.`);
        return;
    }

    loadProjectFromCSV(domainConfig.Project_CSV);

    // 3. Load and parse the CSV file
    function loadProjectFromCSV(fileName) {
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
                        
                        findAndRenderProject(results.data);
                    }
                });
            })
            .catch(err => {
                showError(err.message);
                console.error(err);
            });
    }

    // 4. Find the specific project and render it
    function findAndRenderProject(allProjects) {
        // Find the project matching the requested code
        const project = allProjects.find(p => p['Project Code'] === requestedProjectCode);

        if (!project) {
            showError(`Project with code "${requestedProjectCode}" could not be found.`);
            return;
        }

        // --- Update UI ---
        statusContainer.style.display = 'none';
        projectMain.style.display = 'flex';

        // Update Hero
        const title = project['Project Title'] || 'Untitled Project';
        displayTitle.textContent = title;
        document.title = `${title} | ${requestedDomain} Project | MakeProjects.in`;
        
        // Update SEO meta tags dynamically
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.href = `https://makeprojects.in/Templates/project-detail/show.html?project=${encodeURIComponent(requestedProjectCode)}&domain=${encodeURIComponent(requestedDomain)}`;
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = `${title} — ${requestedDomain} project. View project code, IEEE paper reference, and technologies used at MakeProjects.in`;
        
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = `${title} | MakeProjects.in`;
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.content = `${title} — ${requestedDomain} project details.`;

        // Inject dynamic fields based on CSV column headers
        Object.keys(project).forEach(key => {
            // Skip Code and Title as they are already in the hero banner
            if (key === 'Project Code' || key === 'Project Title') return;

            const value = project[key];
            if (!value) return; // Skip empty fields

            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'field-group';

            const fieldLabel = document.createElement('div');
            fieldLabel.className = 'field-label';
            fieldLabel.textContent = key;

            const fieldValue = document.createElement('div');
            fieldValue.className = 'field-value';

            // Custom formatting based on the field type
            if (key.toLowerCase().includes('link') || key.toLowerCase().includes('url')) {
                // Render as hyperlink
                fieldValue.innerHTML = `<a href="${value}" target="_blank">${value}</a>`;
            } else if (key.toLowerCase().includes('technologies')) {
                // Render as tags
                const techTagsHtml = value.split(',')
                    .map(t => `<span class="tag-item">${t.trim()}</span>`)
                    .join('');
                fieldValue.innerHTML = `<div class="tags-container">${techTagsHtml}</div>`;
            } else {
                // Default text rendering
                fieldValue.textContent = value;
            }

            fieldGroup.appendChild(fieldLabel);
            fieldGroup.appendChild(fieldValue);
            dynamicFieldsContainer.appendChild(fieldGroup);
        });

        // --- Setup WhatsApp Integration ---
        setupWhatsAppButtons(project);
    }

    function setupWhatsAppButtons(project) {
        const title = project['Project Title'] || '';
        const code = project['Project Code'] || '';
        const domain = requestedDomain || '';
        
        // Define target WhatsApp number (include country code)
        const whatsappNumber = "917780401166"; 

        // Generate the exact message structure requested for Buy
        const buyMessageText = `Hello Sir,\n\nI would like to download the following project:\n\nProject Code: ${code}\nProject Title: ${title}\nDomain: ${domain}\n\nCould you please provide me with the project files or the download link?\n\nThank you, Sir.`;
        const buyWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buyMessageText)}`;

        // Generate the exact message structure requested for General Inquiry
        // Using a single asterisk (*) for WhatsApp bold text formatting
        const inquireMessageText = `Hello Sir,\n\nI would like to know more details about the following project:\n\n*Project Code:* ${code}\n*Project Title:* ${title}\n*Domain:* ${domain}\n\nCould you please share the project details and let me know the price? Also, would it be possible to discuss and negotiate the price?\n\nThank you, Sir.`;
        const inquireWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inquireMessageText)}`;

        // Attach click events to both buttons to redirect to WhatsApp
        btnBuy.addEventListener('click', () => {
            window.open(buyWhatsappUrl, '_blank');
        });
        
        btnInquire.addEventListener('click', () => {
            window.open(inquireWhatsappUrl, '_blank');
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
});
