from sentence_transformers import SentenceTransformer
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
def generate_embedding(texts : list[str])->list[list[float]]:
    embedding = model.encode(texts)
    
    return embedding.tolist()