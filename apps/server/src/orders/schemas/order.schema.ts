import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type OrderItemDocument = HydratedDocument<OrderItem>;
export type OrderDocument = HydratedDocument<Order>;
export type CustomerInfoDocument = HydratedDocument<CustomerInfo>;
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true, min: 1 })
  quantity!: number;

  @Prop({ required: true })
  image!: string;
}

@Schema({ _id: false })
class CustomerInfo {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true })
  address!: string;

  @Prop({ required: true })
  city!: string;

  @Prop({ required: true })
  zip!: string;
}

@Schema({ timestamps: true, versionKey: false })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  user?: Types.ObjectId;

  @Prop({ type: [OrderItem], required: true })
  items!: OrderItem[];

  @Prop({ type: CustomerInfo, required: true })
  customer!: CustomerInfo;

  @Prop({
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending',
  })
  status!: OrderStatus;

  @Prop(String)
  trackingNumber?: string;

  @Prop({ required: true })
  totalPrice!: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
export const CustomerInfoSchema = SchemaFactory.createForClass(CustomerInfo);

OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
