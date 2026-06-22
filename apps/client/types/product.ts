export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  images?: string[];
  isActive?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  slug?: string;
}

export interface ProductsResponse {
  products: Product[]
  pagination: {
    total: number
    pages: number
  }
}
