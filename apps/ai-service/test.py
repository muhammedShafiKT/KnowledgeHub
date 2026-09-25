import fitz

def sample_pdf():
    document = fitz.open("sample.pdf")
    
    for page in document:
        print(page.get_text())
    
    document.close()   

sample_pdf()     