from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import HumanMessage

from app.services.rag import ask_rag
from app.schemas.analysis import (
    AnalysisRequest,
    AnalysisResponse,
)
from app.services.gemini import (
    analyze_question,
    run_agent,
)
from app.agent.graph import agent_graph


app = FastAPI(
    title="AI Operations Platform",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
class AgentRequest(BaseModel):
    question: str


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ai-operations-platform",
    }


@app.post(
    "/api/analyze",
    response_model=AnalysisResponse,
)
async def analyze(request: AnalysisRequest):

    result = await analyze_question(
        request.question
    )

    return result


@app.post("/api/rag")
async def rag(request: AnalysisRequest):

    result = await ask_rag(
        request.question
    )

    return result


@app.post("/api/agent")
async def agent(request: AnalysisRequest):

    result = await run_agent(
        request.question
    )

    return {
        "answer": result
    }


@app.post("/api/agent/v2")
async def agent_v2(
    request: AgentRequest,
):

    result = await agent_graph.ainvoke(
        {
            "messages": [
                HumanMessage(
                    content=request.question
                )
            ]
        }
    )

    final_message = result["messages"][-1]

    return {
        "answer": final_message.content
    }