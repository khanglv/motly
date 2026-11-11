'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { cmsFetch } from '../api';
import { Button, FormError, PageHeader, TextInput, useToast } from '../ui';

export function AccountAdmin() {
  const toast = useToast();
  const me = useQuery({ queryKey: ['cms', 'me'], queryFn: () => cmsFetch<{ admin: { email: string } }>('/auth/me') });
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [localError, setLocalError] = useState<string | null>(null);

  const change = useMutation({
    mutationFn: () =>
      cmsFetch('/auth/password', {
        method: 'POST',
        body: { currentPassword: form.currentPassword, newPassword: form.newPassword }
      }),
    onSuccess: () => {
      toast('Đã đổi mật khẩu');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    }
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (form.newPassword !== form.confirm) return setLocalError('Mật khẩu nhập lại không khớp');
    change.mutate();
  }

  return (
    <>
      <PageHeader title="Tài khoản" description={me.data ? `Đăng nhập bằng ${me.data.admin.email}` : undefined} />
      <form onSubmit={submit} className="max-w-md space-y-4 rounded-2xl bg-white p-5 ring-1 ring-ink/10">
        <h2 className="font-display text-xl font-bold">Đổi mật khẩu</h2>
        <TextInput
          label="Mật khẩu hiện tại"
          type="password"
          autoComplete="current-password"
          required
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        />
        <TextInput
          label="Mật khẩu mới"
          hint="Ít nhất 10 ký tự"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
        <TextInput
          label="Nhập lại mật khẩu mới"
          type="password"
          autoComplete="new-password"
          required
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        <FormError message={localError ?? change.error?.message ?? null} />
        <Button type="submit" disabled={change.isPending}>
          {change.isPending ? 'Đang lưu…' : 'Đổi mật khẩu'}
        </Button>
      </form>
    </>
  );
}
