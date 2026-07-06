import { Dog, Gem, Glasses, type LucideIcon } from 'lucide-react'
import type { CharacterId } from '../types/game'

export interface CharacterDef {
  id: CharacterId
  name: string
  skill: string
  catchphrase: string
  icon: LucideIcon
  color: string
}

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  Velma: {
    id: 'Velma',
    name: 'Velma',
    skill: 'Deciphers documents & clues',
    catchphrase: "Jinkies! Let me take a look.",
    icon: Glasses,
    color: '#ea580c',
  },
  Shaggy_Scooby: {
    id: 'Shaggy_Scooby',
    name: 'Shaggy & Scooby',
    skill: 'Snack retrieval & bait handling',
    catchphrase: "Like, why is it always US, man?",
    icon: Dog,
    color: '#65a30d',
  },
  Daphne: {
    id: 'Daphne',
    name: 'Daphne',
    skill: 'Picks locks with a hairpin',
    catchphrase: "Danger-prone Daphne, reporting in.",
    icon: Gem,
    color: '#9333ea',
  },
}

export const CHARACTER_ORDER: CharacterId[] = ['Velma', 'Shaggy_Scooby', 'Daphne']
