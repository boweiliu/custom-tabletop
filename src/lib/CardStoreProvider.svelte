<script lang="ts">
  import { useConvexClient } from 'convex-svelte';
  import { getCardStore } from './cardStore';
  import type { Snippet } from 'svelte';

  const { children } = $props<{
    children: Snippet;
  }>();

  const convexClient = useConvexClient();
  const cardStore = getCardStore(convexClient);

  // Make cardStore globally available
  // $state.global({ cardStore });
</script>

{@render children()}