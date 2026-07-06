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
    id: 'brochure_suitcase',
    unless: ['got_brochure'],
    style: pct(18, 69, 6.5, 10),
    node: (
      <svg viewBox="0 0 104 90" className="h-full w-full">
        <rect x="6" y="26" width="92" height="58" rx="8" fill="#6b4a2a" />
        <rect x="6" y="26" width="92" height="16" rx="8" fill="#7c5a36" />
        <path d="M40 26 v-8 h24 v8" stroke="#3d2c14" strokeWidth="6" fill="none" />
        <rect x="26" y="42" width="12" height="42" fill="#3d2c14" />
        <rect x="66" y="42" width="12" height="42" fill="#3d2c14" />
        {/* brochure corner peeking out */}
        <path d="M52 30 l30 -14 l6 12 l-30 12 z" fill="#93c5fd" />
        <path d="M58 28 l20 -9 M60 33 l20 -9" stroke="#3f6d8e" strokeWidth="2" />
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
    id: 'vines_blocking',
    unless: ['path_cleared'],
    style: pct(78, 30, 14, 46),
    node: (
      <svg viewBox="0 0 224 414" className="h-full w-full" preserveAspectRatio="none">
        <g stroke="#173c22" strokeWidth="14" fill="none" strokeLinecap="round">
          <path d="M24 0 q40 90 -8 180 q-30 100 30 234" />
          <path d="M110 -6 q-44 110 10 210 q38 90 -16 210" />
          <path d="M196 0 q30 96 -18 190 q-30 96 22 224" />
        </g>
        <g stroke="#1e5230" strokeWidth="8" fill="none" strokeLinecap="round">
          <path d="M60 10 q50 80 6 170 q-36 90 26 228" />
          <path d="M160 4 q-40 90 4 186 q30 96 -20 218" />
          <path d="M20 120 q80 30 184 10 M16 250 q90 34 196 8" />
        </g>
        <g fill="#2a6e40">
          <ellipse cx="46" cy="88" rx="16" ry="8" transform="rotate(-30 46 88)" />
          <ellipse cx="130" cy="60" rx="17" ry="8" transform="rotate(20 130 60)" />
          <ellipse cx="190" cy="140" rx="15" ry="7" transform="rotate(-15 190 140)" />
          <ellipse cx="70" cy="210" rx="17" ry="8" transform="rotate(25 70 210)" />
          <ellipse cx="160" cy="260" rx="16" ry="8" transform="rotate(-24 160 260)" />
          <ellipse cx="52" cy="330" rx="15" ry="7" transform="rotate(16 52 330)" />
          <ellipse cx="140" cy="368" rx="17" ry="8" transform="rotate(-18 140 368)" />
        </g>
        <g fill="#d8c2e8">
          <circle cx="96" cy="140" r="6" /><circle cx="176" cy="220" r="5" /><circle cx="60" cy="286" r="5.5" />
        </g>
      </svg>
    ),
  },
  {
    id: 'hatch_lid_closed',
    unless: ['hatch_open'],
    style: pct(26, 81, 8, 12),
    node: (
      <svg viewBox="0 0 128 108" className="h-full w-full" preserveAspectRatio="none">
        <ellipse cx="64" cy="54" rx="58" ry="44" fill="#3d4a52" stroke="#1c262c" strokeWidth="5" />
        <ellipse cx="64" cy="54" rx="42" ry="31" fill="none" stroke="#2b3840" strokeWidth="4" />
        <rect x="52" y="44" width="24" height="20" rx="4" fill="#1c262c" />
        <rect x="58" y="48" width="12" height="12" rx="2" fill="#0e161b" />
        <g fill="#242f36">
          <circle cx="64" cy="16" r="4" /><circle cx="64" cy="92" r="4" />
          <circle cx="12" cy="54" r="4" /><circle cx="116" cy="54" r="4" />
        </g>
        <path d="M28 30 q30 -12 66 -2" stroke="#5b6a72" strokeWidth="3" fill="none" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'hatch_open_hole',
    when: ['hatch_open'],
    animFlag: 'hatch_open',
    animClass: 'msg-in anim-soft-glow',
    staticClass: 'anim-soft-glow',
    style: pct(25.4, 80, 9.2, 14),
    node: (
      <svg viewBox="0 0 147 126" className="h-full w-full" preserveAspectRatio="none">
        <ellipse cx="73" cy="60" rx="62" ry="47" fill="#04070a" />
        <ellipse cx="73" cy="60" rx="62" ry="47" fill="none" stroke="#4ade80" strokeWidth="3" opacity="0.5" />
        <path d="M52 34 v52 M94 34 v52 M52 52 h42 M52 72 h42" stroke="#5b6a72" strokeWidth="5" fill="none" />
        <ellipse cx="73" cy="60" rx="34" ry="24" fill="#4ade80" opacity="0.1" />
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
    id: 'pool_glove',
    unless: ['got_glove'],
    style: pct(63.5, 86, 4.5, 6),
    node: (
      <svg viewBox="0 0 72 54" className="h-full w-full">
        <path d="M14 40 q-4 -18 8 -22 l4 -10 q3 -5 6 0 l1 8 l4 -11 q3 -5 6 0 l0 11 l5 -9 q3 -5 6 1 l-2 10 q10 2 8 14 l-3 8 q-20 8 -43 0 Z" fill="#b8b0a4" />
        <path d="M22 44 q14 5 28 0" stroke="#7a7468" strokeWidth="3" fill="none" />
        <text x="36" y="38" fontFamily="Trebuchet MS" fontSize="10" fontWeight="bold" fill="#5c5548" textAnchor="middle">A.C.</text>
        <path d="M8 46 q28 10 56 0" stroke="#1a3a24" strokeWidth="6" fill="none" opacity="0.6" />
      </svg>
    ),
  },
]

/* ------------------------------------------------------------- toolshed */

const TOOLSHED: OverlayDef[] = [
  {
    id: 'shed_grate_glint',
    unless: ['got_janitor_key'],
    staticClass: 'anim-soft-glow',
    style: pct(48.5, 69, 3, 4.5),
    node: (
      <svg viewBox="0 0 48 40" className="h-full w-full">
        <circle cx="24" cy="20" r="8" fill="#ffe9a0" />
        <path d="M24 2 v36 M6 20 h36 M11 7 l26 26 M37 7 l-26 26" stroke="#ffe9a0" strokeWidth="3" opacity="0.85" />
      </svg>
    ),
  },
  {
    id: 'shed_key_rise',
    when: ['got_janitor_key'],
    animFlag: 'got_janitor_key',
    animClass: 'anim-rise-fade',
    ephemeralMs: 2200,
    style: pct(47.5, 60, 4.2, 10),
    node: (
      <svg viewBox="0 0 58 76" className="h-full w-full">
        <circle cx="29" cy="20" r="14" fill="none" stroke="#e0bd60" strokeWidth="7" />
        <path d="M29 34 V66 M29 54 h12 M29 64 h9" stroke="#e0bd60" strokeWidth="7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'crank_on_pegboard',
    unless: ['got_crank'],
    style: pct(67, 28, 9, 16),
    node: (
      <svg viewBox="0 0 144 144" className="h-full w-full">
        <g stroke="#8a929c" strokeWidth="13" strokeLinecap="round" fill="none">
          <path d="M40 26 v46 h48 v46" />
        </g>
        <rect x="26" y="10" width="28" height="22" rx="5" fill="#5b6a72" stroke="#39434c" strokeWidth="3" />
        <rect x="33" y="16" width="14" height="10" rx="2" fill="#242c33" />
        <rect x="76" y="106" width="24" height="30" rx="9" fill="#7a4b2a" stroke="#4a2c16" strokeWidth="3" />
        <path d="M46 32 q8 -6 14 0" stroke="#c9d2da" strokeWidth="2.5" fill="none" opacity="0.7" />
      </svg>
    ),
  },
]

/* ----------------------------------------------------------- greenhouse */

const GREENHOUSE: OverlayDef[] = [
  {
    id: 'shears_in_planter',
    unless: ['got_shears'],
    style: pct(57, 58, 9, 9),
    node: (
      <svg viewBox="0 0 144 90" className="h-full w-full">
        <g transform="rotate(-18 72 45)">
          <path d="M20 30 L86 46 L84 56 L18 42 Z" fill="#aeb6bd" stroke="#5c666e" strokeWidth="2.5" />
          <path d="M22 52 L86 50 L86 60 L24 64 Z" fill="#9aa3ab" stroke="#5c666e" strokeWidth="2.5" />
          <circle cx="92" cy="52" r="6" fill="#39434c" />
          <path d="M96 46 q28 -10 34 4 q4 12 -20 16" fill="none" stroke="#7c4a2a" strokeWidth="9" strokeLinecap="round" />
          <path d="M98 58 q26 2 32 12" fill="none" stroke="#8f5a34" strokeWidth="9" strokeLinecap="round" />
        </g>
        <path d="M10 74 q60 14 124 0" stroke="#1a3a24" strokeWidth="8" fill="none" opacity="0.5" />
      </svg>
    ),
  },
]

/* ---------------------------------------------------------- pool cabana */

const POOL_CABANA: OverlayDef[] = [
  {
    id: 'cabana_box_hanging',
    unless: ['shook_vending'],
    style: pct(68.6, 46.8, 3.8, 4.6),
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
    id: 'cabana_box_dropped',
    when: ['shook_vending'],
    animFlag: 'shook_vending',
    animClass: 'anim-drop-bounce',
    style: pct(65.6, 69.8, 6.2, 4.8),
    node: (
      <svg viewBox="0 0 100 44" className="h-full w-full">
        <rect x="20" y="8" width="52" height="32" rx="4" fill="#e8b73a" transform="rotate(-8 46 24)" />
        <rect x="20" y="8" width="52" height="13" rx="4" fill="#c99b28" transform="rotate(-8 46 24)" />
        <circle cx="44" cy="28" r="5.5" fill="#7a4b12" transform="rotate(-8 46 24)" />
      </svg>
    ),
  },
]

/* ------------------------------------------------------------ pump room */

const PUMP_ROOM: OverlayDef[] = [
  {
    id: 'pinned_tunnel_map',
    unless: ['got_tunnel_map'],
    style: pct(44.5, 58.5, 8, 10.5),
    node: (
      <svg viewBox="0 0 128 95" className="h-full w-full">
        <g transform="rotate(-4 64 47)">
          <rect x="12" y="10" width="104" height="74" rx="3" fill="#e8dcb4" stroke="#8f825e" strokeWidth="2.5" />
          <path d="M24 62 q22 -18 36 -4 q16 14 30 -8 q10 -14 22 -10" stroke="#3f8f52" strokeWidth="4" fill="none" />
          <circle cx="24" cy="62" r="4" fill="#3f8f52" />
          <path d="M104 38 l8 -6 M104 38 l8 6" stroke="#8c2424" strokeWidth="3" />
          <path d="M28 24 h32 M28 34 h24" stroke="#8f825e" strokeWidth="2.5" />
          <circle cx="64" cy="10" r="5" fill="#8c2424" />
        </g>
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
    id: 'box_cutter_shelf',
    unless: ['got_box_cutter'],
    style: pct(29.5, 58, 4.5, 5),
    node: (
      <svg viewBox="0 0 72 45" className="h-full w-full">
        <rect x="4" y="18" width="44" height="16" rx="5" fill="#8f2d2d" transform="rotate(-8 26 26)" />
        <path d="M46 14 l20 6 l-4 8 l-18 -2 z" fill="#c9ced4" transform="rotate(-8 52 20)" />
        <circle cx="14" cy="26" r="3" fill="#5c1d1d" transform="rotate(-8 14 26)" />
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

/* --------------------------------------------------------------- office */

const safeDoor = (
  <svg viewBox="0 0 192 144" className="h-full w-full" preserveAspectRatio="none">
    <rect width="192" height="144" rx="8" fill="#3d3d46" />
    <rect x="10" y="10" width="172" height="124" rx="6" fill="none" stroke="#26262e" strokeWidth="6" />
    <circle cx="96" cy="72" r="30" fill="#26262e" />
    <circle cx="96" cy="72" r="22" fill="#4a4a54" />
    <path d="M96 54 v10 M96 80 v10 M78 72 h10 M104 72 h10 M83 59 l7 7 M102 78 l7 7" stroke="#1a1a20" strokeWidth="4" />
    <rect x="150" y="60" width="14" height="24" rx="4" fill="#26262e" />
  </svg>
)

const OFFICE: OverlayDef[] = [
  {
    id: 'bookshelf_closed',
    unless: ['door_217_open'],
    style: pct(72, 24, 22, 52),
    node: (
      <svg viewBox="0 0 352 468" className="h-full w-full" preserveAspectRatio="none">
        <rect width="352" height="468" rx="6" fill="#3b2a14" />
        <g fill="#241708">
          <rect x="18" y="20" width="316" height="88" rx="4" />
          <rect x="18" y="128" width="316" height="88" rx="4" />
          <rect x="18" y="236" width="316" height="88" rx="4" />
          <rect x="18" y="344" width="316" height="88" rx="4" />
        </g>
        {/* rows of books */}
        <g>
          <rect x="26" y="34" width="22" height="74" fill="#5c2430" /><rect x="50" y="42" width="18" height="66" fill="#2f4a3a" />
          <rect x="70" y="30" width="26" height="78" fill="#4a3a63" /><rect x="98" y="44" width="16" height="64" fill="#6b5426" />
          <rect x="116" y="36" width="24" height="72" fill="#37536b" /><rect x="142" y="46" width="18" height="62" fill="#5c452a" />
          <rect x="162" y="32" width="22" height="76" fill="#513828" /><rect x="186" y="40" width="20" height="68" fill="#2c3a2e" />
          <rect x="208" y="34" width="24" height="74" fill="#4a2430" /><rect x="234" y="44" width="18" height="64" fill="#3b3052" />
          <rect x="254" y="38" width="22" height="70" fill="#5c5426" /><rect x="278" y="30" width="26" height="78" fill="#2f3a52" />
          <rect x="306" y="42" width="20" height="66" fill="#6b3426" />
        </g>
        <g opacity="0.92">
          <rect x="26" y="142" width="20" height="74" fill="#2f4a3a" /><rect x="48" y="152" width="24" height="64" fill="#5c2430" />
          <rect x="74" y="140" width="18" height="76" fill="#37536b" /><rect x="94" y="150" width="26" height="66" fill="#4a3a63" />
          {/* the one clean, glowing book */}
          <rect x="124" y="138" width="26" height="78" fill="#d8c795" />
          <rect x="128" y="146" width="18" height="62" fill="none" stroke="#8f6f14" strokeWidth="3" />
          <rect x="154" y="148" width="20" height="68" fill="#513828" /><rect x="176" y="142" width="24" height="74" fill="#2c3a2e" />
          <rect x="202" y="152" width="18" height="64" fill="#6b5426" /><rect x="222" y="140" width="26" height="76" fill="#4a2430" />
          <rect x="250" y="150" width="20" height="66" fill="#37536b" /><rect x="272" y="144" width="24" height="72" fill="#5c452a" />
          <rect x="298" y="152" width="26" height="64" fill="#3b3052" />
        </g>
        <g opacity="0.85">
          <rect x="26" y="250" width="24" height="74" fill="#4a3a63" /><rect x="52" y="260" width="18" height="64" fill="#6b3426" />
          <rect x="72" y="248" width="26" height="76" fill="#2f3a52" /><rect x="100" y="258" width="20" height="66" fill="#5c452a" />
          <rect x="122" y="252" width="24" height="72" fill="#2c3a2e" /><rect x="148" y="246" width="18" height="78" fill="#5c2430" />
          <rect x="168" y="256" width="26" height="68" fill="#37536b" /><rect x="196" y="250" width="20" height="74" fill="#513828" />
          <rect x="218" y="244" width="24" height="80" fill="#3b3052" /><rect x="244" y="256" width="18" height="68" fill="#6b5426" />
          <rect x="264" y="250" width="28" height="74" fill="#2f4a3a" /><rect x="294" y="258" width="30" height="66" fill="#4a2430" />
        </g>
        <g opacity="0.8">
          <rect x="26" y="358" width="70" height="74" fill="#241708" />
          <rect x="30" y="380" width="62" height="48" fill="#3b2a14" />
          <rect x="100" y="356" width="22" height="76" fill="#2f3a52" /><rect x="124" y="366" width="26" height="66" fill="#5c452a" />
          <rect x="152" y="360" width="18" height="72" fill="#4a3a63" /><rect x="172" y="352" width="24" height="80" fill="#2c3a2e" />
          <rect x="198" y="364" width="20" height="68" fill="#6b3426" /><rect x="220" y="356" width="26" height="76" fill="#37536b" />
          <rect x="248" y="366" width="18" height="66" fill="#513828" /><rect x="268" y="358" width="28" height="74" fill="#5c2430" />
          <rect x="298" y="364" width="26" height="68" fill="#2f4a3a" />
        </g>
      </svg>
    ),
  },
  {
    id: 'bookshelf_slides_away',
    when: ['door_217_open'],
    animFlag: 'door_217_open',
    animClass: 'anim-shelf-slide',
    ephemeralMs: 1300,
    style: pct(72, 24, 22, 52),
    node: (
      <svg viewBox="0 0 352 468" className="h-full w-full" preserveAspectRatio="none">
        <rect width="352" height="468" rx="6" fill="#3b2a14" />
        <g fill="#241708">
          <rect x="18" y="20" width="316" height="88" rx="4" />
          <rect x="18" y="128" width="316" height="88" rx="4" />
          <rect x="18" y="236" width="316" height="88" rx="4" />
          <rect x="18" y="344" width="316" height="88" rx="4" />
        </g>
      </svg>
    ),
  },
  {
    id: 'safe_closed',
    unless: ['safe_open'],
    style: pct(43, 50, 12, 16),
    node: safeDoor,
  },
  {
    id: 'safe_door_open',
    when: ['safe_open'],
    animFlag: 'safe_open',
    animClass: 'anim-door-swing',
    staticClass: 'anim-door-open',
    style: pct(43, 50, 12, 16),
    node: safeDoor,
  },
]

/* ------------------------------------------------------------- room 217 */

const georgeFigure = (freed: boolean) => (
  <svg viewBox="0 0 160 300" className="h-full w-full" preserveAspectRatio="xMidYMax meet">
    {/* legs */}
    <rect x="56" y="216" width="20" height="70" rx="8" fill="#b59a6b" />
    <rect x="84" y="216" width="20" height="70" rx="8" fill="#a88d5e" />
    <path d="M52 282 h28 M82 282 h28" stroke="#3d2c14" strokeWidth="10" strokeLinecap="round" />
    {/* torso: light-blue oxford + navy blazer */}
    <path d="M42 130 q0 -22 38 -22 q38 0 38 22 v70 q0 22 -38 22 q-38 0 -38 -22 Z" fill="#1e3a5c" />
    <path d="M64 112 h32 v82 q-16 10 -32 0 Z" fill="#b8d4ea" />
    <path d="M80 112 v82 M72 130 l8 -10 8 10" stroke="#8fb2cc" strokeWidth="3" fill="none" />
    <path d="M74 136 l6 44 l6 -44 z" fill="#8f2d2d" />
    {/* arms (behind back when tied, one raised when freed) */}
    {freed ? (
      <g>
        <path d="M42 140 q-24 10 -26 44" stroke="#1e3a5c" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M118 140 q26 -16 30 -48" stroke="#1e3a5c" strokeWidth="16" fill="none" strokeLinecap="round" />
        <circle cx="150" cy="86" r="9" fill="#e8c9a0" />
        <circle cx="15" cy="186" r="9" fill="#e8c9a0" />
      </g>
    ) : (
      <g>
        <path d="M42 138 q-16 26 -6 58 M118 138 q16 26 6 58" stroke="#1e3a5c" strokeWidth="16" fill="none" strokeLinecap="round" />
        {/* ropes */}
        <path d="M44 150 q36 14 72 0 M42 168 q38 16 76 0 M44 186 q36 14 72 0" stroke="#b8b09a" strokeWidth="7" fill="none" />
      </g>
    )}
    {/* head */}
    <ellipse cx="80" cy="76" rx="26" ry="28" fill="#eccc9f" />
    <path d="M56 66 q-2 -26 24 -26 q26 0 24 26 q-6 -10 -24 -10 q-18 0 -24 10" fill="#5c3a1a" />
    <path d="M56 66 q0 10 4 14 M104 66 q0 10 -4 14" stroke="#5c3a1a" strokeWidth="5" fill="none" strokeLinecap="round" />
    <circle cx="70" cy="76" r="3" fill="#241c10" />
    <circle cx="90" cy="76" r="3" fill="#241c10" />
    <path d="M64 70 q5 -4 10 -1 M86 69 q5 -3 10 1" stroke="#3d2c14" strokeWidth="2" fill="none" />
    {freed ? (
      <path d="M70 92 q10 7 20 0" stroke="#a3542e" strokeWidth="3" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M66 92 h28" stroke="#8f8f96" strokeWidth="10" strokeLinecap="round" />
    )}
  </svg>
)

const ROOM_217: OverlayDef[] = [
  {
    id: 'george_tied',
    unless: ['george_freed'],
    staticClass: 'anim-idle-bob',
    style: pct(57, 32, 12, 46),
    node: georgeFigure(false),
  },
  {
    id: 'george_freed',
    when: ['george_freed'],
    animFlag: 'george_freed',
    animClass: 'msg-in',
    style: pct(49.5, 40, 11, 44),
    node: georgeFigure(true),
  },
  {
    id: 'bench_megaphone',
    unless: ['got_megaphone'],
    style: pct(11.5, 52.5, 8, 12),
    node: (
      <svg viewBox="0 0 128 108" className="h-full w-full">
        <path d="M20 66 L74 36 L74 88 Z" fill="#3d3d46" />
        <path d="M74 36 L112 16 L112 104 L74 88 Z" fill="#4a4a54" />
        <path d="M112 16 L112 104" stroke="#26262e" strokeWidth="6" />
        <rect x="8" y="60" width="20" height="18" rx="6" fill="#26262e" />
        <path d="M84 40 q10 12 0 24 M96 34 q14 18 0 38" stroke="#4ade80" strokeWidth="4" fill="none" opacity="0.8" />
      </svg>
    ),
  },
]

const SCENE_OVERLAYS: Record<string, OverlayDef[]> = {
  lobby: LOBBY,
  grounds: GROUNDS,
  janitor_closet: CLOSET,
  trap_room: TRAP_ROOM,
  office: OFFICE,
  room_217: ROOM_217,
  toolshed: TOOLSHED,
  greenhouse: GREENHOUSE,
  pool_cabana: POOL_CABANA,
  pump_room: PUMP_ROOM,
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
