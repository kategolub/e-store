'use client';

import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function FooterNav() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="flex flex-col gap-2">
      <Link href="/products" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
        Products
      </Link>
      <Link href="/cart" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
        Cart
      </Link>
      {isAuthenticated && (
        <Link href="/orders" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          My Orders
        </Link>
      )}
    </nav>
  );
}
