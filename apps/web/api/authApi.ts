import { API } from "./api"
interface loginInput {
    email : string,
    password : string
}

interface registerInput {
    email : string,
    password : string
}


export const authApi = {
login : (data : loginInput)=> API.post("auth/login",data).then((res)=>res.data),
register : (data : registerInput)=> API.post("auth/register",data).then((res)=>res.data),
logout : ()=> API.post("auth/logout").then((res)=>res.data),
getme : ()=> API.get("auth/me").then((res)=>res.data)

}