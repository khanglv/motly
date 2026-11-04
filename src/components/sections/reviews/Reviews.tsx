'use client';

import {
  AnimatePresence,
  m,
  useReducedMotion,
  type PanInfo
} from 'framer-motion';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';
import clsx from 'clsx';
import { useReviews } from '@/hooks/useReviews';
import { ErrorState } from '@/components/ui/ErrorState';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stars } from '@/components/ui/Stars';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';
import decor from '@/styles/decor.module.scss';

const SWIPE_THRESHOLD = 60;

export function Reviews() {
  const t = useTranslations('reviews');
  const format = useFormatter();
  const reduceMotion = useReducedMotion();
  const { data, isPending, isError, refetch } = useReviews();
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);

  const total = data?.length ?? 0;
  const wrap = (i: number) => (total > 0 ? ((i % total) + total) % total : 0);
  const position = wrap(index);
  const current = total > 0 ? data![position] : null;

  const paginate = (dir: number) => setState(([i]) => [wrap(i + dir), dir]);
  const goTo = (i: number) =>
    setState(([prev]) => [i, i >= wrap(prev) ? 1 : -1]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
    else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
  };

  const offset = reduceMotion ? 0 : 60;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="reviews-title"
            eyebrow={t('eyebrow')}
            title={t('title')}
          />
        </Reveal>

        <div className="mx-auto mt-12 max-w-2xl">
          {isPending ? (
            <div
              className={clsx(decor.shimmer, 'h-64 rounded-card')}
              role="status"
              aria-live="polite"
            />
          ) : isError ? (
            <ErrorState
              message={t('error')}
              retryLabel={t('retry')}
              onRetry={() => refetch()}
            />
          ) : current ? (
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label={t('title')}
            >
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <m.figure
                    key={current.id}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * offset }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -offset }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.35,
                      ease: 'easeOut'
                    }}
                    drag={total > 1 ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={onDragEnd}
                    aria-roledescription="slide"
                    aria-label={`${position + 1} / ${total}`}
                    className="cursor-grab rounded-card bg-matcha-100/60 px-7 py-10 text-center active:cursor-grabbing sm:px-12"
                  >
                    <Stars
                      rating={current.rating}
                      label={t('rating', { rating: current.rating })}
                    />
                    <blockquote className="mt-5 font-serif text-xl leading-relaxed text-matcha-900 sm:text-2xl">
                      “{current.content}”
                    </blockquote>
                    <figcaption className="mt-6 text-sm text-ink-soft">
                      <span className="font-medium text-ink">
                        {current.author}
                      </span>
                      <span aria-hidden> · </span>
                      {t('via', { source: current.source })}
                      <span aria-hidden> · </span>
                      <time dateTime={current.date}>
                        {format.dateTime(new Date(current.date), {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </time>
                    </figcaption>
                  </m.figure>
                </AnimatePresence>
              </div>

              {total > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => paginate(-1)}
                    aria-label={t('prev')}
                    className="btn-ghost p-2.5"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <ul className="flex gap-0.5">
                    {data!.map((r, i) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => goTo(i)}
                          aria-label={t('goTo', { index: i + 1 })}
                          aria-current={i === position ? 'true' : undefined}
                          className="group flex h-6 min-w-6 items-center justify-center rounded-full"
                        >
                          {/* Vùng bấm 24×24px, chấm hiển thị nhỏ bên trong */}
                          <span
                            aria-hidden
                            className={clsx(
                              'block h-2 rounded-full transition-all',
                              i === position
                                ? 'w-6 bg-matcha-700'
                                : 'w-2 bg-matcha-300 group-hover:bg-matcha-500'
                            )}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => paginate(1)}
                    aria-label={t('next')}
                    className="btn-ghost p-2.5"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
