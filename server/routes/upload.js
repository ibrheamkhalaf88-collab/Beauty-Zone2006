const express = require('express');
const path = require('path');
const fs = require('fs');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/', authMiddleware, adminOnly, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'لم يتم رفع ملف' });
  const isVideo = req.file.mimetype.startsWith('video/');
  res.json({ success: true, url: (isVideo ? '/uploads/videos/' : '/uploads/images/') + req.file.filename, filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size });
});

router.post('/multiple', authMiddleware, adminOnly, upload.array('files', 10), (req, res) => {
  if (!req.files || !req.files.length) return res.status(400).json({ error: 'لم يتم رفع ملفات' });
  res.json({ success: true, files: req.files.map(f => ({ url: (f.mimetype.startsWith('video/') ? '/uploads/videos/' : '/uploads/images/') + f.filename, filename: f.filename, mimetype: f.mimetype, size: f.size })) });
});

router.get('/assets', authMiddleware, adminOnly, (req, res) => {
  const imagesDir = path.join(__dirname, '..', 'uploads', 'images');
  const videosDir = path.join(__dirname, '..', 'uploads', 'videos');
  const assets = [];
  try {
    if (fs.existsSync(imagesDir)) {
      fs.readdirSync(imagesDir).forEach(f => {
        assets.push({ name: f, url: '/uploads/images/' + f, type: 'image', size: fs.statSync(path.join(imagesDir, f)).size });
      });
    }
    if (fs.existsSync(videosDir)) {
      fs.readdirSync(videosDir).forEach(f => {
        assets.push({ name: f, url: '/uploads/videos/' + f, type: 'video', size: fs.statSync(path.join(videosDir, f)).size });
      });
    }
  } catch(e) { return res.status(500).json({ error: 'خطأ في قراءة الملفات' }); }
  res.json(assets);
});

router.delete('/:type/:filename', authMiddleware, adminOnly, (req, res) => {
  if (!['images', 'videos'].includes(req.params.type)) return res.status(400).json({ error: 'نوع غير صالح' });
  const fp = path.join(__dirname, '..', 'uploads', req.params.type, req.params.filename);
  if (fs.existsSync(fp)) { fs.unlinkSync(fp); res.json({ success: true }); }
  else res.status(404).json({ error: 'الملف غير موجود' });
});

module.exports = router;
