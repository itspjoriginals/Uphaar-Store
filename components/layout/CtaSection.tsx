// components/layout/CtaSection.tsx
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-brown-dark via-brown to-brown-light relative overflow-hidden">
      {/* Background art */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full border-4 border-cream" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border-4 border-cream" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full border-2 border-cream" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gold font-medium text-sm mb-4 tracking-widest uppercase">
          ✦ Ready to gift?
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-6">
          Find something special
          <br />
          <em>just for them</em>
        </h2>
        <p className="text-cream/70 text-lg font-light mb-10 max-w-lg mx-auto">
          Browse our full collection of handmade crochet gifts. Every piece is unique, every
          gift is meaningful.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cream text-brown font-semibold rounded-full hover:bg-white transition-colors shadow-lg group"
          >
            Shop the Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="mailto:hello@uphaar.com"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-cream font-medium rounded-full border border-cream/40 hover:bg-cream/10 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Custom Order
          </a>
        </div>
      </div>
    </section>
  )
}
