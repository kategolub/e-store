import { getProducts } from '../../services/public/products.service';
import ProductCard from '@/components/products/ProductCard';

export const metadata = {
  title: 'MegaShop | Products',
  description: 'Browse our product catalog',
};

export default async function ProductsPage() {
  const data = await getProducts();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {data.products.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground mt-8">
        {data.products.length} of {data.total} products
      </p>
    </main>
  );
}
