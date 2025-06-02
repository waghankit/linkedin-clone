import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to LinkedIn Clone</h1>
      <p className="text-lg text-gray-600 mb-6">Connect. Share. Grow.</p>
      <Button>Get Started</Button>
    </main>
  )
}