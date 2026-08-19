from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from app.rag.indexer import index_documents
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
from pathlib import Path

app = FastAPI(
    title="AI Operations Platform",
    version="0.1.0",
)
@app.on_event("startup")
async def startup_event():

    print("Starting document indexing...")

    result = await index_documents()

    print(
        f"RAG indexing complete: "
        f"{result['documents']} documents, "
        f"{result['chunks']} chunks"
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
    @app.get("/api/documents")
async def documents():

    documents_path = Path("documents")

    result = []

    for path in sorted(
        documents_path.glob("*.md")
    ):
        result.append(
            {
                "name": path.name,
                "content": path.read_text(
                    encoding="utf-8"
                ),
            }
        )

    return {
        "documents": result
    }