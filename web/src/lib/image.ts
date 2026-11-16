/**
 * Ảnh upload từ CMS nằm trên Neon Object Storage. Bộ tối ưu ảnh của Vercel (/_next/image) bị Neon từ chối
 * (lỗi OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED), nên các ảnh này tải thẳng từ Neon.
 * CMS đã nén ảnh (WebP, tối đa 1600px) trước khi upload nên dung lượng vẫn nhỏ.
 */
export const isRemoteImage = (src: string) => /^https?:\/\//.test(src);
