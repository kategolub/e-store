'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import {
  adminGetProducts,
  adminDeleteProduct,
} from '@/services/admin/product.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/@shop/shared/components/ui/tabs';
import { Product } from '@/types/product';
import EditProductModal from '../../../components/admin/EditProductModal';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => adminGetProducts(page, limit),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to delete product');
    }
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  const totalPages = data.pagination.pages;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* <div className="flex justify-between items-center mb-8">
        <Link
          href="/admin/products/new"
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Add New Product
        </Link>
      </div> */}

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-zinc-50">
              <th className="px-6 py-4 text-lg font-semibold text-zinc-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-lg font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-lg font-semibold text-zinc-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-lg font-semibold text-zinc-500 uppercase tracking-wider text-center">Stock</th>
              <th className="px-6 py-4 text-lg font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No products found.
                </td>
              </tr>
            ) : (
              data.products.map((product: Product, idx: number) => (
                <tr key={product._id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <div className="w-10 h-10 rounded bg-zinc-100 flex-shrink-0 overflow-hidden border">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-md font-semibold font-medium text-zinc-900">{product.name}</span>
                        <span className="text-sm text-zinc-500">{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-md text-zinc-600">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 font-semibold text-md text-zinc-600">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-md text-center text-zinc-600">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-md px-2 mx-2 font-semibold text-green-600 hover:text-green-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-4 h-4 inline-block"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deleteMutation.isPending}
                      className="text-md font-semibold mx-3 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-4 h-4 inline-block"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-lg text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === i + 1
                    ? 'bg-zinc-900 text-white'
                    : 'hover:bg-zinc-100 text-zinc-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded-lg text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      {selectedProduct && (
        <EditProductModal
          key={selectedProduct._id}
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
