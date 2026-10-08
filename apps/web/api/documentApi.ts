import { API } from "./api"





export const documentApi = {
getDocs : ()=> API.get("document").then((res)=>res.data),


}