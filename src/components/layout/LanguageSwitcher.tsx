'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import clsx from 'clsx';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/types';
import { ChevronDownIcon, GlobeIcon } from '@/components/ui/icons';

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (next: Locale) => {
    if (next === locale) return;
    // Giữ nguyên vị trí section (hash) khi đổi ngôn ngữ
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    startTransition(() => {
      router.replace(`${pathname}${hash}`, { locale: next, scroll: false });
    });
  };

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className={clsx(
          // Màu chữ/nền do nơi dùng truyền vào qua className (header đang dùng nền xanh đậm)
          'btn gap-1.5 px-3 py-2 hover:translate-y-0',
          isPending && 'opacity-60',
          className
        )}
      >
        <GlobeIcon width={18} height={18} />
        {/* Tên accessible bắt đầu bằng chữ hiển thị ("VI") để khớp với điều khiển bằng giọng nói */}
        <span className="uppercase">{locale}</span>
        <span className="sr-only">{` – ${t('change', { current: t(locale) })}`}</span>
        <ChevronDownIcon width={14} height={14} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-40 rounded-2xl border border-matcha-100 bg-cream p-1.5 shadow-soft"
        >
          <DropdownMenu.Label className="px-3 py-1.5 text-xs text-ink-soft">
            {t('label')}
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={locale}
            onValueChange={(v) => changeLocale(v as Locale)}
          >
            {routing.locales.map((l) => (
              <DropdownMenu.RadioItem
                key={l}
                value={l}
                lang={l}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2 text-sm text-ink outline-none select-none data-[highlighted]:bg-matcha-100 data-[state=checked]:font-medium data-[state=checked]:text-matcha-900"
              >
                {t(l)}
                <DropdownMenu.ItemIndicator>
                  <span className="block h-1.5 w-1.5 rounded-full bg-matcha-700" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
