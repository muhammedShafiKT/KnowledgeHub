import { uploadtoS3 } from "./s3.service.js"
import prisma from "../../lib/prisma.js"
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
        return document
    }
}