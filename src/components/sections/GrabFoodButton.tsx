'use client';

import { useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';
import { siteConfig } from '@/config/site';
import { buildGrabLinks, openGrab } from '@/lib/grab';
import { BikeIcon } from '@/components/ui/icons';

const { merchantId, webUrl, webUrlIsStorePage } = siteConfig.delivery.grabfood;
const links = buildGrabLinks(merchantId, webUrl);

function handleClick(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  openGrab(links, {
    userAgent: navigator.userAgent,
    isTouchDevice: window.matchMedia('(pointer: coarse)').matches,
    navigate: (url) => {
      window.location.href = url;
    },
    openNewTab: (url) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    isPageVisible: () => document.visibilityState === 'visible',
    setTimeout: (fn, ms) => window.setTimeout(fn, ms),
    onHidden: (fn) => {
      const handler = () => {
        if (document.visibilityState === 'hidden') fn();
      };
      document.addEventListener('visibilitychange', handler, { once: true });
      window.addEventListener('pagehide', fn, { once: true });
    }
  });
}

/**
 * Thẻ lớn "Đặt món trên GrabFood" (lựa chọn chính trong khối Đặt món).
 * Điện thoại: mở app Grab tới trang quán (chưa cài app thì chuyển sang GrabFood web).
 * Máy tính: mở GrabFood web ở tab mới. Logic chi tiết ở src/lib/grab.ts.
 */
export function GrabFoodButton() {
  const t = useTranslations('location');

  return (
    // href là link web để vẫn dùng được khi JS chưa chạy, hoặc khi mở bằng chuột giữa / "mở tab mới"
    <a
      href={links.webUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      data-testid="grabfood-button"
      data-merchant-id={merchantId}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-[#00B14F] p-6 text-white shadow-soft ring-1 ring-matcha-900/10 transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift motion-reduce:transition-none sm:p-8"
    >
      {/* vòng tròn trang trí */}
      <span
        aria-hidden
        className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10"
      />
      <span
        aria-hidden
        className="absolute -right-6 -bottom-20 h-40 w-40 rounded-full bg-white/10"
      />

      <span className="relative flex items-center justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#00B14F] transition-transform duration-300 group-hover:-rotate-12 motion-reduce:transition-none">
          <BikeIcon width={30} height={30} strokeWidth={2} />
        </span>
        <span className="rounded-full bg-white/20 px-3 py-1 font-display text-xs font-bold tracking-wider uppercase">
          {t('recommended')}
        </span>
      </span>

      <span className="relative mt-6 block font-display text-3xl leading-tight font-extrabold sm:text-4xl">
        {t('orderGrab')}
      </span>
      <span className="relative mt-2 block text-sm text-white/85 sm:text-base">
        {t('grabDesc')}
      </span>

      <span className="relative mt-auto flex items-end justify-between gap-4 pt-6">
        <span className="text-xs text-white/75">
          {webUrlIsStorePage
            ? t('grabHintApp')
            : t('grabHint', { name: siteConfig.shortName })}
        </span>
        <span
          aria-hidden
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-xl font-bold text-[#00B14F] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
        >
          ↗
        </span>
      </span>
    </a>
  );
}
