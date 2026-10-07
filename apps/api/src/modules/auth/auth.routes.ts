import express from "express"
import { getme, login, logout, refresh, register } from "./auth.controller.js"
import { validate } from "../../utils/validate.js"
import { loginSchema, registerSchema } from "./auth.validation.js"
import { authenticate } from "../../utils/auth.middleware.js"

const router = express.Router()

router.post("/register",validate(registerSchema),register)
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: Password123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       401:
 *         description: Invalid credentials
 */
router.post("/login",validate(loginSchema),login)
router.post("/refresh" , refresh)
router.post("/logout" , logout)
router.get("/me",authenticate,getme)

export default router