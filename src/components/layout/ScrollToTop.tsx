'use client';

import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ArrowUpIcon } from '@/components/ui/icons';

/** Hiện nút sau khi cuộn quá khoảng này (px) */
const SHOW_AFTER = 600;
const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Nút cuộn lên đầu trang, có vòng tròn hiển thị tiến độ cuộn.
 * Chỉ xuất hiện khi đã cuộn xuống dưới hero.
 */
export function ScrollToTop() {
  const t = useTranslations('footer');
  const reduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > SHOW_AFTER));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    // Chuyển focus lên đầu trang để người dùng bàn phím không bị "lạc" khi nút biến mất
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          onClick={scrollToTop}
          aria-label={t('backToTop')}
          title={t('backToTop')}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 24, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 24 }}
          whileHover={reduceMotion ? undefined : { y: -4 }}
          whileTap={reduceMotion ? undefined : { scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 380, damping: 24 }}
          className="group fixed right-4 bottom-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-matcha-900 text-matcha-300 shadow-soft ring-2 ring-cream/80 hover:text-cream sm:right-6 sm:bottom-6"
        >
          {/* Vòng tiến độ cuộn */}
          <svg aria-hidden viewBox="0 0 60 60" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="30" cy="30" r={RADIUS} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="3" />
            <m.circle
              cx="30"
              cy="30"
              r={RADIUS}
              fill="none"
              stroke="var(--color-matcha-400)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUpIcon
            width={22}
            height={22}
            strokeWidth={2.2}
            className="relative transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          />
        </m.button>
      )}
    </AnimatePresence>
  );
}
