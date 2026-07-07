/**
 * Review helpers via URL param (merged into any existing save, wiping nothing):
 *   ?unlock=doors  — open every passage so all ten areas can be toured
 *   ?unlock=finale — everything staged in the boiler room: net rigged, bait
 *                    set, testimony + witness gathered; pull the lever
 *   ?unlock=solved — jump straight to the MYSTERY SOLVED screen
 * Runs before the store module hydrates from localStorage — this file must
 * stay the FIRST import in main.tsx.
 */

const DOOR_FLAGS = [
  'closet_unlocked',
  'office_unlocked',
  'shed_lit',
  'path_cleared',
  'hatch_open',
  'trap_room_open',
  'door_217_open',
  'boiler_door_open',
]

const FINALE_FLAGS = [
  ...DOOR_FLAGS,
  'found_glowing_paint',
  'knows_truth',
  'george_freed',
  'george_witness',
  'rope_set',
  'bait_set',
]

interface PersistedSave {
  state: {
    activeRoom: string
    playerInventory: string[]
    gameFlags: Record<string, boolean>
    activeCharacter: string
    introSeen: boolean
    caseLog?: unknown[]
    gameWon?: boolean
  }
  version: number
}

const mode = new URLSearchParams(window.location.search).get('unlock')
if (mode === 'doors' || mode === 'finale' || mode === 'solved') {
  const KEY = 'scooby-resort-save'
  let save: PersistedSave | null = null
  try {
    save = JSON.parse(localStorage.getItem(KEY) ?? 'null') as PersistedSave | null
  } catch {
    save = null
  }
  if (!save?.state) {
    save = {
      state: {
        activeRoom: 'lobby',
        playerInventory: [],
        gameFlags: {},
        activeCharacter: 'Fred',
        introSeen: true,
      },
      version: 1,
    }
  }
  save.state.gameFlags = save.state.gameFlags ?? {}
  const flags = mode === 'doors' ? DOOR_FLAGS : FINALE_FLAGS
  for (const flag of flags) save.state.gameFlags[flag] = true
  save.state.introSeen = true
  if (mode !== 'doors') save.state.activeRoom = 'trap_room'
  if (mode === 'solved') {
    save.state.gameFlags.trap_sprung = true
    save.state.gameWon = true
  }
  localStorage.setItem(KEY, JSON.stringify(save))
}

export {}
