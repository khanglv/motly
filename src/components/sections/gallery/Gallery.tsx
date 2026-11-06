'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useGallery } from '@/hooks/useGallery';
import { useUIStore } from '@/store/ui-store';
import { ErrorState } from '@/components/ui/ErrorState';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Waves } from '@/components/ui/decor';
import decor from '@/styles/decor.module.scss';
import { Lightbox } from './Lightbox';

// Mỗi ảnh nghiêng một chút như ảnh polaroid dán tường
const TILTS = [
  '-rotate-2',
  'rotate-1',
  'rotate-2',
  '-rotate-1',
  'rotate-[1.5deg]',
  '-rotate-[1.5deg]'
];

export function Gallery() {
  const t = useTranslations('gallery');
  const { data, isPending, isError, refetch } = useGallery();
  const openLightbox = useUIStore((s) => s.openLightbox);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className={clsx(
        decor.grain,
        'section relative overflow-hidden bg-surface pt-32 pb-36'
      )}
    >
      {/* Sóng trên nối từ section Menu (màu matcha-50) */}
      <Waves className="top-0 rotate-180" fill="var(--color-matcha-50)" />
      <span
        aria-hidden
        className={clsx(
          decor.glow,
          'top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 bg-matcha-500/25'
        )}
      />

      <div className="container-page relative">
        <Reveal>
          <SectionHeading
            id="gallery-title"
            tone="dark"
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </Reveal>

        <div className="mt-14">
          {isPending ? (
            <div
              className="columns-2 gap-5 md:columns-3"
              role="status"
              aria-live="polite"
            >
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className={clsx(
                    decor.shimmer,
                    'mb-5 break-inside-avoid rounded-2xl opacity-30',
                    i % 2 ? 'h-48' : 'h-72'
                  )}
                />
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              message={t('error')}
              retryLabel={t('retry')}
              onRetry={() => refetch()}
            />
          ) : (
            <>
              <ul className="columns-2 gap-5 md:columns-3">
                {data.map((img, i) => (
                  <li key={img.id} className="mb-5 break-inside-avoid">
                    <Reveal delay={(i % 3) * 0.08} y={40}>
                      <button
                        type="button"
                        onClick={() => openLightbox(i)}
                        aria-label={t('open', { alt: img.alt })}
                        aria-haspopup="dialog"
                        className={clsx(
                          'group block w-full rounded-2xl bg-cream p-2 pb-3 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)] transition-[rotate,scale] duration-300 hover:z-10 hover:scale-[1.03] hover:rotate-0 motion-reduce:transition-none sm:p-2.5 sm:pb-4',
                          TILTS[i % TILTS.length]
                        )}
                      >
                        <span className="block overflow-hidden rounded-xl">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={img.width}
                            height={img.height}
                            sizes="(min-width: 768px) 33vw, 50vw"
                            className="h-auto w-full transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          />
                        </span>
                        <span className="mt-2 block truncate px-1 text-left font-display text-sm font-semibold text-matcha-800 sm:text-base">
                          {img.alt}
                        </span>
                      </button>
                    </Reveal>
                  </li>
                ))}
              </ul>
              <Lightbox images={data} />
            </>
          )}
        </div>
      </div>

      {/* Sóng dưới nối sang section Review (màu cream) */}
      <Waves className="bottom-0" />
    </section>
  );
}
