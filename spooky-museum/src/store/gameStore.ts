import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import mapsJson from '../data/maps.json'
import { TILE, type GameMode, type MapData, type MonsterRuntime, type Vec2 } from '../types/game'
import { findPath, isWalkableTile, walkableNeighbors } from '../utils/pathfinding'
import { dist, roundTile } from '../utils/iso'
import { moveAlong, updateMonster } from '../engine/monsterAI'
import { heldDirection } from '../engine/input'
import { playSfx, setAmbience, setChaseLoop } from '../engine/audio'
import { GUILTY_SUSPECT_ID, SUSPECTS } from '../data/mystery'

export const MAPS = mapsJson as unknown as MapData

const START_ROOM = 'grand_hall'
const PLAYER_SPEED = 4.2
const TOTAL_CLUES = 3

export type Difficulty = 'easy' | 'normal' | 'spooky'

/** Multipliers applied to every room's monster config, plus the spawn grace window. */
export const DIFFICULTY_MODS: Record<
  Difficulty,
  { label: string; sight: number; patrol: number; chase: number; grace: number }
> = {
  easy: { label: 'Easy', sight: 0.75, patrol: 0.9, chase: 0.85, grace: 4 },
  normal: { label: 'Normal', sight: 1, patrol: 1, chase: 1, grace: 2.5 },
  spooky: { label: 'Spooky', sight: 1.3, patrol: 1.15, chase: 1.15, grace: 1.5 },
}

function freshMonster(roomId: string): { pos: Vec2 | null; rt: MonsterRuntime | null } {
  const cfg = MAPS[roomId].monster
  if (!cfg) return { pos: null, rt: null }
  return {
    pos: { ...cfg.patrol[0] },
    rt: { mode: 'PATROL', patrolIndex: 0, path: [], replanIn: 0, loseIn: 0 },
  }
}

export interface GameState {
  activeRoomId: string
  playerPosition: Vec2
  playerPath: Vec2[]
  monsterPosition: Vec2 | null
  monsterAI: MonsterRuntime | null
  gameMode: GameMode
  inventory: string[]
  foundClues: string[]
  usedInteractives: string[]
  activePuzzleId: string | null
  clueLinks: Record<string, string>
  accusationFeedback: string | null
  message: string | null
  messageId: number
  /** Tile key of the last door whose lock message fired (anti-spam). */
  lastDoorKey: string | null
  /** Seconds of "unnoticed" mercy after spawning/entering a room. */
  spotGraceLeft: number
  difficulty: Difficulty

  tick: (dt: number) => void
  setDifficulty: (d: Difficulty) => void
  clickTile: (tile: Vec2) => void
  interact: () => void
  closePuzzle: () => void
  solveActivePuzzle: () => void
  openBoard: () => void
  closeBoard: () => void
  linkClue: (clueId: string, suspectId: string) => void
  accuse: (suspectId: string) => void
  retry: () => void
  resetGame: () => void
  showMessage: (text: string) => void
}

function initialState(roomId = START_ROOM) {
  const { pos, rt } = freshMonster(roomId)
  return {
    activeRoomId: roomId,
    playerPosition: { ...MAPS[roomId].player_spawn },
    playerPath: [] as Vec2[],
    monsterPosition: pos,
    monsterAI: rt,
    gameMode: 'EXPLORE' as GameMode,
    inventory: [] as string[],
    foundClues: [] as string[],
    usedInteractives: [] as string[],
    activePuzzleId: null as string | null,
    clueLinks: {} as Record<string, string>,
    accusationFeedback: null as string | null,
    message: MAPS[roomId].intro,
    messageId: 0,
    lastDoorKey: null as string | null,
    spotGraceLeft: DIFFICULTY_MODS.normal.grace,
  }
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
  ...initialState(),
  difficulty: 'normal' as Difficulty,

  showMessage: (text) => set((s) => ({ message: text, messageId: s.messageId + 1 })),

  setDifficulty: (d) => {
    set({ difficulty: d, spotGraceLeft: DIFFICULTY_MODS[d].grace })
    get().showMessage(
      d === 'easy'
        ? 'Difficulty: EASY — the Mummy is nearsighted and slow. Like, perfect.'
        : d === 'spooky'
          ? 'Difficulty: SPOOKY — the Mummy sees farther, moves faster, and forgives nothing. Good luck.'
          : 'Difficulty: NORMAL — a classic haunting.',
    )
  },

  tick: (dt) => {
    const s = get()
    if (s.gameMode !== 'EXPLORE' && s.gameMode !== 'HIDING') return
    const room = MAPS[s.activeRoomId]
    const grid = room.grid

    // ---- Player movement (click-to-move path, else held keyboard direction)
    const pos = { ...s.playerPosition }
    const path = s.playerPath.map((p) => ({ ...p }))
    if (path.length === 0) {
      const dir = heldDirection()
      if (dir) {
        const cur = roundTile(pos)
        const next = { x: cur.x + dir.x, y: cur.y + dir.y }
        const code = grid[next.y]?.[next.x]
        if (code !== undefined && isWalkableTile(code)) path.push(next)
      }
    }
    moveAlong(pos, path, PLAYER_SPEED, dt)
    const tile = roundTile(pos)
    const atTileCenter = path.length === 0 && dist(pos, tile) < 0.05
    const tileCode = grid[tile.y]?.[tile.x]

    let patch: Partial<GameState> = { playerPosition: pos, playerPath: path }

    // ---- Door handling (fires once per arrival on the door tile)
    const doorKey = `${s.activeRoomId}:${tile.x},${tile.y}`
    if (atTileCenter && tileCode === TILE.DOOR && s.lastDoorKey !== doorKey) {
      const door = room.doors.find((d) => d.x === tile.x && d.y === tile.y)
      if (door) {
        const locked =
          door.target === null ||
          (door.required_item && !s.inventory.includes(door.required_item))
        if (locked) {
          playSfx('error', 0.4)
          set({ ...patch, lastDoorKey: doorKey })
          get().showMessage(door.locked_message ?? `${door.label} won't open.`)
          return
        }
        // Travel!
        const targetRoom = MAPS[door.target!]
        const { pos: mPos, rt } = freshMonster(door.target!)
        setChaseLoop(false)
        playSfx('door', 0.5)
        setAmbience(targetRoom.ambience)
        set({
          activeRoomId: door.target!,
          playerPosition: { ...(door.spawn ?? targetRoom.player_spawn) },
          playerPath: [],
          monsterPosition: mPos,
          monsterAI: rt,
          gameMode: 'EXPLORE',
          lastDoorKey: null,
          spotGraceLeft: DIFFICULTY_MODS[s.difficulty].grace,
        })
        get().showMessage(targetRoom.intro)
        return
      }
    }
    if (tileCode !== TILE.DOOR && s.lastDoorKey) patch.lastDoorKey = null

    // ---- Hiding state (standing on a hiding-spot tile = invisible to the monster)
    const hidden = tileCode === TILE.HIDING
    if (hidden && s.gameMode === 'EXPLORE') {
      patch.gameMode = 'HIDING'
      playSfx('hide', 0.4)
      patch.message = "You duck into the hiding spot. The Mummy can't see you here — wait for it to pass!"
      patch.messageId = s.messageId + 1
    } else if (!hidden && s.gameMode === 'HIDING') {
      patch.gameMode = 'EXPLORE'
    }

    // ---- Monster AI (A* patrol → chase → return state machine)
    const grace = Math.max(0, s.spotGraceLeft - dt)
    patch.spotGraceLeft = grace
    if (s.monsterPosition && s.monsterAI && room.monster) {
      const mPos = { ...s.monsterPosition }
      const rt: MonsterRuntime = { ...s.monsterAI, path: s.monsterAI.path.map((p) => ({ ...p })) }
      // During the post-spawn grace window the Mummy "hasn't noticed" the player yet.
      const hiddenForAI = hidden || (grace > 0 && rt.mode === 'PATROL')
      const mods = DIFFICULTY_MODS[s.difficulty]
      const effectiveCfg = {
        ...room.monster,
        sight_range: room.monster.sight_range * mods.sight,
        speed: room.monster.speed * mods.patrol,
        chase_speed: room.monster.chase_speed * mods.chase,
      }
      const events = updateMonster(mPos, rt, effectiveCfg, grid, pos, hiddenForAI, dt)
      patch.monsterPosition = mPos
      patch.monsterAI = rt
      if (events.startedChase) {
        setChaseLoop(true)
        playSfx('caught', 0.3)
        patch.message = 'THE MUMMY SPOTTED YOU! RUN — or break its line of sight and HIDE!'
        patch.messageId = s.messageId + 1
      }
      if (events.endedChase) {
        setChaseLoop(false)
        patch.message = 'The Mummy grumbles and shuffles back to its patrol... that was too close.'
        patch.messageId = s.messageId + 1
      }
      if (events.caught) {
        setChaseLoop(false)
        playSfx('caught', 0.7)
        patch.gameMode = 'GAMEOVER'
        patch.playerPath = []
      }
    }

    set(patch)
  },

  clickTile: (tile) => {
    const s = get()
    if (s.gameMode !== 'EXPLORE' && s.gameMode !== 'HIDING') return
    const room = MAPS[s.activeRoomId]
    const grid = room.grid
    const code = grid[tile.y]?.[tile.x]
    if (code === undefined) return
    const playerTile = roundTile(s.playerPosition)

    if (code === TILE.INTERACTIVE) {
      const adjacent = Math.abs(tile.x - playerTile.x) + Math.abs(tile.y - playerTile.y) <= 1
      if (adjacent) {
        get().interact()
        return
      }
      // Walk to the closest reachable tile beside the object.
      const options = walkableNeighbors(grid, tile.x, tile.y)
        .map((n) => findPath(grid, playerTile, n))
        .filter((p) => p.length > 0)
        .sort((a, b) => a.length - b.length)
      if (options[0]) set({ playerPath: options[0] })
      return
    }

    if (isWalkableTile(code)) {
      const path = findPath(grid, playerTile, tile)
      if (path.length > 0) set({ playerPath: path })
    }
  },

  interact: () => {
    const s = get()
    if (s.gameMode !== 'EXPLORE' && s.gameMode !== 'HIDING') return
    const room = MAPS[s.activeRoomId]
    const playerTile = roundTile(s.playerPosition)
    const target = room.interactives.find(
      (i) => Math.abs(i.x - playerTile.x) + Math.abs(i.y - playerTile.y) <= 1,
    )
    if (!target) return

    if (s.usedInteractives.includes(target.id)) {
      playSfx('click', 0.3)
      get().showMessage(target.done_message ?? 'Nothing more to find here.')
      return
    }

    switch (target.kind) {
      case 'note':
        playSfx('click', 0.4)
        get().showMessage(target.message ?? target.label)
        break
      case 'pickup': {
        playSfx('pickup', 0.6)
        set({
          inventory: [...s.inventory, ...(target.items ?? [])],
          foundClues: [...s.foundClues, ...(target.clues ?? [])],
          usedInteractives: [...s.usedInteractives, target.id],
        })
        get().showMessage(target.message ?? `Found something at ${target.label}.`)
        break
      }
      case 'puzzle':
        playSfx('click', 0.4)
        set({ gameMode: 'PUZZLE_VIEW', activePuzzleId: target.id })
        get().showMessage(target.message ?? target.label)
        break
    }
  },

  closePuzzle: () =>
    set((s) => (s.gameMode === 'PUZZLE_VIEW' ? { gameMode: 'EXPLORE', activePuzzleId: null } : {})),

  solveActivePuzzle: () => {
    const s = get()
    if (!s.activePuzzleId) return
    const room = MAPS[s.activeRoomId]
    const target = room.interactives.find((i) => i.id === s.activePuzzleId)
    if (!target) return
    playSfx('solve', 0.7)
    set({
      inventory: [...s.inventory, ...(target.items ?? [])],
      foundClues: [...s.foundClues, ...(target.clues ?? [])],
      usedInteractives: [...s.usedInteractives, target.id],
      gameMode: 'EXPLORE',
      activePuzzleId: null,
    })
    get().showMessage(target.solved_message ?? 'It worked! (New evidence added to the case.)')
  },

  openBoard: () => {
    const s = get()
    if (s.gameMode !== 'EXPLORE' && s.gameMode !== 'HIDING') return
    if (s.foundClues.length === 0) {
      get().showMessage("The case board is empty — find some clues first, gang!")
      return
    }
    playSfx('click', 0.4)
    set({ gameMode: 'UNMASKING', accusationFeedback: null })
  },

  closeBoard: () =>
    set((s) => (s.gameMode === 'UNMASKING' ? { gameMode: 'EXPLORE', accusationFeedback: null } : {})),

  linkClue: (clueId, suspectId) => {
    playSfx('click', 0.35)
    set((s) => ({
      clueLinks: { ...s.clueLinks, [clueId]: suspectId },
      accusationFeedback: null,
    }))
  },

  accuse: (suspectId) => {
    const s = get()
    if (s.foundClues.length < TOTAL_CLUES) return
    if (suspectId === GUILTY_SUSPECT_ID) {
      setChaseLoop(false)
      playSfx('solve', 0.8)
      set({ gameMode: 'WIN' })
    } else {
      playSfx('error', 0.5)
      const name = SUSPECTS.find((x) => x.id === suspectId)?.name ?? 'them'
      set({
        accusationFeedback: `Velma: "Hmm... the boot size, the initials, the debts — none of it points to ${name}. Look at WHO the evidence fits!"`,
      })
    }
  },

  retry: () => {
    const s = get()
    const { pos, rt } = freshMonster(s.activeRoomId)
    setChaseLoop(false)
    set({
      playerPosition: { ...MAPS[s.activeRoomId].player_spawn },
      playerPath: [],
      monsterPosition: pos,
      monsterAI: rt,
      gameMode: 'EXPLORE',
      lastDoorKey: null,
      spotGraceLeft: DIFFICULTY_MODS[get().difficulty].grace,
    })
    get().showMessage('Zoinks! The gang regroups... all clues and items are safe. Try again — and this time, HIDE.')
  },

  resetGame: () => {
    setChaseLoop(false)
    const difficulty = get().difficulty
    set({
      ...initialState(),
      difficulty,
      spotGraceLeft: DIFFICULTY_MODS[difficulty].grace,
      messageId: get().messageId + 1,
    })
  },
    }),
    {
      name: 'spooky-museum-save',
      version: 1,
      // Durable progress only — entity positions and AI state respawn fresh,
      // so a mid-chase save can't reload into an instant game over.
      partialize: (s) => ({
        activeRoomId: s.activeRoomId,
        inventory: s.inventory,
        foundClues: s.foundClues,
        usedInteractives: s.usedInteractives,
        clueLinks: s.clueLinks,
        difficulty: s.difficulty,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<GameState>
        const roomId = p.activeRoomId
        // Guard against saves referencing rooms that no longer exist.
        if (!roomId || !MAPS[roomId]) return current
        const { pos, rt } = freshMonster(roomId)
        const difficulty = p.difficulty ?? 'normal'
        return {
          ...current,
          ...p,
          playerPosition: { ...MAPS[roomId].player_spawn },
          playerPath: [],
          monsterPosition: pos,
          monsterAI: rt,
          gameMode: 'EXPLORE' as GameMode,
          message: MAPS[roomId].intro,
          spotGraceLeft: DIFFICULTY_MODS[difficulty].grace,
        }
      },
    },
  ),
)

/** Objective line for the HUD, derived from progress. */
export function currentObjective(s: GameState): string {
  if (s.foundClues.length >= TOTAL_CLUES) return 'All clues found! Open the CASE BOARD (C) and unmask the culprit.'
  const parts: string[] = []
  if (!s.foundClues.includes('muddy_boots')) parts.push('search the Dinosaur Hall')
  if (!s.foundClues.includes('glow_paint')) parts.push('open the sealed sarcophagus (Egypt Wing)')
  if (!s.foundClues.includes('pay_stub'))
    parts.push(
      s.inventory.includes('brass_key')
        ? 'fix the Archives projector'
        : 'find the Archives key (the guard station is in the Hall of Armor, east of Egypt)',
    )
  return `Clues ${s.foundClues.length}/${TOTAL_CLUES} — ${parts.join(', ')}.`
}
