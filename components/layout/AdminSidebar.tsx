// components/layout/AdminSidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart2,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    toast.success('Logged out')
    router.replace('/admin/login')
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brown flex items-center justify-center">
            <span className="text-cream font-serif text-sm font-bold">U</span>
          </div>
          <div>
            <p className="font-serif text-base text-gray-900 font-semibold">Uphaar</p>
            <p className="text-[11px] text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive(href, exact)
                ? 'bg-brown text-cream shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View Storefront
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 shadow-sm z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brown flex items-center justify-center">
            <span className="text-cream font-serif text-xs font-bold">U</span>
          </div>
          <span className="font-serif text-base font-semibold text-gray-900">Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-40 mt-14"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed top-14 left-0 bottom-0 w-64 bg-white border-r border-gray-100 z-50 shadow-xl">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Mobile top padding */}
      <div className="md:hidden h-14" />
    </>
  )
}
