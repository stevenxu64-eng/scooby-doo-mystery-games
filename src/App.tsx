import { useEffect, useState } from 'react'
import { Eye, EyeOff, Ghost, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { Viewport } from './components/Viewport'
import { Inventory } from './components/Inventory'
import { CharacterHub } from './components/CharacterHub'
import { MessageBar } from './components/MessageBar'
import { useGameStore } from './store/gameStore'
import { attachAudioUnlock, toggleMute } from './engine/audio'
import type { Direction } from './types/game'

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'north',
  ArrowDown: 'south',
  ArrowLeft: 'west',
  ArrowRight: 'east',
  w: 'north',
  s: 'south',
  a: 'west',
  d: 'east',
  q: 'up',
  e: 'down',
}

export default function App() {
  const moveTo = useGameStore((s) => s.moveTo)
  const showHotspotHints = useGameStore((s) => s.showHotspotHints)
  const toggleHotspotHints = useGameStore((s) => s.toggleHotspotHints)
  const resetGame = useGameStore((s) => s.resetGame)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    attachAudioUnlock()
    const onKey = (e: KeyboardEvent) => {
      const dir = KEY_TO_DIRECTION[e.key]
      if (dir) {
        e.preventDefault()
        moveTo(dir)
      } else if (e.key === 'h') {
        toggleHotspotHints()
      } else if (e.key === 'Escape') {
        useGameStore.setState({ selectedItem: null })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [moveTo, toggleHotspotHints])

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-3 p-3 md:p-4">
      {/* Title bar */}
      <header className="kenney-panel flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <Ghost size={28} className="ghost-float text-green-400" />
          <div>
            <h1 className="font-title text-xl tracking-widest text-amber-300 md:text-2xl">
              Scooby-Doo: The Curse of the Abandoned Resort
            </h1>
            <p className="text-[11px] text-stone-400">
              Arrows/WASD move · Q/E up/down · H hotspot hints · 1-9 dialogue choices
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleHotspotHints}
            title="Toggle hotspot hints (H)"
            className={`kenney-btn p-2 ${showHotspotHints ? 'bg-cyan-800 text-cyan-200' : 'bg-stone-800 text-stone-400'}`}
          >
            {showHotspotHints ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button
            onClick={() => setMuted(toggleMute())}
            title="Toggle sound"
            className={`kenney-btn p-2 ${muted ? 'bg-stone-800 text-stone-500' : 'bg-stone-800 text-amber-300'}`}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={() => {
              if (window.confirm('Restart the mystery from the beginning? Your saved progress will be lost.')) {
                resetGame()
              }
            }}
            title="Restart mystery"
            className="kenney-btn bg-stone-800 p-2 text-stone-400"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      {/* Main scene viewport */}
      <Viewport />

      {/* Narration */}
      <MessageBar />

      {/* Bottom tray: inventory + walkie-talkie character hub */}
      <div className="flex flex-col gap-3 md:flex-row">
        <Inventory />
        <CharacterHub />
      </div>
    </div>
  )
}
