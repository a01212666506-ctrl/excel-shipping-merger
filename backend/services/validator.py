from typing import Dict, List, Any
import re
from services.address_parser import AddressParser

class Validator:
    """
    Validates merged data for errors and inconsistencies
    """
    
    def validate(self, data: List[Dict], system_columns: List[str]) -> Dict[str, Any]:
        """
        Validate merged data and generate error report
        """
        errors = []
        warnings = []
        stats = {
            "total_rows": len(data),
            "new_rows": len(data),
            "updated_rows": 0,
            "error_rows": 0,
            "warning_rows": 0
        }
        
        # Track duplicates
        waybills = {}
        provinces = set()
        areas = set()
        
        for row_num, row in enumerate(data, start=1):
            row_errors = []
            row_warnings = []
            
            # Validate customer name (اسم المستلم)
            customer_name = str(row.get("اسم المستلم", "")).strip()
            if not customer_name:
                row_errors.append("اسم العميل فارغ")
            
            # Validate address (العنوان)
            address = str(row.get("العنوان", "")).strip()
            if not address:
                row_errors.append("العنوان فارغ")
            
            # Validate mobile number (رقم الموبايل)
            mobile = str(row.get("رقم الموبايل", "")).strip()
            if mobile and not AddressParser.validate_phone(mobile):
                row_errors.append("رقم الموبايل غير صحيح")
            elif not mobile:
                row_errors.append("رقم الموبايل فارغ")
            
            # Validate secondary phone (رقم الهاتف)
            phone = str(row.get("رقم الهاتف", "")).strip()
            if phone and not AddressParser.validate_phone(phone):
                row_warnings.append("رقم الهاتف غير صحيح")
            
            # Validate province (المحافظة)
            province = str(row.get("المحافظة", "")).strip()
            if not province:
                row_errors.append("المحافظة غير معروفة")
            else:
                provinces.add(province)
            
            # Validate area (المنطقة)
            area = str(row.get("المنطقة", "")).strip()
            if not area:
                row_warnings.append("المنطقة غير معروفة")
            else:
                areas.add(area)
            
            # Validate waybill number (رقم البوليصة)
            waybill = str(row.get("رقم البوليصة", "")).strip()
            if not waybill:
                row_errors.append("رقم البوليصة فارغ")
            elif waybill in waybills:
                row_errors.append(f"رقم البوليصة مكرر (سطر {waybills[waybill]})")
            else:
                waybills[waybill] = row_num
            
            # Validate price (السعر)
            price = row.get("السعر", "")
            if price == "" or price is None:
                row_errors.append("السعر فارغ")
            else:
                try:
                    float(str(price).replace(",", ""))
                except:
                    row_errors.append("السعر قيمة غير صحيحة")
            
            # Collect errors
            if row_errors:
                for error in row_errors:
                    errors.append({
                        "row": row_num,
                        "type": "error",
                        "message": error,
                        "waybill": waybill if waybill else "N/A"
                    })
                stats["error_rows"] += 1
            
            if row_warnings:
                for warning in row_warnings:
                    warnings.append({
                        "row": row_num,
                        "type": "warning",
                        "message": warning,
                        "waybill": waybill if waybill else "N/A"
                    })
                stats["warning_rows"] += 1
        
        return {
            "stats": stats,
            "errors": errors,
            "warnings": warnings,
            "summary": {
                "total_provinces": len(provinces),
                "total_areas": len(areas),
                "provinces": list(provinces),
                "areas": list(areas)
            }
        }
