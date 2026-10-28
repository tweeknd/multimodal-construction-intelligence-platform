from pydantic import BaseModel
from typing import List, Optional, Dict

class MaterialItem(BaseModel):
    material: str
    quantity: str
    unit: str
    unit_cost: str
    total_cost: str

class TaskItem(BaseModel):
    task_name: str
    duration_days: int
    start_week: int
    dependencies: List[str]
    trade: str

class CostBreakdown(BaseModel):
    materials: str
    labor: str
    equipment: str
    overhead: str
    contingency: str
    total: str

class PlanningResponse(BaseModel):
    project_overview: str
    total_estimated_cost: str
    cost_breakdown: CostBreakdown
    material_estimates: List[MaterialItem]
    task_schedule: List[TaskItem]
    risk_factors: List[str]
    recommendations: List[str]
    estimated_duration_months: int
    confidence: float

class ValuationResponse(BaseModel):
    estimated_value: str
    value_range_low: str
    value_range_high: str
    price_per_sqft: str
    market_trend: str
    comparable_properties: List[Dict]
    valuation_factors: List[str]
    investment_score: int
    recommendations: List[str]
    confidence: float
    analysis_summary: str
