require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB, seedIfEmpty, seedPaymentAccounts } = require('./database');

async function main() {
  await initDB();
  await seedIfEmpty();
  await seedPaymentAccounts();

  const app = express();
  const PORT = process.env.PORT || 3001;
  const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3001';

  app.use(cors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id']
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // ═══════════════════════════════════════
  // SECURITY HEADERS (OWASP + PT Report)
  // ═══════════════════════════════════════
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net cdnjs.cloudflare.com unpkg.com; " +
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net; " +
      "font-src 'self' fonts.gstatic.com fonts.googleapis.com; " +
      "img-src 'self' data: blob: https: http:; " +
      "media-src 'self' blob: https: http:; " +
      "connect-src 'self' https: http: ws: wss:; " +
      "frame-src 'none'; " +
      "object-src 'none'; " +
      "base-uri 'self'"
    );
    next();
  });

  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/testimonials', require('./routes/testimonials'));
  app.use('/api/cart', require('./routes/cart'));
  app.use('/api/settings', require('./routes/settings'));
  app.use('/api/payment', require('./routes/payment'));
  app.use('/api/upload', require('./routes/upload'));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'الملف كبير جداً. الحد 50MB' });
    res.status(500).json({ error: 'خطأ في الخادم' });
  });

  app.listen(PORT, () => {
    console.log(`\n╔══════════════════════════════════════╗`);
    console.log(`║   ✨ Beauty Zone Backend ✨          ║`);
    console.log(`║   http://localhost:${PORT}              ║`);
    console.log(`╚══════════════════════════════════════╝\n`);
  });
}

main().catch(e => { console.error('Startup error:', e); process.exit(1); });
