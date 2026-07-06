import { ClipboardList, Eye, EyeOff, Gauge, Key, ScrollText, Search, Skull } from 'lucide-react'
import { CLUES, CLUE_ORDER, ITEMS } from '../data/mystery'
import {
  currentObjective,
  DIFFICULTY_MODS,
  MAPS,
  useGameStore,
  type Difficulty,
} from '../store/gameStore'

function ModeChip() {
  const gameMode = useGameStore((s) => s.gameMode)
  const chasing = useGameStore((s) => s.monsterAI?.mode === 'CHASE')
  if (gameMode === 'HIDING') {
    return (
      <span className="flex items-center gap-1 rounded bg-green-900/80 px-2 py-0.5 text-xs font-bold text-green-300">
        <EyeOff size={12} /> HIDDEN
      </span>
    )
  }
  if (chasing) {
    return (
      <span className="flex animate-pulse items-center gap-1 rounded bg-red-900/80 px-2 py-0.5 text-xs font-bold text-red-300">
        <Skull size={12} /> CHASED!
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 rounded bg-stone-800 px-2 py-0.5 text-xs font-bold text-stone-300">
      <Eye size={12} /> EXPLORING
    </span>
  )
}

export function Sidebar() {
  const activeRoomId = useGameStore((s) => s.activeRoomId)
  const foundClues = useGameStore((s) => s.foundClues)
  const inventory = useGameStore((s) => s.inventory)
  const openBoard = useGameStore((s) => s.openBoard)
  const objective = useGameStore(currentObjective)

  return (
    <aside className="panel flex w-72 shrink-0 flex-col gap-4 p-4">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-amber-300">
            {MAPS[activeRoomId].name}
          </h2>
          <ModeChip />
        </div>
        <p className="text-xs leading-snug text-stone-400">{objective}</p>
      </div>

      <div>
        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
          <Search size={13} /> Clues ({foundClues.length}/3)
        </h3>
        <div className="flex flex-col gap-1.5">
          {CLUE_ORDER.map((id) => {
            const clue = CLUES[id]
            const found = foundClues.includes(id)
            const Icon = clue.icon
            return (
              <div
                key={id}
                title={found ? clue.description : 'Not found yet...'}
                className={`flex items-center gap-2 rounded-lg border-2 px-2 py-1.5 text-xs font-semibold ${
                  found
                    ? 'border-stone-500 bg-stone-800 text-stone-100'
                    : 'border-dashed border-stone-700 bg-stone-900/50 text-stone-600'
                }`}
              >
                <Icon size={16} color={found ? clue.color : '#57534e'} />
                {found ? clue.name : '???'}
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
          <Key size={13} /> Items
        </h3>
        {inventory.length === 0 ? (
          <p className="text-xs italic text-stone-600">Empty pockets (except Scooby Snax crumbs).</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {inventory.map((id) => (
              <span
                key={id}
                title={ITEMS[id]?.description}
                className="flex items-center gap-1 rounded bg-amber-900/70 px-2 py-1 text-xs font-bold text-amber-200"
              >
                <Key size={12} /> {ITEMS[id]?.name ?? id}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={openBoard}
        disabled={foundClues.length === 0}
        className={`btn flex items-center justify-center gap-2 px-3 py-2 text-sm font-extrabold uppercase tracking-wide ${
          foundClues.length >= 3 ? 'pulse-glow bg-green-800 text-green-100' : 'bg-indigo-900 text-indigo-200'
        }`}
      >
        <ClipboardList size={16} />
        Case Board (C)
      </button>

      <div>
        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
          <Gauge size={13} /> Difficulty
        </h3>
        <div className="flex gap-1.5">
          {(Object.keys(DIFFICULTY_MODS) as Difficulty[]).map((d) => (
            <DifficultyButton key={d} value={d} />
          ))}
        </div>
      </div>

      <div className="mt-auto rounded-lg bg-stone-900/60 p-2 text-[11px] leading-relaxed text-stone-500">
        <b className="text-stone-400">Controls:</b> WASD/arrows or click to move · E to
        interact · stand on a <span className="text-green-500">green diamond</span> to hide ·
        walk onto a <span className="text-cyan-400">cyan diamond</span> to change rooms.
        Avoid the Mummy's line of sight!
      </div>
    </aside>
  )
}

function DifficultyButton({ value }: { value: Difficulty }) {
  const difficulty = useGameStore((s) => s.difficulty)
  const setDifficulty = useGameStore((s) => s.setDifficulty)
  const active = difficulty === value
  const activeStyle =
    value === 'easy'
      ? 'bg-green-900 text-green-200'
      : value === 'spooky'
        ? 'bg-red-900 text-red-200'
        : 'bg-indigo-900 text-indigo-200'
  return (
    <button
      onClick={() => setDifficulty(value)}
      className={`btn flex-1 px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide ${
        active ? activeStyle : 'bg-stone-900 text-stone-500'
      }`}
    >
      {DIFFICULTY_MODS[value].label}
    </button>
  )
}

export function MessageBar() {
  const message = useGameStore((s) => s.message)
  const messageId = useGameStore((s) => s.messageId)
  return (
    <div className="panel flex min-h-14 items-center gap-3 px-4 py-2">
      <ScrollText size={18} className="shrink-0 text-amber-400" />
      <p key={messageId} className="msg-in max-h-14 overflow-y-auto text-sm leading-snug text-amber-100">
        {message}
      </p>
    </div>
  )
}
