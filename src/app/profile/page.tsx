'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: { email: string }
}

interface Post {
  id: string
  content: string
  createdAt: string
  comments: Comment[]
  author: { email: string }
  likeCount: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchUserPosts = async () => {
      const res = await fetch('/api/posts')
      if (res.ok) {
        const data = await res.json()
        const userPosts = data
          .filter((post: Post) => post.author.email === session?.user?.email)
          .map((post: Post) => ({ ...post, comments: post.comments || [], likeCount: post.likeCount || 0 }))
        setPosts(userPosts)
      }
    }
    if (session?.user?.email) fetchUserPosts()
  }, [session])

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.email || '')}`

  const handleCommentSubmit = async (postId: string) => {
    const content = newComment[postId]
    if (!content.trim()) return

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content })
    })
    if (res.ok) {
      const comment = await res.json()
      setPosts(posts.map(post => post.id === postId ? { ...post, comments: [comment, ...post.comments] } : post))
      setNewComment({ ...newComment, [postId]: '' })
    }
  }

  const handleLike = async (postId: string) => {
    const res = await fetch('/api/posts/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId })
    })
    if (res.ok) {
      const updated = await res.json()
      setPosts(posts.map(post => post.id === postId ? { ...post, likeCount: updated.likeCount } : post))
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow mt-4">
      <div className="flex items-center space-x-4 mb-4">
        <Image src={avatarUrl} alt="Profile" width={64} height={64} className="rounded-full" />
        <div>
          <h2 className="text-2xl font-bold">Your Profile</h2>
          <p className="text-gray-700">{session?.user?.email}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-6">Total Posts: {posts.length}</p>
      <ul className="space-y-6">
        {posts.map(post => (
          <li key={post.id} className="border p-4 rounded-xl">
            <p>{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">Posted on {new Date(post.createdAt).toLocaleString()}</p>
            <div className="mt-3 flex items-center gap-3">
              <Button size="sm" variant="secondary" onClick={() => handleLike(post.id)}>Like</Button>
              <span className="text-sm text-gray-600">{post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}</span>
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Write a comment..."
                className="w-full border rounded-md p-2 text-sm"
                value={newComment[post.id] || ''}
                onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
              />
              <Button size="sm" className="mt-2" onClick={() => handleCommentSubmit(post.id)}>Post Comment</Button>
            </div>
            <ul className="mt-4 space-y-2">
              {post.comments.map(comment => (
                <li key={comment.id} className="text-sm border-t pt-2">
                  <p>{comment.content}</p>
                  <p className="text-gray-500 text-xs">by {comment.author.email} on {new Date(comment.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
