import { ScrollText } from 'lucide-react'
import { useGameStore } from '../store/gameStore'

/** Narration strip: scene descriptions, examine text, and puzzle feedback. */
export function MessageBar() {
  const message = useGameStore((s) => s.message)
  const messageId = useGameStore((s) => s.messageId)

  return (
    <div className="kenney-panel flex min-h-16 items-center gap-3 px-4 py-2">
      <ScrollText size={20} className="shrink-0 text-amber-400" />
      <p key={messageId} className="msg-in max-h-16 overflow-y-auto text-sm leading-snug text-amber-100">
        {message ?? 'The gang looks around...'}
      </p>
    </div>
  )
}
