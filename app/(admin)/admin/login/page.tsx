// app/(admin)/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Welcome back, ${data.name}!`)
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-dark via-brown to-brown-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center mb-4 shadow-lg">
            <span className="font-serif text-2xl text-brown font-bold">U</span>
          </div>
          <h1 className="font-serif text-3xl text-cream mb-1">Uphaar Admin</h1>
          <p className="text-cream/60 text-sm">Sign in to manage your store</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8 space-y-5"
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@uphaar.com"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-cream border-t-transparent" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Default: admin@uphaar.com / admin123
          </p>
        </form>
      </div>
    </div>
  )
}
