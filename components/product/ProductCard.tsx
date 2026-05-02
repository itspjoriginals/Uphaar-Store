// components/product/ProductCard.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, openCart } = useCart()

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.inStock) return

    setIsAdding(true)
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    })
    toast.success('Added to cart!')
    openCart()
    setTimeout(() => setIsAdding(false), 500)
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="card-product">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-blush/20">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && (
              <span className="badge bg-brown text-cream text-[10px]">
                -{discount}%
              </span>
            )}
            {product.customizable && (
              <span className="badge bg-gold/80 text-white text-[10px]">
                Customizable
              </span>
            )}
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="badge bg-white text-foreground text-xs">Sold Out</span>
            </div>
          )}

          {/* Actions overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsWishlisted(!isWishlisted)
              }}
              className="w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? 'fill-red-400 text-red-400' : 'text-brown'
                }`}
              />
            </button>
          </div>

          {/* Quick Add button */}
          {product.inStock && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleQuickAdd}
                disabled={isAdding}
                className="w-full py-2.5 bg-brown text-cream text-xs font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-brown-dark transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {isAdding ? 'Adding...' : 'Quick Add'}
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 md:p-4">
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-sm md:text-base text-foreground leading-tight mb-2 group-hover:text-brown transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-brown text-sm md:text-base">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-muted-foreground text-xs line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
