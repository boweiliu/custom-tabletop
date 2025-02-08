import { beforeAll, afterAll, vi } from 'vitest';

// Required for handling Svelte animations -- says claude
window.requestAnimationFrame = vi.fn().mockImplementation((cb) => cb());

beforeAll(() => {
  // Enable fake timers for all tests
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});
