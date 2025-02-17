import { vi } from 'vitest';

// Mock Convex client
const mockClient = {
  mutation: vi.fn(),
  query: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
};

// Add a unique identifier to verify this mock is being used
export const __MOCK_IDENTIFIER__ = 'convex-svelte-mock';

export const setupConvex = vi.fn();
export const useConvexClient = vi.fn(() => mockClient);
export const useQuery = vi.fn(() => ({ 
  data: null, 
  isLoading: false, 
  error: null 
}));