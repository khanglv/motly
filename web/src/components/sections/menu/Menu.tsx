'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { m, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useMenu } from '@/hooks/useMenu';
import { useUIStore } from '@/store/ui-store';
import {
  MENU_CATEGORIES,
  MENU_FILTERS,
  type MenuCategory,
  type MenuFilter,
  type MenuItem
} from '@/types';
import { ErrorState } from '@/components/ui/ErrorState';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Leaf } from '@/components/ui/decor';
import decor from '@/styles/decor.module.scss';
import { MenuRow } from './MenuRow';

function MenuSkeleton({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid gap-x-10 gap-y-3 md:grid-cols-2 lg:grid-cols-3"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} data-testid="menu-skeleton" className="flex gap-4 p-2">
          <div
            className={clsx(decor.shimmer, 'h-16 w-16 shrink-0 rounded-xl')}
          />
          <div className="flex-1 space-y-2 pt-1">
            <div className={clsx(decor.shimmer, 'h-5 w-3/4 rounded')} />
            <div className={clsx(decor.shimmer, 'h-3.5 w-full rounded')} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Một cột danh mục trong bảng menu */
function CategoryColumn({
  category,
  items,
  showTitle
}: {
  category: MenuCategory;
  items: MenuItem[];
  showTitle: boolean;
}) {
  const t = useTranslations('menu');
  return (
    <section
      aria-labelledby={showTitle ? `menu-cat-${category}` : undefined}
      className="min-w-0"
    >
      {showTitle && (
        <h3
          id={`menu-cat-${category}`}
          className="mb-3 flex items-center gap-2 border-b border-matcha-200 pb-2 font-display text-sm font-bold tracking-[0.2em] text-matcha-700 uppercase"
        >
          <Leaf className="h-4 w-4 text-matcha-500" />
          {t(`tabs.${category}`)}
          <span className="ml-auto font-sans text-xs font-medium tracking-normal text-ink-soft normal-case">
            {t('count', { count: items.length })}
          </span>
        </h3>
      )}
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <MenuRow item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function MenuBoard({ category }: { category: MenuFilter }) {
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

  const groups = MENU_CATEGORIES.map((c) => ({
    category: c,
    items: data.filter((i) => i.category === c)
  })).filter((g) => g.items.length > 0);
  const overview = groups.length > 1;

  return (
    <m.div
      key={category}
      aria-busy={isPlaceholderData}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: isPlaceholderData ? 0.6 : 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={clsx(
        'grid gap-x-10 gap-y-10',
        overview ? 'md:grid-cols-2 lg:grid-cols-3' : ''
      )}
    >
      {overview ? (
        groups.map((g) => (
          <CategoryColumn
            key={g.category}
            category={g.category}
            items={g.items}
            showTitle
          />
        ))
      ) : (
        // Chỉ một danh mục: chia đôi danh sách thành 2 cột trên màn hình rộng
        <ul className="grid gap-x-10 gap-y-1 md:grid-cols-2">
          {groups[0].items.map((item) => (
            <li key={item.id}>
              <MenuRow item={item} />
            </li>
          ))}
        </ul>
      )}
    </m.div>
  );
}

export function Menu() {
  const t = useTranslations('menu');
  const reduceMotion = useReducedMotion();
  const activeCategory = useUIStore((s) => s.activeCategory);
  const setActiveCategory = useUIStore((s) => s.setActiveCategory);

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="section relative bg-matcha-50"
    >
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
          className="mt-10"
        >
          <Tabs.List
            aria-label={t('filterLabel')}
            className="mx-auto mb-8 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-cream p-1.5 shadow-soft ring-1 ring-matcha-900/10"
          >
            {MENU_FILTERS.map((f) => {
              const active = f === activeCategory;
              return (
                <Tabs.Trigger
                  key={f}
                  value={f}
                  className={clsx(
                    'relative shrink-0 rounded-full px-5 py-2 font-display text-base font-semibold transition-colors',
                    active
                      ? 'text-cream'
                      : 'text-matcha-800 hover:text-matcha-950'
                  )}
                >
                  {/* Viên nền trượt theo tab đang chọn */}
                  {active && (
                    <m.span
                      aria-hidden
                      layoutId="menu-tab-pill"
                      className="absolute inset-0 rounded-full bg-matcha-700"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 400, damping: 32 }
                      }
                    />
                  )}
                  <span className="relative">{t(`tabs.${f}`)}</span>
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>

          {/* Bảng menu kiểu "menu board": tất cả món trên một màn hình, chia cột theo danh mục */}
          <Tabs.Content
            value={activeCategory}
            className="rounded-[2rem] bg-cream p-4 shadow-soft ring-1 ring-matcha-900/5 outline-none sm:p-8"
          >
            <MenuBoard category={activeCategory} />
            <p className="mt-6 border-t border-dashed border-matcha-200 pt-4 text-center text-xs text-ink-soft">
              {t('priceNote')}
            </p>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </section>
  );
}
