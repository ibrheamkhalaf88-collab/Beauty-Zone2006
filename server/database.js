const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'beautyzone.db');
let _db = null;
let _ready = false;

function getDBSync() {
  return _db;
}

async function initDB() {
  if (_ready) return _db;

  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    _db = new SQL.Database(buffer);
  } else {
    _db = new SQL.Database();
  }

  _db.run(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT UNIQUE NOT NULL, email TEXT, password_hash TEXT NOT NULL, role TEXT DEFAULT 'customer', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`);
  _db.run(`CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, sku TEXT, name_ar TEXT NOT NULL, name_en TEXT, price REAL NOT NULL, category TEXT NOT NULL, description_ar TEXT, stock INTEGER DEFAULT 0, featured INTEGER DEFAULT 0, bestseller INTEGER DEFAULT 0, images TEXT DEFAULT '[]', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`);
  _db.run(`CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id TEXT, customer_name TEXT, customer_phone TEXT, customer_address TEXT, items TEXT NOT NULL, total REAL NOT NULL, status TEXT DEFAULT 'جديد', notes TEXT, created_at TEXT DEFAULT (datetime('now')))`);
  _db.run(`CREATE TABLE IF NOT EXISTS testimonials (id TEXT PRIMARY KEY, text TEXT NOT NULL, name TEXT NOT NULL, location TEXT, stars INTEGER DEFAULT 5, letter TEXT, store_reply TEXT, created_at TEXT DEFAULT (datetime('now')))`);
  _db.run(`CREATE TABLE IF NOT EXISTS cart (id TEXT PRIMARY KEY, user_id TEXT, session_id TEXT, product_id TEXT NOT NULL, quantity INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')))`);
  _db.run(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`);
  _db.run(`CREATE TABLE IF NOT EXISTS wishlist (id TEXT PRIMARY KEY, user_id TEXT, session_id TEXT, product_id TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))`);
  _db.run(`CREATE TABLE IF NOT EXISTS payment_accounts (id TEXT PRIMARY KEY, account_name TEXT NOT NULL, bank_name TEXT NOT NULL, account_number TEXT NOT NULL, account_type TEXT DEFAULT 'bank', is_active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')))`);
  _db.run(`CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY, order_id TEXT, user_id TEXT, last_message TEXT, last_message_at TEXT, unread_admin INTEGER DEFAULT 0, unread_user INTEGER DEFAULT 0, status TEXT DEFAULT 'open', created_at TEXT DEFAULT (datetime('now')))`);
  _db.run(`CREATE TABLE IF NOT EXISTS chat_messages (id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, sender TEXT NOT NULL, message TEXT NOT NULL, message_type TEXT DEFAULT 'text', image_url TEXT, read_at TEXT, created_at TEXT DEFAULT (datetime('now')))`);
  _db.run(`CREATE TABLE IF NOT EXISTS payment_notifications (id TEXT PRIMARY KEY, order_id TEXT, user_id TEXT, account_id TEXT, amount REAL, reference TEXT, image_url TEXT, status TEXT DEFAULT 'pending', confirmed_by TEXT, confirmed_at TEXT, created_at TEXT DEFAULT (datetime('now')))`);

  _ready = true;
  return _db;
}

function saveDB() {
  if (!_db) return;
  const data = _db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function dbQuery(sql, params = []) {
  if (!_db) throw new Error('DB not initialized');
  const trimmed = sql.trim().toUpperCase();
  if (trimmed.startsWith('SELECT')) {
    const stmt = _db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  } else {
    _db.run(sql, params);
    saveDB();
    return { changes: _db.getRowsModified() };
  }
}

function dbGet(sql, params = []) {
  const rows = dbQuery(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// ── Reset Database (drop all + recreate) ────────
async function resetDB() {
  if (!_db) throw new Error('DB not initialized');
  const tables = ['users','products','orders','testimonials','cart','settings','wishlist','payment_accounts','conversations','chat_messages','payment_notifications'];
  for (const t of tables) _db.run(`DROP TABLE IF EXISTS ${t}`);
  await initDB();
  await seedIfEmpty();
  await seedPaymentAccounts();
  console.log('🔄 Database reset complete');
}

async function seedIfEmpty() {
  const row = dbGet('SELECT COUNT(*) as count FROM products');
  if (row && row.count > 0) return;

  const products = [
    ['skincare-001', 'BZ-001', 'ميلانوفري - كريم تفتيح الجلد 30جم', 'Melanofree Topical Cream 30gm', 58, 'skincare', 'كريم موضعي لمعالجة التصبغات والبقع الداكنة. تركيبة طبية فعّالة وآمنة. 30 جرام.', 25, 1, 1, '["/assets/WhatsApp_Image_2026-03-16_at_14.03.56.jpeg"]'],
    ['skincare-002', 'BZ-002', 'ميلانو صابون التبييض - أربوتين وحمض الكوجيك', 'Melano Soap Whitening - Arbutin & Kojic Acid', 32, 'skincare', 'صابون تبييض بتركيبة متطورة من الأربوتين وحمض الكوجيك مع توت العليق وفيتامين C.', 40, 0, 1, '["/assets/WhatsApp_Image_2026-03-16_at_14.03.57.jpeg"]'],
    ['skincare-003', 'BZ-003', 'كريم الفوت للسرو - العناية بالقدمين', 'Foot Care Cream - Al Maiky', 45, 'skincare', 'كريم طبيعي مُغذّي للقدمين بخلاصة نباتات فاخرة. يُرطّب ويُنعّم الجلد المتشقق.', 18, 1, 0, '["/assets/WhatsApp_Image_2026-03-16_at_14.03.57__1_.jpeg"]'],
    ['personal-001', 'BZ-004', 'ميلانو ميلو بلي - جل مرطّب - توت العليق', 'Melano Melo Ply - Gel - Raspberry', 38, 'personal', 'جل مرطّب للعناية الشخصية بنكهة توت العليق. قاعدة مائية آمنة.', 30, 1, 1, '["/assets/WhatsApp_Image_2026-03-16_at_14.03.57__2_.jpeg"]'],
    ['personal-002', 'BZ-005', 'ميلانو ميلو بلي - جل مرطّب - شوكولاتة', 'Melano Melo Ply - Gel - Chocolate', 38, 'personal', 'جل مرطّب للعناية الشخصية بنكهة الشوكولاتة. قاعدة مائية آمنة.', 28, 0, 1, '["/assets/WhatsApp_Image_2026-03-16_at_14.03.57__3_.jpeg"]'],
    ['personal-003', 'BZ-006', 'ميلانو ميلو بلي - جل مرطّب - موز', 'Melano Melo Ply - Gel - Banana', 38, 'personal', 'جل مرطّب للعناية الشخصية بنكهة الموز. قاعدة مائية آمنة.', 22, 0, 0, '["/assets/WhatsApp_Image_2026-03-16_at_14.03.57__5_.jpeg"]'],
    ['makeup-001', 'BZ-007', 'نيفيا فريش ناتشورال - مزيل عرق', 'NIVEA Fresh Natural Deodorant', 22, 'makeup', 'مزيل عرق نيفيا فريش ناتشورال بدون ألومنيوم. حماية 48 ساعة.', 50, 0, 1, '["/assets/WhatsApp_Image_2026-03-16_at_14.03.58.jpeg"]'],
    ['makeup-002', 'BZ-008', 'نيفيا بلاك & وايت - مزيل عرق', 'NIVEA Black & White Deodorant', 25, 'makeup', 'مزيل عرق نيفيا بلاك وايت إنفيزيبل. حماية 72 ساعة.', 35, 1, 0, '["/assets/WhatsApp_Image_2026-03-16_at_14.03.58__1_.jpeg"]'],
    ['vitamins-001', 'BZ-009', 'كبسولات الكولاجين البحري', 'Marine Collagen Capsules', 195, 'vitamins', 'كولاجين بحري نقي يُعزز مرونة البشرة ويُقوّي الأظافر والشعر. 60 كبسولة.', 20, 1, 1, '["/assets/WhatsApp_Image_2026-03-16_at_14.03.58__4_.jpeg"]'],
    ['vitamins-002', 'BZ-010', 'فيتامين D3 + K2 المتكامل', 'Vitamin D3 + K2 Complex', 135, 'vitamins', 'تركيبة متطورة من D3 وK2 لصحة العظام والمناعة والجمال.', 40, 0, 0, '["/assets/WhatsApp_Image_2026-03-16_at_14.03.58__5_.jpeg"]']
  ];

  for (const p of products) _db.run('INSERT INTO products (id, sku, name_ar, name_en, price, category, description_ar, stock, featured, bestseller, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', p);

  const adminHash = bcrypt.hashSync('admin123', 10);
  _db.run("INSERT OR IGNORE INTO users (id, name, phone, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)", ['admin-001', 'المدير', 'admin', 'admin@beautyzone.ps', adminHash, 'admin']);

  const testimonials = [
    ['t1', 'كريم ميلانوفري غيّر بشرتي! بعد أسبوعين صار لوني أفتح وأصفى.', 'سارة الأحمد', 'رام الله', 5, 'س'],
    ['t2', 'صابون ميلانو رائع جداً، جربته لأول مرة وما شاء الله فرق واضح.', 'نور محمد', 'نابلس', 5, 'ن'],
    ['t3', 'منتجات Beauty Zone أصلية 100٪ والتوصيل سريع جداً.', 'ريم سالم', 'الخليل', 5, 'ر'],
    ['t4', 'اشتريت مزيل نيفيا وهو أفضل شي استخدمته. حماية طول اليوم.', 'هنا العمري', 'بيت لحم', 5, 'ه'],
    ['t5', 'من أفضل متاجر الكوزمتكس. الخدمة ممتازة والمنتجات أصلية.', 'دانا حسين', 'القدس', 5, 'د'],
    ['t6', 'كريم القدمين تحفة! رجعت بشرتي ناعمة من أول استخدام.', 'لمى يوسف', 'جنين', 5, 'ل']
  ];
  for (const t of testimonials) _db.run('INSERT INTO testimonials (id, text, name, location, stars, letter) VALUES (?, ?, ?, ?, ?, ?)', t);

  const settings = [
    ['announcement', '✨ شحن مجاني للطلبات فوق 200 ₪ ✨ | 🌟 خصم 15% على أول طلب بـ كود: BZ15 🌟'],
    ['whatsapp', '972500000000'],
    ['store_name', 'Beauty Zone'],
    ['store_name_ar', 'بيوتي زون']
  ];
  for (const s of settings) _db.run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', s);

  saveDB();
  console.log('✅ Database seeded');
}

async function seedPaymentAccounts() {
  const accounts = [
    ['acc-001', 'أحمد محمد', 'بنك فلسطين', '0123456789', 'bank', 1],
    ['acc-002', 'أحمد محمد', 'محفظة JawalPay', '0791234567', 'jawalpay', 1]
  ];
  for (const a of accounts) {
    _db.run('INSERT OR IGNORE INTO payment_accounts (id, account_name, bank_name, account_number, account_type, is_active) VALUES (?, ?, ?, ?, ?, ?)', a);
  }
  saveDB();
}

module.exports = { initDB, getDBSync, dbQuery, dbGet, saveDB, seedIfEmpty, seedPaymentAccounts, resetDB };
