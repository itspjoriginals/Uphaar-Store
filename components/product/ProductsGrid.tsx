// components/product/ProductsGrid.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import ProductCard from './ProductCard'
import { CATEGORIES } from '@/lib/utils'
import { SlidersHorizontal } from 'lucide-react'

interface ProductsGridProps {
  products: Product[]
  currentCategory: string
}

export default function ProductsGrid({ products, currentCategory }: ProductsGridProps) {
  const [activeCategory, setActiveCategory] = useState(currentCategory)
  const [sortBy, setSortBy] = useState('featured')

  const filteredProducts = products.filter((p) =>
    activeCategory === 'All' ? true : p.category === activeCategory
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return b.featured ? 1 : -1
  })

  return (
    <div>
      {/* Filters bar */}
      <div className="flex items-center justify-between gap-4 mb-8">
        {/* Category tabs - scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === 'All' ? '/products' : `/products?category=${encodeURIComponent(cat)}`}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-brown text-cream shadow-sm'
                  : 'bg-white text-foreground border border-blush hover:border-brown hover:text-brown'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-blush rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brown"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-5">
        {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
      </p>

      {/* Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🧶</div>
          <p className="text-muted-foreground">No products found in this category.</p>
          <Link href="/products" className="btn-primary mt-4 inline-block">
            View All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
