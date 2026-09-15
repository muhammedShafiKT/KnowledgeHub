import {z} from "zod"
export const  registerSchema = z.object({
name : z.string().min(3,"Name requires 3 characters"),
email : z.string().email("Invalid email"),
password:z.string().min(6,"password required 6 characters")
}).strict()

export const  loginSchema = z.object({
email : z.string().email("Invalid email"),
password:z.string().min(6,"password required 6 characters")
}).strict()

export type registerInput = z.infer<typeof registerSchema>
export type loginInput = z.infer<typeof loginSchema>