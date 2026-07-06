/**
 * HTML5 Audio manager. Files resolve from /public/assets/audio/ by name:
 * `<name>.mp3` is tried first (drop in your own from Freesound.org), falling
 * back to the bundled procedurally-generated `<name>.wav`. If both are
 * missing the sound fails silently.
 *
 * Names used by the game:
 *   sfx:   click, pickup, door, solve, caught, error, hide
 *   loops: ambience_museum (drone), chase (pursuit loop)
 */

const AUDIO_BASE = '/assets/audio/'

let muted = false
let ambienceEl: HTMLAudioElement | null = null
let currentAmbience: string | null = null
let chaseEl: HTMLAudioElement | null = null

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

export function setAmbience(name: string | undefined, volume = 0.25): void {
  if (name === currentAmbience) return
  ambienceEl?.pause()
  ambienceEl = null
  currentAmbience = name ?? null
  if (!name) return
  ambienceEl = makeAudio(name, true, true, volume)
}

/** Chase loop toggled by the monster's state machine. */
export function setChaseLoop(on: boolean): void {
  if (on) {
    if (chaseEl || muted) return
    chaseEl = makeAudio('chase', true, true, 0.5)
  } else {
    chaseEl?.pause()
    chaseEl = null
  }
}

export function toggleMute(): boolean {
  muted = !muted
  if (muted) {
    ambienceEl?.pause()
    chaseEl?.pause()
  } else {
    void ambienceEl?.play().catch(() => {})
    void chaseEl?.play().catch(() => {})
  }
  return muted
}
