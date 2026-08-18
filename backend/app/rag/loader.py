from pathlib import Path

from pypdf import PdfReader


def load_document(file_path: str) -> str:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Document not found: {file_path}"
        )

    extension = path.suffix.lower()

    if extension in [".txt", ".md"]:
        return path.read_text(
            encoding="utf-8"
        )

    if extension == ".pdf":
        reader = PdfReader(str(path))

        pages = []

        for page in reader.pages:
            text = page.extract_text() or ""
            pages.append(text)

        return "\n".join(pages)

    raise ValueError(
        f"Unsupported file type: {extension}"
    )