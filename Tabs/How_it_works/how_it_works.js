/* How It Works — JavaScript */
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll shadow
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }, { passive: true });
    }

    // Step cards — reveal on scroll
    const stepCards = document.querySelectorAll('.step-card');
    if (stepCards.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 120);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        stepCards.forEach(card => observer.observe(card));
    } else {
        stepCards.forEach(c => c.classList.add('visible'));
    }

    // Mobile menu toggle
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

    // Sidebar Category Toggle (Mobile)
    const categoryToggleBtn = document.getElementById('mobile-category-toggle');
    const categoryList = document.getElementById('category-list');
    
    if (categoryToggleBtn && categoryList) {
        categoryToggleBtn.addEventListener('click', () => {
            categoryList.classList.toggle('show');
            const isShowing = categoryList.classList.contains('show');
            categoryToggleBtn.innerHTML = isShowing ? 'Sections ▲' : 'Sections ▼';
        });
    }

    // Smooth Scrolling & Active State for Sidebar
    const domainLinks = document.querySelectorAll('.domain-link');
    const sections = document.querySelectorAll('.main-content section');

    domainLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Update active class manually (optional, observer does this too)
                domainLinks.forEach(l => {
                    l.classList.remove('active');
                    l.style.borderLeftColor = 'transparent';
                    l.style.background = 'transparent';
                    l.style.color = 'var(--text-body)';
                });
                this.classList.add('active');
                this.style.borderLeftColor = 'var(--primary)';
                this.style.background = 'rgba(14,165,233,0.1)';
                this.style.color = 'var(--primary-light)';

                // Close mobile sidebar after click
                if (window.innerWidth <= 960 && categoryList) {
                    categoryList.classList.remove('show');
                    categoryToggleBtn.innerHTML = 'Sections ▼';
                }
            }
        });
    });

    // Intersection Observer for Active Sidebar Links
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.domain-link[href="#${id}"]`);
                    
                    if (activeLink) {
                        domainLinks.forEach(l => {
                            l.classList.remove('active');
                            l.style.borderLeftColor = 'transparent';
                            l.style.background = 'transparent';
                            l.style.color = 'var(--text-body)';
                        });
                        activeLink.classList.add('active');
                        activeLink.style.borderLeftColor = 'var(--primary)';
                        activeLink.style.background = 'rgba(14,165,233,0.1)';
                        activeLink.style.color = 'var(--primary-light)';
                    }
                }
            });
        }, { rootMargin: '-20% 0px -80% 0px' });

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    // General Reveal on Scroll (For all pages eventually)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length && 'IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger the reveal if multiple appear at once
                    setTimeout(() => entry.target.classList.add('reveal-visible'), i * 100);
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObs.observe(el));
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
