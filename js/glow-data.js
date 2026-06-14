/* ════════════════════════════════════════════════
   BEAUTY ZONE DATA — Seed Products & localStorage
   ════════════════════════════════════════════════ */

const GLOW_WHATSAPP = '972500000000'; // رقم الواتساب الخاص بالمتجر
const STORE_NAME    = 'Beauty Zone';
const STORE_NAME_AR = 'بيوتي زون';

const SEED_PRODUCTS = [
  // ── عناية بالبشرة ──────────────────────────────
  {
    id: 'skincare-001',
    nameAR: 'ميلانوفري - كريم تفتيح الجلد 30جم',
    nameEN: 'Melanofree Topical Cream 30gm',
    price: 58,
    category: 'skincare',
    descriptionAR: 'كريم موضعي لمعالجة التصبغات والبقع الداكنة. للاستخدام الخارجي فقط. تركيبة طبية فعّالة وآمنة. 30 جرام.',
    images: ['/assets/WhatsApp_Image_2026-03-16_at_14.03.56.jpeg'],
    stock: 25,
    featured: true,
    bestseller: true
  },
  {
    id: 'skincare-002',
    nameAR: 'ميلانو صابون التبييض - أربوتين وحمض الكوجيك',
    nameEN: 'Melano Soap Whitening - Arbutin & Kojic Acid',
    price: 32,
    category: 'skincare',
    descriptionAR: 'صابون تبييض بتركيبة متطورة من الأربوتين وحمض الكوجيك مع توت العليق وفيتامين C. مناسب لجميع أنواع البشرة.',
    images: ['/assets/WhatsApp_Image_2026-03-16_at_14.03.57.jpeg'],
    stock: 40,
    featured: false,
    bestseller: true
  },
  {
    id: 'skincare-003',
    nameAR: 'كريم الفوت للسرو - العناية بالقدمين',
    nameEN: 'Foot Care Cream - Al Maiky',
    price: 45,
    category: 'skincare',
    descriptionAR: 'كريم طبيعي مُغذّي للقدمين بخلاصة نباتات فاخرة. يُرطّب ويُنعّم الجلد المتشقق. مستوحى من وصفات تراثية.',
    images: ['/assets/WhatsApp_Image_2026-03-16_at_14.03.57__1_.jpeg'],
    stock: 18,
    featured: true,
    bestseller: false
  },

  // ── عناية شخصية ────────────────────────────────
  {
    id: 'personal-001',
    nameAR: 'ميلانو ميلو بلي - جل مرطّب للعناية - توت العليق',
    nameEN: 'Melano Melo Ply - Lubricant Gel - Raspberry',
    price: 38,
    category: 'personal',
    descriptionAR: 'جل مرطّب للعناية الشخصية بنكهة توت العليق. قاعدة مائية آمنة ومريحة. آمن للاستخدام اليومي.',
    images: ['/assets/WhatsApp_Image_2026-03-16_at_14.03.57__2_.jpeg'],
    stock: 30,
    featured: true,
    bestseller: true
  },
  {
    id: 'personal-002',
    nameAR: 'ميلانو ميلو بلي - جل مرطّب للعناية - شوكولاتة',
    nameEN: 'Melano Melo Ply - Lubricant Gel - Chocolate',
    price: 38,
    category: 'personal',
    descriptionAR: 'جل مرطّب للعناية الشخصية بنكهة الشوكولاتة الدافئة. قاعدة مائية آمنة ومريحة. Safe & Fun.',
    images: ['/assets/WhatsApp_Image_2026-03-16_at_14.03.57__3_.jpeg'],
    stock: 28,
    featured: false,
    bestseller: true
  },
  {
    id: 'personal-003',
    nameAR: 'ميلانو ميلو بلي - جل مرطّب للعناية - موز',
    nameEN: 'Melano Melo Ply - Lubricant Gel - Banana',
    price: 38,
    category: 'personal',
    descriptionAR: 'جل مرطّب للعناية الشخصية بنكهة الموز الاستوائية. قاعدة مائية آمنة ومريحة. Safe & Fun.',
    images: ['/assets/WhatsApp_Image_2026-03-16_at_14.03.57__5_.jpeg'],
    stock: 22,
    featured: false,
    bestseller: false
  },

  // ── مكياج ──────────────────────────────────────
  {
    id: 'makeup-001',
    nameAR: 'مجموعة نيفيا - مزيل العرق فريش ناتشورال',
    nameEN: 'NIVEA Fresh Natural Deodorant Spray',
    price: 22,
    category: 'makeup',
    descriptionAR: 'مزيل عرق نيفيا فريش ناتشورال بدون ألومنيوم 0%. حماية 48 ساعة. رائحة منعشة وطبيعية. 150مل.',
    images: ['/assets/WhatsApp_Image_2026-03-16_at_14.03.58.jpeg'],
    stock: 50,
    featured: false,
    bestseller: true
  },
  {
    id: 'makeup-002',
    nameAR: 'نيفيا بلاك & وايت إنفيزيبل - مزيل عرق',
    nameEN: 'NIVEA Black & White Invisible Deodorant',
    price: 25,
    category: 'makeup',
    descriptionAR: 'مزيل عرق نيفيا بلاك وايت إنفيزيبل. حماية 72 ساعة. لا يُخلّف بقع بيضاء أو صفراء على الملابس.',
    images: ['/assets/WhatsApp_Image_2026-03-16_at_14.03.58__1_.jpeg'],
    stock: 35,
    featured: true,
    bestseller: false
  },

  // ── فيتامينات ───────────────────────────────────
  {
    id: 'vitamins-001',
    nameAR: 'كبسولات الكولاجين البحري المتوهج',
    nameEN: 'Marine Collagen Glow Capsules',
    price: 195,
    category: 'vitamins',
    descriptionAR: 'كولاجين بحري نقي يُعزز مرونة البشرة ويُقوّي الأظافر والشعر من الداخل. 60 كبسولة كافية لشهرين.',
    images: ['/assets/WhatsApp_Image_2026-03-16_at_14.03.58__4_.jpeg'],
    stock: 20,
    featured: true,
    bestseller: true
  },
  {
    id: 'vitamins-002',
    nameAR: 'فيتامين D3 + K2 المتكامل',
    nameEN: 'Vitamin D3 + K2 Complex',
    price: 135,
    category: 'vitamins',
    descriptionAR: 'تركيبة متطورة من D3 وK2 لصحة العظام والمناعة والجمال من الداخل. مناسب للاستخدام اليومي.',
    images: ['/assets/WhatsApp_Image_2026-03-16_at_14.03.58__5_.jpeg'],
    stock: 40,
    featured: false,
    bestseller: false
  }
];

const TESTIMONIALS = [
  { text: 'كريم ميلانوفري غيّر بشرتي بجد! بعد أسبوعين صار لوني أفتح وأصفى. متجر موثوق 100٪ ✨', name: 'سارة الأحمد', location: 'رام الله', stars: 5, letter: 'س' },
  { text: 'صابون ميلانو رائع جداً، جربته لأول مرة وما شاء الله فرق واضح. بنصح فيه كل بنت 🌸', name: 'نور محمد', location: 'نابلس', stars: 5, letter: 'ن' },
  { text: 'منتجات Beauty Zone أصلية 100٪ والتوصيل كان سريع جداً. شكراً للمتجر الرائع 💖', name: 'ريم سالم', location: 'الخليل', stars: 5, letter: 'ر' },
  { text: 'اشتريت مزيل نيفيا وهو أفضل شي استخدمته. حماية طول اليوم بدون بقع. ممتاز!', name: 'هنا العمري', location: 'بيت لحم', stars: 5, letter: 'ه' },
  { text: 'من أفضل متاجر الكوزمتكس بفلسطين. الخدمة ممتازة والمنتجات أصلية وبأسعار مناسبة', name: 'دانا حسين', location: 'القدس', stars: 5, letter: 'د' },
  { text: 'كريم القدمين تحفة! رجعت بشرتي ناعمة من أول استخدام. حلو والرائحة جميلة جداً 🌺', name: 'لمى يوسف', location: 'جنين', stars: 5, letter: 'ل' }
];

const STORES_LIST = [
  { id: 'store-1', name: 'Beauty Zone', category: 'General Beauty', image: 'https://picsum.photos/seed/bz/300/300', emoji: '✨' },
  { id: 'store-2', name: 'Luxe Scents', category: 'Perfumes', image: 'https://picsum.photos/seed/luxe/300/300', emoji: '🌸' },
  { id: 'store-3', name: 'Silk & Style', category: 'Fashion & Scarves', image: 'https://picsum.photos/seed/silk/300/300', emoji: '🧣' },
  { id: 'store-4', name: 'Pure Skin', category: 'Medical Skincare', image: 'https://picsum.photos/seed/pure/300/300', emoji: '🧪' },
  { id: 'store-5', name: 'Beauty Zone Studio', category: 'Makeup Studio', image: 'https://picsum.photos/seed/bzstudio/300/300', emoji: '💄' }
];

// ── Category Labels (updated) ──────────────────────────────
const CAT_LABELS = {
  skincare: 'عناية بالبشرة',
  personal: 'عناية شخصية',
  makeup:   'مكياج ومستحضرات',
  vitamins: 'فيتامينات'
};

// ── localStorage helpers ───────────────────────────
const DB = {
  getProducts() {
    const raw = localStorage.getItem('bz_products');
    if (!raw) {
      localStorage.setItem('bz_products', JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    let parsed;
    try { parsed = JSON.parse(raw); } catch(e) { parsed = []; }
    // Re-seed only if completely empty
    if (!Array.isArray(parsed) || !parsed.length) {
      localStorage.setItem('bz_products', JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    // Fix any remaining picsum URLs in-place without wiping products
    let dirty = false;
    parsed = parsed.map(p => {
      if (p.images && p.images.some(img => img && img.includes('picsum'))) {
        dirty = true;
        return { ...p, images: p.images.map(img => img && img.includes('picsum') ? '/assets/test-product.jpeg' : img) };
      }
      return p;
    });
    if (dirty) localStorage.setItem('bz_products', JSON.stringify(parsed));
    return parsed;
  },
  saveProducts(products) {
    localStorage.setItem('bz_products', JSON.stringify(products));
    document.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }));
  },
  getCart() {
    return JSON.parse(localStorage.getItem('bz_cart') || '[]');
  },
  saveCart(cart) {
    localStorage.setItem('bz_cart', JSON.stringify(cart));
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  },
  getWishlist() {
    return JSON.parse(localStorage.getItem('bz_wishlist') || '[]');
  },
  saveWishlist(list) {
    localStorage.setItem('bz_wishlist', JSON.stringify(list));
  },
  getOrders() {
    return JSON.parse(localStorage.getItem('bz_orders') || '[]');
  },
  saveOrder(order) {
    const orders = this.getOrders();
    orders.push(order);
    this.saveOrders(orders);
  },
  saveOrders(orders) {
    localStorage.setItem('bz_orders', JSON.stringify(orders));
    document.dispatchEvent(new CustomEvent('ordersUpdated', { detail: orders }));
  },
  getAnnouncement() {
    return localStorage.getItem('bz_announcement') || '✨ شحن مجاني للطلبات فوق 200 ₪ ✨ | 🌟 خصم 15% على أول طلب بـ كود: BZ15 🌟 | 💖 اكتشفي أجمل منتجات العناية بالبشرة والمكياج 💖';
  },
  saveAnnouncement(text) {
    localStorage.setItem('bz_announcement', text);
    document.dispatchEvent(new CustomEvent('announcementUpdated', { detail: text }));
  },
  getFAQs() {
    return JSON.parse(localStorage.getItem('bz_faq') || '[]');
  },
  saveFAQs(faqs) {
    localStorage.setItem('bz_faq', JSON.stringify(faqs));
  },
  getQuizOptions() {
    return JSON.parse(localStorage.getItem('bz_quiz') || '[]');
  },
  saveQuizOptions(opts) {
    localStorage.setItem('bz_quiz', JSON.stringify(opts));
  },
  getHeroConfig() {
    const raw = localStorage.getItem('bz_hero_config');
    return raw ? JSON.parse(raw) : null;
  },
  saveHeroConfig(config) {
    localStorage.setItem('bz_hero_config', JSON.stringify(config));
  },
  generateOrderId() {
    return 'BZ-' + Math.floor(1000 + Math.random() * 9000);
  },
  // ── USER MODULE ────────────────────────────
  getUsers() {
    const raw = localStorage.getItem('bz_users');
    if (!raw) {
      // Seed admin user by default
      const defaultUsers = [
        { id: 'admin-001', name: 'المدير', phone: 'admin', email: 'admin@beautyzone.ps', pass: 'admin123', role: 'admin', createdAt: new Date().toISOString() }
      ];
      localStorage.setItem('bz_users', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    try {
      const users = JSON.parse(raw);
      // Ensure admin exists
      if (!users.find(u => u.role === 'admin')) {
        users.push({ id: 'admin-001', name: 'المدير', phone: 'admin', email: 'admin@beautyzone.ps', pass: 'admin123', role: 'admin', createdAt: new Date().toISOString() });
        localStorage.setItem('bz_users', JSON.stringify(users));
      }
      return users;
    } catch(e) { return []; }
  },
  saveUser(user) {
    const users = this.getUsers();
    // Check if phone or email already exists
    const exists = users.findIndex(u => u.phone === user.phone || u.email === user.email);
    if (exists !== -1) {
      users[exists] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('bz_users', JSON.stringify(users));
  },
  getCurrentUser() {
    const user = localStorage.getItem('bz_current_user');
    return user ? JSON.parse(user) : null;
  },
  setCurrentUser(user) {
    localStorage.setItem('bz_current_user', JSON.stringify(user));
    document.dispatchEvent(new CustomEvent('authUpdated', { detail: user }));
  },
  logoutUser() {
    localStorage.removeItem('bz_current_user');
    document.dispatchEvent(new CustomEvent('authUpdated', { detail: null }));
  },
  getTestimonials() {
    const raw = localStorage.getItem('bz_testimonials');
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(TESTIMONIALS));
  },
  saveTestimonials(list) {
    localStorage.setItem('bz_testimonials', JSON.stringify(list));
  },
  getSocialLinks() {
    const raw = localStorage.getItem('bz_social');
    return raw ? JSON.parse(raw) : { instagram: '', facebook: '', whatsapp: '972500000000' };
  },
  saveSocialLinks(links) {
    localStorage.setItem('bz_social', JSON.stringify(links));
  }
};

// Make available globally
window.DB = DB;
window.TESTIMONIALS = TESTIMONIALS;
window.CAT_LABELS = CAT_LABELS;
window.GLOW_WHATSAPP = GLOW_WHATSAPP;
window.STORES_LIST = STORES_LIST;
window.STORE_NAME = STORE_NAME;
