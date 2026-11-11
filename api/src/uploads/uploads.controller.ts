import { Controller, Get, Post, ServiceUnavailableException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { AdminGuard } from '../auth/auth.guard.js';

/**
 * Upload ảnh từ CMS thẳng lên Cloudinary bằng "signed upload":
 * API chỉ ký các tham số (không gửi API secret ra trình duyệt), trình duyệt gửi file tới Cloudinary.
 */
@Controller('admin/uploads')
@UseGuards(AdminGuard)
export class UploadsController {
  constructor(private readonly config: ConfigService) {}

  private credentials() {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');
    return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
  }

  /** CMS hỏi xem đã bật upload chưa (chưa thì chỉ hiện ô dán link ảnh) */
  @Get('status')
  status() {
    return { enabled: this.credentials() !== null };
  }

  @Post('signature')
  sign() {
    const creds = this.credentials();
    if (!creds) throw new ServiceUnavailableException('Chưa cấu hình Cloudinary');

    const timestamp = Math.round(Date.now() / 1000);
    const folder = this.config.get<string>('CLOUDINARY_FOLDER') || 'motly';
    const params = { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(params, creds.apiSecret);

    return {
      ...params,
      signature,
      apiKey: creds.apiKey,
      uploadUrl: `https://api.cloudinary.com/v1_1/${creds.cloudName}/image/upload`
    };
  }
}
