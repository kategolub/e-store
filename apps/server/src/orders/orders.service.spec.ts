import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';
import { Types } from 'mongoose';

const mockOrder = {
  _id: '64f88dc579e295bc66f70621',
  user: new Types.ObjectId('64f88dc579e295bc66f70620'),
  items: [],
  customer: {
    name: 'John',
    email: 'john@gmail.com',
    phone: '123',
    address: '123 St',
    city: 'NYC',
    zip: '10001',
  },
  status: 'pending',
  totalPrice: 100,
};

const mockOrderModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  countDocuments: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: mockOrderModel,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException if order not found', async () => {
      mockOrderModel.findById.mockResolvedValue(null);

      await expect(
        service.findOne('64f88dc579e295bc66f70621', undefined, undefined),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return order for guest with matching email', async () => {
      mockOrderModel.findById.mockResolvedValue({ ...mockOrder, user: null });

      const result = await service.findOne('64f88dc579e295bc66f70621', undefined, 'john@gmail.com');

      expect(result.customer.email).toBe('john@gmail.com');
    });

    it('should throw ForbiddenException for guest with wrong email', async () => {
      mockOrderModel.findById.mockResolvedValue({ ...mockOrder, user: null });

      await expect(
        service.findOne('64f88dc579e295bc66f70621', undefined, 'wrong@gmail.com'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
