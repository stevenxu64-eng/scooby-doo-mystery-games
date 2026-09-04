import type { SlotSummary } from '../format/save.ts'

interface Props {
  slots: SlotSummary[]
  selected: number | null
  onSelect: (index: number) => void
}

function fmtPlaytime(min: number): string {
  const h = Math.floor(min / 60)
  return `${h}h ${String(min % 60).padStart(2, '0')}m`
}

function fmtDate(d: Date | null): string {
  return d ? d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'unknown date'
}

export function SlotList({ slots, selected, onSelect }: Props) {
  const filled = slots.filter((s) => !s.isEmpty)
  if (filled.length === 0) {
    return <p className="text-stone-400">No populated save slots were found in this file.</p>
  }
  const newest = filled.reduce((a, b) => ((b.savedAt?.getTime() ?? 0) > (a.savedAt?.getTime() ?? 0) ? b : a))
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {filled.map((s) => {
        const active = s.index === selected
        return (
          <li key={s.index}>
            <button
              type="button"
              onClick={() => onSelect(s.index)}
              aria-pressed={active}
              className={`panel w-full p-4 text-left transition hover:brightness-110 ${active ? 'ring-4 ring-amber-400/70' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-bold text-amber-200">Slot {s.index + 1}{s.title ? ` · ${s.title}` : ''}</span>
                {s === newest && <span className="rounded bg-emerald-800 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-100">Most recent</span>}
              </div>
              <div className="mt-1 text-xs text-stone-400">
                {fmtDate(s.savedAt)} · {fmtPlaytime(s.playtimeMinutes)} played · {s.inventoryKinds} item kinds in stock
              </div>
              {s.units.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.units.map((u) => (
                    <span key={u.index} className="rounded bg-stone-800 px-2 py-0.5 text-xs text-stone-200" title={`Brave ${u.brave} · Faith ${u.faith}`}>
                      {u.name} <span className="text-stone-400">Lv{u.level} {u.job}</span>
                    </span>
                  ))}
                </div>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
