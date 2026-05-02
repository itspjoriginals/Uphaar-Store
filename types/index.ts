// types/index.ts

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number | null
  images: string[]
  category: string
  tags: string[]
  variants?: ProductVariants | null
  inStock: boolean
  stockCount: number
  featured: boolean
  customizable: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariants {
  colors?: string[]
  sizes?: string[]
  [key: string]: string[] | undefined
}

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
  customMessage?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  total: number
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: ShippingAddress
  paymentStatus: string
  paymentId?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  customMessage?: string | null
  variant?: string | null
  product: Product
}

export type OrderStatus = 'PROCESSING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface ShippingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface CheckoutFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: ShippingAddress
  notes?: string
}

export interface Testimonial {
  id: string
  name: string
  location?: string | null
  rating: number
  review: string
  image?: string | null
  featured: boolean
  createdAt: Date
}

export interface AdminStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalProducts: number
  recentOrders: Order[]
  topProducts: { product: Product; totalSold: number }[]
}
