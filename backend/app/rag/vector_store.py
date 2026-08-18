import chromadb


client = chromadb.PersistentClient(
    path="./chroma_data"
)

collection = client.get_or_create_collection(
    name="company_documents"
)
def add_documents(
    documents: list[str],
    embeddings: list[list[float]],
    ids: list[str],
):

    collection.add(
        documents=documents,
        embeddings=embeddings,
        ids=ids,
    )