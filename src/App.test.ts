import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import App from './App.svelte';

describe('App', () => {
  beforeEach(() => {
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