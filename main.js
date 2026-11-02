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
    '.trust-item, .section-head, .service-card, .stats-row, .two-col, .why-card, .testi-card, .contact-info, .contact-form, .footer-grid > *'
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
    element.style.setProperty('--reveal-delay', `${(siblingIndex % 4) * 90}ms`);
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
  const dots = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
  const pauseButton = carousel.querySelector('[data-carousel-pause]');
  let activeSlide = 0;
  let timer;
  let userPaused = prefersReducedMotion;
  let interactionPaused = false;

  function showSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    backgrounds.forEach(function (background, slideIndex) {
      background.classList.toggle('is-active', slideIndex === activeSlide);
    });
    dots.forEach(function (dot, slideIndex) {
      const isActive = slideIndex === activeSlide;
      dot.classList.toggle('is-active', isActive);
      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  function syncTimer() {
    window.clearInterval(timer);
    if (!userPaused && !interactionPaused && !document.hidden) {
      timer = window.setInterval(function () {
        showSlide(activeSlide + 1);
      }, 6500);
    }
    if (pauseButton) {
      const paused = userPaused;
      pauseButton.setAttribute('aria-label', paused ? 'Start slide rotation' : 'Pause slide rotation');
      pauseButton.innerHTML = paused
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7z"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM15 5h3v14h-3z"/></svg>';
    }
  }

  carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', function () {
    showSlide(activeSlide - 1);
    syncTimer();
  });
  carousel.querySelector('[data-carousel-next]')?.addEventListener('click', function () {
    showSlide(activeSlide + 1);
    syncTimer();
  });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.dataset.carouselSlide));
      syncTimer();
    });
  });
  pauseButton?.addEventListener('click', function () {
    userPaused = !userPaused;
    syncTimer();
  });
  carousel.addEventListener('pointerenter', function () {
    interactionPaused = true;
    syncTimer();
  });
  carousel.addEventListener('pointerleave', function () {
    interactionPaused = carousel.contains(document.activeElement);
    syncTimer();
  });
  carousel.addEventListener('focusin', function () {
    userPaused = true;
    interactionPaused = true;
    syncTimer();
  });
  carousel.addEventListener('focusout', function (event) {
    if (!carousel.contains(event.relatedTarget)) {
      interactionPaused = carousel.matches(':hover');
      syncTimer();
    }
  });
  carousel.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(activeSlide + (event.key === 'ArrowRight' ? 1 : -1));
      syncTimer();
    }
  });
  document.addEventListener('visibilitychange', syncTimer);
  showSlide(0);
  document.body.classList.add('carousel-ready');
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
