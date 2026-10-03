from app.services.db_service import get_connection
def search_similarChunks(
    document_id : str,
    query_Embedding : list[float],
    limit : int = 5
    
):
    connection = get_connection()
    
    try :
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT 
                id,
                "documentId",
                content,
                "chunkIndex",
                1-(embedding<=>%s::vector) AS similarity
                FROM "DocumentChunk"
                WHERE "documentId" = %s
                ORDER BY embedding<=>%s::vector
                LIMIT %s
                """,(
                    query_Embedding,
                    document_id,
                    query_Embedding,
                    limit
                )
                
            )
            return cursor.fetchall()
            
    finally :    
        connection.close()