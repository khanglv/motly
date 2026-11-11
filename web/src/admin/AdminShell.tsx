'use client';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import { cmsFetch, CmsApiError } from './api';
import { Button } from './ui';

const NAV = [
  { href: '/admin/menu', label: 'Menu' },
  { href: '/admin/featured', label: 'Món nổi bật' },
  { href: '/admin/gallery', label: 'Hình ảnh' },
  { href: '/admin/reviews', label: 'Đánh giá' },
  { href: '/admin/settings', label: 'Thông tin quán' },
  { href: '/admin/account', label: 'Tài khoản' }
];

/** Khung trang CMS: kiểm tra đăng nhập, thanh điều hướng, nút đăng xuất */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const me = useQuery({
    queryKey: ['cms', 'me'],
    queryFn: () => cmsFetch<{ admin: { email: string } }>('/auth/me')
  });

  const unauthorized = me.error instanceof CmsApiError && me.error.status === 401;
  useEffect(() => {
    if (unauthorized) router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [unauthorized, pathname, router]);

  async function logout() {
    await cmsFetch('/auth/logout', { method: 'POST' }).catch(() => undefined);
    router.replace('/admin/login');
  }

  if (me.isPending || unauthorized) {
    return <p className="grid min-h-screen place-items-center text-ink-soft">Đang tải…</p>;
  }
  if (me.isError) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <p className="font-semibold text-red-800">{me.error.message}</p>
          <p className="mt-2 text-sm text-ink-soft">
            API free có thể đang khởi động lại (30–50 giây). Thử tải lại trang.
          </p>
          <Button className="mt-4" onClick={() => void me.refetch()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-ink/10 bg-paper lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:flex-col lg:items-start">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src={siteConfig.images.logo}
              alt=""
              width={siteConfig.images.logoSize.width}
              height={siteConfig.images.logoSize.height}
              className="h-9 w-auto"
            />
            <span className="font-display text-lg font-bold">CMS {siteConfig.shortName}</span>
          </Link>
          <a
            href="/vi"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-matcha-700 hover:underline"
          >
            Xem website ↗
          </a>
        </div>
        <nav aria-label="CMS" className="overflow-x-auto px-3 pb-3">
          <ul className="flex gap-1 lg:flex-col">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={clsx(
                      'block rounded-xl px-3 py-2 text-sm font-semibold whitespace-nowrap',
                      active ? 'bg-matcha-700 text-cream' : 'text-ink-soft hover:bg-matcha-100 hover:text-ink'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden px-5 py-4 text-xs text-ink-soft lg:absolute lg:bottom-0 lg:block">
          <p className="truncate">{me.data.admin.email}</p>
          <button type="button" onClick={() => void logout()} className="mt-1 font-semibold text-red-700 hover:underline">
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="px-4 py-6 sm:px-8 sm:py-8">
        <div className="mb-4 flex justify-end lg:hidden">
          <button type="button" onClick={() => void logout()} className="text-xs font-semibold text-red-700">
            Đăng xuất
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
