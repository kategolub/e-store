
import { apiFetch } from "../../lib/api";
import { Product, ProductsResponse } from "../../types/product";

export const getProducts = async (
  page = 1,
  limit = 12,
  search = ''
): Promise<ProductsResponse> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
    });

    return apiFetch<ProductsResponse>(
      `/products?${params.toString()}`,
      { next: { revalidate: 60, tags: ['products'] } }
    );
  } catch {
    return { products: [], pagination: { total: 0, pages: 0 } };
  }
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
    return apiFetch<Product>(`/products/${slug}`, {
        next: {
            revalidate: 60,
            tags: ['products', `product-${slug}`]
        }
    });
};
