// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { getAdminSession } from '@/lib/utils/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20

    const orders = await prisma.order.findMany({
      where: status ? { status: status as any } : {},
      include: { items: { include: { product: { select: { name: true, images: true } } } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.order.count({
      where: status ? { status: status as any } : {},
    })

    return NextResponse.json({ orders, total, pages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
