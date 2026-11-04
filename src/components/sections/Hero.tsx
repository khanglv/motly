import Image from 'next/image';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/types';
import { ClockIcon, PhoneIcon } from '@/components/ui/icons';
import {
  Bubbles,
  Leaf,
  SpinningBadge,
  Squiggle,
  Waves
} from '@/components/ui/decor';
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
        'relative -mt-16 overflow-hidden bg-matcha-900 pt-16 text-cream sm:-mt-20 sm:pt-20'
      )}
    >
      {/* vầng sáng */}
      <span
        aria-hidden
        className={clsx(
          decor.glow,
          'top-[-10%] left-[-10%] h-[28rem] w-[28rem] bg-matcha-600/50'
        )}
      />
      <span
        aria-hidden
        className={clsx(
          decor.glow,
          'right-[-8%] bottom-[5%] h-[30rem] w-[30rem] bg-matcha-400/30'
        )}
      />
      <Bubbles />

      <div className="container-page relative grid items-center gap-14 pt-10 pb-36 md:grid-cols-[1.15fr_0.85fr] md:pt-16 md:pb-44">
        <div className="relative z-10">
          <p className="eyebrow bg-cream/10 text-matcha-200 ring-1 ring-cream/15 motion-safe:animate-fade-up">
            <Leaf className="h-3.5 w-3.5 text-matcha-400" />
            {t('eyebrow')}
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-5xl text-cream sm:text-6xl lg:text-7xl"
          >
            <Words text={t('title')} />
            <span className="relative mt-1 block text-matcha-400">
              <span className="relative inline-block">
                <Words text={t('titleHighlight')} start={titleWords} />
                <Squiggle className="text-matcha-300/70" />
              </span>
            </span>
          </h1>

          <p
            className="mt-7 max-w-lg text-base leading-relaxed text-cream/75 motion-safe:animate-fade-up sm:text-lg"
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
              className="btn-outline-light px-6 py-3.5 text-base"
            >
              <PhoneIcon width={18} height={18} />
              {t('ctaCall')}
            </a>
            <a
              href="#order"
              className="group inline-flex items-center gap-1.5 px-2 py-3 text-sm font-semibold text-matcha-200 hover:text-cream"
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
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 text-sm text-matcha-100 ring-1 ring-cream/15 motion-safe:animate-fade-up"
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

        {/* Ảnh hero trong khung "giọt matcha" biến hình */}
        <div className="relative mx-auto w-full max-w-sm md:max-w-md">
          <div
            aria-hidden
            className="absolute inset-0 translate-x-4 translate-y-5 rotate-6 bg-matcha-400 [border-radius:58%_42%_52%_48%/46%_56%_44%_54%] motion-safe:animate-blob"
          />
          <div className="relative aspect-[4/5] overflow-hidden bg-matcha-700 ring-4 ring-cream/90 [border-radius:58%_42%_52%_48%/46%_56%_44%_54%] motion-safe:animate-blob">
            <Image
              src={siteConfig.images.hero}
              alt={t('imageAlt')}
              fill
              priority
              sizes="(min-width: 768px) 28rem, 90vw"
              className="object-cover"
            />
          </div>

          {/* Huy hiệu chữ xoay với mặt gấu ở giữa */}
          <SpinningBadge
            text={t('badge')}
            className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-cream text-matcha-800 shadow-soft sm:-left-12 sm:h-40 sm:w-40"
          >
            <Image
              src="/icon.png"
              alt=""
              width={72}
              height={72}
              className="h-14 w-14 rounded-full sm:h-[4.5rem] sm:w-[4.5rem]"
            />
          </SpinningBadge>

          {/* Sticker nổi */}
          <span
            className="absolute top-6 -right-3 rounded-2xl bg-sakura px-4 py-2 font-display text-lg font-bold text-matcha-950 shadow-[4px_4px_0_0_var(--color-matcha-950)] motion-safe:animate-float sm:-right-8"
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
          <Leaf
            className="absolute -top-8 left-8 h-14 w-14 text-matcha-400 motion-safe:animate-float-slow"
            style={{ '--r0': '-20deg', '--r1': '-5deg' } as CSSProperties}
          />
          <span
            aria-hidden
            lang="ja"
            className="absolute -right-2 bottom-16 font-display text-5xl font-extrabold text-matcha-400/30 [writing-mode:vertical-rl] sm:-right-14 sm:text-6xl"
          >
            抹茶
          </span>
        </div>
      </div>

      <Waves className="bottom-0" />
    </section>
  );
}
