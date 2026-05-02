// components/layout/Footer.tsx
import Link from 'next/link'
import { Heart, Instagram, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brown-dark text-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center">
                <span className="text-brown font-serif text-sm font-bold">U</span>
              </div>
              <span className="font-serif text-2xl text-cream">Uphaar</span>
            </div>
            <p className="text-sm font-light leading-relaxed text-cream/60 mb-4">
              Handmade crochet gifts crafted with love. Every stitch, every gift, every smile.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@uphaar.com"
                className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-cream font-semibold mb-4 text-sm tracking-wide">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/products?category=Bouquets', label: 'Bouquets' },
                { href: '/products?category=Gift+Sets', label: 'Gift Sets' },
                { href: '/products?category=Home+Decor', label: 'Home Decor' },
                { href: '/products?category=Amigurumi', label: 'Amigurumi' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-cream transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-cream font-semibold mb-4 text-sm tracking-wide">Help</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '#', label: 'About Us' },
                { href: '#', label: 'Custom Orders' },
                { href: '#', label: 'Shipping Policy' },
                { href: '#', label: 'Return Policy' },
                { href: '#', label: 'FAQ' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-cream transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream font-semibold mb-4 text-sm tracking-wide">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <a href="mailto:hello@uphaar.com" className="hover:text-cream transition-colors">
                  hello@uphaar.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <a href="tel:+919876543210" className="hover:text-cream transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-gold" />
                <a href="https://instagram.com" className="hover:text-cream transition-colors">
                  @uphaar.handmade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Uphaar. All rights reserved.
          </p>
          <p className="text-xs text-cream/40 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 fill-red-400 text-red-400" /> in India
          </p>
        </div>
      </div>
    </footer>
  )
}
