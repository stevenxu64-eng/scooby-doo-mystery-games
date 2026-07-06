import { useGameStore } from '../store/gameStore'
import { CHARACTERS } from '../data/characters'
import { CharacterBust } from './CharacterArt'

/**
 * Narration strip with the active character as the on-screen speaker.
 * The portrait pops whenever they act (actionPulse) or when the player
 * switches characters on the walkie-talkie.
 */
export function MessageBar() {
  const message = useGameStore((s) => s.message)
  const messageId = useGameStore((s) => s.messageId)
  const activeCharacter = useGameStore((s) => s.activeCharacter)
  const actionPulse = useGameStore((s) => s.actionPulse)

  return (
    <div className="kenney-panel flex min-h-20 items-center gap-3 px-4 py-2">
      <div className="relative -my-5 shrink-0">
        <div
          key={`${activeCharacter}-${actionPulse}`}
          className="anim-actor-pop h-24 w-[5.5rem]"
        >
          <div className="anim-idle-bob h-full w-full">
            <CharacterBust id={activeCharacter} />
          </div>
        </div>
        <span className="font-title absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-stone-600 bg-stone-900/95 px-2 py-0.5 text-[11px] tracking-wider text-amber-300">
          {CHARACTERS[activeCharacter].name}
        </span>
      </div>
      <p key={messageId} className="msg-in max-h-16 flex-1 overflow-y-auto text-sm leading-snug text-amber-100">
        {message ?? 'The gang looks around...'}
      </p>
    </div>
  )
}
