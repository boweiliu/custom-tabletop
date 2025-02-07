<script lang="ts">
  import type { GridLine } from '../../lib/services/gridService';
  
  export let gridLines: GridLine[];
</script>

<div class="grid-container">
  {#each gridLines as line}
    <div 
      class="grid-line {line.orientation} {line.isCenter ? 'center' : ''}" 
      style="{line.orientation === 'horizontal' ? 'top' : 'left'}: {Number(line.position)}px"
    ></div>
  {/each}
</div>

<style>
  :root {
    --grid-line-color: rgba(100, 100, 100, 0.2);
    --grid-line-center-color: rgba(50, 50, 50, 0.4);
  }

  .grid-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-color: #f0e0e0;
  }

  .grid-line {
    position: absolute;
    background-color: var(--grid-line-color);
  }

  .grid-line.center {
    background-color: var(--grid-line-center-color);
  }

  .horizontal {
    width: 100%;
    height: 1px;
  }

  .vertical {
    width: 1px;
    height: 100%;
  }
</style>