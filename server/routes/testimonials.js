const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbQuery, dbGet } = require('../database');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(dbQuery('SELECT * FROM testimonials ORDER BY created_at DESC'));
});

router.post('/', authMiddleware, adminOnly, (req, res) => {
  const { text, name, location, stars } = req.body;
  if (!text || !name) return res.status(400).json({ error: 'النص والاسم مطلوبان' });
  const id = uuidv4();
  dbQuery('INSERT INTO testimonials (id, text, name, location, stars, letter) VALUES (?, ?, ?, ?, ?, ?)', [id, text, name, location || null, stars || 5, name.charAt(0)]);
  res.json(dbGet('SELECT * FROM testimonials WHERE id = ?', [id]));
});

router.put('/:id', authMiddleware, adminOnly, (req, res) => {
  if (!dbGet('SELECT id FROM testimonials WHERE id = ?', [req.params.id])) return res.status(404).json({ error: 'التقييم غير موجود' });
  const { text, name, location, stars, store_reply } = req.body;
  if (text !== undefined) dbQuery('UPDATE testimonials SET text = ? WHERE id = ?', [text, req.params.id]);
  if (name !== undefined) dbQuery('UPDATE testimonials SET name = ? WHERE id = ?', [name, req.params.id]);
  if (location !== undefined) dbQuery('UPDATE testimonials SET location = ? WHERE id = ?', [location || null, req.params.id]);
  if (stars !== undefined) dbQuery('UPDATE testimonials SET stars = ? WHERE id = ?', [stars, req.params.id]);
  if (store_reply !== undefined) dbQuery('UPDATE testimonials SET store_reply = ? WHERE id = ?', [store_reply || null, req.params.id]);
  res.json(dbGet('SELECT * FROM testimonials WHERE id = ?', [req.params.id]));
});

router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  if (!dbGet('SELECT id FROM testimonials WHERE id = ?', [req.params.id])) return res.status(404).json({ error: 'التقييم غير موجود' });
  dbQuery('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
