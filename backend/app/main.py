from fastapi import FastAPI
from app.services.rag import ask_rag

from app.schemas.analysis import (
    AnalysisRequest,
    AnalysisResponse,
)

from app.services.gemini import analyze_question


app = FastAPI(
    title="AI Operations Platform",
    version="0.1.0",
)


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