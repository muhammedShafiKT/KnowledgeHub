from repositories.chunk_repository import save_chunks
from services.embedding_service import generate_embedding


document_id = "2f117278-67cc-402a-8617-937a23b5f683"
chunks = [
    "KnowledgeHub is a RAG application.",
    "Users can upload documents and ask questions."
]

embeddings = generate_embedding(chunks)

save_chunks(
    document_id,
    chunks,
    embeddings
)

print("Chunks saved successfully")