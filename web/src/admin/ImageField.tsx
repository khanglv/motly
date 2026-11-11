'use client';

import { useQuery } from '@tanstack/react-query';
import { useId, useState } from 'react';
import { cmsFetch } from './api';
import { Button, inputClass } from './ui';

interface Signature {
  timestamp: number;
  folder: string;
  signature: string;
  apiKey: string;
  uploadUrl: string;
}

export interface ImageInfo {
  url: string;
  width?: number;
  height?: number;
}

const MAX_MB = 8;

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
 * Chọn ảnh: upload lên Cloudinary (nếu API đã cấu hình) hoặc dán link.
 * Link hợp lệ: /images/... (ảnh có sẵn trong web) hoặc https://res.cloudinary.com/...
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
    if (!file.type.startsWith('image/')) return setError('Chỉ chọn được file ảnh');
    if (file.size > MAX_MB * 1024 * 1024) return setError(`Ảnh tối đa ${MAX_MB} MB`);

    setUploading(true);
    try {
      const sig = await cmsFetch<Signature>('/admin/uploads/signature', { method: 'POST' });
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sig.apiKey);
      form.append('timestamp', String(sig.timestamp));
      form.append('folder', sig.folder);
      form.append('signature', sig.signature);
      const res = await fetch(sig.uploadUrl, { method: 'POST', body: form });
      const data = (await res.json()) as {
        secure_url?: string;
        width?: number;
        height?: number;
        error?: { message: string };
      };
      if (!res.ok || !data.secure_url) throw new Error(data.error?.message ?? 'Upload thất bại');
      onChange({ url: data.secure_url, width: data.width, height: data.height });
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
            placeholder="/images/... hoặc https://res.cloudinary.com/..."
            onChange={(e) => onChange({ url: e.target.value.trim() })}
          />
          {status.data?.enabled ? (
            <label className="inline-flex">
              <input
                type="file"
                accept="image/*"
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
                Chưa cấu hình Cloudinary nên chỉ dán được link ảnh.
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
