import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { minutes, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { LoggerMiddleware } from './common/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // Commenting ThrottlerModule since on Render free tier this blocks app from loading
    // ThrottlerModule.forRoot([
    //   {
    //     name: 'default',
    //     ttl: minutes(1),
    //     limit: 100,
    //   },
    // ]),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    ProductsModule,
    AuthModule,
    OrdersModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
