from services.gemini_service import analyze_with_gemini
import json

SAFETY_PROMPT = """You are an expert construction site safety inspector AI. Analyze this construction site image and provide a detailed safety assessment.

Return ONLY a valid JSON object (no markdown, no explanation) with this EXACT structure:
{{
  "overall_safety_score": <integer 0-100>,
  "compliance_status": "<compliant|warning|critical>",
  "ppe_violations": [
    {{
      "type": "<No Hard Hat|No Safety Vest|No Safety Boots|No Gloves|No Safety Goggles>",
      "severity": "<critical|high|medium|low>",
      "worker_id": "<optional worker identifier or null>",
      "location_in_image": "<description of where in image>"
    }}
  ],
  "hazards": [
    {{
      "hazard_type": "<hazard name>",
      "severity": "<critical|high|medium|low>",
      "description": "<detailed description>",
      "corrective_action": "<specific corrective action>"
    }}
  ],
  "workers_detected": <integer>,
  "workers_compliant": <integer>,
  "immediate_actions": ["<action1>", "<action2>"],
  "general_recommendations": ["<rec1>", "<rec2>"],
  "confidence": <float 0.0-1.0>,
  "analysis_summary": "<2-3 sentence summary>"
}}

Site context: {site_name}. Additional notes: {description}"""

async def analyze_safety(image_bytes: bytes, site_name: str, description: str, mime_type: str = "image/jpeg") -> dict:
    prompt = SAFETY_PROMPT.format(site_name=site_name, description=description)
    result = await analyze_with_gemini(prompt, image_bytes, mime_type)
    
    # Provide defaults if Gemini returns incomplete data
    defaults = {
        "overall_safety_score": 75,
        "compliance_status": "warning",
        "ppe_violations": [],
        "hazards": [],
        "workers_detected": 0,
        "workers_compliant": 0,
        "immediate_actions": ["Conduct immediate site walkthrough"],
        "general_recommendations": ["Enforce PPE policy", "Conduct safety briefing"],
        "confidence": 0.85,
        "analysis_summary": "Safety analysis completed."
    }
    return {**defaults, **result}
