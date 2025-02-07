import { describe, it, expect } from 'vitest';
import { GridService } from './gridService';
import { px, screenPos } from '../types';

/**
 * CRITICAL: DO NOT UPDATE THESE TESTS UNLESS THEY ARE FAILING!
 * These tests define the expected behavior and serve as the specification.
 * If you need to change the behavior, discuss with the team first.
 * 
 * The grid line calculations are a core part of the application's layout system.
 * Any changes to these tests could have far-reaching effects on:
 * - Card positioning
 * - Grid line rendering
 * - Snapping behavior
 * - Overall visual consistency
 */
describe('GridService', () => {
  describe('calculateGridLines', () => {
    // Start with a minimal 2x2 viewport case
    it('handles minimal 2x2 viewport case', () => {
      // Create a 2x2 viewport with 2px grid spacing
      // This ensures only center lines are generated since:
      // - Viewport is 2x2
      // - Center is at (1,1)
      // - Grid spacing of 2px means next lines would be at -1 and 3 (outside viewport)
      const service = new GridService(px(2), 2, 2);
      const lines = service.calculateGridLines();

      // Should generate exactly 2 lines - one horizontal and one vertical at center (1)
      expect(lines).toHaveLength(2);

      // Verify horizontal center line
      const horizontalCenter = lines.find(l => l.orientation === 'horizontal' && l.isCenter);
      expect(horizontalCenter).toBeDefined();
      expect(Number(horizontalCenter?.position)).toBe(1); // Center at floor(2/2)

      // Verify vertical center line
      const verticalCenter = lines.find(l => l.orientation === 'vertical' && l.isCenter);
      expect(verticalCenter).toBeDefined();
      expect(Number(verticalCenter?.position)).toBe(1); // Center at floor(2/2)
    });

    // Test invalid/edge cases
    it('returns empty array for invalid dimensions', () => {
      const invalidCases = [
        [0, 0],    // Zero dimensions
        [-1, 1],   // Negative width
        [1, -1],   // Negative height
        [0, 1],    // Zero width
        [1, 0]     // Zero height
      ];

      invalidCases.forEach(([width, height]) => {
        const service = new GridService(px(50), width, height);
        expect(service.calculateGridLines()).toEqual([]);
      });
    });

    // Test a simple but realistic case
    it('generates correct grid for 100x100 viewport with 50px spacing', () => {
      const service = new GridService(px(50), 100, 100);
      const lines = service.calculateGridLines();

      // Separate lines by orientation
      const horizontalLines = lines.filter(l => l.orientation === 'horizontal');
      const verticalLines = lines.filter(l => l.orientation === 'vertical');

      // For 100x100 viewport with 50px spacing:
      // - Center at (50,50)
      // - Lines at 0, 50, 100 for both directions
      expect(horizontalLines).toHaveLength(3);
      expect(verticalLines).toHaveLength(3);

      // Check horizontal line positions
      const horizontalPositions = horizontalLines
        .map(l => Number(l.position))
        .sort((a, b) => a - b);
      expect(horizontalPositions).toEqual([0, 50, 100]);

      // Check vertical line positions
      const verticalPositions = verticalLines
        .map(l => Number(l.position))
        .sort((a, b) => a - b);
      expect(verticalPositions).toEqual([0, 50, 100]);

      // Verify center lines are marked correctly
      const centerH = horizontalLines.find(l => l.isCenter);
      const centerV = verticalLines.find(l => l.isCenter);
      expect(centerH?.position).toBe(px(50));
      expect(centerV?.position).toBe(px(50));
    });

    // Test asymmetric viewport
    it('handles asymmetric viewport correctly', () => {
      const service = new GridService(px(50), 150, 100);
      const lines = service.calculateGridLines();

      const horizontalLines = lines.filter(l => l.orientation === 'horizontal');
      const verticalLines = lines.filter(l => l.orientation === 'vertical');

      // For 150x100 viewport with 50px spacing:
      // Horizontal: 0, 50, 100 (3 lines)
      // Vertical: 25, 75, 125 (3 lines)
      expect(horizontalLines).toHaveLength(3);
      expect(verticalLines).toHaveLength(3);

      // Check horizontal line positions
      const horizontalPositions = horizontalLines
        .map(l => Number(l.position))
        .sort((a, b) => a - b);
      expect(horizontalPositions).toEqual([0, 50, 100]);

      // Check vertical line positions
      const verticalPositions = verticalLines
        .map(l => Number(l.position))
        .sort((a, b) => a - b);
      expect(verticalPositions).toEqual([25, 75, 125]);

      // Center lines should be at floor(width/2) and floor(height/2)
      const centerH = horizontalLines.find(l => l.isCenter);
      const centerV = verticalLines.find(l => l.isCenter);
      expect(centerH?.position).toBe(px(50));  // floor(100/2)
      expect(centerV?.position).toBe(px(75));  // floor(150/2)
    });
  });

  describe('viewport center calculation', () => {
    it('calculates center correctly for even dimensions', () => {
      const service = new GridService(px(50), 100, 100);
      expect(service.getViewportCenter()).toEqual(screenPos(50, 50));
    });

    it('calculates center correctly for odd dimensions', () => {
      const service = new GridService(px(50), 101, 101);
      // Should floor odd dimensions
      expect(service.getViewportCenter()).toEqual(screenPos(50, 50));
    });
  });

  describe('viewport updates', () => {
    it('updates grid when viewport size changes', () => {
      const service = new GridService(px(50), 100, 100);
      service.updateViewportSize(200, 150);
      
      const lines = service.calculateGridLines();
      const horizontalLines = lines.filter(l => l.orientation === 'horizontal');
      const verticalLines = lines.filter(l => l.orientation === 'vertical');

      // For 200x150 viewport with 50px spacing:
      // Horizontal: 25, 75, 125 (3 lines)
      // Vertical: 0, 50, 100, 150, 200 (5 lines)
      expect(horizontalLines).toHaveLength(3);
      expect(verticalLines).toHaveLength(5);

      // Verify line positions
      const horizontalPositions = horizontalLines
        .map(l => Number(l.position))
        .sort((a, b) => a - b);
      expect(horizontalPositions).toEqual([25, 75, 125]);

      const verticalPositions = verticalLines
        .map(l => Number(l.position))
        .sort((a, b) => a - b);
      expect(verticalPositions).toEqual([0, 50, 100, 150, 200]);

      // Center should be at (100,75)
      expect(service.getViewportCenter()).toEqual(screenPos(100, 75));
    });

    it('updates grid when spacing changes', () => {
      const service = new GridService(px(50), 100, 100);
      service.updateGridSpacing(px(25));
      
      const lines = service.calculateGridLines();
      const horizontalLines = lines.filter(l => l.orientation === 'horizontal');
      const verticalLines = lines.filter(l => l.orientation === 'vertical');

      // For 100x100 viewport with 25px spacing:
      // Lines at 0, 25, 50, 75, 100 for both directions
      expect(horizontalLines).toHaveLength(5);
      expect(verticalLines).toHaveLength(5);

      // Verify line positions
      const positions = horizontalLines
        .map(l => Number(l.position))
        .sort((a, b) => a - b);
      expect(positions).toEqual([0, 25, 50, 75, 100]);
    });
  });
});