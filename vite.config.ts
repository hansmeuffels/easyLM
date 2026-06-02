import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/easyLM/',
  plugins: [react(), tailwindcss()],
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
