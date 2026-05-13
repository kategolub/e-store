
import { apiFetch } from "../../lib/api";
import { Product, ProductsResponse } from "../../types/product";


export const getProducts = async (page: number = 1, limit: number = 10, search?: string): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
    });

    return apiFetch<ProductsResponse>(`/products?${params.toString()}`,
        { 
            next: { 
                revalidate: 60, 
                tags: ['products'],
            } 
        }
    );

};

export const getProductBySlug = async (slug: string): Promise<Product> => {
    return apiFetch<Product>(`/products/${slug}`,
        {
            next: {
                revalidate: 60,
                tags: ['products', `product-${slug}`]
            }
        });
};
