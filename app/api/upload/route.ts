// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/utils/auth'
import { uploadImage } from '@/lib/utils/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 })
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const url = await uploadImage(base64)
    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
