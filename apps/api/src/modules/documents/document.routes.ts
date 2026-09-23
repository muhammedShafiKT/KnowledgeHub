import express from "express"
import { upload } from "../../lib/multer.js"
import { uploadDocument } from "./document.controller.js"
import { authenticate } from "../../utils/auth.middleware.js"

const router = express.Router()

router.post("/",authenticate,upload.single("file"),uploadDocument)


export default router