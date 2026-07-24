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

            const whatsappNumber = "917780401166";
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
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('show');
        });
    }

});
