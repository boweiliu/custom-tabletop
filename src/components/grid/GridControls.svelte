<script lang="ts">
  import type { Pixels } from '../../lib/types';
  
  export let gridSpacing: Pixels;
  export let onIncrease: () => void;
  export let onDecrease: () => void;
</script>

<div class="grid-controls">
  <button class="control-button" on:click={onDecrease}>-</button>
  <span class="grid-size">{Number(gridSpacing)}px</span>
  <button class="control-button" on:click={onIncrease}>+</button>
</div>

<style>
  .grid-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    background: white;
    padding: 5px 10px;
    border-radius: 25px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .control-button {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    border: none;
    background-color: #2196F3;
    color: white;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, background-color 0.2s;
  }

  .grid-size {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    min-width: 50px;
    text-align: center;
  }

  .control-button:hover {
    transform: scale(1.05);
  }

  .control-button:active {
    transform: scale(0.95);
  }
</style>