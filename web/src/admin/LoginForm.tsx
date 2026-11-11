'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { siteConfig } from '@/config/site';
import { cmsFetch, CmsApiError } from './api';
import { Button, FormError, TextInput } from './ui';

/** Chỉ cho chuyển tới trang trong /admin (tránh open redirect) */
const safeNext = (next: string | null) =>
  next && /^\/admin(\/[\w-]*)*$/.test(next) && next !== '/admin/login' ? next : '/admin';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await cmsFetch('/auth/login', { method: 'POST', body: { email, password } });
      router.replace(safeNext(params.get('next')));
    } catch (err) {
      setError(
        err instanceof CmsApiError && err.status === 429
          ? 'Thử sai quá nhiều lần. Đợi 1 phút rồi thử lại.'
          : err instanceof Error
            ? err.message
            : 'Đăng nhập thất bại'
      );
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-7 shadow-lift ring-1 ring-ink/5"
    >
      <div className="flex items-center gap-3">
        <Image
          src={siteConfig.images.logo}
          alt=""
          width={siteConfig.images.logoSize.width}
          height={siteConfig.images.logoSize.height}
          className="h-12 w-auto"
          priority
        />
        <div>
          <h1 className="font-display text-2xl font-bold">Quản lý nội dung</h1>
          <p className="text-sm text-ink-soft">{siteConfig.name}</p>
        </div>
      </div>
      <TextInput
        label="Email"
        type="email"
        autoComplete="username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextInput
        label="Mật khẩu"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FormError message={error} />
      <Button type="submit" className="w-full py-2.5" disabled={pending}>
        {pending ? 'Đang đăng nhập…' : 'Đăng nhập'}
      </Button>
    </form>
  );
}
