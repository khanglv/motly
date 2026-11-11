import type { Metadata } from 'next';
import { ReviewsAdmin } from '@/admin/pages/ReviewsAdmin';

export const metadata: Metadata = { title: 'Đánh giá' };

export default function Page() {
  return <ReviewsAdmin />;
}
