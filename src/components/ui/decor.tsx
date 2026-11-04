import clsx from 'clsx';
import type { CSSProperties } from 'react';
import decor from '@/styles/decor.module.scss';

/** Bọt matcha bay lên. Vị trí cố định (không random) để SSR và client giống nhau. */
const BUBBLES = [
  { left: '6%', size: 14, dur: 11, delay: 0 },
  { left: '14%', size: 26, dur: 14, delay: 3 },
  { left: '23%', size: 10, dur: 9, delay: 6 },
  { left: '35%', size: 18, dur: 13, delay: 1.5 },
  { left: '47%', size: 8, dur: 10, delay: 8 },
  { left: '58%', size: 22, dur: 15, delay: 4.5 },
  { left: '67%', size: 12, dur: 10, delay: 2 },
  { left: '76%', size: 30, dur: 17, delay: 7 },
  { left: '86%', size: 10, dur: 9, delay: 5 },
  { left: '94%', size: 16, dur: 12, delay: 9.5 }
];

export function Bubbles() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className={clsx(decor.bubble, 'motion-safe:animate-bubble')}
          style={
            {
              left: b.left,
              width: b.size,
              height: b.size,
              '--dur': `${b.dur}s`,
              '--delay': `${b.delay}s`
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Hai lớp sóng chạy ngang (path lặp 2 lần để nối liền mạch). */
export function Waves({
  className,
  fill = 'var(--color-cream)',
  backFill = 'var(--color-matcha-500)'
}: {
  className?: string;
  /** Màu lớp sóng trước (trùng màu section kế tiếp) */
  fill?: string;
  /** Màu lớp sóng sau, tạo viền "matcha" giữa hai section */
  backFill?: string;
}) {
  const path =
    'M0 40 C 150 80 350 0 600 40 C 850 80 1050 0 1200 40 C 1350 80 1550 0 1800 40 C 2050 80 2250 0 2400 40 V 120 H 0 Z';
  return (
    <div
      aria-hidden
      className={clsx(
        'pointer-events-none absolute inset-x-0 h-20 overflow-hidden sm:h-28',
        className
      )}
    >
      <svg
        className={clsx(
          decor.wave,
          'bottom-0 h-full motion-safe:animate-wave-slow'
        )}
        viewBox="0 0 2400 120"
        preserveAspectRatio="none"
      >
        <path d={path} fill={backFill} transform="translate(0 10)" />
      </svg>
      <svg
        className={clsx(decor.wave, 'bottom-0 h-full motion-safe:animate-wave')}
        viewBox="0 0 2400 120"
        preserveAspectRatio="none"
      >
        <path d={path} fill={fill} transform="translate(0 30)" />
      </svg>
    </div>
  );
}

/** Nét gợn sóng tự vẽ dưới chữ nhấn mạnh */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={clsx(decor.squiggle, className)}
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
    >
      <path
        d="M4 16 C 30 4, 52 4, 76 14 S 124 24, 150 12 S 200 2, 226 12 S 274 22, 296 8"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        className="motion-safe:animate-draw"
      />
    </svg>
  );
}

/** Lá trà vẽ nét */
export function Leaf({
  className,
  style
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className} style={style}>
      <path d="M8 56C8 28 26 10 58 6c-2 30-20 50-50 50z" fill="currentColor" />
      <path
        d="M10 54C24 40 36 28 50 14"
        stroke="rgb(255 255 255 / 0.55)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Huy hiệu tròn có chữ chạy vòng quanh */
export function SpinningBadge({
  text,
  className,
  children
}: {
  text: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={clsx('relative grid place-items-center', className)}>
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full motion-safe:animate-spin-slow"
      >
        <defs>
          <path
            id="badge-circle"
            d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
          />
        </defs>
        <text className={decor.badgeText} fontSize="17" fill="currentColor">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      {children}
    </div>
  );
}
