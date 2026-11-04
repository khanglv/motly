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
          dark && 'bg-cream/10 text-matcha-300 ring-1 ring-cream/15'
        )}
      >
        <Leaf
          className={clsx(
            'h-3.5 w-3.5',
            dark ? 'text-matcha-400' : 'text-matcha-600'
          )}
        />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={clsx('mt-4 text-4xl sm:text-5xl', dark && 'text-cream')}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            'mt-4 text-lg',
            dark ? 'text-cream/70' : 'text-ink-soft'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
