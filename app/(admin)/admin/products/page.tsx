// app/(admin)/admin/products/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react'
import { formatPrice, CATEGORIES } from '@/lib/utils'
import toast from 'react-hot-toast'
import ProductFormModal from '@/components/ui/ProductFormModal'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('Product deleted')
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const handleEdit = (product: any) => {
    setEditProduct(product)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditProduct(null)
    fetchProducts()
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setIsModalOpen(true) }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-brown border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No products found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary mt-4 text-sm"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-blush/20 flex-shrink-0">
                          {product.images?.[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-[160px]">
                            {product.name}
                          </p>
                          {product.featured && (
                            <span className="text-[10px] text-gold font-medium">★ Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-gray-600">{product.category}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                        {product.comparePrice && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(product.comparePrice)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className={product.stockCount < 5 ? 'text-red-500 font-medium' : 'text-gray-600'}>
                        {product.stockCount}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span
                        className={`badge text-xs ${
                          product.inStock
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={editProduct}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}
