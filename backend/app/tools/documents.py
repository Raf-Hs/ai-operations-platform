from langchain_core.tools import tool

from app.rag.retriever import search_documents


@tool
async def search_documents_tool(
    query: str,
) -> dict:
    """Search company documents for relevant information."""

    results = await search_documents(
        query,
        top_k=3,
    )

    return {
        "results": results
    }