import { uploadtoS3 } from "./s3.service.js"
import prisma from "../../lib/prisma.js"
import { aiService } from "./ai.service.js"
import { AppError } from "../../utils/appError.js"
export const documentService = {
    upload : async(file : Express.Multer.File , userId : string)=>{

        const key = `documents/${userId}/${crypto.randomUUID()}.pdf`

        const uploadKey = await uploadtoS3(
            file.buffer ,key ,file.mimetype
        )

        const document = await prisma.document.create({
           data :{
             userId,
            originalName : file.originalname,
            s3Key : uploadKey,
            mimeType : file.mimetype,
             size : file.size
            }
        })

        const aiResult = await aiService.process_document(document.id,document.s3Key)
        return {document,aiResult}
    }
}