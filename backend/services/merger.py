from typing import Dict, List, Any, Optional
from services.address_parser import AddressParser
import re

class Merger:
    """
    Handles merging of customer and system Excel data
    """
    
    def merge_data(
        self,
        customer_data: Dict[str, Any],
        system_data: Dict[str, Any],
        mapping: Dict[str, str],
        fixed_values: Dict[str, Any]
    ) -> Dict[str, List[Dict]]:
        """
        Merge customer data into system template
        Maintains original customer data order
        """
        merged_rows = []
        system_columns = system_data["columns"]
        
        # Process each customer row in original order
        for line_num, customer_row in enumerate(customer_data["data"], start=1):
            merged_row = self._create_system_row(
                customer_row,
                system_columns,
                mapping,
                fixed_values,
                line_num
            )
            merged_rows.append(merged_row)
        
        return {"data": merged_rows}
    
    def _create_system_row(
        self,
        customer_row: Dict[str, Any],
        system_columns: List[str],
        mapping: Dict[str, str],
        fixed_values: Dict[str, Any],
        line_num: int
    ) -> Dict[str, Any]:
        """
        Create a system row from customer data
        """
        row = {}
        
        for col in system_columns:
            if col == "رقم السطر":
                row[col] = line_num
            
            elif col == "اسم المستلم":
                customer_col = mapping.get(col)
                row[col] = customer_row.get(customer_col, "") if customer_col else ""
            
            elif col == "العنوان":
                # Copy fully from customer without any modification
                customer_col = mapping.get(col)
                row[col] = customer_row.get(customer_col, "") if customer_col else ""
            
            elif col == "المحافظة":
                # From province column or extract from address
                customer_col = mapping.get(col)
                province = customer_row.get(customer_col, "") if customer_col else ""
                
                if not province or not str(province).strip():
                    # Extract from address
                    address_col = mapping.get("العنوان")
                    address = customer_row.get(address_col, "") if address_col else ""
                    province = AddressParser.extract_province(address)
                
                row[col] = province if province else ""
            
            elif col == "المنطقة":
                # From area column or extract from address
                customer_col = mapping.get(col)
                area = customer_row.get(customer_col, "") if customer_col else ""
                
                if not area or not str(area).strip():
                    # Extract from address
                    address_col = mapping.get("العنوان")
                    address = customer_row.get(address_col, "") if address_col else ""
                    city = AddressParser.extract_city(address)
                    area = AddressParser.extract_area(address, "", city)
                
                row[col] = area if area else ""
            
            elif col == "رقم الموبايل":
                # Primary phone number
                customer_col = mapping.get(col)
                phone_str = customer_row.get(customer_col, "") if customer_col else ""
                
                if phone_str:
                    primary, _ = AddressParser.parse_phones(str(phone_str))
                    row[col] = primary if primary else ""
                else:
                    row[col] = ""
            
            elif col == "رقم الهاتف":
                # Secondary phone number only
                customer_col = mapping.get(col)
                phone_str = customer_row.get(customer_col, "") if customer_col else ""
                
                if phone_str:
                    _, secondary = AddressParser.parse_phones(str(phone_str))
                    row[col] = secondary if secondary else ""
                else:
                    row[col] = ""
            
            elif col == "رقم البوليصة":
                # Copy from customer
                customer_col = mapping.get(col)
                row[col] = customer_row.get(customer_col, "") if customer_col else ""
            
            elif col == "السعر":
                # Total value from customer
                customer_col = mapping.get(col)
                row[col] = customer_row.get(customer_col, "") if customer_col else ""
            
            elif col == "كود العميل":
                # From fixed values (entered once by user)
                row[col] = fixed_values.get("كود العميل", "")
            
            # Fixed system values
            elif col == "الخدمة":
                row[col] = "شحن عادي"
            
            elif col == "نوع الطلب":
                row[col] = "FDP"
            
            elif col == "نوع التحصيل":
                row[col] = "COD"
            
            elif col == "نوع السعر":
                row[col] = "INCLD"
            
            elif col == "الوزن":
                row[col] = 1
            
            elif col == "عدد القطع":
                row[col] = 1
            
            elif col == "فتح الطرد":
                row[col] = "N"
            
            elif col == "رقم المرجع":
                row[col] = ""
            
            # Sender fields (all empty)
            elif col in [
                "اسم المرسل",
                "الراسل الفرعي",
                "محافظة الراسل",
                "منطقة الراسل",
                "عنوان الراسل",
                "أرقام الراسل"
            ]:
                row[col] = ""
            
            # Fallback
            else:
                row[col] = ""
        
        return row
