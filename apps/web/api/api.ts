import axios from "axios"

const basic_url = process.env.NEXT_PUBLIC_API_URL
const url = `${basic_url}/api`

export const API = axios.create({
    baseURL : url,
    withCredentials : true ,
    headers : {
        "Content-Type" : "application/json"
    }
})