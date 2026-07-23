/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/'
      }
    },
    setupFiles: ['./tests/setup.ts'],
    globals: false,
    fileParallelism: false
  }
})
