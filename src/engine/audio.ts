/**
 * Lightweight HTML5 Audio wrapper.
 *
 * Files resolve from /public/assets/audio/ by name. For each sound the
 * manager tries `<name>.mp3` first (drop in your own from Freesound.org),
 * then falls back to the bundled procedurally-generated `<name>.wav`.
 * If both are missing it fails silently — the game runs fine without audio.
 *
 * Names used by the game:
 *   click, pickup, unlock, rattle, trap, error, combine, switch,
 *   ambience_lobby, ambience_grounds, ambience_closet, ambience_boiler
 */

const AUDIO_BASE = `${import.meta.env.BASE_URL}assets/audio/`

let ambienceEl: HTMLAudioElement | null = null
let currentAmbience: string | null = null
let muted = false
let unlockAttached = false

/**
 * Browsers block autoplay until the first user gesture. Call once on mount:
 * the first click/keypress resumes whatever ambience loop was blocked.
 */
export function attachAudioUnlock(): void {
  if (unlockAttached) return
  unlockAttached = true
  const resume = () => {
    window.removeEventListener('pointerdown', resume)
    window.removeEventListener('keydown', resume)
    if (!muted && ambienceEl?.paused) void ambienceEl.play().catch(() => {})
  }
  window.addEventListener('pointerdown', resume)
  window.addEventListener('keydown', resume)
}

function makeAudio(name: string, autoplay: boolean, loop = false, volume = 0.6): HTMLAudioElement {
  const el = new Audio(`${AUDIO_BASE}${name}.mp3`)
  el.loop = loop
  el.volume = volume
  el.addEventListener('error', () => {
    // mp3 missing → retry with the generated wav; wav missing → stay silent.
    if (el.src.endsWith('.mp3')) {
      el.src = `${AUDIO_BASE}${name}.wav`
      if (autoplay && !muted) void el.play().catch(() => {})
    }
  })
  if (autoplay && !muted) void el.play().catch(() => {})
  return el
}

export function playSfx(name: string, volume = 0.6): void {
  if (muted) return
  makeAudio(name, true, false, volume)
}

export function setAmbience(name: string | undefined, volume = 0.3): void {
  if (name === currentAmbience) return
  if (ambienceEl) {
    ambienceEl.pause()
    ambienceEl = null
  }
  currentAmbience = name ?? null
  if (!name) return
  ambienceEl = makeAudio(name, true, true, volume)
}

export function toggleMute(): boolean {
  muted = !muted
  if (muted && ambienceEl) {
    ambienceEl.pause()
  } else if (!muted && ambienceEl) {
    void ambienceEl.play().catch(() => {})
  }
  return muted
}

export function isMuted(): boolean {
  return muted
}
