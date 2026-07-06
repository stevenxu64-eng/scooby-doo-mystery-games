import { Backpack, Combine } from 'lucide-react'
import { ITEMS } from '../data/items'
import { ItemIcon } from './ItemArt'
import { useGameStore } from '../store/gameStore'

const SLOT_COUNT = 8

export function Inventory() {
  const playerInventory = useGameStore((s) => s.playerInventory)
  const selectedItem = useGameStore((s) => s.selectedItem)
  const selectItem = useGameStore((s) => s.selectItem)

  return (
    <div className="kenney-panel flex flex-1 items-center gap-3 px-4 py-3">
      <div className="flex flex-col items-center text-amber-400">
        <Backpack size={26} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Items</span>
      </div>

      <div className="flex flex-1 gap-2">
        {Array.from({ length: SLOT_COUNT }, (_, i) => {
          const itemId = playerInventory[i]
          const item = itemId ? ITEMS[itemId] : undefined
          const isSelected = itemId != null && itemId === selectedItem
          if (!item) {
            return (
              <div
                key={i}
                className="aspect-square w-12 rounded-lg border-2 border-dashed border-stone-600/70 bg-stone-900/60 md:w-14"
              />
            )
          }
          const Icon = item.icon
          const art = ItemIcon({ id: item.id, className: 'h-9 w-9 md:h-10 md:w-10' })
          return (
            <button
              key={i}
              onClick={() => selectItem(item.id)}
              title={`${item.name} — ${item.description}`}
              className={`kenney-btn flex aspect-square w-12 items-center justify-center bg-stone-800 md:w-14 ${
                isSelected ? 'ring-4 ring-amber-400 brightness-125' : ''
              }`}
            >
              {art ?? <Icon size={26} color={item.color} strokeWidth={2.25} />}
            </button>
          )
        })}
      </div>

      <div className="hidden w-40 shrink-0 text-[11px] leading-tight text-stone-400 lg:block">
        <Combine size={12} className="mr-1 inline text-stone-500" />
        Click an item to arm it, then click a hotspot to use it — or click a second item to combine.
      </div>
    </div>
  )
}
