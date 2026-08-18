from pathlib import Path

from app.rag.loader import load_document
from app.rag.chunker import chunk_document
from app.rag.embeddings import create_embedding
from app.rag.vector_store import collection


async def index_documents():

    documents_path = Path("documents")

    total_documents = 0
    total_chunks = 0

    for path in documents_path.glob("*.md"):

        print(f"Processing: {path.name}")

        text = load_document(
            str(path)
        )

        chunks = chunk_document(text)

        embeddings = []

        for chunk in chunks:

            embedding = await create_embedding(
                chunk
            )

            embeddings.append(embedding)

        ids = [
            f"{path.stem}-{index}"
            for index in range(len(chunks))
        ]

        collection.upsert(
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

        total_documents += 1
        total_chunks += len(chunks)

        print(
            f"  Chunks: {len(chunks)}"
        )

    return {
        "documents": total_documents,
        "chunks": total_chunks,
    }