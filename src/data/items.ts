import {
  BookOpen,
  Cable,
  Candy,
  Cookie,
  FileText,
  Flashlight,
  Hand,
  Key,
  KeyRound,
  Map,
  Megaphone,
  PaintBucket,
  Scissors,
  Wand,
  WandSparkles,
  Wrench,
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
  old_brochure: {
    id: 'old_brochure',
    name: 'Resort Brochure',
    description:
      "A 1969 grand-opening brochure. Founder George Palm Sr. beams beside the pool: 'A PARADISE FOR MY FAMILY, FOREVER.'",
    icon: BookOpen,
    color: '#93c5fd',
  },
  muddy_glove: {
    id: 'muddy_glove',
    name: 'Muddy Glove',
    description:
      "A dress glove caked in pool muck, monogrammed 'A.C.'. Who wears dress gloves to a haunting?",
    icon: Hand,
    color: '#a8a29e',
  },
  office_key: {
    id: 'office_key',
    name: 'Office Passkey',
    description: "Gus's spare passkey to the manager's office, up the lobby stairs.",
    icon: KeyRound,
    color: '#f59e0b',
  },
  box_cutter: {
    id: 'box_cutter',
    name: 'Box Cutter',
    description: 'A janitor\'s box cutter. For opening boxes... or cutting someone loose.',
    icon: Scissors,
    color: '#f87171',
  },
  deed_draft: {
    id: 'deed_draft',
    name: 'Draft Deed of Sale',
    description:
      "From Crane's safe: a pre-drafted deed selling the Grand Palm to 'A. CRANE' for a tenth of its value. Dated next week.",
    icon: FileText,
    color: '#fbbf24',
  },
  voice_megaphone: {
    id: 'voice_megaphone',
    name: 'Wail-o-Phone',
    description:
      "A megaphone rigged with a warbling reed — it turns a whisper into the Phantom's famous pipe-organ wail.",
    icon: Megaphone,
    color: '#4ade80',
  },
  garden_shears: {
    id: 'garden_shears',
    name: 'Garden Shears',
    description:
      'Heavy pruning shears from the greenhouse. Rusty, but they still bite through vines like Scooby through a sandwich.',
    icon: Scissors,
    color: '#84cc16',
  },
  crank_handle: {
    id: 'crank_handle',
    name: 'Crank Handle',
    description:
      "An iron crank handle from the toolshed pegboard. The square socket matches the pool's maintenance hatch.",
    icon: Wrench,
    color: '#94a3b8',
  },
  tunnel_map: {
    id: 'tunnel_map',
    name: 'Tunnel Map',
    description:
      "A hand-drawn map of the resort's service tunnels — someone marked a route from the pool pumps to the boiler room in fresh green ink.",
    icon: Map,
    color: '#fbbf24',
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
