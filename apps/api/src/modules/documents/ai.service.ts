import axios from "axios";
export const aiService = {
    process_document : async(
            document_id: string,
    s3_key: string
    )=>{
        const response = await axios.post("http://localhost:8000/process-document",{
                document_id: document_id,
    s3_key: s3_key
        })
        return response.data
    },

    search_document: async(
        document_id: string,
        question : string,
        limit : number = 5
    )=>{
        const response = await axios.post("http://localhost:8000/search",{
                document_id: document_id,
                question,
                limit
   
        })
        return response.data
    }
}

