# Beauty Zone — نظام الشات والدفع الداخلي

## Overview
نظام محادثة داخلي + دفع بالتحويل البنكي + إشعارات — كله داخل التطبيق.

---

## Flow الأساسي

```
العميلة تؤكد الطلب
       ↓
يفتح شات مع الأدمن (رسالة تلقائية بالتفاصيل المالية)
       ↓
العميلة تنقل من تطبيقها → ترفع إشعار التحويل داخل الشات
       ↓
الأدمن يشوف → يأكد الدفع → order status يتحدث
       ↓
إشعار للعميلة: "تم استلام الدفع!"
```

---

## Database Schema

### جدول جديد: `conversations`
```sql
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  user_id TEXT,
  last_message TEXT,
  last_message_at TEXT,
  unread_admin INTEGER DEFAULT 0,
  unread_user INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open',
  created_at TEXT DEFAULT (datetime('now'))
);
```

### جدول جديد: `chat_messages`
```sql
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  sender TEXT,          -- 'user' أو 'admin'
  message TEXT,
  message_type TEXT,   -- 'text' أو 'receipt' (صورة إشعار)
  image_url TEXT,
  read_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### جدول جديد: `payment_accounts`
```sql
CREATE TABLE IF NOT EXISTS payment_accounts (
  id TEXT PRIMARY KEY,
  account_name TEXT,
  bank_name TEXT,
  account_number TEXT,
  account_type TEXT,    -- 'bank' أو 'wallet' أو 'jawalpay'
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### جدول جديد: `payment_notifications`
```sql
CREATE TABLE IF NOT EXISTS payment_notifications (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  user_id TEXT,
  account_id TEXT,
  amount REAL,
  reference TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'pending',  -- 'pending' أو 'confirmed' أو 'rejected'
  confirmed_by TEXT,
  confirmed_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

---

## API Endpoints

### محادثة
- `POST /api/chat/create` — إنشاء محادثة جديدة (بعد تأكيد الطلب)
- `GET /api/chat/:conversationId` — جلب المحادثة والرسائل
- `GET /api/chat/my` — جلب كل محادثات العميلة
- `POST /api/chat/:conversationId/message` — إرسال رسالة
- `PUT /api/chat/:conversationId/read` — تحديد الرسائل كمقروءة

### الحسابات البنكية
- `GET /api/payment/accounts` — جلب كل الحسابات (للعميلة تشوفها)
- `POST /api/payment/accounts` — أدمن يضيف حساب (من لوحة التحكم)
- `PUT /api/payment/accounts/:id` — أدمن يعدل حساب
- `DELETE /api/payment/accounts/:id` — أدمن يحذف حساب

### إشعارات الدفع
- `POST /api/payment/notify` — العميلة ترسل إشعار التحويل
- `GET /api/payment/notifications` — أدمن يشوف كل الإشعارات
- `PUT /api/payment/notifications/:id/confirm` — أدمن يؤكد الدفع
- `PUT /api/payment/notifications/:id/reject` — أدمن يرفض مع سبب

---

## الشات — صفحة مستقلة `/chat.html`

### عند فتح الشات:
1. جلب المحادثة من السيرفر
2. إذا ما في محادثة → إنشائها + إرسال رسالة تلقائية من الأدمن

### شكل الرسالة التلقائية:
```
👋 السلام عليكم!

طلبك #${orderId} جاهز للدفع 💰

المبلغ المطلوب: ${total} ₪

${paymentAccounts.map(acc => `
🏦 ${acc.bank_name}
   ${acc.account_name}
   ${acc.account_number}
`).join('\n')}

⏰ يرجى التحويل خلال 8 ساعات
📎 عند التحويل، أرسلي إشعار التحويل (صورة أو رقم المرجع) هنا
```

### أنواع الرسائل:
- **text** — رسالة عادية
- **receipt** — صورة إشعار التحويل (مع badge "إشعار دفع")
- **system** — رسالة نظام (مثلاً "تم تأكيد الدفع ✓")

### Badge على أيقونة الشات:
- عدد الرسائل غير المقروءة يظهر على أيقونة الشات في الـ nav
- العميلة تشوف badge even لو ما فتحت الشات

---

## الدفع — صفحة `/account.html`

### قسم "الدفع" (ضمن حساب العميلة):
1. **الحسابات البنكية المتاحة** — تشوف كل الحسابات الفعالة
2. **إرسال إشعار الدفع** — صورة + المبلغ + رقم المرجع
3. **سجل الدفعات** — كل الإشعارات اللي أرسلتها + حالتها

### Flow الدفع:
1. العميلة تختار الحساب → تنقل من تطبيقها
2. ترجع للتطبيق → ترفع صورة الإشعار + المبلغ + رقم المرجع
3. الإشعار يروح للأدمن
4. الأدمن يؤكد → النظام يحدث حالة الطلب تلقائياً
5. رسالة في الشات للعميلة: "تم تأكيد الدفع ✓"

---

## لوحة التحكم — `/admin.html`

### تبويب "الدفع":
- كل إشعارات الدفع الجديدة (pending)
- لكل إشعار: العميلة، الطلب، المبلغ، الصورة، رقم المرجع
- أزرار: تأكيد / رفض

### تبويب "المحادثات":
- كل المحادثات النشطة
- آخر رسالة في كل محادثة
- عدد غير المقروءة

### تبويب "الحسابات البنكية":
- إضافة حساب جديد
- تفعيل/إلغاء حساب

---

## إشعارات (real-time)

### للعميلة:
- إشعار عند الرد من الأدمن
- إشعار عند تأكيد الدفع
- إشعار عند تغير حالة الطلب

### للأدمن:
- إشعار عند محادثة جديدة
- إشعار عند إشعار دفع جديد
- **تذكير تلقائي بعد 8 ساعات** إذا الدفع ما تأكد

---

## الملفات المطلوبة

| الملف | الوصف |
|-------|-------|
| `server/routes/chat.js` | API الشات |
| `server/routes/payment.js` | API الدفع والحسابات البنكية |
| `public/chat.html` | صفحة الشات |
| `server/database.js` | إضافة الجداول الجديدة |
| `public/account.html` | إضافة قسم الدفع (ضمن الحساب) |
| `public/admin.html` | إضافة تبويبات الدفع والمحادثات |

---

## أولوية التنفيذ

1. **Phase 1:** جداول قاعدة البيانات + API الحسابات البنكية + إشعارات الدفع
2. **Phase 2:** صفحة الشات + الرسالة التلقائية
3. **Phase 3:** إشعارات الدفع + تأكيد الرفض
4. **Phase 4:** لوحة التحكم + التذكيرات
5. **Phase 5:** Badges والتنبيهات