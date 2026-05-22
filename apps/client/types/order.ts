import { CustomerInfo } from "./customer";

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface OrderPayload {
  items: OrderItem[];
  customer: CustomerInfo;
  totalPrice: number;
};

export interface OrdersResponse {
  orders: Order[];
  total: number;
  pages: number;
};

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export interface Order {
  _id: string;
  user?: string;
  items: OrderItem[];
  customer: CustomerInfo;
  status: OrderStatus;
  trackingNumber?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
};
