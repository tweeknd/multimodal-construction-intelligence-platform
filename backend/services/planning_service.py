from services.gemini_service import analyze_with_gemini, chat_with_gemini

PLANNING_PROMPT = """You are an expert construction project planner and quantity surveyor AI. Based on the project details provided, generate a comprehensive construction plan with material estimates, cost breakdown, and task schedule.

Return ONLY a valid JSON object (no markdown) with this EXACT structure:
{{
  "project_overview": "<brief overview>",
  "total_estimated_cost": "<e.g. ₹2.4 Crore>",
  "cost_breakdown": {{
    "materials": "<cost with percentage>",
    "labor": "<cost with percentage>",
    "equipment": "<cost with percentage>",
    "overhead": "<cost with percentage>",
    "contingency": "<cost with percentage>",
    "total": "<total cost>"
  }},
  "material_estimates": [
    {{
      "material": "<name>",
      "quantity": "<amount>",
      "unit": "<unit>",
      "unit_cost": "<₹ per unit>",
      "total_cost": "<total>"
    }}
  ],
  "task_schedule": [
    {{
      "task_name": "<task>",
      "duration_days": <integer>,
      "start_week": <integer>,
      "dependencies": ["<task name>"],
      "trade": "<Civil|Structural|MEP|Finishing|Landscaping>"
    }}
  ],
  "risk_factors": ["<risk1>", "<risk2>"],
  "recommendations": ["<rec1>", "<rec2>"],
  "estimated_duration_months": <integer>,
  "confidence": <float 0.0-1.0>
}}

Project details:
- Type: {project_type}
- Area: {area_sqft} sq ft
- Location: {location}
- Timeline: {duration_months} months
- Description: {description}
- Budget range: {budget_range}"""

VALUATION_PROMPT = """You are an expert real estate valuation AI with deep knowledge of Indian property markets. Analyze the provided property details and generate a comprehensive valuation report.

Return ONLY a valid JSON object (no markdown) with this EXACT structure:
{{
  "estimated_value": "<e.g. ₹1.2 Crore>",
  "value_range_low": "<lower bound>",
  "value_range_high": "<upper bound>",
  "price_per_sqft": "<₹ per sqft>",
  "market_trend": "<rising|stable|declining>",
  "comparable_properties": [
    {{
      "description": "<property description>",
      "area_sqft": "<area>",
      "estimated_price": "<price>",
      "price_per_sqft": "<price/sqft>",
      "distance": "<distance from subject>"
    }}
  ],
  "valuation_factors": ["<positive factor>", "<negative factor>"],
  "investment_score": <integer 0-100>,
  "recommendations": ["<rec1>", "<rec2>"],
  "confidence": <float 0.0-1.0>,
  "analysis_summary": "<2-3 sentence summary>"
}}

Property details:
- Type: {property_type}
- Location: {location}
- Area: {area_sqft} sq ft
- Age: {property_age} years
- Floors: {floors}
- Amenities: {amenities}
- Condition: {condition}"""

async def estimate_planning(
    project_type: str, area_sqft: float, location: str,
    duration_months: int, description: str, budget_range: str
) -> dict:
    prompt = PLANNING_PROMPT.format(
        project_type=project_type, area_sqft=area_sqft, location=location,
        duration_months=duration_months, description=description, budget_range=budget_range
    )
    result = await analyze_with_gemini(prompt)
    defaults = {
        "project_overview": "Construction project analysis complete.",
        "total_estimated_cost": "To be determined",
        "cost_breakdown": {
            "materials": "45%", "labor": "30%", "equipment": "10%",
            "overhead": "10%", "contingency": "5%", "total": "100%"
        },
        "material_estimates": [],
        "task_schedule": [],
        "risk_factors": ["Weather delays", "Material price fluctuation"],
        "recommendations": ["Procure materials early", "Engage certified contractors"],
        "estimated_duration_months": duration_months,
        "confidence": 0.82
    }
    return {**defaults, **result}

async def estimate_valuation(
    property_type: str, location: str, area_sqft: float,
    property_age: int, floors: int, amenities: str, condition: str
) -> dict:
    prompt = VALUATION_PROMPT.format(
        property_type=property_type, location=location, area_sqft=area_sqft,
        property_age=property_age, floors=floors, amenities=amenities, condition=condition
    )
    result = await analyze_with_gemini(prompt)
    defaults = {
        "estimated_value": "To be determined",
        "value_range_low": "N/A",
        "value_range_high": "N/A",
        "price_per_sqft": "N/A",
        "market_trend": "stable",
        "comparable_properties": [],
        "valuation_factors": ["Location premium", "Market conditions"],
        "investment_score": 70,
        "recommendations": ["Consult local broker", "Verify legal clearances"],
        "confidence": 0.78,
        "analysis_summary": "Valuation analysis completed based on provided details."
    }
    return {**defaults, **result}
