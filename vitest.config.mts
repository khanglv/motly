import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@messages': fileURLToPath(new URL('./messages', import.meta.url))
    }
  },
  // Không dùng postcss.config.mjs của Next/Tailwind trong test (định dạng plugin khác Vite)
  css: { postcss: { plugins: [] } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    css: { include: [], modules: { classNameStrategy: 'non-scoped' } }
  }
});
