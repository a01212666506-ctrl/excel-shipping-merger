# Excel Shipping Merger 📦

موقع متخصص لدمج ملفات Excel الخاصة بالشحن مع الحفاظ على جميع القواعس والمعايير.

## الميزات ✨

✅ رفع ملفي Excel (العميل والسيستم)
✅ Mapping ذكي وتلقائي للأعمدة مع التعديل اليدوي
✅ حفظ قوالب Mapping لكل عميل
✅ استخراج المحافظة والمنطقة من العنوان
✅ الحفاظ على ترتيب الشحنات الأصلي
✅ مراجعة شاملة قبل التصدير
✅ تقرير مفصل بالأخطاء والتحذيرات
✅ تصدير Excel مطابق 100% لقالب السيستم
✅ واجهة عربية احترافية وسهلة الاستخدام

## المتطلبات

### Backend
- Python 3.10+
- FastAPI
- openpyxl
- pandas
- python-multipart

### Frontend
- Node.js 16+
- React 18+
- TypeScript
- Tailwind CSS

## التثبيت والتشغيل المحلي

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# على Windows
venv\Scripts\activate

# على macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

سيعمل Backend على `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

سيعمل Frontend على `http://localhost:3000`

## الاستخدام

1. افتح `http://localhost:3000`
2. اختر ملف العميل وملف السيستم
3. راجع وعدّل Mapping الأعمدة
4. اضغط "Merge" لدمج البيانات
5. راجع التقرير والأخطاء
6. حمّل ملف Excel النهائي

## النشر على Hostinger

### خطوات النشر

1. **إعداد VPS:**
   - استأجر VPS من Hostinger
   - ثبّت Python وNode.js

2. **Backend:**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 main:app
   ```

3. **Frontend:**
   ```bash
   npm run build
   # استخدم Nginx أو Apache لتقديم build/
   ```

4. **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location /api/ {
           proxy_pass http://localhost:8000;
       }
       
       location / {
           root /path/to/frontend/build;
           try_files $uri /index.html;
       }
   }
   ```

## API Endpoints

### POST `/api/upload`
رفع ملفات Excel
- Parameters: `customer_file`, `system_file`
- Returns: Column mappings and data preview

### POST `/api/merge`
دمج البيانات
- Parameters: `mapping`, `fixed_values`, `session_id`
- Returns: Merged data with validation report

### GET `/api/download/{session_id}`
تحميل ملف Excel النهائي

### POST `/api/save-template`
حفظ قالب Mapping

### GET `/api/templates`
الحصول على قوالب Mapping المحفوظة

## البنية الأساسية

```
excel-shipping-merger/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── services/
│   │   ├── excel_handler.py
│   │   ├── merger.py
│   │   ├── validator.py
│   │   └── address_parser.py
│   └── uploads/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## الترخيص

Private Project
