import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
// https://testing-library.com/docs/svelte-testing-library/setup
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    globals: true,
    environment: 'jsdom',
    testTimeout: 10000, // 10 second timeout
    setupFiles: ['src/test/setup.ts'],
    // exclude: [], // Exclude JavaScript test files
    include: ['src/**/*.test.ts'],
  }
})