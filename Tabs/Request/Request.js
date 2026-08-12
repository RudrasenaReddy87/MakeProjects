/* Request Page — JavaScript */
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }, { passive: true });
    }

    const form = document.getElementById('request-form');
    const formGrid = document.querySelector('.form-grid');
    const successMsg = document.getElementById('success-message');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const domain = document.getElementById('domain').options[document.getElementById('domain').selectedIndex].text;
            const requestType = document.getElementById('request-type').options[document.getElementById('request-type').selectedIndex].text;
            const details = document.getElementById('details').value.trim();
            const timeline = document.getElementById('timeline').value.trim();

            // Format message for WhatsApp
            let message = `*New Custom Project Request*%0A%0A`;
            message += `*Name:* ${name}%0A`;
            message += `*Email:* ${email}%0A`;
            if (phone) message += `*Phone:* ${phone}%0A`;
            message += `*Domain:* ${domain}%0A`;
            message += `*Request Type:* ${requestType}%0A`;
            if (timeline) message += `*Timeline:* ${timeline}%0A`;
            message += `%0A*Project Details:*%0A${encodeURIComponent(details)}`;

            const whatsappNumber = "919014971034";
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

            // Update button UX
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Redirecting to WhatsApp...';
            btn.disabled = true;

            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                formGrid.style.display = 'none';
                btn.style.display = 'none';
                successMsg.classList.add('show');
            }, 800);
        });
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
