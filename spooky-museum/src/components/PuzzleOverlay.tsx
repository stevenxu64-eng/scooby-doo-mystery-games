import { useEffect, useMemo, useRef, useState } from 'react'
import { Bird, Bug, Eye, Film, Sun, X, Zap } from 'lucide-react'
import { MAPS, useGameStore } from '../store/gameStore'
import { playSfx } from '../engine/audio'

/* ---------------------------------- Dials ---------------------------------- */

const DIAL_SYMBOLS = [
  { icon: Sun, name: 'Sun' },
  { icon: Eye, name: 'Eye' },
  { icon: Bug, name: 'Scarab' },
  { icon: Bird, name: 'Falcon' },
]
// Plaque: "The EYE watches. The SCARAB crawls. The EYE watches again."
const DIAL_TARGET = [1, 2, 1]

function DialsPuzzle({ onSolve }: { onSolve: () => void }) {
  const [dials, setDials] = useState([0, 0, 0])
  const solvedRef = useRef(false)
  const solved = dials.every((d, i) => d === DIAL_TARGET[i])

  useEffect(() => {
    if (!solved || solvedRef.current) return
    solvedRef.current = true
    const t = setTimeout(onSolve, 700)
    return () => clearTimeout(t)
  }, [solved, onSolve])

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="max-w-md text-center text-sm text-stone-300">
        Three rotating seals guard the sarcophagus. Click a dial to rotate it. Velma's
        translation of the plaque might hold the order...
      </p>
      <div className="flex gap-4">
        {dials.map((value, i) => {
          const Icon = DIAL_SYMBOLS[value].icon
          const correct = value === DIAL_TARGET[i]
          return (
            <button
              key={i}
              onClick={() => {
                if (solvedRef.current) return
                playSfx('click', 0.4)
                setDials((d) => d.map((v, j) => (j === i ? (v + 1) % DIAL_SYMBOLS.length : v)))
              }}
              className={`btn flex h-24 w-24 flex-col items-center justify-center gap-1 ${
                solved ? 'bg-green-800' : correct ? 'bg-stone-700' : 'bg-stone-800'
              }`}
              title={`Dial ${i + 1}: ${DIAL_SYMBOLS[value].name}`}
            >
              <Icon size={36} className={solved ? 'text-green-300' : 'text-amber-300'} />
              <span className="text-[10px] font-bold uppercase text-stone-400">
                {DIAL_SYMBOLS[value].name}
              </span>
            </button>
          )
        })}
      </div>
      {solved && (
        <p className="msg-in text-sm font-bold text-green-400">
          KA-CHUNK! The seals align and the lid grinds open...
        </p>
      )}
    </div>
  )
}

/* -------------------------------- Light beam -------------------------------- */

type Dir = 'E' | 'W' | 'N' | 'S'
const DIR_VEC: Record<Dir, { dr: number; dc: number }> = {
  E: { dr: 0, dc: 1 },
  W: { dr: 0, dc: -1 },
  N: { dr: -1, dc: 0 },
  S: { dr: 1, dc: 0 },
}
const SLASH: Record<Dir, Dir> = { E: 'N', W: 'S', N: 'E', S: 'W' } // '/'
const BACKSLASH: Record<Dir, Dir> = { E: 'S', W: 'N', N: 'W', S: 'E' } // '\'

const BEAM_SIZE = 5
const BEAM_START = { r: 2, c: 0, dir: 'E' as Dir }
const BEAM_TARGET = { r: 4, c: 4 }
const BLOCKED = new Set(['1,1', '3,3'])
const INITIAL_MIRRORS: Record<string, '/' | '\\'> = {
  '2,2': '/',
  '4,2': '/',
  '0,2': '/',
  '3,1': '/',
}

interface BeamTrace {
  points: { r: number; c: number }[]
  hit: boolean
}

function traceBeam(mirrors: Record<string, '/' | '\\'>): BeamTrace {
  const points: { r: number; c: number }[] = []
  let { r, c } = { r: BEAM_START.r, c: BEAM_START.c - 1 }
  let dir = BEAM_START.dir
  for (let step = 0; step < 60; step++) {
    r += DIR_VEC[dir].dr
    c += DIR_VEC[dir].dc
    if (r < 0 || c < 0 || r >= BEAM_SIZE || c >= BEAM_SIZE) break
    const key = `${r},${c}`
    if (BLOCKED.has(key)) break
    points.push({ r, c })
    if (r === BEAM_TARGET.r && c === BEAM_TARGET.c) return { points, hit: true }
    const mirror = mirrors[key]
    if (mirror === '/') dir = SLASH[dir]
    else if (mirror === '\\') dir = BACKSLASH[dir]
  }
  return { points, hit: false }
}

const CELL = 60

function BeamPuzzle({ onSolve }: { onSolve: () => void }) {
  const [mirrors, setMirrors] = useState(INITIAL_MIRRORS)
  const solvedRef = useRef(false)
  const trace = useMemo(() => traceBeam(mirrors), [mirrors])

  useEffect(() => {
    if (!trace.hit || solvedRef.current) return
    solvedRef.current = true
    const t = setTimeout(onSolve, 800)
    return () => clearTimeout(t)
  }, [trace.hit, onSolve])

  const beamPoints = [
    { x: -CELL / 2, y: BEAM_START.r * CELL + CELL / 2 },
    ...trace.points.map((p) => ({ x: p.c * CELL + CELL / 2, y: p.r * CELL + CELL / 2 })),
  ]

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="max-w-md text-center text-sm text-stone-300">
        The projector lamp fires from the left. Click the loose mirrors to flip them and
        bounce the beam onto the <b className="text-amber-300">film sensor</b> (bottom-right).
      </p>
      <div className="relative" style={{ width: BEAM_SIZE * CELL, height: BEAM_SIZE * CELL }}>
        {Array.from({ length: BEAM_SIZE }, (_, r) =>
          Array.from({ length: BEAM_SIZE }, (_, c) => {
            const key = `${r},${c}`
            const mirror = mirrors[key]
            const blocked = BLOCKED.has(key)
            const isTarget = r === BEAM_TARGET.r && c === BEAM_TARGET.c
            return (
              <div
                key={key}
                className={`absolute flex items-center justify-center border border-stone-700 ${
                  blocked ? 'bg-stone-950' : 'bg-stone-800/70'
                }`}
                style={{ left: c * CELL, top: r * CELL, width: CELL, height: CELL }}
              >
                {blocked && <X size={22} className="text-stone-700" />}
                {isTarget && (
                  <Film size={26} className={trace.hit ? 'text-green-400' : 'text-amber-400'} />
                )}
                {mirror && (
                  <button
                    onClick={() => {
                      if (solvedRef.current) return
                      playSfx('click', 0.4)
                      setMirrors((m) => ({ ...m, [key]: m[key] === '/' ? '\\' : '/' }))
                    }}
                    className="btn flex h-11 w-11 items-center justify-center bg-indigo-900/90 text-xl font-black text-cyan-300"
                    title="Flip mirror"
                  >
                    {mirror}
                  </button>
                )}
              </div>
            )
          }),
        )}
        {/* Emitter */}
        <div
          className="absolute flex items-center"
          style={{ left: -30, top: BEAM_START.r * CELL + CELL / 2 - 11 }}
        >
          <Zap size={22} className="text-yellow-300" />
        </div>
        {/* Beam */}
        <svg
          className="pointer-events-none absolute inset-0"
          width={BEAM_SIZE * CELL}
          height={BEAM_SIZE * CELL}
          style={{ overflow: 'visible' }}
        >
          <polyline
            points={beamPoints.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={trace.hit ? '#4ade80' : '#fde047'}
            strokeWidth={4}
            strokeLinejoin="round"
            opacity={0.85}
          />
        </svg>
      </div>
      {trace.hit && (
        <p className="msg-in text-sm font-bold text-green-400">
          The beam hits the sensor — the film reel spins to life!
        </p>
      )}
    </div>
  )
}

/* --------------------------------- Overlay --------------------------------- */

export function PuzzleOverlay() {
  const gameMode = useGameStore((s) => s.gameMode)
  const activePuzzleId = useGameStore((s) => s.activePuzzleId)
  const activeRoomId = useGameStore((s) => s.activeRoomId)
  const closePuzzle = useGameStore((s) => s.closePuzzle)
  const solveActivePuzzle = useGameStore((s) => s.solveActivePuzzle)

  if (gameMode !== 'PUZZLE_VIEW' || !activePuzzleId) return null
  const def = MAPS[activeRoomId].interactives.find((i) => i.id === activePuzzleId)
  if (!def) return null

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="panel msg-in relative max-w-2xl p-6">
        <button
          onClick={closePuzzle}
          className="btn absolute right-3 top-3 bg-stone-800 p-1.5 text-stone-400"
          title="Step away (Esc)"
        >
          <X size={16} />
        </button>
        <h2 className="mb-4 text-center text-xl font-extrabold uppercase tracking-widest text-amber-300">
          {def.label}
        </h2>
        {def.puzzle === 'dials' ? (
          <DialsPuzzle onSolve={solveActivePuzzle} />
        ) : (
          <BeamPuzzle onSolve={solveActivePuzzle} />
        )}
      </div>
    </div>
  )
}
