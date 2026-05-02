// app/(admin)/admin/layout.tsx
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminGuard from '@/components/layout/AdminGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-8">{children}</main>
      </div>
    </AdminGuard>
  )
}
