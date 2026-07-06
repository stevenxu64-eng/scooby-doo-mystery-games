/**
 * Sprite texture loader with graceful fallback chain:
 *   1. /assets/tiles/<name>.png  — drop in Kenney.nl isometric kit art here
 *   2. /assets/tiles/<name>.svg  — bundled hand-drawn vector sprites
 *   3. nothing loaded            — renderer draws geometric iso shapes
 *
 * Loaded images are rasterized once into offscreen canvases so the
 * per-frame drawImage cost is identical for PNG and SVG sources.
 */

export type SpriteName =
  | 'floor'
  | 'wall'
  | 'door'
  | 'hiding'
  | 'interactive'
  | 'player'
  | 'monster'

const NAMES: SpriteName[] = ['floor', 'wall', 'door', 'hiding', 'interactive', 'player', 'monster']

const rasters = new Map<SpriteName, HTMLCanvasElement>()
let loaded = false

function tryLoad(name: SpriteName, ext: 'png' | 'svg', onFail?: () => void): void {
  const img = new Image()
  img.addEventListener('load', () => {
    if (img.naturalWidth === 0) {
      onFail?.()
      return
    }
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    canvas.getContext('2d')?.drawImage(img, 0, 0)
    rasters.set(name, canvas)
  })
  img.addEventListener('error', () => onFail?.())
  img.src = `${import.meta.env.BASE_URL}assets/tiles/${name}.${ext}`
}

export function loadSprites(): void {
  if (loaded) return
  loaded = true
  for (const name of NAMES) {
    tryLoad(name, 'png', () => tryLoad(name, 'svg'))
  }
}

/** Returns the rasterized texture, or null → caller draws its geometric fallback. */
export function getSprite(name: SpriteName): HTMLCanvasElement | null {
  return rasters.get(name) ?? null
}
