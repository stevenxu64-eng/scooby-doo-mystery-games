import { useEffect, useRef } from 'react'
import { MAPS, useGameStore } from '../store/gameStore'
import { drawScene } from '../engine/render'
import { loadSprites } from '../engine/sprites'
import { attachInput, detachInput } from '../engine/input'
import { setAmbience } from '../engine/audio'
import { centerOffset, roundTile, screenToIso } from '../utils/iso'
import type { Vec2 } from '../types/game'

export const CANVAS_W = 960
export const CANVAS_H = 600

/**
 * Core render component: owns the requestAnimationFrame loop, forwards dt to
 * the store's tick (game logic), and hands the resulting snapshot to the
 * renderer. Also translates mouse clicks back through the inverse isometric
 * projection for click-to-move / click-to-interact.
 */
export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hoverRef = useRef<Vec2 | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    loadSprites()
    attachInput()
    setAmbience(MAPS[useGameStore.getState().activeRoomId].ambience)

    let raf = 0
    let last = performance.now()
    let fps = 60
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (dt > 0) fps = fps * 0.95 + (1 / dt) * 0.05

      const store = useGameStore.getState()
      store.tick(dt)

      const state = useGameStore.getState()
      drawScene(ctx, CANVAS_W, CANVAS_H, {
        state,
        room: MAPS[state.activeRoomId],
        hover: hoverRef.current,
        fps,
        time: now / 1000,
      })
      ;(window as unknown as { __fps?: number }).__fps = fps
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onKey = (e: KeyboardEvent) => {
      const store = useGameStore.getState()
      const key = e.key.toLowerCase()
      if (key === 'e' || key === 'enter' || key === ' ') {
        e.preventDefault()
        store.interact()
      } else if (key === 'c') {
        if (store.gameMode === 'UNMASKING') store.closeBoard()
        else store.openBoard()
      } else if (key === 'escape') {
        store.closePuzzle()
        store.closeBoard()
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      detachInput()
    }
  }, [])

  const canvasTileFromEvent = (e: React.MouseEvent<HTMLCanvasElement>): Vec2 | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const px = (e.clientX - rect.left) * (CANVAS_W / rect.width)
    const py = (e.clientY - rect.top) * (CANVAS_H / rect.height)
    const state = useGameStore.getState()
    const grid = MAPS[state.activeRoomId].grid
    const offset = centerOffset(CANVAS_W, CANVAS_H, grid[0].length, grid.length)
    const tile = roundTile(screenToIso(px, py, offset))
    if (grid[tile.y]?.[tile.x] === undefined) return null
    return tile
  }

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      className="h-auto w-full cursor-pointer rounded-lg"
      onClick={(e) => {
        const tile = canvasTileFromEvent(e)
        if (tile) useGameStore.getState().clickTile(tile)
      }}
      onMouseMove={(e) => {
        hoverRef.current = canvasTileFromEvent(e)
      }}
      onMouseLeave={() => {
        hoverRef.current = null
      }}
    />
  )
}
