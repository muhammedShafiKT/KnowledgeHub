import express from "express"
import { getme, login, logout, refresh, register } from "./auth.controller.js"
import { validate } from "../../utils/validate.js"
import { loginSchema, registerSchema } from "./auth.validation.js"
import { authenticate } from "../../utils/auth.middleware.js"

const router = express.Router()

router.post("/register",validate(registerSchema),register)
router.post("/login",validate(loginSchema),login)
router.post("/refresh" , refresh)
router.post("/logout" , logout)
router.get("/me",authenticate,getme)

export default router