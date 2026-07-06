'use client';

import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";

interface Props {
  product: Product;
  showQuantitySelector?: boolean;
}

export default function AddToCartButton({ product, showQuantitySelector = false }: Props) {
    const { handleAddToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleClick = () => {
      handleAddToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? '',
        quantity,
        stock: product.stock,
        slug: product.slug,
      });
      setQuantity(1);
    };

    return (
        <div className="flex items-center gap-4 w-full">
            {showQuantitySelector && product.stock > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 border-1 border-zinc-400 text-zinc-900 rounded-md text-sm font-bold disabled:opacity-30 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors"
                >
                  -
                </button>
                <span className="w-8 h-8 flex items-center justify-center bg-white text-sm font-bold text-zinc-900 rounded-md">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 border-1 border-zinc-400 text-zinc-900 rounded-md text-sm font-bold disabled:opacity-30 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors"
                >
                  +
                </button>
              </div>
            )}
            <button
              disabled={product.stock === 0}
              onClick={handleClick}
              className="flex-1 bg-zinc-900 text-white rounded-lg p-2 text-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors hover:cursor-pointer"
            >{product.stock === 0 ? 'Out of stock' : 'Add to cart'}</button>
        </div>
    );
}
