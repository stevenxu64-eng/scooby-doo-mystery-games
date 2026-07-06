import { Radio } from 'lucide-react'
import { CHARACTERS, CHARACTER_ORDER } from '../data/characters'
import { CharacterBust } from './CharacterArt'
import { useGameStore } from '../store/gameStore'

/**
 * Walkie-talkie hub: switch the active gang member to bypass
 * character-gated obstacles. Each button shows the character's actual
 * portrait with their name beneath it.
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
          const active = id === activeCharacter
          return (
            <button
              key={id}
              onClick={() => setCharacter(id)}
              title={`${c.name} — ${c.skill}`}
              className={`kenney-btn flex w-[4.6rem] flex-col items-center px-1 pb-1.5 pt-2 transition-all md:w-20 ${
                active
                  ? 'bg-stone-700'
                  : 'bg-stone-900 opacity-65 saturate-50 hover:opacity-100 hover:saturate-100'
              }`}
              style={
                active
                  ? { borderColor: c.color, boxShadow: `0 0 14px ${c.color}66, inset 0 2px 0 rgba(255,255,255,0.15)` }
                  : undefined
              }
            >
              <div className="pointer-events-none -mb-0.5 h-14 w-12 overflow-hidden md:h-16 md:w-14">
                <CharacterBust id={id} />
              </div>
              <span
                className="font-title mt-1 w-full text-center leading-none tracking-wide"
                style={{
                  color: active ? c.color : '#a8a29e',
                  fontSize: c.name.length > 8 ? '8.5px' : '11px',
                }}
              >
                {c.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
