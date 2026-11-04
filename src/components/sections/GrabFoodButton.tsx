'use client';

import { useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';
import { siteConfig } from '@/config/site';
import { buildGrabLinks, openGrab } from '@/lib/grab';
import { BikeIcon } from '@/components/ui/icons';

const { merchantId, webUrl, webUrlIsStorePage } = siteConfig.delivery.grabfood;
const links = buildGrabLinks(merchantId, webUrl);

/**
 * Nút đặt món trên GrabFood.
 * Điện thoại: mở app Grab tới trang quán (chưa cài app thì chuyển sang GrabFood web).
 * Máy tính: mở GrabFood web ở tab mới. Logic chi tiết ở src/lib/grab.ts.
 */
export function GrabFoodButton() {
  const t = useTranslations('location');

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
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
  };

  return (
    <div className="w-full">
      {/* href là link web để vẫn dùng được khi JS chưa chạy, hoặc khi mở bằng chuột giữa / "mở tab mới" */}
      <a
        href={links.webUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        data-testid="grabfood-button"
        data-merchant-id={merchantId}
        className="btn w-full justify-between bg-[#00B14F] px-5 py-3.5 text-base text-white shadow-[0_10px_24px_-10px_rgb(0_177_79/0.9)] hover:bg-[#009A45] sm:w-auto sm:justify-center"
      >
        <span className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/20">
            <BikeIcon width={18} height={18} strokeWidth={2} />
          </span>
          {t('orderGrab')}
        </span>
        <span aria-hidden className="text-lg">
          ↗
        </span>
      </a>
      <p className="mt-2 text-xs text-cream/70">
        {webUrlIsStorePage
          ? t('grabHintApp')
          : t('grabHint', { name: siteConfig.shortName })}
      </p>
    </div>
  );
}
