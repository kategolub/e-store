import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { PaginationMetadataInterceptor } from './common/interceptors/paginationMetadata.interceptor';

async function bootstrap() {
  mongoose.set('autoIndex', true);
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalInterceptors(new TransformInterceptor(), new PaginationMetadataInterceptor());

  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 5001;

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});
