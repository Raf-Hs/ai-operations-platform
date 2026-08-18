import asyncio

from app.rag.retriever import search_documents


async def main():

    query = "¿Cuál es la política de devoluciones?"

    results = await search_documents(
        query,
        top_k=3,
    )

    print()
    print("QUERY")
    print(query)

    print()
    print("RESULTS")

    for index, result in enumerate(
        results,
        start=1,
    ):

        print()
        print(f"--- Result {index} ---")
        print(
            f"Source: {result['source']}"
        )
        print(
            f"Distance: {result['distance']}"
        )
        print(
            f"Content: {result['content']}"
        )


asyncio.run(main())