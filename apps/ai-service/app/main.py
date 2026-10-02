from fastapi import FastAPI
from pydantic import BaseModel
from app.services.pdf_service import extract_text
from app.services.s3_service import download_fromS3
from app.services.chunk_service import chunk_test
from app.services.embedding_service import generate_embedding
from app.repositories.chunk_repository import save_chunks
app=FastAPI(title="Knowledgehub ai service")

class DocumentRequest(BaseModel):
    document_id : str
    s3_key : str
    
@app.get("/health")
def health():
    return{
        "success" :True,
        "service" : "ai service",
        "status" : "running"
    }  

@app.post("/process-document")
def process_document(data:DocumentRequest):
    pdf_bytes = download_fromS3(data.s3_key)
    text = extract_text(pdf_bytes)
    chunks = chunk_test(text)
    if not chunks :
        return {
            "success" : False,
            "message" : "no text could be extracted"
        }
        
    embeddings = generate_embedding(chunks)
    saveChunks = save_chunks(
        data.document_id,
        chunks,
        embeddings 
    )
    return{
        "success" :True,
        "doc_id" : data.document_id,
        "chunk_count" : len(chunks)
        }      