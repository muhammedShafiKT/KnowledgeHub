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
    }
}