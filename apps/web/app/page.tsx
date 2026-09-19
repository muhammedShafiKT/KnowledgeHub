"use client"
import { authApi } from '@/api/authApi'  
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function page() {
  const [data,setdata] = useState()
  const router = useRouter()
  useEffect(()=>{
  async function checkfunction() {
    try {
          const res =  await authApi.getme()
          setdata(res)
    } catch (error) {
      console.error(error)
    }

  }
  checkfunction()

  },[])

  async function logout(){
    try {
      const result =await  authApi.logout()
      router.push("/login")
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>

      <h1>
        {data&&(
          <div>
            <button onClick={logout}>logout</button>
          </div>
        )}
      </h1>
      <button onClick={()=>router.push("/login")}>login</button>
      <button onClick={()=>router.push("/register")}>register</button>
    {/* <div>{data}</div> */}


    </div>
  )
}

export default page