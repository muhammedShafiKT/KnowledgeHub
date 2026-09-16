"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function page() {
  const [data,setdata] = useState()

  useEffect(()=>{
  async function checkfunction() {
    const res = await axios(`${process.env.NEXT_PUBLIC_API_URL}/health`) 
    setdata(res.data.service)
  }
  checkfunction()

  },[])
  return (
    <div>{data}</div>
  )
}

export default page