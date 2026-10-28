from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.assistant_service import get_assistant_response, get_weather_advisory
from datetime import datetime

router = APIRouter()

class Message(BaseModel):
    role: str  # user | assistant
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Message]] = []

class WeatherRequest(BaseModel):
    location: str
    context: Optional[str] = ""

@router.post("/chat")
async def assistant_chat(req: ChatRequest):
    history = [m.dict() for m in req.conversation_history] if req.conversation_history else []
    response = await get_assistant_response(req.message, history)
    return {"response": response, "role": "assistant"}

@router.post("/weather")
async def weather_advisory(req: WeatherRequest):
    current_date = datetime.now().strftime("%B %d, %Y")
    result = await get_weather_advisory(req.location, current_date, req.context)
    return result
