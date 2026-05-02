// components/layout/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getTotalItems, openCart } = useCart()
  const totalItems = getTotalItems()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-cream/95 backdrop-blur-sm shadow-sm'
          : 'bg-cream/80 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-brown flex items-center justify-center">
              <span className="text-cream font-serif text-sm font-bold">U</span>
            </div>
            <span className="font-serif text-2xl text-brown-dark tracking-wide group-hover:text-brown transition-colors">
              Uphaar
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/products', label: 'Shop' },
              { href: '/products?category=Bouquets', label: 'Bouquets' },
              { href: '/products?category=Gift+Sets', label: 'Gift Sets' },
              { href: '/products?category=Home+Decor', label: 'Decor' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-foreground/70 hover:text-brown transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brown after:transition-all hover:after:w-full"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="hidden md:flex p-2 rounded-full hover:bg-blush/50 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-brown" />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 rounded-full hover:bg-blush/50 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-brown" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brown text-cream text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-blush/50 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-brown" />
              ) : (
                <Menu className="w-5 h-5 text-brown" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-blush/50 bg-cream/98 animate-fade-up">
          <div className="px-4 py-4 space-y-1">
            {[
              { href: '/products', label: 'Shop All' },
              { href: '/products?category=Bouquets', label: 'Bouquets' },
              { href: '/products?category=Gift+Sets', label: 'Gift Sets' },
              { href: '/products?category=Home+Decor', label: 'Home Decor' },
              { href: '/products?category=Amigurumi', label: 'Amigurumi' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 text-sm font-medium text-foreground hover:text-brown hover:bg-blush/30 rounded-xl transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
