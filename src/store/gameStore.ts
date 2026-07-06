import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  CharacterId,
  Direction,
  DialogueChoice,
  DialogueMap,
  GameAction,
  Hotspot,
  SceneMap,
} from '../types/game'
import scenesJson from '../data/scenes.json'
import dialoguesJson from '../data/dialogues.json'
import { COMBINE_RECIPES, ITEMS } from '../data/items'
import { CHARACTERS } from '../data/characters'
import { playSfx } from '../engine/audio'

export const SCENES = scenesJson as unknown as SceneMap
export const DIALOGUES = dialoguesJson as unknown as DialogueMap

const START_ROOM = 'lobby'

export interface GameState {
  activeRoom: string
  playerInventory: string[]
  gameFlags: Record<string, boolean>
  activeCharacter: CharacterId
  selectedItem: string | null
  message: string | null
  /** Bumped on every message so the UI can replay its entry animation. */
  messageId: number
  activeDialogue: { id: string; node: string } | null
  gameWon: boolean
  showHotspotHints: boolean

  hasFlag: (flag: string) => boolean
  hasAllFlags: (flags?: string[]) => boolean
  isHotspotVisible: (h: Hotspot) => boolean
  runActions: (actions: GameAction[]) => void
  clickHotspot: (h: Hotspot) => void
  moveTo: (direction: Direction) => void
  setCharacter: (id: CharacterId) => void
  selectItem: (id: string) => void
  chooseDialogueOption: (choice: DialogueChoice) => void
  showMessage: (text: string) => void
  toggleHotspotHints: () => void
  resetGame: () => void
}

const initialState = {
  activeRoom: START_ROOM,
  playerInventory: [] as string[],
  gameFlags: {} as Record<string, boolean>,
  activeCharacter: 'Velma' as CharacterId,
  selectedItem: null as string | null,
  message: SCENES[START_ROOM].description,
  messageId: 0,
  activeDialogue: null as { id: string; node: string } | null,
  gameWon: false,
  showHotspotHints: false,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
  ...initialState,

  hasFlag: (flag) => !!get().gameFlags[flag],

  hasAllFlags: (flags) => !flags || flags.every((f) => !!get().gameFlags[f]),

  isHotspotVisible: (h) => {
    const { gameFlags } = get()
    if (h.hidden_if_flags?.some((f) => gameFlags[f])) return false
    if (h.visible_if_flags && !h.visible_if_flags.every((f) => gameFlags[f])) return false
    return true
  },

  showMessage: (text) =>
    set((s) => ({ message: text, messageId: s.messageId + 1 })),

  runActions: (actions) => {
    for (const action of actions) {
      switch (action.type) {
        case 'add_to_inventory':
          if (action.item && !get().playerInventory.includes(action.item)) {
            set((s) => ({ playerInventory: [...s.playerInventory, action.item!] }))
          }
          break
        case 'remove_from_inventory':
          if (action.item) {
            set((s) => ({
              playerInventory: s.playerInventory.filter((i) => i !== action.item),
            }))
          }
          break
        case 'set_flag':
          if (action.flag) {
            set((s) => ({
              gameFlags: { ...s.gameFlags, [action.flag!]: action.value ?? true },
            }))
          }
          break
        case 'show_message':
          if (action.text) get().showMessage(action.text)
          break
        case 'start_dialogue':
          if (action.dialogue && DIALOGUES[action.dialogue]) {
            set({ activeDialogue: { id: action.dialogue, node: 'start' } })
          }
          break
        case 'play_sfx':
          if (action.sfx) playSfx(action.sfx)
          break
        case 'end_game':
          set({ gameWon: true })
          break
      }
    }
  },

  clickHotspot: (h) => {
    const state = get()
    if (state.activeDialogue || state.gameWon) return

    // 1. Character gate — the walkie-talkie exists for a reason.
    if (h.required_character && state.activeCharacter !== h.required_character) {
      playSfx('error', 0.4)
      state.showMessage(
        h.wrong_character_message ??
          `${CHARACTERS[state.activeCharacter].name} can't do this. Maybe someone else in the gang can — try the walkie-talkie.`,
      )
      return
    }

    // 2. Flag gate — puzzle prerequisites.
    if (!state.hasAllFlags(h.required_flags)) {
      playSfx('error', 0.4)
      state.showMessage(h.locked_message ?? 'Nothing happens... yet. Something else must come first.')
      return
    }

    // 3. Item gate — the selected inventory item must match.
    if (h.required_item) {
      if (state.selectedItem !== h.required_item) {
        playSfx('error', 0.4)
        if (state.selectedItem) {
          const itemName = ITEMS[state.selectedItem]?.name ?? state.selectedItem
          state.showMessage(`Using the ${itemName} here doesn't do anything.`)
        } else {
          state.showMessage(
            h.missing_item_message ?? `${h.label}: you need the right item. Select one from the inventory first.`,
          )
        }
        return
      }
      if (h.consume_item) {
        set((s) => ({
          playerInventory: s.playerInventory.filter((i) => i !== h.required_item),
        }))
      }
      set({ selectedItem: null })
    } else if (state.selectedItem) {
      // Clicking a normal hotspot with an item armed just disarms it.
      set({ selectedItem: null })
    }

    state.runActions(h.action_triggers)
  },

  moveTo: (direction) => {
    const state = get()
    if (state.activeDialogue || state.gameWon) return
    const scene = SCENES[state.activeRoom]
    const link = scene.navigation_links.find((l) => l.direction === direction)
    if (!link) return
    if (link.locked_by_flag && !state.gameFlags[link.locked_by_flag]) {
      playSfx('error', 0.4)
      state.showMessage(link.locked_message ?? 'That way is blocked.')
      return
    }
    playSfx('click', 0.3)
    const target = SCENES[link.target]
    set((s) => ({
      activeRoom: link.target,
      selectedItem: null,
      message: target.description,
      messageId: s.messageId + 1,
    }))
  },

  setCharacter: (id) => {
    if (get().activeCharacter === id) return
    playSfx('switch', 0.4)
    set((s) => ({
      activeCharacter: id,
      message: `📻 ${CHARACTERS[id].name}: "${CHARACTERS[id].catchphrase}" — ${CHARACTERS[id].skill}.`,
      messageId: s.messageId + 1,
    }))
  },

  selectItem: (id) => {
    const state = get()
    const selected = state.selectedItem
    if (selected === id) {
      set({ selectedItem: null })
      return
    }
    if (selected) {
      // Second item clicked while one is armed → try to combine.
      const recipe = COMBINE_RECIPES.find(
        (r) =>
          (r.ingredients[0] === selected && r.ingredients[1] === id) ||
          (r.ingredients[0] === id && r.ingredients[1] === selected),
      )
      if (recipe) {
        playSfx('combine', 0.5)
        set((s) => ({
          playerInventory: [
            ...s.playerInventory.filter((i) => i !== recipe.ingredients[0] && i !== recipe.ingredients[1]),
            recipe.result,
          ],
          selectedItem: null,
        }))
        state.showMessage(recipe.message)
        return
      }
      playSfx('error', 0.3)
      state.showMessage(
        `The ${ITEMS[selected]?.name ?? selected} and the ${ITEMS[id]?.name ?? id} don't combine into anything useful.`,
      )
      set({ selectedItem: null })
      return
    }
    playSfx('click', 0.3)
    set({ selectedItem: id })
    const item = ITEMS[id]
    if (item) state.showMessage(`${item.name} selected — ${item.description} Click a hotspot to use it, or another item to combine.`)
  },

  chooseDialogueOption: (choice) => {
    const state = get()
    playSfx('click', 0.3)
    if (choice.set_flags) {
      set((s) => {
        const flags = { ...s.gameFlags }
        for (const f of choice.set_flags!) flags[f] = true
        return { gameFlags: flags }
      })
    }
    if (choice.give_items) {
      set((s) => ({
        playerInventory: [
          ...s.playerInventory,
          ...choice.give_items!.filter((i) => !s.playerInventory.includes(i)),
        ],
      }))
    }
    if (choice.end_game) {
      set({ activeDialogue: null, gameWon: true })
      return
    }
    if (choice.next === null) {
      set({ activeDialogue: null })
      return
    }
    const dialogue = state.activeDialogue
    if (dialogue) set({ activeDialogue: { id: dialogue.id, node: choice.next } })
  },

  toggleHotspotHints: () => set((s) => ({ showHotspotHints: !s.showHotspotHints })),

  resetGame: () => set({ ...initialState, messageId: get().messageId + 1 }),
    }),
    {
      name: 'scooby-resort-save',
      version: 1,
      // Only durable progress is saved; transient UI state stays fresh per session.
      partialize: (s) => ({
        activeRoom: s.activeRoom,
        playerInventory: s.playerInventory,
        gameFlags: s.gameFlags,
        activeCharacter: s.activeCharacter,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<GameState>
        // Guard against saves referencing rooms that no longer exist.
        if (!p.activeRoom || !SCENES[p.activeRoom]) return current
        return { ...current, ...p, message: SCENES[p.activeRoom].description }
      },
    },
  ),
)
