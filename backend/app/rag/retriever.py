from app.rag.embeddings import create_embedding
from app.rag.vector_store import collection


async def search_documents(
    query: str,
    top_k: int = 3,
) -> list[dict]:

    query_embedding = await create_embedding(
        query
    )

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )

    documents = results.get(
        "documents",
        [[]],
    )[0]

    metadatas = results.get(
        "metadatas",
        [[]],
    )[0]

    distances = results.get(
        "distances",
        [[]],
    )[0]

    return [
        {
            "content": document,
            "source": metadata.get("source"),
            "distance": distance,
        }
        for document, metadata, distance
        in zip(
            documents,
            metadatas,
            distances,
        )
    ]