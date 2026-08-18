from app.rag.loader import load_document
from app.rag.chunker import chunk_text


document = load_document(
    "documents/company_policy.md"
)

chunks = chunk_text(document)

for index, chunk in enumerate(chunks):
    print(f"\n--- CHUNK {index} ---")
    print(chunk)