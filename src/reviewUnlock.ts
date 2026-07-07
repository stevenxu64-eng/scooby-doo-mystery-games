/**
 * Review helper: visiting the game with ?unlock=doors opens every passage
 * (merging into any existing save, wiping nothing) so all ten areas can be
 * toured freely. Runs before the store module hydrates from localStorage —
 * this file must stay the FIRST import in main.tsx.
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

interface PersistedSave {
  state: {
    activeRoom: string
    playerInventory: string[]
    gameFlags: Record<string, boolean>
    activeCharacter: string
    introSeen: boolean
    caseLog?: unknown[]
  }
  version: number
}

if (new URLSearchParams(window.location.search).get('unlock') === 'doors') {
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
  for (const flag of DOOR_FLAGS) save.state.gameFlags[flag] = true
  save.state.introSeen = true
  localStorage.setItem(KEY, JSON.stringify(save))
}

export {}
