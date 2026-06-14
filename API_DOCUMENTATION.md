# API Documentation - Excel Shipping Merger

## Base URL
```
http://localhost:8000/api
```

## Endpoints

### 1. Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-14T13:45:29Z",
  "version": "1.0.0"
}
```

---

### 2. Upload Files
```
POST /upload
Content-Type: multipart/form-data
```

**Parameters:**
- `customer_file` (File): Excel file with customer data
- `system_file` (File): Excel template file

**Response:**
```json
{
  "status": "success",
  "session_id": "20260614_134529_123456",
  "customer_columns": ["name", "address", "phone"],
  "system_columns": ["..."],
  "mappings": {
    "اسم المستلم": "name",
    "العنوان": "address"
  },
  "customer_rows": 100,
  "system_rows": 25
}
```

---

### 3. Merge Data
```
POST /merge
Content-Type: application/json
```

**Body:**
```json
{
  "session_id": "20260614_134529_123456",
  "mapping": {
    "اسم المستلم": "name",
    "العنوان": "address",
    "رقم الموبايل": "phone"
  },
  "fixed_values": {
    "كود العميل": "CUST001"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "session_id": "20260614_134529_123456",
  "total_rows": 100,
  "new_rows": 100,
  "updated_rows": 0,
  "error_rows": 5,
  "warning_rows": 12,
  "validation_report": {
    "stats": { "total_rows": 100, "error_rows": 5, "warning_rows": 12 },
    "errors": [
      {
        "row": 1,
        "type": "error",
        "message": "اسم العميل فارغ",
        "waybill": "WB001"
      }
    ],
    "warnings": [
      {
        "row": 2,
        "type": "warning",
        "message": "المنطقة غير معروفة",
        "waybill": "WB002"
      }
    ]
  },
  "preview": [ /* First 5 rows */ ]
}
```

---

### 4. Download Excel File
```
GET /download/{session_id}
```

**Response:** Binary Excel file (.xlsx)

---

### 5. Save Template
```
POST /save-template
Content-Type: application/json
```

**Body:**
```json
{
  "template_name": "client_1_template",
  "mapping": { "...": "..." },
  "fixed_values": { "...": "..." }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Template 'client_1_template' saved successfully",
  "template_name": "client_1_template"
}
```

---

### 6. Get Templates
```
GET /templates
```

**Response:**
```json
{
  "status": "success",
  "templates": [
    {
      "name": "client_1_template",
      "mapping": { "...": "..." },
      "fixed_values": { "...": "..." },
      "created_at": "2026-06-14T13:45:29Z"
    }
  ]
}
```

---

### 7. Cleanup Session
```
POST /cleanup/{session_id}
```

**Response:**
```json
{
  "status": "cleaned"
}
```

---

## Error Handling

**Error Response Format:**
```json
{
  "detail": "Error message describing what went wrong"
}
```

**Common Error Codes:**
- `400 Bad Request`: Invalid file format or missing parameters
- `404 Not Found`: Session not found
- `500 Internal Server Error`: Server error

---

## Data Validation Rules

### Required Fields:
- اسم المستلم (Customer Name) - Must not be empty
- العنوان (Address) - Must not be empty
- رقم الموبايل (Mobile Number) - Valid phone number format
- السعر (Price) - Must be numeric value
- رقم البوليصة (Waybill Number) - Must not be duplicate

### Warnings (Non-blocking):
- المحافظة غير معروفة (Unknown Province)
- المنطقة غير معروفة (Unknown Area)
- رقم الهاتف غير صحيح (Invalid Phone Number)

---

## Fixed Values Applied

```
الخدمة: شحن عادي
نوع الطلب: FDP
نوع التحصيل: COD
نوع السعر: INCLD
الوزن: 1
عدد القطع: 1
فتح الطرد: N
رقم المرجع: (empty)
Sender Fields: All empty
```

---

## Rate Limiting

No rate limiting applied. Configure as needed for production.

---

## Version

**API Version:** 1.0.0  
**Last Updated:** June 14, 2026
