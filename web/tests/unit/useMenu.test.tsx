import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTestQueryClient, messages, mockFetch } from '../utils';
import { useMenu } from '@/hooks/useMenu';
import { ApiError } from '@/lib/api';

function wrapper(locale: 'vi' | 'en') {
  const client = createTestQueryClient();
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </NextIntlClientProvider>
    );
  }
  return Wrapper;
}

describe('useMenu', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('gọi /api/menu với locale và category, trả về mảng món', async () => {
    const fetchMock = mockFetch(() => ({
      body: { data: [{ id: 'a', name: 'A' }] }
    }));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useMenu('coffee'), {
      wrapper: wrapper('en')
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: 'a', name: 'A' }]);
    const url = new URL(String(fetchMock.mock.calls[0][0]), 'http://localhost');
    expect(url.pathname).toBe('/api/menu');
    expect(url.searchParams.get('locale')).toBe('en');
    expect(url.searchParams.get('category')).toBe('coffee');
  });

  it('báo lỗi ApiError khi API trả lỗi', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch(() => ({ status: 400, body: { error: 'Invalid category' } }))
    );

    const { result } = renderHook(() => useMenu('all'), {
      wrapper: wrapper('vi')
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error?.message).toBe('Invalid category');
  });
});
