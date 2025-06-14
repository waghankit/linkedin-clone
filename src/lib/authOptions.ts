// src/lib/authOptions.ts
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null
        const isValid = await bcrypt.compare(credentials.password, user.password)
        return isValid ? { id: user.id, email: user.email } : null
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login' },
  secret: process.env.NEXTAUTH_SECRET,
}
