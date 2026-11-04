import clsx from 'clsx';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/types';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Bubbles } from '@/components/ui/decor';
import {
  BagIcon,
  ClockIcon,
  FacebookIcon,
  MapPinIcon,
  PhoneIcon
} from '@/components/ui/icons';
import decor from '@/styles/decor.module.scss';
import { GrabFoodButton } from './GrabFoodButton';

/** Thẻ lựa chọn đặt món phụ (gọi điện, Facebook, ShopeeFood) */
function OrderOption({
  href,
  icon,
  title,
  desc,
  external,
  tone
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  external?: boolean;
  tone: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={clsx(
        'group flex items-center gap-4 rounded-3xl p-5 shadow-[5px_5px_0_0_var(--color-matcha-950)] ring-2 ring-matcha-950 transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[6px_8px_0_0_var(--color-matcha-950)] motion-reduce:transition-none',
        tone
      )}
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-matcha-950 text-matcha-300 transition-transform duration-300 group-hover:-rotate-12 motion-reduce:transition-none">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-xl leading-tight font-bold">
          {title}
        </span>
        <span className="mt-0.5 block text-sm opacity-80">{desc}</span>
      </span>
      <span
        aria-hidden
        className="text-xl transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
      >
        →
      </span>
    </a>
  );
}

export async function Location({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'location' });
  const { address, hours, delivery, social, map } = siteConfig;

  return (
    <section
      id="location"
      aria-labelledby="order-title"
      className="section bg-matcha-50 pb-36"
    >
      <div className="container-page">
        {/* ===== Đặt món: phần chính của section ===== */}
        <Reveal>
          <div
            id="order"
            className={clsx(
              decor.grain,
              'relative overflow-hidden rounded-[2.5rem] bg-matcha-900 px-6 py-12 text-cream shadow-soft sm:px-12 sm:py-14'
            )}
          >
            <Bubbles />
            <span
              aria-hidden
              className={clsx(
                decor.glow,
                '-top-20 -left-20 h-80 w-80 bg-matcha-500/40'
              )}
            />

            <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <SectionHeading
                  id="order-title"
                  tone="dark"
                  align="left"
                  eyebrow={t('orderTitle')}
                  title={t('orderHeadline')}
                  subtitle={t('orderDesc')}
                />
                <ul className="mt-6 flex flex-wrap gap-2 text-sm">
                  <li className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3.5 py-1.5 ring-1 ring-cream/15">
                    <ClockIcon
                      width={16}
                      height={16}
                      className="text-matcha-400"
                    />
                    {hours.opens} – {hours.closes}
                  </li>
                  <li className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3.5 py-1.5 ring-1 ring-cream/15">
                    <BagIcon
                      width={16}
                      height={16}
                      className="text-matcha-400"
                    />
                    {t('pickupBadge')}
                  </li>
                </ul>
                <Image
                  src={siteConfig.images.logoLight}
                  alt=""
                  width={siteConfig.images.logoSize.width}
                  height={siteConfig.images.logoSize.height}
                  sizes="10rem"
                  className="mt-8 hidden h-auto w-40 -rotate-6 opacity-90 lg:block"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <GrabFoodButton />
                </div>
                <OrderOption
                  href={`tel:${siteConfig.phone}`}
                  icon={<PhoneIcon width={22} height={22} />}
                  title={t('call')}
                  desc={t('callDesc', { phone: siteConfig.phoneDisplay })}
                  tone="bg-matcha-400 text-matcha-950"
                />
                <OrderOption
                  href={social.facebook}
                  external
                  icon={<FacebookIcon width={22} height={22} />}
                  title={t('facebook')}
                  desc={t('facebookDesc')}
                  tone="bg-cream text-matcha-950"
                />
                {delivery.shopeefood && (
                  <div className="sm:col-span-2">
                    <OrderOption
                      href={delivery.shopeefood}
                      external
                      icon={<BagIcon width={22} height={22} />}
                      title={t('shopeefood')}
                      desc={t('shopeeDesc')}
                      tone="bg-[#EE4D2D] text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ===== Ghé quán: thông tin gọn + bản đồ nhỏ, để không lấn phần đặt món ===== */}
        <Reveal delay={0.1} className="mt-12">
          <div className="grid gap-6 rounded-[2rem] bg-cream p-5 ring-1 ring-matcha-100 sm:p-6 md:grid-cols-[1fr_minmax(0,22rem)] md:items-center lg:grid-cols-[1fr_26rem]">
            <div className="sm:px-2">
              <h3 className="font-display text-2xl text-matcha-900">
                {t('visitTitle')}
              </h3>
              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="flex items-center gap-2 font-semibold text-matcha-800">
                    <MapPinIcon width={16} height={16} />
                    {t('address')}
                  </dt>
                  <dd className="mt-1 text-ink-soft">
                    <address className="not-italic">
                      {address.lines[locale].map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 font-semibold text-matcha-800">
                    <ClockIcon width={16} height={16} />
                    {t('hours')}
                  </dt>
                  <dd className="mt-1 text-ink-soft">
                    {t('everyday')}:{' '}
                    <time dateTime={hours.opens}>{hours.opens}</time> –{' '}
                    <time dateTime={hours.closes}>{hours.closes}</time>
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 font-semibold text-matcha-800">
                    <PhoneIcon width={16} height={16} />
                    {t('phone')}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="text-ink-soft hover:text-matcha-900 hover:underline"
                    >
                      {siteConfig.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </dl>
              <a
                href={map.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-5 px-5 py-2.5"
              >
                <MapPinIcon width={16} height={16} />
                {t('directions')}
              </a>
            </div>

            {/* Bản đồ nhỏ, hơi nhạt màu; rê chuột vào thì hiện màu đầy đủ */}
            <div className="h-48 overflow-hidden rounded-2xl ring-1 ring-matcha-100 sm:h-56">
              <iframe
                title={t('mapTitle')}
                src={map.embedUrl(locale)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0 opacity-90 grayscale-[60%] transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
