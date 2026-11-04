import type { ReactNode } from 'react';
import '@/styles/globals.css';

// Thẻ <html> và <body> nằm trong app/[locale]/layout.tsx để đặt đúng thuộc tính lang.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
