// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  // Create admin
  const adminPassword = hash('sha256', 'admin123')
  await prisma.admin.upsert({
    where: { email: 'admin@uphaar.com' },
    update: {},
    create: {
      email: 'admin@uphaar.com',
      password: adminPassword,
      name: 'Uphaar Admin',
    },
  })

  // Create products
  const products = [
    {
      name: 'Blush Bloom Bouquet',
      slug: 'blush-bloom-bouquet',
      description: 'Handcrafted crochet flower bouquet in soft blush and cream tones. Perfect for gifting to someone special. Each petal is lovingly stitched by hand, making every piece truly one of a kind.',
      price: 899,
      comparePrice: 1199,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800',
      ],
      category: 'Bouquets',
      tags: ['flowers', 'gift', 'blush', 'bouquet'],
      inStock: true,
      stockCount: 12,
      featured: true,
      customizable: true,
      variants: {
        colors: ['Blush Pink', 'Ivory White', 'Dusty Rose'],
        sizes: ['Small (5 flowers)', 'Medium (8 flowers)', 'Large (12 flowers)'],
      },
    },
    {
      name: 'Golden Sunflower Basket',
      slug: 'golden-sunflower-basket',
      description: 'A cheerful basket of handmade crochet sunflowers with golden yarn and detailed brown centers. Brings warmth and joy to any space.',
      price: 1299,
      comparePrice: 1599,
      images: [
        'https://images.unsplash.com/photo-1490750967868-88df5691cc17?w=800',
        'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=800',
      ],
      category: 'Bouquets',
      tags: ['sunflower', 'basket', 'yellow', 'gift'],
      inStock: true,
      stockCount: 8,
      featured: true,
      customizable: true,
      variants: {
        colors: ['Golden Yellow', 'Autumn Orange'],
        sizes: ['Small', 'Large'],
      },
    },
    {
      name: 'Lavender Dream Wreath',
      slug: 'lavender-dream-wreath',
      description: 'Delicate crochet lavender wreath perfect for home decor. Made with soft purple and green yarn, adding an artisan touch to any wall or door.',
      price: 1499,
      images: [
        'https://images.unsplash.com/photo-1548813831-09b92cf3513b?w=800',
      ],
      category: 'Home Decor',
      tags: ['wreath', 'lavender', 'home decor', 'wall art'],
      inStock: true,
      stockCount: 5,
      featured: false,
      customizable: false,
      variants: null,
    },
    {
      name: 'Pastel Rainbow Mini Bouquet',
      slug: 'pastel-rainbow-mini-bouquet',
      description: 'A sweet collection of miniature crochet flowers in soft pastel shades. Ideal as a desk decoration or small thoughtful gift.',
      price: 599,
      comparePrice: 799,
      images: [
        'https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=800',
      ],
      category: 'Bouquets',
      tags: ['mini', 'pastel', 'rainbow', 'desk decor'],
      inStock: true,
      stockCount: 20,
      featured: true,
      customizable: true,
      variants: {
        colors: ['Full Rainbow', 'Pastel Pink', 'Blue Sky'],
      },
    },
    {
      name: 'Cozy Bear Amigurumi',
      slug: 'cozy-bear-amigurumi',
      description: 'An adorable handmade crochet teddy bear stuffed with premium poly-fill. Perfect gift for kids and adults who love cute plushies. Can be personalized with a name tag.',
      price: 799,
      images: [
        'https://images.unsplash.com/photo-1558618047-f4e60cef8f74?w=800',
      ],
      category: 'Amigurumi',
      tags: ['bear', 'stuffed toy', 'amigurumi', 'plushie'],
      inStock: true,
      stockCount: 15,
      featured: true,
      customizable: true,
      variants: {
        colors: ['Cream', 'Brown', 'Grey'],
      },
    },
    {
      name: 'Wedding Anniversary Gift Set',
      slug: 'wedding-anniversary-gift-set',
      description: 'Curated crochet gift set for couples — includes a rose bouquet, heart garland, and personalized message card. A truly special handmade keepsake.',
      price: 2499,
      comparePrice: 2999,
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
      ],
      category: 'Gift Sets',
      tags: ['wedding', 'anniversary', 'gift set', 'couple', 'roses'],
      inStock: true,
      stockCount: 6,
      featured: false,
      customizable: true,
      variants: null,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  // Create testimonials
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      review: 'Absolutely beautiful bouquet! Gifted it to my mother on her birthday and she was in tears. The quality is incredible — looks even better than the photos. Will definitely order again!',
      featured: true,
    },
    {
      name: 'Anjali Mehta',
      location: 'Delhi',
      rating: 5,
      review: 'Got the wedding anniversary gift set and it made our special day even more memorable. The customization was perfect and packaging was gorgeous. Uphaar is truly a premium brand.',
      featured: true,
    },
    {
      name: 'Sneha Reddy',
      location: 'Hyderabad',
      rating: 5,
      review: 'The pastel bouquet is my desk\'s crown jewel now! Every colleague asks about it. The craftsmanship is exceptional and it arrived beautifully wrapped.',
      featured: true,
    },
    {
      name: 'Kavitha Nair',
      location: 'Bangalore',
      rating: 4,
      review: 'Ordered the cozy bear for my niece and she absolutely loves it. Super soft, well-made, and the custom name tag was a lovely touch. Quick delivery too!',
      featured: true,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial })
  }

  console.log('✅ Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
