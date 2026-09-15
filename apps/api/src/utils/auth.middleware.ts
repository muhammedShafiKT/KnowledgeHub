import { Request , Response,NextFunction } from "express"
import jwt from "jsonwebtoken"
import { AppError } from "./appError.js"

interface accessTokenpayload {
    userId : string
}
export const authenticate = (req:Request , res : Response,next :NextFunction)=>{
const token = req.cookies.accessToken

if(!token){
    return next(new AppError(401,"not authorized"))
}
try {
    const decoded = jwt.verify(token , 
        process.env.JWT_ACCESS_SECRET_KEY as string,
) as accessTokenpayload
req.userId = decoded.userId
next()
} catch (err) {
    if(err instanceof jwt.TokenExpiredError){
        return next(new AppError(401,"access token expired"))
    }
    return next(new AppError(401,"invalid token"))
}
}