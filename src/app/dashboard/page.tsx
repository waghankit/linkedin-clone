// Updated dashboard page to include comments and like functionality
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [content, setContent] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data.map((post: any) => ({ ...post, comments: post.comments || [], likeCount: post.likeCount || 0 })))
      }
    }
    fetchPosts()
  }, [content])

  const handlePost = async () => {
    if (!content.trim()) return
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      if (res.ok) {
        setContent('')
      }
    } catch (err) {
      console.error('Failed to create post', err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setPosts(posts.filter(post => post.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete post', err)
    }
  }

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      })
      if (res.ok) {
        const updated = await res.json()
        setPosts(posts.map(p => (p.id === updated.id ? updated : p)))
        setEditingPostId(null)
        setEditContent('')
      }
    } catch (err) {
      console.error('Failed to edit post', err)
    }
  }

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

  if (status === 'loading') {
    return <p className="text-center p-8">Loading...</p>
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.email || '')}`

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start px-4 md:px-12 py-4">
      <aside className="bg-white p-4 rounded-2xl shadow md:col-span-1">
        <div className="flex items-center space-x-4">
          <Image src={avatarUrl} alt="Profile" width={48} height={48} className="rounded-full" />
          <div>
            <h2 className="text-lg font-semibold">Welcome</h2>
            <p className="text-gray-700 text-sm cursor-pointer hover:underline" onClick={() => router.push('/profile')}>
              {session?.user?.email}
            </p>
          </div>
        </div>
        <Button variant="outline" className="mt-4 w-full cursor-pointer" onClick={() => signOut({ callbackUrl: '/auth/login' })}>Sign Out</Button>
      </aside>

      <section className="bg-white p-4 rounded-2xl shadow md:col-span-2">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Create a post</h2>
          <textarea
            className="w-full mt-2 p-3 border rounded-xl text-sm focus:outline-none focus:ring"
            rows={3}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <Button className="mt-2 cursor-pointer" onClick={handlePost}>Post</Button>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Your Feed</h2>
          {posts.length === 0 ? (
            <p className="text-sm text-gray-500">No posts yet. Start sharing!</p>
          ) : (
            <ul className="space-y-4">
              {posts.map(post => (
                <li key={post.id} className="border p-4 rounded-xl">
                  {editingPostId === post.id ? (
                    <div>
                      <textarea
                        className="w-full p-2 border rounded"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <Button className="mt-2 mr-2 cursor-pointer" onClick={() => handleEdit(post.id)}>Save</Button>
                      <Button variant="outline" onClick={() => setEditingPostId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-800">{post.content}</p>
                      <p className="text-sm text-gray-500 mt-2">Posted by {post.author.email} on {new Date(post.createdAt).toLocaleString()}</p>
                      {session?.user?.email === post.author.email && (
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => { setEditingPostId(post.id); setEditContent(post.content) }}>Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>Delete</Button>
                        </div>
                      )}
                    </>
                  )}
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
                    <Button size="sm" className="mt-2 cursor-pointer" onClick={() => handleCommentSubmit(post.id)}>Post Comment</Button>
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
          )}
        </div>
      </section>
    </div>
  )
}
