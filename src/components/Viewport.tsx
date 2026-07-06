import { useEffect, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
} from 'lucide-react'
import type { Direction, NavLink } from '../types/game'
import { SCENES, useGameStore } from '../store/gameStore'
import { setAmbience } from '../engine/audio'
import { DialogueOverlay } from './DialogueOverlay'
import { WinScreen } from './WinScreen'
import { SceneOverlays } from './SceneOverlays'
import { CharacterBust } from './CharacterArt'

const NAV_META: Record<
  Direction,
  { icon: typeof ChevronUp; className: string }
> = {
  north: { icon: ChevronUp, className: 'top-2 left-1/2 -translate-x-1/2' },
  south: { icon: ChevronDown, className: 'bottom-2 left-1/2 -translate-x-1/2' },
  east: { icon: ChevronRight, className: 'right-2 top-1/2 -translate-y-1/2' },
  west: { icon: ChevronLeft, className: 'left-2 top-1/2 -translate-y-1/2' },
  up: { icon: ArrowUpFromLine, className: 'top-2 right-14' },
  down: { icon: ArrowDownToLine, className: 'bottom-2 right-14' },
}

function NavArrow({ link }: { link: NavLink }) {
  const moveTo = useGameStore((s) => s.moveTo)
  const locked = useGameStore(
    (s) => !!link.locked_by_flag && !s.gameFlags[link.locked_by_flag],
  )
  const meta = NAV_META[link.direction]
  const Icon = meta.icon
  return (
    <button
      onClick={() => moveTo(link.direction)}
      title={locked ? `${link.label} (locked)` : `Go to ${link.label}`}
      className={`kenney-btn absolute z-20 flex items-center gap-1 px-2 py-2 text-amber-100 ${
        locked ? 'bg-stone-800/90 opacity-70' : 'bg-amber-700/90'
      } ${meta.className}`}
    >
      <Icon size={22} strokeWidth={3} />
      <span className="hidden text-xs font-bold uppercase tracking-wide md:inline">
        {link.label}
        {locked ? ' 🔒' : ''}
      </span>
    </button>
  )
}

export function Viewport() {
  const activeRoom = useGameStore((s) => s.activeRoom)
  const clickHotspot = useGameStore((s) => s.clickHotspot)
  const isHotspotVisible = useGameStore((s) => s.isHotspotVisible)
  const gameFlags = useGameStore((s) => s.gameFlags)
  const selectedItem = useGameStore((s) => s.selectedItem)
  const showHotspotHints = useGameStore((s) => s.showHotspotHints)
  const scene = SCENES[activeRoom]

  // Track per-scene backdrop load failures so the gradient placeholder shows
  // until real renders are dropped into /public/assets/scenes/.
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const imageFailed = failedImages[scene.id]

  useEffect(() => {
    setAmbience(scene.ambience)
  }, [scene.ambience])

  // gameFlags is read so hotspot visibility re-renders on any flag change.
  void gameFlags

  return (
    <div
      className="kenney-panel relative w-full overflow-hidden"
      style={{ aspectRatio: '16 / 9', width: 'min(100cqw, calc(100cqh * 16 / 9))' }}
    >
      {/* Backdrop: real render if present, semantic gradient placeholder otherwise */}
      <div className="absolute inset-0" style={{ background: scene.fallback_gradient }} />
      {!imageFailed && (
        <img
          src={`${import.meta.env.BASE_URL}${scene.background_image_url.replace(/^\//, '')}`}
          alt={scene.name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailedImages((f) => ({ ...f, [scene.id]: true }))}
        />
      )}

      {/* Flag-driven scene layers (opened doors, rigged traps, ...) */}
      <SceneOverlays sceneId={scene.id} />

      {/* Scene name plate */}
      <div className="kenney-panel font-title absolute left-2 top-2 z-20 px-3 py-1 text-base tracking-widest text-amber-300">
        {scene.name}
      </div>

      {/* Hotspots */}
      {scene.clickable_hotspots.filter(isHotspotVisible).map((h) => (
        <button
          key={h.id}
          onClick={() => clickHotspot(h)}
          title={h.label}
          aria-label={h.label}
          style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
          className={`group absolute z-10 rounded-lg border-2 ${
            showHotspotHints
              ? 'hotspot-hint border-cyan-300/80 bg-cyan-300/10'
              : 'border-transparent hover:border-amber-300/80 hover:bg-amber-200/10'
          } ${selectedItem ? 'cursor-crosshair' : 'cursor-sleuth'}`}
        >
          <span className="pointer-events-none absolute -top-7 left-1/2 z-30 hidden -translate-x-1/2 whitespace-nowrap rounded border border-stone-500 bg-stone-900/95 px-2 py-0.5 text-xs font-bold text-amber-200 group-hover:block">
            <Search size={10} className="mr-1 inline" />
            {h.label}
          </span>
        </button>
      ))}

      {/* Navigation arrows */}
      {scene.navigation_links.map((link) => (
        <NavArrow key={link.direction} link={link} />
      ))}

      <ActionCameo />
      <DialogueOverlay />
      <WinScreen />
    </div>
  )
}

/** The active character pops up at the hotspot they just used, then fades. */
function ActionCameo() {
  const lastCameo = useGameStore((s) => s.lastCameo)
  if (!lastCameo) return null
  return (
    <div
      key={lastCameo.id}
      className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full"
      style={{
        left: `${Math.min(Math.max(lastCameo.x, 6), 94)}%`,
        top: `${Math.min(Math.max(lastCameo.y, 20), 96)}%`,
        width: '9%',
      }}
    >
      <div className="anim-cameo aspect-[120/130] w-full">
        <CharacterBust id={lastCameo.character} />
      </div>
    </div>
  )
}
