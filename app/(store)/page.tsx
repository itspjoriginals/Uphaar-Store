// app/(store)/page.tsx
import HeroSection from '@/components/layout/HeroSection'
import FeaturedProducts from '@/components/product/FeaturedProducts'
import ProcessSection from '@/components/layout/ProcessSection'
import TestimonialsSection from '@/components/layout/TestimonialsSection'
import CtaSection from '@/components/layout/CtaSection'
import prisma from '@/lib/db/prisma'

export const revalidate = 3600 // ISR every hour

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { featured: true, inStock: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })
  } catch {
    return []
  }
}

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [featuredProducts, testimonials] = await Promise.all([
    getFeaturedProducts(),
    getTestimonials(),
  ])

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <ProcessSection />
      <TestimonialsSection testimonials={testimonials} />
      <CtaSection />
    </>
  )
}
