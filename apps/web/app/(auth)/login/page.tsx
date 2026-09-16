"use client"
import { authApi } from '@/api/authApi'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function page() {

 const [userDetails , setuserDetails] = useState({
    email : "" ,
    password : ""
 })   
 const router = useRouter()
function handleChange(e) {
   const {name , value} = e.target

    setuserDetails((prev)=>({...prev ,[name]:value}))
}

async function handleClick(e){
    e.preventDefault()
    try {
       const result = await authApi.login(userDetails) 
        router.push("/")
    } catch (error) {
        console.error(error)
    }

}


  return (
    <div>
       <div>
        <form action="" onSubmit={handleClick}>
         <h1>login</h1>
         
         <input type="email"   name='email' value={userDetails.email} onChange={handleChange} />
         
         <input type="password" name="password" value={userDetails.password} onChange={handleChange}/>
          <button type='submit'>submit </button>
         </form>
       </div>
        
    </div>
  )
}

export default page