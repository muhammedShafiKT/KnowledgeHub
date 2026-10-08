"use client"
import React, { useEffect, useState } from 'react'
import { documentApi } from '@/api/documentApi'

function Page() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    async function fetchdata() {
      try {
        const res = await documentApi.getDocs()
        console.log(res)
        setData(res?.data ?? [])
      } catch (error) {
        console.error(error)
      }
    }
    fetchdata()
  }, [])

  return (
    <div className='flex'>
      <ol className='flex flex-wrap'>
        {data.map((doc) => (
            <div className=' flex'>
            <div className='p-10 bg-amber-300 m-4 flex'>
          <li key={doc.id}>{doc.originalName}</li>
          </div>
          </div>
        ))}
      </ol>
    </div>
  )
}

export default Page