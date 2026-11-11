import { applyDecorators } from '@nestjs/common';
import { IsString, Matches, MaxLength } from 'class-validator';

/**
 * Link ảnh hợp lệ: ảnh có sẵn trong web (/images/...) hoặc ảnh upload lên Neon Object Storage
 * (https://<branch>.storage.<cell>.<region>.aws.neon.tech/<bucket>/...).
 * Web hiển thị ảnh bằng next/image và chỉ cho phép 2 nguồn này (images.remotePatterns ở web).
 */
export const IsImageUrl = () =>
  applyDecorators(
    IsString(),
    MaxLength(1000),
    Matches(/^(\/images\/[\w./-]+|https:\/\/[a-z0-9-]+\.storage\.[a-z0-9.-]+\.aws\.neon\.tech\/[\w./-]+)$/, {
      message: 'Ảnh phải là đường dẫn /images/... hoặc ảnh đã tải lên Neon Storage'
    })
  );
