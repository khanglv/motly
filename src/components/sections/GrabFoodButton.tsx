'use client';

import { useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';
import { siteConfig } from '@/config/site';
import { BikeIcon } from '@/components/ui/icons';

/**
 * Nút đặt món trên GrabFood.
 *
 * Link cửa hàng của Grab (r.grab.com / food.grab.com) là "universal link / app link":
 * trên điện thoại có cài Grab, hệ điều hành tự mở app Grab tới đúng trang quán;
 * chưa cài app thì mở bản web GrabFood.
 * Trên điện thoại, link được mở ngay trong tab hiện tại vì iOS/Android chỉ chuyển sang app
 * đáng tin cậy khi điều hướng trực tiếp; trên máy tính thì mở tab mới để khách không rời trang.
 */
export function GrabFoodButton() {
  const t = useTranslations('location');
  const merchantLink = siteConfig.delivery.grabfood;
  const href = merchantLink || siteConfig.delivery.grabfoodFallback;

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      e.preventDefault();
      window.location.href = href;
    }
  };

  return (
    <div className="w-full">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        data-testid="grabfood-button"
        className="btn w-full justify-between bg-[#00B14F] px-5 py-3.5 text-base text-white shadow-[0_10px_24px_-10px_rgb(0_177_79/0.9)] hover:bg-[#009A45] sm:w-auto sm:justify-center"
      >
        <span className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20">
            <BikeIcon width={18} height={18} strokeWidth={2} />
          </span>
          {t('orderGrab')}
        </span>
        <span aria-hidden className="text-lg">
          ↗
        </span>
      </a>
      {!merchantLink && <p className="mt-2 text-xs text-cream/70">{t('grabHint', { name: siteConfig.shortName })}</p>}
    </div>
  );
}
