// lib/utils/auth.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { createHash } from 'crypto'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-this'
)

export async function createToken(payload: { adminId: string; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { adminId: string; email: string }
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')?.value
  if (!token) return null
  return await verifyToken(token)
}

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}
