// app/(store)/products/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import prisma from '@/lib/db/prisma'
import ProductDetail from '@/components/product/ProductDetail'

interface ProductPageProps {
  params: { slug: string }
}

async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({ where: { slug } })
  } catch {
    return null
  }
}

async function getRelatedProducts(category: string, excludeSlug: string) {
  try {
    return await prisma.product.findMany({
      where: { category, slug: { not: excludeSlug }, inStock: true },
      take: 4,
    })
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product.category, product.slug)

  return <ProductDetail product={product as any} relatedProducts={relatedProducts as any[]} />
}
