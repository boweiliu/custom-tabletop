<script lang="ts">
  import type { CardData, ScreenPosition, Pixels } from '../../lib/types';
  import DraggableCard from '../../lib/DraggableCard.svelte';
  import { createEventDispatcher } from 'svelte';
  
  export let cards: CardData[];
  export let centerPosition: ScreenPosition;
  export let gridSpacing: Pixels;
  export let cardWidth: Pixels;
  export let cardHeight: Pixels;
  
  type PositionChangeEvent = {
    cardId: string;
    position: ScreenPosition;
  };
  
  const dispatch = createEventDispatcher<{
    positionChange: PositionChangeEvent;
  }>();
  
  function handlePositionChange(cardId: string, newPosition: ScreenPosition) {
    dispatch('positionChange', { cardId, position: newPosition });
  }
</script>

<!-- Render cards with unique keys for efficient updates -->
{#each cards as card (card.id)}
  <DraggableCard
    id={card.id}
    text={card.text}
    position={card.position}
    gridPosition={card.gridPosition}
    {centerPosition}
    {gridSpacing}
    width={cardWidth}
    height={cardHeight}
    on:positionChange={(e) => handlePositionChange(card.id, e.detail)}
  />
{/each}