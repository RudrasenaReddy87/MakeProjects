(() => {
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

  // Add sidebar to top bar on mobile and larger screens
  function addSidebarToTop() {
    const sidebar = document.getElementById('sidebar');
    const topBarNav = document.querySelector('.header-content .main-nav');

    if (sidebar && topBarNav && window.innerWidth <= 1024) {
      // Create a copy of the sidebar links
      const sidebarLinks = Array.from(sidebar.querySelectorAll('.category-list li'));
      const navList = topBarNav.querySelector('ul');

      // Create a new category list in the top bar
      const topCategories = document.createElement('ul');
      topCategories.className = 'top-categories-list';

      sidebarLinks.forEach(link => {
        const clone = link.cloneNode(true);
        // Remove the dots/counts from the top bar version
        const dot = clone.querySelector('.cat-dot');
        const count = clone.querySelector('.cat-count');
        if (dot) dot.remove();
        if (count) count.remove();
        topCategories.appendChild(clone);
      });

      // Add the new categories to the top bar
      navList.appendChild(topCategories);

      // Hide the sidebar (it's now in the top bar)
      sidebar.style.display = 'none';
    }
  }

  // Call the function on page load and resize
  window.addEventListener('DOMContentLoaded', addSidebarToTop);
  window.addEventListener('resize', addSidebarToTop);

  // Tabs logic (only runs if tabs exist on the page)
  const tabsRoot = document.querySelector('.tabs[role="tablist"]');
  if (tabsRoot) {
    const tabs = Array.from(tabsRoot.querySelectorAll('.tab[role="tab"]'));
    const panels = tabs
      .map((t) => document.getElementById(t.getAttribute('aria-controls')))
      .filter(Boolean);

    function setActiveTab(nextTab) {
      if (!nextTab) return;

      tabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        if (selected) {
          tab.removeAttribute('tabindex');
        } else {
          tab.setAttribute('tabindex', '-1');
        }
      });

      panels.forEach((panel) => {
        if (!panel) return;
        panel.hidden = true;
      });

      const panelId = nextTab.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.hidden = false;
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => setActiveTab(tab));
      tab.addEventListener('keydown', (e) => {
        const key = e.key;
        const idx = tabs.indexOf(tab);

        if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'Home' || key === 'End') {
          e.preventDefault();
        } else {
          return;
        }

        let nextIndex = idx;
        if (key === 'ArrowRight') nextIndex = (idx + 1) % tabs.length;
        if (key === 'ArrowLeft') nextIndex = (idx - 1 + tabs.length) % tabs.length;
        if (key === 'Home') nextIndex = 0;
        if (key === 'End') nextIndex = tabs.length - 1;

        const nextTab = tabs[nextIndex];
        if (nextTab) {
          nextTab.focus();
          setActiveTab(nextTab);
        }
      });
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Scroll Reveal Animations
  const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
  const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
          }
      });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.path-card');
  animatedElements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 0.15}s`;
      scrollObserver.observe(el);
  });

  // Typing Effect for Hero Graphic
  const codeElement = document.getElementById('typing-code');
  if (codeElement) {
    const codeSnippets = [
      "// Future Developer\nif (dream === big) {\n  start_small();\n  keep_going();\n  never_give_up();\n}",
      "while (alive) {\n  learn();\n  build();\n  grow();\n}\n// Success is a journey",
      "import brain\n\ndef achieve_goals():\n    focus = True\n    while focus:\n        execute_plan()\n        celebrate_wins()\n\nachieve_goals()",
      "const MakeProjects = {\n  status: 'Ready',\n  mission: 'Empower Students',\n  action: () => {\n    console.log('Let\\'s build!');\n  }\n};\nMakeProjects.action();",
      "def solve(problem):\n  if difficult:\n    break_it_down()\n  else:\n    just_do_it()\n  return success",
      "try {\n  take_risks();\n} catch (Failure) {\n  learn_lesson();\n} finally {\n  keep_pushing();\n}",
      "const mindset = new Mindset('Growth');\nmindset.on('challenge', (error) => {\n  return Opportunity.from(error);\n});",
      "SELECT * \nFROM Opportunities \nWHERE Hard_Work = True \nORDER BY Success DESC;",
      "if (!success) {\n  coffee.drink();\n  code.refactor();\n  try_again();\n}\n// Debugging life",
      "class FutureCoder {\n  constructor(passion) {\n    this.skills = [];\n    this.fuel = passion;\n  }\n  build(project) {\n    this.skills.push(project.learnings);\n  }\n}"
    ];
    
    let snippetIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 50;
    
    function typeCode() {
      const currentSnippet = codeSnippets[snippetIndex];
      
      if (isDeleting) {
        codeElement.textContent = currentSnippet.substring(0, charIndex - 1);
        charIndex -= 2; // Delete faster
        if (charIndex < 0) charIndex = 0;
        typingSpeed = 10;
      } else {
        codeElement.textContent = currentSnippet.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = Math.random() * 40 + 20; // Random human-like typing speed
      }
      
      if (!isDeleting && charIndex === currentSnippet.length) {
        isDeleting = true;
        typingSpeed = 4000; // Pause when finished typing
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        snippetIndex = (snippetIndex + 1) % codeSnippets.length;
        typingSpeed = 800; // Pause before new snippet
      }
      
      setTimeout(typeCode, typingSpeed);
    }
    
    // Start typing effect after 1 second
    setTimeout(typeCode, 1000);
  }

  // Live Date and Time for Graphic Header
  function updateLiveTime() {
    const timeEl = document.getElementById('live-datetime');
    if (!timeEl) return;
    
    const now = new Date();
    const dateOpts = { weekday: 'short', month: 'short', day: 'numeric' };
    const timeOpts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    
    const dateStr = now.toLocaleDateString('en-US', dateOpts);
    const timeStr = now.toLocaleTimeString('en-US', timeOpts);
    
    timeEl.textContent = `${dateStr} ${timeStr}`;
  }
  
  // Update time immediately and then every second
  updateLiveTime();
  setInterval(updateLiveTime, 1000);
})();


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
    const SELECTORS = ['.stat-item', '.path-card', '.about-brief-item', '.project-card', '.glass-panel'];

    function updateBubble(e) {
        const el   = e.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%');
        el.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
    }

    function resetBubble(e) {
        e.currentTarget.style.setProperty('--mx', '50%');
        e.currentTarget.style.setProperty('--my', '50%');
    }

    function addRipple(e) {
        const el   = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 0.6;
        const ring = document.createElement('span');
        ring.className = 'ripple-ring';
        ring.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
        el.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove(), { once: true });
    }

    function attachToElements() {
        SELECTORS.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el.dataset.bubbleAttached) return;
                el.dataset.bubbleAttached = '1';
                el.style.setProperty('--mx', '50%');
                el.style.setProperty('--my', '50%');
                el.addEventListener('mousemove',  updateBubble);
                el.addEventListener('mouseleave', resetBubble);
                el.addEventListener('click',      addRipple);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', attachToElements);
    const cardObserver = new MutationObserver(attachToElements);
    document.addEventListener('DOMContentLoaded', () => {
        const root = document.getElementById('projects-grid') || document.body;
        cardObserver.observe(root, { childList: true, subtree: true });
    });
})();
