/* ════════════════════════════════════════════════════
   BEAUTY ZONE — UPGRADE FEATURES JS
   1. Flash Deals + Countdown
   2. Search Autocomplete
   3. Stock Scarcity indicator injection
   4. Scroll-to-top + Bottom nav autohide
   5. Live social proof badge
   6. Promo strip
   7. Bottom nav active state
   ════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════
     1. FLASH DEALS + COUNTDOWN TIMER
     ════════════════════════════════════ */
  (function initFlashDeals() {
    const track = document.getElementById('fd-track');
    if (!track) return;

    const products = (typeof DB !== 'undefined' ? DB.getProducts() : []);
    // Pick featured/bestseller products as deals (max 6)
    const dealProducts = products
      .filter(p => p.featured || p.bestseller)
      .slice(0, 6);

    if (!dealProducts.length) {
      document.getElementById('flash-deals')?.remove();
      return;
    }

    dealProducts.forEach(p => {
      const img = p.images?.[0] || 'assets/test-product.jpeg';
      const origPrice = Math.round(p.price * 1.25);
      const discount  = Math.round(((origPrice - p.price) / origPrice) * 100);
      const soldPct   = Math.min(95, 30 + Math.floor(Math.random() * 60));

      const card = document.createElement('div');
      card.className = 'fd-card';
      card.innerHTML = `
        <div style="position:relative">
          <img class="fd-card-img" src="${img}" alt="${p.nameAR}" loading="lazy">
          <span class="fd-discount-tag">-${discount}%</span>
        </div>
        <div class="fd-card-body">
          <p class="fd-card-name">${p.nameAR}</p>
          <div class="fd-card-prices">
            <span class="fd-card-new">${p.price} ₪</span>
            <span class="fd-card-old">${origPrice} ₪</span>
          </div>
          <div class="fd-stock-bar">
            <div class="fd-stock-fill" style="width:${soldPct}%"></div>
          </div>
          <p class="fd-sold-label">تم بيع ${soldPct}%</p>
        </div>
      `;
      card.addEventListener('click', () => {
        if (typeof openQuickView === 'function') openQuickView(p.id);
        else if (typeof openProductModal === 'function') openProductModal(p.id);
      });
      track.appendChild(card);
    });

    // ── Countdown to midnight ──
    function updateCountdown() {
      const now  = new Date();
      const end  = new Date();
      end.setHours(23, 59, 59, 0);
      const diff = Math.max(0, end - now);

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      const pad = n => String(n).padStart(2, '0');
      const hEl = document.getElementById('fd-h');
      const mEl = document.getElementById('fd-m');
      const sEl = document.getElementById('fd-s');

      if (hEl) hEl.textContent = pad(h);
      if (mEl) mEl.textContent = pad(m);
      if (sEl) sEl.textContent = pad(s);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  })();


  /* ════════════════════════════════════
     2. SEARCH AUTOCOMPLETE
     ════════════════════════════════════ */
  (function initSearchAutocomplete() {
    const input = document.getElementById('global-product-search');
    const box   = document.getElementById('search-autocomplete');
    if (!input || !box) return;

    const products = (typeof DB !== 'undefined' ? DB.getProducts() : []);
    const labels   = (typeof CAT_LABELS !== 'undefined' ? CAT_LABELS : {});

    let debounceTimer;

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = input.value.trim().toLowerCase();
        if (q.length < 1) { closeAC(); return; }

        const matches = products.filter(p =>
          (p.nameAR || '').toLowerCase().includes(q) ||
          (p.nameEN || '').toLowerCase().includes(q) ||
          (labels[p.category] || '').toLowerCase().includes(q)
        ).slice(0, 7);

        renderAC(matches, q);
      }, 160);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim().length >= 1) box.classList.add('open');
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !box.contains(e.target)) closeAC();
    });

    function renderAC(items, q) {
      box.innerHTML = '';
      if (!items.length) {
        box.innerHTML = `<div class="ac-empty">🔍 لا توجد نتائج لـ "${q}"</div>`;
        box.classList.add('open');
        return;
      }

      items.forEach(p => {
        const img = p.images?.[0] || 'assets/test-product.jpeg';
        const row = document.createElement('div');
        row.className = 'ac-item';
        row.innerHTML = `
          <img class="ac-thumb" src="${img}" alt="${p.nameAR}" loading="lazy">
          <div class="ac-info">
            <p class="ac-name">${highlight(p.nameAR, q)}</p>
            <p class="ac-cat">${labels[p.category] || p.category}</p>
          </div>
          <span class="ac-price">${p.price} ₪</span>
        `;
        row.addEventListener('click', () => {
          closeAC();
          input.value = p.nameAR;
          if (typeof openQuickView === 'function') openQuickView(p.id);
          else if (typeof openProductModal === 'function') openProductModal(p.id);
        });
        box.appendChild(row);
      });

      box.classList.add('open');
    }

    function highlight(text, q) {
      if (!q) return text;
      const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(re, '<mark style="background:rgba(201,168,76,0.3);border-radius:2px;padding:0 1px">$1</mark>');
    }

    function closeAC() {
      box.classList.remove('open');
      box.innerHTML = '';
    }
  })();


  /* ════════════════════════════════════
     3. STOCK SCARCITY ON CARDS
     ════════════════════════════════════ */
  (function injectScarcityBadges() {
    function addBadges() {
      document.querySelectorAll('.product-card:not([data-scarcity-done])').forEach(card => {
        card.setAttribute('data-scarcity-done', '1');
        const stock = parseInt(card.getAttribute('data-stock') || '99', 10);
        if (stock <= 5 && stock > 0) {
          const imgWrap = card.querySelector('.card-img-wrap');
          if (imgWrap && !imgWrap.querySelector('.stock-scarcity')) {
            const tag = document.createElement('div');
            tag.className = 'stock-scarcity';
            tag.textContent = `آخر ${stock} قطع!`;
            imgWrap.appendChild(tag);
          }
        }
      });
    }

    // Run on load and when new cards are added
    addBadges();
    const obs = new MutationObserver(addBadges);
    const container = document.getElementById('category-sections');
    if (container) obs.observe(container, { childList: true, subtree: true });

    // Expose globally so glow-main can call after render
    window.refreshScarcityBadges = addBadges;
  })();


  /* ════════════════════════════════════
     4. SCROLL-TO-TOP + BOTTOM NAV AUTOHIDE
     ════════════════════════════════════ */
  (function initScrollBehaviors() {
    const topBtn = document.getElementById('scroll-top-btn');
    const nav    = document.getElementById('mobile-bottom-nav');
    let lastScrollY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;

          // Show/hide scroll-to-top
          if (topBtn) {
            topBtn.classList.toggle('visible', y > 500);
          }

          // Autohide nav on scroll down, show on scroll up
          if (nav && window.innerWidth < 769) {
            const isDown = y > lastScrollY && y > 200;
            nav.classList.toggle('hidden-nav', isDown);
          }

          lastScrollY = y;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    if (topBtn) {
      topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  })();


  /* ════════════════════════════════════
     5. LIVE SOCIAL PROOF BADGE
     ════════════════════════════════════ */
  (function initSocialProof() {
    const msgs = [
      { count: 12, label: 'شخص يتصفح الآن' },
      { count:  3, label: 'طلبت مؤخراً' },
      { count:  7, label: 'أضافوا للسلة' },
      { count: 18, label: 'يشاهدون هذا المنتج' },
      { count:  2, label: 'قطع متبقية فقط' }
    ];

    let badge = null;
    let hideTimer, showTimer;

    function showBadge() {
      if (badge) badge.remove();
      const m = msgs[Math.floor(Math.random() * msgs.length)];
      badge = document.createElement('div');
      badge.className = 'live-badge';
      badge.innerHTML = `<span class="live-dot"></span> <strong>${m.count}</strong>&nbsp;${m.label}`;
      document.body.appendChild(badge);

      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        badge?.remove();
        badge = null;
      }, 5000);

      clearTimeout(showTimer);
      showTimer = setTimeout(showBadge, 12000 + Math.random() * 10000);
    }

    // Start after 8 seconds
    setTimeout(showBadge, 8000);
  })();


  /* ════════════════════════════════════
     6. PROMO STRIP INJECTION
     ════════════════════════════════════ */
  (function injectPromoStrip() {
    const container = document.getElementById('category-sections');
    if (!container) return;

    const items = [
      '✨ شحن مجاني للطلبات فوق 200 ₪',
      '💄 أكثر من 100 منتج أصيل',
      '🌿 منتجات عناية طبيعية 100%',
      '⚡ توصيل سريع لباب بيتك',
      '🎁 خصم 15% على أول طلب — كود: BZ15',
      '💎 ضمان الأصالة أو المال يرجع'
    ];

    // Double items for seamless loop
    const allItems = [...items, ...items];

    const strip = document.createElement('div');
    strip.className = 'promo-strip';
    strip.innerHTML = `
      <div class="promo-strip-inner">
        ${allItems.map(t => `<span class="promo-strip-item">${t}<span class="promo-strip-dot"></span></span>`).join('')}
      </div>
    `;

    // Insert after category-sections
    container.insertAdjacentElement('afterend', strip);
  })();


  /* ════════════════════════════════════
     7. BOTTOM NAV ACTIVE STATE & CART BADGE
     ════════════════════════════════════ */
  (function initBottomNavBehavior() {
    const badge = document.getElementById('mbn-cart-badge');

    function updateBadge() {
      if (!badge || typeof DB === 'undefined') return;
      const count = DB.getCart().reduce((s, i) => s + i.qty, 0);
      badge.textContent = count;
      badge.dataset.count = count;
    }

    updateBadge();
    document.addEventListener('cartUpdated', updateBadge);

    // Scroll-spy for active tab
    const sections = [
      { id: 'hero',           tab: 'home' },
      { id: 'flash-deals',    tab: 'home' },
      { id: 'category-sections', tab: 'home' },
    ];

    // Search tab → scroll to search input
    const searchTab = document.getElementById('mbn-search');
    if (searchTab) {
      searchTab.addEventListener('click', (e) => {
        e.preventDefault();
        const inp = document.getElementById('global-product-search');
        if (inp) {
          inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => inp.focus(), 400);
        }
        setActive('search');
      });
    }

    // Active item styling
    const items = document.querySelectorAll('.mbn-item[data-tab]');

    function setActive(tab) {
      items.forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
    }

    items.forEach(el => {
      if (el.id === 'mbn-search') return;
      el.addEventListener('click', () => setActive(el.dataset.tab));
    });

    // Scroll spy
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive('home');
      });
    }, { threshold: 0.3 });

    document.getElementById('hero') && observer.observe(document.getElementById('hero'));
  })();

});
