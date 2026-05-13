import Image from "next/image";
import { notFound } from 'next/navigation';
import { getProductBySlug } from "@/services/public/products.service";
import { Badge } from '../../../@shop/shared/components/ui/badge';


interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) return { title: 'Product not found' };

  return {
    title: `${product.name} | Shop`,
    description: product.description || `Buy ${product.name} at the best price`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug).catch((err) => console.log('err', err));

  if (!product) notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
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

          {product.stock === 0 ? (
            <Badge variant="secondary" className="w-fit">
              Out of stock
            </Badge>
          ) : (
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

          <button
            disabled={product.stock === 0}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </main>
  );
}