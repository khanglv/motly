import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Báo web Next.js làm mới cache nội dung sau khi CMS lưu thay đổi.
 * Gọi POST {WEB_URL}/api/revalidate với header x-revalidate-secret. Lỗi chỉ ghi log,
 * không làm hỏng thao tác lưu (web vẫn tự làm mới theo thời gian cache).
 */
@Injectable()
export class WebRevalidateService {
  private readonly logger = new Logger(WebRevalidateService.name);

  constructor(private readonly config: ConfigService) {}

  trigger(): void {
    const webUrl = this.config.get<string>('WEB_URL');
    const secret = this.config.get<string>('REVALIDATE_SECRET');
    if (!webUrl || !secret) return;

    fetch(`${webUrl.replace(/\/$/, '')}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret },
      signal: AbortSignal.timeout(10_000)
    })
      .then((res) => {
        if (!res.ok) this.logger.warn(`Revalidate web trả về ${res.status}`);
      })
      .catch((err: unknown) => this.logger.warn(`Không gọi được revalidate web: ${String(err)}`));
  }
}
