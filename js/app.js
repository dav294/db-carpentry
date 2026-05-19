/* ============================================================
   DB CARPENTRY — APP.JS
   GSAP + ScrollTrigger + Lenis
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── GSAP Plugin ──
  gsap.registerPlugin(ScrollTrigger);

  // ── Lenis smooth scroll ──
  const lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // Recalculate scroll positions after Lenis initialises
  requestAnimationFrame(() => ScrollTrigger.refresh());

  // ── Nav scroll state ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 55);
  }, { passive: true });

  // ── Hamburger / Mobile menu ──
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  function openMenu()  { mobileMenu.classList.add('open'); hamburger.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileMenu.classList.remove('open'); hamburger.classList.remove('open'); document.body.style.overflow = ''; }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));

  // ── Hero entrance ──
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' })
    .to('.hero-line',    { opacity: 1, y: 0, duration: 0.9,  stagger: 0.13, ease: 'power3.out' }, '-=0.3')
    .to('.hero-sub',     { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out' }, '-=0.35')
    .to('.hero-ctas',    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.25');

  // ── Trust bar ──
  gsap.from('.trust-item', {
    scrollTrigger: { trigger: '#trust-bar', start: 'top 90%' },
    opacity: 0, y: 14, duration: 0.5, stagger: 0.08, ease: 'power2.out',
  });

  // ── Helper: fade up ──
  function fadeUp(target, trigger, opts = {}) {
    gsap.from(target, {
      scrollTrigger: { trigger, start: 'top 78%', ...opts.st },
      opacity: 0,
      y: opts.y ?? 44,
      duration: opts.dur ?? 0.75,
      stagger: opts.stagger,
      ease: 'power3.out',
      ...opts.extra,
    });
  }

  // ── Services ──
  fadeUp('#services .section-header', '#services', { y: 28 });
  gsap.from('.service-card', {
    scrollTrigger: { trigger: '.services-grid', start: 'top 82%' },
    opacity: 0,
    y: 60,
    duration: 0.65,
    stagger: { amount: 0.55, from: 'start' },
    ease: 'power3.out',
  });

  // ── Stats count-up ──
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    ScrollTrigger.create({
      trigger: '#stats',
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          innerText: target,
          duration: 2.0,
          ease: 'power1.out',
          snap: { innerText: 1 },
        });
      },
    });
  });
  gsap.from('.stat-item', {
    scrollTrigger: { trigger: '#stats', start: 'top 80%' },
    opacity: 0, scale: 0.82, duration: 0.65, stagger: 0.1, ease: 'back.out(1.6)',
  });

  // ── Portfolio ──
  fadeUp('#portfolio .section-header', '#portfolio', { y: 24 });
  fadeUp('.portfolio-filters', '.portfolio-filters', { y: 16, dur: 0.5 });
  gsap.from('.port-item', {
    scrollTrigger: { trigger: '.portfolio-grid', start: 'top 90%', once: true },
    opacity: 0, y: 40, duration: 0.7,
    stagger: { amount: 0.5, from: 'start' },
    ease: 'power3.out',
    immediateRender: false,
  });
  gsap.from('.portfolio-cta', {
    scrollTrigger: { trigger: '.portfolio-cta', start: 'top 88%' },
    opacity: 0, y: 24, duration: 0.65, ease: 'power3.out',
  });

  // ── Portfolio filters ──
  const pfBtns   = document.querySelectorAll('.pf-btn');
  const portItems = document.querySelectorAll('.port-item');
  const portGrid  = document.getElementById('portfolio-grid');

  pfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const isFiltered = filter !== 'all';

      portItems.forEach(item => {
        const cat = item.getAttribute('data-cat');
        item.classList.toggle('hidden', isFiltered && cat !== filter);
      });

      // Switch to uniform grid when filtering to avoid empty fixed-height rows
      portGrid.classList.toggle('filtered', isFiltered);

      // Re-animate visible items
      gsap.from(portItems, {
        opacity: 0, y: 20, scale: 0.97,
        duration: 0.4, stagger: 0.06, ease: 'power2.out',
        clearProps: 'all',
      });
    });
  });

  // ── About ──
  gsap.from('.about-img-col', {
    scrollTrigger: { trigger: '#about', start: 'top 78%' },
    opacity: 0, x: -60, duration: 0.95, ease: 'power3.out',
  });
  gsap.from('.about-text-col > *', {
    scrollTrigger: { trigger: '#about', start: 'top 72%' },
    opacity: 0, y: 32, duration: 0.7, stagger: 0.09, ease: 'power3.out',
  });

  // ── Process — clip reveal ──
  gsap.from('.process-step', {
    scrollTrigger: { trigger: '.process-grid', start: 'top 80%' },
    opacity: 0,
    y: 48,
    scale: 0.97,
    duration: 0.7,
    stagger: { amount: 0.4, grid: [2, 2], from: 'start' },
    ease: 'power3.out',
  });

  // ── Testimonials ──
  gsap.from('.t-card', {
    scrollTrigger: { trigger: '#testimonials', start: 'top 82%' },
    opacity: 0, y: 50, rotation: 1.2, duration: 0.72, stagger: 0.18, ease: 'power3.out',
  });

  // ── Contact ──
  gsap.from('.contact-left > *', {
    scrollTrigger: { trigger: '#contact', start: 'top 78%' },
    opacity: 0, x: -44, duration: 0.8, stagger: 0.09, ease: 'power3.out',
  });
  gsap.from('.contact-right', {
    scrollTrigger: { trigger: '#contact', start: 'top 78%' },
    opacity: 0, x: 44, duration: 0.8, ease: 'power3.out',
  });

  // ── Footer ──
  fadeUp('.footer-brand, .footer-col', '#footer', { stagger: 0.1, y: 28 });

  // ── Smooth anchor clicks ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70, duration: 1.4 });
      }
    });
  });

  // ── Form submit ──
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-primary');
      const original = btn.textContent;
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#B8852A';
      form.querySelectorAll('input, textarea, select').forEach(el => (el.disabled = true));
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        form.querySelectorAll('input, textarea, select').forEach(el => (el.disabled = false));
        form.reset();
      }, 3500);
    });
  }

});
