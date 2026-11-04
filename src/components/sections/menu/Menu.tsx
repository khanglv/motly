'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useMenu } from '@/hooks/useMenu';
import { useUIStore } from '@/store/ui-store';
import { MENU_FILTERS, type MenuFilter } from '@/types';
import { ErrorState } from '@/components/ui/ErrorState';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import decor from '@/styles/decor.module.scss';
import { MenuCard } from './MenuCard';

function MenuSkeleton({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          data-testid="menu-skeleton"
          className="overflow-hidden rounded-card ring-1 ring-matcha-100"
        >
          <div className={clsx(decor.shimmer, 'aspect-square')} />
          <div className="space-y-3 p-5">
            <div className={clsx(decor.shimmer, 'h-5 w-2/3 rounded')} />
            <div className={clsx(decor.shimmer, 'h-4 w-full rounded')} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MenuGrid({ category }: { category: MenuFilter }) {
  const t = useTranslations('menu');
  const reduceMotion = useReducedMotion();
  const { data, isPending, isError, isPlaceholderData, refetch } =
    useMenu(category);

  if (isPending) return <MenuSkeleton label={t('loading')} />;
  if (isError)
    return (
      <ErrorState
        message={t('error')}
        retryLabel={t('retry')}
        onRetry={() => refetch()}
      />
    );
  if (data.length === 0)
    return <p className="text-center text-ink-soft">{t('empty')}</p>;

  return (
    <m.ul
      layout={!reduceMotion}
      aria-busy={isPlaceholderData}
      className={clsx(
        'grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3',
        isPlaceholderData && 'opacity-60'
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {data.map((item) => (
          <m.li
            key={item.id}
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <MenuCard item={item} />
          </m.li>
        ))}
      </AnimatePresence>
    </m.ul>
  );
}

export function Menu() {
  const t = useTranslations('menu');
  const activeCategory = useUIStore((s) => s.activeCategory);
  const setActiveCategory = useUIStore((s) => s.setActiveCategory);

  return (
    <section id="menu" aria-labelledby="menu-title" className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="menu-title"
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </Reveal>

        <Tabs.Root
          value={activeCategory}
          onValueChange={(v) => setActiveCategory(v as MenuFilter)}
          className="mt-12"
        >
          <Tabs.List
            aria-label={t('filterLabel')}
            className="mx-auto mb-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-matcha-100/70 p-1.5"
          >
            {MENU_FILTERS.map((f) => (
              <Tabs.Trigger
                key={f}
                value={f}
                className="shrink-0 rounded-full px-5 py-2 text-sm text-ink-soft transition-colors hover:text-matcha-900 data-[state=active]:bg-cream data-[state=active]:text-matcha-900 data-[state=active]:shadow-sm"
              >
                {t(`tabs.${f}`)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Chỉ render nội dung của tab đang chọn; giữ cùng một MenuGrid để
              React Query giữ dữ liệu cũ trong lúc tải danh mục mới và AnimatePresence chạy mượt */}
          <Tabs.Content value={activeCategory} className="outline-none">
            <MenuGrid category={activeCategory} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </section>
  );
}
