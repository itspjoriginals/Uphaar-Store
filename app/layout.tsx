// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Uphaar – Premium Handmade Crochet Gifts',
    template: '%s | Uphaar',
  },
  description:
    'Discover beautifully handcrafted crochet gifts — bouquets, home decor, and more. Each piece is lovingly made by hand, perfect for every occasion.',
  keywords: ['crochet', 'handmade', 'gifts', 'bouquet', 'amigurumi', 'home decor', 'uphaar'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Uphaar',
    title: 'Uphaar – Premium Handmade Crochet Gifts',
    description: 'Discover beautifully handcrafted crochet gifts for every occasion.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uphaar – Premium Handmade Crochet Gifts',
    description: 'Discover beautifully handcrafted crochet gifts for every occasion.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-cream antialiased">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#F5EFE6',
              color: '#8B5E3C',
              border: '1px solid #E8CFC5',
              fontFamily: 'var(--font-inter)',
            },
          }}
        />
      </body>
    </html>
  )
}
