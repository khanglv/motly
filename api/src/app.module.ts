import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  AdminFeaturedController,
  AdminGalleryController,
  AdminMenuController,
  AdminReviewsController,
  AdminSettingsController
} from './admin/admin.controllers.js';
import { AuthModule } from './auth/auth.module.js';
import { ContentService } from './content/content.service.js';
import { PublicController } from './content/public.controller.js';
import { WebRevalidateService } from './content/web-revalidate.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UploadsController } from './uploads/uploads.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Mặc định 120 request / phút / IP; route đăng nhập giới hạn chặt hơn
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    AuthModule
  ],
  controllers: [
    PublicController,
    AdminMenuController,
    AdminFeaturedController,
    AdminGalleryController,
    AdminReviewsController,
    AdminSettingsController,
    UploadsController
  ],
  providers: [ContentService, WebRevalidateService, { provide: APP_GUARD, useClass: ThrottlerGuard }]
})
export class AppModule {}
