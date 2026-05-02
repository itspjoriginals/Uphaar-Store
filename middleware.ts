// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/utils/auth'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    const payload = await verifyToken(token)
    if (!payload) {
      const response = NextResponse.redirect(new URL('/admin/login', req.url))
      response.cookies.delete('admin-token')
      return response
    }
  }

  // Redirect logged-in admin away from login page
  if (pathname === '/admin/login') {
    const token = req.cookies.get('admin-token')?.value
    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
