import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

const mockProductsService = {
  findAll: jest.fn(),
  findBySlug: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll with query params', async () => {
    const mockResult = { products: [], total: 0, pages: 0 };
    mockProductsService.findAll.mockResolvedValue(mockResult);

    const result = await controller.findAll({ page: 1, limit: 12, search: '' });

    expect(mockProductsService.findAll).toHaveBeenCalledWith({ page: 1, limit: 12, search: '' });
    expect(result).toEqual(mockResult);
  });

  it('should call findBySlug with slug', async () => {
    mockProductsService.findBySlug.mockResolvedValue({ name: 'Nike Air Max 90' });

    const result = await controller.findBySlug('nike-air-max-90');

    expect(mockProductsService.findBySlug).toHaveBeenCalledWith('nike-air-max-90');
    expect(result).toEqual({ name: 'Nike Air Max 90' });
  });
});
