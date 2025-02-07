<script lang="ts">
  import { onMount } from 'svelte';
  import Controls from './components/controls/Controls.svelte';
  import Workspace from './components/workspace/Workspace.svelte';
  import { cardStore } from './lib/cardStore';
  import { createInitialCard } from './lib/initialState';
  import type { ScreenPosition, CardData, Pixels } from './lib/types';
  import { gridSpacing, cardDimensions, increaseGridSpacing, decreaseGridSpacing, resetGridSpacing } from './lib/stores/gridStore';
  import { GridService, type GridLine } from './lib/services/gridService';
  
  let mainElement: HTMLElement;
  let gridService: GridService;
  let gridLines: GridLine[] = [];
  let centerPosition: ScreenPosition;
  let cards: CardData[] = [];
  let currentGridSpacing: Pixels;
  let currentCardWidth: Pixels;
  let currentCardHeight: Pixels;

  gridSpacing.subscribe(value => {
    currentGridSpacing = value;
    if (gridService) {
      gridService.updateGridSpacing(value);
      gridLines = gridService.calculateGridLines();
    }
  });

  cardDimensions.subscribe(dimensions => {
    currentCardWidth = dimensions.width;
    currentCardHeight = dimensions.height;
    if (gridService) {
      updateCenterPosition();
    }
  });

  cardStore.subscribe(value => {
    cards = value;
  });

  function updateCenterPosition() {
    if (!gridService) return;
    centerPosition = gridService.getViewportCenter();
  }

  function handlePositionChange(event: CustomEvent<{ cardId: string; position: ScreenPosition }>) {
    const { cardId, position } = event.detail;
    cardStore.updateCard(cardId, { position });
  }

  function addNewCard() {
    if (!centerPosition || !currentGridSpacing) return;
    const newCard = createInitialCard(centerPosition, currentGridSpacing);
    cardStore.addCard(newCard);
  }

  function resetSimulation() {
    if (!centerPosition || !currentGridSpacing) return;
    resetGridSpacing();
    const initialCard = createInitialCard(centerPosition, currentGridSpacing);
    cardStore.reset(initialCard);
  }
  
  onMount(() => {
    if (!currentGridSpacing) return;
    
    gridService = new GridService(
      currentGridSpacing,
      window.innerWidth,
      window.innerHeight
    );

    const updateLayout = () => {
      gridService.updateViewportSize(window.innerWidth, window.innerHeight);
      gridLines = gridService.calculateGridLines();
      updateCenterPosition();
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    
    if (cards.length === 0) {
      addNewCard();
    }
    
    return () => {
      window.removeEventListener('resize', updateLayout);
    };
  });
</script>

<main bind:this={mainElement}>
  <Workspace
    {gridLines}
    {cards}
    centerPosition={centerPosition}
    gridSpacing={currentGridSpacing}
    cardWidth={currentCardWidth}
    cardHeight={currentCardHeight}
    on:positionChange={handlePositionChange}
  />
  
  <Controls
    gridSpacing={currentGridSpacing}
    onIncrease={increaseGridSpacing}
    onDecrease={decreaseGridSpacing}
    onReset={resetSimulation}
    onAddCard={addNewCard}
  />
</main>

<style>
  main {
    width: 100%;
    height: 100vh;
    position: relative;
    background: transparent;
  }
</style>