import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
// https://testing-library.com/docs/svelte-testing-library/setup
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST }), svelteTesting()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    // https://vitest.dev/config/#deps-inline
    // deps: {
    //   inline: ['convex-svelte']
    // }
  },
});
