import type { Metadata } from 'next';
import { GalleryAdmin } from '@/admin/pages/GalleryAdmin';

export const metadata: Metadata = { title: 'Hình ảnh' };

export default function Page() {
  return <GalleryAdmin />;
}
