/* ════════════════════════════════════════════════
   BEAUTY ZONE API Client — replaces localStorage
   ════════════════════════════════════════════════ */

const API_BASE = window.location.port 
  ? `http://${window.location.hostname}:${window.location.port}`
  : window.location.origin;

const API = {

  // ── helpers ──────────────────────────────────
  _token() { return localStorage.getItem('bz_token'); },

  _sessionId() {
    let sid = localStorage.getItem('bz_session');
    if (!sid) { sid = 'sess-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8); localStorage.setItem('bz_session', sid); }
    return sid;
  },

  async _fetch(method, path, body = null) {
    const opts = { method, headers: {} };
    const token = API._token();
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    opts.headers['X-Session-Id'] = API._sessionId();
    if (body && !(body instanceof FormData)) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    } else if (body instanceof FormData) {
      opts.body = body;
    }
    try {
      const res = await fetch(API_BASE + '/api' + path, opts);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ في الاتصال');
      return data;
    } catch (e) {
      if (e.message === 'Failed to fetch') throw new Error('⚠️ الخادم غير متصل. تأكدي من تشغيل السيرفر');
      throw e;
    }
  },

  // ── Products ─────────────────────────────────
  _productFromServer(p) {
    return {
      id: p.id, nameAR: p.name_ar, nameEN: p.name_en, price: p.price, stock: p.stock,
      category: p.category, images: p.images || [], descriptionAR: p.description_ar,
      descriptionEN: p.description_en, sku: p.sku,
      featured: !!p.featured, bestseller: !!p.bestseller,
      is_deal: !!p.is_deal, deal_price: p.deal_price, original_price: p.original_price,
      discount_percentage: p.discount_percentage, deal_expires_at: p.deal_expires_at,
      created_at: p.created_at, updated_at: p.updated_at
    };
  },

  async getProducts(params = {}) {
    const q = new URLSearchParams(params).toString();
    const products = await API._fetch('GET', '/products' + (q ? '?' + q : ''));
    return (products || []).map(p => API._productFromServer(p));
  },

  async getProduct(id) {
    const p = await API._fetch('GET', '/products/' + id);
    return API._productFromServer(p);
  },

  async saveProduct(product) {
    // Map camelCase → snake_case for server
    const body = {
      name_ar: product.nameAR || product.name_ar,
      name_en: product.nameEN || product.name_en,
      description_ar: product.descriptionAR || product.description_ar || product.desc,
      price: product.price,
      stock: product.stock,
      category: product.category,
      images: product.images || [],
      featured: product.featured ? 1 : 0,
      bestseller: product.bestseller ? 1 : 0,
      sku: product.sku || null,
      is_deal: product.is_deal ? 1 : 0,
      deal_price: product.deal_price || null,
      original_price: product.original_price || null,
      discount_percentage: product.discount_percentage || null,
      deal_expires_at: product.deal_expires_at || null,
    };
    let res;
    if (product.id && (product.id.startsWith('product-') || product.id.startsWith('prod-'))) {
      body.id = product.id;
      res = await API._fetch('PUT', '/products/' + product.id, body);
    } else {
      if (product.id) body.id = product.id;
      res = await API._fetch('POST', '/products', body);
    }
    return API._productFromServer(res);
  },

  async deleteProduct(id) {
    return API._fetch('DELETE', '/products/' + id);
  },

  // ── Auth ─────────────────────────────────────
  async login(phone, password) {
    const data = await API._fetch('POST', '/auth/login', { phone, password });
    if (data.token) localStorage.setItem('bz_token', data.token);
    if (data.user) localStorage.setItem('bz_current_user', JSON.stringify(data.user));
    return data;
  },

  async register(name, phone, email, password) {
    const data = await API._fetch('POST', '/auth/register', { name, phone, email, password });
    if (data.token) localStorage.setItem('bz_token', data.token);
    if (data.user) localStorage.setItem('bz_current_user', JSON.stringify(data.user));
    return data;
  },

  async getMe() {
    const token = API._token();
    if (!token) return null;
    try {
      const user = await API._fetch('GET', '/auth/me');
      localStorage.setItem('bz_current_user', JSON.stringify(user));
      return user;
    } catch (e) {
      localStorage.removeItem('bz_token');
      localStorage.removeItem('bz_current_user');
      return null;
    }
  },

  async updateProfile(data) {
    const user = await API._fetch('PUT', '/auth/me', data);
    localStorage.setItem('bz_current_user', JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem('bz_token');
    localStorage.removeItem('bz_current_user');
    document.dispatchEvent(new CustomEvent('authUpdated', { detail: null }));
  },

  // ── Cart ─────────────────────────────────────
  async getCart() {
    return API._fetch('GET', '/cart');
  },

  async addToCart(productId, qty = 1) {
    return API._fetch('POST', '/cart', { product_id: productId, quantity: qty });
  },

  async updateCartItem(productId, quantity) {
    return API._fetch('PUT', '/cart/' + productId, { quantity });
  },

  async removeFromCart(productId) {
    return API._fetch('DELETE', '/cart/' + productId);
  },

  // ── Orders ───────────────────────────────────
  async getOrders() {
    return API._fetch('GET', '/orders');
  },

  async createOrder(data) {
    return API._fetch('POST', '/orders', data);
  },

  async updateOrderStatus(id, status) {
    return API._fetch('PUT', '/orders/' + id + '/status', { status });
  },

  // ── Testimonials ────────────────────────────
  async getTestimonials() {
    return API._fetch('GET', '/testimonials');
  },

  async saveTestimonial(data) {
    if (data.id) return API._fetch('PUT', '/testimonials/' + data.id, data);
    return API._fetch('POST', '/testimonials', data);
  },

  async deleteTestimonial(id) {
    return API._fetch('DELETE', '/testimonials/' + id);
  },

  // ── Settings ─────────────────────────────────
  async getSettings() {
    return API._fetch('GET', '/settings');
  },

  async saveSettings(data) {
    return API._fetch('PUT', '/settings', data);
  },

  async getUsers() {
    return API._fetch('GET', '/settings/users');
  },

  async getStats() {
    return API._fetch('GET', '/settings/stats');
  },

  // ── Uploads ──────────────────────────────────
  async uploadFile(file) {
    const fd = new FormData();
    fd.append('file', file);
    return API._fetch('POST', '/upload', fd);
  },

  async uploadMultiple(files) {
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    return API._fetch('POST', '/upload/multiple', fd);
  },

  async deleteFile(type, filename) {
    return API._fetch('DELETE', '/upload/' + type + '/' + filename);
  },

  // ── Fallback (localStorage bridge) ───────────
  getCachedProducts() {
    try { return JSON.parse(localStorage.getItem('bz_products_cache') || '[]'); } catch(e) { return []; }
  },

  setCachedProducts(products) {
    localStorage.setItem('bz_products_cache', JSON.stringify(products));
  },

  getCartLocal() {
    return JSON.parse(localStorage.getItem('bz_cart') || '[]');
  },

  saveCartLocal(cart) {
    localStorage.setItem('bz_cart', JSON.stringify(cart));
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  },

  getWishlist() {
    return JSON.parse(localStorage.getItem('bz_wishlist') || '[]');
  },

  saveWishlist(list) {
    localStorage.setItem('bz_wishlist', JSON.stringify(list));
  },

  // ── Payment Accounts ─────────────────────────────────
  async getPaymentAccounts() {
    return API._fetch('GET', '/payment/accounts');
  },

  async addPaymentAccount(data) {
    return API._fetch('POST', '/payment/accounts', data);
  },

  async getPaymentNotifications() {
    return API._fetch('GET', '/payment/notifications/my');
  },

  async submitPaymentNotification(data) {
    return API._fetch('POST', '/payment/notify', data);
  },

  async confirmPaymentNotification(id) {
    return API._fetch('PUT', '/payment/notifications/' + id + '/confirm', {});
  },

  async rejectPaymentNotification(id, reason) {
    return API._fetch('PUT', '/payment/notifications/' + id + '/reject', { reason });
  },

  // ── Conversations / Chat ─────────────────────────────────
  async getMyConversations() {
    return API._fetch('GET', '/payment/conversations/my');
  },

  async getConversationMessages(conversationId) {
    return API._fetch('GET', '/payment/conversations/' + conversationId + '/messages');
  },

  async sendChatMessage(conversationId, data) {
    return API._fetch('POST', '/payment/conversations/' + conversationId + '/messages', data);
  },

  async createConversation(orderId) {
    return API._fetch('POST', '/payment/conversations', { order_id: orderId });
  },

  async sendAutoMessage(conversationId, orderId) {
    return API._fetch('POST', '/payment/conversations/' + conversationId + '/messages/auto', { order_id: orderId });
  },

  async markConversationRead(conversationId) {
    return API._fetch('PUT', '/payment/conversations/' + conversationId + '/read', {});
  },

  async getUnreadCount() {
    return API._fetch('GET', '/payment/conversations/unread-count');
  }
};

window.API = API;
