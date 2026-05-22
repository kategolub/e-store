import { IsEnum, IsOptional, IsString } from 'class-validator';
import { type OrderStatus } from '../schemas/order.schema';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(['pending', 'processing', 'shipped', 'delivered'])
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}
