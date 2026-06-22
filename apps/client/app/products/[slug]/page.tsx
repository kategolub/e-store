export const dynamic = 'force-dynamic';

import Image from "next/image";
import { notFound } from 'next/navigation';
import { getProductBySlug } from "@/services/public/products.service";
import AddToCartButton from "@/components/products/AddToCartButton";

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) return { title: 'Product not found' };

  return {
    title: `${product.name} | MegaShop`,
    description: product.description || `Buy ${product.name} at the best price`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug).catch((err) => console.log('err', err));

  if (!product) notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        <div className="relative w-full aspect-square bg-zinc-100 rounded-lg overflow-hidden">
            {product.images[0] ? (
                <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                No image
                </div>
        )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold mt-2">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {product.stock !== 0 && (
            <p className="text-sm text-green-600 font-medium">
              ✓ In stock ({product.stock} available)
            </p>
          )}

          {product.description && (
            <div>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}