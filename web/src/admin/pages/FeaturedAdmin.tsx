'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { cmsFetch, type AdminFeatured, type AdminMenuItem, type Localized } from '../api';
import { ImageField } from '../ImageField';
import {
  Button,
  Field,
  FormError,
  inputClass,
  LocalizedInput,
  Modal,
  PageHeader,
  TextInput,
  Toggle
} from '../ui';
import { useResource } from '../useResource';

const THEMES = [
  { id: 'matcha', label: 'Xanh matcha' },
  { id: 'sakura', label: 'Hồng sakura' },
  { id: 'cream', label: 'Kem sữa' }
] as const;

type Draft = Omit<AdminFeatured, 'id'> & { id?: string };

const emptyDraft = (menuItemId: string, order: number): Draft => ({
  menuItemId,
  headline: { vi: '', en: '' },
  story: { vi: '', en: '' },
  highlights: { vi: [], en: [] },
  badge: null,
  image: null,
  theme: 'matcha',
  order,
  active: true,
  startsAt: null,
  endsAt: null
});

/** ISO → giá trị cho input datetime-local (giờ máy) và ngược lại */
const toLocalInput = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};
const fromLocalInput = (value: string) => (value ? new Date(value).toISOString() : null);

function status(f: AdminFeatured, now = Date.now()) {
  if (!f.active) return { label: 'Đang ẩn', tone: 'bg-ink/10 text-ink-soft' };
  if (f.startsAt && new Date(f.startsAt).getTime() > now) return { label: 'Chưa tới ngày', tone: 'bg-amber-100 text-amber-900' };
  if (f.endsAt && new Date(f.endsAt).getTime() < now) return { label: 'Đã hết hạn', tone: 'bg-red-50 text-red-800' };
  return { label: 'Đang hiển thị', tone: 'bg-matcha-100 text-matcha-900' };
}

export function FeaturedAdmin() {
  const { list, save, toggle, confirmRemove } = useResource<AdminFeatured>('/admin/featured');
  const menu = useQuery({ queryKey: ['cms', '/admin/menu'], queryFn: () => cmsFetch<AdminMenuItem[]>('/admin/menu') });
  const [editing, setEditing] = useState<Draft | null>(null);

  const items = list.data ?? [];
  const menuName = (id: string) => menu.data?.find((m) => m.id === id)?.name.vi ?? id;

  return (
    <>
      <PageHeader
        title="Món nổi bật"
        description="Khối “Một Ly gợi ý cho bạn”. Mỗi mục gắn với một món trong menu (giá, tên lấy từ menu). Có thể hẹn ngày bắt đầu và kết thúc."
        action={
          <Button
            disabled={!menu.data?.length}
            onClick={() => setEditing(emptyDraft(menu.data?.[0]?.id ?? '', items.length + 1))}
          >
            + Thêm mục
          </Button>
        }
      />
      {list.isPending && <p className="text-ink-soft">Đang tải…</p>}
      {list.isError && <FormError message={list.error.message} />}

      <ul className="divide-y divide-ink/10 overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
        {items.map((f) => {
          const s = status(f);
          return (
            <li key={f.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="w-8 text-center text-sm font-bold text-ink-soft">{f.order}</span>
              <div className="min-w-48 flex-1">
                <p className="font-semibold">{f.headline.vi}</p>
                <p className="text-xs text-ink-soft">Món: {menuName(f.menuItemId)}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.tone}`}>{s.label}</span>
              <Toggle label="Bật" checked={f.active} onChange={(active) => toggle.mutate({ id: f.id, active })} />
              <Button variant="ghost" onClick={() => setEditing(f)}>
                Sửa
              </Button>
              <Button variant="danger" onClick={() => confirmRemove(f.id, f.headline.vi)}>
                Xoá
              </Button>
            </li>
          );
        })}
        {list.isSuccess && items.length === 0 && <li className="px-4 py-6 text-sm text-ink-soft">Chưa có mục nào.</li>}
      </ul>

      {editing && (
        <FeaturedForm
          key={editing.id ?? 'new'}
          initial={editing}
          menu={menu.data ?? []}
          pending={save.isPending}
          error={save.error?.message ?? null}
          onClose={() => {
            save.reset();
            setEditing(null);
          }}
          onSubmit={(d) => {
            const body = {
              menuItemId: d.menuItemId,
              headline: d.headline,
              story: d.story,
              highlights: d.highlights,
              badge: d.badge,
              image: d.image,
              theme: d.theme,
              order: d.order,
              active: d.active,
              startsAt: d.startsAt,
              endsAt: d.endsAt
            };
            save.mutate({ id: d.id, body }, { onSuccess: () => setEditing(null) });
          }}
        />
      )}
    </>
  );
}

const splitLines = (text: string) =>
  text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

function FeaturedForm({
  initial,
  menu,
  pending,
  error,
  onClose,
  onSubmit
}: {
  initial: Draft;
  menu: AdminMenuItem[];
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (d: Draft) => void;
}) {
  const [d, setD] = useState<Draft>(initial);
  const [highlights, setHighlights] = useState<Localized>({
    vi: initial.highlights.vi.join('\n'),
    en: initial.highlights.en.join('\n')
  });
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setD((prev) => ({ ...prev, [key]: value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ ...d, highlights: { vi: splitLines(highlights.vi), en: splitLines(highlights.en) } });
  }

  return (
    <Modal open onOpenChange={(o) => !o && onClose()} title={initial.id ? 'Sửa món nổi bật' : 'Thêm món nổi bật'} wide>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Món trong menu" className="sm:col-span-2">
            {(id) => (
              <select id={id} className={inputClass} value={d.menuItemId} onChange={(e) => set('menuItemId', e.target.value)}>
                {menu.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name.vi}
                    {m.active ? '' : ' (đang ẩn)'}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <TextInput
            label="Thứ tự"
            hint="Số nhỏ hiện trước"
            type="number"
            min={0}
            value={d.order}
            onChange={(e) => set('order', Number(e.target.value))}
          />
        </div>
        <LocalizedInput label="Tiêu đề quảng bá" maxLength={160} value={d.headline} onChange={(v) => set('headline', v)} />
        <LocalizedInput label="Câu chuyện" multiline maxLength={2000} value={d.story} onChange={(v) => set('story', v)} />
        <LocalizedInput
          label="Điểm nổi bật (mỗi dòng một ý, tối đa 8)"
          multiline
          required={false}
          value={highlights}
          onChange={setHighlights}
        />
        <div className="space-y-2">
          <Toggle label="Có nhãn góc ảnh" checked={d.badge !== null} onChange={(on) => set('badge', on ? { vi: '', en: '' } : null)} />
          {d.badge && <LocalizedInput label="Nhãn (ví dụ: Mới, Giới hạn)" maxLength={160} value={d.badge} onChange={(v) => set('badge', v)} />}
        </div>
        <ImageField
          label="Ảnh riêng (không bắt buộc)"
          required={false}
          hint="Để trống thì dùng ảnh của món"
          value={d.image ?? ''}
          onChange={({ url }) => set('image', url || null)}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Màu nền">
            {(id) => (
              <select id={id} className={inputClass} value={d.theme} onChange={(e) => set('theme', e.target.value as Draft['theme'])}>
                {THEMES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <TextInput
            label="Bắt đầu hiển thị"
            hint="Trống = ngay"
            type="datetime-local"
            value={toLocalInput(d.startsAt)}
            onChange={(e) => set('startsAt', fromLocalInput(e.target.value))}
          />
          <TextInput
            label="Kết thúc"
            hint="Trống = không giới hạn"
            type="datetime-local"
            value={toLocalInput(d.endsAt)}
            onChange={(e) => set('endsAt', fromLocalInput(e.target.value))}
          />
        </div>
        <Toggle label="Bật" checked={d.active} onChange={(v) => set('active', v)} />
        <FormError message={error} />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Huỷ
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? 'Đang lưu…' : 'Lưu'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
