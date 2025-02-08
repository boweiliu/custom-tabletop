import type { ScreenPosition, Pixels } from './types';
import { screenPos } from './types';

/**
 * CRITICAL: DO NOT MODIFY THIS SPECIFICATION WITHOUT TEAM APPROVAL!
 * This specification defines core grid snapping behavior that other parts
 * of the application depend on. Changes here can affect:
 * - Card positioning
 * - Grid interactions
 * - Visual consistency
 * 
 * Grid Snapping Specification:
 * 
 * Snaps a position to the nearest half-grid position.
 * 
 * Valid snap points are ONLY at half-grid positions (midpoints between grid lines).
 * Points should NOT snap to grid line intersections.
 * 
 * For example, with a grid spacing of 100:
 * - A point at (80, 80) should snap to (50, 50)
 * - A point at (120, 120) should snap to (150, 150)
 * 
 * The grid is defined by:
 * - A center point (the viewport center)
 * - A spacing value that determines the distance between grid lines
 */

/**
 * Rounds a number to the nearest odd integer.
 * For example:
 * - 4.3 -> 5 (rounds up to nearest odd)
 * - 4.7 -> 5 (rounds up to nearest odd) 
 * - 3.2 -> 3 (rounds down to nearest odd)
 * - 3.8 -> 3 (rounds down to nearest odd)
 * 
 * @param value The number to round
 * @returns The nearest odd integer
 */
function roundToOdd(value: number): number {
  const to_round = (value - 1) / 2;
  const rounded = Math.round(to_round);
  return 2 * rounded + 1;
}

/**
 * Rounds a number to the nearest half integer (e.g., 0.5, 1.5, 2.5).
 * This is used to ensure points snap to half-grid positions.
 * 
 * @param value The number to round
 * @returns The nearest half integer
 */
function roundToHalf(value: number): number {
  // Double the value to convert halves to whole numbers
  const doubled = value * 2;
  // Round to nearest odd integer
  const roundedOdd = roundToOdd(doubled);
  // Divide by 2 to get back to half units
  return roundedOdd / 2;
}

/**
 * Snaps a screen position to the nearest half-grid position.
 * 
 * @param position Position to snap
 * @param viewportCenter Center point of the grid system
 * @param gridSpacing Distance between grid lines
 * @returns The nearest half-grid position
 */
export function snapToGridHalfOffset(
  position: ScreenPosition,
  viewportCenter: ScreenPosition,
  gridSpacing: Pixels
): ScreenPosition {
  // First convert the position to be relative to the viewport center
  const relativeX = Number(position.x) - Number(viewportCenter.x);
  const relativeY = Number(position.y) - Number(viewportCenter.y);

  // Convert to grid units (where 1 unit = gridSpacing)
  const gridUnitsX = relativeX / Number(gridSpacing);
  const gridUnitsY = relativeY / Number(gridSpacing);

  // Round to nearest half grid unit
  const snappedGridUnitsX = roundToHalf(gridUnitsX);
  const snappedGridUnitsY = roundToHalf(gridUnitsY);

  // Convert back to pixels and add viewport center offset
  return screenPos(
    Math.floor(Number(viewportCenter.x) + (snappedGridUnitsX * Number(gridSpacing)) + 0.5),
    Math.floor(Number(viewportCenter.y) + (snappedGridUnitsY * Number(gridSpacing)) + 0.5)
  );
}

/**
 * Calculates the top-left screen position of a card given its center position
 */
export function getCardTopLeft(
  centerPosition: ScreenPosition, 
  width: Pixels, 
  height: Pixels
): ScreenPosition {
  return screenPos(
    Math.round(Number(centerPosition.x) - Math.round(Number(width) / 2)),
    Math.round(Number(centerPosition.y) - Math.round(Number(height) / 2))
  );
}

export function getCardTopLeftFromGrid(
  gridPosition: { x: number, y: number },
  gridSpacing: Pixels,
  viewportCenter: ScreenPosition,
  cardWidth: Pixels,
  cardHeight: Pixels
): ScreenPosition {
  const center = screenPos(
    Math.round(Number(viewportCenter.x) + (gridPosition.x * Number(gridSpacing))),
    Math.round(Number(viewportCenter.y) + (gridPosition.y * Number(gridSpacing)))
  );
  return getCardTopLeft(center, cardWidth, cardHeight);
}

/**
 * Calculates the center screen position of a card given its top-left position
 */
export function getCardCenter(
  topLeft: ScreenPosition, 
  width: Pixels, 
  height: Pixels
): ScreenPosition {
  return screenPos(
    Math.round(Number(topLeft.x) + Math.round(Number(width) / 2)),
    Math.round(Number(topLeft.y) + Math.round(Number(height) / 2))
  );
}

// export private functions for testing
export const privateFunctions = {
  roundToOdd,
  roundToHalf
};