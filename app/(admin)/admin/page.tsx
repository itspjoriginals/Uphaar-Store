// app/(admin)/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Clock,
  ArrowRight,
  IndianRupee,
} from 'lucide-react'
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils'

interface Stats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalProducts: number
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brown border-t-transparent" />
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      icon: IndianRupee,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-brown flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.recentOrders?.length === 0 && (
              <p className="text-center py-8 text-gray-400 text-sm">No orders yet</p>
            )}
            {stats?.recentOrders?.map((order: any) => {
              const statusInfo = ORDER_STATUS_LABELS[order.status]
              return (
                <div key={order.id} className="px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusInfo?.color}`}>
                      {statusInfo?.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Top Products</h2>
            <Link
              href="/admin/products"
              className="text-sm text-brown flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.topProducts?.length === 0 && (
              <p className="text-center py-8 text-gray-400 text-sm">No sales yet</p>
            )}
            {stats?.topProducts?.map(({ product, totalSold }: any, i: number) => (
              product && (
                <div key={product.id} className="px-5 py-3.5 flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-300 w-4">{i + 1}</span>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-blush/20 flex-shrink-0">
                    {product.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{formatPrice(product.price)}</p>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{totalSold} sold</span>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
