export type CharacterId = 'Fred' | 'Velma' | 'Shaggy_Scooby' | 'Daphne'

export type Direction = 'north' | 'south' | 'east' | 'west' | 'up' | 'down'

export type ActionType =
  | 'add_to_inventory'
  | 'remove_from_inventory'
  | 'set_flag'
  | 'show_message'
  | 'start_dialogue'
  | 'play_sfx'
  | 'end_game'

export interface GameAction {
  type: ActionType
  item?: string
  flag?: string
  value?: boolean
  text?: string
  dialogue?: string
  sfx?: string
}

export interface Hotspot {
  id: string
  label: string
  /** Position and size, in percentages of the viewport. */
  x: number
  y: number
  w: number
  h: number
  required_item?: string
  /** Remove the required item from inventory after a successful use. */
  consume_item?: boolean
  required_character?: CharacterId
  required_flags?: string[]
  /** Hidden once ANY of these flags is true (e.g. item already taken). */
  hidden_if_flags?: string[]
  /** Only shown once ALL of these flags are true. */
  visible_if_flags?: string[]
  wrong_character_message?: string
  missing_item_message?: string
  locked_message?: string
  action_triggers: GameAction[]
}

export interface NavLink {
  direction: Direction
  target: string
  label: string
  /** Passage requires this flag to be true. */
  locked_by_flag?: string
  locked_message?: string
}

export interface Scene {
  id: string
  name: string
  background_image_url: string
  /** CSS background value used until a real backdrop is dropped into /public/assets/scenes. */
  fallback_gradient: string
  /** Ambience loop name resolved to /public/assets/audio/<name>.mp3 */
  ambience?: string
  description: string
  navigation_links: NavLink[]
  clickable_hotspots: Hotspot[]
}

export type SceneMap = Record<string, Scene>

export interface DialogueChoice {
  text: string
  /** Next node id, or null to end the conversation. */
  next: string | null
  set_flags?: string[]
  give_items?: string[]
  required_flags?: string[]
  hidden_if_flags?: string[]
  end_game?: boolean
}

export interface DialogueNode {
  text: string
  choices: DialogueChoice[]
}

export interface Dialogue {
  speaker: string
  portrait_color: string
  nodes: Record<string, DialogueNode>
}

export type DialogueMap = Record<string, Dialogue>
