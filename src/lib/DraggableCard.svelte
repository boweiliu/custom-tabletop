<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { ScreenPosition, Pixels } from './types';
  import { screenPos } from './types';
  import { getCardStore } from './cardStore';
  import { snapToGridHalfOffset, getCardTopLeft, getCardTopLeftFromGrid } from './gridUtils';
  import { useConvexClient } from 'convex-svelte';

  export let id: string;
  export let text: string;
  export let position: ScreenPosition;
  export let gridPosition: { x: number, y: number };
  export let centerPosition: ScreenPosition;
  export let gridSpacing: Pixels;
  export let width: Pixels;
  export let height: Pixels;

  const dispatch = createEventDispatcher<{
    positionChange: ScreenPosition;
  }>();

  let textarea: HTMLTextAreaElement;
  let dragArea: HTMLDivElement;
  let isDragging = false;
  let dragOffset: ScreenPosition = screenPos(0, 0);
  let isEditing = false;

  // Convert center position to top-left for rendering
  // $: topLeftPosition = getCardTopLeft(position, width, height);
  $: topLeftPosition = getCardTopLeftFromGrid(gridPosition, gridSpacing, centerPosition, width, height);

  function toggleEdit() {
    isEditing = !isEditing;
    if (isEditing) {
      textarea.focus();
    } else {
      textarea.blur();
    }
  }

  function preventFocus(event: FocusEvent) {
    if (!isEditing) {
      event.preventDefault();
      textarea.blur();
    }
  }

  function startDrag(clientX: number, clientY: number) {
    if (!isEditing) {
      isDragging = true;
      dragOffset = screenPos(
        clientX - Number(topLeftPosition.x),
        clientY - Number(topLeftPosition.y)
      );
    }
  }

  function handleDrag(clientX: number, clientY: number) {
    if (!isDragging) return;
    
    const newTopLeft = screenPos(
      clientX - Number(dragOffset.x),
      clientY - Number(dragOffset.y)
    );

    const newCenter = screenPos(
      newTopLeft.x + Number(width) / 2,
      newTopLeft.y + Number(height) / 2
    );
    
    const snappedCenter = snapToGridHalfOffset(newCenter, centerPosition, gridSpacing);
    dispatch('positionChange', snappedCenter);
  }

  function stopDrag() {
    isDragging = false;
  }

  function handleMouseDown(event: MouseEvent) {
    if (!isEditing) {
      event.preventDefault();
      startDrag(event.clientX, event.clientY);
    }
  }

  function handleMouseMove(event: MouseEvent) {
    handleDrag(event.clientX, event.clientY);
  }

  function handleMouseUp() {
    stopDrag();
  }

  function handleTouchStart(event: TouchEvent) {
    if (!isEditing) {
      event.preventDefault();
      const touch = event.touches[0];
      startDrag(touch.clientX, touch.clientY);
    }
  }

  function handleTouchMove(event: TouchEvent) {
    if (isDragging) {
      event.preventDefault();
      const touch = event.touches[0];
      handleDrag(touch.clientX, touch.clientY);
    }
  }

  function handleTouchEnd() {
    stopDrag();
  }

  const convexClient = useConvexClient();
  const cardStore = getCardStore(convexClient);

  function updateText(newText: string) {
    text = newText;
    cardStore.updateCard(id, { text: newText }, convexClient);
  }

  function handleDelete() {
    cardStore.removeCard(id);
  }

  onMount(() => {
    return () => {
    };
  });
</script>

<div 
  class="card"
  style="left: {Number(topLeftPosition.x)}px; top: {Number(topLeftPosition.y)}px; width: {Number(width)}px; height: {Number(height)}px;"
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:mouseleave={handleMouseUp}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
  on:touchcancel={handleTouchEnd}
>
  <div 
    class="drag-area"
    bind:this={dragArea}
    on:mousedown|stopPropagation={handleMouseDown}
    on:touchstart|stopPropagation={handleTouchStart}
  >
    <div class="textarea-container" class:editing={isEditing}>
      <textarea 
        bind:this={textarea}
        value={text}
        on:input={(e) => updateText(e.currentTarget.value)}
        placeholder="<click edit to enter text>"
        class:editing={isEditing}
        on:focus={preventFocus}
        readonly={!isEditing}
        tabindex="-1"
      ></textarea>
    </div>
  </div>
  <div class="divider"></div>
  <div class="button-container">
    <button 
      class="edit-button" 
      on:click={toggleEdit}
    >
      {isEditing ? 'Done' : 'Edit'}
    </button>
    <button 
      class="delete-button"
      on:click={handleDelete}
    >
      ×
    </button>
  </div>
</div>

<style>
  :root {
    --textarea-padding: 15px;
    --textarea-border-width: 3px;
    --textarea-border-radius: 8px;
    --textarea-font-size: 1rem;
    --grid-line-color: rgba(100, 100, 100, 0.2);
    --grid-line-center-color: rgba(50, 50, 50, 0.4);
    --shadow-color: rgba(0, 0, 0, 0.1);
    --button-height: 40px;
  }

  .card {
    position: absolute;
    pointer-events: auto;
    background: white;
    border: var(--textarea-border-width) solid black;
    border-radius: var(--textarea-border-radius);
    box-shadow: 0 2px 4px var(--shadow-color);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    touch-action: none;
  }

  .drag-area {
    height: calc(100% - var(--button-height) - var(--textarea-border-width));
    cursor: move;
    border-radius: var(--textarea-border-radius) var(--textarea-border-radius) 0 0;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .textarea-container {
    flex: 1;
    padding: var(--textarea-padding);
    transition: background-color 0.2s ease;
    pointer-events: none;
  }

  .textarea-container.editing {
    background-color: #e0e0e0;
  }

  textarea {
    width: 100%;
    height: 100%;
    border: none;
    font-size: var(--textarea-font-size);
    resize: none;
    text-align: center;
    background-color: transparent;
    user-select: none;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    pointer-events: auto;
  }

  textarea.editing {
    cursor: text;
    user-select: text;
  }

  textarea:focus {
    outline: none;
  }

  .divider {
    height: var(--textarea-border-width);
    background-color: black;
    margin: 0;
  }

  .button-container {
    display: flex;
    height: var(--button-height);
  }

  .edit-button, .delete-button {
    border: none;
    background-color: white;
    cursor: pointer;
    font-size: var(--textarea-font-size);
    font-weight: bold;
    transition: background-color 0.2s, transform 0.1s;
    margin: 0;
    padding: 0;
  }

  .edit-button {
    flex-grow: 1;
    border-radius: 0 0 0 var(--textarea-border-radius);
  }

  .delete-button {
    width: var(--button-height);
    border-radius: 0 0 var(--textarea-border-radius) 0;
    border-left: var(--textarea-border-width) solid black;
    color: #ff4444;
  }

  .edit-button:hover, .delete-button:hover {
    background-color: #f0f0f0;
  }

  .edit-button:active, .delete-button:active {
    transform: scale(0.98);
  }
</style>