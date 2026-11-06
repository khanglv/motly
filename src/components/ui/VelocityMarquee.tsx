'use client';

import {
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity
} from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import clsx from 'clsx';

/** Số bản lặp của nội dung để dải luôn phủ kín màn hình rộng */
const COPIES = 4;

/** Giữ giá trị trong khoảng [min, max) và quay vòng (dùng cho chuyển động lặp vô hạn) */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

type Props = {
  children: ReactNode;
  /** Tốc độ nền (% chiều dài một bản lặp mỗi giây). Âm = chạy sang phải. */
  baseVelocity?: number;
  className?: string;
  /** Lớp bọc của từng bản lặp nội dung */
  itemClassName?: string;
};

/**
 * Dải chữ chạy phản ứng theo cuộn trang:
 * - chạy đều theo `baseVelocity`;
 * - cuộn càng nhanh thì chạy càng nhanh, cuộn ngược thì đổi chiều;
 * - nghiêng nhẹ (skew) theo tốc độ cuộn;
 * - rê chuột vào thì chạy chậm lại để đọc.
 * Khi người dùng bật "giảm chuyển động", dải đứng yên.
 */
export function VelocityMarquee({ children, baseVelocity = 4, className, itemClassName }: Props) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-2000, 0, 2000], [-6, 0, 6]);

  // Mỗi bản lặp chiếm 1/COPIES chiều dài track; quay vòng trong một bản lặp để liền mạch
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);

  const direction = useRef(1);
  const hovered = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const v = velocityFactor.get();
    if (v < 0) direction.current = -1;
    else if (v > 0) direction.current = 1;

    const speed = (hovered.current ? 0.25 : 1) * (1 + Math.abs(v));
    const moveBy = direction.current * baseVelocity * speed * (delta / 1000);
    baseX.set(baseX.get() - moveBy);
  });

  return (
    <div
      className={clsx('overflow-hidden', className)}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <m.div className="flex w-max" style={reduceMotion ? undefined : { x, skewX }}>
        {Array.from({ length: COPIES }, (_, i) => (
          <div key={i} className={clsx('flex shrink-0 items-center', itemClassName)}>
            {children}
          </div>
        ))}
      </m.div>
    </div>
  );
}
