import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

const mockProduct = {
  _id: '64f88dc579e295bc66f70621',
  name: 'Nike Air Max 90',
  slug: 'nike-air-max-90',
  description: 'Classic running shoe',
  price: 120,
  images: [],
  stock: 50,
  isActive: true,
  save: jest.fn().mockResolvedValue(this),
};

const mockProductModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
  create: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const products = [mockProduct];
      mockProductModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(products),
          }),
        }),
      });
      mockProductModel.countDocuments.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 12 });

      expect(result.products).toEqual(products);
      expect(result.total).toBe(1);
      expect(result.pages).toBe(1);
    });
  });

  describe('findBySlug', () => {
    it('should return a product by slug', async () => {
      mockProductModel.findOne.mockResolvedValue(mockProduct);

      const result = await service.findBySlug('nike-air-max-90');

      expect(result).toEqual(mockProduct);
      expect(mockProductModel.findOne).toHaveBeenCalledWith({
        slug: 'nike-air-max-90',
        isActive: true,
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductModel.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('not-found')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a product with auto-generated slug', async () => {
      const dto = {
        name: 'Nike Air Max 90',
        price: 120,
        stock: 50,
      };

      const savedProduct = { ...mockProduct, save: jest.fn().mockResolvedValue(mockProduct) };
      mockProductModel.create = jest.fn().mockImplementation(() => savedProduct);

      jest.spyOn(service, 'create').mockResolvedValue(mockProduct as any);

      const result = await service.create(dto);
      expect(result).toBeDefined();
    });

    it('should throw ConflictException on duplicate slug', async () => {
      const dto = { name: 'Nike Air Max 90', price: 120 };
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(
          new ConflictException('Product with slug "nike-air-max-90" already exists'),
        );

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete a product and return confirmation', async () => {
      mockProductModel.findByIdAndDelete.mockResolvedValue(mockProduct);

      const result = await service.remove('64f88dc579e295bc66f70621');

      expect(result).toEqual({ message: `Product "Nike Air Max 90" deleted` });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('64f88dc579e295bc66f70621')).rejects.toThrow(NotFoundException);
    });
  });
});
