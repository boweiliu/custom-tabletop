import { writable, derived } from 'svelte/store';
import { px, type Pixels } from '../types';

// Constants
const INITIAL_GRID_SPACING = 50;
const CARD_WIDTH_UNITS = 4;
const CARD_HEIGHT_UNITS = 6;
const STORAGE_KEY = 'gridSpacing';

// Load initial grid spacing from localStorage
function loadGridSpacing(): Pixels {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return px(saved ? parseInt(saved, 10) : INITIAL_GRID_SPACING);
  } catch (e) {
    console.error('Error loading grid spacing:', e);
    return px(INITIAL_GRID_SPACING);
  }
}

// Create the base grid spacing store
const { subscribe, set, update } = writable<Pixels>(loadGridSpacing());

// Create the exported store with persistence
export const gridSpacing = {
  subscribe,
  set: (value: Pixels) => {
    set(value);
    localStorage.setItem(STORAGE_KEY, String(Number(value)));
  },
  update: (updater: (value: Pixels) => Pixels) => {
    update(current => {
      const newValue = updater(current);
      localStorage.setItem(STORAGE_KEY, String(Number(newValue)));
      return newValue;
    });
  }
};

// Derive card dimensions from grid spacing
export const cardDimensions = derived(gridSpacing, ($gridSpacing) => ({
  width: px($gridSpacing * CARD_WIDTH_UNITS),
  height: px($gridSpacing * CARD_HEIGHT_UNITS)
}));

// Grid adjustment functions
export function increaseGridSpacing() {
  gridSpacing.update(spacing => px(Math.min(Number(spacing) + 10, 100)));
}

export function decreaseGridSpacing() {
  gridSpacing.update(spacing => px(Math.max(Number(spacing) - 10, 20)));
}

export function resetGridSpacing() {
  gridSpacing.set(px(INITIAL_GRID_SPACING));
}