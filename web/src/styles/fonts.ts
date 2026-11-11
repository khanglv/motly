import { Baloo_2, Be_Vietnam_Pro } from 'next/font/google';

// Font dùng chung cho website và trang CMS.
// Font tiêu đề nét tròn, hợp với logo vẽ tay; có dấu tiếng Việt.
export const display = Baloo_2({
  subsets: ['latin', 'vietnamese'],
  weight: ['600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap'
});

export const sans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-be-vietnam',
  display: 'swap'
});
