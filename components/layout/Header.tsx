'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '../products/SearchBar';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        <Link href="/" className="font-bold text-xl shrink-0">
          Shop
        </Link>

        <div className="flex-1 max-w-md">
          <Suspense fallback={
            <input
              disabled
              placeholder="Search products..."
              className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm opacity-50"
            />
          }>
            <SearchBar />
          </Suspense>
        </div>

        <nav className="flex items-center gap-4 shrink-0">
          <Link href="/products" className="text-sm font-medium hover:underline">
            Products
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-sm text-zinc-500">
                {user?.name}
              </span>
              {user?.role === 'admin' && (
                <Link href="/admin" className="text-sm font-medium hover:underline">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-medium hover:underline">
                Login
              </Link>
              <Link href="/auth/register" className="text-sm font-medium hover:underline">
                Register
              </Link>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}
