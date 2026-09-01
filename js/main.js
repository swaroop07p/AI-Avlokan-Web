document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFAQ();
  initContactForm();

  // Conditionally init stuff if elements exist
  if (document.getElementById('countdown-grid')) initCountdown();
  if (document.getElementById('stats-section')) initStatsCounter();

  // Render content if containers exist
  if (typeof renderEvents === 'function') {
    renderEvents('featured-event-container', true); // Homepage featured
    renderEvents('all-events-container', false); // Events page
  }

  if (typeof renderTeam === 'function') {
    renderTeam('team-preview-container', null, true); // Homepage top 7
    renderTeam('faculty-team-container', 'faculty'); // Team page faculty
    renderTeam('student-team-container', 'student'); // Team page student
  }

  // Initialize scroll reveal AFTER dynamic elements are inserted
  initScrollReveal();

  // Initialize Back to Top button
  initBackToTop();

  // Loading screen logic
  const loader = document.getElementById('loader');
  if (loader) {
    if (!sessionStorage.getItem('siteLoaded')) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
        sessionStorage.setItem('siteLoaded', 'true');
      }, 800);
    } else {
      loader.remove();
    }
  }
});

/* --- Navbar Logic --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const scrollProgress = document.getElementById('scroll-progress');

  if (!navbar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Sticky nav style
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Scroll progress bar
        if (scrollProgress) {
          const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = (winScroll / height) * 100;
          scrollProgress.style.width = scrolled + "%";
        }

        lastScrollY = window.scrollY;
        ticking = false;
      });
      ticking = true;
    }
  });

  if (menuToggle && navLinks) {
    const burgerWrap = document.querySelector('.burger-wrap');

    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      if (burgerWrap) burgerWrap.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        if (burgerWrap) burgerWrap.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* --- Scroll Reveal Logic --- */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Only trigger once
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --- Countdown Logic --- */
function initCountdown() {
  const eventDate = new Date('2026-09-29T08:00:00').getTime();
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  const gridContainer = document.getElementById('countdown-grid');
  const messageContainer = document.getElementById('countdown-message');

  function update() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      // Event has passed or is happening
      const endOfDay = new Date('2026-09-30T00:00:00').getTime();
      gridContainer.style.display = 'none';
      messageContainer.style.display = 'block';

      if (now <= endOfDay) {
        messageContainer.innerHTML = `
          <div class="status-card live">
            <div class="status-indicator">
              <span class="pulse-dot"></span>
              <span class="status-text">HAPPENING NOW</span>
            </div>
            <h2 class="status-title">AI Avlokan is Live!</h2>
            <p class="status-date">Join the action today, 25 September 2026</p>
          </div>
        `;
      } else {
        messageContainer.innerHTML = `
          <div class="status-card concluded">
            <div class="status-indicator">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span class="status-text">EVENT CONCLUDED</span>
            </div>
            <h2 class="status-title">Thank You For Joining!</h2>
            <p class="status-date">25 September 2026 &bull; JNNCE Shivamogga</p>
            <p class="status-subtitle mt-2">See you next year for an even bigger adventure.</p>
          </div>
        `;
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    function updateFlip(el, valStr) {
      if (!el) return;
      if (el.textContent !== valStr) {
        el.textContent = valStr;
        el.classList.remove('flip-anim');
        void el.offsetWidth; // trigger reflow
        el.classList.add('flip-anim');
      }
    }

    updateFlip(daysEl, days.toString().padStart(2, '0'));
    updateFlip(hoursEl, hours.toString().padStart(2, '0'));
    updateFlip(minsEl, minutes.toString().padStart(2, '0'));
    updateFlip(secsEl, seconds.toString().padStart(2, '0'));
  }

  update();
  setInterval(update, 1000);
}

/* --- Stats Counter Logic --- */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        let start = 0;
        const duration = 1200; // ms
        let startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeOut * target);

          el.textContent = prefix + current.toLocaleString() + suffix;

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            el.textContent = prefix + target.toLocaleString() + suffix;
          }
        }
        window.requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

/* --- FAQ Accordion Logic --- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => other.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* --- Contact Form Logic --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const query = document.getElementById('contact-query').value.trim();

    if (!name || !email || !query) return;

    const TARGET_EMAIL = "hod_aiml@jnnce.ac.in";
    const subject = encodeURIComponent(`AI AVLOKAN 2k26 — Query from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nQuery:\n${query}`);

    window.location.href = `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;

    // Show confirmation
    const btn = form.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Opening email app...';
    btn.classList.add('success');

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('success');
      form.reset();
    }, 3000);
  });
}

/* --- Back to Top Logic --- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
