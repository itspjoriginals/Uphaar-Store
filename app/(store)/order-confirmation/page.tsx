// app/(store)/order-confirmation/page.tsx
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import { Suspense } from 'react'

function OrderConfirmationContent({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-brown-dark mb-3">
          Order Placed! 🎉
        </h1>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Thank you for your order! We&apos;ve received it and will start crafting your beautiful
          piece right away.
        </p>

        {/* Order number */}
        <div className="bg-white rounded-2xl p-5 border border-blush/50 shadow-sm mb-6">
          <p className="text-sm text-muted-foreground mb-1">Your Order Number</p>
          <p className="font-mono text-xl font-bold text-brown">{orderNumber}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Please save this for tracking your order
          </p>
        </div>

        {/* Next steps */}
        <div className="bg-blush/20 rounded-2xl p-5 border border-blush/30 mb-8 text-left space-y-3">
          <h3 className="font-medium text-sm text-foreground">What happens next?</h3>
          {[
            { icon: Mail, text: "You'll receive an order confirmation email shortly" },
            { icon: Package, text: 'We\'ll start crafting your piece within 24-48 hours' },
            { icon: CheckCircle, text: 'You\'ll get shipping updates via email/phone' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex gap-3 items-start">
              <Icon className="w-4 h-4 text-brown mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/products" className="btn-primary flex-1 flex items-center justify-center gap-2">
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="btn-outline flex-1">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { orderNumber?: string }
}) {
  return (
    <Suspense>
      <OrderConfirmationContent orderNumber={searchParams.orderNumber || 'UPH-XXXXXX'} />
    </Suspense>
  )
}
