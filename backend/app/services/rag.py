import os

from google import genai

from app.rag.retriever import search_documents


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


async def ask_rag(question: str) -> dict:

    documents = await search_documents(
        question,
        top_k=3,
    )

    context = "\n\n".join(
        [
            f"Source: {document['source']}\n"
            f"{document['content']}"
            for document in documents
        ]
    )

    prompt = f"""
You are an AI operations assistant.

Answer the user's question using ONLY the
information contained in the provided context.

If the answer cannot be found in the context,
say that the information is not available.

Do not invent facts.

Context:

{context}

User question:

{question}
"""

    response = await client.aio.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
    )

    return {
        "answer": response.text,
        "sources": [
            {
                "source": document["source"],
                "distance": document["distance"],
            }
            for document in documents
        ],
    }