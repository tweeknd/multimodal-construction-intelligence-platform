from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.safety_service import analyze_safety
from schemas.safety_schema import SafetyAnalysisResponse

router = APIRouter()

@router.post("/analyze", response_model=SafetyAnalysisResponse)
async def safety_analyze(
    image: UploadFile = File(...),
    site_name: str = Form(default="Construction Site"),
    description: str = Form(default="")
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image_bytes = await image.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty image file")
    
    result = await analyze_safety(image_bytes, site_name, description, image.content_type)
    return result
