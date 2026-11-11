'use client';

import { useState, type FormEvent } from 'react';
import { type AdminMenuItem } from '../api';
import { ImageField } from '../ImageField';
import {
  Button,
  Field,
  FormError,
  formatVnd,
  inputClass,
  LocalizedInput,
  Modal,
  PageHeader,
  TextInput,
  Toggle
} from '../ui';
import { move, useResource } from '../useResource';

const CATEGORIES = [
  { id: 'matcha', label: 'Matcha' },
  { id: 'coffee', label: 'Cà phê' },
  { id: 'bakery', label: 'Bánh' }
] as const;

const TAGS = [
  { id: 'signature', label: 'Signature' },
  { id: 'best-seller', label: 'Bán chạy' },
  { id: 'new', label: 'Mới' }
] as const;

type Draft = Omit<AdminMenuItem, 'order'>;

const emptyDraft = (category: AdminMenuItem['category']): Draft => ({
  id: '',
  category,
  name: { vi: '', en: '' },
  description: { vi: '', en: '' },
  price: 0,
  image: '',
  tags: [],
  active: true
});

/** Tạo mã món từ tên tiếng Việt: "Matcha Kem Muối" → "matcha-kem-muoi" */
const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export function MenuAdmin() {
  const { list, save, toggle, reorder, confirmRemove } = useResource<AdminMenuItem>('/admin/menu');
  const [editing, setEditing] = useState<{ draft: Draft; isNew: boolean } | null>(null);

  const items = list.data ?? [];

  function moveItem(category: string, index: number, delta: -1 | 1) {
    const inCategory = items.filter((i) => i.category === category);
    const others = items.filter((i) => i.category !== category);
    reorder.mutate([...others, ...move(inCategory, index, delta)].map((i) => i.id));
  }

  return (
    <>
      <PageHeader
        title="Menu"
        description="Món hiển thị trong bảng menu. Tắt “Hiển thị” để ẩn món tạm thời mà không xoá."
        action={<Button onClick={() => setEditing({ draft: emptyDraft('matcha'), isNew: true })}>+ Thêm món</Button>}
      />
      {list.isPending && <p className="text-ink-soft">Đang tải…</p>}
      {list.isError && <FormError message={list.error.message} />}

      <div className="space-y-8">
        {CATEGORIES.map((cat) => {
          const rows = items.filter((i) => i.category === cat.id);
          return (
            <section key={cat.id}>
              <h2 className="mb-3 font-display text-xl font-bold">
                {cat.label} <span className="text-sm font-normal text-ink-soft">({rows.length})</span>
              </h2>
              <ul className="divide-y divide-ink/10 overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
                {rows.map((item, i) => (
                  <li key={item.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover ring-1 ring-ink/10" />
                    <div className="min-w-40 flex-1">
                      <p className="font-semibold">{item.name.vi}</p>
                      <p className="text-xs text-ink-soft">
                        {formatVnd(item.price)} · {item.id}
                      </p>
                    </div>
                    <Toggle
                      label="Hiển thị"
                      checked={item.active}
                      onChange={(active) => toggle.mutate({ id: item.id, active })}
                    />
                    <div className="flex items-center">
                      <Button variant="ghost" aria-label="Lên" disabled={i === 0} onClick={() => moveItem(cat.id, i, -1)}>
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        aria-label="Xuống"
                        disabled={i === rows.length - 1}
                        onClick={() => moveItem(cat.id, i, 1)}
                      >
                        ↓
                      </Button>
                      <Button variant="ghost" onClick={() => setEditing({ draft: item, isNew: false })}>
                        Sửa
                      </Button>
                      <Button variant="danger" onClick={() => confirmRemove(item.id, item.name.vi)}>
                        Xoá
                      </Button>
                    </div>
                  </li>
                ))}
                {rows.length === 0 && <li className="px-4 py-6 text-sm text-ink-soft">Chưa có món.</li>}
              </ul>
            </section>
          );
        })}
      </div>

      {editing && (
        <MenuForm
          key={editing.draft.id || 'new'}
          initial={editing.draft}
          isNew={editing.isNew}
          pending={save.isPending}
          error={save.error?.message ?? null}
          onClose={() => {
            save.reset();
            setEditing(null);
          }}
          onSubmit={(d) => {
            // Chỉ gửi các trường API cho phép
            const body = {
              category: d.category,
              name: d.name,
              description: d.description,
              price: d.price,
              image: d.image,
              tags: d.tags,
              active: d.active
            };
            save.mutate(editing.isNew ? { body: { id: d.id, ...body } } : { id: d.id, body }, {
              onSuccess: () => setEditing(null)
            });
          }}
        />
      )}
    </>
  );
}

function MenuForm({
  initial,
  isNew,
  pending,
  error,
  onClose,
  onSubmit
}: {
  initial: Draft;
  isNew: boolean;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (draft: Draft) => void;
}) {
  const [d, setD] = useState<Draft>(initial);
  const [idTouched, setIdTouched] = useState(!isNew);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setD((prev) => ({ ...prev, [key]: value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit(d);
  }

  return (
    <Modal open onOpenChange={(o) => !o && onClose()} title={isNew ? 'Thêm món' : `Sửa: ${initial.name.vi}`} wide>
      <form onSubmit={submit} className="space-y-4">
        <LocalizedInput
          label="Tên món"
          maxLength={160}
          value={d.name}
          onChange={(name) =>
            setD((prev) => ({ ...prev, name, id: idTouched ? prev.id : slugify(name.vi) }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextInput
            label="Mã món"
            hint={isNew ? 'Tự tạo từ tên, không đổi được sau khi lưu' : 'Không đổi được'}
            value={d.id}
            disabled={!isNew}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            onChange={(e) => {
              setIdTouched(true);
              set('id', e.target.value);
            }}
          />
          <Field label="Nhóm">
            {(id) => (
              <select
                id={id}
                className={inputClass}
                value={d.category}
                onChange={(e) => set('category', e.target.value as Draft['category'])}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <TextInput
            label="Giá (VND)"
            type="number"
            min={0}
            step={1000}
            required
            value={d.price}
            onChange={(e) => set('price', Number(e.target.value))}
          />
        </div>
        <LocalizedInput label="Mô tả" multiline maxLength={2000} value={d.description} onChange={(v) => set('description', v)} />
        <ImageField label="Ảnh món" value={d.image} onChange={({ url }) => set('image', url)} />
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Nhãn</legend>
          <div className="flex flex-wrap gap-4">
            {TAGS.map((tag) => (
              <label key={tag.id} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-matcha-700"
                  checked={d.tags.includes(tag.id)}
                  onChange={(e) =>
                    set('tags', e.target.checked ? [...d.tags, tag.id] : d.tags.filter((t) => t !== tag.id))
                  }
                />
                {tag.label}
              </label>
            ))}
          </div>
        </fieldset>
        <Toggle label="Hiển thị trên website" checked={d.active} onChange={(v) => set('active', v)} />
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
