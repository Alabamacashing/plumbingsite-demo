// ── MOBILE NAV TOGGLE ──
function toggleNav() {
  const nav = document.getElementById('mobileNav');
  if (!nav) return;
  const isOpen = nav.classList.toggle('open');
  document.querySelector('.hamburger')?.setAttribute('aria-expanded', String(isOpen));
}

// Close mobile nav when clicking outside
document.addEventListener('click', function (e) {
  const nav = document.getElementById('mobileNav');
  if (nav.classList.contains('open') && !e.target.closest('header')) {
    nav.classList.remove('open');
    document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');
  }
});

// ── SCROLL REVEALS ──
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.trust-item, .section-head, .service-card, .stats-row, .two-col > .col-text, .two-col > .col-img, .why-card, .testi-card, .contact-info, .contact-form, .footer-grid > *, .emergency > *'
  );
  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(function (element) {
    const siblings = Array.from(element.parentElement.children);
    const siblingIndex = siblings.indexOf(element);
    const column = element.closest('.two-col');
    let direction = siblingIndex % 2 === 0 ? 'left' : 'right';

    if (column && (element.matches('.col-text') || element.matches('.col-img'))) {
      const textComesFirst = !column.classList.contains('reverse');
      const textColumn = element.matches('.col-text');
      direction = textColumn === textComesFirst ? 'left' : 'right';
    } else if (element.matches('.section-head')) {
      direction = 'up';
    }

    element.style.setProperty('--reveal-delay', `${(siblingIndex % 4) * 70}ms`);
    element.classList.add(`reveal-from-${direction}`);
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
  document.body.classList.add('motion-ready');
}

// ── HERO CAROUSEL ──
const carousel = document.querySelector('.hero-carousel');
if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.hero-copy'));
  const backgrounds = Array.from(document.querySelectorAll('.hero-slide'));
  let activeSlide = 0;
  let timer;
  let focusPaused = false;

  function showSlide(index) {
    const previousSlide = activeSlide;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      const isActive = slideIndex === activeSlide;
      const isPrevious = slideIndex === previousSlide && !isActive;
      slide.classList.toggle('is-active', isActive);
      slide.classList.toggle('is-before', isPrevious);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.inert = !isActive;
    });
    backgrounds.forEach(function (background, slideIndex) {
      const isActive = slideIndex === activeSlide;
      const isPrevious = slideIndex === previousSlide && !isActive;
      background.classList.toggle('is-active', isActive);
      background.classList.toggle('is-before', isPrevious);
    });
  }

  function syncTimer() {
    window.clearInterval(timer);
    if (!prefersReducedMotion && !focusPaused && !document.hidden) {
      timer = window.setInterval(function () {
        showSlide(activeSlide + 1);
      }, 4500);
    }
  }

  carousel.addEventListener('focusin', function () {
    focusPaused = true;
    syncTimer();
  });
  carousel.addEventListener('focusout', function (event) {
    if (!carousel.contains(event.relatedTarget)) {
      focusPaused = false;
      syncTimer();
    }
  });
  document.addEventListener('visibilitychange', syncTimer);
  showSlide(0);
  syncTimer();
}

// ── CONTACT FORM SUBMIT ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const firstName = String(formData.get('firstName') || '');
    const lastName = String(formData.get('lastName') || '');
    const phone = String(formData.get('phone') || '');
    const email = String(formData.get('email') || '');
    const service = String(formData.get('service') || '');
    const problem = String(formData.get('problem') || '');
    const body = [
      `Name: ${firstName} ${lastName}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Service needed: ${service}`,
      '',
      'Problem details:',
      problem
    ].join('\n');
    const subject = `Plumbing quote request: ${service}`;
    window.location.href = `mailto:info@yourbusiness.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// ── SMOOTH SCROLL WITH HEADER OFFSET ──
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 120;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
