import fitz
def extract_text(pdf_bytes : bytes)->str:
    document = fitz.open(stream=pdf_bytes,filetype="pdf")
    
    pages=[]
    
    for page in document:
        text = page.get_text()
        pages.append(text)
        
    document.close()
    
    return "\n".join(pages)