const express = require('express');
const { dbQuery, dbGet } = require('../database');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  const rows = dbQuery('SELECT key, value FROM settings');
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.json(settings);
});

router.put('/', authMiddleware, adminOnly, (req, res) => {
  for (const [key, value] of Object.entries(req.body)) {
    const existing = dbGet('SELECT key FROM settings WHERE key = ?', [key]);
    if (existing) dbQuery('UPDATE settings SET value = ? WHERE key = ?', [String(value), key]);
    else dbQuery('INSERT INTO settings (key, value) VALUES (?, ?)', [key, String(value)]);
  }
  res.json({ success: true });
});

router.get('/users', authMiddleware, adminOnly, (req, res) => {
  res.json(dbQuery("SELECT id, name, phone, email, role, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC"));
});

router.get('/stats', authMiddleware, adminOnly, (req, res) => {
  const totalProducts = dbGet('SELECT COUNT(*) as count FROM products').count;
  const totalOrders = dbGet('SELECT COUNT(*) as count FROM orders').count;
  const totalRevenue = dbGet("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'ملغي'").total;
  const totalUsers = dbGet("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").count;
  res.json({ totalProducts, totalOrders, totalRevenue, totalUsers });
});

module.exports = router;
