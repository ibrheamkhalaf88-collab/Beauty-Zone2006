const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { dbQuery, dbGet } = require('../database');
const router = express.Router();

// ── Payment Accounts ─────────────────────────────────

router.get('/accounts', (req, res) => {
  const accounts = dbQuery('SELECT * FROM payment_accounts WHERE is_active = 1 ORDER BY created_at DESC');
  res.json(accounts);
});

router.post('/accounts', adminOnly, (req, res) => {
  const { account_name, bank_name, account_number, account_type } = req.body;
  if (!account_name || !bank_name || !account_number) return res.status(400).json({ error: 'بيانات غير مكتملة' });
  const id = 'acc-' + Date.now();
  dbQuery('INSERT INTO payment_accounts (id, account_name, bank_name, account_number, account_type) VALUES (?, ?, ?, ?, ?)',
    [id, account_name, bank_name, account_number, account_type || 'bank']);
  res.json({ id, message: 'تم إضافة الحساب' });
});

router.put('/accounts/:id', adminOnly, (req, res) => {
  const { account_name, bank_name, account_number, account_type, is_active } = req.body;
  dbQuery('UPDATE payment_accounts SET account_name = COALESCE(?, account_name), bank_name = COALESCE(?, bank_name), account_number = COALESCE(?, account_number), account_type = COALESCE(?, account_type), is_active = COALESCE(?, is_active) WHERE id = ?',
    [account_name, bank_name, account_number, account_type, is_active, req.params.id]);
  res.json({ success: true });
});

router.delete('/accounts/:id', adminOnly, (req, res) => {
  dbQuery('UPDATE payment_accounts SET is_active = 0 WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Payment Notifications ─────────────────────────────────

router.post('/notify', authMiddleware, async (req, res) => {
  const { order_id, account_id, amount, reference, image_url } = req.body;
  if (!order_id || !amount) return res.status(400).json({ error: 'بيانات غير مكتملة' });

  const id = 'PN-' + Date.now();
  dbQuery('INSERT INTO payment_notifications (id, order_id, user_id, account_id, amount, reference, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, order_id, req.user.id, account_id || null, amount, reference || null, image_url || null, 'pending']);

  const notification = dbGet('SELECT * FROM payment_notifications WHERE id = ?', [id]);
  res.json(notification);
});

router.get('/notifications', adminOnly, (req, res) => {
  const { status } = req.query;
  let sql = `
    SELECT pn.*, u.name as user_name, u.phone as user_phone,
           o.items as order_items, o.total as order_total,
           pa.bank_name, pa.account_name, pa.account_number
    FROM payment_notifications pn
    LEFT JOIN users u ON pn.user_id = u.id
    LEFT JOIN orders o ON pn.order_id = o.id
    LEFT JOIN payment_accounts pa ON pn.account_id = pa.id
    WHERE 1=1
  `;
  const params = [];
  if (status) { sql += ' AND pn.status = ?'; params.push(status); }
  sql += ' ORDER BY pn.created_at DESC';

  const notifications = dbQuery(sql, params).map(n => ({
    ...n,
    order_items: JSON.parse(n.order_items || '[]')
  }));
  res.json(notifications);
});

router.get('/notifications/my', authMiddleware, (req, res) => {
  const notifications = dbQuery(`
    SELECT pn.*, o.items as order_items, o.total as order_total, o.status as order_status,
           pa.bank_name, pa.account_name, pa.account_number
    FROM payment_notifications pn
    LEFT JOIN orders o ON pn.order_id = o.id
    LEFT JOIN payment_accounts pa ON pn.account_id = pa.id
    WHERE pn.user_id = ?
    ORDER BY pn.created_at DESC
  `, [req.user.id]).map(n => ({
    ...n,
    order_items: JSON.parse(n.order_items || '[]')
  }));
  res.json(notifications);
});

router.put('/notifications/:id/confirm', adminOnly, (req, res) => {
  const notif = dbGet('SELECT * FROM payment_notifications WHERE id = ?', [req.params.id]);
  if (!notif) return res.status(404).json({ error: 'الإشعار غير موجود' });

  dbQuery('UPDATE payment_notifications SET status = ?, confirmed_by = ?, confirmed_at = datetime("now") WHERE id = ?',
    ['confirmed', req.user.id, req.params.id]);

  if (notif.order_id) {
    dbQuery('UPDATE orders SET status = ? WHERE id = ?', ['قيد التجهيز', notif.order_id]);
  }

  res.json({ success: true, message: 'تم تأكيد الدفع' });
});

router.put('/notifications/:id/reject', adminOnly, (req, res) => {
  const { reason } = req.body;
  dbQuery('UPDATE payment_notifications SET status = ?, confirmed_by = ? WHERE id = ?',
    ['rejected', req.user.id, req.params.id]);
  res.json({ success: true, message: 'تم رفض الإشعار' + (reason ? ': ' + reason : '') });
});

// ── Chat / Conversations ─────────────────────────────────

router.get('/conversations', adminOnly, (req, res) => {
  const convs = dbQuery(`
    SELECT c.*, u.name as user_name, u.phone as user_phone
    FROM conversations c
    LEFT JOIN users u ON c.user_id = u.id
    ORDER BY c.last_message_at DESC
  `);
  res.json(convs);
});

router.get('/conversations/my', authMiddleware, (req, res) => {
  const convs = dbQuery(`
    SELECT c.*, o.total as order_total, o.status as order_status,
           (SELECT message FROM chat_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
    FROM conversations c
    LEFT JOIN orders o ON c.order_id = o.id
    WHERE c.user_id = ?
    ORDER BY c.last_message_at DESC
  `, [req.user.id]);
  res.json(convs);
});

router.post('/conversations', authMiddleware, (req, res) => {
  const { order_id } = req.body;
  if (!order_id) return res.status(400).json({ error: 'رقم الطلب مطلوب' });

  let conv = dbGet('SELECT * FROM conversations WHERE order_id = ? AND user_id = ?', [order_id, req.user.id]);
  if (conv) return res.json(conv);

  const id = 'conv-' + Date.now();
  dbQuery('INSERT INTO conversations (id, order_id, user_id) VALUES (?, ?, ?)', [id, order_id, req.user.id]);
  conv = dbGet('SELECT * FROM conversations WHERE id = ?', [id]);
  res.json(conv);
});

router.get('/conversations/:id/messages', authMiddleware, (req, res) => {
  const conv = dbGet('SELECT * FROM conversations WHERE id = ?', [req.params.id]);
  if (!conv) return res.status(404).json({ error: 'المحادثة غير موجودة' });
  if (req.user.role !== 'admin' && conv.user_id !== req.user.id) return res.status(403).json({ error: 'غير مصرح' });

  const messages = dbQuery('SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC', [req.params.id]);
  res.json(messages);
});

router.post('/conversations/:id/messages', authMiddleware, (req, res) => {
  const { message, message_type, image_url } = req.body;
  if (!message && !image_url) return res.status(400).json({ error: 'الرسالة فارغة' });

  const conv = dbGet('SELECT * FROM conversations WHERE id = ?', [req.params.id]);
  if (!conv) return res.status(404).json({ error: 'المحادثة غير موجودة' });
  if (req.user.role !== 'admin' && conv.user_id !== req.user.id) return res.status(403).json({ error: 'غير مصرح' });

  const id = 'msg-' + Date.now();
  const sender = req.user.role === 'admin' ? 'admin' : 'user';
  dbQuery('INSERT INTO chat_messages (id, conversation_id, sender, message, message_type, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [id, req.params.id, sender, message || '', message_type || 'text', image_url || null]);

  dbQuery('UPDATE conversations SET last_message = ?, last_message_at = datetime("now"), unread_admin = ?, unread_user = ? WHERE id = ?',
    [sender === 'admin' ? message : (message || '📎 إشعار دفع'), sender === 'admin' ? 0 : 1, sender === 'user' ? 0 : 1, req.params.id]);

  const msg = dbGet('SELECT * FROM chat_messages WHERE id = ?', [id]);
  res.json(msg);
});

router.post('/conversations/:id/messages/auto', authMiddleware, (req, res) => {
  const { order_id } = req.body;
  const accounts = dbQuery('SELECT * FROM payment_accounts WHERE is_active = 1');
  const order = dbGet('SELECT * FROM orders WHERE id = ?', [order_id]);

  const id = 'msg-' + Date.now();
  const accText = accounts.map(a => {
    const type = a.account_type === 'jawalpay' ? '📱' : '🏦';
    return `${type} ${a.bank_name}\n   ${a.account_name}\n   ${a.account_number}`;
  }).join('\n\n');

  const autoMsg = `👋 السلام عليكم ورحمة الله!

طلبك #${order_id} جاهز للدفع 💰

💵 المبلغ المطلوب: ${(order?.total || 0).toFixed(2)} ₪

${accText}

⏰ يرجى التحويل خلال 8 ساعات
📎 عند التحويل، أرسلي إشعار التحويل (صورة أو رقم المرجع) هنا في المحادثة

شكراً لتعاملكم مع Beauty Zone ✨`;

  dbQuery('INSERT INTO chat_messages (id, conversation_id, sender, message, message_type) VALUES (?, ?, ?, ?, ?)',
    [id, req.params.id, 'admin', autoMsg, 'text']);
  dbQuery('UPDATE conversations SET last_message = ?, last_message_at = datetime("now"), unread_user = 1 WHERE id = ?',
    [autoMsg.substring(0, 100), req.params.id]);

  const msg = dbGet('SELECT * FROM chat_messages WHERE id = ?', [id]);
  res.json(msg);
});

router.put('/conversations/:id/read', authMiddleware, (req, res) => {
  if (req.user.role === 'admin') {
    dbQuery('UPDATE conversations SET unread_admin = 0 WHERE id = ?', [req.params.id]);
    dbQuery('UPDATE chat_messages SET read_at = datetime("now") WHERE conversation_id = ? AND sender = "user" AND read_at IS NULL', [req.params.id]);
  } else {
    dbQuery('UPDATE conversations SET unread_user = 0 WHERE id = ?', [req.params.id]);
    dbQuery('UPDATE chat_messages SET read_at = datetime("now") WHERE conversation_id = ? AND sender = "admin" AND read_at IS NULL', [req.params.id]);
  }
  res.json({ success: true });
});

router.get('/conversations/unread-count', authMiddleware, (req, res) => {
  if (req.user.role === 'admin') {
    const conv = dbGet('SELECT COUNT(*) as cnt FROM conversations WHERE unread_admin > 0');
    res.json({ count: conv?.cnt || 0 });
  } else {
    const conv = dbGet('SELECT COUNT(*) as cnt FROM conversations WHERE user_id = ? AND unread_user > 0', [req.user.id]);
    res.json({ count: conv?.cnt || 0 });
  }
});

module.exports = router;