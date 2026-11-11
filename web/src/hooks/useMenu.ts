'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { apiFetch } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { ApiList, MenuFilter, MenuItem } from '@/types';

type MenuQueryKey = ReturnType<typeof queryKeys.menu>;

export function useMenu(category: MenuFilter) {
  const locale = useLocale();
  return useQuery<MenuItem[], Error, MenuItem[], MenuQueryKey>({
    queryKey: queryKeys.menu(locale, category),
    queryFn: ({ signal }) =>
      apiFetch<ApiList<MenuItem>>(
        '/api/menu',
        { locale, category },
        { signal }
      ).then((r) => r.data),
    // Giữ danh sách cũ trong lúc tải danh mục mới
    placeholderData: keepPreviousData
  });
}
