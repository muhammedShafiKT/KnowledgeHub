from services.embedding_service import generate_embedding

data = [
    "my name is shafi",
    "iam a good writer",
    "good singer"
]
result = generate_embedding(data)
print(len(result))
print(result)