import type { ScreenPosition, CardData, Pixels } from './types';
import { screenPos } from './types';
import { snapToGridHalfOffset } from './gridUtils';

/**
 * Creates a new card at the viewport center
 * @param viewportCenter Center of the viewport in screen coordinates
 * @param gridSpacing Size of one grid unit in pixels
 */
export function createInitialCard(
  viewportCenter: ScreenPosition, 
  gridSpacing: Pixels
): CardData {
  // Ensure the center position is properly rounded
  const roundedCenter = screenPos(
    Math.round(Number(viewportCenter.x)),
    Math.round(Number(viewportCenter.y))
  );
  
  return {
    id: crypto.randomUUID(),
    text: '',
    position: roundedCenter
  };
}

/**
 * Gets the center position of the viewport
 * @param width Viewport width in pixels
 * @param height Viewport height in pixels
 * @returns Center position in screen coordinates
 */
export function getInitialPosition(
  width: number, 
  height: number
): ScreenPosition {
  return screenPos(
    Math.round(width / 2),
    Math.round(height / 2)
  );
}