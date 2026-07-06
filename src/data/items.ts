import {
  Cable,
  Candy,
  Cookie,
  Flashlight,
  Key,
  PaintBucket,
  Wand,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react'

export interface ItemDef {
  id: string
  name: string
  description: string
  icon: LucideIcon
  /** Accent color for the inventory slot. */
  color: string
}

export const ITEMS: Record<string, ItemDef> = {
  flashlight: {
    id: 'flashlight',
    name: 'Flashlight',
    description: 'A heavy old flashlight from the front desk. Cuts through the dark.',
    icon: Flashlight,
    color: '#facc15',
  },
  stick: {
    id: 'stick',
    name: 'Long Stick',
    description: 'A long, sturdy stick from the bushes. Handy, in theory.',
    icon: Wand,
    color: '#a16207',
  },
  chewing_gum: {
    id: 'chewing_gum',
    name: 'Chewing Gum',
    description: 'Extra-sticky gum from the vending machine. Shaggy already chewed it. Gross, but useful.',
    icon: Candy,
    color: '#f472b6',
  },
  sticky_stick: {
    id: 'sticky_stick',
    name: 'Sticky Stick',
    description: 'A long stick with a wad of gum on the end. The classic key-retrieval instrument.',
    icon: WandSparkles,
    color: '#fb923c',
  },
  scooby_snack: {
    id: 'scooby_snack',
    name: 'Scooby Snack',
    description: 'The last Scooby Snack in the box. Guard it from Scooby. And Shaggy.',
    icon: Cookie,
    color: '#d97706',
  },
  janitor_key: {
    id: 'janitor_key',
    name: 'Maintenance Key',
    description: "A brass key stamped 'MAINTENANCE'. Opens the janitor's closet in the lobby.",
    icon: Key,
    color: '#eab308',
  },
  glowing_paint: {
    id: 'glowing_paint',
    name: 'Glowing Paint',
    description: 'LUMO-GLOW Phantom Green theatrical paint. The exact color of the Phantom Guest. Evidence!',
    icon: PaintBucket,
    color: '#4ade80',
  },
  rope: {
    id: 'rope',
    name: 'Rope',
    description: "A long coil of sturdy rope from the janitor's closet. Prime trap material.",
    icon: Cable,
    color: '#94a3b8',
  },
}

export interface CombineRecipe {
  ingredients: [string, string]
  result: string
  message: string
}

export const COMBINE_RECIPES: CombineRecipe[] = [
  {
    ingredients: ['stick', 'chewing_gum'],
    result: 'sticky_stick',
    message:
      "You mash the gum onto the end of the stick. Behold: the Sticky Stick! Perfect for fishing shiny things out of narrow gaps.",
  },
]
