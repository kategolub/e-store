'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function FooterAuth() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-sm">Account</h3>
      <nav className="flex flex-col gap-2">
        <Link href="/auth/login" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          Login
        </Link>
        <Link href="/auth/register" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          Register
        </Link>
      </nav>
    </div>
  );
}
