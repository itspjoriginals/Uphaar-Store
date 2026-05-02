// app/(admin)/admin/orders/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['ALL', 'PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = statusFilter !== 'ALL' ? `?status=${statusFilter}` : ''
      const res = await fetch(`/api/admin/orders${params}`)
      const data = await res.json()
      setOrders(data.orders || [])
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [statusFilter])

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Update failed')
      toast.success('Status updated')
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order # or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 bg-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-brown text-cream'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brown'
              }`}
            >
              {s === 'ALL' ? 'All' : ORDER_STATUS_LABELS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-40 bg-white rounded-2xl">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-brown border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          filtered.map((order) => {
            const statusInfo = ORDER_STATUS_LABELS[order.status]
            const isExpanded = expandedId === order.id
            const addr = order.shippingAddress

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Order header */}
                <div
                  className="px-5 py-4 flex flex-wrap items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        {order.orderNumber}
                      </span>
                      <span className={`badge text-xs ${statusInfo?.color}`}>
                        {statusInfo?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                      {order.customerName} · {order.customerEmail}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  {/* Status updater */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brown"
                    >
                      {['PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(
                        (s) => (
                          <option key={s} value={s}>
                            {ORDER_STATUS_LABELS[s]?.label}
                          </option>
                        )
                      )}
                    </select>
                    {updatingId === order.id && (
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-brown border-t-transparent" />
                    )}
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-50 px-5 py-4 grid md:grid-cols-2 gap-5 bg-gray-50/30">
                    {/* Items */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Items
                      </h4>
                      <div className="space-y-2">
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3">
                            {item.product?.images?.[0] && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.product.images[0]}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.product?.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                Qty: {item.quantity} · {formatPrice(item.price)}
                                {item.variant && ` · ${item.variant}`}
                              </p>
                              {item.customMessage && (
                                <p className="text-xs text-brown/70 italic">
                                  "{item.customMessage}"
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p>{addr?.line1}</p>
                        {addr?.line2 && <p>{addr.line2}</p>}
                        <p>
                          {addr?.city}, {addr?.state} – {addr?.pincode}
                        </p>
                        <p>{addr?.country}</p>
                        <p className="mt-1.5 text-brown">{order.customerPhone}</p>
                      </div>
                      {order.notes && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Notes
                          </p>
                          <p className="text-sm text-gray-600 italic">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Totals */}
                    <div className="md:col-span-2 border-t border-gray-100 pt-3 flex gap-6 text-sm">
                      <span className="text-gray-500">
                        Subtotal: <strong>{formatPrice(order.subtotal)}</strong>
                      </span>
                      <span className="text-gray-500">
                        Shipping:{' '}
                        <strong>
                          {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}
                        </strong>
                      </span>
                      <span className="text-gray-900 font-semibold">
                        Total: {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
