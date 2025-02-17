import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import App from './App.svelte';

vi.mock('convex-svelte', () => ({
  __MOCK_IDENTIFIER__: 'convex-svelte-mock',
  setupConvex: vi.fn(),
  useConvexClient: vi.fn(),
  useQuery: null,
}));

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
      clear: vi.fn()
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
    const { setupConvex, useConvexClient, useQuery, __MOCK_IDENTIFIER__ } = await import('convex-svelte');
    
    // Verify we're using our mock by checking the identifier
    expect(__MOCK_IDENTIFIER__).toBe('convex-svelte-mock');
    
    // Log out the imported values to see what we got
    console.log('Imported from convex-svelte:', { setupConvex, useConvexClient, useQuery, __MOCK_IDENTIFIER__ });
    
    // Verify setupConvex is a mock function
    expect(setupConvex).toBeDefined();
    expect(vi.isMockFunction(setupConvex)).toBe(true);
    
    // Verify useConvexClient is a mock function
    expect(useConvexClient).toBeDefined();
    expect(vi.isMockFunction(useConvexClient)).toBe(true);
    
    // Verify useQuery matches our mock
    expect(useQuery).toBe(null); // Since we set it to null in our mock
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