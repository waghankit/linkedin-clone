import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { postId } = await req.json()
  if (!postId) return new NextResponse('Missing postId', { status: 400 })

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { likeCount: { increment: 1 } },
  })

  return NextResponse.json(updated)
}