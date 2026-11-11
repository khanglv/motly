import { Controller, Get, Header } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ContentService } from './content.service.js';

@Controller()
@SkipThrottle()
export class PublicController {
  constructor(private readonly content: ContentService) {}

  /** Kiểm tra API còn sống (Render health check) */
  @Get('health')
  health() {
    return { ok: true };
  }

  /** Toàn bộ nội dung công khai cho web (menu, nổi bật, hình ảnh, đánh giá, thông tin quán) */
  @Get('public/content')
  @Header('Cache-Control', 'public, max-age=60, s-maxage=300')
  getContent() {
    return this.content.getPublicContent();
  }
}
