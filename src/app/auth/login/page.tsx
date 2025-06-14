'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    })

    if (res?.ok) {
      router.push('/dashboard')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full cursor-pointer">Sign In</Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account? <Link href="/auth/register" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}