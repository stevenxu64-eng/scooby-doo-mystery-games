import { useLayoutEffect, useRef, useState } from 'react'
import { Link2, UserRound, X } from 'lucide-react'
import { CLUES, SUSPECTS } from '../data/mystery'
import { useGameStore } from '../store/gameStore'

interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
}

/**
 * Full-screen deduction board: click a clue node, then a suspect node, to pin
 * a red-string connection between them. When every clue points at one suspect,
 * their ACCUSE button lights up.
 */
export function UnmaskingBoard() {
  const gameMode = useGameStore((s) => s.gameMode)
  const foundClues = useGameStore((s) => s.foundClues)
  const clueLinks = useGameStore((s) => s.clueLinks)
  const linkClue = useGameStore((s) => s.linkClue)
  const accuse = useGameStore((s) => s.accuse)
  const closeBoard = useGameStore((s) => s.closeBoard)
  const accusationFeedback = useGameStore((s) => s.accusationFeedback)

  const [selectedClue, setSelectedClue] = useState<string | null>(null)
  const [lines, setLines] = useState<Line[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef(new Map<string, HTMLElement>())

  const open = gameMode === 'UNMASKING'

  useLayoutEffect(() => {
    if (!open) return
    const compute = () => {
      const container = containerRef.current
      if (!container) return
      const cRect = container.getBoundingClientRect()
      const next: Line[] = []
      for (const [clueId, suspectId] of Object.entries(clueLinks)) {
        if (!foundClues.includes(clueId)) continue
        const a = nodeRefs.current.get(`clue-${clueId}`)
        const b = nodeRefs.current.get(`suspect-${suspectId}`)
        if (!a || !b) continue
        const ar = a.getBoundingClientRect()
        const br = b.getBoundingClientRect()
        next.push({
          x1: ar.right - cRect.left,
          y1: ar.top + ar.height / 2 - cRect.top,
          x2: br.left - cRect.left,
          y2: br.top + br.height / 2 - cRect.top,
          color: SUSPECTS.find((x) => x.id === suspectId)?.color ?? '#f87171',
        })
      }
      setLines(next)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [open, clueLinks, foundClues])

  if (!open) return null

  const linkedValues = foundClues.map((c) => clueLinks[c]).filter(Boolean)
  const allLinked = linkedValues.length === foundClues.length && foundClues.length >= 3

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 p-4">
      <div className="panel msg-in relative flex max-h-full w-full max-w-3xl flex-col gap-4 overflow-y-auto p-6">
        <button
          onClick={closeBoard}
          className="btn absolute right-3 top-3 z-10 bg-stone-800 p-1.5 text-stone-400"
          title="Close (C / Esc)"
        >
          <X size={16} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-extrabold uppercase tracking-widest text-amber-300">
            The Case Board
          </h2>
          <p className="text-xs text-stone-400">
            Click a clue, then click the suspect it implicates. Pin all {foundClues.length >= 3 ? 3 : '3'} clues
            on one suspect to unmask the Mummy!
          </p>
        </div>

        <div ref={containerRef} className="relative flex justify-between gap-16">
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {lines.map((l, i) => (
              <line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke={l.color}
                strokeWidth={2.5}
                strokeDasharray="6 3"
              />
            ))}
          </svg>

          {/* Clues column */}
          <div className="flex w-1/2 flex-col gap-3">
            {foundClues.map((id) => {
              const clue = CLUES[id]
              const Icon = clue.icon
              const selected = selectedClue === id
              return (
                <button
                  key={id}
                  ref={(el) => {
                    if (el) nodeRefs.current.set(`clue-${id}`, el)
                  }}
                  onClick={() => setSelectedClue(selected ? null : id)}
                  className={`btn flex items-start gap-2 bg-stone-800 p-3 text-left ${
                    selected ? 'ring-4 ring-amber-400' : ''
                  }`}
                >
                  <Icon size={20} className="mt-0.5 shrink-0" color={clue.color} />
                  <span>
                    <span className="block text-sm font-bold text-stone-100">{clue.name}</span>
                    <span className="block text-[11px] leading-snug text-stone-400">
                      {clue.description}
                    </span>
                  </span>
                </button>
              )
            })}
            {foundClues.length < 3 && (
              <p className="rounded border-2 border-dashed border-stone-700 p-3 text-center text-xs italic text-stone-500">
                {3 - foundClues.length} clue(s) still hidden in the museum...
              </p>
            )}
          </div>

          {/* Suspects column */}
          <div className="flex w-1/2 flex-col gap-3">
            {SUSPECTS.map((suspect) => {
              const linkedHere = foundClues.filter((c) => clueLinks[c] === suspect.id)
              const accusable = allLinked && linkedHere.length === foundClues.length
              return (
                <div
                  key={suspect.id}
                  ref={(el) => {
                    if (el) nodeRefs.current.set(`suspect-${suspect.id}`, el)
                  }}
                  className={`rounded-lg border-2 bg-stone-900 p-3 ${
                    selectedClue ? 'cursor-pointer hover:border-amber-400' : 'border-stone-600'
                  }`}
                  style={{ borderColor: selectedClue ? undefined : suspect.color }}
                  onClick={() => {
                    if (selectedClue) {
                      linkClue(selectedClue, suspect.id)
                      setSelectedClue(null)
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-stone-500"
                      style={{ backgroundColor: suspect.color }}
                    >
                      <UserRound size={18} className="text-stone-950" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-stone-100">{suspect.name}</span>
                      <span className="block text-[11px] text-stone-400">{suspect.role}</span>
                    </span>
                    {linkedHere.length > 0 && (
                      <span className="ml-auto flex items-center gap-1 rounded bg-stone-800 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                        <Link2 size={10} /> {linkedHere.length}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[11px] leading-snug text-stone-400">{suspect.bio}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      accuse(suspect.id)
                    }}
                    disabled={!accusable}
                    className="btn mt-2 w-full bg-red-900 px-2 py-1 text-xs font-extrabold uppercase tracking-widest text-red-100"
                  >
                    Unmask!
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {accusationFeedback && (
          <p className="shake rounded-lg border-2 border-red-800 bg-red-950/60 p-3 text-center text-sm text-red-300">
            {accusationFeedback}
          </p>
        )}
      </div>
    </div>
  )
}
