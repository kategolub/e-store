'use client';

export const dynamic = 'force-dynamic';

import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/services/public/orders.service';
import { Order, OrderPayload } from '@/types/order';
import { Input } from '@/@shop/shared/components/ui/input';

export default function CheckoutPage() {
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });

  const { total, items, handleClearCart } = useCart();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: OrderPayload) => createOrder(payload),
    onSuccess: (order: Order) => {
      const emailParam = form.email ? `?email=${encodeURIComponent(form.email)}` : '';
      router.push(`/order-confirmation/${order._id}${emailParam}`);
      handleClearCart();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const payload = {
        items: items.map(item => ({
            product: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
        })),
        customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            zip: form.zip,
        },
        totalPrice: total,
    };

    mutate(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <div className="border rounded-lg p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-lg">Contact Info</h2>

              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="john@gmail.com"
                  className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1234567890"
                  className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div className="border rounded-lg p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-lg">Delivery Info</h2>

              <div className="flex flex-col gap-1">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input
                  id="address"
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="123 Main St"
                  className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="city" className="text-sm font-medium">
                    City
                  </label>
                  <Input
                    id="city"
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="New York"
                    className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="zip" className="text-sm font-medium">
                    ZIP Code
                  </label>
                  <Input
                    id="zip"
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    required
                    placeholder="10001"
                    className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-zinc-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Placing Order...' : 'Place Order'}
            </button>

          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 flex flex-col gap-4 sticky top-24">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="flex flex-col gap-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-500">
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
