import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel
from google.genai import types
load_dotenv()
from app.tools.definitions import (
    sales_tool,
    customer_tool,
    inventory_tool,
)
from app.tools.registry import execute_tool

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

async def run_agent(
    question: str,
) -> str:

    tools = [
        types.Tool(
            function_declarations=[
                types.FunctionDeclaration(
                    name=sales_tool["name"],
                    description=sales_tool["description"],
                    parameters=sales_tool["parameters"],
                ),
                types.FunctionDeclaration(
                    name=customer_tool["name"],
                    description=customer_tool["description"],
                    parameters=customer_tool["parameters"],
                ),
                types.FunctionDeclaration(
                    name=inventory_tool["name"],
                    description=inventory_tool["description"],
                    parameters=inventory_tool["parameters"],
                ),
            ]
        )
    ]

    response = await client.aio.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=question,
        config=types.GenerateContentConfig(
            tools=tools,
        ),
    )

    if not response.function_calls:
        return response.text

    function_call = response.function_calls[0]

    print(
        f"[TOOL CALL] {function_call.name}"
    )

    print(
        f"[TOOL ARGS] {function_call.args}"
    )
    tool_result = execute_tool(
        function_call.name,
        function_call.args or {},
    )
    
    tool_response = types.Part.from_function_response(
        name=function_call.name,
        response=tool_result,
    )
    print(
        f"[TOOL RESULT] {tool_result}"
    )
    final_response = await client.aio.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=[
            question,
            response.candidates[0].content,
            tool_response,
        ],
        config=types.GenerateContentConfig(
            tools=tools,
        ),
    )

    return final_response.text