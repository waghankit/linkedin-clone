'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow bg-white">
      <Link href="/" className="text-xl font-bold">LinkedIn Clone</Link>
      <div className="space-x-4">
        {session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Button variant="outline" onClick={() => signOut({ callbackUrl: '/auth/login' })}>Logout</Button>
          </>
        ) : (
          <>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}