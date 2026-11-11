import clsx from 'clsx';
import decor from '@/styles/decor.module.scss';

/**
 * Vòng ensō (円相) vẽ bằng một nét cọ, chừa khoảng hở như nét thư pháp thiền.
 * Viền nét hơi nhoè nhờ filter displacement. Tự vẽ khi tải trang.
 */
export function Enso({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      fill="none"
      className={clsx(decor.enso, className)}
    >
      <defs>
        <filter id="enso-brush" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="2"
            seed="7"
          />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </defs>
      <g filter="url(#enso-brush)" stroke="currentColor" strokeLinecap="round">
        {/* Nét chính: bắt đầu ở góc trên phải, đi theo chiều kim đồng hồ ~320° */}
        <path
          d="M140 30.7A80 80 0 1 1 86.1 21.2"
          strokeWidth="9"
          pathLength={1}
          className="motion-safe:animate-draw-slow"
        />
      </g>
    </svg>
  );
}

/** Con dấu hanko màu son, khắc chữ 一杯 ("một ly") */
export function Hanko({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      lang="ja"
      className={clsx(
        decor.hanko,
        'grid place-items-center rounded-md font-serif font-bold text-cream [writing-mode:vertical-rl]',
        className
      )}
    >
      一杯
    </span>
  );
}
