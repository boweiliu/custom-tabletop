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
  const snappedCenter = snapToGridHalfOffset(roundedCenter, viewportCenter, gridSpacing);
  
  return {
    id: crypto.randomUUID(),
    text: '',
    position: snappedCenter,
    gridPosition: {
      x: 0.5,
      y: 0.5,
    }
  };
}