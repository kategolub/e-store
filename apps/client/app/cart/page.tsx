'use client';

import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/cart/CartItem';
import Link from 'next/link';

export default function CartPage() {
  const { items, total } = useCart();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {items.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Items list */}
          <div className="lg:col-span-2">
            <div className="border rounded-lg divide-y">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 flex flex-col gap-4 sticky top-24">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div className="flex flex-col gap-2 text-sm">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-zinc-500">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-zinc-900 text-white rounded-lg py-3 text-sm font-medium text-center hover:bg-zinc-700 transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="w-full border border-zinc-200 rounded-lg py-3 text-sm font-medium text-center hover:bg-zinc-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-xl font-medium">Your cart is empty</p>
          <p className="text-zinc-500 text-sm">
            Looks like you haven't added anything yet
          </p>
          <Link
            href="/products"
            className="bg-zinc-900 text-white rounded-lg px-6 py-2 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      )}
    </main>
  );
}
