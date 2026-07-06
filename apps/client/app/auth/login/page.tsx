'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '@/@shop/shared/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    setIsLoading(true);

    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
        await login({ email, password });
        router.push('/');
    } catch (err: any) {
        setError(err.message || 'Invalid email or password');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-8">Login</h1>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-zinc-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-sm text-zinc-500 mt-4">
        Don't have an account?{' '}
        <Link href="/auth/register" className="underline">
          Register
        </Link>
      </p>
    </main>
  );
}
