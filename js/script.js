(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Theme toggle (persisted in localStorage, respects system default)
     ------------------------------------------------------------------ */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });

  /* ------------------------------------------------------------------
     Mobile nav toggle
     ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------------
     Navbar background on scroll
     ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ------------------------------------------------------------------
     Back-to-top button
     ------------------------------------------------------------------ */
  const backToTop = document.getElementById('backToTop');
  function handleBackToTop() {
    backToTop.classList.toggle('show', window.scrollY > 400);
  }
  handleBackToTop();
  window.addEventListener('scroll', handleBackToTop, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------
     Scroll-reveal animations
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ------------------------------------------------------------------
     Active nav-link highlighting based on section in view
     ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(function (anchor) {
            anchor.classList.toggle('active', anchor.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ------------------------------------------------------------------
     Typing effect for hero role
     ------------------------------------------------------------------ */
  const typedEl = document.getElementById('typedRole');
  const roles = ['Software Engineer', 'Full-Stack Developer', 'Angular & Node.js Developer', 'ERP & SaaS Builder'];
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typedEl.textContent = currentRole.slice(0, charIndex);

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeLoop, delay);
  }

  if (typedEl) {
    setTimeout(typeLoop, 1800);
  }

  /* ------------------------------------------------------------------
     Project filtering
     ------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (btn) {
        btn.classList.remove('active');
      });
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      projectCards.forEach(function (card) {
        const matches = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden', !matches);
      });
    });
  });

  /* ------------------------------------------------------------------
     Contact form (client-side only — wire up a backend/service later)
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        formStatus.textContent = 'Please fill in all fields with a valid email address.';
        formStatus.className = 'form-status error';
        return;
      }

      formStatus.textContent = "Thanks for reaching out! I'll get back to you soon.";
      formStatus.className = 'form-status success';
      contactForm.reset();
    });
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
