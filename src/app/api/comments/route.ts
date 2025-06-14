import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })

  const { content, postId } = await req.json()
  if (!content || !postId) return new NextResponse('Invalid data', { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return new NextResponse('User not found', { status: 404 })

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: user.id
    },
    include: { author: true }
  })

  return NextResponse.json(comment)
}

export async function GET() {
  const comments = await prisma.comment.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(comments)
}
