from fastapi import FastAPI
app=FastAPI(title="Knowledgehub ai service")

@app.get("/health")
def health():
    return{
        "success" :True,
        "service" : "ai service",
        "status" : "running"
    }