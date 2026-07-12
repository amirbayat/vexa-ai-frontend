import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    watch: { usePolling: true, interval: 300 },
    // مقالات (SEO) — /blog را بک‌اند رندر می‌کند، نه React (docs/PRD-articles-seo-blog.md
    // بخش ۳). این proxy همون کاری که nginx در پروداکشن می‌کند را در dev شبیه‌سازی می‌کند،
    // تا لینک‌های نسبی /blog/... بدون تغییر بین dev و prod کار کنند.
    proxy: {
      '/blog': {
        target: process.env.VITE_BACKEND_ORIGIN ?? 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
