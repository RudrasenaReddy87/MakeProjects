(() => {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
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
