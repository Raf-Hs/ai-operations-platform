from pathlib import Path

from app.rag.loader import load_document
from app.rag.chunker import chunk_text
from app.rag.embeddings import create_embedding
from app.rag.vector_store import collection


async def index_document(
    file_path: str,
):

    path = Path(file_path)

    document = load_document(
        file_path
    )

    chunks = chunk_text(
        document
    )

    embeddings = []

    for chunk in chunks:

        embedding = await create_embedding(
            chunk
        )

        embeddings.append(
            embedding
        )

    ids = [
        f"{path.stem}-{index}"
        for index in range(len(chunks))
    ]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=[
            {
                "source": path.name
            }
            for _ in chunks
        ],
    )

    return {
        "document": path.name,
        "chunks": len(chunks),
    }