import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/types';

function Band({
  items,
  className,
  reverse
}: {
  items: string[];
  className: string;
  reverse?: boolean;
}) {
  // Lặp danh sách 2 lần, chạy -50% để nối liền mạch
  const row = [...items, ...items];
  return (
    <div className={className}>
      <div
        className={
          reverse
            ? 'flex w-max motion-safe:animate-marquee-reverse'
            : 'flex w-max motion-safe:animate-marquee'
        }
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-3 font-display text-2xl font-bold whitespace-nowrap sm:text-3xl"
          >
            {item}
            <span aria-hidden className="text-xl">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Hai dải băng chữ chạy ngược chiều, đan chéo nhau (trang trí) */
export async function Marquee({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'marquee' });
  const items = t('items').split('|');

  return (
    <div aria-hidden className="relative overflow-hidden py-12 select-none">
      {/* Hai dải nghiêng ngược nhau, chỉ chạm nhau ở mép để chữ không bị che */}
      <Band
        items={items}
        reverse
        className="relative z-10 -mx-4 -rotate-[1.5deg] bg-matcha-900 py-3 text-cream"
      />
      <Band
        items={items}
        className="relative -mx-4 -mt-1 rotate-1 bg-matcha-400 py-3 text-matcha-950 shadow-soft"
      />
    </div>
  );
}
