// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🧶</p>
        <h1 className="font-serif text-5xl text-brown-dark mb-3">404</h1>
        <p className="text-muted-foreground mb-6">
          Oops! This page seems to have unravelled.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
