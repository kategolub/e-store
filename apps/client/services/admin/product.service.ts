import {
    Product,
    CreateProductDto,
    UpdateProductDto,
    ProductsResponse
} from "../../types/product";
import { apiFetch } from "../../lib/api";

export const adminGetProducts = async (page: number = 1, limit: number = 10): Promise<ProductsResponse> => {
    return apiFetch<ProductsResponse>(`/products?page=${page}&limit=${limit}`, { 
        next: { 
            revalidate: 60, 
            tags: ['admin-products'],
        }
    });
};

export const adminGetProductById = async (id: string): Promise<Product> => {
    return apiFetch<Product>(`/products/${id}`, {
        next: {
            revalidate: 60,
            tags: ['admin-products', `admin-product-${id}`]
        }
    });
};


export const adminGetProductBySlug = async (slug: string): Promise<Product> => {
    return apiFetch<Product>(`/products/${slug}`, {
        next: {
            revalidate: 0,
            tags: ['products', `product-${slug}`]
        }
    });
};

export const adminCreateProduct = async(dto: CreateProductDto): Promise<Product> => {
    const product = await apiFetch<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
    return product;
};

export const adminUpdateProduct = async (
  id: string,
  dto: UpdateProductDto
): Promise<Product> => {
  const product = await apiFetch<Product>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
  return product;
};

export const adminDeleteProduct = async (id: string): Promise<void> => {
    await apiFetch<void>(`/products/${id}`, {
        method: 'DELETE'
    });
};
