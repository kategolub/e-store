export const dynamic = 'force-dynamic';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/@shop/shared/components/ui/pagination';
import { getProducts } from '@/services/public/products.service';
import ProductCard from '@/components/products/ProductCard';

export const metadata = {
  title: 'MEGASHOP | Products',
  description: 'Browse our product catalog',
};

export default async function ProductsPage({ searchParams }: {searchParams: Promise<{ [key: string]: string }>}) {
  const searchPage = (await searchParams).page;
  const currentPage = parseInt(searchPage) || 1;
  const data = await getProducts(currentPage);
  const totalPages = data.pagination.pages;
  const totalProducts = data.pagination.total;

  
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

      <Pagination className='mt-8'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href={`?page=${Math.max(1, currentPage - 1)}`}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  href={`?page=${pageNum}`} 
                  isActive={currentPage === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext 
              href={`?page=${Math.min(totalPages, currentPage + 1)}`}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </main>
  );
}
