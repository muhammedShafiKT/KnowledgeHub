import express from "express"
import { upload } from "../../lib/multer.js"
import { uploadDocument } from "./document.controller.js"

const router = express.Router()

router.post("/",upload.single("file"),uploadDocument)


export default router