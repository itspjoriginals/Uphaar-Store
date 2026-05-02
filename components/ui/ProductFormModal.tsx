// components/ui/ProductFormModal.tsx
'use client'

import { useState, useRef } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import { CATEGORIES } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ProductFormModalProps {
  product?: any
  onClose: () => void
}

export default function ProductFormModal({ product, onClose }: ProductFormModalProps) {
  const isEdit = !!product
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    comparePrice: product?.comparePrice?.toString() || '',
    category: product?.category || CATEGORIES[1],
    images: product?.images || [] as string[],
    tags: product?.tags?.join(', ') || '',
    inStock: product?.inStock ?? true,
    stockCount: product?.stockCount?.toString() || '0',
    featured: product?.featured ?? false,
    customizable: product?.customizable ?? false,
    colorVariants: product?.variants?.colors?.join(', ') || '',
    sizeVariants: product?.variants?.sizes?.join(', ') || '',
  })

  const set = (key: string, val: any) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        urls.push(data.url)
      }
      set('images', [...form.images, ...urls])
      toast.success(`${urls.length} image(s) uploaded`)
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (i: number) => {
    set('images', form.images.filter((_: any, idx: number) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.images.length) {
      toast.error('At least one image required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        category: form.category,
        images: form.images,
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        inStock: form.inStock,
        stockCount: parseInt(form.stockCount),
        featured: form.featured,
        customizable: form.customizable,
        variants: {
          ...(form.colorVariants
            ? { colors: form.colorVariants.split(',').map((c: string) => c.trim()).filter(Boolean) }
            : {}),
          ...(form.sizeVariants
            ? { sizes: form.sizeVariants.split(',').map((s: string) => s.trim()).filter(Boolean) }
            : {}),
        },
      }

      const url = isEdit ? `/api/products/${product.id}` : '/api/products'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success(isEdit ? 'Product updated!' : 'Product created!')
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="font-serif text-xl text-gray-900">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Images */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Images *
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.images.map((url: string, i: number) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover border border-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-brown hover:bg-blush/10 transition-colors text-gray-400"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-brown border-t-transparent" />
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="text-[10px]">Upload</span>
                  </>
                )}
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <p className="text-xs text-gray-400">PNG, JPG up to 5MB each</p>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
              placeholder="Blush Bloom Bouquet"
              className="input-field bg-gray-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
              rows={3}
              placeholder="Describe the product..."
              className="input-field bg-gray-50 resize-none"
            />
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Price (₹) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="899"
                className="input-field bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Compare Price (₹)
              </label>
              <input
                type="number"
                value={form.comparePrice}
                onChange={(e) => set('comparePrice', e.target.value)}
                min="0"
                step="0.01"
                placeholder="1199"
                className="input-field bg-gray-50"
              />
            </div>
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="input-field bg-gray-50"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Stock Count
              </label>
              <input
                type="number"
                value={form.stockCount}
                onChange={(e) => set('stockCount', e.target.value)}
                min="0"
                className="input-field bg-gray-50"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              placeholder="flowers, gift, bouquet"
              className="input-field bg-gray-50"
            />
          </div>

          {/* Variants */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Colour Variants
              </label>
              <input
                type="text"
                value={form.colorVariants}
                onChange={(e) => set('colorVariants', e.target.value)}
                placeholder="Blush Pink, Ivory, Dusty Rose"
                className="input-field bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Size Variants
              </label>
              <input
                type="text"
                value={form.sizeVariants}
                onChange={(e) => set('sizeVariants', e.target.value)}
                placeholder="Small, Medium, Large"
                className="input-field bg-gray-50"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'inStock', label: 'In Stock' },
              { key: 'featured', label: 'Featured' },
              { key: 'customizable', label: 'Customizable' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => set(key, !form[key as keyof typeof form])}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    form[key as keyof typeof form] ? 'bg-brown' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      form[key as keyof typeof form] ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-cream border-t-transparent" />
                  Saving...
                </>
              ) : (
                isEdit ? 'Save Changes' : 'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
