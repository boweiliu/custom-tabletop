import { beforeAll, afterAll, vi } from 'vitest';

beforeAll(() => {
  // Enable fake timers for all tests
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});