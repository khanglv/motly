import Image from 'next/image';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/types';
import { ClockIcon, PhoneIcon } from '@/components/ui/icons';
import { Leaf, Squiggle, Waves } from '@/components/ui/decor';
import { MatchaBowl } from './HeroBackdrop';
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
        'relative isolate overflow-hidden bg-surface text-on-surface'
      )}
    >

      <div className="container-page relative grid items-center gap-14 pt-12 pb-36 md:grid-cols-[1.15fr_0.85fr] md:pt-20 md:pb-44">
        <div className="relative z-10">
          <p className="eyebrow bg-white/40 text-on-surface-soft ring-1 ring-on-surface/10 motion-safe:animate-fade-up">
            <Leaf className="h-3.5 w-3.5 text-surface-accent" />
            {t('eyebrow')}
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-5xl text-on-surface sm:text-6xl lg:text-7xl"
          >
            <Words text={t('title')} />
            <span className="relative mt-1 block text-surface-accent">
              <span className="relative inline-block">
                <Words text={t('titleHighlight')} start={titleWords} />
                <Squiggle className="text-surface-accent/60" />
              </span>
            </span>
          </h1>

          <p
            className="mt-7 max-w-lg text-base leading-relaxed text-on-surface-soft motion-safe:animate-fade-up sm:text-lg"
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
              className="group inline-flex items-center gap-1.5 px-2 py-3 text-sm font-semibold text-on-surface-soft hover:text-on-surface"
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
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/40 px-4 py-2 text-sm text-on-surface-soft ring-1 ring-on-surface/10 motion-safe:animate-fade-up"
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

        {/* Ảnh hero trong khung cửa vòm của quán, bát matcha đặt phía trước */}
        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md">
          <div
            aria-hidden
            className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-full rounded-b-[2rem] bg-surface-deep sm:translate-x-6 sm:translate-y-6"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] bg-matcha-700 shadow-lift ring-8 ring-cream">
            <Image
              src={siteConfig.images.hero}
              alt={t('imageAlt')}
              fill
              priority
              sizes="(min-width: 768px) 28rem, 90vw"
              className="object-cover"
            />
          </div>

          <MatchaBowl className="absolute -bottom-10 -left-8 z-10 w-32 sm:-bottom-14 sm:-left-24 sm:w-44" />

          <span
            className="absolute top-10 -right-3 rounded-2xl bg-accent px-4 py-2 font-display text-lg font-bold text-matcha-950 shadow-soft motion-safe:animate-float sm:-right-8"
            style={
              {
                '--r0': '8deg',
                '--r1': '2deg',
                transform: 'rotate(6deg)'
              } as CSSProperties
            }
          >
            {t('sticker')}
          </span>
        </div>
      </div>

      <Waves className="bottom-0" />
    </section>
  );
}
