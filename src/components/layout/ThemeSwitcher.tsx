'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { siteConfig } from '@/config/site';
import { isThemeId, THEMES, type ThemeId } from '@/config/themes';

const STORAGE_KEY = 'motly-theme-preview';

/**
 * Bộ chọn tông màu để xem trước (chỉ hiện khi dev hoặc NEXT_PUBLIC_THEME_PREVIEW=1).
 * Chỉ đổi giao diện trên trình duyệt này; muốn áp dụng thật thì sửa `theme` trong src/config/site.ts.
 */
export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>(siteConfig.theme);

  // Khôi phục tông đang xem trước sau khi tải lại trang
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isThemeId(saved)) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (theme === siteConfig.theme) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className="fixed bottom-4 left-4 z-40 font-sans sm:bottom-6 sm:left-6">
      {open && (
        <div
          id="theme-switcher-panel"
          className="mb-3 w-64 rounded-3xl bg-cream p-3 text-ink shadow-soft ring-2 ring-matcha-900"
        >
          <p className="px-2 pt-1 pb-2 text-xs font-semibold tracking-wider text-ink-soft uppercase">
            Tông màu (xem trước)
          </p>
          <ul className="space-y-1" role="radiogroup" aria-label="Tông màu chủ đạo">
            {THEMES.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={theme === t.id}
                  onClick={() => setTheme(t.id)}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left text-sm transition-colors',
                    theme === t.id ? 'bg-matcha-100 font-semibold text-matcha-900' : 'hover:bg-cream-dark'
                  )}
                >
                  <span className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
                    {t.swatch.map((c) => (
                      <span key={c} className="h-6 w-4" style={{ background: c }} />
                    ))}
                  </span>
                  <span className="flex-1">{t.name}</span>
                  {t.id === siteConfig.theme && <span className="text-[10px] text-ink-soft">đang dùng</span>}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 px-2 text-[11px] leading-snug text-ink-soft">
            Áp dụng thật: đặt <code className="font-semibold">theme: &apos;{theme}&apos;</code> trong{' '}
            <code>src/config/site.ts</code>.
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="theme-switcher-panel"
        className="flex h-12 items-center gap-2 rounded-full bg-cream px-3 text-sm font-semibold text-matcha-900 shadow-soft ring-2 ring-matcha-900"
      >
        <span className="flex overflow-hidden rounded-full">
          {THEMES.find((t) => t.id === theme)!.swatch.map((c) => (
            <span key={c} className="h-6 w-3" style={{ background: c }} />
          ))}
        </span>
        Tông màu
      </button>
    </div>
  );
}
