import { TILE, type Vec2 } from '../types/game'

/**
 * A* pathfinding over the room grid (4-directional, Manhattan heuristic).
 * Used by the player's click-to-move AND the monster's patrol/chase AI.
 */

export function isWalkableTile(code: number): boolean {
  return code === TILE.FLOOR || code === TILE.HIDING || code === TILE.DOOR
}

interface Node {
  x: number
  y: number
  g: number
  f: number
  parent: Node | null
}

/** Binary min-heap keyed on f-score. */
class MinHeap {
  private items: Node[] = []

  get size(): number {
    return this.items.length
  }

  push(node: Node): void {
    this.items.push(node)
    let i = this.items.length - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (this.items[parent].f <= this.items[i].f) break
      ;[this.items[parent], this.items[i]] = [this.items[i], this.items[parent]]
      i = parent
    }
  }

  pop(): Node | undefined {
    const top = this.items[0]
    const last = this.items.pop()
    if (this.items.length > 0 && last) {
      this.items[0] = last
      let i = 0
      for (;;) {
        const l = i * 2 + 1
        const r = l + 1
        let smallest = i
        if (l < this.items.length && this.items[l].f < this.items[smallest].f) smallest = l
        if (r < this.items.length && this.items[r].f < this.items[smallest].f) smallest = r
        if (smallest === i) break
        ;[this.items[smallest], this.items[i]] = [this.items[i], this.items[smallest]]
        i = smallest
      }
    }
    return top
  }
}

const NEIGHBORS: Vec2[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

/**
 * Returns the tile path from start to goal (goal included, start excluded).
 * Empty array = unreachable or already there.
 */
export function findPath(
  grid: number[][],
  start: Vec2,
  goal: Vec2,
  walkable: (code: number) => boolean = isWalkableTile,
): Vec2[] {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows
  if (!inBounds(start.x, start.y) || !inBounds(goal.x, goal.y)) return []
  if (!walkable(grid[goal.y][goal.x])) return []
  if (start.x === goal.x && start.y === goal.y) return []

  const key = (x: number, y: number) => y * cols + x
  const h = (x: number, y: number) => Math.abs(x - goal.x) + Math.abs(y - goal.y)

  const open = new MinHeap()
  const bestG = new Map<number, number>()
  const closed = new Set<number>()

  const startNode: Node = { x: start.x, y: start.y, g: 0, f: h(start.x, start.y), parent: null }
  open.push(startNode)
  bestG.set(key(start.x, start.y), 0)

  while (open.size > 0) {
    const current = open.pop()!
    const ck = key(current.x, current.y)
    if (closed.has(ck)) continue
    closed.add(ck)

    if (current.x === goal.x && current.y === goal.y) {
      const path: Vec2[] = []
      let node: Node | null = current
      while (node && node.parent) {
        path.push({ x: node.x, y: node.y })
        node = node.parent
      }
      return path.reverse()
    }

    for (const d of NEIGHBORS) {
      const nx = current.x + d.x
      const ny = current.y + d.y
      if (!inBounds(nx, ny) || !walkable(grid[ny][nx])) continue
      const nk = key(nx, ny)
      if (closed.has(nk)) continue
      const g = current.g + 1
      const known = bestG.get(nk)
      if (known !== undefined && known <= g) continue
      bestG.set(nk, g)
      open.push({ x: nx, y: ny, g, f: g + h(nx, ny), parent: current })
    }
  }
  return []
}

/** Walkable tiles orthogonally adjacent to (x, y) — e.g. where to stand to use an object. */
export function walkableNeighbors(grid: number[][], x: number, y: number): Vec2[] {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  return NEIGHBORS.map((d) => ({ x: x + d.x, y: y + d.y })).filter(
    (p) => p.x >= 0 && p.y >= 0 && p.x < cols && p.y < rows && isWalkableTile(grid[p.y][p.x]),
  )
}
