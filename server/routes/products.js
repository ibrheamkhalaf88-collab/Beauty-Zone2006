const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbQuery, dbGet } = require('../database');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

function formatProduct(p) {
  return { ...p, images: JSON.parse(p.images || '[]'), featured: !!p.featured, bestseller: !!p.bestseller };
}

router.get('/', (req, res) => {
  const { category, search, featured, bestseller } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (search) { sql += ' AND (name_ar LIKE ? OR name_en LIKE ? OR sku LIKE ?)'; const s = `%${search}%`; params.push(s, s, s); }
  if (featured) sql += ' AND featured = 1';
  if (bestseller) sql += ' AND bestseller = 1';
  sql += ' ORDER BY created_at DESC';
  res.json(dbQuery(sql, params).map(formatProduct));
});

router.get('/:id', (req, res) => {
  const p = dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!p) return res.status(404).json({ error: 'المنتج غير موجود' });
  res.json(formatProduct(p));
});

router.post('/', authMiddleware, adminOnly, (req, res) => {
  const { sku, name_ar, name_en, price, category, description_ar, stock, featured, bestseller, images } = req.body;
  if (!name_ar || !price || !category) return res.status(400).json({ error: 'الاسم والسعر والفئة مطلوبون' });

  const id = req.body.id || `product-${uuidv4().slice(0, 8)}`;
  if (dbGet('SELECT id FROM products WHERE id = ?', [id])) return res.status(409).json({ error: 'المعرف موجود مسبقاً' });

  dbQuery('INSERT INTO products (id, sku, name_ar, name_en, price, category, description_ar, stock, featured, bestseller, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, sku || null, name_ar, name_en || null, price, category, description_ar || null, stock || 0, featured ? 1 : 0, bestseller ? 1 : 0, JSON.stringify(images || [])]);

  res.json(formatProduct(dbGet('SELECT * FROM products WHERE id = ?', [id])));
});

router.put('/:id', authMiddleware, adminOnly, (req, res) => {
  if (!dbGet('SELECT id FROM products WHERE id = ?', [req.params.id])) return res.status(404).json({ error: 'المنتج غير موجود' });

  const { sku, name_ar, name_en, price, category, description_ar, stock, featured, bestseller, images } = req.body;
  if (sku !== undefined) dbQuery('UPDATE products SET sku = ? WHERE id = ?', [sku || null, req.params.id]);
  if (name_ar !== undefined) dbQuery('UPDATE products SET name_ar = ? WHERE id = ?', [name_ar, req.params.id]);
  if (name_en !== undefined) dbQuery('UPDATE products SET name_en = ? WHERE id = ?', [name_en || null, req.params.id]);
  if (price !== undefined) dbQuery('UPDATE products SET price = ? WHERE id = ?', [price, req.params.id]);
  if (category !== undefined) dbQuery('UPDATE products SET category = ? WHERE id = ?', [category, req.params.id]);
  if (description_ar !== undefined) dbQuery('UPDATE products SET description_ar = ? WHERE id = ?', [description_ar || null, req.params.id]);
  if (stock !== undefined) dbQuery('UPDATE products SET stock = ? WHERE id = ?', [stock, req.params.id]);
  if (featured !== undefined) dbQuery('UPDATE products SET featured = ? WHERE id = ?', [featured ? 1 : 0, req.params.id]);
  if (bestseller !== undefined) dbQuery('UPDATE products SET bestseller = ? WHERE id = ?', [bestseller ? 1 : 0, req.params.id]);
  if (images !== undefined) dbQuery('UPDATE products SET images = ? WHERE id = ?', [JSON.stringify(images), req.params.id]);

  dbQuery("UPDATE products SET updated_at = datetime('now') WHERE id = ?", [req.params.id]);
  res.json(formatProduct(dbGet('SELECT * FROM products WHERE id = ?', [req.params.id])));
});

router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  if (!dbGet('SELECT id FROM products WHERE id = ?', [req.params.id])) return res.status(404).json({ error: 'المنتج غير موجود' });
  dbQuery('DELETE FROM cart WHERE product_id = ?', [req.params.id]);
  dbQuery('DELETE FROM wishlist WHERE product_id = ?', [req.params.id]);
  dbQuery('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'تم حذف المنتج' });
});

module.exports = router;
