<script lang="ts">
  import type { GridLine } from '../../lib/services/gridService';
  import type { CardData, ScreenPosition, Pixels } from '../../lib/types';
  import GridLines from '../grid/GridLines.svelte';
  import CardList from '../cards/CardList.svelte';
  import { createEventDispatcher } from 'svelte';

  export let gridLines: GridLine[] = [];
  export let cards: CardData[] = [];
  export let centerPosition: ScreenPosition | undefined = undefined;
  export let gridSpacing: Pixels | undefined = undefined;
  export let cardWidth: Pixels | undefined = undefined;
  export let cardHeight: Pixels | undefined = undefined;

  const dispatch = createEventDispatcher<{
    positionChange: { cardId: string; position: ScreenPosition };
  }>();

  function handlePositionChange(event: CustomEvent<{ cardId: string; position: ScreenPosition }>) {
    dispatch('positionChange', event.detail);
  }
</script>

<div class="workspace">
  <GridLines {gridLines} />
  
  {#if centerPosition && gridSpacing && cardWidth && cardHeight}
    <CardList
      {cards}
      {centerPosition}
      gridSpacing={gridSpacing}
      cardWidth={cardWidth}
      cardHeight={cardHeight}
      on:positionChange={handlePositionChange}
    />
  {/if}
</div>

<style>
  .workspace {
    display: none; /* BOWEI TEST */
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>