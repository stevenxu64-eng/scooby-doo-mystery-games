import { Radio } from 'lucide-react'
import { CHARACTERS, CHARACTER_ORDER } from '../data/characters'
import { useGameStore } from '../store/gameStore'

/**
 * Walkie-talkie hub: switch the active gang member to bypass
 * character-gated obstacles (Velma reads, Shaggy/Scooby bait, Daphne picks locks).
 */
export function CharacterHub() {
  const activeCharacter = useGameStore((s) => s.activeCharacter)
  const setCharacter = useGameStore((s) => s.setCharacter)

  return (
    <div className="kenney-panel flex shrink-0 items-center gap-3 px-4 py-3">
      <div className="flex flex-col items-center text-lime-400">
        <Radio size={26} className="animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Walkie</span>
      </div>

      <div className="flex gap-2">
        {CHARACTER_ORDER.map((id) => {
          const c = CHARACTERS[id]
          const Icon = c.icon
          const active = id === activeCharacter
          return (
            <button
              key={id}
              onClick={() => setCharacter(id)}
              title={`${c.name} — ${c.skill}`}
              className={`kenney-btn flex w-20 flex-col items-center gap-1 px-2 py-2 md:w-24 ${
                active ? 'bg-stone-700 ring-4 ring-offset-0' : 'bg-stone-900 opacity-75 hover:opacity-100'
              }`}
              style={active ? { borderColor: c.color, boxShadow: `0 0 12px ${c.color}66` } : undefined}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-stone-400"
                style={{ backgroundColor: c.color }}
              >
                <Icon size={18} className="text-white" strokeWidth={2.5} />
              </span>
              <span className="text-[10px] font-bold leading-tight text-stone-200">{c.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
