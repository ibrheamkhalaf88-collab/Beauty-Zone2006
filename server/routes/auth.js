const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { dbQuery, dbGet } = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/register', (req, res) => {
  const { name, phone, email, password } = req.body;
  if (!name || !phone || !password) return res.status(400).json({ error: 'الاسم ورقم الهاتف وكلمة المرور مطلوبون' });
  if (phone.length < 8) return res.status(400).json({ error: 'رقم الهاتف غير صحيح' });
  if (password.length < 4) return res.status(400).json({ error: 'كلمة المرور 4 أحرف على الأقل' });

  if (dbGet('SELECT id FROM users WHERE phone = ?', [phone])) return res.status(409).json({ error: 'رقم الهاتف مسجل مسبقاً' });

  const id = uuidv4();
  const hash = bcrypt.hashSync(password, 10);
  dbQuery("INSERT INTO users (id, name, phone, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)", [id, name, phone, email || null, hash, 'customer']);

  const token = jwt.sign({ id, phone, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id, name, phone, email: email || '', role: 'customer' } });
});

router.post('/login', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'رقم الهاتف وكلمة المرور مطلوبان' });

  let user;
  try { user = dbGet('SELECT * FROM users WHERE phone = ?', [phone]); } catch (e) {
    return res.status(500).json({ error: 'خطأ في الخادم: ' + e.message });
  }
  if (!user || !bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'رقم الهاتف أو كلمة المرور غير صحيحة' });

  const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email || '', role: user.role } });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = dbGet('SELECT id, name, phone, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });
  res.json(user);
});

router.put('/me', authMiddleware, (req, res) => {
  const { name, email, password, currentPassword } = req.body;
  const user = dbGet('SELECT * FROM users WHERE id = ?', [req.user.id]);
  if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });

  if (password) {
    if (!currentPassword || !bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(403).json({ error: 'كلمة المرور الحالية غير صحيحة' });
    }
    const hash = bcrypt.hashSync(password, 10);
    dbQuery('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
  }
  if (name) dbQuery('UPDATE users SET name = ? WHERE id = ?', [name, req.user.id]);
  if (email !== undefined) dbQuery('UPDATE users SET email = ? WHERE id = ?', [email || null, req.user.id]);
  dbQuery("UPDATE users SET updated_at = datetime('now') WHERE id = ?", [req.user.id]);

  const updated = dbGet('SELECT id, name, phone, email, role FROM users WHERE id = ?', [req.user.id]);
  res.json(updated);
});

router.post('/forgot-password', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'رقم الهاتف وكلمة المرور مطلوبان' });
  if (password.length < 4) return res.status(400).json({ error: 'كلمة المرور 4 أحرف على الأقل' });

  const user = dbGet('SELECT id FROM users WHERE phone = ?', [phone]);
  if (!user) return res.status(404).json({ error: 'رقم الهاتف غير مسجل' });

  const hash = bcrypt.hashSync(password, 10);
  dbQuery("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?", [hash, user.id]);
  res.json({ success: true, message: 'تم تحديث كلمة المرور' });
});

module.exports = router;
