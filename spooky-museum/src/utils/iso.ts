import type { Vec2 } from '../types/game'

/**
 * Pure isometric layout math — no canvas calls in this file.
 * Screen projection follows the standard 2:1 diamond formulas:
 *   screenX = (isoX - isoY) * (TILE_W / 2) + offset.x
 *   screenY = (isoX + isoY) * (TILE_H / 2) + offset.y
 */

export const TILE_W = 64
export const TILE_H = 32
export const WALL_H = 42

export interface ScreenOffset {
  x: number
  y: number
}

export function isoToScreen(isoX: number, isoY: number, offset: ScreenOffset): Vec2 {
  return {
    x: (isoX - isoY) * (TILE_W / 2) + offset.x,
    y: (isoX + isoY) * (TILE_H / 2) + offset.y,
  }
}

/** Inverse projection: canvas pixel → fractional iso coordinates. */
export function screenToIso(screenX: number, screenY: number, offset: ScreenOffset): Vec2 {
  const dx = screenX - offset.x
  const dy = screenY - offset.y
  return {
    x: dy / TILE_H + dx / TILE_W,
    y: dy / TILE_H - dx / TILE_W,
  }
}

/** Offset that centers a cols×rows grid inside a canvas. */
export function centerOffset(canvasW: number, canvasH: number, cols: number, rows: number): ScreenOffset {
  return {
    x: canvasW / 2 - ((cols - rows) * TILE_W) / 4,
    y: (canvasH - (cols + rows - 2) * (TILE_H / 2)) / 2,
  }
}

/** Painter's-algorithm depth for sorting drawables (higher = drawn later). */
export function depthOf(isoX: number, isoY: number): number {
  return isoX + isoY
}

export function tileEquals(a: Vec2, b: Vec2): boolean {
  return a.x === b.x && a.y === b.y
}

export function roundTile(p: Vec2): Vec2 {
  return { x: Math.round(p.x), y: Math.round(p.y) }
}

export function dist(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}
