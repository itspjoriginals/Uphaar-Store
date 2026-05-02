// components/product/FeaturedProducts.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { Product } from '@/types'

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-brown font-medium text-sm mb-2 tracking-widest uppercase">
              ✦ Featured
            </p>
            <h2 className="section-title">Our Most Loved Creations</h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-brown font-medium text-sm hover:gap-3 transition-all group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Products coming soon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
