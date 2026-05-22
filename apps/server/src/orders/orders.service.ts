import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserDocument } from '../auth/schemas/user.schema';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
  ) {}

  async create(dto: CreateOrderDto, user?: UserDocument): Promise<OrderDocument> {
    const newOrder = new this.orderModel({
      ...dto,

      user: user?._id ?? null,
      status: 'pending',
    });
    await newOrder.save();
    return newOrder;
  }

  async getOrders(): Promise<OrderDocument[]> {
    const orders = await this.orderModel.find();
    return orders;
  }

  async findOne(id: string, user?: UserDocument, email?: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id);

    if (!order) throw new NotFoundException('Order not found');

    if (user?.role && user?.role === 'admin') return order;

    if (user && order.user) {
      if (order.user.toString() !== user._id.toString()) {
        throw new ForbiddenException('Access denied');
      }
      return order;
    }

    if (!order.user && email) {
      if (order.customer.email !== email) {
        throw new ForbiddenException('Access denied');
      }
      return order;
    }

    throw new ForbiddenException('Access denied');
  }

  async findOneAsGuest(id: string, email: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id);

    if (!order) throw new NotFoundException('Order not found');

    if (order.customer.email !== email) throw new ForbiddenException('Access denied');

    if (order.user) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async findMyOrders(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    orders: OrderDocument[];
    total: number;
    pages: number;
  }> {
    const filter = {
      user: new Types.ObjectId(userId),
    };
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.orderModel.countDocuments(filter),
    ]);

    return {
      orders,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async updateOrder(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(id, { $set: dto }, { new: true });

    if (!order) throw new NotFoundException('Order not found.');

    return order;
  }
}
