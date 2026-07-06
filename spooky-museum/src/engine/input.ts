import type { Vec2 } from '../types/game'

/** Keyboard state singleton, read by the store's tick — kept out of React/Zustand. */

const pressed = new Set<string>()

function onKeyDown(e: KeyboardEvent): void {
  pressed.add(e.key.toLowerCase())
}

function onKeyUp(e: KeyboardEvent): void {
  pressed.delete(e.key.toLowerCase())
}

function onBlur(): void {
  pressed.clear()
}

export function attachInput(): void {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)
}

export function detachInput(): void {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('blur', onBlur)
  pressed.clear()
}

/** Current held movement direction (grid-aligned), or null. */
export function heldDirection(): Vec2 | null {
  if (pressed.has('arrowup') || pressed.has('w')) return { x: 0, y: -1 }
  if (pressed.has('arrowdown') || pressed.has('s')) return { x: 0, y: 1 }
  if (pressed.has('arrowleft') || pressed.has('a')) return { x: -1, y: 0 }
  if (pressed.has('arrowright') || pressed.has('d')) return { x: 1, y: 0 }
  return null
}
