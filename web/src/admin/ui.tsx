'use client';

import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes
} from 'react';
import { CloseIcon } from '@/components/ui/icons';
import type { Localized } from './api';

/* ---------- Ô nhập ---------- */

export const inputClass =
  'w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink shadow-xs outline-none transition focus:border-matcha-600 focus:ring-2 focus:ring-matcha-200 disabled:bg-cream-dark';

export function Field({
  label,
  hint,
  children,
  className
}: {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

export function TextInput({
  label,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <Field label={label} hint={hint} className={className}>
      {(id) => <input id={id} className={inputClass} {...props} />}
    </Field>
  );
}

export function TextArea({
  label,
  hint,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return (
    <Field label={label} hint={hint} className={className}>
      {(id) => <textarea id={id} rows={3} className={inputClass} {...props} />}
    </Field>
  );
}

/** Hai ô Tiếng Việt / English cho trường có bản dịch */
export function LocalizedInput({
  label,
  value,
  onChange,
  multiline,
  required = true,
  maxLength
}: {
  label: string;
  value: Localized;
  onChange: (value: Localized) => void;
  multiline?: boolean;
  required?: boolean;
  maxLength?: number;
}) {
  const Input = multiline ? TextArea : TextInput;
  return (
    <fieldset className="grid gap-3 rounded-2xl border border-ink/10 bg-cream/60 p-3 sm:grid-cols-2">
      <legend className="px-1 text-sm font-semibold text-ink">{label}</legend>
      <Input
        label="Tiếng Việt"
        value={value.vi}
        required={required}
        maxLength={maxLength}
        onChange={(e) => onChange({ ...value, vi: e.target.value })}
      />
      <Input
        label="English"
        value={value.en}
        required={required}
        maxLength={maxLength}
        onChange={(e) => onChange({ ...value, en: e.target.value })}
      />
    </fieldset>
  );
}

export function Toggle({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-ink select-none">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden
        className="relative h-6 w-11 rounded-full bg-ink/20 transition peer-checked:bg-matcha-600 peer-focus-visible:ring-2 peer-focus-visible:ring-matcha-300 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5"
      />
      {label}
    </label>
  );
}

/* ---------- Nút ---------- */

export function Button({
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-matcha-700 text-cream hover:bg-matcha-800',
        variant === 'ghost' && 'text-ink hover:bg-matcha-100',
        variant === 'danger' && 'text-red-700 hover:bg-red-50',
        className
      )}
      {...props}
    />
  );
}

/* ---------- Hộp thoại ---------- */

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  wide
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className={clsx(
            'fixed inset-x-3 top-[4vh] z-50 mx-auto max-h-[92vh] overflow-y-auto rounded-3xl bg-paper p-5 shadow-lift sm:p-7',
            wide ? 'max-w-3xl' : 'max-w-xl'
          )}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <Dialog.Title className="font-display text-2xl font-bold text-ink">{title}</Dialog.Title>
            <Dialog.Close className="rounded-full p-2 hover:bg-matcha-100" aria-label="Đóng">
              <CloseIcon width={20} height={20} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ---------- Thông báo ---------- */

type Toast = { id: number; message: string; tone: 'success' | 'error' };
const ToastContext = createContext<(message: string, tone?: Toast['tone']) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, tone: Toast['tone'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, message, tone }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4000);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="fixed right-4 bottom-4 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <p
            key={t.id}
            role={t.tone === 'error' ? 'alert' : 'status'}
            className={clsx(
              'max-w-sm rounded-2xl px-4 py-3 text-sm font-medium shadow-lift',
              t.tone === 'success' ? 'bg-matcha-900 text-cream' : 'bg-red-700 text-white'
            )}
          >
            {t.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/** Hiển thị lỗi form */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
      {message}
    </p>
  );
}

/** Tiêu đề trang + nút hành động */
export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-ink-soft">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export const formatVnd = (price: number) => `${price.toLocaleString('vi-VN')} ₫`;
