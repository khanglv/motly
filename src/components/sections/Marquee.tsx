import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/types';
import { VelocityMarquee } from '@/components/ui/VelocityMarquee';
import { Leaf } from '@/components/ui/decor';

/**
 * Hai dải chữ đan chéo hình chữ X (trang trí, aria-hidden):
 * - dải sáng: tên món dạng "viên", phóng to khi rê chuột;
 * - dải đậm: chữ lớn xen kẽ chữ đặc / chữ viền.
 * Cả hai chạy ngược chiều và tăng tốc theo tốc độ cuộn trang.
 */
export async function Marquee({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'marquee' });
  const items = t('items').split('|');
  const words = t('words').split('|');

  return (
    <div
      aria-hidden
      className="relative h-44 overflow-hidden select-none sm:h-52"
    >
      {/* Dải đậm: chữ lớn */}
      <VelocityMarquee
        baseVelocity={-3}
        className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[4deg] bg-matcha-800 py-3 text-cream shadow-soft"
        itemClassName="gap-8 pr-8"
      >
        {words.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              className={
                i % 2
                  ? 'text-outline font-display text-4xl font-extrabold tracking-tight text-matcha-300 sm:text-5xl'
                  : 'font-display text-4xl font-extrabold tracking-tight sm:text-5xl'
              }
            >
              {w}
            </span>
            <Leaf className="h-7 w-7 shrink-0 text-matcha-400" />
          </span>
        ))}
      </VelocityMarquee>

      {/* Dải sáng: tên món dạng viên */}
      <VelocityMarquee
        baseVelocity={4}
        className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 -rotate-[3deg] bg-matcha-200/95 py-3 shadow-soft backdrop-blur-sm"
        itemClassName="gap-3 pr-3"
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 rounded-full bg-cream px-4 py-1.5 font-display text-lg font-bold whitespace-nowrap text-matcha-900 shadow-[0_2px_0_0_var(--color-matcha-300)] transition-[scale,background-color,color] duration-200 hover:scale-110 hover:bg-matcha-700 hover:text-cream motion-reduce:transition-none motion-reduce:hover:scale-100 sm:text-xl"
          >
            <span className="h-2 w-2 rounded-full bg-matcha-500" />
            {item}
          </span>
        ))}
      </VelocityMarquee>
    </div>
  );
}
