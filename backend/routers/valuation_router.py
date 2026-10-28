from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.planning_service import estimate_valuation

router = APIRouter()

class ValuationRequest(BaseModel):
    property_type: str
    location: str
    area_sqft: float
    property_age: int
    floors: int
    amenities: Optional[str] = ""
    condition: Optional[str] = "Good"

@router.post("/analyze")
async def valuation_analyze(req: ValuationRequest):
    result = await estimate_valuation(
        req.property_type, req.location, req.area_sqft,
        req.property_age, req.floors, req.amenities, req.condition
    )
    return result
