"use client"
import { authApi } from '@/api/authApi'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function page() {

 const [userDetails , setuserDetails] = useState({
    name : "",
    email : "" ,
    password : "",
    confirmpassword : ""
 })   

 const[error,seterror] = useState()
 const router = useRouter()
function handleChange(e) {
   const {name , value} = e.target

    setuserDetails((prev)=>({...prev ,[name]:value}))
}

async function handleClick(e){
    e.preventDefault()
    if(userDetails.password!==userDetails.confirmpassword){
        seterror("Passwords doesnt match")
        return
    }
    try {
       const result = await authApi.register({
        name : userDetails.name,
        email : userDetails.email,
        password :userDetails.password
       }) 
        router.push("/")
    } catch (err) {
        console.error(err)
        seterror(err?.response?.data?.message || "login failed")
    }

}


  return (
    <div>
       <div>
        <form action="" onSubmit={handleClick}>
         <h1>login</h1>
         <input type="text"   name='name' placeholder='name' value={userDetails.name} onChange={handleChange} />
         
         <input type="email"   name='email' placeholder='email' value={userDetails.email} onChange={handleChange} />
         
         <input type="password" name="password" placeholder='password' value={userDetails.password} onChange={handleChange}/>

          <input type="password" name="confirmpassword" placeholder='confirm password' value={userDetails.confirmpassword} onChange={handleChange}/>

         {error&&<p style={{color : "red"}}>{error}</p>}
          <button type='submit'>submit </button>
         </form>
       </div>
        
    </div>
  )
}

export default page