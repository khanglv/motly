'use client';

import { m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import decor from '@/styles/decor.module.scss';

/**
 * Nền hero nhiều lớp (trang trí, aria-hidden), mọi màu lấy theo tông đang chọn:
 * 1. Mesh gradient trôi chậm.
 * 2. Lưới chấm mờ dần ra mép.
 * 3. Gợn sóng matcha lan ra từ phía sau ly (như bọt khi đánh matcha).
 * 4. Chữ "MATCHA" khổng lồ dạng viền, trượt ngang khi cuộn.
 * 5. Parallax nhẹ theo con trỏ chuột (tắt trên cảm ứng và khi giảm chuyển động).
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Parallax theo chuột: giá trị -0.5 → 0.5
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 60, damping: 20 };
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);
  const meshX = useTransform(sx, (v) => v * -40);
  const meshY = useTransform(sy, (v) => v * -30);
  const ringsX = useTransform(sx, (v) => v * 30);
  const ringsY = useTransform(sy, (v) => v * 24);

  // Chữ lớn trượt ngang theo cuộn
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const wordX = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);

  useEffect(() => {
    if (reduceMotion) return;
    const section = ref.current?.parentElement;
    if (!section) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = section.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, [mx, my, reduceMotion]);

  const still = reduceMotion ?? false;

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* 1. Mesh gradient */}
      <m.div
        className={clsx(decor.mesh, 'absolute -inset-[10%] motion-safe:animate-mesh')}
        style={still ? undefined : { x: meshX, y: meshY }}
      />

      {/* 2. Lưới chấm */}
      <div className={clsx(decor.dots, 'absolute inset-0')} />

      {/* 3. Gợn sóng matcha phía sau ảnh (cột phải) */}
      <m.div
        className="absolute top-[55%] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 md:top-[48%] md:left-[78%] md:h-[54rem] md:w-[54rem]"
        style={still ? undefined : { x: ringsX, y: ringsY }}
      >
        {/* đĩa matcha đặc ở giữa */}
        <span className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--color-matcha-200)_0%,var(--color-matcha-300)_40%,var(--color-matcha-500)_100%)] opacity-90 shadow-[0_40px_120px_-20px_color-mix(in_srgb,var(--color-matcha-500)_70%,transparent)]" />
        <span className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_70%_80%,color-mix(in_srgb,var(--color-accent)_55%,transparent)_0%,transparent_55%)]" />
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={clsx(decor.ripple, 'absolute inset-0 rounded-full')}
            style={{ animationDelay: `${i * 1.6}s` }}
          />
        ))}
        {/* vòng tĩnh để vẫn thấy khi tắt chuyển động */}
        <span className="absolute inset-[8%] rounded-full border-2 border-dashed border-matcha-600/35 motion-safe:animate-spin-slow" />
      </m.div>

      {/* 4. Chữ lớn dạng viền */}
      <m.p
        className="absolute bottom-10 left-0 font-display text-[14vw] sm:bottom-14 leading-none font-extrabold tracking-tighter whitespace-nowrap text-transparent [-webkit-text-stroke:2px_color-mix(in_srgb,var(--color-matcha-600)_30%,transparent)]"
        style={still ? undefined : { x: wordX }}
      >
        MATCHA · MỘT LY · MATCHA
      </m.p>

      {/* Ánh sáng từ góc trên trái để chữ dễ đọc */}
      <div className="absolute inset-y-0 left-0 w-2/3 bg-[radial-gradient(ellipse_at_10%_30%,var(--color-cream)_0%,transparent_60%)] opacity-70" />
    </div>
  );
}
