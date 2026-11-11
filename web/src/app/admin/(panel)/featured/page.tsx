import type { Metadata } from 'next';
import { FeaturedAdmin } from '@/admin/pages/FeaturedAdmin';

export const metadata: Metadata = { title: 'Món nổi bật' };

export default function Page() {
  return <FeaturedAdmin />;
}
