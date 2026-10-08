def build_rag_prompt(
    question : str,
    context : str
)->str : 
 return f"""
You are a helpful assistant answering questions about a user's document.

Answer the question using ONLY the provided context.

If the answer cannot be found in the context, say:
"I couldn't find the answer in the provided document."

Do not make up information.

Context:
{context}

Question:
{question}
    """
    