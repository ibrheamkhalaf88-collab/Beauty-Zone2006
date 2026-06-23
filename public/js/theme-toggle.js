/* Theme toggle: switches luxurious theme by toggling `body.luxury` */
(function(){
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function apply(mode){
    if (mode === 'luxury') document.body.classList.add('luxury');
    else document.body.classList.remove('luxury');
    btn.setAttribute('aria-pressed', document.body.classList.contains('luxury'));
  }

  const stored = localStorage.getItem('bz_theme') || 'default';
  apply(stored);

  btn.addEventListener('click', () => {
    const isLuxury = document.body.classList.toggle('luxury');
    btn.setAttribute('aria-pressed', isLuxury);
    localStorage.setItem('bz_theme', isLuxury ? 'luxury' : 'default');
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(btn, { scale: 1.12 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1,0.5)' });
    }
  });
})();
