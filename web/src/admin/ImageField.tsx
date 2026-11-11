'use client';

import { useQuery } from '@tanstack/react-query';
import { useId, useState } from 'react';
import { cmsFetch } from './api';
import { Button, inputClass } from './ui';

interface Presigned {
  uploadUrl: string;
  headers: Record<string, string>;
  publicUrl: string;
}

export interface ImageInfo {
  url: string;
  width?: number;
  height?: number;
}

const MAX_MB = 8;
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

/** Kích thước ảnh từ file trên máy (trước khi upload) */
async function readFileSize(file: File) {
  const url = URL.createObjectURL(file);
  try {
    return await readImageSize(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Đọc kích thước ảnh từ link (dùng cho gallery khi dán link) */
export function readImageSize(url: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Chọn ảnh: upload lên Neon Object Storage (nếu API đã cấu hình) hoặc dán link.
 * Link hợp lệ: /images/... (ảnh có sẵn trong web) hoặc link ảnh đã tải lên Neon Storage.
 */
export function ImageField({
  label,
  value,
  onChange,
  required = true,
  hint
}: {
  label: string;
  value: string;
  onChange: (info: ImageInfo) => void;
  required?: boolean;
  hint?: string;
}) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const status = useQuery({
    queryKey: ['cms', 'upload-status'],
    queryFn: () => cmsFetch<{ enabled: boolean }>('/admin/uploads/status'),
    staleTime: Infinity
  });

  async function upload(file: File) {
    setError(null);
    if (!ACCEPT.includes(file.type)) return setError('Chỉ nhận ảnh JPG, PNG, WebP, AVIF hoặc GIF');
    if (file.size > MAX_MB * 1024 * 1024) return setError(`Ảnh tối đa ${MAX_MB} MB`);

    setUploading(true);
    try {
      const size = await readFileSize(file);
      const sig = await cmsFetch<Presigned>('/admin/uploads/presign', {
        method: 'POST',
        body: { contentType: file.type, size: file.size }
      });
      // Gửi file thẳng lên Neon Storage bằng link đã ký (không đi qua API)
      const res = await fetch(sig.uploadUrl, { method: 'PUT', headers: sig.headers, body: file });
      if (!res.ok) throw new Error(`Tải ảnh lên thất bại (${res.status})`);
      onChange({ url: sig.publicUrl, width: size?.width, height: size?.height });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  }

  const preview = /^(\/images\/|https:\/\/)/.test(value) ? value : null;

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-matcha-50 ring-1 ring-ink/10">
          {preview ? (
            // Ảnh xem trước trong CMS, không cần tối ưu bằng next/image
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-ink-soft">Chưa có</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            id={id}
            className={inputClass}
            value={value}
            required={required}
            placeholder="/images/... hoặc link ảnh Neon Storage"
            onChange={(e) => onChange({ url: e.target.value.trim() })}
          />
          {status.data?.enabled ? (
            <label className="inline-flex">
              <input
                type="file"
                accept={ACCEPT.join(',')}
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file);
                  e.target.value = '';
                }}
              />
              <Button
                variant="ghost"
                className="pointer-events-none ring-1 ring-ink/15"
                disabled={uploading}
                tabIndex={-1}
              >
                {uploading ? 'Đang tải lên…' : 'Tải ảnh lên'}
              </Button>
            </label>
          ) : (
            status.isSuccess && (
              <p className="text-xs text-ink-soft">
                Chưa cấu hình Neon Storage nên chỉ dán được link ảnh.
              </p>
            )
          )}
          {hint && <p className="text-xs text-ink-soft">{hint}</p>}
          {error && (
            <p role="alert" className="text-xs text-red-700">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
