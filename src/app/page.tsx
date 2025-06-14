'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to LinkedIn Clone</h1>
      <p className="text-lg text-gray-600 mb-6">Connect. Share. Grow.</p>
      <Button className="cursor-pointer" onClick={() => router.push('/auth/login')}>Get Started</Button>
    </main>
  )
}
