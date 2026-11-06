import Image from 'next/image';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/types';
import { ClockIcon, PhoneIcon } from '@/components/ui/icons';
import { Enso, Hanko } from './HeroBackdrop';
import decor from '@/styles/decor.module.scss';

/** Tách câu thành từng từ để hiện lần lượt (CSS animation, không cần JS) */
function Words({ text, start = 0 }: { text: string; start?: number }) {
  return text.split(' ').map((word, i) => (
    <span key={i}>
      <span
        className="inline-block motion-safe:animate-word-in"
        style={{ '--i': start + i } as CSSProperties}
      >
        {word}
      </span>{' '}
    </span>
  ));
}

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'hero' });
  const titleWords = t('title').split(' ').length;

  return (
    <section
      aria-labelledby="hero-title"
      className={clsx(
        decor.grain,
        'relative isolate overflow-hidden border-b border-ink/5 bg-paper text-ink'
      )}
    >
      <div className="container-page relative grid items-center gap-16 pt-14 pb-24 md:grid-cols-[1.1fr_0.9fr] md:pt-20 md:pb-28">
        <div className="relative z-10">
          <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-matcha-700 uppercase motion-safe:animate-fade-up">
            <span aria-hidden className="h-px w-10 bg-matcha-600" />
            {t('eyebrow')}
          </p>

          <h1
            id="hero-title"
            className="mt-7 text-5xl text-ink sm:text-6xl lg:text-7xl"
          >
            <Words text={t('title')} />
            <span className="mt-1 block text-matcha-700">
              <Words text={t('titleHighlight')} start={titleWords} />
            </span>
          </h1>

          <p
            className="mt-7 max-w-lg text-base leading-relaxed text-ink-soft motion-safe:animate-fade-up sm:text-lg"
            style={{ '--delay': '0.55s' } as CSSProperties}
          >
            {t('subtitle')}
          </p>

          <div
            className="mt-9 flex flex-wrap items-center gap-3 motion-safe:animate-fade-up"
            style={{ '--delay': '0.7s' } as CSSProperties}
          >
            <a href="#menu" className="btn-fresh px-7 py-3.5 text-base">
              {t('ctaMenu')}
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="btn-outline px-6 py-3.5 text-base"
            >
              <PhoneIcon width={18} height={18} />
              {t('ctaCall')}
            </a>
            <a
              href="#order"
              className="group inline-flex items-center gap-1.5 px-2 py-3 text-sm font-semibold text-ink-soft hover:text-ink"
            >
              {t('ctaOrder')}
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              >
                →
              </span>
            </a>
          </div>

          <p
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-ink-soft ring-1 ring-ink/10 motion-safe:animate-fade-up"
            style={{ '--delay': '0.85s' } as CSSProperties}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-matcha-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-matcha-400" />
            </span>
            <ClockIcon width={16} height={16} />
            {t('hours', {
              opens: siteConfig.hours.opens,
              closes: siteConfig.hours.closes
            })}
          </p>
        </div>

        {/* Ảnh hero kiểu Nhật: khung tranh trên giấy, vòng ensō phía sau, chữ dọc và con dấu */}
        <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-sm md:max-w-md">
          <Enso className="absolute -top-[14%] -right-[24%] -z-10 aspect-square w-[100%] text-matcha-500/70" />

          <p
            aria-hidden
            lang="ja"
            className="absolute top-2 -left-12 hidden font-serif text-xl tracking-[0.6em] text-ink/60 [writing-mode:vertical-rl] sm:block lg:-left-16"
          >
            抹茶一杯
          </p>

          <div className="bg-white p-2.5 shadow-lift sm:p-3">
            <div className="relative aspect-[4/5] overflow-hidden bg-matcha-100">
              <Image
                src={siteConfig.images.hero}
                alt={t('imageAlt')}
                fill
                priority
                sizes="(min-width: 768px) 28rem, 80vw"
                className="object-cover"
              />
            </div>
            <p className="pt-3 pb-1 text-center text-xs font-semibold tracking-[0.25em] text-ink-soft uppercase sm:text-sm">
              {t('sticker')}
            </p>
          </div>

          <Hanko className="absolute -right-4 -bottom-5 h-14 w-14 -rotate-6 text-lg sm:-right-7 sm:-bottom-7 sm:h-[4.5rem] sm:w-[4.5rem] sm:text-2xl" />
        </div>
      </div>
    </section>
  );
}
