def chunk_test(
    text : str , chunk_size : int = 2000, overlap : int = 200 
)->list[str] :
    chunks = []
    
    start = 0 
    while start<len(text):
        end = start+chunk_size
        
        chunk=text[start:end]
        
        if chunk.strip():
            chunks.append(chunk.strip())
        
        start = end-overlap
        
    return chunks    

# a = "wervrbvtrbm.kteb dbsfkjwerbvbef w,mewr jm4rbk.qb jbr"
# b= chunk_test(a )
# print(b)