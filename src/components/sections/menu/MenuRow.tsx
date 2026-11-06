'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import clsx from 'clsx';
import { formatPrice, formatPriceShort } from '@/lib/format';
import type { MenuItem } from '@/types';

const TAG_STYLE = {
  signature: 'bg-matcha-700 text-cream',
  'best-seller': 'bg-matcha-200 text-matcha-900',
  new: 'bg-accent text-matcha-950'
} as const;

/** Một dòng trong bảng menu: ảnh nhỏ, tên, nhãn, mô tả một dòng, giá căn phải có đường chấm dẫn */
export function MenuRow({ item }: { item: MenuItem }) {
  const t = useTranslations('menu.tags');
  const locale = useLocale();

  return (
    <article className="group flex items-start gap-3.5 rounded-2xl p-2 transition-colors hover:bg-matcha-50 sm:gap-4">
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-matcha-100 sm:h-16 sm:w-16">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="4rem"
          className="object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-baseline gap-2">
          <h3 className="min-w-0 truncate font-display text-lg leading-tight font-bold text-matcha-950" title={item.name}>{item.name}</h3>
          <span aria-hidden className="mb-1 min-w-4 flex-1 self-end border-b-2 border-dotted border-matcha-200" />
          <p className="shrink-0 font-display text-lg font-bold text-matcha-700">
            <span className="sr-only">{formatPrice(item.price, locale)}</span>
            <span aria-hidden>{formatPriceShort(item.price)}</span>
          </p>
        </div>
        <p className="mt-0.5 line-clamp-1 text-sm text-ink-soft">{item.description}</p>
        {item.tags.length > 0 && (
          <ul className="mt-1.5 flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <li
                key={tag}
                className={clsx('rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase', TAG_STYLE[tag])}
              >
                {t(tag)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
