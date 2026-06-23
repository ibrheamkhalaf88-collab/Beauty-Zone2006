const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { dbQuery, dbGet } = require('../database');
const router = express.Router();

function getOwner(req) {
  let token;
  try { token = req.headers.authorization?.split(' ')[1]; if (token) { const d = jwt.verify(token, process.env.JWT_SECRET); return { user_id: d.id, session_id: null }; } } catch(e) {}
  const sid = req.headers['x-session-id'];
  if (sid) return { user_id: null, session_id: sid };
  return null;
}

router.get('/', (req, res) => {
  const owner = getOwner(req);
  if (!owner) return res.json([]);
  const items = dbQuery(
    owner.user_id
      ? 'SELECT c.*, p.name_ar as name, p.price, p.images FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?'
      : 'SELECT c.*, p.name_ar as name, p.price, p.images FROM cart c JOIN products p ON c.product_id = p.id WHERE c.session_id = ?',
    [owner.user_id || owner.session_id]
  );
  res.json(items.map(i => ({ id: i.product_id, qty: i.quantity, name: i.name, price: i.price, image: JSON.parse(i.images || '[]')[0] || '' })));
});

router.post('/', (req, res) => {
  const owner = getOwner(req);
  if (!owner) return res.status(400).json({ error: 'الجلسة غير معروفة' });
  const { product_id, quantity } = req.body;
  if (!product_id) return res.status(400).json({ error: 'معرف المنتج مطلوب' });

  const existing = dbGet(
    owner.user_id ? 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?' : 'SELECT * FROM cart WHERE session_id = ? AND product_id = ?',
    [owner.user_id || owner.session_id, product_id]
  );

  if (existing) {
    dbQuery('UPDATE cart SET quantity = ? WHERE id = ?', [existing.quantity + (quantity || 1), existing.id]);
  } else {
    dbQuery(
      owner.user_id ? 'INSERT INTO cart (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)' : 'INSERT INTO cart (id, session_id, product_id, quantity) VALUES (?, ?, ?, ?)',
      [uuidv4(), owner.user_id || owner.session_id, product_id, quantity || 1]
    );
  }
  res.json({ success: true });
});

router.put('/:productId', (req, res) => {
  const owner = getOwner(req);
  if (!owner) return res.status(400).json({ error: 'الجلسة غير معروفة' });
  const { quantity } = req.body;
  if (!quantity || quantity < 1) return res.status(400).json({ error: 'الكمية يجب أن تكون 1+' });
  dbQuery(owner.user_id ? 'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?' : 'UPDATE cart SET quantity = ? WHERE session_id = ? AND product_id = ?',
    [quantity, owner.user_id || owner.session_id, req.params.productId]);
  res.json({ success: true });
});

router.delete('/:productId', (req, res) => {
  const owner = getOwner(req);
  if (!owner) return res.json({ success: true });
  dbQuery(owner.user_id ? 'DELETE FROM cart WHERE user_id = ? AND product_id = ?' : 'DELETE FROM cart WHERE session_id = ? AND product_id = ?',
    [owner.user_id || owner.session_id, req.params.productId]);
  res.json({ success: true });
});

module.exports = router;
