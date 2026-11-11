'use client';

import { useState, type FormEvent } from 'react';
import type { AdminReview } from '../api';
import { Button, Field, FormError, inputClass, LocalizedInput, Modal, PageHeader, TextInput, Toggle } from '../ui';
import { useResource } from '../useResource';

type Draft = Omit<AdminReview, 'id'> & { id?: string };

const today = () => new Date().toISOString().slice(0, 10);
const emptyDraft = (): Draft => ({
  author: '',
  rating: 5,
  content: { vi: '', en: '' },
  date: today(),
  source: 'Google',
  active: true
});

export function ReviewsAdmin() {
  const { list, save, toggle, confirmRemove } = useResource<AdminReview>('/admin/reviews');
  const [editing, setEditing] = useState<Draft | null>(null);
  const items = list.data ?? [];

  return (
    <>
      <PageHeader
        title="Đánh giá"
        description="Chỉ đăng đánh giá thật của khách (có sự đồng ý). Website hiển thị theo ngày mới nhất."
        action={<Button onClick={() => setEditing(emptyDraft())}>+ Thêm đánh giá</Button>}
      />
      {list.isPending && <p className="text-ink-soft">Đang tải…</p>}
      {list.isError && <FormError message={list.error.message} />}

      <ul className="divide-y divide-ink/10 overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
        {items.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-48 flex-1">
              <p className="font-semibold">
                {r.author} <span className="text-amber-600">{'★'.repeat(r.rating)}</span>
              </p>
              <p className="line-clamp-1 text-sm text-ink-soft">{r.content.vi}</p>
              <p className="text-xs text-ink-soft">
                {r.source} · {r.date.slice(0, 10)}
              </p>
            </div>
            <Toggle label="Hiển thị" checked={r.active} onChange={(active) => toggle.mutate({ id: r.id, active })} />
            <Button variant="ghost" onClick={() => setEditing({ ...r, date: r.date.slice(0, 10) })}>
              Sửa
            </Button>
            <Button variant="danger" onClick={() => confirmRemove(r.id, r.author)}>
              Xoá
            </Button>
          </li>
        ))}
        {list.isSuccess && items.length === 0 && <li className="px-4 py-6 text-sm text-ink-soft">Chưa có đánh giá.</li>}
      </ul>

      {editing && (
        <ReviewForm
          key={editing.id ?? 'new'}
          initial={editing}
          pending={save.isPending}
          error={save.error?.message ?? null}
          onClose={() => {
            save.reset();
            setEditing(null);
          }}
          onSubmit={(d) =>
            save.mutate(
              {
                id: d.id,
                body: { author: d.author, rating: d.rating, content: d.content, date: d.date, source: d.source, active: d.active }
              },
              { onSuccess: () => setEditing(null) }
            )
          }
        />
      )}
    </>
  );
}

function ReviewForm({
  initial,
  pending,
  error,
  onClose,
  onSubmit
}: {
  initial: Draft;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (d: Draft) => void;
}) {
  const [d, setD] = useState<Draft>(initial);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(d);
  };

  return (
    <Modal open onOpenChange={(o) => !o && onClose()} title={initial.id ? 'Sửa đánh giá' : 'Thêm đánh giá'} wide>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-4">
          <TextInput
            label="Tên khách"
            className="sm:col-span-2"
            required
            maxLength={80}
            value={d.author}
            onChange={(e) => setD({ ...d, author: e.target.value })}
          />
          <Field label="Số sao">
            {(id) => (
              <select id={id} className={inputClass} value={d.rating} onChange={(e) => setD({ ...d, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} sao
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Nguồn">
            {(id) => (
              <select
                id={id}
                className={inputClass}
                value={d.source}
                onChange={(e) => setD({ ...d, source: e.target.value as Draft['source'] })}
              >
                <option value="Google">Google</option>
                <option value="Facebook">Facebook</option>
              </select>
            )}
          </Field>
        </div>
        <TextInput label="Ngày" type="date" required max={today()} value={d.date} onChange={(e) => setD({ ...d, date: e.target.value })} />
        <LocalizedInput label="Nội dung" multiline maxLength={2000} value={d.content} onChange={(content) => setD({ ...d, content })} />
        <Toggle label="Hiển thị" checked={d.active} onChange={(active) => setD({ ...d, active })} />
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
