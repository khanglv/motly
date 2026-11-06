import clsx from 'clsx';
import decor from '@/styles/decor.module.scss';

/** Chổi tre đánh matcha (chasen), vẽ nét */
function Chasen({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 200" fill="none" className={className} aria-hidden>
      <rect
        x="30"
        y="0"
        width="20"
        height="78"
        rx="6"
        fill="var(--color-accent)"
        stroke="var(--color-matcha-900)"
        strokeWidth="3"
      />
      <path
        d="M22 78h36l14 112H8z"
        fill="var(--color-cream)"
        stroke="var(--color-matcha-900)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M20 190l6-112M30 190l3-112M40 190V78M50 190l-3-112M60 190l-6-112"
        stroke="var(--color-matcha-900)"
        strokeOpacity=".55"
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * Bát matcha nhìn từ trên xuống + chổi tre: vật trang trí đặt cạnh ảnh ly ở hero.
 * Vành gốm màu kem, mặt matcha có lớp bọt mịn. Màu theo tông đang chọn.
 */
export function MatchaBowl({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx('relative aspect-square', className)}>
      <div className={clsx(decor.matchaBowl, 'absolute inset-0 rounded-full')}>
        <div
          className={clsx(
            decor.matchaFoam,
            'absolute inset-[11%] rounded-full'
          )}
        />
      </div>
      <Chasen className="absolute -top-[18%] -right-[14%] w-[30%] rotate-[24deg] drop-shadow-md" />
    </div>
  );
}

/**
 * Nền hero (tĩnh, aria-hidden): hoạ tiết icon café lặp kiểu giấy gói của quán
 * (ly mang đi, hạt cà phê, lá trà, chổi tre, bát, bánh), mờ dần về phía phần chữ bên trái.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent_25%,#000_70%)]"
    >
      <div className={clsx(decor.cafePattern, 'absolute inset-0')} />
    </div>
  );
}
