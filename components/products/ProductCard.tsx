import { Product } from '@/types/product';
import { Card, CardContent, CardFooter } from '../../@shop/shared/components/ui/card';
import { Button } from '../../@shop/shared/components/ui/button';
import { Badge } from '../../@shop/shared/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  product: Product
  onAddToCart?: () => void
}

export default function ProductCard({ product, onAddToCart }: Props) {
  return (
    <Card className="flex flex-col">
      <Link href={`/products/${product.slug}`}>
        <div className="relative w-full aspect-square bg-zinc-100 rounded-t-lg overflow-hidden">
            {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                  No image
                </div>
            )}
        </div>
      </Link>

      <CardContent className="flex-1 pt-4">
        <Link href={`/products/${product.slug}`}>
          <h2 className="font-semibold text-lg hover:underline line-clamp-2">
            {product.name}
          </h2>
        </Link>
        <p className="text-xl font-bold mt-2">
          ${product.price.toFixed(2)}
        </p>
        {product.stock === 0 && (
          <Badge variant="secondary" className="mt-2">
            Out of stock
          </Badge>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={onAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
