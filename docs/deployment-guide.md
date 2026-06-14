# 📦 Beauty Zone — دليل الرفع الكامل

## 🆓 الخطة المجانية

| الخدمة | الرابط | السعة |
|--------|--------|-------|
| الواجهة الأمامية | Vercel.com | مجاني |
| قاعدة البيانات | Supabase.com | 500MB مجاني |
| الصور | Supabase Storage | مجاني |

---

## 🟢 الخطوة 1: إنشاء حساب Supabase

### 1.1 سجل بـ GitHub
روح لـ [supabase.com](https://supabase.com) واضغطي **Start your project**

### 1.2 أنشئي مشروع جديد
- Project name: `beauty-zone`
- Database region: اختاري أقرب منطقة (مثل `eu-west-1` لأوروبا)
- Pricing plan: **Free**

### 1.3 خذي الـ Keys
من **Settings > API**، ورقي هذول:
```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔵 الخطوة 2: تشغيل SQL Schema

### 2.1 روح لـ SQL Editor
**Supabase Dashboard > SQL Editor > New Query**

### 2.2 شغّلي الملفات بالترتيب:

**schema.sql** ← شغّليه أولاً:
```sql
-- انسخي كل المحتوى من supabase/schema.sql
-- واضغطي Run
```

**auth.sql** ← ثانياً:
```sql
-- انسخي كل المحتوى من supabase/auth.sql
-- واضغطي Run
```

**seed.sql** ← ثالثاً:
```sql
-- انسخي كل المحتوى من supabase/seed.sql
-- واضغطي Run
```

### 2.3 تأكدي من الجداول
روح لـ **Table Editor** - لازم تشوفي:
- [x] users
- [x] products
- [x] orders
- [x] testimonials
- [x] settings

---

## 🟢 الخطوة 3: إنشاء GitHub Repository

### 3.1 روحي لـ GitHub
[new.github.com](https://new.github.com)

### 3.2 أنشئي repository جديد
- Name: `beauty-zone`
- Private أو Public

### 3.3 ارفعي الملفات
في الـ terminal داخل مجلد `frontend/`:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/beauty-zone.git
git push -u origin main
```

---

## 🔵 الخطوة 4: ربط مع Vercel

### 4.1 أنشئي حساب Vercel
روح لـ [vercel.com](https://vercel.com) وسجّلي بـ GitHub

### 4.2 New Project
- اختاري repository `beauty-zone`
- Framework: **Other**
- Root Directory: `./frontend`
- Build Command: اتركيه فاضي
- Output Directory: `.`

### 4.3 Environment Variables
اضغطي **Environment Variables** وأضيفي:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` (من الخطوة 1) |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (من الخطوة 1) |

### 4.4 Deploy
اضغطي **Deploy** وانتظري ~2 دقيقة

---

## 🟢 الخطوة 5: إعدادات ما بعد الرفع

### 5.1 حدّثي Site URL في Supabase
**Supabase > Authentication > URL Configuration**
```
Site URL: https://beauty-zone.vercel.app
```

### 5.2 أضيفي Redirect URLs
```
https://beauty-zone.vercel.app/**
```

### 5.3 فعّلي Email Auth
**Supabase > Authentication > Providers > Email**
- [x] Enable Email Signup
- [ ] Enable Email Confirm (اختياري)

---

## 🔐 بيانات الدخول

بعد ما ترفعي كلشي، جربي تسجيل الدخول في لوحة التحكم:

| الحقل | القيمة |
|-------|--------|
| الإيميل | `admin@beautyzone.ps` |
| كلمة المرور | `admin123` |

أو من **Supabase > Table Editor > users** بتقدري تغيّري البيانات.

---

## 📸 شرح نظام الصور

### كيف تشتغل؟
1. الصورة بترفع من لوحة التحكم (قسم الإعدادات)
2. الصورة بتحفظ في **Supabase Storage** (bucket: `images`)
3. الرابط بيرجع ويحفظ في **settings** table
4. الموقع بقرأ الرابط ويعرض الصورة من السحابة

### حجم الصور:
- **الحد الأقصى:** 5MB لكل صورة
- **الصيغ المدعومة:** JPG, PNG, WebP, GIF

---

## ⚠️ لو واجهتي مشاكل

### مشكلة: "Invalid API key"
- تأكدي إن `SUPABASE_ANON_KEY` صحيح
- تأكدي إنه نفس الـ key من Supabase (مش master key)

### مشكلة: "Row Level Security error"
- روح لـ Supabase > Table Editor > أي جدول > Policies
- تأكدي إن الـ policies مفعّلة

### مشكلة: Auth ما يشتغل
- تأكدي إن Site URL في Supabase مطابق لـ URL الـ Vercel
- أضيفي Redirect URL: `https://beauty-zone.vercel.app/auth/callback`

### مشكلة: صور ما تحمل
- تأكدي إن Storage bucket `images` عام (public)
- تأكدي من Storage policies في auth.sql

---

## 📁 هيكل الملفات النهائي

```
beauty-zone/
├── frontend/                    # ← Vercel
│   ├── index.html
│   ├── admin.html
│   ├── manifest.json
│   ├── sw.js
│   ├── package.json
│   ├── .env.example             # ← متغيرات البيئة
│   ├── css/
│   │   ├── glow.css
│   │   ├── luxury.css
│   │   └── upgrades.css
│   ├── js/
│   │   ├── glow-data.js         # localStorage fallback
│   │   ├── glow-main.js
│   │   ├── supabase-client.js    # ← Supabase wrapper
│   │   ├── theme-toggle.js
│   │   └── upgrades.js
│   └── assets/
│       └── [صور المنتجات]
│
├── supabase/                    # ← Supabase (سحابي)
│   ├── schema.sql
│   ├── auth.sql
│   └── seed.sql
│
└── docs/
    └── deployment-guide.md
```

---

## 💡 نصيحة: كيف تضيفي صور المنتجات

### من لوحة التحكم:
1. روحلي **الإعدادات > صور الأقسام**
2. اضغطي على زر رفع الصورة
3. اختاري صورة من جهازك
4. الصورة بترفع تلقائياً على Supabase Storage

### أو بالـ SQL مباشرة:
```sql
UPDATE products
SET images = array['https://xxxxx.supabase.co/storage/v1/object/public/images/products/skincare-001/photo.jpg']
WHERE id = 'skincare-001';
```

---

## ✅ قبل ما تعملي launch

- [ ] جرّبي التسجيل/login
- [ ] جرّبي إضافة منتج للسلة
- [ ] جرّبي إتمام طلب
- [ ] جرّبي رفع صورة من لوحة التحكم
- [ ] تأكدي إن كل الـ CSS تحميل صح
- [ ] جرّبي على موبايل

---

**بالتوفيق! إذا واجهتي أي مشكلة، أرسليلي الـ error ونحلها مع بعض 💪**