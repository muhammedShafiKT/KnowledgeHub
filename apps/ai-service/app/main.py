from fastapi import FastAPI
from pydantic import BaseModel
from app.services.pdf_service import extract_text
from app.services.s3_service import download_fromS3
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
    return{
        "success" :True,
        "service" : "ai service",
        "status" : "running",
        "text" : text
        }      