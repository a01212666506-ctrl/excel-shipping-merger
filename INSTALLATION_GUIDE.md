# Excel Shipping Merger - Installation & Setup Guide

## نظام معالجة ودمج ملفات Excel للشحنات

### البنية الأساسية للمشروع

```
excel-shipping-merger/
├── backend/                    # FastAPI Backend
│   ├── main.py                # نقطة البدء الرئيسية
│   ├── requirements.txt        # مكتبات Python
│   ├── services/
│   │   ├── excel_handler.py   # معالجة ملفات Excel
│   │   ├── merger.py          # دمج البيانات
│   │   ├── validator.py       # التحقق من البيانات
│   │   └── address_parser.py  # استخراج المحافظة والمنطقة
│   └── uploads/               # مجلد تخزين الملفات المرفوعة
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── App.tsx           # التطبيق الرئيسي
│   │   ├── main.tsx          # نقطة البدء
│   │   ├── index.css         # التنسيقات
│   │   └── components/       # مكونات React
│   │       ├── FileUpload.tsx
│   │       ├── ColumnMapping.tsx
│   │       ├── ReviewMerge.tsx
│   │       └── ErrorReport.tsx
│   ├── public/               # ملفات ثابتة
│   ├── package.json          # مكتبات Node.js
│   ├── tailwind.config.js    # إعدادات Tailwind CSS
│   ├── tsconfig.json         # إعدادات TypeScript
│   └── vite.config.ts        # إعدادات Vite
│
└── README.md                 # التوثيق
```

---

## 🚀 التثبيت والتشغيل المحلي

### المتطلبات
- Python 3.10+
- Node.js 16+
- npm أو yarn

### 1️⃣ تثبيت Backend

```bash
# الذهاب لمجلد Backend
cd backend

# إنشاء بيئة افتراضية (Virtual Environment)
python -m venv venv

# تفعيل البيئة الافتراضية

# على Windows:
venv\Scripts\activate

# على macOS/Linux:
source venv/bin/activate

# تثبيت المكتبات
pip install -r requirements.txt

# تشغيل Backend
python main.py
```

**سيعمل Backend على:** `http://localhost:8000`

---

### 2️⃣ تثبيت Frontend

```bash
# الذهاب لمجلد Frontend
cd frontend

# تثبيت المكتبات
npm install

# تشغيل Frontend
npm start
```

**سيعمل Frontend على:** `http://localhost:3000`

---

## 📋 خطوات الاستخدام

### الخطوة 1: رفع الملفات
1. افتح `http://localhost:3000`
2. اختر ملف بيانات العميل (Excel)
3. اختر ملف قالب النظام (Excel)
4. اضغط "المتابعة إلى الخطوة التالية"

### الخطوة 2: ربط الأعمدة
1. راجع الربط التلقائي بين أعمدة الملفين
2. عدّل أي أعمدة غير صحيحة من القوائم المنسدلة
3. أدخل كود العميل (سيطبق على جميع الصفوف)
4. اضغط "دمج البيانات"

### الخطوة 3: المراجعة
1. راجع إحصائيات الدمج
2. تحقق من الأخطاء والتحذيرات
3. انقر على الأخطاء/التحذيرات لتوسيعها وقراءة التفاصيل

### الخطوة 4: التحميل
1. اضغط "تحميل ملف Excel النهائي"
2. سيتم تحميل ملف Excel منسق وجاهز للرفع على النظام

---

## ⚙️ قواعس الدمج المطبقة

✅ **معالجة البيانات:**
- رقم السطر: تسلسل 1, 2, 3, ...
- اسم المستلم: من بيانات العميل
- العنوان: نسخ كامل بدون تعديل
- المحافظة: من العمود أو استخراج من العنوان
- المنطقة: من العمود أو استخراج من العنوان أو المدينة
- رقم الموبايل: الرقم الأول من الأرقام المستخرجة
- رقم الهاتف: الرقم الثاني فقط (فارغ إن لم يوجد)
- رقم البوليصة: نسخ من العميل
- السعر: من إجمالي العميل
- كود العميل: القيمة الثابتة المدخلة

✅ **القيم الثابتة:**
- الخدمة: شحن عادي
- نوع الطلب: FDP
- نوع التحصيل: COD
- نوع السعر: INCLD
- الوزن: 1
- عدد القطع: 1
- فتح الطرد: N
- رقم المرجع: فارغ
- أعمدة الراسل: جميعها فارغة

✅ **التحقق والتقارير:**
- اسم العميل فارغ ❌
- رقم الهاتف غير صحيح ❌
- العنوان فارغ ❌
- المحافظة غير معروفة ⚠️
- المنطقة غير معروفة ⚠️
- رقم البوليصة مكرر ❌
- السعر فارغ ❌

---

## 🌐 النشر على Hostinger (الإنتاج)

### المتطلبات
- VPS من Hostinger
- SSH Access
- Python 3.10+ و Node.js 16+ مثبتة

### خطوات النشر

#### 1️⃣ **إعداد الخادم**

```bash
# الاتصال بالخادم
ssh root@your_server_ip

# تحديث النظام
apt update && apt upgrade -y

# تثبيت Python و Node.js
apt install python3.10 python3-pip python3-venv nodejs npm -y

# تثبيت Nginx
apt install nginx -y

# تثبيت Supervisor (لتشغيل الخدمات)
apt install supervisor -y
```

#### 2️⃣ **رفع المشروع**

```bash
# نسخ المشروع
git clone https://github.com/a01212666506-ctrl/excel-shipping-merger.git
cd excel-shipping-merger
```

#### 3️⃣ **تثبيت Backend**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# اختبار التشغيل
python main.py
# اضغط Ctrl+C للإيقاف
```

#### 4️⃣ **تكوين Supervisor للـ Backend**

```bash
# إنشاء ملف تكوين
sudo nano /etc/supervisor/conf.d/excel-merger-backend.conf
```

أضف المحتوى التالي:

```ini
[program:excel-merger-backend]
directory=/root/excel-shipping-merger/backend
command=/root/excel-shipping-merger/backend/venv/bin/gunicorn -w 4 -b 0.0.0.0:8000 main:app
autostart=true
autorestart=true
stderr_logfile=/var/log/excel-merger-backend.err.log
stdout_logfile=/var/log/excel-merger-backend.out.log
```

```bash
# تحديث Supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start excel-merger-backend
```

#### 5️⃣ **بناء Frontend**

```bash
cd frontend
npm install
npm run build
```

#### 6️⃣ **تكوين Nginx**

```bash
# إنشاء ملف تكوين Nginx
sudo nano /etc/nginx/sites-available/excel-merger
```

أضف المحتوى التالي:

```nginx
server {
    listen 80;
    server_name yourdomain.com;  # غير باسم نطاقك
    
    # خدمة Frontend
    location / {
        root /root/excel-shipping-merger/frontend/dist;
        try_files $uri /index.html;
    }
    
    # توجيه API للـ Backend
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/excel-merger /etc/nginx/sites-enabled/

# اختبار التكوين
sudo nginx -t

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

#### 7️⃣ **إضافة شهادة SSL (اختياري ولكن مهم)**

```bash
# تثبيت Certbot
apt install certbot python3-certbot-nginx -y

# الحصول على شهادة SSL
certbot certonly --nginx -d yourdomain.com
```

---

## 🔧 متغيرات البيئة (.env)

إذا أردت إضافة متغيرات بيئة، أنشئ ملف `.env` في مجلد Backend:

```
FASTAPI_ENV=production
MAX_FILE_SIZE=52428800
UPLOAD_FOLDER=uploads
OUTPUT_FOLDER=output
```

---

## 📊 الملفات المدعومة

- **صيغ الملفات:** `.xlsx`, `.xls`
- **الحد الأقصى للحجم:** 50 MB
- **الترميز:** UTF-8

---

## 🆘 حل المشاكل

### المشكلة: "CORS Error"
**الحل:** تأكد من أن Backend يعمل على `http://localhost:8000` و Frontend على `http://localhost:3000`

### المشكلة: "لم يتم العثور على الملفات المرفوعة"
**الحل:** تأكد من وجود مجلد `backend/uploads` وأنه قابل للكتابة

### المشكلة: "خطأ في معالجة Excel"
**الحل:** تأكد من أن ملفات Excel تحتوي على بيانات صحيحة وأن رؤوس الأعمدة موجودة

---

## 📧 التواصل والدعم

للمساعدة والدعم الفني:
- ✉️ Email: a01212666506@gmail.com
- 🐙 GitHub: https://github.com/a01212666506-ctrl/excel-shipping-merger

---

## 📄 الترخيص

هذا المشروع خاص ومحمي الحقوق. جميع الحقوق محفوظة.
