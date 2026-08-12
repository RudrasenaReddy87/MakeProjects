/* ============================================
   IEEE Projects — JavaScript
   Category filtering, search, and interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- DOM References ----
    const categoryList = document.getElementById('category-list');
    const domainGrid = document.getElementById('domain-grid');
    const searchInput = document.getElementById('search-input');
    const mobileToggle = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const headerActions = document.querySelector('.header-actions');

    const allCards = domainGrid ? Array.from(domainGrid.querySelectorAll('.domain-card')) : [];
    const allCategoryItems = categoryList ? Array.from(categoryList.querySelectorAll('li')) : [];

    // Mobile Category Toggle
    const mobileCategoryBtn = document.getElementById('mobile-category-toggle');
    if (mobileCategoryBtn && categoryList) {
        mobileCategoryBtn.addEventListener('click', () => {
            categoryList.classList.toggle('show');
            mobileCategoryBtn.classList.toggle('open');
        });
    }
    // ===================================================
    // 1. CATEGORY SIDEBAR FILTERING
    // ===================================================
    if (categoryList) {
        categoryList.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;

            // Update active state
            allCategoryItems.forEach(item => item.classList.remove('active'));
            li.classList.add('active');

            const selectedCategory = li.dataset.category;
            filterCards(selectedCategory, searchInput ? searchInput.value.trim() : '');

            // Extract the domain text
            let domainText = '';
            for (let node of li.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                    domainText = node.textContent.trim();
                    break;
                }
            }

            // Update the title to show the selected domain on mobile
            const sidebarTitle = document.querySelector('.sidebar-title');
            if (sidebarTitle) {
                for (let node of sidebarTitle.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                        node.textContent = ' ' + (selectedCategory === 'all' ? 'Domains' : domainText);
                        break;
                    }
                }
            }

            // Close the dropdown on mobile after selection
            if (window.innerWidth <= 960) {
                categoryList.classList.remove('show');
                if (mobileCategoryBtn) mobileCategoryBtn.classList.remove('open');
            }
        });
    }


    // ===================================================
    // 2. SEARCH FUNCTIONALITY
    // ===================================================
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const activeCategory = getActiveCategory();
                filterCards(activeCategory, searchInput.value.trim());
            }, 200);
        });
    }


    // ===================================================
    // 3. FILTER LOGIC
    // ===================================================
    function filterCards(category, searchTerm) {
        const term = searchTerm.toLowerCase();
        let visibleCount = 0;

        allCards.forEach((card, index) => {
            const cardCategory = card.dataset.category;
            const cardTitle = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const cardDesc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';

            const matchesCategory = (category === 'all' || cardCategory === category);
            const matchesSearch = !term || cardTitle.includes(term) || cardDesc.includes(term);

            if (matchesCategory && matchesSearch) {
                card.classList.remove('hidden');
                card.style.animationDelay = `${visibleCount * 0.05}s`;
                // Re-trigger animation
                card.style.animation = 'none';
                card.offsetHeight; // Force reflow
                card.style.animation = '';
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
    }

    function getActiveCategory() {
        const activeItem = categoryList?.querySelector('li.active');
        return activeItem ? activeItem.dataset.category : 'all';
    }


    // ===================================================
    // 4. MOBILE MENU TOGGLE
    // ===================================================
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mainNav) {
                mainNav.classList.toggle('active');
                mainNav.classList.toggle('show');
            }
        });
        document.addEventListener('click', (e) => {
            if (mainNav && (mainNav.classList.contains('active') || mainNav.classList.contains('show'))) {
                if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                    mainNav.classList.remove('active', 'show');
                }
            }
        });
    }


    // ===================================================
    // 5. CARD HOVER MICRO-INTERACTION (TILT)
    // ===================================================
    allCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = `translateY(-4px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    // ===================================================
    // 6. SMOOTH SCROLL FOR NAVIGATION LINKS
    // ===================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // ===================================================
    // 7. NAVBAR SCROLL SHADOW EFFECT
    // ===================================================
    const header = document.getElementById('site-header');
    if (header) {
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 10) {
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
            } else {
                header.style.boxShadow = '';
            }
            lastScrollY = scrollY;
        }, { passive: true });
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
