// components/layout/ProcessSection.tsx
import Image from 'next/image'

const steps = [
  {
    number: '01',
    title: 'Chosen with Care',
    description: 'We source the softest, most vibrant yarns — each colour handpicked to create the perfect palette for your piece.',
    emoji: '🧶',
  },
  {
    number: '02',
    title: 'Crafted by Hand',
    description: 'Every stitch is made with intention. No machines, no shortcuts — just skilled hands and genuine love for the craft.',
    emoji: '✂️',
  },
  {
    number: '03',
    title: 'Finished with Love',
    description: 'Each piece is quality-checked, styled, and wrapped beautifully before it reaches you — because the unboxing is part of the gift.',
    emoji: '🎁',
  },
]

export default function ProcessSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-beige/50 to-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"
                alt="Handmaking crochet"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Decorative card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-blush/50 max-w-[200px]">
              <p className="font-serif text-lg text-brown-dark mb-1">Made in India</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every piece is handcrafted by skilled artisans in India
              </p>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <p className="text-brown font-medium text-sm mb-3 tracking-widest uppercase">
              ✦ Our Process
            </p>
            <h2 className="section-title mb-4">
              Where Craft Meets{' '}
              <span className="text-brown italic">Intention</span>
            </h2>
            <p className="section-subtitle mb-10">
              Every Uphaar piece begins as an idea and becomes a treasure. Here&apos;s how we
              bring each creation to life.
            </p>

            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-5 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-blush/50 flex items-center justify-center text-xl border border-blush group-hover:bg-brown group-hover:text-cream transition-all duration-300">
                      {step.emoji}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] text-gold font-bold tracking-widest">
                        {step.number}
                      </span>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
