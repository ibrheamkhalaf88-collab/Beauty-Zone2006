const express = require('express');
const jwt = require('jsonwebtoken');
const { dbQuery, dbGet } = require('../database');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  if (req.user.role === 'admin') {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (search) { const s = `%${search}%`; sql += ' AND (id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)'; params.push(s, s, s); }
    sql += ' ORDER BY created_at DESC';
    res.json(dbQuery(sql, params).map(o => ({ ...o, items: JSON.parse(o.items || '[]') })));
  } else {
    res.json(dbQuery('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]).map(o => ({ ...o, items: JSON.parse(o.items || '[]') })));
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  const order = dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  if (!order) return res.status(404).json({ error: 'الطلب غير موجود' });
  if (req.user.role !== 'admin' && order.user_id !== req.user.id) return res.status(403).json({ error: 'لا يمكنك الاطلاع على هذا الطلب' });
  order.items = JSON.parse(order.items || '[]');
  res.json(order);
});

router.post('/', (req, res) => {
  const { items, total, customer_name, customer_phone, customer_address, notes } = req.body;
  if (!items || !items.length || !customer_name || !customer_phone) return res.status(400).json({ error: 'بيانات الطلب غير مكتملة' });

  const id = `BZ-${Math.floor(1000 + Math.random() * 9000)}`;
  let user_id = null;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) user_id = jwt.verify(token, process.env.JWT_SECRET || 'fallback').id;
  } catch(e) {}

  dbQuery('INSERT INTO orders (id, user_id, customer_name, customer_phone, customer_address, items, total, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, user_id, customer_name, customer_phone, customer_address || null, JSON.stringify(items), total, 'جديد', notes || null]);

  res.json({ id, message: 'تم إنشاء الطلب' });
});

router.put('/:id/status', authMiddleware, adminOnly, (req, res) => {
  const valid = ['جديد', 'قيد التجهيز', 'تم الشحن', 'مكتمل', 'ملغي'];
  if (!valid.includes(req.body.status)) return res.status(400).json({ error: 'حالة غير صالحة' });
  if (!dbGet('SELECT id FROM orders WHERE id = ?', [req.params.id])) return res.status(404).json({ error: 'الطلب غير موجود' });
  dbQuery('UPDATE orders SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
  res.json({ success: true, status: req.body.status });
});

module.exports = router;
