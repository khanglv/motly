import type { Metadata } from 'next';
import { MenuAdmin } from '@/admin/pages/MenuAdmin';

export const metadata: Metadata = { title: 'Menu' };

export default function Page() {
  return <MenuAdmin />;
}
