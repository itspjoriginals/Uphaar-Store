// app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { getAdminSession } from '@/lib/utils/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { status } = await req.json()
    const validStatuses = ['PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json(order)
  } catch (err: any) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
