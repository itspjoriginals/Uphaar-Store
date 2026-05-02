// components/product/CartDrawer.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCart()

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const total = getTotalPrice()
  const shippingCost = total >= 999 ? 0 : 99

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blush">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brown" />
            <span className="font-serif text-lg text-brown-dark">
              Your Cart ({getTotalItems()})
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-blush/50 transition-colors"
          >
            <X className="w-5 h-5 text-brown" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-blush/30 flex items-center justify-center text-3xl">
                🧶
              </div>
              <div>
                <p className="font-serif text-lg text-brown-dark mb-1">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add some beautiful crochet pieces!
                </p>
              </div>
              <button onClick={closeCart} className="btn-primary text-sm">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variant}`}
                className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-blush/30"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-blush/20">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                  {item.variant && (
                    <p className="text-xs text-muted-foreground">{item.variant}</p>
                  )}
                  {item.customMessage && (
                    <p className="text-xs text-brown/70 truncate">"{item.customMessage}"</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-brown text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.variant)
                        }
                        className="w-6 h-6 rounded-full bg-blush/50 flex items-center justify-center hover:bg-brown hover:text-cream transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.variant)
                        }
                        className="w-6 h-6 rounded-full bg-blush/50 flex items-center justify-center hover:bg-brown hover:text-cream transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.variant)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors self-start"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-blush/50 space-y-3 bg-white">
            {/* Subtotals */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingCost === 0 ? 'FREE 🎉' : formatPrice(shippingCost)}
                </span>
              </div>
              {total < 999 && (
                <p className="text-xs text-brown/70 bg-blush/30 rounded-lg px-3 py-2">
                  Add {formatPrice(999 - total)} more for free shipping!
                </p>
              )}
              <div className="flex justify-between font-semibold text-base border-t border-blush/50 pt-2">
                <span>Total</span>
                <span className="text-brown">{formatPrice(total + shippingCost)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center block text-sm py-3.5"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
