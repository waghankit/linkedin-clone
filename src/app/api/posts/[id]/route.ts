import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request): Promise<NextResponse> {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop() as string

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })

  const { content } = await req.json()

  const post = await prisma.post.findUnique({ where: { id }, include: { author: true } })
  if (!post || post.author.email !== session.user.email) return new NextResponse('Forbidden', { status: 403 })

  const updated = await prisma.post.update({
    where: { id },
    data: { content },
    include: { author: true },
  })

  return NextResponse.json(updated)
}
