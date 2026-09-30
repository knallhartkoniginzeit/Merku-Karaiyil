/* --------------------------------------------------------------------------
   SECTION 1: LANDING PARTICLES
   -------------------------------------------------------------------------- */
(function initLandingParticles() {
  const container = document.getElementById('particleCanvas');
  if (!container) return;

  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() < 0.65 ? 1 : 2;
    
    Object.assign(p.style, {
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 15}%`,
      '--dx': `${(Math.random() - 0.5) * 120}px`,
      width: `${size}px`,
      height: `${size}px`,
      animationDuration: `${9 + Math.random() * 13}s`,
      animationDelay: `${Math.random() * 12}s`,
    });
    container.appendChild(p);
  }
})();
