from services.gemini_service import analyze_with_gemini

CRACK_PROMPT = """You are an expert structural engineer AI specializing in crack analysis and building diagnostics. Analyze this construction/building image for cracks, structural damage, and material deterioration.

Return ONLY a valid JSON object (no markdown) with this EXACT structure:
{{
  "crack_detected": <true|false>,
  "crack_count": <integer>,
  "cracks": [
    {{
      "crack_type": "<hairline|structural|surface|diagonal|horizontal|vertical|map_cracking|spalling>",
      "severity": "<minor|moderate|severe|critical>",
      "width_estimate": "<e.g. 0.1mm or null>",
      "length_estimate": "<e.g. 30cm or null>",
      "location_description": "<where in image/structure>"
    }}
  ],
  "overall_severity": "<none|minor|moderate|severe|critical>",
  "structural_risk": "<low|medium|high|critical>",
  "probable_causes": ["<cause1>", "<cause2>"],
  "corrective_actions": ["<action1>", "<action2>"],
  "immediate_action_required": <true|false>,
  "engineer_inspection_required": <true|false>,
  "estimated_repair_cost_range": "<e.g. ₹5,000 - ₹25,000 or USD 500 - 2,000>",
  "confidence": <float 0.0-1.0>,
  "analysis_summary": "<2-3 sentence expert summary>"
}}

Structure type: {structure_type}. Location: {location}."""

async def analyze_crack(image_bytes: bytes, location: str, structure_type: str, mime_type: str = "image/jpeg") -> dict:
    prompt = CRACK_PROMPT.format(structure_type=structure_type, location=location)
    result = await analyze_with_gemini(prompt, image_bytes, mime_type)
    
    defaults = {
        "crack_detected": False,
        "crack_count": 0,
        "cracks": [],
        "overall_severity": "none",
        "structural_risk": "low",
        "probable_causes": [],
        "corrective_actions": ["Monitor structure regularly"],
        "immediate_action_required": False,
        "engineer_inspection_required": False,
        "estimated_repair_cost_range": "N/A",
        "confidence": 0.80,
        "analysis_summary": "No significant cracks detected in the provided image."
    }
    return {**defaults, **result}
