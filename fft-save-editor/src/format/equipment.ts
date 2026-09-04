// "Give me all the equipment" planning: which item ids to touch and what to set them to.
import { INVENTORY_SIZE } from './save.ts'
import { ITEMS, type ItemCategory, type ItemDef } from '../data/items.ts'

/** Never write these ids: 0 is "Nothing Equipped", 254/255 are blank (0xFF is also the empty-slot sentinel). */
export const RESERVED_ITEM_IDS: ReadonlySet<number> = new Set([0, 254, 255])

export const CONSUMABLE_CATEGORIES: ReadonlySet<ItemCategory> = new Set<ItemCategory>(['Item', 'Throwing', 'Bomb'])

export interface CategoryGroup {
  key: string
  label: string
  categories: ItemCategory[]
}

/** UI grouping. Order matches the in-game equipment screen roughly: weapons, shields, head, body, accessories. */
export const CATEGORY_GROUPS: readonly CategoryGroup[] = [
  {
    key: 'weapons',
    label: 'Weapons',
    categories: [
      'Knife', 'NinjaBlade', 'Sword', 'KnightSword', 'Katana', 'Axe', 'Rod', 'Staff', 'Flail', 'Gun',
      'Crossbow', 'Bow', 'Instrument', 'Book', 'Polearm', 'Pole', 'Bag', 'Cloth',
    ],
  },
  { key: 'shields', label: 'Shields', categories: ['Shield'] },
  { key: 'head', label: 'Headgear', categories: ['Helmet', 'Hat', 'HairAdornment'] },
  { key: 'body', label: 'Body armor', categories: ['Armor', 'Clothing', 'Robe'] },
  { key: 'accessories', label: 'Accessories', categories: ['Shoes', 'Armguard', 'Ring', 'Armlet', 'Cloak', 'Perfume'] },
]

export const EQUIPMENT_CATEGORIES: ReadonlySet<ItemCategory> = new Set(
  CATEGORY_GROUPS.flatMap((g) => g.categories),
)

export function isGrantable(item: ItemDef): boolean {
  return !RESERVED_ITEM_IDS.has(item.id) && item.name !== '' && item.category !== 'None'
}

export function isEquipment(item: ItemDef): boolean {
  return isGrantable(item) && EQUIPMENT_CATEGORIES.has(item.category)
}

export const EQUIPMENT_ITEMS: readonly ItemDef[] = ITEMS.filter(isEquipment)

export interface GrantOptions {
  /** Target count for each selected item, 1..255 (99 is what the in-game UI can reach). */
  count: number
  /** Categories to include. */
  categories: ReadonlySet<ItemCategory>
  /** Only raise counts; never lower an item the player already has more of. */
  neverLower: boolean
  /** Only touch items the player currently has none of. */
  onlyMissing: boolean
}

export interface GrantChange {
  id: number
  name: string
  category: ItemCategory
  from: number
  to: number
}

export interface GrantPlan {
  next: Uint8Array
  changes: GrantChange[]
}

export function planGrant(current: Uint8Array, opts: GrantOptions): GrantPlan {
  if (current.length !== INVENTORY_SIZE) throw new RangeError('Inventory must be 261 bytes.')
  const count = Math.max(0, Math.min(255, Math.floor(opts.count)))
  const next = current.slice()
  const changes: GrantChange[] = []
  for (const item of ITEMS) {
    if (!isGrantable(item) || !opts.categories.has(item.category)) continue
    const from = current[item.id]
    if (opts.onlyMissing && from > 0) continue
    const to = opts.neverLower ? Math.max(from, count) : count
    if (to === from) continue
    next[item.id] = to
    changes.push({ id: item.id, name: item.name, category: item.category, from, to })
  }
  return { next, changes }
}
