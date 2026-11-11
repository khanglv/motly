'use client';

import { useState, type FormEvent } from 'react';
import type { AdminGalleryImage } from '../api';
import { ImageField, readImageSize } from '../ImageField';
import { Button, FormError, LocalizedInput, Modal, PageHeader, TextInput, Toggle } from '../ui';
import { move, useResource } from '../useResource';

type Draft = Omit<AdminGalleryImage, 'id' | 'order'> & { id?: string };

const emptyDraft = (): Draft => ({ src: '', alt: { vi: '', en: '' }, width: 0, height: 0, active: true });

export function GalleryAdmin() {
  const { list, save, toggle, reorder, confirmRemove } = useResource<AdminGalleryImage>('/admin/gallery');
  const [editing, setEditing] = useState<Draft | null>(null);
  const items = list.data ?? [];

  return (
    <>
      <PageHeader
        title="Hình ảnh"
        description="Ảnh trong mục “Hình ảnh” của website, theo thứ tự hiển thị. Mô tả ảnh dùng cho người khiếm thị và Google."
        action={<Button onClick={() => setEditing(emptyDraft())}>+ Thêm ảnh</Button>}
      />
      {list.isPending && <p className="text-ink-soft">Đang tải…</p>}
      {list.isError && <FormError message={list.error.message} />}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((img, i) => (
          <li key={img.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt="" className={`aspect-[4/3] w-full object-cover ${img.active ? '' : 'opacity-40'}`} />
            <div className="space-y-2 p-3">
              <p className="line-clamp-2 text-sm font-medium">{img.alt.vi}</p>
              <p className="text-xs text-ink-soft">
                {img.width}×{img.height}
              </p>
              <Toggle label="Hiển thị" checked={img.active} onChange={(active) => toggle.mutate({ id: img.id, active })} />
              <div className="flex flex-wrap">
                <Button variant="ghost" aria-label="Lên" disabled={i === 0} onClick={() => reorder.mutate(move(items, i, -1).map((x) => x.id))}>
                  ←
                </Button>
                <Button
                  variant="ghost"
                  aria-label="Xuống"
                  disabled={i === items.length - 1}
                  onClick={() => reorder.mutate(move(items, i, 1).map((x) => x.id))}
                >
                  →
                </Button>
                <Button variant="ghost" onClick={() => setEditing(img)}>
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => confirmRemove(img.id, img.alt.vi)}>
                  Xoá
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {list.isSuccess && items.length === 0 && <p className="text-sm text-ink-soft">Chưa có ảnh.</p>}

      {editing && (
        <GalleryForm
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
              { id: d.id, body: { src: d.src, alt: d.alt, width: d.width, height: d.height, active: d.active } },
              { onSuccess: () => setEditing(null) }
            )
          }
        />
      )}
    </>
  );
}

function GalleryForm({
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

  async function onImage({ url, width, height }: { url: string; width?: number; height?: number }) {
    setD((prev) => ({ ...prev, src: url }));
    // Kích thước đúng giúp ảnh không bị nhảy bố cục: lấy từ Cloudinary hoặc đọc từ link
    const size = width && height ? { width, height } : url ? await readImageSize(url) : null;
    if (size) setD((prev) => (prev.src === url ? { ...prev, ...size } : prev));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit(d);
  }

  return (
    <Modal open onOpenChange={(o) => !o && onClose()} title={initial.id ? 'Sửa ảnh' : 'Thêm ảnh'} wide>
      <form onSubmit={submit} className="space-y-4">
        <ImageField label="Ảnh" value={d.src} onChange={(info) => void onImage(info)} />
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Rộng (px)"
            type="number"
            min={1}
            required
            value={d.width || ''}
            onChange={(e) => setD({ ...d, width: Number(e.target.value) })}
          />
          <TextInput
            label="Cao (px)"
            type="number"
            min={1}
            required
            value={d.height || ''}
            onChange={(e) => setD({ ...d, height: Number(e.target.value) })}
          />
        </div>
        <LocalizedInput label="Mô tả ảnh" maxLength={160} value={d.alt} onChange={(alt) => setD({ ...d, alt })} />
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
