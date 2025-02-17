<script lang="ts">
  import type { ConvexClient } from 'convex/browser';
  import { onMount } from 'svelte';
  import { setupConvex, useConvexClient } from 'convex-svelte';
  import type { Snippet } from 'svelte';

  const { children }: { children: Snippet } = $props();

  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

  let isConvexInitialized = $state(false);
  let error: Error | null = null;

  onMount(() => {
    try {
      if (!isConvexInitialized) {
        setupConvex(CONVEX_URL);
        isConvexInitialized = true;
        console.log('Initialized Convex');
        window.alert('Initialized Convex');
      }
    } catch (e) {
      error = e instanceof Error ? e : new Error('Failed to initialize Convex');
      console.error('Failed to initialize Convex:', e);
    }
  });
</script>

{#if error}
  <div class="error">
    <p>Failed to initialize Convex: {error.message}</p>
  </div>
{:else if isConvexInitialized}
  {@render children()}
{:else}
  <div class="loading">Initializing Convex...</div>
{/if}

<style>
  .error {
    color: red;
    padding: 1rem;
  }
  .loading {
    padding: 1rem;
  }
</style>
