// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shippingCost,
      total,
      notes,
    } = body

    // Validation
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate products exist and are in stock
    const productIds = items.map((i: any) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'One or more products not found' }, { status: 400 })
    }

    const orderNumber = generateOrderNumber()

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        subtotal,
        shippingCost,
        total,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            variant: item.variant,
            customMessage: item.customMessage,
          })),
        },
      },
    })

    // Update stock counts
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockCount: { decrement: item.quantity },
        },
      })
    }

    return NextResponse.json({ orderNumber: order.orderNumber, orderId: order.id }, { status: 201 })
  } catch (err: any) {
    console.error('Order creation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('orderNumber')

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: { include: { product: true } } },
      })
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      return NextResponse.json(order)
    }

    return NextResponse.json({ error: 'Order number required' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
