from pydantic import BaseModel
from typing import List, Optional

class PPEViolation(BaseModel):
    type: str
    severity: str
    worker_id: Optional[str] = None
    location_in_image: Optional[str] = None

class SafetyHazard(BaseModel):
    hazard_type: str
    severity: str  # critical | high | medium | low
    description: str
    corrective_action: str

class SafetyAnalysisResponse(BaseModel):
    overall_safety_score: int  # 0-100
    compliance_status: str  # compliant | warning | critical
    ppe_violations: List[PPEViolation]
    hazards: List[SafetyHazard]
    workers_detected: int
    workers_compliant: int
    immediate_actions: List[str]
    general_recommendations: List[str]
    confidence: float
    analysis_summary: str
