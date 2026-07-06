export interface Vec2 {
  x: number
  y: number
}

/**
 * Tile codes used in maps.json grids:
 * 0 floor · 1 impassable wall · 2 interactive object · 3 hiding spot · 4 door
 */
export const TILE = {
  FLOOR: 0,
  WALL: 1,
  INTERACTIVE: 2,
  HIDING: 3,
  DOOR: 4,
} as const

export type TileCode = (typeof TILE)[keyof typeof TILE]

export type GameMode =
  | 'EXPLORE'
  | 'PUZZLE_VIEW'
  | 'HIDING'
  | 'UNMASKING'
  | 'GAMEOVER'
  | 'WIN'

export type MonsterAIMode = 'PATROL' | 'CHASE' | 'RETURN'

export interface DoorDef {
  x: number
  y: number
  /** Room id to travel to; null = flavor-locked door (shows message only). */
  target: string | null
  spawn?: Vec2
  required_item?: string
  locked_message?: string
  label: string
}

export type InteractiveKind = 'pickup' | 'puzzle' | 'note'

export interface InteractiveDef {
  id: string
  x: number
  y: number
  kind: InteractiveKind
  label: string
  puzzle?: 'dials' | 'beam'
  message?: string
  /** Shown when re-examined after being used/solved. */
  done_message?: string
  /** Shown the moment a puzzle is solved. */
  solved_message?: string
  items?: string[]
  clues?: string[]
}

export interface MonsterCfg {
  patrol: Vec2[]
  speed: number
  chase_speed: number
  sight_range: number
}

export interface RoomDef {
  id: string
  name: string
  intro: string
  grid: number[][]
  player_spawn: Vec2
  monster: MonsterCfg | null
  doors: DoorDef[]
  interactives: InteractiveDef[]
  palette: {
    floor_a: string
    floor_b: string
    wall_top: string
    wall_left: string
    wall_right: string
  }
  ambience?: string
}

export type MapData = Record<string, RoomDef>

export interface MonsterRuntime {
  mode: MonsterAIMode
  patrolIndex: number
  path: Vec2[]
  /** Seconds until the next chase re-plan. */
  replanIn: number
  /** Seconds of lost contact before giving up a chase. */
  loseIn: number
}
