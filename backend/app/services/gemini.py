import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel

load_dotenv()


class GeminiResponse(BaseModel):
    answer: str
    reasoning_summary: str
    recommended_action: str


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


async def analyze_question(question: str) -> GeminiResponse:
    prompt = f"""
You are an AI operations assistant.

Analyze the following business request.

Return:
- a concise answer
- a short reasoning summary
- a recommended action

Business request:
{question}
"""

    response = await client.aio.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": GeminiResponse,
        },
    )

    return GeminiResponse.model_validate_json(response.text)

async def answer_with_context(
    question: str,
    context: list[dict],
) -> GeminiResponse:

    formatted_context = "\n\n".join(
        f"[Source: {item['source']}]\n{item['content']}"
        for item in context
    )

    prompt = f"""
You are an AI operations assistant.

Answer the user's question using ONLY the provided context.

If the context does not contain enough information to answer,
say that the information is not available in the provided documents.

Do not invent facts.

User question:
{question}

Retrieved context:
{formatted_context}
"""

    response = await client.aio.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": GeminiResponse,
        },
    )

    return GeminiResponse.model_validate_json(response.text)