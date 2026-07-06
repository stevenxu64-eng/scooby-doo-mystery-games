import { Ghost, RotateCcw, Trophy } from 'lucide-react'
import { useGameStore } from '../store/gameStore'

export function WinScreen() {
  const gameWon = useGameStore((s) => s.gameWon)
  const resetGame = useGameStore((s) => s.resetGame)

  if (!gameWon) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="kenney-panel msg-in flex max-w-lg flex-col items-center gap-4 p-8 text-center">
        <Ghost size={56} className="ghost-float text-green-400" />
        <Trophy size={40} className="text-amber-400" />
        <h2 className="font-title text-4xl tracking-widest text-amber-300">
          Mystery Solved!
        </h2>
        <p className="text-sm leading-relaxed text-stone-200">
          The Phantom Guest was <b>Mr. Crane the caretaker</b> all along, haunting the Grand Palm
          Resort to crash its price and buy paradise for pennies. The police haul him off, Gus gets
          his closet back, and the gang celebrates with a mountain of Scooby Snax.
        </p>
        <p className="text-xs italic text-stone-400">"Scooby-Dooby-Doo!"</p>
        <button
          onClick={resetGame}
          className="kenney-btn flex items-center gap-2 bg-amber-700 px-5 py-2 font-bold uppercase tracking-wide text-amber-100"
        >
          <RotateCcw size={18} />
          Play Again
        </button>
      </div>
    </div>
  )
}
