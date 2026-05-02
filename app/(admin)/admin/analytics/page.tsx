// app/(admin)/admin/analytics/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, ShoppingBag, Package, IndianRupee, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brown border-t-transparent" />
      </div>
    )
  }

  const monthlyRevenue: Record<string, number> = data?.monthlyRevenue || {}
  const months = Object.keys(monthlyRevenue).sort()
  const maxRevenue = Math.max(...Object.values(monthlyRevenue), 1)

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(data?.totalRevenue || 0), icon: IndianRupee, color: 'text-green-600 bg-green-50' },
    { label: 'Total Orders', value: data?.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending Orders', value: data?.pendingOrders || 0, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Products Listed', value: data?.totalProducts || 0, icon: Package, color: 'text-purple-600 bg-purple-50' },
  ]

  const formatMonth = (m: string) => {
    const [y, mo] = m.split('-')
    return new Date(parseInt(y), parseInt(mo) - 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' })
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Store performance overview</p>
      </div>

      {/* Stats */}
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

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-brown" />
          <h2 className="font-semibold text-gray-900">Monthly Revenue (Last 6 Months)</h2>
        </div>

        {months.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No revenue data yet. Orders will appear here.</p>
          </div>
        ) : (
          <div className="flex items-end gap-3 h-48 overflow-x-auto scrollbar-hide pb-2">
            {months.map((m) => {
              const val = monthlyRevenue[m]
              const heightPct = (val / maxRevenue) * 100
              return (
                <div key={m} className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[60px]">
                  <span className="text-xs text-gray-500 font-medium">{formatPrice(val)}</span>
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-brown to-brown-light transition-all duration-500 min-h-[8px]"
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                  />
                  <span className="text-xs text-gray-400">{formatMonth(m)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Top products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Top Selling Products</h2>
        </div>
        {data?.topProducts?.length === 0 ? (
          <p className="text-center py-12 text-gray-400 text-sm">No sales data yet</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {data?.topProducts?.map(({ product, totalSold }: any, i: number) =>
              product ? (
                <div key={product.id} className="px-6 py-4 flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-200 w-6 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-blush/20 flex-shrink-0">
                    {product.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-400">{formatPrice(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{totalSold}</p>
                    <p className="text-xs text-gray-400">units sold</p>
                  </div>
                  {/* Mini bar */}
                  <div className="w-20 h-2 rounded-full bg-gray-100 hidden sm:block">
                    <div
                      className="h-full rounded-full bg-brown"
                      style={{
                        width: `${Math.min(
                          (totalSold /
                            Math.max(...(data?.topProducts?.map((p: any) => p.totalSold) || [1]))) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  )
}
