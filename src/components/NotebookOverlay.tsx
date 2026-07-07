import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { CharacterBust } from './CharacterArt'
import { useGameStore } from '../store/gameStore'
import type { CaseLogKind } from '../data/notebook'

const KIND_META: Record<CaseLogKind, { icon: string; label: string; color: string }> = {
  clue: { icon: '🔍', label: 'CLUE', color: '#4ade80' },
  event: { icon: '📌', label: 'EVENT', color: '#93c5fd' },
}

type KindFilter = 'all' | CaseLogKind

const FILTERS: Array<{ id: KindFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'clue', label: '🔍 Clues' },
  { id: 'event', label: '📌 Events' },
]

/** Wrap every case-insensitive occurrence of `query` in a highlight mark. */
function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'ig'))
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-amber-400/40 px-0.5 text-amber-100">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

/**
 * Velma's Case Notes: a reviewable, chronological list of every clue and key
 * event so far — searchable, so a half-remembered lead is findable in seconds.
 * Toggled from the header (or N).
 */
export function NotebookOverlay({ onClose }: { onClose: () => void }) {
  const caseLog = useGameStore((s) => s.caseLog)
  const listRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<KindFilter>('all')

  // Entries keep their chronological number even when the list is filtered down.
  const numbered = useMemo(() => caseLog.map((e, i) => ({ ...e, no: i + 1 })), [caseLog])
  const q = query.trim()
  const shown = numbered.filter(
    (e) =>
      (filter === 'all' || e.kind === filter) &&
      (!q || e.text.toLowerCase().includes(q.toLowerCase())),
  )
  const filtering = filter !== 'all' || q !== ''

  // Open at the latest entry; jump to the first hit once a search/filter kicks in.
  useEffect(() => {
    listRef.current?.scrollTo({ top: filtering ? 0 : listRef.current.scrollHeight })
  }, [filtering, q, filter])

  const counts = numbered.reduce(
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
              Every clue and event so far — newest at the bottom.
            </p>
          </div>
          <button onClick={onClose} title="Close notebook (N or Esc)" className="kenney-btn bg-stone-800 p-2 text-stone-300">
            <X size={18} />
          </button>
        </div>

        {/* Search + kind filters */}
        <div className="flex flex-col gap-2 border-b-2 border-stone-700 px-4 py-2.5 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the notes... (glove, paint, 217)"
              className="w-full rounded-lg border-2 border-stone-700 bg-stone-900/80 py-1.5 pl-8 pr-8 text-[13px] text-stone-200 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                title="Clear search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-stone-500 hover:text-stone-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex shrink-0 gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-lg border-2 px-2.5 py-1 text-[11px] font-bold tracking-wide transition-colors ${
                  filter === f.id
                    ? 'border-amber-500 bg-amber-900/40 text-amber-200'
                    : 'border-stone-700 bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Entries */}
        <div
          ref={listRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#78716c #1c1917' }}
        >
          {numbered.length === 0 ? (
            <p className="py-8 text-center text-sm italic text-stone-400">
              Nothing yet. Go poke something suspicious — I'll write it down. — Velma
            </p>
          ) : shown.length === 0 ? (
            <p className="py-8 text-center text-sm italic text-stone-400">
              No notes match "{q}". Try fewer letters — evidence hates being paraphrased. — Velma
            </p>
          ) : (
            <ol className="space-y-1.5">
              {shown.map((e) => {
                const meta = KIND_META[e.kind]
                return (
                  <li key={e.id} className="flex items-baseline gap-2 rounded-lg bg-stone-900/60 px-3 py-1.5">
                    <span className="w-6 shrink-0 text-right text-[11px] font-bold text-stone-500">{e.no}.</span>
                    <span className="shrink-0 text-sm" aria-hidden>
                      {meta.icon}
                    </span>
                    <span
                      className="w-11 shrink-0 text-[9px] font-bold tracking-widest"
                      style={{ color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-[13px] leading-snug text-stone-200">
                      <Highlighted text={e.text} query={q} />
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </div>

        {/* Footer tally */}
        <div className="border-t-2 border-stone-700 px-4 py-2 text-center text-[11px] tracking-wide text-stone-400">
          🔍 {counts.clue ?? 0} clues · 📌 {counts.event ?? 0} events
          {filtering && ` · showing ${shown.length} of ${numbered.length}`}
        </div>
      </div>
    </div>
  )
}
