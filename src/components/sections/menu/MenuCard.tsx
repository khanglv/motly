'use client';

import Image from 'next/image';
import {
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import type { PointerEvent } from 'react';
import clsx from 'clsx';
import type { MenuItem } from '@/types';

const priceFormatters = {
  vi: new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }),
  en: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  })
};

export function formatPrice(price: number, locale: 'vi' | 'en') {
  return priceFormatters[locale].format(price);
}

const TAG_STYLE = {
  signature: 'bg-matcha-900 text-matcha-300 -rotate-3',
  'best-seller': 'bg-matcha-400 text-matcha-950 rotate-2',
  new: 'bg-sakura text-matcha-950 -rotate-2'
} as const;

export function MenuCard({ item }: { item: MenuItem }) {
  const t = useTranslations('menu.tags');
  const locale = useLocale();
  const reduceMotion = useReducedMotion();

  // Nghiêng 3D theo vị trí con trỏ (chỉ chuột/bút, không áp dụng cảm ứng)
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 18 };
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.35), transparent 55%)`;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduceMotion || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="h-full [perspective:900px]">
      <m.article
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: 'preserve-3d' }
        }
        className="group relative flex h-full flex-col overflow-hidden rounded-card bg-cream shadow-[0_2px_0_0_var(--color-matcha-200)] ring-2 ring-matcha-100 transition-shadow duration-300 hover:shadow-[8px_10px_0_0_var(--color-matcha-900)] motion-reduce:transition-none"
      >
        <div className="relative aspect-square overflow-hidden bg-matcha-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          {!reduceMotion && (
            <m.span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: glare }}
            />
          )}
          {item.tags.length > 0 && (
            <ul className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <li
                  key={tag}
                  className={clsx(
                    'rounded-full px-3 py-1 font-display text-xs font-bold tracking-wide shadow-[2px_2px_0_0_rgb(8_42_20/0.6)]',
                    TAG_STYLE[tag]
                  )}
                >
                  {t(tag)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl leading-snug">{item.name}</h3>
            <p className="shrink-0 rounded-full bg-matcha-100 px-3 py-1 font-display text-sm font-bold text-matcha-800">
              {formatPrice(item.price, locale)}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-ink-soft">
            {item.description}
          </p>
        </div>
      </m.article>
    </div>
  );
}
