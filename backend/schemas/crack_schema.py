from pydantic import BaseModel
from typing import List, Optional

class CrackDetail(BaseModel):
    crack_type: str  # hairline | structural | surface | diagonal | horizontal | vertical
    severity: str    # minor | moderate | severe | critical
    width_estimate: Optional[str] = None
    length_estimate: Optional[str] = None
    location_description: str

class CrackAnalysisResponse(BaseModel):
    crack_detected: bool
    crack_count: int
    cracks: List[CrackDetail]
    overall_severity: str
    structural_risk: str  # low | medium | high | critical
    probable_causes: List[str]
    corrective_actions: List[str]
    immediate_action_required: bool
    engineer_inspection_required: bool
    estimated_repair_cost_range: str
    confidence: float
    analysis_summary: str
