from fastapi import FastAPI
from pydantic import BaseModel
from app.services.pdf_service import extract_text
from app.services.s3_service import download_fromS3
from app.services.chunk_service import chunk_test
from app.services.embedding_service import generate_embedding
from app.repositories.chunk_repository import save_chunks
from app.repositories.search_repositary import search_similarChunks
from app.services.context_service import build_context
from app.services.prompt_service import build_rag_prompt
from app.services.llm_service import generate_answer
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
def search(data: searchRequest):
    # 1. convert question into embedding
    query_embedding = generate_embedding([data.question])[0]

    # 2. find relevant chunks
    results = search_similarChunks(
        data.document_id,
        query_embedding,
        data.limit
    )

    # 3. format results
    formatted_results = [
        {
            "chunk_id": r[0],
            "document_id": r[1],
            "content": r[2],
            "chunk_index": r[3],
            "similarity": r[4],
        }
        for r in results
    ]

    # 4. nothing found -> return early, no LLM call
    if not formatted_results:
        return {
            "success": True,
            "question": data.question,
            "answer": "I couldn't find relevant information in this document.",
            "source": [],
        }

    # 5. build context + prompt, call the LLM once
    context = build_context(formatted_results)
    prompt = build_rag_prompt(data.question, context)
    answer = generate_answer(prompt)
    

    return {
        "success": True,
        "question": data.question,
        "answer": answer,
        "source": formatted_results,
    }