import { vi } from 'vitest';
vi.mock('convex-svelte', async () => {
  return mockSvelte;
});

const mockClient = {
  mutation: vi.fn(),
  query: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
};

// Hoist the mock to ensure it's loaded before any imports
const mockSvelte = vi.hoisted(() => {
return {
  setupConvex: vi.fn(),
  useConvexClient: vi.fn(() => mockClient),
  __MOCK_IDENTIFIER__: 'convex-svelte-mock',
  useQuery: vi.fn(() => ({ 
    data: null, 
    isLoading: false, 
    error: null 
  }))
};
})


import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import App from './App.svelte';

describe('App', () => {
  beforeEach(() => {
    // Mock import.meta.env
    vi.stubGlobal('import.meta', {
      env: {
        VITE_CONVEX_URL: 'https://test-url.convex.cloud'
      }
    });

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(() => '50'), // Return default grid spacing
      setItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    Object.defineProperty(window, 'innerHeight', { value: 768 });

    // Mock crypto.randomUUID
    Object.defineProperty(window, 'crypto', {
      value: {
        randomUUID: () => '123e4567-e89b-12d3-a456-426614174000'
      }
    });

    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('verifies convex-svelte mock is being used', async () => {
    // Import the mocked module
    const f = await import('convex-svelte');
    const { setupConvex, useConvexClient, useQuery, __MOCK_IDENTIFIER__ } = f as any
    
    // Log out the imported values to see what we got
    // console.log('Imported from convex-svelte:', f);
    
    // Verify mock identifier
    expect(__MOCK_IDENTIFIER__).toBe('convex-svelte-mock');

    // Verify setupConvex is a mock function
    expect(setupConvex).toBeDefined();
    expect(vi.isMockFunction(setupConvex)).toBe(true);
    
    // Verify useConvexClient is a mock function
    expect(useConvexClient).toBeDefined();
    expect(vi.isMockFunction(useConvexClient)).toBe(true);

    // check method on useConvexClient
    const client = useConvexClient();
    expect(client).toBeDefined();
    expect(client.mutation).toBeDefined();
    expect(client.query).toBeDefined();
    expect(client.mutation).toBe(mockClient.mutation);
    expect(client.query).toBe(mockClient.query);

    // Verify useQuery is a mock function
    expect(useQuery).toBeDefined();
    expect(vi.isMockFunction(useQuery)).toBe(true);

    // Call useQuery to verify it returns expected mock data
    const queryResult = (useQuery as any)();
    expect(queryResult).toEqual({
      data: null,
      isLoading: false,
      error: null
    });
    // console.log({f})
  });

  it('renders add card button', () => {
    const { getByTestId } = render(App);
    const addButton = getByTestId('add-card-button');
    expect(addButton).toBeTruthy();
  });

  it('workspace div should have correct class', () => {
    const { container } = render(App);
    const workspace = container.querySelector('.workspace');
    expect(workspace).toBeTruthy();
    expect(workspace?.classList.contains('workspace')).toBe(true);
  });
});