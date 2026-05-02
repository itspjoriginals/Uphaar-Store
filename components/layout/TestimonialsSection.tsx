// components/layout/TestimonialsSection.tsx
import { Star } from 'lucide-react'
import { Testimonial } from '@/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    review: 'Absolutely beautiful bouquet! Gifted it to my mother and she was in tears. The quality is incredible.',
    featured: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Anjali Mehta',
    location: 'Delhi',
    rating: 5,
    review: 'Got the anniversary gift set and it made our day even more special. Packaging was gorgeous.',
    featured: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Sneha Reddy',
    location: 'Hyderabad',
    rating: 5,
    review: 'The pastel bouquet is my desk crown jewel! Every colleague asks about it. Exceptional craftsmanship.',
    featured: true,
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Kavitha Nair',
    location: 'Bangalore',
    rating: 5,
    review: 'Ordered the cozy bear for my niece and she absolutely loves it. Super soft, well-made!',
    featured: true,
    createdAt: new Date(),
  },
]

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials

  return (
    <section className="py-16 md:py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brown font-medium text-sm mb-3 tracking-widest uppercase">
            ✦ Testimonials
          </p>
          <h2 className="section-title mb-4">
            What Our Customers Say
          </h2>
          <p className="section-subtitle max-w-md mx-auto">
            Every review is a reminder of why we do what we do.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayTestimonials.map((t, index) => (
            <div
              key={t.id}
              className={`bg-white rounded-3xl p-6 md:p-8 border border-blush/50 shadow-sm hover:shadow-md transition-shadow ${
                index === 0 ? 'md:col-span-1 ring-1 ring-gold/30' : ''
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Review */}
              <p className="text-foreground/80 text-sm md:text-base leading-relaxed mb-5 font-light">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blush to-brown/20 flex items-center justify-center font-serif text-brown font-semibold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  {t.location && (
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  )}
                </div>
                <div className="ml-auto">
                  <span className="text-xs text-muted-foreground bg-cream px-2 py-1 rounded-full">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-12 grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-blush/30 via-cream to-blush/30 rounded-3xl border border-blush/50">
          {[
            { value: '500+', label: 'Happy Customers' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '100%', label: 'Handmade' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-serif text-2xl md:text-3xl text-brown-dark font-semibold">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
