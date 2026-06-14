-- ═══════════════════════════════════════════════════
-- BEAUTY ZONE — SEED DATA
-- ═══════════════════════════════════════════════════

-- ── Admin User ───────────────────────────────────
insert into public.users (id, name, phone, email, pass, role)
values (
  uuid_generate_v4(),
  'المدير',
  'admin',
  'admin@beautyzone.ps',
  'admin123',
  'admin'
) on conflict do nothing;

-- ── Products ─────────────────────────────────────
insert into public.products (id, name_ar, name_en, price, category, description_ar, images, stock, featured, bestseller)
values
  -- skincare
  (
    'skincare-001',
    'ميلانوفري - كريم تفتيح الجلد 30جم',
    'Melanofree Topical Cream 30gm',
    58,
    'skincare',
    'كريم موضعي لمعالجة التصبغات والبقع الداكنة. للاستخدام الخارجي فقط. تركيبة طبية فعّالة وآمنة. 30 جرام.',
    array['https://beautyzone.../assets/WhatsApp_Image_2026-03-16_at_14.03.56.jpeg'],
    25,
    true,
    true
  ),
  (
    'skincare-002',
    'ميلانو صابون التبييض - أربوتين وحمض الكوجيك',
    'Melano Soap Whitening - Arbutin & Kojic Acid',
    32,
    'skincare',
    'صابون تبييض بتركيبة متطورة من الأربوتين وحمض الكوجيك مع توت العليق وفيتامين C. مناسب لجميع أنواع البشرة.',
    array['https://beautyzone.../assets/WhatsApp_Image_2026-03-16_at_14.03.57.jpeg'],
    40,
    false,
    true
  ),
  (
    'skincare-003',
    'كريم الفوت للسرو - العناية بالقدمين',
    'Foot Care Cream - Al Maiky',
    45,
    'skincare',
    'كريم طبيعي مُغذّي للقدمين بخلاصة نباتات فاخرة. يُرطّب ويُنعّم الجلد المتشقق.',
    array['https://beautyzone.../assets/WhatsApp_Image_2026-03-16_at_14.03.57__1_.jpeg'],
    18,
    true,
    false
  ),
  -- personal care
  (
    'personal-001',
    'ميلانو ميلو بلي - جل مرطّب للعناية - توت العليق',
    'Melano Melo Ply - Lubricant Gel - Raspberry',
    38,
    'personal',
    'جل مرطّب للعناية الشخصية بنكهة توت العليق. قاعدة مائية آمنة ومريحة. آمن للاستخدام اليومي.',
    array['https://beautyzone.../assets/WhatsApp_Image_2026-03-16_at_14.03.57__2_.jpeg'],
    30,
    true,
    true
  ),
  (
    'personal-002',
    'ميلانو ميلو بلي - جل مرطّب للعناية - شوكولاتة',
    'Melano Melo Ply - Lubricant Gel - Chocolate',
    38,
    'personal',
    'جل مرطّب للعناية الشخصية بنكهة الشوكولاتة الدافئة. قاعدة مائية آمنة ومريحة.',
    array['https://beautyzone.../assets/WhatsApp_Image_2026-03-16_at_14.03.57__3_.jpeg'],
    28,
    false,
    true
  ),
  (
    'personal-003',
    'ميلانو ميلو بلي - جل مرطّب للعناية - موز',
    'Melano Melo Ply - Lubricant Gel - Banana',
    38,
    'personal',
    'جل مرطّب للعناية الشخصية بنكهة الموز الاستوائية. قاعدة مائية آمنة ومريحة.',
    array['https://beautyzone.../assets/WhatsApp_Image_2026-03-16_at_14.03.57__5_.jpeg'],
    22,
    false,
    false
  ),
  -- makeup
  (
    'makeup-001',
    'مجموعة نيفيا - مزيل العرق فريش ناتشورال',
    'NIVEA Fresh Natural Deodorant Spray',
    22,
    'makeup',
    'مزيل عرق نيفيا فريش ناتشورال بدون ألومنيوم 0%. حماية 48 ساعة. رائحة منعشة وطبيعية. 150مل.',
    array['https://beautyzone.../assets/WhatsApp_Image_2026-03-16_at_14.03.58.jpeg'],
    50,
    false,
    true
  ),
  (
    'makeup-002',
    'نيفيا بلاك & وايت إنفيزيبل - مزيل عرق',
    'NIVEA Black & White Invisible Deodorant',
    25,
    'makeup',
    'مزيل عرق نيفيا بلاك وايت إنفيزيبل. حماية 72 ساعة. لا يُخلّف بقع بيضاء أو صفراء على الملابس.',
    array['https://beautyzone.../assets/WhatsApp_Image_2026-03-16_at_14.03.58__1_.jpeg'],
    35,
    true,
    false
  ),
  -- vitamins
  (
    'vitamins-001',
    'كبسولات الكولاجين البحري المتوهج',
    'Marine Collagen Glow Capsules',
    195,
    'vitamins',
    'كولاجين بحري نقي يُعزز مرونة البشرة ويُقوّي الأظافر والشعر من الداخل. 60 كبسولة كافية لشهرين.',
    array['https://beautyzone.../assets/WhatsApp_Image_2026-03-16_at_14.03.58__4_.jpeg'],
    20,
    true,
    true
  ),
  (
    'vitamins-002',
    'فيتامين D3 + K2 المتكامل',
    'Vitamin D3 + K2 Complex',
    135,
    'vitamins',
    'تركيبة متطورة من D3 وK2 لصحة العظام والمناعة والجمال من الداخل. مناسب للاستخدام اليومي.',
    array['https://beautyzone.../assets/WhatsApp_Image_2026-03-16_at_14.03.58__5_.jpeg'],
    40,
    false,
    false
  )
on conflict (id) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  price = excluded.price,
  category = excluded.category,
  description_ar = excluded.description_ar,
  images = excluded.images,
  stock = excluded.stock,
  featured = excluded.featured,
  bestseller = excluded.bestseller;

-- ── Testimonials ─────────────────────────────────
insert into public.testimonials (name, location, letter, stars, text)
values
  ('سارة الأحمد', 'رام الله', 'س', 5, 'كريم ميلانوفري غيّر بشرتي بجد! بعد أسبوعين صار لوني أفتح وأصفى. متجر موثوق 100٪ ✨'),
  ('نور محمد', 'نابلس', 'ن', 5, 'صابون ميلانو رائع جداً، جربته لأول مرة وما شاء الله فرق واضح. بنصح فيه كل بنت 🌸'),
  ('ريم سالم', 'الخليل', 'ر', 5, 'منتجات Beauty Zone أصلية 100٪ والتوصيل كان سريع جداً. شكراً للمتجر الرائع 💖'),
  ('هنا العمري', 'بيت لحم', 'ه', 5, 'اشتريت مزيل نيفيا وهو أفضل شي استخدمته. حماية طول اليوم بدون بقع. ممتاز!'),
  ('دانا حسين', 'القدس', 'د', 5, 'من أفضل متاجر الكوزمتكس بفلسطين. الخدمة ممتازة والمنتجات أصلية وبأسعار مناسبة'),
  ('لمى يوسف', 'جنين', 'ل', 5, 'كريم القدمين تحفة! رجعت بشرتي ناعمة من أول استخدام. حلو والرائحة جميلة جداً 🌺')
on conflict do nothing;

-- ── Settings ─────────────────────────────────────
insert into public.settings (key, value)
values
  ('announcement', '{"text": "✨ شحن مجاني للطلبات فوق 200 ₪ ✨ | 🌟 خصم 15% على أول طلب بـ كود: BZ15 🌟 | 💖 اكتشفي أجمل منتجات العناية بالبشرة والمكياج 💖"}'),
  ('hero_config', '{"badge": "بيوتي زون — مستحضرات فاخرة", "headline": "جمالكِ يبدأ من هنا", "cta1": "تسوّقي الآن", "cta2": "العناية ببشرتك"}'),
  ('social_links', '{"instagram": "", "facebook": "", "whatsapp": "972500000000"}'),
  ('store_name', '{"ar": "بيوتي زون", "en": "Beauty Zone"}')
on conflict (key) do update set value = excluded.value;