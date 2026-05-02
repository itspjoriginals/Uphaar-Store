// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { getAdminSession } from '@/lib/utils/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [
      totalOrders,
      revenueResult,
      pendingOrders,
      totalProducts,
      recentOrders,
      topOrderItems,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.product.count(),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: { include: { product: { select: { name: true } } } } },
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ])

    const topProductIds = topOrderItems.map((i) => i.productId)
    const topProducts = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, images: true, price: true },
    })

    const topProductsWithSales = topOrderItems.map((item) => ({
      product: topProducts.find((p) => p.id === item.productId),
      totalSold: item._sum.quantity || 0,
    }))

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyOrders = await prisma.order.findMany({
      where: { createdAt: { gte: sixMonthsAgo }, status: { not: 'CANCELLED' } },
      select: { createdAt: true, total: true },
    })

    const monthlyRevenue = monthlyOrders.reduce((acc: Record<string, number>, order) => {
      const month = order.createdAt.toISOString().slice(0, 7)
      acc[month] = (acc[month] || 0) + order.total
      return acc
    }, {})

    return NextResponse.json({
      totalOrders,
      totalRevenue: revenueResult._sum.total || 0,
      pendingOrders,
      totalProducts,
      recentOrders,
      topProducts: topProductsWithSales,
      monthlyRevenue,
    })
  } catch (err) {
    console.error('Analytics error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
