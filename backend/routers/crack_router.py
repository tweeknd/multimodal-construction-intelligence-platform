from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.crack_service import analyze_crack
from schemas.crack_schema import CrackAnalysisResponse

router = APIRouter()

@router.post("/analyze", response_model=CrackAnalysisResponse)
async def crack_analyze(
    image: UploadFile = File(...),
    location: str = Form(default="Unknown Location"),
    structure_type: str = Form(default="Building Wall")
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image_bytes = await image.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty image file")
    
    result = await analyze_crack(image_bytes, location, structure_type, image.content_type)
    return result
