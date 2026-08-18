import asyncio

from app.rag.indexer import index_documents


async def main():

    result = await index_documents()

    print()
    print("INDEXING COMPLETE")
    print(
        f"Documents: {result['documents']}"
    )
    print(
        f"Chunks: {result['chunks']}"
    )


asyncio.run(main())