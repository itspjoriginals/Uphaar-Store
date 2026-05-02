// components/product/ProductDetail.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Share2, ChevronLeft, Star, Truck, Shield, RefreshCw } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import ProductCard from './ProductCard'
import toast from 'react-hot-toast'

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [customMessage, setCustomMessage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { addItem, openCart } = useCart()

  const variants = product.variants as any

  const handleAddToCart = () => {
    const variantStr = [selectedColor, selectedSize].filter(Boolean).join(' | ')

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      variant: variantStr || undefined,
      customMessage: customMessage || undefined,
    })

    toast.success('Added to cart!')
    openCart()
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-brown transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brown transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-brown transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Images */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-blush/20 mb-3 img-zoom shadow-lg">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {discount && (
                <div className="absolute top-4 left-4 badge bg-brown text-cream text-sm px-3 py-1">
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === i ? 'border-brown' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Category & name */}
            <p className="text-brown text-xs font-medium tracking-widest uppercase mb-2">
              {product.category}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-brown-dark mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.9 (18 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-serif text-3xl text-brown font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-muted-foreground text-lg line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {discount && (
                <span className="text-green-600 text-sm font-medium">
                  You save {formatPrice(product.comparePrice! - product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {/* Color variants */}
            {variants?.colors && (
              <div className="mb-5">
                <p className="text-sm font-medium text-foreground mb-2">
                  Colour:{' '}
                  <span className="text-brown">{selectedColor || 'Select'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedColor === color
                          ? 'bg-brown text-cream border-brown'
                          : 'border-blush text-foreground hover:border-brown'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size variants */}
            {variants?.sizes && (
              <div className="mb-5">
                <p className="text-sm font-medium text-foreground mb-2">
                  Size:{' '}
                  <span className="text-brown">{selectedSize || 'Select'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedSize === size
                          ? 'bg-brown text-cream border-brown'
                          : 'border-blush text-foreground hover:border-brown'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom message */}
            {product.customizable && (
              <div className="mb-5">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Custom Message{' '}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="e.g. Happy Birthday, Priya! With love 🌸"
                  rows={2}
                  maxLength={100}
                  className="input-field resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {customMessage.length}/100 characters
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 border border-blush rounded-full px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:text-brown transition-colors"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:text-brown transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Add to cart + actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                {product.inStock ? 'Add to Cart' : 'Sold Out'}
              </button>
              <button
                onClick={() => {
                  navigator.share?.({ title: product.name, url: window.location.href })
                  toast.success('Link copied!')
                }}
                className="p-4 border border-blush rounded-full hover:bg-blush/30 transition-colors"
              >
                <Share2 className="w-5 h-5 text-brown" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-blush/30">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders ₹999+' },
                { icon: Shield, label: 'Secure Payment', sub: 'SSL Encrypted' },
                { icon: RefreshCw, label: 'Easy Returns', sub: '7-day policy' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon className="w-4 h-4 text-brown mx-auto mb-1" />
                  <p className="text-[11px] font-medium text-foreground">{label}</p>
                  <p className="text-[10px] text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
