# تصويرك — Taswerak

منصة تعليم التصوير (عربي / إنجليزي) مع اشتراك يدوي (تحويل بنكي + إيصال) ولوحة مدربين وإدارة.

## Stack

- Next.js 14 · TypeScript · Tailwind
- PostgreSQL · Prisma
- NextAuth (بريد + Google)
- next-intl (ar / en)

## التشغيل محلياً

1. انسخ المتغيرات:

```bash
cp .env.example .env
```

2. عيّن `DATABASE_URL` لـ PostgreSQL (محلي أو Railway).

3. ثبّت وهيّئ القاعدة:

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
```

4. شغّل:

```bash
npm run dev
```

افتح: http://localhost:3000/ar

### حسابات تجريبية (بعد seed)

| الدور | البريد | كلمة المرور |
|--------|--------|-------------|
| أدمن | admin@taswerak.com | Admin@12345 |
| مدرب | ahmed@taswerak.com | Instructor@123 |

## النشر على Railway

1. ارفع المشروع إلى **GitHub**.
2. في [Railway](https://railway.app): New Project → Deploy from GitHub.
3. أضف خدمة **PostgreSQL** واربط `DATABASE_URL` بالتطبيق.
4. متغيرات البيئة:

- `DATABASE_URL`
- `NEXTAUTH_SECRET` / `AUTH_SECRET`
- `NEXTAUTH_URL` (رابط التطبيق على Railway)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` (اختياري)
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

5. Build command (افتراضي):

```bash
npx prisma generate && npx prisma migrate deploy && npm run build
```

6. Start command:

```bash
npm run start
```

> **ملاحظة:** رفع الإيصالات محلياً يحفظ في `public/uploads`. على Railway استخدم **Cloudinary** أو Volume — راجع `.env.example`.

## المسارات الرئيسية

| المسار | الوصف |
|--------|--------|
| `/ar` `/en` | الرئيسية |
| `/ar/courses` | الدورات |
| `/ar/dashboard/orders` | طلبات الشراء + رفع إيصال |
| `/ar/admin/orders` | قبول / رفض الطلبات |
| `/ar/instructor` | لوحة المدرب |
| `/ar/become-instructor` | طلب الانضمام كمدرب |
| `/ar/learn/[slug]/[lessonId]` | مشاهدة الدرس |

## GitHub

```bash
git add .
git commit -m "Initial Taswerak platform"
git remote add origin https://github.com/YOUR_USER/taswerak.git
git push -u origin main
```
