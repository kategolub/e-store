'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { User } from '../../types/auth';

interface Props {
  isOpen: boolean;
  user: User | null;
  isAuthenticated: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  isAuthenticated,
  onLogout,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />

      <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col lg:hidden shadow-xl">

        <div className="flex items-center justify-between p-6 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1 flex-1">
          <Link
            href="/products"
            onClick={onClose}
            className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            Cart
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/orders"
                onClick={onClose}
                className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
              >
                My Orders
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={onClose}
                className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={onClose}
                className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {isAuthenticated && (
          <div className="p-4 border-t flex flex-col gap-2">
            <p className="text-sm text-zinc-500 px-4">
              Signed in as <span className="font-medium text-zinc-900">{user?.name}</span>
            </p>
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
