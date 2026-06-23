'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { getMyOrders } from '../../services/public/orders.service';
import { Order } from '../../types/order';
import { getOrderStatusClass } from '../../lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/@shop/shared/components/ui/pagination';
import { Button } from '@/@shop/shared/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/auth/login');
  }, [authLoading, isAuthenticated, router]);

  const { data, isLoading: ordersLoading, error } = useQuery({
    queryKey: ['my-orders', page],
    queryFn: () => getMyOrders(page),
    enabled: isAuthenticated,
    retry: false,
  });

  if (authLoading || (!isAuthenticated)) return null;

  if (ordersLoading) return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-zinc-500">Loading...</p>
    </main>
  );

  if (error) return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-red-500">Failed to load orders</p>
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
                  <span className={`text-sm font-medium capitalize ${getOrderStatusClass(order.status)}`}>
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

          {data.pagination.pages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className="gap-1 pl-2.5"
                  >
                    <ChevronLeftIcon className="size-4" />
                    <span className="hidden sm:block">Previous</span>
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-muted-foreground px-2">
                    Page {page} of {data.pagination.pages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === data.pagination.pages}
                    className="gap-1 pr-2.5"
                  >
                    <span className="hidden sm:block">Next</span>
                    <ChevronRightIcon className="size-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </main>
  );
}
