import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod/v3";
import { AppError } from "./appError.js";

export const validate = (schema : ZodSchema)=>{
return (req :Request , res : Response , next : NextFunction)=>{
const result = schema.safeParse(req.body)

if(!result.success){
    const message = result.error.issues.map((i)=>i.message).join(", ")
    //  const message = result.error.issues[0].message
    return next (new AppError(400,message))
}

req.body = result.data
next()
}
}