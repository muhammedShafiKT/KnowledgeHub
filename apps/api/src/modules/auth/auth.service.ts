import { email } from "zod"
import prisma from "../../lib/prisma.js"
import { AppError } from "../../utils/appError.js"
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken"
interface registerInput {
  name : string ,
   email : string ,
    password : string
}

interface loginInput {
   email : string ,
    password : string
}

interface accessTokenpayload {
  userId :string
}
const generateTokens = (userId : string)=>{
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET_KEY as string
      const accessToken = jwt.sign(
        {userId : userId,
        },
      JWT_ACCESS_SECRET,
        {
        expiresIn : "15m"
        }
      )
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET_KEY as string
            const refreshToken = jwt.sign(
        {userId : userId,
        },
      JWT_REFRESH_SECRET,
        {
        expiresIn : "7d"
        }
      )
      return { accessToken , refreshToken}
}

export const  authservice = {
    register :async ({name , email , password} : registerInput)=>{

            const existing = await prisma.user.findUnique({
        where :{
             email 
        }
      })
      if(existing){
        throw new AppError(401,"User already exists")
      }
      const hashedpassword = await bcrypt.hash(password,10)
      const user = await prisma.user.create({
        data :{
            name , email , passwordHash : hashedpassword
        }
      })

const {accessToken , refreshToken} = generateTokens(user.id)
      
      return {user,accessToken , refreshToken}
    },

        login :async ({email , password} : loginInput)=>{
      const user = await prisma.user.findUnique({
        where :{
             email 
        }
      })

      if(!user){
        throw new AppError(401,"Invalid email")
      }
      const isMatch = await bcrypt.compare(password,user.passwordHash)
      if(!isMatch){
        throw new AppError(401, "password doesnt match")
      }

const {accessToken , refreshToken} = generateTokens(user.id)
      
      return {user,accessToken , refreshToken}
    },

    refresh : async (token : string)=>{
      
      if(!token){
          throw new AppError(401,"not authorized")
      }
     let decoded : accessTokenpayload
      try {
         decoded = jwt.verify(token , 
              process.env.JWT_REFRESH_SECRET_KEY as string,
      ) as accessTokenpayload
      }  catch (err) {
          if(err instanceof jwt.TokenExpiredError){
              throw new AppError(401,"refresh token expired")
          }
         throw new AppError(401,"invalid token")
      }
          

      const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET_KEY as string
      const accessToken = jwt.sign(
        {userId : decoded.userId,
        },
      JWT_ACCESS_SECRET,
        {
        expiresIn : "15m"
        }
      )
  

    return accessToken



    
},

    getme : async (userId : string)=>{

      const user = prisma.user.findUnique({
        where : {
          id : userId
        } ,
        select : {
          id : true ,name :true ,email :true 
        }
      })

      if (!user){
        throw new AppError(404 , "user not found")
      }
      return user
    }
}