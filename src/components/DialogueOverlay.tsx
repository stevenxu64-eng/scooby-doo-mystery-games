import { useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { DIALOGUES, useGameStore } from '../store/gameStore'
import type { DialogueChoice } from '../types/game'

export function DialogueOverlay() {
  const activeDialogue = useGameStore((s) => s.activeDialogue)
  const gameFlags = useGameStore((s) => s.gameFlags)
  const chooseDialogueOption = useGameStore((s) => s.chooseDialogueOption)

  const dialogue = activeDialogue ? DIALOGUES[activeDialogue.id] : null
  const node = dialogue && activeDialogue ? dialogue.nodes[activeDialogue.node] : null

  const visibleChoices: DialogueChoice[] = node
    ? node.choices.filter((c) => {
        if (c.required_flags && !c.required_flags.every((f) => gameFlags[f])) return false
        if (c.hidden_if_flags?.some((f) => gameFlags[f])) return false
        return true
      })
    : []

  // Number keys pick dialogue choices, Nancy Drew style.
  useEffect(() => {
    if (!node) return
    const onKey = (e: KeyboardEvent) => {
      const idx = Number(e.key) - 1
      if (idx >= 0 && idx < visibleChoices.length) {
        chooseDialogueOption(visibleChoices[idx])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDialogue, visibleChoices.length])

  if (!dialogue || !node) return null

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/50 p-3 md:p-5">
      <div className="kenney-panel msg-in w-full p-4">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-stone-400"
            style={{ backgroundColor: dialogue.portrait_color }}
          >
            <MessageSquare size={16} className="text-white" />
          </span>
          <span className="font-title text-xl tracking-wide text-amber-300">
            {dialogue.speaker}
          </span>
        </div>

        <p className="mb-4 max-h-36 overflow-y-auto text-sm leading-relaxed text-stone-100 md:text-base">
          {node.text}
        </p>

        <div className="flex flex-col gap-2">
          {visibleChoices.map((choice, i) => (
            <button
              key={`${activeDialogue?.node}-${i}`}
              onClick={() => chooseDialogueOption(choice)}
              className="kenney-btn bg-indigo-900/80 px-3 py-2 text-left text-sm font-semibold text-indigo-100 hover:bg-indigo-800"
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded bg-indigo-950 text-xs font-bold text-amber-300">
                {i + 1}
              </span>
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
