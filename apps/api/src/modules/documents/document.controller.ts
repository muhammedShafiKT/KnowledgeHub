import { AppError } from "../../utils/appError.js";
import { asyncWrapper } from "../../utils/asyncwrapper.js";
import { documentService } from "./document.service.js";

export const uploadDocument = asyncWrapper(async(req,res)=>{
if(!req.file){
    throw new AppError(400 , "file is required")
}
        if(req.file.mimetype!=="application/pdf"){
          throw new AppError(400,"Only pdf files are accepted")
        }
        if(!req.file.buffer.subarray(0,5).toString().startsWith("%PDF-")){
          throw new AppError(400,"File isnt a valid pdf")
        }
const result = await documentService.upload(req.file,req.userId)
res.json({
    success : true,
    message  :"file uploaded successfully ",
    data : result
})

})