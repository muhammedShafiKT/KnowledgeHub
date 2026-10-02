from app.services.db_service import get_connection

def save_chunks(
    document_id:str,
    chunks:list[str],
    embeddings:list[list[float]]
    ):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            for index,(chunk,embedding) in enumerate(zip(chunks,embeddings)):
                cursor.execute(
                    """
                    INSERT INTO "DocumentChunk"
                    (
                        id,
                        "documentId",
                        content,
                        "chunkIndex",
                        embedding,
                        "createdAt"
                    )
                    VALUES(
                        gen_random_UUID(),
                        %s,
                        %s,
                        %s,
                        %s::vector,
                        NOW()                         
                    )
                    """ ,
                    (
                        document_id,
                        chunk,
                        index,
                        embedding
                    )                 
                )
                
        connection.commit()  
    except Exception:
        connection.rollback()
        raise
    finally :
        connection.close()
            
    