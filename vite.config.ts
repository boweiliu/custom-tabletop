import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  test: {
    globals: true,
    environment: 'jsdom',
    testTimeout: 10000, // 10 second timeout
    setupFiles: ['src/test/setup.ts']
  }
})