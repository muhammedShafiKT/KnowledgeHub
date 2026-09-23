import { AppError } from "../../utils/appError.js";
import { asyncWrapper } from "../../utils/asyncwrapper.js";
import { documentService } from "./document.service.js";

export const uploadDocument = asyncWrapper(async(req,res)=>{
if(!req.file){
    throw new AppError(400 , "file is required")
}
const result = await documentService.upload(req.file,req.userId)
res.json({
    success : true,
    message  :"file uploaded successfully ",
    data : result
})

})