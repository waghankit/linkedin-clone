// app/dashboard/page.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Post {
  id: string
  content: string
  createdAt: string
  author: { email: string }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [content, setContent] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

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
        setPosts(data)
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

  if (status === 'loading') {
    return <p className="text-center p-8">Loading...</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 p-4">
      {/* Sidebar/Profile card */}
      <aside className="bg-white p-4 rounded-2xl shadow md:col-span-1">
        <h2 className="text-xl font-semibold mb-2">Welcome</h2>
        <p className="text-gray-700">{session?.user?.email}</p>
        <Button variant="outline" className="mt-4 w-full" onClick={() => signOut({ callbackUrl: '/auth/login' })}>Sign Out</Button>
      </aside>

      {/* Feed/Main content */}
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
          <Button className="mt-2" onClick={handlePost}>Post</Button>
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
                      <Button className="mt-2 mr-2" onClick={() => handleEdit(post.id)}>Save</Button>
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}