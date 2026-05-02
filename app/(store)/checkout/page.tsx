// app/(store)/checkout/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { CheckoutFormData } from '@/types'
import toast from 'react-hot-toast'
import { ChevronLeft, Lock } from 'lucide-react'
import Link from 'next/link'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<CheckoutFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    notes: '',
  })

  const subtotal = getTotalPrice()
  const shippingCost = subtotal >= 999 ? 0 : 99
  const total = subtotal + shippingCost

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.replace('address.', '')
      setForm((prev) => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, [field]: value },
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Your cart is empty!')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
            variant: i.variant,
            customMessage: i.customMessage,
          })),
          subtotal,
          shippingCost,
          total,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order failed')

      clearCart()
      router.push(`/order-confirmation?orderNumber=${data.orderNumber}`)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🛒</p>
          <h2 className="font-serif text-2xl text-brown-dark mb-3">Your cart is empty</h2>
          <Link href="/products" className="btn-primary inline-block mt-2">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="p-2 rounded-full hover:bg-blush/30 transition-colors">
            <ChevronLeft className="w-5 h-5 text-brown" />
          </Link>
          <h1 className="font-serif text-2xl md:text-3xl text-brown-dark">Checkout</h1>
          <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
            <Lock className="w-3.5 h-3.5" />
            Secure Checkout
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-5 gap-8">
            {/* Left: Form */}
            <div className="md:col-span-3 space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-3xl p-6 border border-blush/30 shadow-sm">
                <h2 className="font-serif text-xl text-brown-dark mb-5">Contact Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      required
                      placeholder="Priya Sharma"
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={form.customerEmail}
                        onChange={handleChange}
                        required
                        placeholder="priya@example.com"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={form.customerPhone}
                        onChange={handleChange}
                        required
                        placeholder="+91 98765 43210"
                        pattern="[0-9+\s-]{10,15}"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-3xl p-6 border border-blush/30 shadow-sm">
                <h2 className="font-serif text-xl text-brown-dark mb-5">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="address.line1"
                      value={form.shippingAddress.line1}
                      onChange={handleChange}
                      required
                      placeholder="House/Flat no, Street name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="address.line2"
                      value={form.shippingAddress.line2}
                      onChange={handleChange}
                      placeholder="Landmark, Area (optional)"
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={form.shippingAddress.city}
                        onChange={handleChange}
                        required
                        placeholder="Mumbai"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="address.pincode"
                        value={form.shippingAddress.pincode}
                        onChange={handleChange}
                        required
                        placeholder="400001"
                        pattern="[0-9]{6}"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      State *
                    </label>
                    <select
                      name="address.state"
                      value={form.shippingAddress.state}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-3xl p-6 border border-blush/30 shadow-sm">
                <h2 className="font-serif text-xl text-brown-dark mb-3">Order Notes</h2>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions or gift messages..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-3xl p-6 border border-blush/30 shadow-sm sticky top-24">
                <h2 className="font-serif text-xl text-brown-dark mb-5">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variant}`}
                      className="flex gap-3 items-center"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-blush/20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brown text-cream text-[10px] flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">{item.variant}</p>
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t border-blush/50 pt-4 mb-5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                      {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t border-blush/50 pt-2">
                    <span>Total</span>
                    <span className="text-brown">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-cream border-t-transparent" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Place Order • {formatPrice(total)}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-muted-foreground mt-3">
                  By placing your order, you agree to our terms and privacy policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
