/* ════════════════════════════════════════════════
   BEAUTY ZONE DATA — API + localStorage hybrid
   ════════════════════════════════════════════════ */

const GLOW_WHATSAPP = '972500000000';
const STORE_NAME    = 'Beauty Zone';
const STORE_NAME_AR = 'بيوتي زون';
const CAT_LABELS = { skincare: 'عناية بالبشرة', personal: 'عناية شخصية', makeup: 'مكياج ومستحضرات', vitamins: 'فيتامينات', scarves: 'شالات وأوشحة' };
const TESTIMONIALS = [];
const STORES_LIST = [
  { id: 'store-1', name: 'Beauty Zone', category: 'General Beauty', image: 'https://picsum.photos/seed/bz/300/300', emoji: '✨' },
  { id: 'store-2', name: 'Luxe Scents', category: 'Perfumes', image: 'https://picsum.photos/seed/luxe/300/300', emoji: '🌸' },
  { id: 'store-3', name: 'Silk & Style', category: 'Fashion & Scarves', image: 'https://picsum.photos/seed/silk/300/300', emoji: '🧣' },
  { id: 'store-4', name: 'Pure Skin', category: 'Medical Skincare', image: 'https://picsum.photos/seed/pure/300/300', emoji: '🧪' },
  { id: 'store-5', name: 'Beauty Zone Studio', category: 'Makeup Studio', image: 'https://picsum.photos/seed/bzstudio/300/300', emoji: '💄' }
];

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]);
}

const DB = {
  _ready: false,
  _initPromise: null,

  async init() {
    if (this._initPromise) return this._initPromise;
    this._initPromise = this._doInit();
    return this._initPromise;
  },

  async _doInit() {
    try {
      const products = await API.getProducts();
      localStorage.setItem('bz_products', JSON.stringify(products));
      const settings = await API.getSettings();
      if (settings.whatsapp) localStorage.setItem('bz_whatsapp', settings.whatsapp);
    } catch (e) {
      console.warn('⚠️ API not available, using localStorage cache only');
    }
    this._ready = true;
    document.dispatchEvent(new Event('dbReady'));
  },

  getProducts() {
    const raw = localStorage.getItem('bz_products');
    if (raw) { try { return JSON.parse(raw); } catch(e) {} }
    return [];
  },

  async refreshProducts() {
    try {
      const products = await API.getProducts();
      localStorage.setItem('bz_products', JSON.stringify(products));
      return products;
    } catch(e) { return this.getProducts(); }
  },

  saveProduct(product) {
    return API.saveProduct(product).then(p => this.refreshProducts());
  },

  saveProducts(products) {
    return API.saveProduct(products).then(p => this.refreshProducts());
  },

  async deleteProduct(id) {
    await API.deleteProduct(id);
    return this.refreshProducts();
  },

  getCart() {
    return JSON.parse(localStorage.getItem('bz_cart') || '[]');
  },

  saveCart(cart) {
    localStorage.setItem('bz_cart', JSON.stringify(cart));
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    API.addToCart = API.addToCart || function(){};
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

  getFAQs() { return JSON.parse(localStorage.getItem('bz_faq') || '[]'); },
  saveFAQs(faqs) { localStorage.setItem('bz_faq', JSON.stringify(faqs)); },
  getQuizOptions() { return JSON.parse(localStorage.getItem('bz_quiz') || '[]'); },
  saveQuizOptions(opts) { localStorage.setItem('bz_quiz', JSON.stringify(opts)); },
  getHeroConfig() { const r = localStorage.getItem('bz_hero_config'); return r ? JSON.parse(r) : null; },
  saveHeroConfig(config) { localStorage.setItem('bz_hero_config', JSON.stringify(config)); },

  generateOrderId() { return 'BZ-' + Math.floor(1000 + Math.random() * 9000); },

  getUsers() {
    const raw = localStorage.getItem('bz_users');
    return raw ? JSON.parse(raw) : [];
  },

  saveUser(user) {
    let users = this.getUsers();
    const idx = users.findIndex(u => u.phone === user.phone || u.email === user.email);
    if (idx !== -1) users[idx] = user;
    else users.push(user);
    localStorage.setItem('bz_users', JSON.stringify(users));
  },

  getCurrentUser() {
    try { const u = localStorage.getItem('bz_current_user'); return u ? JSON.parse(u) : null; } catch(e) { return null; }
  },

  setCurrentUser(user) {
    if (user && user.token) { localStorage.setItem('bz_token', user.token); delete user.token; }
    localStorage.setItem('bz_current_user', JSON.stringify(user));
    document.dispatchEvent(new CustomEvent('authUpdated', { detail: user }));
  },

  logoutUser() {
    localStorage.removeItem('bz_current_user');
    localStorage.removeItem('bz_token');
    document.dispatchEvent(new CustomEvent('authUpdated', { detail: null }));
  },

  getTestimonials() {
    const raw = localStorage.getItem('bz_testimonials');
    return raw ? JSON.parse(raw) : [];
  },

  saveTestimonials(list) {
    localStorage.setItem('bz_testimonials', JSON.stringify(list));
    document.dispatchEvent(new CustomEvent('testimonialsUpdated'));
  },

  getSocialLinks() {
    const raw = localStorage.getItem('bz_social');
    return raw ? JSON.parse(raw) : { instagram: '', facebook: '', whatsapp: localStorage.getItem('bz_whatsapp') || '972500000000' };
  },

  saveSocialLinks(links) {
    localStorage.setItem('bz_social', JSON.stringify(links));
    if (links.whatsapp) { localStorage.setItem('bz_whatsapp', links.whatsapp); API.saveSettings({ whatsapp: links.whatsapp }).catch(()=>{}); }
  }
};

DB.init();

window.DB = DB;
window.CAT_LABELS = CAT_LABELS;
window.TESTIMONIALS = TESTIMONIALS;
window.GLOW_WHATSAPP = GLOW_WHATSAPP;
window.STORES_LIST = STORES_LIST;
window.STORE_NAME = STORE_NAME;
window.STORE_NAME_AR = STORE_NAME_AR;
window.escapeHTML = escapeHTML;
