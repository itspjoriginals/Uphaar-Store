// app/(store)/products/page.tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import ProductsGrid from '@/components/product/ProductsGrid'
import prisma from '@/lib/db/prisma'
import { CATEGORIES } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our full collection of handmade crochet gifts, bouquets, amigurumi, and home decor.',
}

export const revalidate = 600

async function getProducts(category?: string) {
  try {
    return await prisma.product.findMany({
      where: {
        inStock: true,
        ...(category && category !== 'All' ? { category } : {}),
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
  } catch {
    return []
  }
}

interface ProductsPageProps {
  searchParams: { category?: string; search?: string }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams.category
  const products = await getProducts(category)

  return (
    <div className="min-h-screen bg-cream">
      {/* Page header */}
      <div className="bg-gradient-to-b from-beige to-cream py-12 md:py-16 border-b border-blush/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="section-title mb-3">
            {category && category !== 'All' ? category : 'Our Collection'}
          </h1>
          <p className="section-subtitle max-w-md mx-auto">
            Every piece handcrafted with love — browse our full range of crochet gifts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductsGrid products={products} currentCategory={category || 'All'} />
        </Suspense>
      </div>
    </div>
  )
}
