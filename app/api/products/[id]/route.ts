// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { getAdminSession } from '@/lib/utils/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
        stockCount: body.stockCount ? parseInt(body.stockCount) : undefined,
      },
    })
    return NextResponse.json(product)
  } catch (err: any) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
