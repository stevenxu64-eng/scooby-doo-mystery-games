import { Footprints, PaintBucket, Receipt, type LucideIcon } from 'lucide-react'

export interface ClueDef {
  id: string
  name: string
  description: string
  icon: LucideIcon
  color: string
}

export const CLUES: Record<string, ClueDef> = {
  muddy_boots: {
    id: 'muddy_boots',
    name: 'Muddy Boots',
    description:
      'Size-12 guard-issue boots caked in glowing green mud, stashed behind the T-Rex leg.',
    icon: Footprints,
    color: '#a3e635',
  },
  glow_paint: {
    id: 'glow_paint',
    name: 'Glow Paint Can',
    description:
      "'LUMI-GLOW' theatrical paint hidden inside the sealed sarcophagus — the exact green of the Mummy's glow. The receipt is signed 'B.G.'",
    icon: PaintBucket,
    color: '#4ade80',
  },
  pay_stub: {
    id: 'pay_stub',
    name: 'Gambling IOU',
    description:
      "The archive film projects an IOU: Night Guard Burt Grimsley owes $12,000 to 'Louie the Fish' — and the museum pays triple overtime during 'hauntings'.",
    icon: Receipt,
    color: '#fbbf24',
  },
}

export const CLUE_ORDER = ['muddy_boots', 'glow_paint', 'pay_stub']

export interface SuspectDef {
  id: string
  name: string
  role: string
  bio: string
  color: string
}

export const SUSPECTS: SuspectDef[] = [
  {
    id: 'njoro',
    name: 'Dr. Imani Njoro',
    role: 'Museum Curator',
    bio: 'Dreams of bigger crowds — and nothing sells tickets like a "cursed" mummy. Wears designer heels, size 6.',
    color: '#818cf8',
  },
  {
    id: 'burt',
    name: 'Burt Grimsley',
    role: 'Night Guard',
    bio: 'Size-12 boots. Initials B.G. Grumbles about money, works every "haunted" night shift... at triple pay.',
    color: '#f87171',
  },
  {
    id: 'pete',
    name: 'Pete Malone',
    role: 'Janitor',
    bio: 'Knows every corridor and vent in the building. Hates the night shift and everyone on it.',
    color: '#34d399',
  },
]

export const GUILTY_SUSPECT_ID = 'burt'

export interface ItemDef {
  id: string
  name: string
  description: string
}

export const ITEMS: Record<string, ItemDef> = {
  brass_key: {
    id: 'brass_key',
    name: 'Brass Key',
    description: "Heavy brass key stamped 'ARCHIVES'. Opens the locked north door in the Grand Hall.",
  },
}
