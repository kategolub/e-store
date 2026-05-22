'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { getMyOrders } from '../../services/public/orders.service';
import { Order, OrdersResponse } from '../../types/order';

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.push('/auth/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    getMyOrders(page)
      .then(setData)
      .catch(() => setError('Failed to load orders'))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, page]);

  if (authLoading || isLoading) return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-zinc-500">Loading...</p>
    </main>
  );

  if (error) return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-red-500">{error}</p>
    </main>
  );

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {!data?.orders.length ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-xl font-medium">No orders yet</p>
          <Link
            href="/products"
            className="bg-zinc-900 text-white rounded-lg px-6 py-2 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.orders.map((order: Order) => (
            <div key={order._id} className="border rounded-lg p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-zinc-500">Order ID</p>
                  <p className="font-mono text-xs">{order._id}</p>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <p className="text-sm text-zinc-500">Status</p>
                  <span className={`text-sm font-medium capitalize ${
                    order.status === 'delivered' ? 'text-green-600' :
                    order.status === 'shipped' ? 'text-blue-600' :
                    order.status === 'processing' ? 'text-yellow-600' :
                    'text-zinc-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 flex flex-col gap-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-zinc-500">
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <p className="font-semibold">
                  Total: ${order.totalPrice.toFixed(2)}
                </p>
              </div>

              {order.trackingNumber && (
                <p className="text-sm text-zinc-500">
                  Tracking: {order.trackingNumber}
                </p>
              )}
            </div>
          ))}

          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="text-sm underline disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-zinc-500">
                Page {page} of {data.pages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === data.pages}
                className="text-sm underline disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
