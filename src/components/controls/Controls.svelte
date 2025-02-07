<script lang="ts">
  import type { Pixels } from '../../lib/types';
  import GridControls from '../grid/GridControls.svelte';
  
  export let gridSpacing: Pixels;
  export let onIncrease: () => void;
  export let onDecrease: () => void;
  export let onReset: () => void;
  export let onAddCard: () => void;
</script>

<div class="controls">
  <GridControls
    {gridSpacing}
    {onIncrease}
    {onDecrease}
  />
  <div class="button-container">
    <button class="reset-button" on:click={onReset}>Reset</button>
    <button class="add-card-button" data-testid="add-card-button" on:click={onAddCard}>+</button>
  </div>
</div>

<style>
  .controls {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    z-index: 1000;
  }

  .button-container {
    display: flex;
    gap: 10px;
  }

  .add-card-button, .reset-button {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: none;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s, background-color 0.2s;
  }

  .add-card-button {
    background-color: #4CAF50;
    color: white;
  }

  .reset-button {
    background-color: #f44336;
    color: white;
    font-size: 16px;
  }

  .add-card-button:hover, .reset-button:hover {
    transform: scale(1.05);
  }

  .add-card-button:active, .reset-button:active {
    transform: scale(0.95);
  }
</style>