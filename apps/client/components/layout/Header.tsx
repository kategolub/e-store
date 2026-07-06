'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '../products/SearchBar';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import MobileMenu from './MobileMenu';
import { Input } from '@/@shop/shared/components/ui/input';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <Link href="/" className="font-bold text-2xl">
              MegaShop
            </Link>
          </div>

          <div className="flex-1 max-w-md hidden sm:block">
            <Suspense fallback={
              <Input
                disabled
                placeholder="Search products..."
                className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-md opacity-50"
              />
            }>
              <SearchBar />
            </Suspense>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-4">
              <Link href="/products" className="text-md font-medium hover:underline">
                Products
              </Link>

              {isAuthenticated ? (
                <>
                  {/* <Link href="/orders" className="text-md font-medium hover:underline">
                    My Orders
                  </Link> */}
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="text-md font-medium hover:underline">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-md font-medium hover:underline"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-md font-medium hover:underline">
                    Login
                  </Link>
                  <Link href="/auth/register" className="text-md font-medium hover:underline">
                    Register
                  </Link>
                </>
              )}
            </nav>

            <Link
              href="/cart"
              className="relative p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              aria-label="Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {isMounted && itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="sm:hidden px-4 pb-3">
          <Suspense fallback={
            <Input
              disabled
              placeholder="Search products..."
              className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-md opacity-50"
            />
          }>
            <SearchBar />
          </Suspense>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    </>
  );
}
