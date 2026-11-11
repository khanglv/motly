'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import type { SiteSettings } from '@/config/settings';
import { cmsFetch } from '../api';
import { Button, FormError, PageHeader, TextArea, TextInput, Toggle, useToast } from '../ui';

const KEY = ['cms', '/admin/settings'];

export function SettingsAdmin() {
  const settings = useQuery({ queryKey: KEY, queryFn: () => cmsFetch<SiteSettings>('/admin/settings') });
  return (
    <>
      <PageHeader
        title="Thông tin quán"
        description="Hiển thị ở đầu trang, khối Đặt món, chân trang, bản đồ và dữ liệu cho Google."
      />
      {settings.isPending && <p className="text-ink-soft">Đang tải…</p>}
      {settings.isError && <FormError message={settings.error.message} />}
      {settings.data && <SettingsForm initial={settings.data} />}
    </>
  );
}

const lines = (text: string) =>
  text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl bg-white p-5 ring-1 ring-ink/10">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function SettingsForm({ initial }: { initial: SiteSettings }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [s, setS] = useState<SiteSettings>(initial);
  const [addr, setAddr] = useState({ vi: initial.address.lines.vi.join('\n'), en: initial.address.lines.en.join('\n') });

  const save = useMutation({
    mutationFn: (body: SiteSettings) => cmsFetch<SiteSettings>('/admin/settings', { method: 'PUT', body }),
    onSuccess: (data) => {
      qc.setQueryData(KEY, data);
      toast('Đã lưu. Website cập nhật sau vài giây.');
    }
  });

  const patch = (fn: (draft: SiteSettings) => void) =>
    setS((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });

  function submit(e: FormEvent) {
    e.preventDefault();
    save.mutate({ ...s, address: { ...s.address, lines: { vi: lines(addr.vi), en: lines(addr.en) } } });
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5">
      <Section title="Liên hệ">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Số điện thoại (cho nút gọi)"
            hint="Dạng quốc tế, ví dụ +84388738680"
            required
            pattern="\+\d{8,15}"
            value={s.phone}
            onChange={(e) => patch((d) => void (d.phone = e.target.value.trim()))}
          />
          <TextInput
            label="Số điện thoại hiển thị"
            hint="Ví dụ 0388 738 680"
            required
            maxLength={30}
            value={s.phoneDisplay}
            onChange={(e) => patch((d) => void (d.phoneDisplay = e.target.value))}
          />
          <TextInput
            label="Trang Facebook"
            className="sm:col-span-2"
            type="url"
            placeholder="https://www.facebook.com/..."
            value={s.social.facebook}
            onChange={(e) => patch((d) => void (d.social.facebook = e.target.value.trim()))}
          />
        </div>
      </Section>

      <Section title="Giờ mở cửa (mọi ngày)">
        <div className="grid grid-cols-2 gap-4 sm:max-w-sm">
          <TextInput
            label="Mở cửa"
            type="time"
            required
            value={s.hours.opens}
            onChange={(e) => patch((d) => void (d.hours.opens = e.target.value))}
          />
          <TextInput
            label="Đóng cửa"
            type="time"
            required
            value={s.hours.closes}
            onChange={(e) => patch((d) => void (d.hours.closes = e.target.value))}
          />
        </div>
      </Section>

      <Section title="Địa chỉ">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Số nhà, đường" required value={s.address.street} onChange={(e) => patch((d) => void (d.address.street = e.target.value))} />
          <TextInput label="Phường" required value={s.address.ward} onChange={(e) => patch((d) => void (d.address.ward = e.target.value))} />
          <TextInput label="Quận" required value={s.address.district} onChange={(e) => patch((d) => void (d.address.district = e.target.value))} />
          <TextInput label="Thành phố" required value={s.address.city} onChange={(e) => patch((d) => void (d.address.city = e.target.value))} />
          <TextArea
            label="Địa chỉ hiển thị (Tiếng Việt)"
            hint="Mỗi dòng một hàng, tối đa 3 dòng"
            required
            value={addr.vi}
            onChange={(e) => setAddr({ ...addr, vi: e.target.value })}
          />
          <TextArea
            label="Địa chỉ hiển thị (English)"
            hint="Mỗi dòng một hàng, tối đa 3 dòng"
            required
            value={addr.en}
            onChange={(e) => setAddr({ ...addr, en: e.target.value })}
          />
          <TextInput
            label="Từ khoá tìm trên Google Maps"
            className="sm:col-span-2"
            hint="Dùng cho bản đồ và nút Chỉ đường. Thử dán vào Google Maps xem có ra đúng quán không."
            required
            value={s.address.mapQuery}
            onChange={(e) => patch((d) => void (d.address.mapQuery = e.target.value))}
          />
        </div>
      </Section>

      <Section title="Đặt món qua app">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Mã cửa hàng GrabFood"
            hint="Phần sau merchantIDs= trong link của quán"
            required
            value={s.delivery.grabfood.merchantId}
            onChange={(e) => patch((d) => void (d.delivery.grabfood.merchantId = e.target.value.trim()))}
          />
          <TextInput
            label="Link trang quán trên GrabFood"
            type="url"
            required
            value={s.delivery.grabfood.webUrl}
            onChange={(e) => patch((d) => void (d.delivery.grabfood.webUrl = e.target.value.trim()))}
          />
          <div className="sm:col-span-2">
            <Toggle
              label="Link trên là trang của quán (tắt nếu là trang GrabFood chung)"
              checked={s.delivery.grabfood.webUrlIsStorePage}
              onChange={(v) => patch((d) => void (d.delivery.grabfood.webUrlIsStorePage = v))}
            />
          </div>
          <TextInput
            label="Link ShopeeFood"
            className="sm:col-span-2"
            hint="Để trống thì ẩn nút ShopeeFood"
            type="url"
            value={s.delivery.shopeefood}
            onChange={(e) => patch((d) => void (d.delivery.shopeefood = e.target.value.trim()))}
          />
        </div>
      </Section>

      <FormError message={save.error?.message ?? null} />
      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" className="px-6 py-2.5 shadow-lift" disabled={save.isPending}>
          {save.isPending ? 'Đang lưu…' : 'Lưu thông tin quán'}
        </Button>
      </div>
    </form>
  );
}
