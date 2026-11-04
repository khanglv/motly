"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Dùng component `m` (thay cho `motion`) bên trong provider này để giảm JS tải ban đầu.
 * `strict` báo lỗi nếu lỡ dùng `motion.*` (sẽ kéo cả thư viện vào bundle chính).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
