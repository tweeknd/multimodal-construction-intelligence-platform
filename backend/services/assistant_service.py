from services.gemini_service import chat_with_gemini

SYSTEM_CONTEXT = """You are ConstructIQ AI Assistant — an expert construction site assistant with deep knowledge in:
- Construction safety (OSHA, BIS, IS codes)
- Building materials, methods, and best practices  
- Project management and scheduling
- Structural engineering basics
- Indian construction regulations and standards
- Cost estimation and procurement
- Weather impact on construction activities

Provide practical, actionable advice. Be concise but thorough. Format responses clearly with bullet points when listing items."""

WEATHER_PROMPT = """As a construction weather advisory AI, analyze the weather conditions for {location} and provide construction-specific guidance.

Return ONLY a valid JSON object (no markdown) with this EXACT structure:
{{
  "location": "{location}",
  "season": "<current season>",
  "weather_summary": "<current conditions>",
  "temperature_range": "<min-max °C>",
  "precipitation_risk": "<low|medium|high>",
  "wind_advisory": "<safe|caution|halt>",
  "construction_impact": {{
    "concrete_work": "<go|caution|stop>",
    "excavation": "<go|caution|stop>",
    "height_work": "<go|caution|stop>",
    "painting_finishing": "<go|caution|stop>",
    "crane_operations": "<go|caution|stop>"
  }},
  "recommendations": ["<rec1>", "<rec2>", "<rec3>"],
  "alerts": ["<alert1>"],
  "forecast_days": [
    {{
      "day": "<Mon|Tue|...>",
      "condition": "<Sunny|Cloudy|Rainy|etc>",
      "temp": "<°C>",
      "work_suitability": "<excellent|good|fair|poor>"
    }}
  ]
}}

Current date: {current_date}. Additional context: {context}"""

async def get_assistant_response(message: str, conversation_history: list = None) -> str:
    history_text = ""
    if conversation_history:
        for msg in conversation_history[-6:]:  # last 3 exchanges
            role = "User" if msg.get("role") == "user" else "Assistant"
            history_text += f"{role}: {msg.get('content', '')}\n"
    
    full_prompt = f"{SYSTEM_CONTEXT}\n\n"
    if history_text:
        full_prompt += f"Previous conversation:\n{history_text}\n"
    full_prompt += f"User: {message}\n\nAssistant:"
    
    return await chat_with_gemini(full_prompt)

async def get_weather_advisory(location: str, current_date: str, context: str = "") -> dict:
    from services.gemini_service import analyze_with_gemini
    prompt = WEATHER_PROMPT.format(location=location, current_date=current_date, context=context)
    result = await analyze_with_gemini(prompt)
    defaults = {
        "location": location,
        "season": "Current season",
        "weather_summary": "Weather data being fetched",
        "temperature_range": "25-35°C",
        "precipitation_risk": "medium",
        "wind_advisory": "safe",
        "construction_impact": {
            "concrete_work": "go", "excavation": "go", "height_work": "caution",
            "painting_finishing": "go", "crane_operations": "caution"
        },
        "recommendations": ["Monitor weather updates", "Prepare rain protection for materials"],
        "alerts": [],
        "forecast_days": []
    }
    return {**defaults, **result}
