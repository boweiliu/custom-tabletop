<script lang="ts">
  import { onMount } from 'svelte';
  import { useConvexClient } from 'convex-svelte';
  import type { ConvexClient } from 'convex/browser';
  import Controls from './components/controls/Controls.svelte';
  import Workspace from './components/workspace/Workspace.svelte';
  import { createCardStore } from './lib/cardStore';
  import { createInitialCard } from './lib/initialState';
  import type { ScreenPosition, CardData, Pixels } from './lib/types';
  import { gridSpacing, cardDimensions, increaseGridSpacing, decreaseGridSpacing, resetGridSpacing } from './lib/stores/gridStore';
  import { GridService, type GridLine } from './lib/services/gridService';
  import ConvexTestPage from './ConvexTestPage.svelte';

  let mainElement: HTMLElement;
  let gridService: GridService;
  let gridLines: GridLine[] = [];
  let centerPosition: ScreenPosition;
  let cards: CardData[] = [];
  let currentGridSpacing: Pixels;
  let currentCardWidth: Pixels;
  let currentCardHeight: Pixels;
  let cardStore: ReturnType<typeof createCardStore>;

  const convexClient = useConvexClient();

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

  onMount(() => {
    cardStore = createCardStore(convexClient);
    cardStore.subscribe(value => {
      cards = value;
    });
  });

  function updateCenterPosition() {
    if (!gridService) return;
    centerPosition = gridService.getViewportCenter();
  }

  function handlePositionChange(event: CustomEvent<{ cardId: string; position: ScreenPosition }>) {
    const { cardId, position } = event.detail;
    const gridPosition = gridService.getCardGridPosition(position);
    cardStore.updateCard(cardId, { position, gridPosition }, convexClient);
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
  <ConvexTestPage />
  <Workspace 
    gridLines={gridLines}
    cards={cards}
    centerPosition={centerPosition}
    gridSpacing={currentGridSpacing}
    cardWidth={currentCardWidth}
    cardHeight={currentCardHeight}
    onPositionChange={handlePositionChange}
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
