import { randomUUID } from 'node:crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Body, Controller, Get, Post, ServiceUnavailableException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsIn, IsInt, Max, Min } from 'class-validator';
import { AdminGuard } from '../auth/auth.guard.js';

/** Loại ảnh cho phép và đuôi file tương ứng */
const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif'
} as const;
type ImageType = keyof typeof IMAGE_TYPES;

const MAX_BYTES = 8 * 1024 * 1024;
/** Link upload hết hạn sau 5 phút */
const URL_TTL_SECONDS = 300;

class PresignDto {
  @IsIn(Object.keys(IMAGE_TYPES), { message: 'Chỉ nhận ảnh JPG, PNG, WebP, AVIF hoặc GIF' })
  contentType: ImageType;

  @IsInt()
  @Min(1)
  @Max(MAX_BYTES, { message: 'Ảnh tối đa 8 MB' })
  size: number;
}

/**
 * Upload ảnh từ CMS lên Neon Object Storage (S3-compatible), bucket truy cập công khai (public_read).
 * API ký một link PUT ngắn hạn (presigned URL) cho đúng 1 file; trình duyệt gửi file thẳng lên Neon,
 * khoá truy cập không bao giờ ra tới trình duyệt.
 */
@Controller('admin/uploads')
@UseGuards(AdminGuard)
export class UploadsController {
  private client: S3Client | null = null;

  constructor(private readonly config: ConfigService) {}

  private storage() {
    const endpoint = this.config.get<string>('AWS_ENDPOINT_URL_S3');
    const region = this.config.get<string>('AWS_REGION');
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucket = this.config.get<string>('STORAGE_BUCKET');
    if (!endpoint || !region || !accessKeyId || !secretAccessKey || !bucket) return null;

    this.client ??= new S3Client({
      endpoint,
      region,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey }
    });
    return { client: this.client, endpoint: endpoint.replace(/\/$/, ''), bucket };
  }

  /** CMS hỏi xem đã bật upload chưa (chưa thì chỉ hiện ô dán link ảnh) */
  @Get('status')
  status() {
    return { enabled: this.storage() !== null };
  }

  @Post('presign')
  async presign(@Body() dto: PresignDto) {
    const storage = this.storage();
    if (!storage) throw new ServiceUnavailableException('Chưa cấu hình Neon Storage');

    // Tên file do server đặt: tránh trùng và tránh ký tự lạ từ tên file gốc
    const month = new Date().toISOString().slice(0, 7);
    const key = `uploads/${month}/${randomUUID()}.${IMAGE_TYPES[dto.contentType]}`;
    const uploadUrl = await getSignedUrl(
      storage.client,
      new PutObjectCommand({
        Bucket: storage.bucket,
        Key: key,
        ContentType: dto.contentType,
        ContentLength: dto.size
      }),
      { expiresIn: URL_TTL_SECONDS, signableHeaders: new Set(['content-type', 'content-length']) }
    );

    return {
      uploadUrl,
      /** Header trình duyệt phải gửi kèm, trùng với lúc ký */
      headers: { 'Content-Type': dto.contentType },
      /** Link công khai của ảnh sau khi upload */
      publicUrl: `${storage.endpoint}/${storage.bucket}/${key}`
    };
  }
}
