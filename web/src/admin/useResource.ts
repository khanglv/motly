'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cmsFetch } from './api';
import { useToast } from './ui';

/** Danh sách + thêm/sửa/xoá cho một loại nội dung trong CMS (ví dụ path = "/admin/menu") */
export function useResource<T extends { id: string }>(path: string) {
  const qc = useQueryClient();
  const toast = useToast();
  const key = ['cms', path];
  const invalidate = () => qc.invalidateQueries({ queryKey: key });

  const list = useQuery({ queryKey: key, queryFn: () => cmsFetch<T[]>(path) });

  const save = useMutation({
    mutationFn: ({ id, body }: { id?: string; body: unknown }) =>
      id
        ? cmsFetch<T>(`${path}/${encodeURIComponent(id)}`, { method: 'PATCH', body })
        : cmsFetch<T>(path, { method: 'POST', body }),
    onSuccess: () => {
      toast('Đã lưu. Website cập nhật sau vài giây.');
      void invalidate();
    }
  });

  const remove = useMutation({
    mutationFn: (id: string) => cmsFetch(`${path}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast('Đã xoá');
      void invalidate();
    },
    onError: (e) => toast(e.message, 'error')
  });

  /** Bật/tắt hiển thị nhanh từ danh sách */
  const toggle = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      cmsFetch(`${path}/${encodeURIComponent(id)}`, { method: 'PATCH', body: { active } }),
    onSuccess: () => void invalidate(),
    onError: (e) => toast(e.message, 'error')
  });

  const reorder = useMutation({
    mutationFn: (ids: string[]) => cmsFetch(`${path}/order`, { method: 'PUT', body: { ids } }),
    onSuccess: () => void invalidate(),
    onError: (e) => toast(e.message, 'error')
  });

  const confirmRemove = (id: string, label: string) => {
    if (window.confirm(`Xoá "${label}"? Không hoàn tác được.`)) remove.mutate(id);
  };

  return { list, save, remove, toggle, reorder, confirmRemove };
}

/** Đổi vị trí phần tử trong mảng (nút ↑ ↓) */
export function move<T>(list: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
