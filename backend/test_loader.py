from app.rag.loader import load_document


document = load_document(
    "documents/company_policy.md"
)

print(document)