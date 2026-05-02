// app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { createToken, hashPassword, getAdminSession } from '@/lib/utils/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const hashedPassword = hashPassword(password)
    if (admin.password !== hashedPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createToken({ adminId: admin.id, email: admin.email })

    const cookieStore = cookies()
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true, name: admin.name })
  } catch (err) {
    console.error('Auth error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = cookies()
  cookieStore.delete('admin-token')
  return NextResponse.json({ success: true })
}

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ authenticated: true, ...session })
}
