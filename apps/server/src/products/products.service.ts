import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async reindexAll(): Promise<number> {
    const products = await this.productModel.find();

    for (const product of products) {
      await product.save();
    }
    return products.length;
  }

  async findAll(
    query: PaginationDto & { search?: string },
  ): Promise<{ products: ProductDocument[]; total: number; pages: number }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const filters: Record<string, any> = { isActive: true };

    if (query.search) {
      filters.$or = [{ name: { $regex: query.search, $options: 'i' } }];
    }

    const [products, total] = await Promise.all([
      this.productModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
      this.productModel.countDocuments(filters),
    ]);

    return {
      products,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string): Promise<ProductDocument> {
    const product = await this.productModel.findOne({ slug, isActive: true });

    if (!product) {
      throw new NotFoundException(`Product "${slug}" not found`);
    }

    return product;
  }

  async findById(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException(`Product "${id}" not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    const slug = dto.slug ? dto.slug : slugify(dto.name, { lower: true, strict: true });

    const product = new this.productModel({ ...dto, slug });
    return product.save();
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    if (dto.name && !dto.slug) {
      dto.slug = slugify(dto.name, { lower: true, strict: true });
    }

    const product = await this.productModel.findByIdAndUpdate(id, { $set: dto }, { new: true });

    if (!product) {
      throw new NotFoundException(`Product "${id}" not found`);
    }

    return product;
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException(`Product "${id}" not found`);
    }

    return { message: `Product "${product.name}" deleted` };
  }
}
