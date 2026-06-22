export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getProducts } from '../services/public/products.service';
import ProductCard from '../components/products/ProductCard';
import { Product } from '@/types/product';

export const metadata = {
  title: 'MegaShop — Premium Clothing Store',
  description: 'Shop the latest trends in clothing and accessories',
};

export default async function HomePage() {
  const data = await getProducts(1, 8);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <LatestProducts products={data.products} />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center gap-6">
        <h1 className="text-5xl font-bold leading-tight max-w-2xl">
          Discover Your Perfect Style
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl">
          Shop the latest trends in clothing and accessories. 
          Free shipping for orders over $100.
        </p>
        <Link
          href="/products"
          className="bg-white text-zinc-900 rounded-lg px-8 py-3 font-medium hover:bg-zinc-100 transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}

function LatestProducts({ products }: { products: Product[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Latest Products</h2>
        <Link
          href="/products"
          className="text-sm font-medium underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
