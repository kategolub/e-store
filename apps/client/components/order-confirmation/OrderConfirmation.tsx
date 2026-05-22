'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Order } from '@/types/order';

interface Props {
    id: string;
    email: string;
};

export default function OrderConfirmation({ id, email }: Props) {
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const url = email
        ? `/orders/${id}?email=${encodeURIComponent(email)}`
        : `/orders/${id}`;

        apiFetch<Order>(url)
            .then(data => {
                setOrder(data);
            })
            .catch(() => {
                setError('Could not load order');
            })
            .finally(() => setIsLoading(false));
    }, [id, email]);

    if (isLoading) return (
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
            <p className="text-zinc-500">Loading your order...</p>
        </main>
    );

    if (error || !order) return (
        <main className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Could not load order</h2>
            <p className="text-zinc-500 text-sm">{error}</p>
            <Link href="/products" className="underline text-sm">
                Continue shopping
            </Link>
        </main>
    );

    return (
        <main className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold">Thank you for your order!</h1>
                <p className="text-zinc-500 text-sm">
                    Your order has been placed successfully. You will receive a confirmation email shortly.
                </p>
            <Link
                href="/products"
                className="bg-zinc-900 text-white rounded-lg px-6 py-2 text-sm font-medium hover:bg-zinc-700 transition-colors"
            >
                Continue Shopping
            </Link>
        </main>
    );
}
