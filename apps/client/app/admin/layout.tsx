'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isInitialized, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [isInitialized, isAuthenticated, user, router]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-bold text-sm uppercase tracking-wider text-zinc-500">
              Admin Panel
            </span>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin/products"
                className="text-sm font-medium hover:text-zinc-900 text-zinc-600 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="text-sm font-medium hover:text-zinc-900 text-zinc-600 transition-colors"
              >
                Orders
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
