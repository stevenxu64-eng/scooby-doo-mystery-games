import { useEffect, useReducer, type CSSProperties, type ReactNode } from 'react'
import { useGameStore } from '../store/gameStore'

/**
 * Flag-driven scene layers. The backdrops are static paintings; everything
 * that CHANGES during play (doors, drawers, ropes, padlocks, the trap...)
 * lives here, positioned in viewport percentages to match the backdrop art.
 * When a flag flips while you watch, the layer plays its entrance animation;
 * revisiting the room later shows the settled end-state without replaying it.
 */

const RECENT_MS = 3500

interface OverlayDef {
  id: string
  /** Render only when ALL of these flags are true... */
  when?: string[]
  /** ...and ALL of these are false. */
  unless?: string[]
  /** Flag whose recent flip triggers animClass (falls back to staticClass). */
  animFlag?: string
  animClass?: string
  staticClass?: string
  /** One-shot effect: render only within this window of animFlag flipping. */
  ephemeralMs?: number
  style: CSSProperties
  node: ReactNode
}

const pct = (x: number, y: number, w: number, h: number): CSSProperties => ({
  left: `${x}%`,
  top: `${y}%`,
  width: `${w}%`,
  height: `${h}%`,
})

/* ---------------------------------------------------------------- lobby */

const closetDoorLeaf = (
  <svg viewBox="0 0 148 406" className="h-full w-full" preserveAspectRatio="none">
    <rect width="148" height="406" rx="5" fill="#3f2812" />
    <rect x="14" y="24" width="120" height="150" rx="4" fill="#2c1c0c" />
    <rect x="14" y="212" width="120" height="168" rx="4" fill="#2c1c0c" />
    <rect x="20" y="66" width="108" height="26" rx="3" fill="#101d2c" />
    <text x="74" y="85" fontFamily="Trebuchet MS" fontSize="17" fill="#d8c795" textAnchor="middle">MAINTENANCE</text>
    <circle cx="130" cy="196" r="9" fill="#c9a24a" />
    <rect x="120" y="166" width="20" height="24" rx="3" fill="#6b6b70" />
    <path d="M0 0 v406" stroke="#1c1206" strokeWidth="6" />
  </svg>
)

const LOBBY: OverlayDef[] = [
  {
    id: 'door_leaf_closed',
    unless: ['closet_unlocked'],
    style: pct(3.5, 29.1, 9.25, 45.2),
    node: closetDoorLeaf,
  },
  {
    id: 'door_leaf_open',
    when: ['closet_unlocked'],
    animFlag: 'closet_unlocked',
    animClass: 'anim-door-swing',
    staticClass: 'anim-door-open',
    style: pct(3.5, 29.1, 9.25, 45.2),
    node: closetDoorLeaf,
  },
  {
    id: 'drawer_closed',
    unless: ['took_flashlight'],
    style: pct(38.75, 61.3, 15.6, 14.5),
    node: (
      <svg viewBox="0 0 250 130" className="h-full w-full" preserveAspectRatio="none">
        <rect width="250" height="130" rx="6" fill="#4a2e10" />
        <rect x="10" y="10" width="230" height="110" rx="4" fill="none" stroke="#331e08" strokeWidth="5" />
        <rect x="80" y="56" width="90" height="17" rx="8" fill="#c9a24a" />
        <path d="M84 60 h82" stroke="#e0bd60" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: 'drawer_open',
    when: ['took_flashlight'],
    animFlag: 'took_flashlight',
    animClass: 'anim-drawer-slide',
    style: pct(38.75, 63.5, 15.6, 14.5),
    node: (
      <svg viewBox="0 0 250 130" className="h-full w-full" preserveAspectRatio="none">
        <path d="M0 0 h250 l-22 44 h-206 Z" fill="#170d03" />
        <rect y="44" width="250" height="86" rx="6" fill="#593714" />
        <rect x="10" y="54" width="230" height="66" rx="4" fill="none" stroke="#3b2409" strokeWidth="5" />
        <rect x="80" y="76" width="90" height="16" rx="8" fill="#c9a24a" />
        <path d="M22 44 v-14 h206 v14" fill="#241505" />
      </svg>
    ),
  },
]

/* -------------------------------------------------------------- grounds */

const GROUNDS: OverlayDef[] = [
  {
    id: 'bush_stick',
    unless: ['got_stick'],
    style: pct(20.6, 63, 4.5, 15),
    node: (
      <svg viewBox="0 0 72 135" className="h-full w-full" preserveAspectRatio="none">
        <path d="M60 128 Q30 70 40 8" stroke="#8a6636" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M42 34 q-16 -6 -22 -18" stroke="#8a6636" strokeWidth="6" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'vend_box_hanging',
    unless: ['shook_vending'],
    style: pct(82.6, 46.8, 3.8, 4.6),
    node: (
      <svg viewBox="0 0 60 42" className="h-full w-full">
        <g transform="rotate(14 30 21)">
          <rect x="6" y="4" width="46" height="30" rx="4" fill="#e8b73a" />
          <rect x="6" y="4" width="46" height="12" rx="4" fill="#c99b28" />
          <circle cx="29" cy="24" r="5" fill="#7a4b12" />
        </g>
      </svg>
    ),
  },
  {
    id: 'vend_box_dropped',
    when: ['shook_vending'],
    animFlag: 'shook_vending',
    animClass: 'anim-drop-bounce',
    style: pct(79.6, 69.6, 6.2, 4.8),
    node: (
      <svg viewBox="0 0 100 44" className="h-full w-full">
        <rect x="20" y="8" width="52" height="32" rx="4" fill="#e8b73a" transform="rotate(-8 46 24)" />
        <rect x="20" y="8" width="52" height="13" rx="4" fill="#c99b28" transform="rotate(-8 46 24)" />
        <circle cx="44" cy="28" r="5.5" fill="#7a4b12" transform="rotate(-8 46 24)" />
      </svg>
    ),
  },
  {
    id: 'shed_light',
    when: ['shed_lit'],
    animFlag: 'shed_lit',
    animClass: 'msg-in anim-soft-glow',
    staticClass: 'anim-soft-glow',
    style: pct(33.9, 38.5, 7.7, 28),
    node: (
      <svg viewBox="0 0 123 252" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="shedlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe9b0" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ffd98a" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <rect x="4" width="115" height="244" fill="url(#shedlight)" />
        <path d="M20 60 h80 M20 120 h80 M20 180 h80" stroke="#c9a24a" strokeWidth="4" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'grate_glint',
    when: ['shed_lit'],
    unless: ['got_janitor_key'],
    staticClass: 'anim-soft-glow',
    style: pct(34.2, 69.8, 2.2, 3.4),
    node: (
      <svg viewBox="0 0 36 30" className="h-full w-full">
        <circle cx="18" cy="15" r="6" fill="#ffe9a0" />
        <path d="M18 1 v28 M4 15 h28 M8 5 l20 20 M28 5 l-20 20" stroke="#ffe9a0" strokeWidth="2.4" opacity="0.85" />
      </svg>
    ),
  },
  {
    id: 'key_rise',
    when: ['got_janitor_key'],
    animFlag: 'got_janitor_key',
    animClass: 'anim-rise-fade',
    ephemeralMs: 2200,
    style: pct(33.4, 64.5, 3.6, 8.5),
    node: (
      <svg viewBox="0 0 58 76" className="h-full w-full">
        <circle cx="29" cy="20" r="14" fill="none" stroke="#e0bd60" strokeWidth="7" />
        <path d="M29 34 V66 M29 54 h12 M29 64 h9" stroke="#e0bd60" strokeWidth="7" strokeLinecap="round" />
      </svg>
    ),
  },
]

/* --------------------------------------------------------------- closet */

const CLOSET: OverlayDef[] = [
  {
    id: 'rope_on_wall',
    unless: ['got_rope'],
    style: pct(69.4, 27, 11, 20.5),
    node: (
      <svg viewBox="0 0 176 185" className="h-full w-full">
        <g fill="none" stroke="#b98b4e" strokeWidth="14">
          <circle cx="88" cy="82" r="62" />
          <circle cx="88" cy="82" r="38" />
        </g>
        <g fill="none" stroke="#8a6636" strokeWidth="4" opacity="0.85">
          <circle cx="88" cy="82" r="72" />
          <circle cx="88" cy="82" r="50" />
          <circle cx="88" cy="82" r="27" />
        </g>
        <path d="M40 132 q-16 38 10 44" stroke="#b98b4e" strokeWidth="12" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'can_glow_hint',
    unless: ['found_glowing_paint'],
    staticClass: 'anim-soft-glow',
    style: pct(21.8, 25.4, 4.2, 8.5),
    node: (
      <svg viewBox="0 0 67 76" className="h-full w-full">
        <rect x="8" y="14" width="52" height="58" rx="5" fill="#12200f" />
        <path d="M8 40 h52" stroke="#4ade80" strokeWidth="5" opacity="0.65" />
        <ellipse cx="34" cy="14" rx="26" ry="7" fill="#173318" />
        <ellipse cx="34" cy="40" rx="30" ry="24" fill="#4ade80" opacity="0.14" />
      </svg>
    ),
  },
  {
    id: 'padlock',
    unless: ['trap_room_open'],
    style: pct(47.6, 66.5, 4.4, 9),
    node: (
      <svg viewBox="0 0 70 81" className="h-full w-full">
        <path d="M18 34 v-12 a17 17 0 0 1 34 0 v12" stroke="#75757c" strokeWidth="9" fill="none" />
        <rect x="8" y="34" width="54" height="42" rx="9" fill="#94949c" />
        <rect x="8" y="34" width="54" height="12" rx="6" fill="#a8a8b0" />
        <circle cx="35" cy="55" r="7" fill="#3c3c42" />
        <path d="M35 55 v10" stroke="#3c3c42" strokeWidth="5" />
      </svg>
    ),
  },
  {
    id: 'padlock_falls',
    when: ['trap_room_open'],
    animFlag: 'trap_room_open',
    animClass: 'anim-pop-off',
    ephemeralMs: 1000,
    style: pct(47.6, 66.5, 4.4, 9),
    node: (
      <svg viewBox="0 0 70 81" className="h-full w-full">
        <path d="M18 34 v-12 a17 17 0 0 1 34 0 v6" stroke="#75757c" strokeWidth="9" fill="none" />
        <rect x="8" y="34" width="54" height="42" rx="9" fill="#94949c" />
        <circle cx="35" cy="55" r="7" fill="#3c3c42" />
      </svg>
    ),
  },
  {
    id: 'grate_open_glow',
    when: ['trap_room_open'],
    animFlag: 'trap_room_open',
    animClass: 'msg-in anim-soft-glow',
    staticClass: 'anim-soft-glow',
    style: pct(38.5, 72.5, 24, 20),
    node: (
      <svg viewBox="0 0 384 180" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id="opengrate" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="192" cy="90" rx="190" ry="86" fill="url(#opengrate)" />
      </svg>
    ),
  },
]

/* ------------------------------------------------------------ trap room */

const TRAP_ROOM: OverlayDef[] = [
  {
    id: 'rigged_net',
    when: ['rope_set'],
    unless: ['trap_sprung'],
    animFlag: 'rope_set',
    animClass: 'anim-net-drop',
    style: pct(38.5, 11, 23, 10),
    node: (
      <svg viewBox="0 0 368 90" className="h-full w-full" preserveAspectRatio="none">
        <path d="M10 12 Q184 88 358 12" stroke="#b98b4e" strokeWidth="7" fill="none" />
        <path d="M30 14 Q184 72 338 14 M60 18 Q184 58 308 18" stroke="#8a6636" strokeWidth="4" fill="none" opacity="0.9" />
        <path d="M60 16 V52 M110 28 V64 M184 34 V72 M258 28 V64 M308 16 V52" stroke="#8a6636" strokeWidth="3.5" opacity="0.9" />
        <path d="M184 6 v14" stroke="#b98b4e" strokeWidth="8" />
      </svg>
    ),
  },
  {
    id: 'snack_bait',
    when: ['bait_set'],
    unless: ['trap_sprung'],
    animFlag: 'bait_set',
    animClass: 'anim-drop-bounce',
    style: pct(48.2, 54.6, 3.6, 6.4),
    node: (
      <svg viewBox="0 0 58 58" className="h-full w-full">
        <circle cx="29" cy="32" r="21" fill="#d98f2b" />
        <circle cx="22" cy="26" r="3.4" fill="#7a4b12" />
        <circle cx="36" cy="36" r="3.4" fill="#7a4b12" />
        <circle cx="30" cy="20" r="26" fill="#ffd98a" opacity="0.25" />
      </svg>
    ),
  },
  {
    id: 'wall_sheet',
    unless: ['trap_sprung'],
    style: pct(76.8, 27, 9.2, 28.5),
    node: (
      <svg viewBox="0 0 147 256" className="h-full w-full" preserveAspectRatio="none">
        <path d="M8 26 q66 -36 130 0 l-8 202 q-18 38 -33 6 q-13 40 -29 6 q-15 38 -31 4 q-16 32 -29 -4 Z" fill="#bcd9a8" />
        <path d="M8 26 q66 -36 130 0 l-8 202 q-18 38 -33 6 q-13 40 -29 6 q-15 38 -31 4 q-16 32 -29 -4 Z" fill="#4ade80" opacity="0.28" />
        <ellipse cx="48" cy="86" rx="12" ry="18" fill="#0c1a10" />
        <ellipse cx="96" cy="86" rx="12" ry="18" fill="#0c1a10" />
        <path d="M20 60 q-16 60 6 148" stroke="#8fbf7c" strokeWidth="4" fill="none" opacity="0.6" />
        <ellipse cx="72" cy="96" rx="70" ry="86" fill="#4ade80" opacity="0.12" />
      </svg>
    ),
  },
  {
    id: 'ghost_in_net',
    when: ['trap_sprung'],
    animFlag: 'trap_sprung',
    animClass: 'anim-net-drop',
    staticClass: 'anim-net-swing',
    style: pct(40.5, 13, 14, 36),
    node: (
      <svg viewBox="0 0 224 324" className="h-full w-full">
        <path d="M112 0 v30" stroke="#b98b4e" strokeWidth="9" />
        <path d="M112 30 Q30 90 44 190 Q54 288 112 296 Q170 288 180 190 Q194 90 112 30 Z" fill="none" stroke="#b98b4e" strokeWidth="7" />
        <g stroke="#8a6636" strokeWidth="3.5" opacity="0.95" fill="none">
          <path d="M112 30 Q66 110 74 220 M112 30 Q158 110 150 220 M112 30 V296" />
          <path d="M52 130 Q112 160 172 130 M46 190 Q112 224 178 190 M62 250 Q112 282 162 250" />
        </g>
        {/* squished glowing phantom inside */}
        <path d="M70 150 q42 -60 86 -4 q18 40 -6 92 q-38 30 -74 2 q-24 -50 -6 -90" fill="#bcd9a8" />
        <path d="M70 150 q42 -60 86 -4 q18 40 -6 92 q-38 30 -74 2 q-24 -50 -6 -90" fill="#4ade80" opacity="0.3" />
        <ellipse cx="98" cy="180" rx="10" ry="14" fill="#0c1a10" />
        <ellipse cx="138" cy="180" rx="10" ry="14" fill="#0c1a10" />
        <path d="M96 224 q18 14 40 2" stroke="#0c1a10" strokeWidth="5" fill="none" />
        <ellipse cx="115" cy="185" rx="72" ry="80" fill="#4ade80" opacity="0.15" />
      </svg>
    ),
  },
  {
    id: 'lever_up',
    unless: ['trap_sprung'],
    style: pct(12.6, 48.5, 6, 14),
    node: (
      <svg viewBox="0 0 96 126" className="h-full w-full">
        <path d="M44 108 L78 22" stroke="#5b6a72" strokeWidth="13" strokeLinecap="round" />
        <circle cx="80" cy="18" r="17" fill="#c22f2f" />
        <circle cx="75" cy="13" r="5.5" fill="#ff8f8f" opacity="0.85" />
        <circle cx="44" cy="108" r="12" fill="#131a1f" />
      </svg>
    ),
  },
  {
    id: 'lever_pulled',
    when: ['trap_sprung'],
    animFlag: 'trap_sprung',
    animClass: 'msg-in',
    style: pct(12.6, 48.5, 6, 14),
    node: (
      <svg viewBox="0 0 96 126" className="h-full w-full">
        <path d="M44 108 L12 30" stroke="#5b6a72" strokeWidth="13" strokeLinecap="round" />
        <circle cx="10" cy="25" r="17" fill="#c22f2f" />
        <circle cx="5" cy="20" r="5.5" fill="#ff8f8f" opacity="0.85" />
        <circle cx="44" cy="108" r="12" fill="#131a1f" />
      </svg>
    ),
  },
]

const SCENE_OVERLAYS: Record<string, OverlayDef[]> = {
  lobby: LOBBY,
  grounds: GROUNDS,
  janitor_closet: CLOSET,
  trap_room: TRAP_ROOM,
}

const NO_OVERLAYS: OverlayDef[] = []

export function SceneOverlays({ sceneId }: { sceneId: string }) {
  const gameFlags = useGameStore((s) => s.gameFlags)
  const flagStamps = useGameStore((s) => s.flagStamps)
  const [, rerender] = useReducer((n: number) => n + 1, 0)

  const defs = SCENE_OVERLAYS[sceneId] ?? NO_OVERLAYS
  const now = Date.now()

  // Ephemeral one-shots need a re-render after their window closes.
  useEffect(() => {
    const pending = defs
      .filter((d) => d.ephemeralMs && d.animFlag && flagStamps[d.animFlag])
      .map((d) => flagStamps[d.animFlag!] + d.ephemeralMs! - Date.now())
      .filter((ms) => ms > 0)
    if (pending.length === 0) return
    const t = setTimeout(rerender, Math.max(...pending) + 50)
    return () => clearTimeout(t)
  }, [defs, flagStamps])

  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      {defs.map((d) => {
        if (d.when && !d.when.every((f) => gameFlags[f])) return null
        if (d.unless && d.unless.some((f) => gameFlags[f])) return null
        const stamp = d.animFlag ? flagStamps[d.animFlag] : undefined
        const recent = stamp !== undefined && now - stamp < RECENT_MS
        if (d.ephemeralMs && !(stamp !== undefined && now - stamp < d.ephemeralMs)) return null
        const cls = recent && d.animClass ? d.animClass : (d.staticClass ?? '')
        return (
          <div key={d.id} className={`absolute ${cls}`} style={d.style}>
            {d.node}
          </div>
        )
      })}
    </div>
  )
}
