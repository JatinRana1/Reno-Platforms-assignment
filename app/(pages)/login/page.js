import React from 'react'
import Form from '../../components/login/form'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const Login = async () => {
  const session = await getServerSession(authOptions)

  if(session) {
    redirect('/')
  }

  return (
    <div>
        <Form/>
    </div>
  )
}

export default Login