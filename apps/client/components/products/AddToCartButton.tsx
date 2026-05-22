'use client';

import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";

export default function AddToCartButton({ product }: { product: Product }) {
    const { handleAddToCart } = useCart();

    return (
        <div>
            <button
              disabled={product.stock === 0}
              onClick={() => handleAddToCart({
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0] ?? '',
                quantity: 1,
                stock: product.stock,
                slug: product.slug,
              })}
              className="w-full bg-zinc-900 text-white rounded-lg p-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors hover:cursor-pointer"
            >{product.stock === 0 ? 'Out of stock' : 'Add to cart'}</button>
        </div>
    );
}
