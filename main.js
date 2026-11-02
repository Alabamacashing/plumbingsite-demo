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
