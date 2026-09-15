import express, { NextFunction, Request , Response } from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
dotenv.config()
import authroutes from "../src/modules/auth/auth.routes.js"
import { Prisma } from "./generated/prisma/client.js"
import cookieParser from "cookie-parser"
import { AppError } from "./utils/appError.js"
const app = express()

app.use(helmet())
app.use(cors({
    origin : process.env.FRONTEND_URL
}))
app.use(express.json())
app.use(cookieParser())


app.use("/api/auth" , authroutes)


app.use((err : any , req : Request ,res :Response , next : NextFunction )=>{
    if(err instanceof Prisma.PrismaClientKnownRequestError && err.code==="P2002"){
      return  res.status(409).json({message : "Email already in use"})
    }
    if(err instanceof AppError){
        return  res.status(err.statusCode).json({message : err.message})
    }
    console.error(err)
    res.status(500).json({message : "internal server error"})
})
app.get("/health",async(req,res)=>{
    res.status(201).json({message : "ok" , service : "knowledgehub"})
})

export default app