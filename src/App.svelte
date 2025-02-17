<script lang="ts">
  import ConvexProvider from './ConvexProvider.svelte';
  import MainTabletop from './MainTabletop.svelte';
</script>

<ConvexProvider>
  <MainTabletop />
</ConvexProvider>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
