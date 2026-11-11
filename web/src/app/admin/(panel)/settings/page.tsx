import type { Metadata } from 'next';
import { SettingsAdmin } from '@/admin/pages/SettingsAdmin';

export const metadata: Metadata = { title: 'Thông tin quán' };

export default function Page() {
  return <SettingsAdmin />;
}
