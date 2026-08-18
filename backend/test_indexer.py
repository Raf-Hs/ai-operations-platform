import asyncio

from app.rag.indexer import index_document


async def main():
    result = await index_document(
        "documents/company_policy.md"
    )

    print(result)


asyncio.run(main())