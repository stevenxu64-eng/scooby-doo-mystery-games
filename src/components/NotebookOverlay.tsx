import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { CharacterBust } from './CharacterArt'
import { useGameStore } from '../store/gameStore'
import type { CaseLogKind } from '../data/notebook'

const KIND_META: Record<CaseLogKind, { icon: string; label: string; color: string }> = {
  clue: { icon: '🔍', label: 'CLUE', color: '#4ade80' },
  item: { icon: '🎒', label: 'ITEM', color: '#fbbf24' },
  event: { icon: '📌', label: 'EVENT', color: '#93c5fd' },
}

/**
 * Velma's Case Notes: a reviewable, chronological list of every clue found,
 * item picked up, and key event so far. Toggled from the header (or N).
 */
export function NotebookOverlay({ onClose }: { onClose: () => void }) {
  const caseLog = useGameStore((s) => s.caseLog)
  const listRef = useRef<HTMLDivElement>(null)

  // Open at the latest entry — that's what the player came to check.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [])

  const counts = caseLog.reduce(
    (acc, e) => ({ ...acc, [e.kind]: (acc[e.kind] ?? 0) + 1 }),
    {} as Partial<Record<CaseLogKind, number>>,
  )

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="kenney-panel flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b-2 border-stone-700 px-4 py-3">
          <div className="h-12 w-11 shrink-0 overflow-hidden">
            <CharacterBust id="Velma" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-title text-lg tracking-widest text-amber-300">Velma's Case Notes</h2>
            <p className="text-[11px] leading-tight text-stone-400">
              Everything the gang has found so far — newest at the bottom.
            </p>
          </div>
          <button onClick={onClose} title="Close notebook (N or Esc)" className="kenney-btn bg-stone-800 p-2 text-stone-300">
            <X size={18} />
          </button>
        </div>

        {/* Entries */}
        <div
          ref={listRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#78716c #1c1917' }}
        >
          {caseLog.length === 0 ? (
            <p className="py-8 text-center text-sm italic text-stone-400">
              Nothing yet. Go poke something suspicious — I'll write it down. — Velma
            </p>
          ) : (
            <ol className="space-y-1.5">
              {caseLog.map((e, i) => {
                const meta = KIND_META[e.kind]
                return (
                  <li key={e.id} className="flex items-baseline gap-2 rounded-lg bg-stone-900/60 px-3 py-1.5">
                    <span className="w-6 shrink-0 text-right text-[11px] font-bold text-stone-500">{i + 1}.</span>
                    <span className="shrink-0 text-sm" aria-hidden>
                      {meta.icon}
                    </span>
                    <span
                      className="w-11 shrink-0 text-[9px] font-bold tracking-widest"
                      style={{ color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-[13px] leading-snug text-stone-200">{e.text}</span>
                  </li>
                )
              })}
            </ol>
          )}
        </div>

        {/* Footer tally */}
        <div className="border-t-2 border-stone-700 px-4 py-2 text-center text-[11px] tracking-wide text-stone-400">
          🔍 {counts.clue ?? 0} clues · 🎒 {counts.item ?? 0} items · 📌 {counts.event ?? 0} events
        </div>
      </div>
    </div>
  )
}
