import { redirect } from 'next/navigation';
import { getProducts } from '../../services/public/products.service';
import ProductCard from '../../components/products/ProductCard';

interface Props {
  searchParams: Promise<{ search?: string; page?: string }>
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: Props) {
  const { search } = await searchParams;
  return {
    title: search ? `"${search}" — Search results | Shop` : 'Search | Shop',
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { search, page } = await searchParams;

  if (!search?.trim()) {
    redirect('/products');
  }

  const data = await getProducts(Number(page) || 1, 12, search);

  return (
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8">
      <h1 className="text-3xl font-bold">
        Results for "{search}"
      </h1>
      <p className="text-muted-foreground mt-1">
        {data.total} product{data.total !== 1 ? 's' : ''} found
      </p>
    </div>

    {data.products.length === 0 ? (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-xl font-medium">No products found</p>
        <p className="text-muted-foreground">
          Try searching for something else
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    )}

    {data.pages > 1 && (
      <div className="flex items-center justify-center gap-4 mt-8">
        {Number(page) > 1 && (
          <a href={`/search?search=${search}&page=${Number(page) - 1}`} className="text-sm underline">
            Previous
          </a>
        )}
        <span className="text-sm text-muted-foreground">
          Page {page || 1} of {data.pages}
        </span>
        {Number(page || 1) < data.pages && (
          <a href={`/search?search=${search}&page=${Number(page || 1) + 1}`} className="text-sm underline">
            Next
          </a>
        )}
      </div>
    )}
  </main>
  );
}