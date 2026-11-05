'use client';

import Image from 'next/image';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import clsx from 'clsx';
import { useFeatured } from '@/hooks/useFeatured';
import { useUIStore } from '@/store/ui-store';
import type { FeaturedTheme } from '@/types';
import { ErrorState } from '@/components/ui/ErrorState';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Leaf } from '@/components/ui/decor';
import decor from '@/styles/decor.module.scss';
import { formatPrice } from '../menu/MenuCard';

/** Màu của thẻ nổi bật theo `theme` (chọn trong CMS) */
const THEME: Record<FeaturedTheme, { card: string; accent: string; chip: string; blob: string; muted: string }> = {
  matcha: {
    card: 'bg-matcha-900 text-cream',
    accent: 'text-matcha-300',
    chip: 'bg-cream/10 text-cream ring-1 ring-cream/20',
    blob: 'bg-matcha-400',
    muted: 'text-cream/75'
  },
  sakura: {
    card: 'bg-sakura text-matcha-950',
    accent: 'text-matcha-800',
    chip: 'bg-white/50 text-matcha-950 ring-1 ring-matcha-950/10',
    blob: 'bg-cream',
    muted: 'text-matcha-950/75'
  },
  cream: {
    card: 'bg-matcha-200 text-matcha-950',
    accent: 'text-matcha-700',
    chip: 'bg-cream/70 text-matcha-950 ring-1 ring-matcha-950/10',
    blob: 'bg-matcha-400',
    muted: 'text-matcha-950/75'
  }
};

export function FeaturedMenu() {
  const t = useTranslations('featured');
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const { data, isPending, isError, refetch } = useFeatured();
  const setActiveCategory = useUIStore((s) => s.setActiveCategory);
  const [selected, setSelected] = useState(0);

  // CMS chưa có mục nào đang chạy thì ẩn cả section
  if (!isPending && !isError && data.length === 0) return null;

  const index = data ? Math.min(selected, data.length - 1) : 0;
  const current = data?.[index];
  const theme = current ? THEME[current.theme] : THEME.matcha;

  return (
    <section id="featured" aria-labelledby="featured-title" className="section relative overflow-hidden bg-cream">
      <Leaf className="absolute top-16 -left-8 h-28 w-28 -rotate-12 text-matcha-100" />

      <div className="container-page relative">
        <Reveal>
          <SectionHeading id="featured-title" eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        </Reveal>

        <div className="mt-14">
          {isPending ? (
            <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]" role="status" aria-live="polite">
              <span className="sr-only">{t('loading')}</span>
              <div className={clsx(decor.shimmer, 'h-[30rem] rounded-[2.5rem]')} />
              <div className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className={clsx(decor.shimmer, 'h-24 rounded-3xl')} />
                ))}
              </div>
            </div>
          ) : isError ? (
            <ErrorState message={t('error')} retryLabel={t('retry')} onRetry={() => refetch()} />
          ) : (
            current && (
              <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-stretch">
                {/* ===== Thẻ món đang chọn ===== */}
                <div aria-live="polite" className="relative">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <m.article
                      key={current.id}
                      data-testid="featured-spotlight"
                      data-featured-id={current.id}
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, rotate: -1 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, rotate: 1 }}
                      transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className={clsx(
                        'relative grid h-full overflow-hidden rounded-[2.5rem] shadow-[8px_8px_0_0_var(--color-matcha-950)] ring-2 ring-matcha-950 sm:grid-cols-[0.95fr_1.05fr]',
                        theme.card
                      )}
                    >
                      {/* Ảnh trong khung "giọt matcha" */}
                      <div className="relative flex items-center justify-center p-8 pb-0 sm:p-8">
                        {/* Khung vuông: lớp "giọt" phía sau + ảnh tròn mềm phía trước */}
                        <div className="relative aspect-square w-full max-w-80">
                          <span
                            aria-hidden
                            className={clsx(
                              'absolute inset-0 [border-radius:58%_42%_52%_48%/46%_56%_44%_54%] opacity-90 motion-safe:animate-blob',
                              theme.blob
                            )}
                          />
                          <div className="absolute inset-5 overflow-hidden ring-4 ring-cream [border-radius:46%_54%_44%_56%/56%_44%_56%_44%] motion-safe:animate-blob">
                            <Image
                              src={current.image}
                              alt={current.item.name}
                              fill
                              sizes="(min-width: 1024px) 18rem, 70vw"
                              className="object-cover"
                            />
                          </div>
                        </div>
                        {current.badge && (
                          <span className="absolute top-6 left-6 -rotate-6 rounded-full bg-matcha-950 px-4 py-1.5 font-display text-sm font-bold text-matcha-300 shadow-[3px_3px_0_0_var(--color-matcha-400)]">
                            {current.badge}
                          </span>
                        )}
                      </div>

                      <div className="relative flex flex-col p-8 sm:py-10 sm:pr-10 sm:pl-2">
                        <p className={clsx('font-display text-sm font-bold tracking-[0.18em] uppercase', theme.accent)}>
                          {current.headline}
                        </p>
                        <h3 className="mt-2 text-4xl text-current sm:text-5xl">{current.item.name}</h3>
                        <p className={clsx('mt-4 leading-relaxed', theme.muted)}>{current.story}</p>

                        <ul className="mt-5 flex flex-wrap gap-2">
                          {current.highlights.map((h) => (
                            <li key={h} className={clsx('rounded-full px-3 py-1 text-xs font-semibold', theme.chip)}>
                              {h}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                          <p className="mr-auto font-display text-3xl font-extrabold">
                            {formatPrice(current.item.price, locale)}
                          </p>
                          <a
                            href="#menu"
                            onClick={() => setActiveCategory(current.item.category)}
                            className={clsx(
                              'btn border-2 px-5 py-3',
                              current.theme === 'matcha'
                                ? 'border-cream/40 text-cream hover:bg-cream/10'
                                : 'border-matcha-950/30 text-matcha-950 hover:bg-white/30'
                            )}
                          >
                            {t('viewMenu')}
                          </a>
                          <a href="#order" className="btn-fresh px-6 py-3 ring-2 ring-matcha-950">
                            {t('order')}
                          </a>
                        </div>
                      </div>
                    </m.article>
                  </AnimatePresence>
                </div>

                {/* ===== Danh sách để chọn món ===== */}
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:content-start" aria-label={t('listLabel')}>
                  {data.map((f, i) => {
                    const active = i === index;
                    return (
                      <li key={f.id}>
                        <button
                          type="button"
                          onClick={() => setSelected(i)}
                          aria-pressed={active}
                          className={clsx(
                            'group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl p-3 pr-5 text-left ring-2 transition-[background-color,box-shadow,translate] duration-200 motion-reduce:transition-none',
                            active
                              ? 'bg-matcha-950 text-cream shadow-[5px_5px_0_0_var(--color-matcha-400)] ring-matcha-950'
                              : 'bg-matcha-50 text-matcha-950 ring-matcha-100 hover:-translate-y-0.5 hover:ring-matcha-300'
                          )}
                        >
                          {active && !reduceMotion && (
                            <m.span
                              aria-hidden
                              layoutId="featured-active"
                              className="absolute inset-y-3 left-0 w-1.5 rounded-r-full bg-matcha-400"
                            />
                          )}
                          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-matcha-100">
                            <Image src={f.image} alt="" fill sizes="4rem" className="object-cover" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={clsx('block text-xs font-semibold', active ? 'text-matcha-300' : 'text-matcha-700')}>
                              {String(i + 1).padStart(2, '0')} · {f.headline}
                            </span>
                            <span className="mt-0.5 block truncate font-display text-lg font-bold">{f.item.name}</span>
                          </span>
                          <span className={clsx('shrink-0 text-sm font-semibold', active ? 'text-cream' : 'text-matcha-800')}>
                            {formatPrice(f.item.price, locale)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
