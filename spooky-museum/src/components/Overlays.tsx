import { PartyPopper, RotateCcw, Skull, Undo2 } from 'lucide-react'
import { useGameStore } from '../store/gameStore'

export function GameOverScreen() {
  const gameMode = useGameStore((s) => s.gameMode)
  const retry = useGameStore((s) => s.retry)
  const resetGame = useGameStore((s) => s.resetGame)
  if (gameMode !== 'GAMEOVER') return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-red-950/85 p-4">
      <div className="panel msg-in flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <Skull size={52} className="text-red-400" />
        <h2 className="text-3xl font-extrabold uppercase tracking-widest text-red-300">Caught!</h2>
        <p className="text-sm leading-relaxed text-stone-200">
          The Mummy wraps you up in musty bandages and dumps you back at the hall entrance.
          "ROOBY-ROOBY-NOOO!" Your clues and items are safe — but watch its patrol route and
          use the hiding spots this time.
        </p>
        <div className="flex gap-2">
          <button
            onClick={retry}
            className="btn flex items-center gap-2 bg-amber-700 px-4 py-2 text-sm font-bold uppercase text-amber-100"
          >
            <Undo2 size={16} /> Try Again
          </button>
          <button
            onClick={resetGame}
            className="btn flex items-center gap-2 bg-stone-800 px-4 py-2 text-sm font-bold uppercase text-stone-300"
          >
            <RotateCcw size={16} /> Full Restart
          </button>
        </div>
      </div>
    </div>
  )
}

export function WinScreen() {
  const gameMode = useGameStore((s) => s.gameMode)
  const resetGame = useGameStore((s) => s.resetGame)
  if (gameMode !== 'WIN') return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="panel msg-in flex max-w-lg flex-col items-center gap-4 p-8 text-center">
        <PartyPopper size={52} className="text-amber-400" />
        <h2 className="text-3xl font-extrabold uppercase tracking-widest text-amber-300">
          Mystery Solved!
        </h2>
        <p className="text-sm leading-relaxed text-stone-200">
          The gang corners the Mummy by the fountain and Velma yanks off the mask —{' '}
          <b>Night Guard Burt Grimsley!</b> Twelve grand in debt to Louie the Fish, he invented
          the "cursed Mummy" to rack up triple-overtime haunted shifts. "And I would've gotten
          away with it too, if it weren't for you meddling kids and your mangy mutt!"
        </p>
        <p className="text-xs italic text-stone-400">"Scooby-Dooby-Doo!"</p>
        <button
          onClick={resetGame}
          className="btn flex items-center gap-2 bg-amber-700 px-5 py-2 font-bold uppercase tracking-wide text-amber-100"
        >
          <RotateCcw size={18} /> Play Again
        </button>
      </div>
    </div>
  )
}
