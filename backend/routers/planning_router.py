from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.planning_service import estimate_planning, estimate_valuation

router = APIRouter()

class PlanningRequest(BaseModel):
    project_type: str
    area_sqft: float
    location: str
    duration_months: int
    description: str
    budget_range: Optional[str] = "Not specified"

class ValuationRequest(BaseModel):
    property_type: str
    location: str
    area_sqft: float
    property_age: int
    floors: int
    amenities: Optional[str] = ""
    condition: Optional[str] = "Good"

@router.post("/estimate")
async def planning_estimate(req: PlanningRequest):
    result = await estimate_planning(
        req.project_type, req.area_sqft, req.location,
        req.duration_months, req.description, req.budget_range
    )
    return result

@router.post("/valuation")
async def property_valuation(req: ValuationRequest):
    result = await estimate_valuation(
        req.property_type, req.location, req.area_sqft,
        req.property_age, req.floors, req.amenities, req.condition
    )
    return result
