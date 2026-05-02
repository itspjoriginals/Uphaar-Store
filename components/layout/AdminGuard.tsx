// components/layout/AdminGuard.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecked(true)
      return
    }
    fetch('/api/admin/auth')
      .then((res) => {
        if (!res.ok) router.replace('/admin/login')
        else setChecked(true)
      })
      .catch(() => router.replace('/admin/login'))
  }, [pathname, router])

  if (!checked && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brown border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
