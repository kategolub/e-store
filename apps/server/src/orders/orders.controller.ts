import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  UseGuards,
  Req,
  Param,
  Query,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OptionalJwtGuard } from '../common/guards/optional-jwt.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../auth/schemas/user.schema';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  async create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.orderService.create(dto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOrders() {
    return this.orderService.getOrders();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyOrders(@Req() req: any, @Query() query: PaginationDto) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }

    const id = req.user._id.toString();

    return this.orderService.findMyOrders(id, query.page, query.limit);
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: any,
    @Query('email') email?: string,
  ) {
    return this.orderService.findOne(id, req.user, email);
  }

  @Get('guest/:id')
  findOneAsGuest(@Param('id', ParseMongoIdPipe) id: string, @Query('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');
    return this.orderService.findOneAsGuest(id, email);
  }

  @Patch('/:id')
  updateOrder(@Param('id', ParseMongoIdPipe) id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.updateOrder(id, dto);
  }
}
