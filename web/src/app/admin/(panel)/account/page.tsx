import type { Metadata } from 'next';
import { AccountAdmin } from '@/admin/pages/AccountAdmin';

export const metadata: Metadata = { title: 'Tài khoản' };

export default function Page() {
  return <AccountAdmin />;
}
