import { useEffect, useState } from 'react'
import { Eye, EyeOff, Ghost, NotebookText, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { Viewport } from './components/Viewport'
import { Inventory } from './components/Inventory'
import { CharacterHub } from './components/CharacterHub'
import { MessageBar } from './components/MessageBar'
import { NotebookOverlay } from './components/NotebookOverlay'
import { IntroScreen } from './components/IntroScreen'
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
  const introSeen = useGameStore((s) => s.introSeen)
  const completeIntro = useGameStore((s) => s.completeIntro)
  const caseCount = useGameStore((s) => s.caseLog.length)
  const caseSeen = useGameStore((s) => s.caseSeen)
  const markCaseSeen = useGameStore((s) => s.markCaseSeen)
  const [muted, setMuted] = useState(false)
  const [notebookOpen, setNotebookOpen] = useState(false)

  // The badge counts only NEW notes; reviewing the list clears it.
  const caseUnread = Math.max(0, caseCount - caseSeen)
  useEffect(() => {
    if (notebookOpen) markCaseSeen()
  }, [notebookOpen, caseCount, markCaseSeen])

  useEffect(() => {
    attachAudioUnlock()
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack keys while the player is typing (e.g. the notebook search box).
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          setNotebookOpen(false)
          e.target.blur()
        }
        return
      }
      const dir = KEY_TO_DIRECTION[e.key]
      if (dir) {
        e.preventDefault()
        moveTo(dir)
      } else if (e.key === 'h') {
        toggleHotspotHints()
      } else if (e.key === 'n') {
        setNotebookOpen((v) => !v)
      } else if (e.key === 'Escape') {
        setNotebookOpen(false)
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
            onClick={() => setNotebookOpen((v) => !v)}
            title="Velma's Case Notes (N)"
            className={`kenney-btn relative p-2 ${notebookOpen ? 'bg-amber-800 text-amber-200' : 'bg-stone-800 text-amber-300'}`}
          >
            <NotebookText size={18} />
            {caseUnread > 0 && (
              <span className="absolute -right-1.5 -top-1.5 rounded-full bg-amber-400 px-1.5 text-[9px] font-bold leading-4 text-stone-900">
                {caseUnread}
              </span>
            )}
          </button>
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

      {/* Main scene viewport — letterboxed so the stage is always exactly 16:9 */}
      <div
        className="flex min-h-0 flex-1 items-center justify-center"
        style={{ containerType: 'size' }}
      >
        <Viewport />
      </div>

      {/* Narration */}
      <MessageBar />

      {/* Bottom tray: inventory + walkie-talkie character hub */}
      <div className="flex flex-col gap-3 md:flex-row">
        <Inventory />
        <CharacterHub />
      </div>

      {/* Velma's Case Notes overlay */}
      {notebookOpen && <NotebookOverlay onClose={() => setNotebookOpen(false)} />}

      {/* Opening cutscene: the Mystery Machine arrives at the Grand Palm */}
      {!introSeen && <IntroScreen onDone={completeIntro} />}
    </div>
  )
}
