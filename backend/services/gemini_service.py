from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
import base64
import json
import re

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

MODEL = "gemini-2.5-flash"

def extract_json(text: str) -> dict:
    """Extract JSON from Gemini response text, handling markdown code blocks."""
    # Try to find JSON in code block
    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
    # Try raw JSON
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Try to find first { } block
    match = re.search(r'\{[\s\S]*\}', text)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass
    return {}

async def analyze_with_gemini(prompt: str, image_bytes: bytes = None, mime_type: str = "image/jpeg") -> dict:
    """Call Gemini with optional image and return parsed JSON."""
    contents = []
    if image_bytes:
        contents.append(
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
        )
    contents.append(prompt)

    response = client.models.generate_content(
        model=MODEL,
        contents=contents
    )
    return extract_json(response.text)

async def chat_with_gemini(prompt: str) -> str:
    """Call Gemini for text chat and return raw text."""
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )
    return response.text
