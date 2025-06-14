import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: true, comments: { include: { author: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })

  const { content } = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return new NextResponse('User not found', { status: 404 })

  const post = await prisma.post.create({
    data: { content, authorId: user.id },
  })
  return NextResponse.json(post)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await req.json()
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  })

  if (post?.author?.email !== session.user.email) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  await prisma.post.delete({ where: { id } })
  return new NextResponse('Deleted', { status: 200 })
}
