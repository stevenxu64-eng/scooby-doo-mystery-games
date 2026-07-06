import { TILE, type RoomDef, type Vec2 } from '../types/game'
import { TILE_W, TILE_H, WALL_H, centerOffset, isoToScreen, depthOf, type ScreenOffset } from '../utils/iso'
import { getSprite, type SpriteName } from './sprites'
import type { GameState } from '../store/gameStore'

/**
 * All canvas drawing lives here; all coordinate math lives in utils/iso.ts.
 * Every drawable checks for a PNG sprite first and falls back to clean
 * geometric iso shapes (cubes / diamonds) so the game runs without assets.
 */

export interface RenderSnapshot {
  state: GameState
  room: RoomDef
  hover: Vec2 | null
  fps: number
  time: number
}

function diamondPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, w = TILE_W, h = TILE_H): void {
  ctx.beginPath()
  ctx.moveTo(cx, cy - h / 2)
  ctx.lineTo(cx + w / 2, cy)
  ctx.lineTo(cx, cy + h / 2)
  ctx.lineTo(cx - w / 2, cy)
  ctx.closePath()
}

function drawFloorDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  fill: string,
  stroke?: string,
): void {
  const sprite = getSprite('floor')
  if (sprite) {
    ctx.drawImage(sprite, cx - TILE_W / 2, cy - TILE_H / 2, TILE_W, TILE_H)
    return
  }
  diamondPath(ctx, cx, cy)
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

function drawIsoCube(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  height: number,
  top: string,
  left: string,
  right: string,
  spriteName?: SpriteName,
): void {
  if (spriteName) {
    const sprite = getSprite(spriteName)
    if (sprite) {
      const h = TILE_H + height
      ctx.drawImage(sprite, cx - TILE_W / 2, cy + TILE_H / 2 - h, TILE_W, h)
      return
    }
  }
  const topY = cy - height
  // left face
  ctx.beginPath()
  ctx.moveTo(cx - TILE_W / 2, topY)
  ctx.lineTo(cx, topY + TILE_H / 2)
  ctx.lineTo(cx, cy + TILE_H / 2)
  ctx.lineTo(cx - TILE_W / 2, cy)
  ctx.closePath()
  ctx.fillStyle = left
  ctx.fill()
  // right face
  ctx.beginPath()
  ctx.moveTo(cx + TILE_W / 2, topY)
  ctx.lineTo(cx, topY + TILE_H / 2)
  ctx.lineTo(cx, cy + TILE_H / 2)
  ctx.lineTo(cx + TILE_W / 2, cy)
  ctx.closePath()
  ctx.fillStyle = right
  ctx.fill()
  // top face
  diamondPath(ctx, cx, topY)
  ctx.fillStyle = top
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawShadow(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  ctx.beginPath()
  ctx.ellipse(cx, cy, r, r * 0.5, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  ctx.fill()
}

function drawPlayer(ctx: CanvasRenderingContext2D, cx: number, cy: number, hidden: boolean, time: number): void {
  const sprite = getSprite('player')
  ctx.save()
  if (hidden) ctx.globalAlpha = 0.35
  if (sprite) {
    ctx.drawImage(sprite, cx - TILE_W / 2, cy + TILE_H / 2 - 72, TILE_W, 72)
    ctx.restore()
    return
  }
  const bob = Math.sin(time * 6) * 1.5
  drawShadow(ctx, cx, cy + 4, 14)
  // body (Scooby-brown with teal collar — our stand-in for the gang)
  ctx.fillStyle = '#b45309'
  ctx.beginPath()
  ctx.roundRect(cx - 9, cy - 26 + bob, 18, 26, 7)
  ctx.fill()
  ctx.fillStyle = '#2dd4bf'
  ctx.fillRect(cx - 9, cy - 10 + bob, 18, 4)
  // head
  ctx.fillStyle = '#d97706'
  ctx.beginPath()
  ctx.arc(cx, cy - 32 + bob, 9, 0, Math.PI * 2)
  ctx.fill()
  // eyes
  ctx.fillStyle = '#1c1917'
  ctx.beginPath()
  ctx.arc(cx - 3, cy - 33 + bob, 1.6, 0, Math.PI * 2)
  ctx.arc(cx + 3, cy - 33 + bob, 1.6, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawMonster(ctx: CanvasRenderingContext2D, cx: number, cy: number, chasing: boolean, time: number): void {
  const sprite = getSprite('monster')
  const bob = Math.sin(time * 4) * 2
  if (chasing) {
    ctx.beginPath()
    ctx.ellipse(cx, cy + 2, 22, 11, 0, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(239,68,68,0.25)'
    ctx.fill()
  }
  if (sprite) {
    ctx.drawImage(sprite, cx - TILE_W / 2, cy + TILE_H / 2 - 84, TILE_W, 84)
  } else {
    drawShadow(ctx, cx, cy + 4, 16)
    // glowing mummy body
    ctx.fillStyle = chasing ? '#65a30d' : '#4d7c0f'
    ctx.beginPath()
    ctx.roundRect(cx - 12, cy - 34 + bob, 24, 34, 8)
    ctx.fill()
    // bandage wraps
    ctx.strokeStyle = 'rgba(236,252,203,0.7)'
    ctx.lineWidth = 2
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(cx - 12, cy - 28 + i * 8 + bob)
      ctx.lineTo(cx + 12, cy - 24 + i * 8 + bob)
      ctx.stroke()
    }
    // head + glowing eyes
    ctx.fillStyle = '#84cc16'
    ctx.beginPath()
    ctx.arc(cx, cy - 40 + bob, 11, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = chasing ? '#ef4444' : '#fef08a'
    ctx.beginPath()
    ctx.arc(cx - 4, cy - 41 + bob, 2.2, 0, Math.PI * 2)
    ctx.arc(cx + 4, cy - 41 + bob, 2.2, 0, Math.PI * 2)
    ctx.fill()
    // green glow halo
    const glow = ctx.createRadialGradient(cx, cy - 30, 4, cx, cy - 30, 34)
    glow.addColorStop(0, 'rgba(132,204,22,0.28)')
    glow.addColorStop(1, 'rgba(132,204,22,0)')
    ctx.fillStyle = glow
    ctx.fillRect(cx - 36, cy - 66, 72, 72)
  }
  if (chasing) {
    ctx.font = 'bold 22px sans-serif'
    ctx.fillStyle = '#ef4444'
    ctx.textAlign = 'center'
    ctx.fillText('!', cx, cy - 58 + bob)
  }
}

interface Drawable {
  depth: number
  draw: () => void
}

export function drawScene(ctx: CanvasRenderingContext2D, W: number, H: number, snap: RenderSnapshot): void {
  const { state, room, hover, fps, time } = snap
  const grid = room.grid
  const rows = grid.length
  const cols = grid[0].length
  const offset: ScreenOffset = centerOffset(W, H, cols, rows)
  const pal = room.palette

  ctx.clearRect(0, 0, W, H)

  // ---- Pass 1: flat floor layer (floors, doors, hiding spots, patrol dots, hover)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const code = grid[y][x]
      if (code === TILE.WALL) continue
      const { x: cx, y: cy } = isoToScreen(x, y, offset)
      drawFloorDiamond(ctx, cx, cy, (x + y) % 2 === 0 ? pal.floor_a : pal.floor_b, 'rgba(0,0,0,0.25)')
      if (code === TILE.DOOR) {
        diamondPath(ctx, cx, cy, TILE_W * 0.72, TILE_H * 0.72)
        ctx.strokeStyle = '#22d3ee'
        ctx.lineWidth = 2
        ctx.stroke()
      } else if (code === TILE.HIDING) {
        const pulse = 0.45 + Math.sin(time * 3) * 0.2
        diamondPath(ctx, cx, cy, TILE_W * 0.78, TILE_H * 0.78)
        ctx.strokeStyle = `rgba(74,222,128,${pulse})`
        ctx.lineWidth = 2.5
        ctx.stroke()
        const spriteHide = getSprite('hiding')
        if (spriteHide) ctx.drawImage(spriteHide, cx - TILE_W / 2, cy - TILE_H, TILE_W, TILE_H * 1.5)
      }
    }
  }

  // Patrol route dots (readable AI: shows where the Mummy walks)
  if (room.monster) {
    for (const wp of room.monster.patrol) {
      const { x: cx, y: cy } = isoToScreen(wp.x, wp.y, offset)
      diamondPath(ctx, cx, cy, 10, 5)
      ctx.fillStyle = 'rgba(248,113,113,0.4)'
      ctx.fill()
    }
  }

  // Hover highlight
  if (hover && grid[hover.y]?.[hover.x] !== undefined && grid[hover.y][hover.x] !== TILE.WALL) {
    const { x: cx, y: cy } = isoToScreen(hover.x, hover.y, offset)
    diamondPath(ctx, cx, cy)
    ctx.strokeStyle = 'rgba(251,191,36,0.9)'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // ---- Pass 2: depth-sorted solids (walls, interactives, player, monster)
  const drawables: Drawable[] = []

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const code = grid[y][x]
      const { x: cx, y: cy } = isoToScreen(x, y, offset)
      if (code === TILE.WALL) {
        drawables.push({
          depth: depthOf(x, y),
          draw: () => drawIsoCube(ctx, cx, cy, WALL_H, pal.wall_top, pal.wall_left, pal.wall_right, 'wall'),
        })
      } else if (code === TILE.INTERACTIVE) {
        const def = room.interactives.find((i) => i.x === x && i.y === y)
        const used = def ? state.usedInteractives.includes(def.id) : false
        drawables.push({
          depth: depthOf(x, y),
          draw: () => {
            drawIsoCube(ctx, cx, cy, 24, used ? '#a8a29e' : '#fbbf24', '#92700c', '#b8860b', 'interactive')
            if (!used) {
              const bob = Math.sin(time * 3 + x) * 2
              ctx.font = 'bold 15px sans-serif'
              ctx.fillStyle = '#fde68a'
              ctx.textAlign = 'center'
              ctx.fillText('?', cx, cy - 34 + bob)
            }
          },
        })
      }
    }
  }

  const hidden = state.gameMode === 'HIDING'
  const p = state.playerPosition
  const pScreen = isoToScreen(p.x, p.y, offset)
  drawables.push({
    depth: depthOf(p.x, p.y) + 0.01,
    draw: () => drawPlayer(ctx, pScreen.x, pScreen.y, hidden, time),
  })

  if (state.monsterPosition) {
    const m = state.monsterPosition
    const mScreen = isoToScreen(m.x, m.y, offset)
    const chasing = state.monsterAI?.mode === 'CHASE'
    drawables.push({
      depth: depthOf(m.x, m.y) + 0.01,
      draw: () => drawMonster(ctx, mScreen.x, mScreen.y, chasing ?? false, time),
    })
  }

  drawables.sort((a, b) => a.depth - b.depth)
  for (const d of drawables) d.draw()

  // ---- Vignette + HUD text
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H / 3, W / 2, H / 2, H)
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, 'rgba(0,0,0,0.55)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, W, H)

  ctx.font = '11px monospace'
  ctx.fillStyle = 'rgba(148,163,184,0.8)'
  ctx.textAlign = 'left'
  ctx.fillText(`${fps.toFixed(0)} fps`, 8, H - 8)
}
