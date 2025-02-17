import { vi } from 'vitest';
// import '@testing-library/jest-dom';

// Enable automatic mocks from 'mocks' directory
vi.mock('convex-svelte', () => import('./test/mocks/convex-svelte'));

// Import the mock client
import { setupConvex, useConvexClient, useQuery } from 'convex-svelte';

// Verify the mock was loaded correctly
console.log('Convex Svelte Mock:', { setupConvex, useConvexClient, useQuery });
