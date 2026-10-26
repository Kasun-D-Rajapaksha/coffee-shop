(function () {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMobile = document.querySelector(".nav-mobile");
  const mobileLinks = navMobile?.querySelectorAll("a");
  const scrollProgress = document.querySelector(".scroll-progress");
  const backToTop = document.querySelector(".back-to-top");
  const darkModeToggle = document.querySelector(".dark-mode-toggle");

  function closeMobileNav() {
    navToggle?.setAttribute("aria-expanded", "false");
    navMobile?.classList.remove("open");
    document.body.style.overflow = "";
  }

  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    navMobile?.classList.toggle("open", !open);
    document.body.style.overflow = open ? "" : "hidden";
  });

  mobileLinks?.forEach((link) => link.addEventListener("click", closeMobileNav));

  // Scroll progress and back-to-top
  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 24);
    
    // Update scroll progress
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? winScroll / height : 0;
    if (scrollProgress) {
      scrollProgress.style.transform = `scaleX(${scrolled})`;
    }
    
    // Show/hide back-to-top
    const heroHeight = window.innerHeight;
    backToTop?.classList.toggle("visible", window.scrollY > heroHeight);
  });

  // Back to top click
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Dark mode toggle
  function initDarkMode() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
    
    updateDarkModeLabel();
  }

  function updateDarkModeLabel() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    darkModeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  darkModeToggle?.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    if (newTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    
    localStorage.setItem("theme", newTheme);
    updateDarkModeLabel();
  });

  initDarkMode();

  // Intersection Observer for reveals
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => observer.observe(el));

  // Menu tabs with sliding pill indicator
  const tabs = document.querySelectorAll(".menu-tab");
  const categories = document.querySelectorAll(".menu-category");
  const tabsContainer = document.querySelector(".menu-tabs");

  function updatePillPosition() {
    const activeTab = document.querySelector(".menu-tab.active");
    if (activeTab && tabsContainer) {
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = tabsContainer.getBoundingClientRect();
      const left = tabRect.left - containerRect.left;
      
      tabsContainer.style.setProperty("--pill-width", `${tabRect.width}px`);
      tabsContainer.style.setProperty("--pill-x", `${left}px`);
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.category;
      tabs.forEach((t) => {
        const selected = t === tab;
        t.classList.toggle("active", selected);
        t.setAttribute("aria-selected", String(selected));
      });
      categories.forEach((cat) => {
        const show = cat.dataset.category === target;
        cat.classList.toggle("active", show);
        if (show) cat.removeAttribute("hidden");
        else cat.setAttribute("hidden", "");
      });
      
      updatePillPosition();
    });
  });

  // Initialize pill position
  updatePillPosition();
  window.addEventListener("resize", updatePillPosition);

  // Image blur-up loading
  const images = document.querySelectorAll(".menu-card-image img, .about-image img");
  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.classList.add("loading");
      img.addEventListener("load", () => {
        img.classList.remove("loading");
        img.classList.add("loaded");
      });
    }
  });

  function scrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const navHeight =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, left: 0, behavior: "instant" in window ? "instant" : "auto" });
    history.replaceState(null, "", targetId);
  }

  // View Transitions API for in-page nav (header stays out of root fade)
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#" || !document.querySelector(targetId)) return;

      e.preventDefault();
      closeMobileNav();

      if (document.startViewTransition) {
        document.startViewTransition(() => scrollToSection(targetId));
      } else {
        scrollToSection(targetId);
      }
    });
  });

  // Highlight current open hours
  function highlightOpenHours() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    
    const rows = document.querySelectorAll(".hours-row");
    rows.forEach((row, index) => {
      const daySpan = row.querySelector(".hours-day");
      if (!daySpan) return;
      
      const dayText = daySpan.textContent.toLowerCase();
      let isOpen = false;
      
      // Check if current day/time matches
      if (dayText.includes("monday") && dayText.includes("friday")) {
        if (day >= 1 && day <= 5 && hour >= 7 && hour < 20) {
          isOpen = true;
        }
      } else if (dayText.includes("saturday") && day === 6 && hour >= 8 && hour < 21) {
        isOpen = true;
      } else if (dayText.includes("sunday") && day === 0 && hour >= 8 && hour < 18) {
        isOpen = true;
      }
      
      if (isOpen) {
        row.classList.add("open-now");
      }
    });
  }

  highlightOpenHours();
})();
