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
const CARD_TONES = [
  'bg-matcha-400',
  'bg-cream',
  'bg-accent',
  'bg-matcha-200',
  'bg-cream'
];

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

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="section relative overflow-hidden"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 font-display text-[18rem] leading-none font-extrabold text-matcha-100 select-none"
      >
        “
      </span>

      <div className="container-page relative">
        <Reveal>
          <SectionHeading
            id="reviews-title"
            eyebrow={t('eyebrow')}
            title={t('title')}
          />
        </Reveal>

        <div className="mx-auto mt-14 max-w-2xl">
          {isPending ? (
            <div
              className={clsx(decor.shimmer, 'h-72 rounded-card')}
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
              <div className="relative px-2 pt-4 pb-2">
                {/* Hai thẻ phía sau tạo cảm giác chồng thẻ */}
                <div
                  aria-hidden
                  className={clsx(
                    'absolute inset-x-6 inset-y-4 rotate-3 rounded-card ring-2 ring-matcha-900',
                    CARD_TONES[wrap(position + 2)]
                  )}
                />
                <div
                  aria-hidden
                  className={clsx(
                    'absolute inset-x-4 inset-y-3 -rotate-2 rounded-card ring-2 ring-matcha-900',
                    CARD_TONES[wrap(position + 1)]
                  )}
                />

                <AnimatePresence
                  mode="popLayout"
                  initial={false}
                  custom={direction}
                >
                  <m.figure
                    key={current.id}
                    custom={direction}
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            x: direction * 120,
                            rotate: direction * 8
                          }
                    }
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: 0,
                            x: direction * -160,
                            rotate: direction * -10
                          }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 260, damping: 26 }
                    }
                    drag={total > 1 ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.35}
                    whileDrag={{ scale: 1.02, rotate: 2 }}
                    onDragEnd={onDragEnd}
                    aria-roledescription="slide"
                    aria-label={`${position + 1} / ${total}`}
                    className={clsx(
                      'relative cursor-grab rounded-card px-7 py-10 text-center shadow-[8px_8px_0_0_var(--color-matcha-900)] ring-2 ring-matcha-900 active:cursor-grabbing sm:px-12',
                      CARD_TONES[position % CARD_TONES.length]
                    )}
                  >
                    <Stars
                      rating={current.rating}
                      label={t('rating', { rating: current.rating })}
                      size={22}
                      className="text-matcha-900"
                    />
                    <blockquote className="mt-5 font-display text-2xl leading-snug font-semibold text-matcha-950 sm:text-3xl">
                      “{current.content}”
                    </blockquote>
                    <figcaption className="mt-7 flex items-center justify-center gap-3 text-sm text-matcha-950/90">
                      <span
                        aria-hidden
                        className="grid h-10 w-10 place-items-center rounded-full bg-matcha-900 font-display text-lg font-bold text-matcha-300"
                      >
                        {current.author.charAt(0)}
                      </span>
                      <span className="text-left">
                        <span className="block font-semibold text-matcha-950">
                          {current.author}
                        </span>
                        {t('via', { source: current.source })}
                        <span aria-hidden> · </span>
                        <time dateTime={current.date}>
                          {format.dateTime(new Date(current.date), {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </time>
                      </span>
                    </figcaption>
                  </m.figure>
                </AnimatePresence>
              </div>

              {total > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => paginate(-1)}
                    aria-label={t('prev')}
                    className="btn bg-matcha-900 p-3 text-cream hover:bg-matcha-800"
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
                              'block h-2.5 rounded-full transition-all',
                              i === position
                                ? 'w-7 bg-matcha-600'
                                : 'w-2.5 bg-matcha-200 group-hover:bg-matcha-400'
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
                    className="btn bg-matcha-900 p-3 text-cream hover:bg-matcha-800"
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
