import Image from 'next/image';
import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/types';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BagIcon, BikeIcon, ChairIcon } from '@/components/ui/icons';
import { Leaf } from '@/components/ui/decor';

// Thẻ hơi nghiêng như sticker dán, hover thì thẳng lại và nhấc lên
const FEATURES = [
  {
    key: 'takeaway',
    Icon: BagIcon,
    tone: 'bg-matcha-400 text-matcha-950',
    rotate: '-rotate-2'
  },
  {
    key: 'delivery',
    Icon: BikeIcon,
    tone: 'bg-matcha-800 text-cream',
    rotate: 'rotate-[1.5deg]'
  },
  {
    key: 'outdoor',
    Icon: ChairIcon,
    tone: 'bg-accent text-matcha-950',
    rotate: '-rotate-1'
  }
] as const;

const STEPS = ['sift', 'whisk', 'pour'] as const;

export async function About({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'about' });
  const tr = await getTranslations({ locale, namespace: 'ritual' });

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="section relative overflow-hidden"
    >
      <Leaf className="absolute top-24 -right-6 h-28 w-28 rotate-45 text-matcha-200" />

      <div className="container-page grid items-center gap-14 md:grid-cols-2">
        <Reveal className="relative order-2 md:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-soft ring-4 ring-cream">
            <Image
              src={siteConfig.images.about}
              alt={t('imageAlt')}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {/* Logo gấu như một sticker dán lên ảnh */}
          <div className="absolute -right-3 -bottom-10 w-44 -rotate-6 rounded-[2rem] bg-cream p-3 shadow-[6px_6px_0_0_var(--color-matcha-900)] transition-[rotate] duration-300 hover:rotate-0 sm:-right-8 sm:w-52 motion-reduce:transition-none">
            <Image
              src={siteConfig.images.logo}
              alt={siteConfig.name}
              width={siteConfig.images.logoSize.width}
              height={siteConfig.images.logoSize.height}
              sizes="13rem"
              className="h-auto w-full"
            />
          </div>
        </Reveal>

        <Reveal className="order-1 md:order-2" delay={0.1}>
          <SectionHeading
            id="about-title"
            eyebrow={t('eyebrow')}
            title={t('title')}
            align="left"
          />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>{t('p1')}</p>
            <p>{t('p2')}</p>
          </div>
        </Reveal>
      </div>

      <ul className="container-page mt-24 grid gap-5 sm:grid-cols-3">
        {FEATURES.map(({ key, Icon, tone, rotate }, i) => (
          <li key={key}>
            <Reveal delay={i * 0.1} className="h-full">
              <div
                className={clsx(
                  'group h-full rounded-card p-7 shadow-[5px_5px_0_0_var(--color-matcha-950)] transition-[rotate,translate] duration-300 hover:-translate-y-1.5 hover:rotate-0 motion-reduce:transition-none',
                  tone,
                  rotate
                )}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cream/90 text-matcha-800 transition-[rotate,scale] duration-300 group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none">
                  <Icon width={24} height={24} />
                </span>
                <h3 className="mt-5 text-2xl text-current">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed opacity-85">
                  {t(`features.${key}.desc`)}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      {/* Nghi thức pha matcha: 3 bước nối bằng đường nét đứt */}
      <div className="container-page mt-28">
        <Reveal>
          <SectionHeading eyebrow={tr('eyebrow')} title={tr('title')} />
        </Reveal>
        <ol className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
          <svg
            aria-hidden
            className="pointer-events-none absolute top-8 left-[16%] hidden h-6 w-[68%] text-matcha-400 sm:block"
            viewBox="0 0 600 24"
            preserveAspectRatio="none"
          >
            <path
              d="M0 12 Q 150 -8 300 12 T 600 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="10 10"
            />
          </svg>
          {STEPS.map((step, i) => (
            <li key={step} className="relative text-center">
              <Reveal delay={0.15 * i}>
                <span className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-matcha-900 font-display text-3xl font-extrabold text-matcha-400 shadow-soft ring-8 ring-cream">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-2xl">{tr(`steps.${step}.title`)}</h3>
                <p className="mx-auto mt-2 max-w-60 text-sm text-ink-soft">
                  {tr(`steps.${step}.desc`)}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
