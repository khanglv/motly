import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { domMax, LazyMotion } from 'framer-motion';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';
import enMessages from '../messages/en.json';
import viMessages from '../messages/vi.json';
import type { Locale } from '@/types';

export const messages = { vi: viMessages, en: enMessages };

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity, staleTime: Infinity }
    }
  });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    locale = 'vi',
    queryClient = createTestQueryClient(),
    ...options
  }: { locale?: Locale; queryClient?: QueryClient } & Omit<
    RenderOptions,
    'wrapper'
  > = {}
) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider
      locale={locale}
      messages={messages[locale]}
      timeZone="Asia/Ho_Chi_Minh"
    >
      <QueryClientProvider client={queryClient}>
        <LazyMotion features={domMax} strict>
          {children}
        </LazyMotion>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
  return { queryClient, ...render(ui, { wrapper: Wrapper, ...options }) };
}

/** Mock fetch trả JSON theo URL */
export function mockFetch(
  handler: (url: URL) => { status?: number; body: unknown }
) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input), 'http://localhost');
    const { status = 200, body } = handler(url);
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  });
}
