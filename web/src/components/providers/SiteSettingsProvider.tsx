'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { defaultSettings, type SiteSettings } from '@/config/settings';

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings);

/** Đưa thông tin quán (lấy từ CMS ở server) xuống các component chạy trên trình duyệt */
export function SiteSettingsProvider({
  settings,
  children
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
