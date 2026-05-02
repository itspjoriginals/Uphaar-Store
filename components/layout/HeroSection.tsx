// components/layout/HeroSection.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-cream via-beige to-blush/30">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-blush/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blush/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center md:text-left animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blush/60 text-brown text-sm font-medium mb-6 border border-blush">
              <span className="w-2 h-2 rounded-full bg-brown animate-pulse" />
              Handcrafted with love
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-brown-dark leading-[1.1] mb-6">
              Gifts that{' '}
              <em className="text-brown not-italic relative">
                speak
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 100 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.5 Q25 1, 50 5.5 Q75 10, 99 5.5"
                    stroke="#C9A96E"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </em>{' '}
              from the heart
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
              Each Uphaar creation is a labour of love — crochet bouquets, plushies, and home
              decor crafted by hand, one stitch at a time.
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-3 justify-center md:justify-start mb-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blush to-brown/30 border-2 border-cream flex items-center justify-center text-xs font-medium text-brown"
                  >
                    {['P', 'A', 'S', 'K'][i - 1]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">500+ happy customers</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href="/products" className="btn-primary flex items-center justify-center gap-2 group">
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/products?category=Gift+Sets" className="btn-outline flex items-center justify-center gap-2">
                Explore Gift Sets
              </Link>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="relative hidden md:grid grid-cols-2 gap-4 animate-fade-in">
            <div className="space-y-4">
              <div className="img-zoom rounded-2xl overflow-hidden aspect-[3/4] bg-blush/30 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"
                  alt="Crochet bouquet"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="img-zoom rounded-2xl overflow-hidden aspect-square bg-blush/30 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1558618047-f4e60cef8f74?w=600"
                  alt="Crochet bear"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="img-zoom rounded-2xl overflow-hidden aspect-square bg-blush/30 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1490750967868-88df5691cc17?w=600"
                  alt="Sunflower bouquet"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="img-zoom rounded-2xl overflow-hidden aspect-[3/4] bg-blush/30 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=600"
                  alt="Pastel flowers"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-blush/50">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-lg">
                🧶
              </div>
              <div>
                <p className="text-xs font-semibold text-brown-dark">100% Handmade</p>
                <p className="text-[11px] text-muted-foreground">Every stitch with care</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
