/**
 * Branded type for pixel values to prevent mixing with grid units
 */
export type Pixels = number & { __brand: 'pixels' };

/**
 * Type guard to ensure a number is treated as pixels
 */
export function px(n: number): Pixels {
  return n as Pixels;
}

/**
 * Represents a position in screen/viewport coordinates (pixels)
 * Origin (0,0) is at the top-left of the viewport
 */
export interface ScreenPosition {
  x: Pixels; // pixels from left edge of viewport
  y: Pixels; // pixels from top edge of viewport
}

/**
 * Represents a card's data
 */
export interface CardData {
  id: string;
  text: string;
  position: ScreenPosition; // Card positions are stored in screen coordinates
  gridPosition: { x: number, y: number }; // Grid positions are stored in grid units
}

/**
 * Creates a ScreenPosition from x,y coordinates in pixels
 */
export function screenPos(x: number, y: number): ScreenPosition {
  return { x: px(x), y: px(y) };
}