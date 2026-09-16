import { API } from "./api"
interface loginInput {
    email : string,
    password : string
}


export const authApi = {
login : (data : loginInput)=> API.post("/login",data).then((res)=>res.data)

}