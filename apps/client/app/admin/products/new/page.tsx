'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminCreateProduct } from '@/services/admin/product.service';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>(['']);

  const handleAddImage = () => {
    setImages([...images, '']);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleRemoveImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    
    const dto = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string) || 0,
      images: images.filter(url => url.trim() !== ''),
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await adminCreateProduct(dto);
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-sm text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mb-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to list
        </Link>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium">Product Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Classic Sneakers"
              className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Tell customers more about this product..."
              className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                min="0"
                placeholder="0.00"
                className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="stock" className="text-sm font-medium">Stock Quantity</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                defaultValue="0"
                className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <label className="text-sm font-medium block">Product Images</label>
          <div className="space-y-3">
            {images.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={images.length === 1}
                  className="p-2 text-zinc-400 hover:text-red-500 disabled:opacity-30"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddImage}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add another image
          </button>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Product is active and visible to customers
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-2 rounded-lg text-sm font-medium border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-zinc-900 text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
