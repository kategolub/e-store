'use client';

import { useCart } from "@/hooks/useCart";
import { CartItem as CartItemType } from "@/types/cart";
import Image from "next/image";
import Link from "next/link";

export default function CartItem({ item }: { item: CartItemType }) {
  const { handleRemoveFromCart, handleUpdateQuantity } = useCart();

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <div className="relative w-16 h-16 shrink-0">
        <Image
          src={item.image || 'https://placehold.co/64x64'}
          alt={item.name}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="flex-1">
        <Link href={`/products/${item.slug}`} className="font-medium">{item.name}</Link>
        <p className="text-sm text-zinc-500">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>

      <p className="font-medium w-20 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </p>

      <button
        onClick={() => handleRemoveFromCart(item.id)}
        className="text-red-500 text-sm"
      >
        Remove
      </button>
    </div>
  );
}
