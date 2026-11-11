import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { PrismaExceptionFilter } from './common/prisma-exception.filter.js';

const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'] as const;

async function bootstrap() {
  // Dev: đọc api/.env (production đặt biến môi trường trên host)
  try {
    process.loadEnvFile();
  } catch {
    /* không có file .env */
  }
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Thiếu biến môi trường: ${missing.join(', ')}`);
  if (process.env.NODE_ENV === 'production' && (process.env.JWT_SECRET?.length ?? 0) < 32) {
    throw new Error('JWT_SECRET cần dài ít nhất 32 ký tự');
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Sau proxy (Render, rewrite của Next) để lấy đúng IP cho giới hạn request
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cookieParser());
  app.useBodyParser('json', { limit: '200kb' });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
  );
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableShutdownHooks();

  // Không bật CORS: web đọc API từ server, CMS gọi qua proxy /cms-api cùng domain với web.
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, '0.0.0.0');
  Logger.log(`API chạy tại http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
