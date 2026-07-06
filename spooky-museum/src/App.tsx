import { useState } from 'react'
import { Ghost, Volume2, VolumeX } from 'lucide-react'
import { GameCanvas } from './components/GameCanvas'
import { Sidebar, MessageBar } from './components/HUD'
import { PuzzleOverlay } from './components/PuzzleOverlay'
import { UnmaskingBoard } from './components/UnmaskingBoard'
import { GameOverScreen, WinScreen } from './components/Overlays'
import { toggleMute } from './engine/audio'

export default function App() {
  const [muted, setMuted] = useState(false)

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-3 p-3 md:p-4">
      <header className="panel flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <Ghost size={26} className="text-green-400" />
          <div>
            <h1 className="text-lg font-extrabold uppercase tracking-widest text-amber-300">
              Scooby-Doo: Night at the Spooky Museum
            </h1>
            <p className="text-[11px] text-stone-400">
              Isometric escape room · evade the Mummy · find 3 clues · unmask the culprit
            </p>
          </div>
        </div>
        <button
          onClick={() => setMuted(toggleMute())}
          title="Toggle sound"
          className={`btn p-2 ${muted ? 'bg-stone-800 text-stone-500' : 'bg-stone-800 text-amber-300'}`}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </header>

      <div className="flex min-h-0 flex-1 gap-3">
        <div className="relative flex min-w-0 flex-1 flex-col gap-3">
          <div className="panel relative overflow-hidden p-1.5">
            <GameCanvas />
            {/* Overlays cover the play area only */}
            <PuzzleOverlay />
            <UnmaskingBoard />
            <GameOverScreen />
            <WinScreen />
          </div>
          <MessageBar />
        </div>
        <Sidebar />
      </div>
    </div>
  )
}
