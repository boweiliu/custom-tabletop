<script lang="ts">
  import { onMount } from 'svelte';
  import Controls from './components/controls/Controls.svelte';
  import Workspace from './components/workspace/Workspace.svelte';
  import { cardStore } from './lib/cardStore';
  import { createInitialCard } from './lib/initialState';
  import type { ScreenPosition, CardData, Pixels } from './lib/types';
  import { gridSpacing, cardDimensions, increaseGridSpacing, decreaseGridSpacing, resetGridSpacing } from './lib/stores/gridStore';
  import { GridService, type GridLine } from './lib/services/gridService';
  import { setupConvex } from 'convex-svelte';
	import { useQuery } from 'convex-svelte';
	import { api } from './convex/_generated/api.js';
  import ConvexTestPage from './ConvexTestPage.svelte';

  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL
  // console.log({CONVEX_URL});

  let isConvexInitialized = false;
  onMount(() => {
    if (!isConvexInitialized) {
      setupConvex(CONVEX_URL);
      isConvexInitialized = true;
      console.log('initialized convex');
    }
  })
  
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
    // also compute the new grid coords from the position
    const gridPosition = gridService.getCardGridPosition(position);

    cardStore.updateCard(cardId, { position, gridPosition });
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

  // console.log('can i use query?')
  // const query = useQuery(api.tasks.get, {});
  // query.isLoading
</script>

<main bind:this={mainElement}>
  {#if isConvexInitialized}
    <ConvexTestPage />
  {/if}
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