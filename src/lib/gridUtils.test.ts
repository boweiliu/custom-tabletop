import { describe, it, expect } from 'vitest';
import { snapToGridHalfOffset, getCardTopLeft, getCardCenter, privateFunctions } from './gridUtils';
import { screenPos, px } from './types';
import type { ScreenPosition, Pixels } from './types';

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

const { roundToOdd, roundToHalf } = privateFunctions;

describe('gridUtils', () => {
  describe('roundToOdd', () => {
    it('should round to the nearest odd number, rounding up', () => {
      expect(roundToOdd(4)).toEqual(5);
      expect(roundToOdd(5)).toEqual(5);
      expect(roundToOdd(6)).toEqual(7);
    });

    it('should handle decimal values', () => {
      expect(roundToOdd(4.5)).toEqual(5);
      expect(roundToOdd(5.5)).toEqual(5);
      expect(roundToOdd(6.5)).toEqual(7);
      expect(roundToOdd(7.4)).toEqual(7);
      expect(roundToOdd(8.4)).toEqual(9);
    });
  });

  describe('snapToGridHalfOffset', () => {
    // Basic test case
    it('should snap a point to the nearest half-grid position with grid spacing 100', () => {
      const viewportCenter = screenPos(500, 500);
      const gridSpacing = px(100);
      const input = screenPos(80, 80);
      const expected = screenPos(50, 50);
      
      const result = snapToGridHalfOffset(input, viewportCenter, gridSpacing);
      expect(result).toEqual(expected);
    });

    // Advanced test cases
    it('should snap to half-grid positions relative to viewport center', () => {
      const viewportCenter = screenPos(500, 500);
      const gridSpacing = px(100);

      const testCases: Array<[ScreenPosition, ScreenPosition]> = [
        // Points near 50,50 (half-grid position)
        [screenPos(40, 40), screenPos(50, 50)],
        [screenPos(60, 60), screenPos(50, 50)],
        
        // Points near 150,150 (half-grid position)
        [screenPos(140, 140), screenPos(150, 150)],
        [screenPos(160, 160), screenPos(150, 150)],
        
        // Asymmetric cases
        [screenPos(40, 140), screenPos(50, 150)],
        [screenPos(140, 40), screenPos(150, 50)],
        
        // Edge cases exactly between snap points
        [screenPos(100, 100), screenPos(150, 150)], // Should prefer next half-grid point
        [screenPos(0, 0), screenPos(50, 50)]        // Should prefer positive direction
      ];

      testCases.forEach(([input, expected]) => {
        const result = snapToGridHalfOffset(input, viewportCenter, gridSpacing);
        expect(result).toEqual(expected);
      });
    });

    it('should handle different grid spacings', () => {
      const viewportCenter = screenPos(500, 500);
      const position = screenPos(520, 520);
      
      // With 100px grid spacing
      expect(snapToGridHalfOffset(position, viewportCenter, px(100)))
        .toEqual(screenPos(550, 550));
      
      // With 50px grid spacing
      expect(snapToGridHalfOffset(position, viewportCenter, px(50)))
        .toEqual(screenPos(525, 525));
      
      // With 25px grid spacing, rounding up
      expect(snapToGridHalfOffset(position, viewportCenter, px(25)))
        .toEqual(screenPos(513, 513));
    });

    it('should handle different viewport centers', () => {
      const position = screenPos(320, 320);
      const gridSpacing = px(100);
      
      // With center at 300,300
      expect(snapToGridHalfOffset(position, screenPos(300, 300), gridSpacing))
        .toEqual(screenPos(350, 350));
      
      // With center at 400,400
      expect(snapToGridHalfOffset(position, screenPos(400, 400), gridSpacing))
        .toEqual(screenPos(350, 350));
    });
  });

  describe('getCardTopLeft', () => {
    it('should calculate correct top-left position from center', () => {
      const center = screenPos(500, 500);
      const width = px(200);
      const height = px(300);
      
      const topLeft = getCardTopLeft(center, width, height);
      expect(topLeft).toEqual(screenPos(400, 350));
    });
  });

  describe('getCardCenter', () => {
    it('should calculate correct center from top-left position', () => {
      const topLeft = screenPos(400, 350);
      const width = px(200);
      const height = px(300);
      
      const center = getCardCenter(topLeft, width, height);
      expect(center).toEqual(screenPos(500, 500));
    });
  });
});