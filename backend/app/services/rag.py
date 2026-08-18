from app.rag.retriever import retrieve
from app.services.gemini import answer_with_context


async def ask_rag(
    question: str,
) -> dict:

    results = await retrieve(
        question,
        top_k=3,
    )

    answer = await answer_with_context(
        question,
        results,
    )

    sources = list({
        result["source"]
        for result in results
    })

    return {
        "answer": answer.answer,
        "reasoning_summary": answer.reasoning_summary,
        "recommended_action": answer.recommended_action,
        "sources": sources,
    }