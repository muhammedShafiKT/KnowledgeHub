def build_context(results:list[dict]):
    context_parts=[]
    
    for index,result in enumerate (results,start=1):
        context_parts.append(
            f"---Context{index}---\n"
            f"{result['content']}"
        )
        
    return "\n\n".join(context_parts)   