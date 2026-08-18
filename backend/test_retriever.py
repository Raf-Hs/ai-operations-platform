import asyncio

from app.rag.retriever import retrieve


async def main():

    results = await retrieve(
        "¿Quién puede aprobar una devolución de $15,000?"
    )

    for index, result in enumerate(results):

        print(f"\n--- RESULT {index + 1} ---")
        print(f"Source: {result['source']}")
        print(f"Distance: {result['distance']}")
        print(result["content"])


asyncio.run(main())