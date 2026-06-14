from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from datetime import datetime
from services.excel_handler import ExcelHandler
from services.merger import Merger
from services.validator import Validator

app = FastAPI(title="Excel Shipping Merger API", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("output", exist_ok=True)
os.makedirs("templates", exist_ok=True)

# Services
excel_handler = ExcelHandler()
merger = Merger()
validator = Validator()

# Session storage (in-memory)
sessions = {}

@app.get("/api/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.post("/api/upload")
async def upload_files(
    customer_file: UploadFile = File(...),
    system_file: UploadFile = File(...)
):
    """
    Upload customer and system Excel files
    Returns column mappings and data preview
    """
    try:
        # Generate session ID
        session_id = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        
        # Save uploaded files
        customer_path = f"uploads/{session_id}_customer.xlsx"
        system_path = f"uploads/{session_id}_system.xlsx"
        
        with open(customer_path, "wb") as f:
            f.write(await customer_file.read())
        
        with open(system_path, "wb") as f:
            f.write(await system_file.read())
        
        # Parse Excel files
        customer_data = excel_handler.read_excel(customer_path)
        system_data = excel_handler.read_excel(system_path)
        
        # Get auto mappings
        mappings = excel_handler.get_auto_mappings(
            customer_data["columns"],
            system_data["columns"]
        )
        
        # Store session
        sessions[session_id] = {
            "customer_path": customer_path,
            "system_path": system_path,
            "customer_data": customer_data,
            "system_data": system_data,
            "mappings": mappings,
            "created_at": datetime.now().isoformat()
        }
        
        return {
            "status": "success",
            "session_id": session_id,
            "customer_columns": customer_data["columns"],
            "system_columns": system_data["columns"],
            "mappings": mappings,
            "customer_rows": len(customer_data["data"]),
            "system_rows": len(system_data["data"])
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/merge")
async def merge_files(payload: dict):
    """
    Merge files based on provided mappings
    Returns validation report and merged data preview
    """
    try:
        session_id = payload.get("session_id")
        mapping = payload.get("mapping", {})
        fixed_values = payload.get("fixed_values", {})
        
        if session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = sessions[session_id]
        customer_data = session["customer_data"]
        system_data = session["system_data"]
        
        # Merge data
        merged_result = merger.merge_data(
            customer_data,
            system_data,
            mapping,
            fixed_values
        )
        
        # Validate
        validation_report = validator.validate(
            merged_result["data"],
            system_data["columns"]
        )
        
        # Store merged data in session
        session["merged_data"] = merged_result["data"]
        session["validation_report"] = validation_report
        session["mapping"] = mapping
        session["fixed_values"] = fixed_values
        
        return {
            "status": "success",
            "session_id": session_id,
            "total_rows": len(merged_result["data"]),
            "new_rows": validation_report["stats"]["new_rows"],
            "updated_rows": validation_report["stats"]["updated_rows"],
            "error_rows": validation_report["stats"]["error_rows"],
            "warning_rows": validation_report["stats"].get("warning_rows", 0),
            "validation_report": validation_report,
            "preview": merged_result["data"][:5]
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/download/{session_id}")
async def download_excel(session_id: str):
    """
    Download merged Excel file
    """
    try:
        if session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = sessions[session_id]
        
        if "merged_data" not in session:
            raise HTTPException(status_code=400, detail="No merged data available")
        
        # Generate output file
        output_path = f"output/{session_id}_merged.xlsx"
        excel_handler.write_excel(
            output_path,
            session["system_data"]["columns"],
            session["merged_data"]
        )
        
        return FileResponse(
            output_path,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename=f"merged_shipments_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/save-template")
async def save_template(payload: dict):
    """
    Save mapping template for reuse
    """
    try:
        template_name = payload.get("template_name")
        mapping = payload.get("mapping")
        fixed_values = payload.get("fixed_values")
        
        if not template_name:
            raise HTTPException(status_code=400, detail="Template name required")
        
        template_data = {
            "name": template_name,
            "mapping": mapping,
            "fixed_values": fixed_values,
            "created_at": datetime.now().isoformat()
        }
        
        template_file = f"templates/{template_name}.json"
        with open(template_file, "w", encoding="utf-8") as f:
            json.dump(template_data, f, ensure_ascii=False, indent=2)
        
        return {
            "status": "success",
            "message": f"Template '{template_name}' saved successfully",
            "template_name": template_name
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/templates")
async def get_templates():
    """
    Get all saved mapping templates
    """
    try:
        templates = []
        if os.path.exists("templates"):
            for file in os.listdir("templates"):
                if file.endswith(".json"):
                    with open(f"templates/{file}", "r", encoding="utf-8") as f:
                        templates.append(json.load(f))
        
        return {
            "status": "success",
            "templates": templates
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/cleanup/{session_id}")
async def cleanup_session(session_id: str):
    """
    Clean up session files
    """
    try:
        if session_id in sessions:
            session = sessions[session_id]
            
            # Delete uploaded files
            for key in ["customer_path", "system_path"]:
                if key in session and os.path.exists(session[key]):
                    os.remove(session[key])
            
            # Delete session
            del sessions[session_id]
        
        return {"status": "cleaned"}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
