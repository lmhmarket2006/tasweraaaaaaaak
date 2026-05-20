# نشر تصويرك على Railway — دليل خطوة بخطوة

## 1) ربط GitHub (إن لم يكن مربوطاً)

1. افتح [railway.app](https://railway.app) وسجّل الدخول.
2. **New Project** → **Deploy from GitHub repo**.
3. اختر: `lmhmarket2006/tasweraaaaaaaak`.
4. إن لم يظهر الريبو: **Configure GitHub App** وامنح Railway صلاحية على الريبو.

---

## 2) إضافة PostgreSQL

1. داخل المشروع: **+ New** → **Database** → **PostgreSQL**.
2. بعد الإنشاء، اضغط على خدمة Postgres → تبويب **Variables**.
3. انسخ `DATABASE_URL` (أو استخدم **Connect** → **Private URL**).

---

## 3) ربط قاعدة البيانات بالتطبيق

1. افتح خدمة **tasweraaaaaaaak** (الويب).
2. **Variables** → **New Variable** → **Add Reference**.
3. اختر Postgres → `DATABASE_URL` (أو أضف يدوياً نفس القيمة).

---

## 4) متغيرات البيئة (مهمة)

في خدمة الويب → **Variables** أضف:

| المتغير | كيف تحصل عليه |
|---------|----------------|
| `DATABASE_URL` | مرجع من Postgres (الخطوة 3) |
| `NEXTAUTH_SECRET` | سلسلة عشوائية 32+ حرف |
| `AUTH_SECRET` | **نفس** قيمة `NEXTAUTH_SECRET` |
| `NEXTAUTH_URL` | رابط التطبيق بعد النشر، مثل `https://tasweraaaaaaaak-production.up.railway.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | رقم واتساب بدون +، مثل `966501234567` |

### توليد سر عشوائي (PowerShell)

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

### Google (اختياري)

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`  
من [Google Cloud Console](https://console.cloud.google.com/) → OAuth → Redirect URI:  
`https://YOUR-APP.up.railway.app/api/auth/callback/google`

---

## 5) إعدادات النشر

- **Root Directory:** اتركه فارغاً (جذر الريبو).
- **Build:** يقرأ من `railway.toml` تلقائياً:
  - `prisma generate` → `migrate deploy` → `next build`
- **Start:** `npm run start`

بعد أي تعديل على Variables اضغط **Redeploy**.

---

## 6) أول نشر ناجح

1. افتح **Deployments** وتأكد أن Build **Success**.
2. **Settings** → **Networking** → **Generate Domain** للحصول على رابط عام.
3. حدّث `NEXTAUTH_URL` بنفس الرابط ثم **Redeploy**.

---

## 7) تعبئة البيانات (seed)

من جهازك (بعد نسخ `DATABASE_URL` من Railway → Postgres → Connect):

```powershell
cd c:\Users\alhay\OneDrive\Desktop\taswerak
$env:DATABASE_URL="postgresql://..."   # الصق رابط Railway
npm run db:seed
```

أو من **Railway** → خدمة الويب → **Settings** → شغّل أمر one-off إن وُجد، أو استخدم CLI:

```bash
railway login
railway link
railway run npm run db:seed
```

### حسابات بعد seed

| الدور | البريد | كلمة المرور |
|--------|--------|-------------|
| أدمن | admin@taswerak.com | Admin@12345 |
| مدرب | ahmed@taswerak.com | Instructor@123 |

---

## 8) إعدادات الدفع على المنصة

1. ادخل `/ar/admin/settings` بحساب الأدمن.
2. أدخل اسم البنك، رقم الحساب، رقم واتساب.
3. جرّب طلب شراء من `/ar/courses` كطالب.

---

## 9) مشاكل شائعة

| المشكلة | الحل |
|---------|------|
| Build يفشل عند `migrate deploy` | تأكد وجود `prisma/migrations` في الريبو |
| 500 عند فتح الموقع | تحقق من `DATABASE_URL` و Logs |
| تسجيل الدخول لا يعمل | `NEXTAUTH_URL` = رابط الموقع بالضبط + Redeploy |
| رفع الإيصال لا يُحفظ | على Railway استخدم Volume أو Cloudinary لاحقاً |

---

## 10) دومين taswerak.com (لاحقاً)

Railway → Web service → **Settings** → **Custom Domain** → أضف `taswerak.com` واتبع تعليمات DNS.
