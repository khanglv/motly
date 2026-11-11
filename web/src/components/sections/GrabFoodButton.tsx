'use client';

import { useTranslations } from 'next-intl';
import { useMemo, type MouseEvent } from 'react';
import { siteConfig } from '@/config/site';
import { buildGrabLinks, chooseGrabStrategy, type GrabLinks } from '@/lib/grab';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { BikeIcon } from '@/components/ui/icons';

function handleClick(e: MouseEvent<HTMLAnchorElement>, links: GrabLinks) {
  // Chuột giữa / Ctrl / Cmd + click: để trình duyệt tự mở tab mới như link thường
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
    return;

  const strategy = chooseGrabStrategy({
    userAgent: navigator.userAgent,
    isTouchDevice: window.matchMedia('(pointer: coarse)').matches
  });

  if (strategy === 'android-intent') {
    e.preventDefault();
    window.location.href = links.androidIntentUrl;
  } else if (strategy === 'web-new-tab') {
    e.preventDefault();
    window.open(links.webUrl, '_blank', 'noopener,noreferrer');
  }
  // 'native-link' (iPhone, iPad): không chặn, để Safari tự xử lý link của quán.
  // Đã cài Grab thì iOS mở app (Universal Link), chưa cài thì mở trang web của quán.
}

/**
 * Thẻ lớn "Đặt món trên GrabFood" (lựa chọn chính trong khối Đặt món).
 * Điện thoại: mở app Grab tới trang quán (chưa cài app thì chuyển sang GrabFood web).
 * Máy tính: mở GrabFood web ở tab mới. Logic chi tiết ở src/lib/grab.ts.
 */
export function GrabFoodButton() {
  const t = useTranslations('location');
  const { merchantId, webUrl, webUrlIsStorePage } = useSiteSettings().delivery.grabfood;
  const links = useMemo(() => buildGrabLinks(merchantId, webUrl), [merchantId, webUrl]);

  return (
    // href là link trang quán: dùng được khi JS chưa chạy, khi mở bằng chuột giữa / "mở tab mới",
    // và trên iPhone là Universal Link mở thẳng app Grab. Không đặt target="_blank" vì
    // một số trình duyệt trong app (Facebook, Zalo) bỏ qua Universal Link khi mở tab mới.
    <a
      href={links.webUrl}
      rel="noopener noreferrer"
      onClick={(e) => handleClick(e, links)}
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
