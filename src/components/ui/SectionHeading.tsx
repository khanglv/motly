import clsx from 'clsx';
import { Leaf } from './decor';

type Props = {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  /** "dark" dùng trên nền xanh đậm */
  tone?: 'light' | 'dark';
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'light',
  className
}: Props) {
  const dark = tone === 'dark';
  return (
    <div
      className={clsx(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      <p
        className={clsx(
          'eyebrow',
          dark && 'bg-white/40 text-surface-accent ring-1 ring-on-surface/10'
        )}
      >
        <Leaf
          className={clsx(
            'h-3.5 w-3.5',
            dark ? 'text-surface-accent' : 'text-matcha-600'
          )}
        />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={clsx('mt-4 text-4xl sm:text-5xl', dark && 'text-on-surface')}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            'mt-4 text-lg',
            dark ? 'text-on-surface-soft' : 'text-ink-soft'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
