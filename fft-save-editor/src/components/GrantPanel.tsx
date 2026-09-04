import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { CATEGORY_GROUPS, type GrantChange, type GrantOptions } from '../format/equipment.ts'
import { useGrantPlan } from '../hooks/useGrantPlan.ts'
import type { ItemCategory } from '../data/items.ts'

interface Props {
  inventory: Uint8Array
  options: GrantOptions
  onChange: (next: GrantOptions) => void
}

export function GrantPanel({ inventory, options, onChange }: Props) {
  const plan = useGrantPlan(inventory, options)
  const [showList, setShowList] = useState(false)

  const groupOn = (cats: ItemCategory[]) => cats.every((c) => options.categories.has(c))
  const toggleGroup = (cats: ItemCategory[]) => {
    const next = new Set(options.categories)
    if (groupOn(cats)) cats.forEach((c) => next.delete(c))
    else cats.forEach((c) => next.add(c))
    onChange({ ...options, categories: next })
  }

  const byGroup = useMemo(() => {
    const m = new Map<string, GrantChange[]>()
    for (const g of CATEGORY_GROUPS) m.set(g.key, [])
    for (const ch of plan?.changes ?? []) {
      const g = CATEGORY_GROUPS.find((x) => x.categories.includes(ch.category))
      if (g) m.get(g.key)!.push(ch)
    }
    return m
  }, [plan])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-bold text-stone-300">Count per item</span>
          <input
            type="number"
            min={1}
            max={255}
            value={options.count}
            onChange={(e) => onChange({ ...options, count: Math.max(1, Math.min(255, Number(e.target.value) || 1)) })}
            className="w-24 rounded border border-stone-600 bg-stone-900 px-2 py-1 text-lg font-bold text-amber-200"
          />
          <span className="text-xs text-stone-500">99 is what the shop can reach; 255 is the byte maximum.</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={options.neverLower} onChange={(e) => onChange({ ...options, neverLower: e.target.checked })} />
          Never lower a count you already have
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={options.onlyMissing} onChange={(e) => onChange({ ...options, onlyMissing: e.target.checked })} />
          Only add items you have none of
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORY_GROUPS.map((g) => {
          const on = groupOn(g.categories)
          const n = byGroup.get(g.key)?.length ?? 0
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => toggleGroup(g.categories)}
              aria-pressed={on}
              className={`rounded-full border-2 px-3 py-1 text-sm font-bold ${on ? 'border-amber-400 bg-amber-900/50 text-amber-100' : 'border-stone-600 bg-stone-900 text-stone-500'}`}
            >
              {g.label}{on && n > 0 ? ` · ${n}` : ''}
            </button>
          )
        })}
      </div>

      {plan && (
        <div className="rounded-lg border border-stone-700 bg-stone-950/60 p-3 text-sm">
          <button type="button" className="flex items-center gap-1 font-bold text-amber-200" onClick={() => setShowList((v) => !v)}>
            {showList ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {plan.changes.length === 0 ? 'Nothing would change with these settings.' : `${plan.changes.length} item${plan.changes.length === 1 ? '' : 's'} will change`}
          </button>
          {showList && plan.changes.length > 0 && (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {CATEGORY_GROUPS.map((g) => {
                const list = byGroup.get(g.key) ?? []
                if (list.length === 0) return null
                return (
                  <div key={g.key}>
                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-400">{g.label}</div>
                    <ul className="columns-2 text-xs leading-5 text-stone-300">
                      {list.map((c) => (
                        <li key={c.id}>{c.name} <span className="text-stone-500">{c.from}→{c.to}</span></li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
