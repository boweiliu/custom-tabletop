import type { ScreenPosition, Pixels } from '../types';
import { px, screenPos } from '../types';

export type GridLineOrientation = 'horizontal' | 'vertical';

/**
 * Represents a grid line in the viewport
 * 
 * IMPORTANT: The position value represents:
 * - For horizontal lines: The y-coordinate (distance from top of viewport)
 * - For vertical lines: The x-coordinate (distance from left of viewport)
 * 
 * This design choice:
 * - Reduces memory usage by storing only the relevant coordinate
 * - Maintains type safety through the orientation field
 * - Simplifies rendering logic (position maps directly to CSS top/left)
 * 
 * Example:
 * A horizontal line at y=100: { position: 100, orientation: 'horizontal' }
 * A vertical line at x=50: { position: 50, orientation: 'vertical' }
 */
export interface GridLine {
  position: Pixels;
  orientation: GridLineOrientation;
  isCenter: boolean;
}

/**
 * Manages grid system, viewport calculations, and grid line generation
 * 
 * IMPORTANT: DO NOT MODIFY THE SPECIFICATIONS IN THE METHOD COMMENTS!
 * These specifications are critical for maintaining consistent behavior
 * and are referenced by tests. If changes are needed, discuss with the team first.
 * 
 * CRITICAL: DO NOT UPDATE THE TESTS IN gridService.test.ts UNLESS THEY ARE FAILING!
 * The tests define the expected behavior and serve as the specification.
 * If you need to change the behavior, discuss with the team first.
 */
export class GridService {
  private viewportCenter: ScreenPosition = screenPos(0, 0);

  constructor(
    private gridSpacing: Pixels,
    private viewportWidth: number,
    private viewportHeight: number
  ) {
    this.recalculateCenter();
  }

  /**
   * Generates grid lines centered around viewport center.
   * Lines extend outward in both directions from center.
   * 
   * Line placement:
   * - Center line at viewport center
   * - Additional lines at gridSpacing intervals in both directions
   * - Lines continue until they exceed viewport bounds
   * 
   * Example with 50px grid spacing and 300px width:
   * Center at 150px, lines at: 0, 50, 100, 150 (center), 200, 250, 300
   */
  calculateGridLines(): GridLine[] {
    if (this.viewportWidth <= 0 || this.viewportHeight <= 0 || Number(this.gridSpacing) <= 0) {
      return [];
    }
    
    const lines: GridLine[] = [];
    
    // Calculate how many lines we need in each direction from center
    const linesNeededLeft = Math.ceil(Number(this.viewportCenter.x) / Number(this.gridSpacing));
    const linesNeededRight = Math.ceil((this.viewportWidth - Number(this.viewportCenter.x)) / Number(this.gridSpacing));
    const linesNeededTop = Math.ceil(Number(this.viewportCenter.y) / Number(this.gridSpacing));
    const linesNeededBottom = Math.ceil((this.viewportHeight - Number(this.viewportCenter.y)) / Number(this.gridSpacing));
    
    // Generate vertical lines (including center)
    for (let i = -linesNeededLeft; i <= linesNeededRight; i++) {
      const x = Number(this.viewportCenter.x) + (i * Number(this.gridSpacing));
      if (x >= 0 && x <= this.viewportWidth) {
        lines.push({
          position: px(x),
          orientation: 'vertical',
          isCenter: i === 0
        });
      }
    }
    
    // Generate horizontal lines (including center)
    for (let i = -linesNeededTop; i <= linesNeededBottom; i++) {
      const y = Number(this.viewportCenter.y) + (i * Number(this.gridSpacing));
      if (y >= 0 && y <= this.viewportHeight) {
        lines.push({
          position: px(y),
          orientation: 'horizontal',
          isCenter: i === 0
        });
      }
    }
    
    return lines;
  }

  /**
   * Gets the grid position for a given screen position
   * @param position The screen position to convert
   * @returns The grid position as an object with x and y properties
   */
  getCardGridPosition(position: ScreenPosition): { x: number, y: number } {
    const x = ((Number(position.x) - Number(this.viewportCenter.x)) / Number(this.gridSpacing));
    const y = ((Number(position.y) - Number(this.viewportCenter.y)) / Number(this.gridSpacing));
    return { x, y };
  }

  /**
   * Gets the viewport center position
   */
  getViewportCenter(): ScreenPosition {
    return this.viewportCenter;
  }

  /**
   * Updates viewport dimensions
   */
  updateViewportSize(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.recalculateCenter();
  }

  /**
   * Updates grid spacing
   */
  updateGridSpacing(spacing: Pixels): void {
    this.gridSpacing = spacing;
  }

  /**
   * Gets current grid spacing
   */
  getGridSpacing(): Pixels {
    return this.gridSpacing;
  }

  /**
   * Recalculates and caches the viewport center
   * @private
   */
  private recalculateCenter(): void {
    this.viewportCenter = screenPos(
      Math.floor(this.viewportWidth / 2),
      Math.floor(this.viewportHeight / 2)
    );
  }
}