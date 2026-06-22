'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { adminUpdateProduct } from '@/services/admin/product.service';
import { UpdateProductDto } from '@/types/product';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProductModal({ product, isOpen, onClose }: EditProductModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UpdateProductDto>({
    name: product?.name ?? '',
    description: product?.description ?? '',
    isActive: product?.isActive ?? false,
    images: product?.images ?? [],
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: Partial<Product> }) => 
      adminUpdateProduct(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onClose();
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to update product');
    }
  });

  if (!isOpen || !product) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      id: product._id,
      updatedData: formData,
    });
  };

  const handleInputChange = (
    field: keyof UpdateProductDto,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-zinc-200">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Edit Product</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full rounded-lg border border-zinc-200 p-2 text-sm focus:outline-none focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Product Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full rounded-lg border border-zinc-200 p-2 text-sm focus:outline-none focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Image Link</label>
            <input
              type="text"
              value={formData.images}
              onChange={(e) => handleInputChange('images', e.target.value)}
              className="w-full rounded-lg border border-zinc-200 p-2 text-sm focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-200 p-2 text-sm focus:outline-none focus:border-zinc-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-200 p-2 text-sm focus:outline-none focus:border-zinc-900"
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 accent-zinc-900 cursor-pointer"
              />
              <label
                htmlFor="isActive" 
                className="text-sm font-medium text-zinc-700 select-none cursor-pointer"
              >
                Visible / Active in Shop
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
