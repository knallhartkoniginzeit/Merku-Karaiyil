/* --------------------------------------------------------------------------
   GLOBAL SCROLL FADE IN OBSERVER
   -------------------------------------------------------------------------- */
(function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in-observer').forEach(el => observer.observe(el));
})();

/* --------------------------------------------------------------------------
   STICKY HEADER — button clicks + active-section tracking
   The active item is the section whose bounding box covers the viewport
   midpoint (the part of the page the user is actually looking at), so the
   highlight switches exactly when a new section takes over the screen.
   -------------------------------------------------------------------------- */
(function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  const buttons = header && header.querySelectorAll('.header-btn');
  if (!header || !buttons) return;

  const sectionIds = ['section-landing', 'section-logline', 'section-synopsis',
    'section-characters', 'section-moodboard', 'section-colorpalette',
    'section-locations', 'section-soundtrack', 'section-director',
    'section-contact'];

  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-target');
      scrollTo(id);
    });
  });

  function setActive(id) {
    buttons.forEach(btn => {
      const on = btn.getAttribute('data-target') === id;
      btn.classList.toggle('active', on);
      if (on) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
  }

  let current = null;

  function onScroll() {
    // The viewport midpoint decides which section is "currently viewed".
    const mid = window.innerHeight * 0.5;
    let active = sections.length ? sections[0].id : null;

    for (const el of sections) {
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { active = el.id; break; }
    }

    if (active !== current) {
      current = active;
      setActive(current);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();
