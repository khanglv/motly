"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Độ trễ (giây) */
  delay?: number;
  /** Khoảng dịch chuyển dọc ban đầu (px) */
  y?: number;
};

/**
 * Hiện nội dung nhẹ nhàng khi cuộn tới. Khi người dùng bật "giảm chuyển động"
 * thì hiển thị ngay, không animation (CSS trong globals.css bảo đảm cả lúc SSR).
 */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      data-reveal=""
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
