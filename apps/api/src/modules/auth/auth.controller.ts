
import { asyncWrapper } from "../../utils/asyncwrapper.js"
import { authservice } from "./auth.service.js"

export const register =asyncWrapper (async (req,res)=>{
    let {user , accessToken ,refreshToken} = await authservice.register(req.body)
    res.cookie("accessToken",accessToken,{
        httpOnly : true,
        secure : false,
        sameSite : "lax",
        maxAge : 15*60*1000
    })
       res.cookie("refreshToken",refreshToken,{
        httpOnly : true,
        secure : false,
        sameSite : "lax",
        maxAge : 7*24*60*60*1000
    })
    res.json({user : {id: user.id , name : user.name, email :user.email }})
})

export const login =asyncWrapper (async (req,res)=>{
   
        let {user , accessToken ,refreshToken} = await authservice.login(req.body)
    res.cookie("accessToken",accessToken,{
        httpOnly : true,
        secure : false,
        sameSite : "lax",
        maxAge : 15*60*1000
    })
       res.cookie("refreshToken",refreshToken,{
        httpOnly : true,
        secure : false,
        sameSite : "lax",
        maxAge : 7*24*60*60*1000
    })
    res.json({user : {id: user.id , name : user.name, email :user.email }})
})


export const refresh =asyncWrapper (async (req,res)=>{
    const token = req.cookies.refreshToken
    const accessToken = await authservice.refresh(token)
           res.cookie("accessToken",accessToken,{
        httpOnly : true,
        secure : false,
        sameSite : "lax",
        maxAge : 15*60*1000
    })
    res.json({message : "token refreshed"})
})

export const logout = asyncWrapper(async (req,res)=>{
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.json({message : "Logged out"})
})

export const getme = asyncWrapper(async (req,res)=>{
    const userId = req.userId as string
    const data = await authservice.getme(userId)
    res.json({data})
})

