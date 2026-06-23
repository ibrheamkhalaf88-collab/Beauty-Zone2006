/* ═══════════════════════════════════════════════════
   BEAUTY ZONE — Supabase Client
   ═══════════════════════════════════════════════════
   说明: 这个文件会在本地环境中使用 localStorage 作为回退，
   但在 Supabase 生产环境中使用真实的 Supabase 客户端。
   ═══════════════════════════════════════════════════ */

const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_KEY = window.SUPABASE_ANON_KEY || '';

const IS_SUPABASE = SUPABASE_URL && SUPABASE_KEY;

let supabase = null;
if (IS_SUPABASE) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// ── Generic API ───────────────────────────────────
const API = {
  // ── Auth ─────────────────────────────────────
  async signUp(email, password, name) {
    if (IS_SUPABASE) {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name } }
      });
      if (error) throw error;
      return data;
    }
    // Fallback: localStorage
    const users = JSON.parse(localStorage.getItem('bz_users') || '[]');
    const exists = users.find(u => u.email === email);
    if (exists) throw new Error('هذا الإيميل مسجل مسبقاً');
    const newUser = {
      id: 'user-' + Date.now(),
      name, email, phone: '', pass: password,
      role: 'user', createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('bz_users', JSON.stringify(users));
    localStorage.setItem('bz_current_user', JSON.stringify(newUser));
    return { user: newUser };
  },

  async signIn(email, password) {
    if (IS_SUPABASE) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }
    // Fallback: localStorage
    const users = JSON.parse(localStorage.getItem('bz_users') || '[]');
    const found = users.find(u => u.email === email && u.pass === password);
    if (!found) throw new Error('بيانات الدخول غير صحيحة');
    localStorage.setItem('bz_current_user', JSON.stringify(found));
    return { user: found };
  },

  async signOut() {
    if (IS_SUPABASE) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('bz_current_user');
  },

  async getCurrentUser() {
    if (IS_SUPABASE) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
      return data;
    }
    return JSON.parse(localStorage.getItem('bz_current_user') || 'null');
  },

  onAuthChange(callback) {
    if (IS_SUPABASE) {
      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          supabase.from('users').select('*').eq('id', session.user.id).single()
            .then(({ data }) => callback(data));
        } else {
          callback(null);
        }
      });
    } else {
      window.addEventListener('storage', (e) => {
        if (e.key === 'bz_current_user') {
          callback(JSON.parse(e.newValue || 'null'));
        }
      });
    }
  },

  // ── Products ──────────────────────────────────
  async getProducts() {
    if (IS_SUPABASE) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    // Fallback: localStorage
    const raw = localStorage.getItem('bz_products');
    if (!raw) return SEED_PRODUCTS;
    try { return JSON.parse(raw); } catch { return SEED_PRODUCTS; }
  },

  async getProduct(id) {
    if (IS_SUPABASE) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    }
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  },

  async saveProduct(product) {
    if (IS_SUPABASE) {
      const { data, error } = await supabase
        .from('products')
        .upsert([product])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    // Fallback: localStorage
    const products = JSON.parse(localStorage.getItem('bz_products') || '[]');
    const idx = products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...product };
    } else {
      products.push(product);
    }
    localStorage.setItem('bz_products', JSON.stringify(products));
    return product;
  },

  async deleteProduct(id) {
    if (IS_SUPABASE) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return;
    }
    const products = JSON.parse(localStorage.getItem('bz_products') || '[]')
      .filter(p => p.id !== id);
    localStorage.setItem('bz_products', JSON.stringify(products));
  },

  // ── Orders ────────────────────────────────────
  async getOrders() {
    if (IS_SUPABASE) {
      const user = await this.getCurrentUser();
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (user?.role !== 'admin') {
        query = query.eq('user_id', user?.id);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
    return JSON.parse(localStorage.getItem('bz_orders') || '[]');
  },

  async createOrder(orderData) {
    if (IS_SUPABASE) {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const orders = JSON.parse(localStorage.getItem('bz_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('bz_orders', JSON.stringify(orders));
    return orderData;
  },

  async updateOrderStatus(id, status) {
    if (IS_SUPABASE) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const orders = JSON.parse(localStorage.getItem('bz_orders') || '[]');
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      localStorage.setItem('bz_orders', JSON.stringify(orders));
    }
  },

  // ── Settings ──────────────────────────────────
  async getSetting(key) {
    if (IS_SUPABASE) {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single();
      if (error || !data) return null;
      return data.value;
    }
    const settings = JSON.parse(localStorage.getItem('bz_settings') || '{}');
    return settings[key] || null;
  },

  async saveSetting(key, value) {
    if (IS_SUPABASE) {
      const { error } = await supabase
        .from('settings')
        .upsert([{ key, value, updated_at: new Date().toISOString() }]);
      if (error) throw error;
      return;
    }
    const settings = JSON.parse(localStorage.getItem('bz_settings') || '{}');
    settings[key] = value;
    localStorage.setItem('bz_settings', JSON.stringify(settings));
  },

  // ── Testimonials ─────────────────────────────
  async getTestimonials() {
    if (IS_SUPABASE) {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    return JSON.parse(localStorage.getItem('bz_testimonials') || '[]');
  },

  async saveTestimonials(list) {
    if (IS_SUPABASE) {
      const { error } = await supabase.from('testimonials').upsert(list);
      if (error) throw error;
      return;
    }
    localStorage.setItem('bz_testimonials', JSON.stringify(list));
  },

  // ── Image Upload ───────────────────────────────
  async uploadImage(file, path = 'misc') {
    if (IS_SUPABASE) {
      const ext = file.name.split('.').pop();
      const fileName = `${path}/${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);
      return publicUrl;
    }
    // Fallback: return data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  async uploadProductImage(productId, file) {
    return this.uploadImage(file, `products/${productId}`);
  },

  async uploadSectionImage(section, file) {
    return this.uploadImage(file, `sections/${section}`);
  }
};

// Make available globally
window.API = API;