from fastapi import FastAPI
from pydantic import BaseModel
from app.services.pdf_service import extract_text
from app.services.s3_service import download_fromS3
from app.services.chunk_service import chunk_test
from app.services.embedding_service import generate_embedding
from app.repositories.chunk_repository import save_chunks
from app.repositories.search_repositary import search_similarChunks
app=FastAPI(title="Knowledgehub ai service")

class DocumentRequest(BaseModel):
    document_id : str
    s3_key : str

class searchRequest(BaseModel):
    document_id : str
    question : str
    limit : int=5   
    
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
    
    
@app.post("/search") 
def search(data : searchRequest):
    # 1.convert into embedding  
    query_Embedding = generate_embedding([data.question])[0] 
    
    # 2.relevant Chunks
    results = search_similarChunks(
        data.document_id,
        query_Embedding,
        data.limit
    )
    
    formatted_results = []
    
    for result in results:
        formatted_results.append({
                        "chunk_id": result[0],
            "document_id": result[1],
            "content": result[2],
            "chunk_index": result[3],
            "similarity": result[4]
        })
    return {
        "success" : True,
        "question" : data.question,
        "results" : formatted_results
    }    