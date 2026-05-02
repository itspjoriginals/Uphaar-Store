// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { getAdminSession } from '@/lib/utils/auth'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const products = await prisma.product.findMany({
      where: {
        ...(category && category !== 'All' ? { category } : {}),
        ...(featured === 'true' ? { featured: true } : {}),
        inStock: true,
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(products)
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      name,
      description,
      price,
      comparePrice,
      images,
      category,
      tags,
      variants,
      inStock,
      stockCount,
      featured,
      customizable,
    } = body

    if (!name || !description || !price || !images?.length || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = slugify(name)
    
    // Check unique slug
    const existing = await prisma.product.findUnique({ where: { slug } })
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        images,
        category,
        tags: tags || [],
        variants: variants || null,
        inStock: inStock ?? true,
        stockCount: parseInt(stockCount) || 0,
        featured: featured ?? false,
        customizable: customizable ?? false,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err: any) {
    console.error('Product creation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
