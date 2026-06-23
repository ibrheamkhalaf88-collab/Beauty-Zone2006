/* ════════════════════════════════════════════════
   GLOW MAIN JS — All animations, interactions, UI
   ════════════════════════════════════════════════ */
'use strict';

// ── Wait for DOM ──────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

  // Wait for product cache to load from server
  if (window.DB && DB._initPromise) { try { await DB._initPromise; } catch(e) {} }

  try { gsap.registerPlugin(ScrollTrigger, MotionPathPlugin); } catch(e) {}

  // ══════════════════════════════════════════════
  // 0. AMBIENT SOUND — Enable on user interaction
  // ══════════════════════════════════════════════

  // ══════════════════════════════════════════════
  // 1. IMPROVED CUSTOM CURSOR
  // ══════════════════════════════════════════════
  // ── Cursor ──────────────────────────────────────
  let mouse = { x: -100, y: -100 };
  let ring  = { x: -100, y: -100 };
  let isMoving = false;
  let isMovingTimer = null;
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    isMoving = true;
    clearTimeout(isMovingTimer);
    isMovingTimer = setTimeout(() => { isMoving = false; }, 100);
    // Initial reveal
    if (cursorDot.style.opacity !== '1') {
      cursorDot.style.opacity = '1'; 
      cursorRing.style.opacity = '1';
    }
  }, { passive: true });

  // ── Apply saved button color ────────────────────
  (function applyBtnColor() {
    const hex = localStorage.getItem('bz_btn_color');
    if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    function shade(h, pct) {
      let r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
      r = Math.max(0,Math.min(255,r+Math.round(r*pct/100)));
      g = Math.max(0,Math.min(255,g+Math.round(g*pct/100)));
      b = Math.max(0,Math.min(255,b+Math.round(b*pct/100)));
      return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
    }
    document.documentElement.style.setProperty('--btn-color', hex);
    document.documentElement.style.setProperty('--btn-shadow-color', shade(hex, -35));
  })();

  // ── Hero Data Integration ───────────────────────
  const heroConfig = DB.getHeroConfig();
  if (heroConfig) {
    const badge = document.querySelector('.hero-badge .badge-text');
    const head  = document.getElementById('hero-headline');
    const cta1  = document.getElementById('hero-cta-1');
    const cta2  = document.getElementById('hero-cta-2');
    if (badge) badge.textContent = heroConfig.badge;
    if (head)  head.textContent  = heroConfig.headline;
    if (cta1)  cta1.firstChild.textContent = heroConfig.cta1;
    if (cta2)  cta2.textContent = heroConfig.cta2;
  }

  // ── Social Links ───────────────────────────────
  (function loadSocialLinks() {
    const s = DB.getSocialLinks();
    const igBtn = document.getElementById('social-instagram');
    const fbBtn = document.getElementById('social-facebook');
    const waBtn = document.getElementById('social-whatsapp');
    if (igBtn) { if (s.instagram) { igBtn.href = s.instagram; igBtn.style.display = ''; } else { igBtn.style.display = 'none'; } }
    if (fbBtn) { if (s.facebook)  { fbBtn.href = s.facebook;  fbBtn.style.display = ''; } else { fbBtn.style.display = 'none'; } }
    if (waBtn && s.whatsapp)  {
      waBtn.href = 'https://wa.me/' + s.whatsapp.replace(/\D/g, '');
    }
    // Also update floating WhatsApp button
    const waFloat = document.querySelector('.whatsapp-float');
    if (waFloat && s.whatsapp) waFloat.href = 'https://wa.me/' + s.whatsapp.replace(/\D/g, '');
    // Update footer WhatsApp text link
    const waText = document.querySelector('a[href^="https://wa.me/"]');
    if (waText && s.whatsapp) waText.href = 'https://wa.me/' + s.whatsapp.replace(/\D/g, '');
  })();

  // ── Toast Notification ─────────────────────────
  let toastTimer = null;
  function showToast(msg, duration = 3000) {
    let toast = document.getElementById('bz-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'bz-toast';
      toast.className = 'custom-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, duration);
  }

  function updateParallax() {
    if (!isMoving) return;
    const px = (mouse.x / window.innerWidth - 0.5) * 60;
    const py = (mouse.y / window.innerHeight - 0.5) * 60;
    
    gsap.set('.blob-c', { x: px * 0.3, y: py * 1.2 });
    gsap.set('.blob-d', { x: -px * 1.5, y: py * 0.4 });

    // 3D Tilt for Hero Text
    gsap.to('.hero-headline', { rotationY: px * 0.1, rotationX: -py * 0.1, duration: 0.5 });
    gsap.to('.hero-subline', { rotationY: px * 0.05, rotationX: -py * 0.05, duration: 0.5 });
  }

  gsap.ticker.add(() => {
    // Smoothed Ring Movement
    ring.x += (mouse.x - ring.x) * 0.15;
    ring.y += (mouse.y - ring.y) * 0.15;

    // Update Visuals
    gsap.set(cursorDot,  { x: mouse.x, y: mouse.y });
    gsap.set(cursorRing, { x: ring.x, y: ring.y });
    
    updateParallax();
    updateSpotlight();
  });

  let _spotlightMoved = false;
  window.addEventListener('mousemove', () => { _spotlightMoved = true; }, { passive: true });

  function updateSpotlight() {
    if (!_spotlightMoved) return;
    _spotlightMoved = false;
    const heroBg = document.getElementById('hero-bg');
    if (!heroBg) return;
    const x = (mouse.x / window.innerWidth) * 100;
    const y = (mouse.y / window.innerHeight) * 100;
    heroBg.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(245,230,211,0.18) 0%, transparent 60%)`;
  }

  // Click Sparkles
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousedown', e => {
      createSparkleBurst(e.clientX, e.clientY);
    });
  }

  function createSparkleBurst(x, y) {
    for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-particle';
      sparkle.innerHTML = '✦';
      sparkle.style.position = 'fixed';
      sparkle.style.left = x + 'px';
      sparkle.style.top = y + 'px';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.color = ['#C9A84C', '#E8A4B8', '#fff'][Math.floor(Math.random()*3)];
      document.body.appendChild(sparkle);
      
      const angle = Math.random() * Math.PI * 2;
      const dist  = 60 + Math.random() * 100;
      
      gsap.to(sparkle, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        scale: 0,
        opacity: 0,
        rotation: Math.random() * 360,
        duration: 0.8 + Math.random() * 0.6,
        ease: 'power2.out',
        onComplete: () => sparkle.remove()
      });
    }
  }

  function cursorHoverIn() {
    gsap.to(cursorRing, { scale: 1.8, borderColor: '#C9A84C', backgroundColor: 'rgba(201,168,76,0.1)', duration: 0.3 });
    gsap.to(cursorDot,  { scale: 0.5, backgroundColor: '#C9A84C', duration: 0.2 });
  }
  function cursorHoverOut() {
    gsap.to(cursorRing, { scale: 1, borderColor: '#E8A4B8', backgroundColor: 'transparent', duration: 0.3 });
    gsap.to(cursorDot,  { scale: 1, backgroundColor: '#E8A4B8', duration: 0.2 });
  }

  function attachCursorToEl(el) {
    if (!el) return;
    el.addEventListener('mouseenter', cursorHoverIn);
    el.addEventListener('mouseleave', cursorHoverOut);
  }

  // ══════════════════════════════════════════════
  // 2. NAVBAR SCROLL BEHAVIOUR
  // ══════════════════════════════════════════════
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Mobile hamburger
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // ══════════════════════════════════════════════
  // 3. THREE.JS HERO PARTICLES
  // ══════════════════════════════════════════════
  (function initThreeHero() {
    const canvas = document.getElementById('hero-canvas');
    const heroEl = document.getElementById('hero');
    if (!canvas || !heroEl || typeof THREE === 'undefined') return;

    let W = heroEl.clientWidth;
    let H = heroEl.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 2000);
    camera.position.z = 700;

    const COLORS = [0xC9A84C, 0xE8A4B8, 0xFDE9C4];
    const COUNT  = 80; // Reduced from 200

    const particles = [];
    for (let i = 0; i < COUNT; i++) {
      const geo = new THREE.SphereGeometry(Math.random() * 1.5 + 0.3, 6, 6);
      const mat = new THREE.MeshBasicMaterial({ 
        color: COLORS[Math.floor(Math.random() * COLORS.length)], 
        transparent: true, 
        opacity: 0.35 + Math.random() * 0.45 
      });
      const mesh = new THREE.Mesh(geo, mat);
      
      mesh.position.set((Math.random() - 0.5) * 1200, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 600);
      mesh.userData.vx = (Math.random() - 0.5) * 0.5;
      mesh.userData.vy = (Math.random() - 0.5) * 0.5;
      mesh.userData.phase = Math.random() * Math.PI * 2;
      
      scene.add(mesh);
      particles.push(mesh);
    }

    // Restore "Connected Threads" System
    const MAX_CONN = 200; // Reduced from 600
    const lineGeo  = new THREE.BufferGeometry();
    const linePos  = new Float32Array(MAX_CONN * 2 * 3);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    const lineMat  = new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.28 });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    const clock = new THREE.Clock();
    let mouseNDC = { x: 0, y: 0 };
    let targetCamZ = 700;

    window.addEventListener('mousemove', e => {
      mouseNDC.x = (e.clientX / window.innerWidth - 0.5) * 1200;
      mouseNDC.y = -(e.clientY / window.innerHeight - 0.5) * 1000;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      targetCamZ = 700 + window.scrollY * 0.12;
    }, { passive: true });

    window.addEventListener('resize', () => {
      W = heroEl.clientWidth; H = heroEl.clientHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    });

    const CONN_DIST = 140; // Reduced from 180

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      particles.forEach(p => {
        p.position.x += p.userData.vx + Math.sin(t + p.userData.phase) * 0.15;
        p.position.y += p.userData.vy + Math.cos(t + p.userData.phase) * 0.15;

        // Boundaries
        if (Math.abs(p.position.x) > 800) p.position.x *= -0.98;
        if (Math.abs(p.position.y) > 600) p.position.y *= -0.98;

        // Mouse Repel
        const dx = p.position.x - mouseNDC.x;
        const dy = p.position.y - mouseNDC.y;
        const dist2 = dx*dx + dy*dy;
        if (dist2 < 200 * 200) {
          const d = Math.sqrt(dist2);
          const force = (1 - d / 200) * 1.5;
          p.position.x += (dx / d) * force;
          p.position.y += (dy / d) * force;
        }
      });

      // Update Threads
      let lineIdx = 0;
      for (let i = 0; i < COUNT; i++) {
        if (lineIdx >= MAX_CONN * 2) break;
        for (let j = i + 1; j < COUNT; j++) {
          const pi = particles[i].position;
          const pj = particles[j].position;
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dz = pi.z - pj.z;
          const d2 = dx*dx + dy*dy + dz*dz;
          if (d2 < CONN_DIST * CONN_DIST) {
            linePos[lineIdx * 3]     = pi.x;
            linePos[lineIdx * 3 + 1] = pi.y;
            linePos[lineIdx * 3 + 2] = pi.z;
            lineIdx++;
            linePos[lineIdx * 3]     = pj.x;
            linePos[lineIdx * 3 + 1] = pj.y;
            linePos[lineIdx * 3 + 2] = pj.z;
            lineIdx++;
          }
          if (lineIdx >= MAX_CONN * 2) break;
        }
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx);

      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      renderer.render(scene, camera);
    }
    animate();
  })();



  // ══════════════════════════════════════════════
  // 4. DUST PARTICLES (Canvas 2D)
  // ══════════════════════════════════════════════
  (function initDust() {
    const canvas = document.getElementById('dust-canvas');
    const ctx    = canvas.getContext('2d');
    const hero   = document.getElementById('hero');

    function resize() {
      canvas.width  = hero.clientWidth;
      canvas.height = hero.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let mx = -999, my = -999;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

    const motes = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2,
      vy: -(0.3 + Math.random() * 0.7),
      vx: 0,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.5 + Math.random() * 0.3
    }));

    function drawDust() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = performance.now() * 0.001;
      motes.forEach(m => {
        m.vx = Math.sin(t + m.phase) * 0.4;

        // Attract to cursor
        const dx = mx - m.x;
        const dy = my - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          m.x += dx * 0.01;
          m.y += dy * 0.01;
        }

        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -10) {
          m.y = canvas.height + 5;
          m.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${m.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(drawDust);
    }
    drawDust();
  })();

  // ══════════════════════════════════════════════
  // 5. GOD RAYS — follow cursor X
  // ══════════════════════════════════════════════
  (function initGodRays() {
    const raysEl = document.getElementById('god-rays');
    let targetX = 0, currentX = 0;
    document.addEventListener('mousemove', e => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 80;
    }, { passive: true });
    function lerp(a, b, t) { return a + (b - a) * t; }
    if (!raysEl) return;
    function moveRays() {
      currentX = lerp(currentX, targetX, 0.05);
      raysEl.style.transform = `translateX(calc(-50% + ${currentX}px))`;
      requestAnimationFrame(moveRays);
    }
    moveRays();
  })();

  // ══════════════════════════════════════════════
  // 6. HERO TEXT REVEAL (SplitType + GSAP)
  // ══════════════════════════════════════════════
  setTimeout(() => {
    if (typeof SplitType === 'undefined') return;
    const headline = document.getElementById('hero-headline');
    if (!headline) return;
    const split = new SplitType(headline, { types: 'chars' });

    gsap.from(split.chars, {
      y: 60, opacity: 0, rotateX: -40,
      stagger: 0.04, duration: 0.8,
      ease: 'back.out(1.7)', delay: 0.4,
      onComplete: () => {
        // Apply gold shimmer after reveal
        headline.classList.add('shimmer-active');
      }
    });

    // Hero badge
    gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 0.6, delay: 0.2 });

    // CTAs
    gsap.from('#hero-cta-1, #hero-cta-2', {
      y: 30, opacity: 0, stagger: 0.1,
      duration: 0.7, ease: 'power3.out', delay: 1.2
    });

    // Stats
    gsap.from('.hero-stats', { y: 20, opacity: 0, duration: 0.7, delay: 1.6 });
  }, 400);

  // ══════════════════════════════════════════════
  // 7. TYPED.JS
  // ══════════════════════════════════════════════
  if (typeof Typed !== 'undefined' && document.getElementById('typed-target')) {
    new Typed('#typed-target', {
      strings: [
        'شالات فاخرة لكل مناسبة...',
        'مكياج يُكمل إطلالتك...',
        'عناية تُحيي بشرتك...',
        'فيتامينات لجمال من الداخل...'
      ],
      typeSpeed: 45, backSpeed: 25, backDelay: 2000, loop: true
    });
  }

  // ══════════════════════════════════════════════
  // 8. GSAP SCROLL ANIMATIONS
  // ══════════════════════════════════════════════

  // Global reveal
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
      delay: parseFloat(el.dataset.delay || 0)
    });
  });

  // Hero parallax
  gsap.to('#hero-bg', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    y: '30%', ease: 'none'
  });

  // CountUp stats
  ScrollTrigger.create({
    trigger: '.hero-stats',
    start: 'top 95%',
    once: true,
    onEnter: () => {
      if (typeof CountUp !== 'undefined') {
        new CountUp('stat-customers', 2400, { duration: 2.5, separator: ',' }).start();
        new CountUp('stat-rating',    4.9,  { decimalPlaces: 1, duration: 2 }).start();
        new CountUp('stat-products',  120,  { duration: 2 }).start();
      }
    }
  });

  // Steps stagger
  gsap.from('.step-card', {
    scrollTrigger: { trigger: '.steps-grid', start: 'top 80%' },
    y: 60, opacity: 0, scale: 0.94,
    stagger: 0.12, duration: 0.7, ease: 'power2.out'
  });

  // ══════════════════════════════════════════════
  // 9. RIPPLE EFFECT
  // ══════════════════════════════════════════════
  document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple-circle';
      ripple.style.cssText = `width:${size}px;height:${size}px;top:${y - size/2}px;left:${x - size/2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // ══════════════════════════════════════════════
  // 10. RENDER PRODUCTS
  // ══════════════════════════════════════════════
  let allProducts = DB.getProducts();
  updateCatCounts(allProducts);
  renderBestsellers(allProducts);
  renderCategorySections(allProducts);

  function updateCatCounts(products) {
    ['scarves','makeup','skincare','vitamins'].forEach(cat => {
      const el = document.getElementById(`count-${cat}`);
      if (el) el.textContent = products.filter(p => p.category === cat).length + ' منتج';
    });
  }

  function createProductCard(product, forBestsellers = false) {
    const inWishlist = DB.getWishlist().includes(product.id);
    const hasRealImage = product.images && product.images[0] && !product.images[0].includes('picsum');
    const div = document.createElement('div');
    div.className = 'product-card' + (hasRealImage ? ' has-image' : '');
    div.setAttribute('data-id', product.id);
    div.setAttribute('data-cat', product.category);
    div.setAttribute('data-sku', product.sku || '');
    div.setAttribute('data-stock', product.stock || 99);
    div.setAttribute('will-change', 'transform');
    div.innerHTML = `
      <div class="card-img-wrap">
        <img class="card-img" src="${product.images[0]}" alt="${product.nameAR}" loading="lazy" />
        <div class="card-overlay">
          <button class="overlay-btn view-btn" data-id="${product.id}" aria-label="عرض المنتج">👁</button>
          <button class="overlay-btn wish-ov-btn ${inWishlist?'active':''}" data-id="${product.id}" aria-label="المفضلة">♥</button>
        </div>
        <button class="card-add-fab ripple-btn" data-id="${product.id}" aria-label="أضيفي للسلة">+</button>
        ${product.bestseller ? '<span class="badge-best">BEST</span>' : ''}
        ${product.featured   ? '<span class="badge-new">NEW</span>'  : ''}
        ${product.sku ? `<span class="badge-sku">${product.sku}</span>` : ''}
      </div>
      <div class="card-body">
        <span class="card-cat">${CAT_LABELS[product.category]}</span>
        <div class="card-info-row">
          <h3 class="card-title">${product.nameAR}</h3>
          <p class="card-price">${product.price}<span>₪</span></p>
        </div>
        <div class="card-actions-row">
          <button class="card-wish-btn ${inWishlist?'active':''}" data-id="${product.id}" aria-label="المفضلة">♥</button>
          <button class="card-details-link" data-id="${product.id}">اعرفي المزيد</button>
        </div>
      </div>
    `;

    // Hover GSAP
    div.addEventListener('mouseenter', () => {
      gsap.to(div, { y: -10, duration: 0.4, ease: 'power2.out' });
      gsap.to(div.querySelector('.card-img'), { scale: 1.07, duration: 0.5, ease: 'power2.out' });
      gsap.to(div.querySelector('.card-overlay'), { opacity: 1, duration: 0.3 });
    });
    div.addEventListener('mouseleave', () => {
      gsap.to(div, { y: 0, duration: 0.4, ease: 'power2.inOut' });
      gsap.to(div.querySelector('.card-img'), { scale: 1, duration: 0.5 });
      gsap.to(div.querySelector('.card-overlay'), { opacity: 0, duration: 0.3 });
    });

    // Add to Cart — floating FAB on image corner
    div.querySelector('.card-add-fab').addEventListener('click', e => {
      e.stopPropagation();
      addToCart(product.id);
      flyToCart(div.querySelector('.card-img'));
      addRipple(e, div.querySelector('.card-add-fab'));
    });

    // Wishlist buttons
    ['.card-wish-btn', '.wish-ov-btn'].forEach(sel => {
      const btn = div.querySelector(sel);
      if (!btn) return;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        toggleWishlist(product.id, btn, div);
      });
    });

    // View product — eye button opens full modal, "اعرفي المزيد" opens compact quickview
    div.querySelector('.view-btn').addEventListener('click', e => {
      e.stopPropagation();
      openProductModal(product.id);
    });
    div.querySelector('.card-details-link').addEventListener('click', e => {
      e.stopPropagation();
      openQuickView(product.id);
    });


    // Cursor
    attachCursorToEl(div);
    div.querySelectorAll('button').forEach(attachCursorToEl);

    return div;
  }

  function renderBestsellers(products) {
    const track = document.getElementById('bestsellers-track');
    track.innerHTML = '';
    const best = products.filter(p => p.bestseller);
    if (!best.length) best.push(...products.slice(0, 4));
    best.forEach(p => track.appendChild(createProductCard(p, true)));

    // GSAP pinned horizontal scroll
    ScrollTrigger.create({
      trigger: '.bestsellers-section',
      start: 'top top',
      end: '+=' + Math.max(1200, track.scrollWidth - window.innerWidth + 200),
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      animation: gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 80),
        ease: 'none'
      })
    });
  }

  const CAT_SHOW_INITIAL = 8; // products shown before "load more"

  function renderCategorySections(products) {
    // Safety: if no products at all, re-seed
    if (!products || !products.length) {
      DB.saveProducts(SEED_PRODUCTS);
      products = SEED_PRODUCTS;
    }

    const CAT_META = {
      makeup:   {
        gradient: 'linear-gradient(110deg,#1a0a12 0%,#3d1a28 40%,#c97b8a 100%)',
        skinGradient: 'linear-gradient(110deg,#0d0508 0%,#2a0f1c 35%,#8b3a5a 65%,#c9a84c 100%)',
        icon: '💄', label: 'مكياج ومستحضرات', labelEN: 'Makeup Collection',
        accentColor: '#e8b4c0'
      },
      skincare: {
        gradient: 'linear-gradient(110deg,#051209 0%,#0e2b18 40%,#4a7c5e 100%)',
        skinGradient: 'linear-gradient(110deg,#030a05 0%,#0a1f10 35%,#2d5e3f 65%,#c9a84c 100%)',
        icon: '🌿', label: 'عناية بالبشرة', labelEN: 'Skincare',
        accentColor: '#7db892'
      },
      vitamins: {
        gradient: 'linear-gradient(110deg,#120b01 0%,#2e1e05 40%,#b87333 100%)',
        skinGradient: 'linear-gradient(110deg,#0a0601 0%,#1e1403 35%,#7a4a1e 65%,#c9a84c 100%)',
        icon: '💊', label: 'فيتامينات', labelEN: 'Vitamins',
        accentColor: '#c9a84c'
      },
      personal: {
        gradient: 'linear-gradient(110deg,#070c1a 0%,#141e3d 40%,#6b7db3 100%)',
        skinGradient: 'linear-gradient(110deg,#04070f 0%,#0d1428 35%,#3d4f80 65%,#c9a84c 100%)',
        icon: '🧴', label: 'عناية شخصية', labelEN: 'Personal Care',
        accentColor: '#9aaed4'
      }
    };

    const container = document.getElementById('category-sections');
    if (!container) return;
    container.innerHTML = '';

    const cats = ['makeup', 'skincare', 'vitamins', 'personal'];
    let renderedCount = 0;

    cats.forEach((cat, catIdx) => {
      const catProducts = products.filter(p => p.category === cat);
      if (!catProducts.length) return;

      const meta  = CAT_META[cat];
      const total = catProducts.length;

      // ── Slim skin separator BEFORE each section (except first) ──────
      if (renderedCount > 0) {
        const sep = document.createElement('div');
        sep.className = 'cat-skin-separator';
        sep.style.background = meta.skinGradient;
        sep.innerHTML = `
          <div class="css-sep-content">
            <span class="css-sep-icon">${meta.icon}</span>
            <div class="css-sep-text">
              <span class="css-sep-en">${meta.labelEN}</span>
              <span class="css-sep-divider">·</span>
              <span class="css-sep-ar">${meta.label}</span>
            </div>
            <div class="css-sep-line"></div>
          </div>`;
        container.appendChild(sep);
      }

      // ── Section wrapper ──────────────────────────────────────────────
      const section = document.createElement('div');
      section.className = 'cat-section-new';
      section.id = `section-${cat}`;

      // Section header (slim)
      section.innerHTML = `
        <div class="csn-header">
          <div class="csn-header-left">
            <span class="csn-icon">${meta.icon}</span>
            <div>
              <p class="csn-en">${meta.labelEN}</p>
              <h2 class="csn-title">${meta.label}</h2>
            </div>
          </div>
          <div class="csn-header-right">
            <span class="csn-count">${total} منتج</span>
            <a class="csn-view-all" href="#section-${cat}" data-cat="${cat}">
              عرض الكل
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 18l6-6-6-6"/></svg>
            </a>
          </div>
        </div>
      `;

      container.appendChild(section);

      // ── Split products into rows of ROW_SIZE ──────────────────────────
      const ROW_SIZE = 8; // max per row (user scrolls to see beyond 4 visible)
      const mid = Math.ceil(catProducts.length / 2);
      const rows = [catProducts.slice(0, mid), catProducts.slice(mid)].filter(r => r.length);

      rows.forEach((rowProducts, rowIdx) => {
        const rowWrap = document.createElement('div');
        rowWrap.className = 'csn-row-wrap';

        const row = document.createElement('div');
        row.className = 'csn-h-row';
        row.setAttribute('data-row', rowIdx);

        rowProducts.forEach(p => {
          const card = createProductCard(p);
          card.classList.add('h-card');
          row.appendChild(card);
        });

        rowWrap.appendChild(row);
        section.appendChild(rowWrap);

        // Entrance: slide in from side
        gsap.from(row.querySelectorAll('.product-card'), {
          scrollTrigger: { trigger: row, start: 'top 95%' },
          x: rowIdx % 2 === 0 ? 60 : -60,
          opacity: 0,
          stagger: 0.04,
          duration: 0.35,
          ease: 'power2.out'
        });
      });

      renderedCount++;
    });
  }

  // ── Active chip highlight on scroll ────────────────────────
  (function initChipHighlight() {
    const chips = document.querySelectorAll('.cat-chip[data-cat]');
    if (!chips.length) return;

    const sections = ['makeup', 'skincare', 'vitamins', 'personal'].map(cat => ({
      cat,
      el: document.getElementById(`section-${cat}`)
    })).filter(s => s.el);

    function setActive(cat) {
      chips.forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cat = entry.target.id.replace('section-', '');
          setActive(cat);
        }
      });
    }, { threshold: 0.25 });

    sections.forEach(s => obs.observe(s.el));

    // All-chip activates when above first section
    const allChip = document.querySelector('.cat-chip-all');
    if (allChip) {
      const firstSection = document.getElementById('section-makeup') || document.getElementById('section-skincare');
      if (firstSection) {
        const allObs = new IntersectionObserver((entries) => {
          if (!entries[0].isIntersecting) setActive('all');
        }, { threshold: 0, rootMargin: '0px 0px -80% 0px' });
        allObs.observe(firstSection);
      }
    }
  })();

  // ══════════════════════════════════════════════
  // 12. FLY TO CART ANIMATION
  // ══════════════════════════════════════════════
  function flyToCart(imgEl) {
    const cartIcon = document.getElementById('cart-icon');
    if (!imgEl || !cartIcon) return;
    const imgRect  = imgEl.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const clone = imgEl.cloneNode();
    clone.style.cssText = `
      position:fixed;
      top:${imgRect.top}px;
      left:${imgRect.left}px;
      width:${imgRect.width}px;
      height:${imgRect.height}px;
      border-radius:50%;
      z-index:9999;
      pointer-events:none;
      object-fit:cover;
      transition:none;
    `;
    document.body.appendChild(clone);

    gsap.to(clone, {
      top:     cartRect.top  + cartRect.height / 2,
      left:    cartRect.left + cartRect.width  / 2,
      width:   20, height: 20,
      opacity: 0,
      duration: 0.85, ease: 'power3.in',
      onComplete: () => { clone.remove(); bounceCartBadge(); }
    });
  }

  function bounceCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    if (typeof anime !== 'undefined') {
      anime({ targets: badge, scale: [1, 1.5, 1], duration: 400, easing: 'easeOutElastic' });
    } else {
      gsap.to(badge, { scale: 1.5, duration: 0.15, yoyo: true, repeat: 1 });
    }
  }

  // ══════════════════════════════════════════════
  // 13. CART LOGIC
  // ══════════════════════════════════════════════
  function addToCart(productId, qty = 1) {
    const products = DB.getProducts();
    const product  = products.find(p => p.id === productId);
    if (!product) return;

    let cart = API.getCartLocal();
    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock || 99);
    } else {
      cart.push({ id: productId, qty, name: product.nameAR, price: product.price, image: product.images[0] });
    }
    API.saveCartLocal(cart);
    updateCartUI();
    showToast('✅ تمت الإضافة إلى السلة');
    API.addToCart(productId, qty).catch(() => {});
  }

  function removeFromCart(productId) {
    let cart = API.getCartLocal().filter(i => i.id !== productId);
    API.saveCartLocal(cart);
    API.removeFromCart(productId).catch(() => {});
    // Animate removal
    const itemEl = document.querySelector(`.cart-item[data-id="${productId}"]`);
    if (itemEl) {
      gsap.to(itemEl, {
        x: 100, opacity: 0, height: 0, marginBottom: 0, padding: 0,
        duration: 0.4, ease: 'power2.in',
        onComplete: () => { itemEl.remove(); updateCartUI(); }
      });
    } else {
      updateCartUI();
    }
  }

  function changeQty(productId, delta) {
    let cart = API.getCartLocal();
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    API.saveCartLocal(cart);
    API.updateCartItem(productId, item.qty).catch(() => {});
    // Bounce qty display
    const qtyEl = document.querySelector(`.cart-item[data-id="${productId}"] .qty-val`);
    if (qtyEl && typeof anime !== 'undefined') {
      qtyEl.textContent = item.qty;
      anime({ targets: qtyEl, scale: [1.3, 1], duration: 300, easing: 'easeOutElastic' });
    }
    updateCartTotal();
  }

  function updateCartUI() {
    const cart    = API.getCartLocal();
    const badge   = document.getElementById('cart-badge');
    const itemsEl = document.getElementById('cart-items');
    const emptyEl = document.getElementById('cart-empty');
    const footer  = document.getElementById('cart-footer');

    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    badge.textContent = totalQty;

    if (!cart.length) {
      emptyEl.hidden  = false;
      footer.hidden   = true;
      itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
      return;
    }

    emptyEl.hidden = true;
    footer.hidden  = false;

    // Rebuild cart items
    itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.setAttribute('data-id', item.id);
      div.innerHTML = `
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" loading="lazy" />
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${item.price * item.qty} ₪</p>
          <div class="cart-item-qty">
            <button class="qty-btn cart-minus" data-id="${item.id}" aria-label="تقليل">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn cart-plus"  data-id="${item.id}" aria-label="زيادة">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="إزالة">✕</button>
      `;
      div.querySelector('.cart-minus').addEventListener('click', () => changeQty(item.id, -1));
      div.querySelector('.cart-plus').addEventListener('click',  () => changeQty(item.id,  1));
      div.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(item.id));
      itemsEl.appendChild(div);
    });

    updateCartTotal();
  }

  function updateCartTotal() {
    const cart  = API.getCartLocal();
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const el    = document.getElementById('cart-total');
    if (el) el.textContent = total + ' ₪';
  }

  // Cart drawer toggle
  function openCart() {
    window.location.href = 'cart.html';
  }
  function closeCart() {} // No-op — cart is now a separate page
  document.getElementById('cart-icon')?.addEventListener('click', openCart);

  // ── WISHLIST (redirect to full page) ──
  function openWishlist() {
    window.location.href = 'wishlist.html';
  }
  const wishlistNavBtn = document.getElementById('wishlist-btn');
  if (wishlistNavBtn) wishlistNavBtn.addEventListener('click', openWishlist);


  // ══════════════════════════════════════════════
  // 14. WISHLIST (HEART BURST)
  // ══════════════════════════════════════════════
  function toggleWishlist(productId, btn, cardEl) {
    let list = DB.getWishlist();
    const inList = list.includes(productId);
    if (inList) {
      list = list.filter(id => id !== productId);
    } else {
      list.push(productId);
      heartBurst(btn, cardEl);
    }
    DB.saveWishlist(list);
    // Update all buttons for this product
    document.querySelectorAll(`.card-wish-btn[data-id="${productId}"], .wish-ov-btn[data-id="${productId}"]`).forEach(b => {
      b.classList.toggle('active', !inList);
    });
  }

  function heartBurst(btn, parent) {
    const container = parent || btn.parentElement;
    const hearts = Array.from({ length: 8 }, () => {
      const h  = document.createElement('div');
      h.textContent = '♥';
      h.style.cssText = 'position:absolute;font-size:14px;color:#D4537E;pointer-events:none;z-index:100;';
      container.style.position = 'relative';
      container.appendChild(h);
      return h;
    });
    if (typeof anime !== 'undefined') {
      anime({
        targets: hearts,
        translateX: () => anime.random(-60, 60),
        translateY: () => anime.random(-70, -20),
        opacity: [1, 0], scale: [1, 0.3],
        duration: 700, easing: 'easeOutExpo',
        complete: () => hearts.forEach(h => h.remove())
      });
    } else {
      hearts.forEach(h => h.remove());
    }
  }

  // ══════════════════════════════════════════════
  // 14b. COMPACT QUICK VIEW
  // ══════════════════════════════════════════════
  let qvProduct = null;
  const qvPanel = document.getElementById('quick-view');

  function openQuickView(productId) {
    const products = DB.getProducts();
    const product  = products.find(p => p.id === productId);
    if (!product) return;
    qvProduct = product;

    document.getElementById('qv-img').src   = product.images && product.images[0] ? product.images[0] : '';
    document.getElementById('qv-img').alt   = product.nameAR;
    document.getElementById('qv-cat').textContent   = CAT_LABELS[product.category] || '';
    document.getElementById('qv-title').textContent = product.nameAR;
    document.getElementById('qv-price').textContent = product.price + ' ₪';
    document.getElementById('qv-desc').textContent  = product.descriptionAR || 'لا يوجد وصف متاح.';

    qvPanel.hidden = false;
    qvPanel.style.opacity = '';
    gsap.fromTo(qvPanel, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
    gsap.fromTo('.qv-card', { scale: 0.88, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.32, ease: 'back.out(1.5)' });
  }

  function closeQuickView() {
    gsap.to(qvPanel, { opacity: 0, duration: 0.2, ease: 'power2.in',
      onComplete: () => { qvPanel.hidden = true; qvPanel.style.opacity = ''; }
    });
    gsap.to('.qv-card', { scale: 0.9, opacity: 0, y: 20, duration: 0.18, ease: 'power2.in' });
  }

  document.getElementById('qv-close')?.addEventListener('click', closeQuickView);
  qvPanel.addEventListener('click', e => { if (e.target === qvPanel) closeQuickView(); });
  document.getElementById('qv-add-btn')?.addEventListener('click', () => {
    if (!qvProduct) return;
    addToCart(qvProduct.id);
    closeQuickView();
  });

  // ══════════════════════════════════════════════
  // 15. PRODUCT MODAL
  // ══════════════════════════════════════════════
  let modalQty = 1;
  let modalProduct = null;
  let modalSwiperInst = null;

  function openProductModal(productId) {
    const products = DB.getProducts();
    const product  = products.find(p => p.id === productId);
    if (!product) return;
    modalProduct = product;
    modalQty     = 1;

    // Populate
    document.getElementById('modal-cat').textContent   = CAT_LABELS[product.category] || '';
    document.getElementById('modal-sku').textContent   = product.sku || '';
    document.getElementById('modal-title').textContent = product.nameAR;
    document.getElementById('modal-price').textContent = product.price + ' ₪';
    document.getElementById('modal-desc').textContent  = product.descriptionAR || '';
    document.getElementById('modal-qty-val').textContent = '1';

    // Gallery slides
    const slidesWrap = document.getElementById('modal-swiper-slides');
    slidesWrap.innerHTML = '';
    (product.images.length ? product.images : ['/assets/test-product.jpeg']).forEach(url => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `<img src="${url}" alt="${product.nameAR}" style="width:100%;aspect-ratio:1;object-fit:cover;" loading="lazy"/>`;
      slidesWrap.appendChild(slide);
    });

    // Init/update Swiper
    if (modalSwiperInst) { modalSwiperInst.destroy(true, true); }
    modalSwiperInst = new Swiper('#modal-swiper', {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      pagination: { el: '.swiper-pagination', clickable: true },
      loop: product.images.length > 1
    });

    // Show modal
    const modal = document.getElementById('product-modal');
    modal.hidden = false;
    gsap.from('.modal-box', { scale: 0.92, opacity: 0, duration: 0.35, ease: 'back.out(1.4)' });
    document.body.style.overflow = 'hidden';

    // Wishlist state
    const inWish = DB.getWishlist().includes(productId);
    const wishBtn = document.getElementById('modal-wishlist-btn');
    wishBtn.textContent = inWish ? 'إزالة من المفضلة ♥' : 'أضيفي للمفضلة ♥';
  }

  function closeModal() {
    const modal = document.getElementById('product-modal');
    gsap.to(modal, { opacity: 0, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        modal.hidden = true;
        modal.style.opacity = '';
        document.body.style.overflow = '';
      }
    });
    gsap.to('.modal-box', { scale: 0.92, opacity: 0, duration: 0.2, ease: 'power2.in' });
  }

  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('product-modal')?.addEventListener('click', e => {
    if (e.target.id === 'product-modal') closeModal();
  });

  document.getElementById('modal-qty-minus')?.addEventListener('click', () => {
    if (modalQty > 1) { modalQty--; document.getElementById('modal-qty-val').textContent = modalQty; }
  });
  document.getElementById('modal-qty-plus')?.addEventListener('click', () => {
    modalQty++;
    document.getElementById('modal-qty-val').textContent = modalQty;
  });

  document.getElementById('modal-add-to-cart')?.addEventListener('click', () => {
    if (!modalProduct) return;
    addToCart(modalProduct.id, modalQty);
    closeModal();
  });

  document.getElementById('modal-wishlist-btn')?.addEventListener('click', () => {
    if (!modalProduct) return;
    const btn = document.getElementById('modal-wishlist-btn');
    toggleWishlist(modalProduct.id, btn, document.querySelector('.modal-box'));
    const inWish = DB.getWishlist().includes(modalProduct.id);
    btn.textContent = inWish ? 'إزالة من المفضلة ♥' : 'أضيفي للمفضلة ♥';
  });

  // ══════════════════════════════════════════════
  // 16. WHATSAPP CHECKOUT
  // ══════════════════════════════════════════════
  document.getElementById('checkout-whatsapp')?.addEventListener('click', async () => {
    const cart = API.getCartLocal();
    if (!cart.length) return;

    const total   = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const user    = DB.getCurrentUser();

    let msg = `🛍️ *طلب جديد من متجر Beauty Zone*\n`;
    msg    += `📦 *المنتجات:*\n`;
    cart.forEach(item => {
      msg += `• ${item.name} × ${item.qty} = ${item.price * item.qty} ₪\n`;
    });
    msg += `\n💰 *الإجمالي: ${total} ₪*\n\n`;
    msg += `يرجى التأكيد وإرسال عنوان التوصيل 🏠`;

    let orderResult = null;
    try { orderResult = await API.createOrder({ items: cart.map(i => ({ product_id: i.id, quantity: i.qty, price: i.price, name: i.name })), total, customer_name: user?.name || 'عميل', customer_phone: user?.phone || 'غير معروف', notes: 'طلب واتساب' }); } catch(e) { console.warn('Order save failed', e); }
    const orderId = orderResult?.id || 'BZ-' + Math.floor(1000 + Math.random() * 9000);

    API.saveCartLocal([]);
    updateCartUI();
    for (const item of cart) { try { await API.removeFromCart(item.id); } catch(e) {} }

    showSuccess(orderId);

    const url = `https://wa.me/${GLOW_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    setTimeout(() => window.open(url, '_blank', 'noopener'), 800);
  });

  function showSuccess(orderId) {
    const overlay = document.getElementById('success-overlay');
    document.getElementById('order-id-display').textContent = orderId;
    overlay.hidden = false;

    // Lottie checkmark (simple SVG fallback)
    const lottieWrap = document.getElementById('lottie-check');
    lottieWrap.innerHTML = `
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#C9A84C" stroke-width="4" stroke-dasharray="283" stroke-dashoffset="283" id="check-circle"/>
        <polyline points="28,55 44,70 72,35" fill="none" stroke="#6B2D4E" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="70" stroke-dashoffset="70" id="check-mark"/>
      </svg>`;

    const circle = lottieWrap.querySelector('#check-circle');
    const mark   = lottieWrap.querySelector('#check-mark');
    gsap.to(circle, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' });
    gsap.to(mark,   { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', delay: 0.7 });

    // Confetti
    if (typeof confetti !== 'undefined') {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 }, colors: ['#C9A84C','#E8A4B8','#D4B8E0'] });
    }

    gsap.from('.success-box', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' });
  }

  document.getElementById('success-close')?.addEventListener('click', () => {
    const overlay = document.getElementById('success-overlay');
    gsap.to('.success-box', {
      scale: 0.9, opacity: 0, duration: 0.3,
      onComplete: () => { overlay.hidden = true; }
    });
  });

  // ══════════════════════════════════════════════
  // 17. TESTIMONIALS MARQUEE
  // ══════════════════════════════════════════════
  function buildMarquee() {
    const track = document.getElementById('marquee-track');
    if (!track) return;
    const tList = DB.getTestimonials();
    const all = [...tList, ...tList]; // duplicate for infinite
    all.forEach(t => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.innerHTML = `
        <div class="testi-stars">${'★'.repeat(t.stars)}</div>
        <p class="testi-text">"${t.text}"</p>
        <div class="testi-author">
          <div class="testi-avatar">${t.letter}</div>
          <div>
            <p class="testi-name">${t.name}</p>
            <p class="testi-location">${t.location}</p>
          </div>
        </div>
        ${t.storeReply ? `<div class="testi-store-reply"><span class="testi-reply-label">💬 Beauty Zone</span><p>${t.storeReply}</p></div>` : ''}`;
      track.appendChild(card);
    });
  }
  buildMarquee();

  // Apply admin-set section images to category section banners
  (function applySectionImages() {
    const raw = localStorage.getItem('bz_section_images');
    if (!raw) return;
    try {
      const imgs = JSON.parse(raw);
      ['makeup','skincare','vitamins','personal'].forEach(key => {
        if (!imgs[key]) return;
        const banner = document.querySelector(`#section-${key} .cat-section-banner`);
        if (banner) {
          banner.style.background = 'none';
          banner.style.backgroundImage = `url('${imgs[key]}')`;
          banner.style.backgroundSize = 'cover';
          banner.style.backgroundPosition = 'center';
        }
      });
    } catch(e) {}
  })();

  // Apply admin-set hero background image
  (function applyHeroImage() {
    const url = localStorage.getItem('bz_hero_bg_img');
    if (!url) return;
    // Show admin override image on top of video
    const adminImg = document.getElementById('hero-admin-img');
    const video    = document.getElementById('hero-bg-video');
    if (adminImg) {
      adminImg.src = url;
      adminImg.style.display = 'block';
      adminImg.style.opacity = '1';
    }
    if (video) { video.style.display = 'none'; }
  })();

  // ══════════════════════════════════════════════
  // 18. NEWSLETTER
  // ══════════════════════════════════════════════
  document.getElementById('newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('newsletter-email');
    if (!input.value.includes('@')) {
      input.style.borderColor = '#E85A5A';
      input.focus();
      return;
    }
    const btn = document.getElementById('newsletter-btn');
    btn.textContent = '🎉 تم الاشتراك!';
    btn.disabled = true;
    input.value = '';
    if (typeof confetti !== 'undefined') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#C9A84C','#E8A4B8'] });
    }
    setTimeout(() => {
      btn.textContent = 'اشتركي الآن';
      btn.disabled = false;
    }, 3000);
  });

  // ══════════════════════════════════════════════
  // 19. SMOOTH ANCHOR SCROLL
  // ══════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

  // ══════════════════════════════════════════════
  // 20. LAZY LOAD IMAGES
  // ══════════════════════════════════════════════
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('img[loading="lazy"]').forEach(img => imgObserver.observe(img));

  // ══════════════════════════════════════════════
  // 21. CURSOR ON ALL INTERACTIVE ELEMENTS
  // ══════════════════════════════════════════════
  document.querySelectorAll('button, a, .product-card, .pill, .cat-card').forEach(attachCursorToEl);

  // ══════════════════════════════════════════════
  // 22. ANNOUNCEMENT BAR (Billboard)
  // ══════════════════════════════════════════════
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }

  // Sync cart from server then update UI
  (async () => {
    try {
      const serverCart = await API.getCart();
      API.saveCartLocal(serverCart);
    } catch(e) {}
    updateCartUI();
  })();

  console.log('%c✨ Beauty Zone · متجر الجمال — جمالك، بلمسة فرق', 'color:#C9A84C;font-size:1.2rem;font-weight:bold;');

  // ══════════════════════════════════════════════
  // 24. AUTH SYSTEM (Login / Register / Profile)
  // ══════════════════════════════════════════════
  const adminBtns     = document.querySelectorAll('.admin-btn');

  // ── Admin credentials (special account) ──
  const ADMIN_PHONE = '0500000000';
  const ADMIN_PASS  = 'beauty2026';

  // ── Helpers ──
  function getCurrentUser() {
    return DB.getCurrentUser(); // Uses localStorage (persistent)
  }

  function setCurrentUser(user) {
    DB.setCurrentUser(user); // Uses localStorage + dispatches authUpdated event
    updateAuthUI(user);
  }

  function updateAuthUI(user) {
    const profileBar = document.getElementById('profile-bar');
    const loggedName = document.getElementById('logged-user-name');

    if (user) {
      if (profileBar) profileBar.style.display = '';
      if (loggedName) loggedName.textContent = user.name || user.phone || user.email || 'مستخدم';

      if (user.role === 'admin') {
        adminBtns.forEach(btn => btn.style.display = 'flex');
      } else {
        adminBtns.forEach(btn => btn.style.display = 'none');
      }
    } else {
      if (profileBar) profileBar.style.display = 'none';
      adminBtns.forEach(btn => btn.style.display = 'none');
    }
  }

  // Check remembered session on load
  const savedUser = getCurrentUser();
  if (savedUser) updateAuthUI(savedUser);

  // ── Open login / account (redirect to full pages) ──
  const openLoginBtn = document.getElementById('open-login');
  function openAuth() {
    const user = getCurrentUser();
    window.location.href = user ? 'account.html' : 'login.html';
  }
  if (openLoginBtn) openLoginBtn.addEventListener('click', openAuth);

  // ── DO LOGIN / REGISTER (redirect to login.html) ──
  document.getElementById('btn-do-login')?.addEventListener('click', () => { window.location.href = 'login.html'; });
  document.getElementById('btn-do-register')?.addEventListener('click', () => { window.location.href = 'login.html'; });

  // ── LOGOUT ──
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      DB.logoutUser();
      updateAuthUI(null);
      showToast('👋 تم تسجيل الخروج بنجاح');
    });
  }


  // ══════════════════════════════════════════════
  // 25. SKIN CARE WIZARD (Assistant)
  // ══════════════════════════════════════════════
  const wizardModal = document.getElementById('wizard-modal');
  const openWizBtnHero = document.getElementById('open-assistant-hero');
  const closeWizBtn = document.getElementById('wizard-close');

  function openWizard() {
    if (!wizardModal) return;
    wizardModal.classList.remove('hidden');
    gsap.from('#wizard-box', { y: 60, opacity: 0, duration: 0.6, ease: 'power3.out' });
  }

  function closeWizard() {
    if (!wizardModal) return;
    gsap.to('#wizard-box', { y: 30, opacity: 0, duration: 0.4, onComplete: () => wizardModal.classList.add('hidden') });
  }

  if (openWizBtnHero) openWizBtnHero.addEventListener('click', openWizard);
  if (closeWizBtn) closeWizBtn.addEventListener('click', closeWizard);

  let wizardData = { type: '', goal: '' };
  const wizardSteps = document.querySelectorAll('.wizard-step');

  function goToStep(stepNum) {
    wizardSteps.forEach(s => s.classList.remove('active'));
    const target = Array.from(wizardSteps).find(s => s.dataset.step == stepNum);
    if (target) target.classList.add('active');
  }

  document.querySelectorAll('.wizard-step[data-step="1"] .opt-card').forEach(card => {
    card.addEventListener('click', () => {
      wizardData.type = card.dataset.val;
      goToStep(2);
    });
  });

  document.querySelectorAll('.wizard-step[data-step="2"] .opt-card').forEach(card => {
    card.addEventListener('click', () => {
      wizardData.goal = card.dataset.val;
      showWizardResults();
    });
  });

  document.getElementById('wizard-back')?.addEventListener('click', () => goToStep(1));
  document.getElementById('wizard-reset')?.addEventListener('click', () => {
    wizardData = { type: '', goal: '' };
    goToStep(1);
  });

  function showWizardResults() {
    const list = document.getElementById('wizard-results-list');
    list.innerHTML = '<div class="shimmer-placeholder"></div><div class="shimmer-placeholder"></div><div class="shimmer-placeholder"></div>';

    setTimeout(() => {
      goToStep(3);
      const all = DB.getProducts();

      // Keyword map: skinType + goal → Arabic keywords to search in descriptionAR/nameAR
      const keywordMap = {
        oily:      { acne: ['صابون','تنظيف','تصبغ','حبوب','بقع','دهن'], hydration: ['خفيف','مائي','ترطيب'], glow: ['إشراق','فيتامين','توحيد'], lift: ['شد','كريم'] },
        dry:       { acne: ['كريم','تصبغ'], hydration: ['ترطيب','مرطب','نعومة','رطوبة','زيت'], glow: ['إشراق','مغذي','نضارة'], lift: ['شد','كولاجين','مضاد'] },
        mixed:     { acne: ['صابون','تصبغ','تنظيف'], hydration: ['ترطيب','مرطب'], glow: ['إشراق','توحيد','فيتامين'], lift: ['شد','مضاد'] },
        sensitive: { acne: ['لطيف','صابون','كريم'], hydration: ['ترطيب','مرطب','طبيعي'], glow: ['نضارة','خفيف','طبيعي'], lift: ['طبيعي','مغذي'] }
      };

      const keywords = (keywordMap[wizardData.type] || {})[wizardData.goal] || [];

      // Score each skincare product by keyword matches
      const skincare = all.filter(p => p.category === 'skincare');
      const scored = skincare.map(p => {
        const text = ((p.nameAR || '') + ' ' + (p.descriptionAR || '')).toLowerCase();
        const score = keywords.reduce((s, kw) => s + (text.includes(kw.toLowerCase()) ? 1 : 0), 0);
        return { p, score };
      }).sort((a, b) => b.score - a.score);

      // Take top 3, fallback to vitamins if not enough skincare
      let results = scored.slice(0, 3).map(x => x.p);
      if (results.length < 2) results = [...results, ...all.filter(p => p.category === 'vitamins').slice(0, 2 - results.length)];
      if (results.length === 0) results = all.slice(0, 3);

      list.innerHTML = '';
      results.forEach(p => {
        const card = createProductCard(p);
        list.appendChild(card);
      });
    }, 1200);
  }
    function renderStores() {
      const grid = document.getElementById('stores-grid');
      if (!grid || !STORES_LIST) return;
      grid.innerHTML = '';
      STORES_LIST.forEach(s => {
        const card = document.createElement('div');
        card.className = 'store-card';
        card.dataset.reveal = '';
        card.innerHTML = `
          <div class="store-banner">
            <img src="${s.image}" alt="${s.name}" loading="lazy"/>
          </div>
          <div class="store-info">
            <div class="store-emoji">${s.emoji}</div>
            <h3 class="store-name">${s.name}</h3>
            <p class="store-cat">${s.category}</p>
          </div>
        `;
        // Navigate on click (demo)
        card.addEventListener('click', () => {
          showToast(`✨ مرحباً بك في متجر ${s.name}! ✨`);
        });
        grid.appendChild(card);
      });
    }
    renderStores();

    // ── Bottom Nav Active Sync ──────────────────────
    const bottomNavItems = document.querySelectorAll('.mbn-item[data-tab]');
    bottomNavItems.forEach(item => {
      item.addEventListener('click', () => {
        bottomNavItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // Update bottom cart badge on load
    function updateBottomCartBadge() {
       const badge = document.querySelector('.mobile-bottom-nav .nav-item-badge');
       if (!badge) return;
       const cart = API.getCartLocal();
       const count = cart.reduce((sum, item) => sum + item.qty, 0);
       badge.textContent = count;
       badge.style.display = count > 0 ? 'flex' : 'none';
    }
    updateBottomCartBadge();
    document.addEventListener('cartUpdated', updateBottomCartBadge);

    // ── Global Product Search & Jump ────────────────
    const searchInput = document.getElementById('global-product-search');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('#category-sections .product-card');
        
        if (!query) {
          // Show all when search is empty
          allCards.forEach(card => card.style.display = '');
          document.querySelectorAll('#category-sections .cat-section-new, #category-sections .cat-section-box').forEach(section => {
            section.style.display = '';
          });
          return;
        }

        let firstMatch = null;
        allCards.forEach(card => {
          const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
          const catText = CAT_LABELS[card.getAttribute('data-cat')] || '';
          const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
          const sku = (card.getAttribute('data-sku') || '').toLowerCase();
          const productId = (card.getAttribute('data-id') || '').toLowerCase();
          if (title.includes(query) || catText.includes(query) || desc.includes(query) || sku.includes(query) || productId.includes(query)) {
            card.style.display = '';
            if (!firstMatch) firstMatch = card;
          } else {
            card.style.display = 'none';
          }
        });

        // Hide empty sections
        document.querySelectorAll('#category-sections .cat-section-new, #category-sections .cat-section-box').forEach(section => {
          const visibleCards = section.querySelectorAll('.product-card:not([style*="display: none"])');
          section.style.display = visibleCards.length === 0 ? 'none' : '';
        });

        // Scroll to first match and open product modal after delay
        if (firstMatch) {
          searchTimeout = setTimeout(() => {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight the card briefly
            firstMatch.style.transition = 'box-shadow 0.3s, transform 0.3s';
            firstMatch.style.boxShadow = '0 0 0 3px var(--gold), 0 8px 30px rgba(196,163,90,0.3)';
            firstMatch.style.transform = 'scale(1.03)';
            setTimeout(() => {
              firstMatch.style.boxShadow = '';
              firstMatch.style.transform = '';
            }, 1500);
            // Open product modal for full view
            const productId = firstMatch.getAttribute('data-id');
            if (productId) {
              openProductModal(productId);
            }
          }, 400);
        }
      });
    }

    // Smooth scroll for category jump pills
    document.querySelectorAll('.category-jump-pills .pill').forEach(pill => {
      pill.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
      });
    });

  });

// ══════════════════════════════════════════════
// 26. PWA SERVICE WORKER & INSTALL
// ══════════════════════════════════════════════
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW Registered', reg))
      .catch(err => console.log('SW Registration Failed', err));
  });
}

// ── PWA Smart Install ─────────────────────────────────
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// ── Hero LEGO Build Reveal ────────────────────────────
(function heroLegoReveal() {
  const heroBg = document.querySelector('#hero-bg-video') || document.querySelector('.hero-bg-image');
  const hero   = document.getElementById('hero');
  if (!heroBg || !hero) return;

  // For videos: show immediately, loop continuously, skip tile reveal
  if (heroBg.tagName === 'VIDEO') {
    heroBg.style.opacity = '1';
    heroBg.loop = true;
    // Animate the hero text elements in
    setTimeout(() => {
      ['hero-badge', 'hero-headline', 'hero-sub', 'hero-desc', 'hero-ctas'].forEach(cls => {
        const el = hero.querySelector('.' + cls) || (cls === 'hero-headline' ? hero.querySelector('h1') : null);
        if (el) gsap.from(el, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.3 });
      });
    }, 300);
    return;
  }

  // For images: use tile reveal animation
  const tileImgSrc = heroBg.src;

  const COLS = 20, ROWS = 12;

  // Hide video/image — tiles will show poster content instead
  heroBg.style.opacity = '0';

  // Build tile grid
  const overlay = document.createElement('div');
  overlay.id = 'hero-lego-overlay';
  overlay.style.cssText = [
    'position:absolute', 'inset:0', 'z-index:5', 'pointer-events:none',
    'display:grid',
    'grid-template-columns:repeat(' + COLS + ',1fr)',
    'grid-template-rows:repeat(' + ROWS + ',1fr)'
  ].join(';');

  const tiles = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tile = document.createElement('div');
      const xPct = (c / (COLS - 1)) * 100;
      const yPct = (r / (ROWS - 1)) * 100;
      tile.style.cssText = [
        'background-image:url(' + tileImgSrc + ')',
        'background-size:' + (COLS * 100) + '% ' + (ROWS * 100) + '%',
        'background-position:' + xPct + '% ' + yPct + '%',
        'transform:scale(0) translateY(12px)',
        'opacity:0',
        'will-change:transform,opacity',
        'transform-origin:center bottom'
      ].join(';');
      tiles.push({ el: tile, r, c });
      overlay.appendChild(tile);
    }
  }

  const heroContent = hero.querySelector('.hero-content');
  if (heroContent) hero.insertBefore(overlay, heroContent);
  else             hero.appendChild(overlay);

  // Hide hero text until tiles finish
  const textEls = [];

  function doReveal() {
    // Collect hero text elements and hide them
    ['hero-badge', 'hero-headline', 'hero-sub', 'hero-desc', 'hero-ctas'].forEach(cls => {
      const el = hero.querySelector('.' + cls) || (cls === 'hero-headline' ? hero.querySelector('h1') : null);
      if (el) { gsap.set(el, { opacity: 0, y: 30 }); textEls.push(el); }
    });

    // Sort tiles: bottom rows first (LEGO builds from ground up), left to right per row
    const sorted = [...tiles].sort((a, b) =>
      b.r !== a.r ? b.r - a.r : a.c - b.c
    );

    setTimeout(() => {
      const tl = gsap.timeline({
        onComplete() {
          // Swap overlay for real image
          gsap.to(heroBg,  { opacity: 1, duration: 0.25 });
          gsap.to(overlay, { opacity: 0, duration: 0.25,
            onComplete: () => overlay.remove()
          });

          // Pop hero text elements in one by one
          const tl2 = gsap.timeline({ delay: 0.2 });
          const badge    = hero.querySelector('.hero-badge');
          const headline = hero.querySelector('.hero-headline') || hero.querySelector('h1');
          const sub      = hero.querySelector('.hero-sub') || hero.querySelector('.hero-desc');
          const ctas     = hero.querySelector('.hero-ctas');
          if (badge)    tl2.to(badge,    { opacity:1, y:0, duration:0.7,  ease:'back.out(2.2)' }, 0);
          if (headline) tl2.to(headline, { opacity:1, y:0, duration:0.85, ease:'back.out(1.7)', scale:1 }, 0.22);
          if (sub)      tl2.to(sub,      { opacity:1, y:0, duration:0.75, ease:'power3.out'    }, 0.44);
          if (ctas)     tl2.to(ctas,     { opacity:1, y:0, duration:0.8,  ease:'back.out(1.8)' }, 0.64);
        }
      });

      // Animate each tile snapping into place
      sorted.forEach((tile, i) => {
        tl.fromTo(tile.el,
          { scale: 0, opacity: 0, y: 14 },
          { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: 'back.out(1.6)' },
          i * 0.016   // stagger — 240 tiles × 16 ms = ~3.8 s total
        );
      });
    }, 3800);
  }

  function onImgReady() {
    // Re-apply src to tiles in case it loaded after creation
    tiles.forEach(({ el, r, c }) => {
      el.style.backgroundImage = 'url(' + heroBg.src + ')';
    });
    doReveal();
  }

  if (heroBg.complete && heroBg.naturalWidth > 0) {
    onImgReady();
  } else {
    heroBg.addEventListener('load',  onImgReady, { once: true });
    heroBg.addEventListener('error', () => {
      heroBg.style.opacity = '1';
      overlay.remove();
    }, { once: true });
    onImgReady();
  }
})();

// ── Product Image Formation Observer ────────────────
(function initImgFormation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      if (entry.isIntersecting && !card.classList.contains('img-formed') && !card.classList.contains('img-forming')) {
        card.classList.add('img-forming');
        const img = card.querySelector('.card-img');
        const onEnd = () => {
          card.classList.remove('img-forming');
          card.classList.add('img-formed');
          img.removeEventListener('animationend', onEnd);
        };
        img.addEventListener('animationend', onEnd);
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  function observeCards() {
    document.querySelectorAll('.product-card.has-image:not(.img-formed):not(.img-forming)').forEach(card => {
      observer.observe(card);
    });
  }

  // Observe on initial load
  observeCards();

  // Re-observe when new cards are injected (e.g., category strips)
  const mutObs = new MutationObserver(() => observeCards());
  const catSections = document.getElementById('category-sections');
  const bestsellers = document.getElementById('bestsellers-track');
  if (catSections) mutObs.observe(catSections, { childList: true, subtree: true });
  if (bestsellers)  mutObs.observe(bestsellers,  { childList: true, subtree: true });
})();

document.getElementById('pwa-install-nav')?.addEventListener('click', () => {
  if (typeof triggerPwaInstall === 'function') triggerPwaInstall();
  else if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.then(() => { deferredPrompt = null; }); }
});

window.addEventListener('appinstalled', () => {
  document.getElementById('pwa-install-container').style.display = 'none';
  document.getElementById('pwa-installed-msg').style.display = 'block';
});

// Helper (outside DOMContentLoaded for ripple re-use)
function addRipple(e, btn) {
  if (!btn) return;
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height) * 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple-circle';
  ripple.style.cssText = `width:${size}px;height:${size}px;top:${e.clientY - rect.top - size/2}px;left:${e.clientX - rect.left - size/2}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
}

// ── Global image error handler ──────────────────────
window.addEventListener('error', function(e) {
  if (e.target && e.target.tagName === 'IMG' && !e.target.classList.contains('img-error-handled')) {
    e.target.classList.add('img-error-handled');
    e.target.src = 'assets/test-product.jpeg';
  }
}, true);
(function initPageWeb() {
  const canvas = document.getElementById('page-web-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
  }, { passive: true });

  const COUNT    = 35; // Reduced from 70
  const CONN_D   = 120; // Reduced from 160
  const COLOR_PT = 'rgba(107,45,78,';   // plum dots
  const COLOR_LN = 'rgba(201,168,76,';  // gold lines

  const pts = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r:  Math.random() * 2 + 1
  }));

  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

  let webFrame = 0;
  function tick() {
    webFrame++;
    if (webFrame % 2 !== 0) { requestAnimationFrame(tick); return; } // Skip every other frame

    ctx.clearRect(0, 0, W, H);

    // Move & bounce
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Subtle mouse repel
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const d2 = dx * dx + dy * dy;
      if (d2 < 120 * 120 && d2 > 0) {
        const d = Math.sqrt(d2);
        p.vx += (dx / d) * 0.15;
        p.vy += (dy / d) * 0.15;
      }
      // Speed cap
      const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (sp > 1.2) { p.vx = (p.vx / sp) * 1.2; p.vy = (p.vy / sp) * 1.2; }
    });

    // Draw connections
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONN_D) {
          const alpha = (1 - d / CONN_D) * 0.35;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = COLOR_LN + alpha + ')';
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = COLOR_PT + '0.5)';
      ctx.fill();
    });

    requestAnimationFrame(tick);
  }
  tick();
})();
