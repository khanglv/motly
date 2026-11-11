import { applyDecorators } from '@nestjs/common';
import { IsString, Matches, MaxLength } from 'class-validator';

/**
 * Link ảnh hợp lệ: ảnh có sẵn trong web (/images/...) hoặc ảnh upload lên Cloudinary.
 * Web hiển thị ảnh bằng next/image, chỉ cho phép 2 nguồn này (xem images.remotePatterns ở web).
 */
export const IsImageUrl = () =>
  applyDecorators(
    IsString(),
    MaxLength(1000),
    Matches(/^(\/images\/[\w./-]+|https:\/\/res\.cloudinary\.com\/[^\s"'<>]+)$/, {
      message: 'Ảnh phải là đường dẫn /images/... hoặc ảnh Cloudinary (https://res.cloudinary.com/...)'
    })
  );
