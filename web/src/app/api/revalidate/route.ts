import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { CONTENT_TAG } from '@/lib/content-source';

const NO_STORE = { 'Cache-Control': 'no-store' };

function secretMatches(given: string | null, expected: string) {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * POST /api/revalidate (header x-revalidate-secret)
 * API NestJS gọi sau mỗi lần CMS lưu, để trang chủ hiển thị nội dung mới ngay.
 */
export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return Response.json({ error: 'Revalidate is not configured' }, { status: 501, headers: NO_STORE });
  }
  if (!secretMatches(request.headers.get('x-revalidate-secret'), expected)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE });
  }
  revalidateTag(CONTENT_TAG);
  return Response.json({ revalidated: true, at: new Date().toISOString() }, { headers: NO_STORE });
}
