import re
from typing import Dict, Tuple, Optional

class AddressParser:
    """
    Parse addresses to extract province (محافظة), area (منطقة), and city (مدينة)
    """
    
    # Known provinces in Egypt/Arab countries
    PROVINCES = {
        "القاهرة": "القاهرة",
        "الإسكندرية": "الإسكندرية",
        "الجيزة": "الجيزة",
        "القليوبية": "القليوبية",
        "المنوفية": "المنوفية",
        "الدقهلية": "الدقهلية",
        "الشرقية": "الشرقية",
        "البحيرة": "البحيرة",
        "كفر الشيخ": "كفر الشيخ",
        "الغربية": "الغربية",
        "المنيا": "المنيا",
        "بني سويف": "بني سويف",
        "الفيوم": "الفيوم",
        "أسيوط": "أسيوط",
        "سوهاج": "سوهاج",
        "قنا": "قنا",
        "الأقصر": "الأقصر",
        "أسوان": "أسوان",
        "مطروح": "مطروح",
        "البحر الأحمر": "البحر الأحمر",
        "جنوب سيناء": "جنوب سيناء",
        "شمال سيناء": "شمال سيناء",
    }
    
    # Known areas/districts
    AREAS = {
        # Cairo areas
        "مصر الجديدة": "مصر الجديدة",
        "الزمالك": "الزمالك",
        "الدقي": "الدقي",
        "الهرم": "الهرم",
        "6 أكتوبر": "6 أكتوبر",
        "الشيخ زايد": "الشيخ زايد",
        "المعادي": "المعادي",
        "القطامية": "القطامية",
        "حلوان": "حلوان",
        "15 مايو": "15 مايو",
        "النزهة": "النزهة",
        "عين شمس": "عين شمس",
        "مدينة نصر": "مدينة نصر",
        "الشرقية": "الشرقية",
        "المتوسطة": "المتوسطة",
        # Alexandria
        "الشاطبي": "الشاطبي",
        "سيدي جابر": "سيدي جابر",
        "الإبراهيمية": "الإبراهيمية",
        "رشدي": "رشدي",
        "سموحة": "سموحة",
    }
    
    # Cities as fallback for areas
    CITIES = {
        "القاهرة": "القاهرة",
        "الإسكندرية": "الإسكندرية",
        "الجيزة": "الجيزة",
        "بنها": "بنها",
        "الزقازيق": "الزقازيق",
        "الإسماعيلية": "الإسماعيلية",
        "السويس": "السويس",
        "المنصورة": "المنصورة",
        "طنطا": "طنطا",
        "أسيوط": "أسيوط",
        "سوهاج": "سوهاج",
        "أسوان": "أسوان",
        "الأقصر": "الأقصر",
    }
    
    @staticmethod
    def extract_province(address: str = "", province_col: str = "") -> Optional[str]:
        """
        Extract province from address or column
        """
        if not address and not province_col:
            return None
        
        # Use column value if provided
        if province_col and province_col.strip():
            return province_col.strip()
        
        # Search in address
        if address:
            address_lower = address.lower()
            for province in AddressParser.PROVINCES.keys():
                if province.lower() in address_lower:
                    return AddressParser.PROVINCES[province]
        
        return None
    
    @staticmethod
    def extract_area(address: str = "", area_col: str = "", city_fallback: str = "") -> Optional[str]:
        """
        Extract area from address or column, fallback to city
        """
        if not address and not area_col:
            return city_fallback if city_fallback else None
        
        # Use column value if provided
        if area_col and area_col.strip():
            return area_col.strip()
        
        # Search in address
        if address:
            address_lower = address.lower()
            
            # Search for known areas
            for area in AddressParser.AREAS.keys():
                if area.lower() in address_lower:
                    return AddressParser.AREAS[area]
            
            # Search for known cities (as fallback)
            for city in AddressParser.CITIES.keys():
                if city.lower() in address_lower:
                    return AddressParser.CITIES[city]
        
        return city_fallback if city_fallback else None
    
    @staticmethod
    def extract_city(address: str = "") -> Optional[str]:
        """
        Extract city from address
        """
        if not address:
            return None
        
        address_lower = address.lower()
        
        # Search for known cities
        for city in AddressParser.CITIES.keys():
            if city.lower() in address_lower:
                return AddressParser.CITIES[city]
        
        return None
    
    @staticmethod
    def parse_phones(phone_str: str) -> Tuple[Optional[str], Optional[str]]:
        """
        Parse phone numbers from a string
        Returns: (primary_mobile, secondary_phone)
        """
        if not phone_str or not isinstance(phone_str, str):
            return None, None
        
        # Extract all numbers
        numbers = re.findall(r'\d+', phone_str)
        
        # Filter valid phone numbers
        valid_numbers = []
        for num in numbers:
            if len(num) >= 10 and len(num) <= 12:
                if num.startswith('0') or num.startswith('2'):
                    valid_numbers.append(num)
        
        # Return first and second numbers
        primary = valid_numbers[0] if len(valid_numbers) > 0 else None
        secondary = valid_numbers[1] if len(valid_numbers) > 1 else None
        
        return primary, secondary
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """
        Validate phone number format
        """
        if not phone or not isinstance(phone, str):
            return False
        
        # Extract digits
        digits = re.sub(r'\D', '', phone)
        
        # Check length
        if len(digits) < 10 or len(digits) > 12:
            return False
        
        # Check if starts with valid prefix
        return digits.startswith('0') or digits.startswith('2')
