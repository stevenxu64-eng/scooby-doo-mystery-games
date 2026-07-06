import { TILE, type Vec2 } from '../types/game'

/**
 * Grid line-of-sight via Bresenham's line algorithm.
 * Walls (1) and tall interactive objects (2) block sight;
 * floors, hiding spots, and doors do not.
 */
export function blocksSight(code: number): boolean {
  return code === TILE.WALL || code === TILE.INTERACTIVE
}

export function hasLineOfSight(grid: number[][], from: Vec2, to: Vec2): boolean {
  let x0 = Math.round(from.x)
  let y0 = Math.round(from.y)
  const x1 = Math.round(to.x)
  const y1 = Math.round(to.y)

  const dx = Math.abs(x1 - x0)
  const dy = -Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx + dy

  for (;;) {
    // Endpoints never block their own line.
    if (!(x0 === x1 && y0 === y1) && grid[y0]?.[x0] !== undefined && blocksSight(grid[y0][x0])) {
      return false
    }
    if (x0 === x1 && y0 === y1) return true
    const e2 = 2 * err
    if (e2 >= dy) {
      err += dy
      x0 += sx
    }
    if (e2 <= dx) {
      err += dx
      y0 += sy
    }
  }
}
