import type { CharacterId } from '../types/game'

/**
 * Waist-up cartoon busts for the gang. Used as the speaking portrait in the
 * message bar and as the in-scene "cameo" that appears at a hotspot when a
 * character performs an action.
 */

function VelmaBust() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full drop-shadow-lg">
      {/* body: orange turtleneck */}
      <path d="M24 130 q0 -38 36 -38 q36 0 36 38 Z" fill="#e8730c" />
      <path d="M30 108 q30 14 60 0" stroke="#c25c05" strokeWidth="4" fill="none" />
      <path d="M46 96 a14 9 0 0 0 28 0" fill="#c25c05" />
      {/* pleated skirt hint */}
      <path d="M24 130 h72 l-4 -8 h-64 Z" fill="#a03d1d" />
      {/* head */}
      <ellipse cx="60" cy="52" rx="30" ry="31" fill="#f0c896" />
      {/* bob haircut */}
      <path d="M28 56 q-6 -44 32 -46 q38 -2 34 44 q-3 -10 -10 -14 q2 8 -2 14 q-4 -14 -12 -18 q2 10 -2 16 q-8 -16 -20 -18 q0 10 -6 16 q-2 -10 -8 -12 q-4 8 -6 18" fill="#8f4a1e" />
      <path d="M28 56 q2 14 8 20 M92 54 q-2 14 -8 20" stroke="#8f4a1e" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* glasses */}
      <g fill="rgba(255,255,255,0.28)" stroke="#3d2c14" strokeWidth="3.5">
        <rect x="34" y="46" width="22" height="18" rx="4" />
        <rect x="64" y="46" width="22" height="18" rx="4" />
      </g>
      <path d="M56 54 h8 M34 52 l-8 -3 M86 52 l8 -3" stroke="#3d2c14" strokeWidth="3.5" />
      <circle cx="45" cy="55" r="3.4" fill="#2b1c0c" />
      <circle cx="75" cy="55" r="3.4" fill="#2b1c0c" />
      {/* freckles + mouth */}
      <g fill="#d69a5e">
        <circle cx="38" cy="68" r="1.6" /><circle cx="44" cy="70" r="1.6" /><circle cx="76" cy="70" r="1.6" /><circle cx="82" cy="68" r="1.6" />
      </g>
      <path d="M52 76 q8 6 16 0" stroke="#a3572b" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function ShaggyScoobyBust() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full drop-shadow-lg">
      {/* Scooby peeking from the left */}
      <g>
        <path d="M2 130 q-2 -30 20 -34 q22 -4 24 30 Z" fill="#9a6624" />
        <ellipse cx="26" cy="78" rx="19" ry="18" fill="#b3782c" />
        <path d="M10 70 q-6 -14 2 -20 q8 -4 10 10 Z" fill="#8a5a20" />
        <path d="M42 70 q6 -14 -2 -20 q-8 -4 -10 10 Z" fill="#8a5a20" />
        <ellipse cx="26" cy="86" rx="11" ry="8" fill="#c89a55" />
        <ellipse cx="26" cy="82" rx="4" ry="3" fill="#241a10" />
        <circle cx="19" cy="73" r="2.6" fill="#241a10" />
        <circle cx="33" cy="73" r="2.6" fill="#241a10" />
        <path d="M14 96 q12 8 24 0" stroke="#2a9db5" strokeWidth="5" fill="none" />
        <path d="M22 99 l4 5 4 -5" fill="#f5c33b" stroke="#b78d1e" strokeWidth="1" />
      </g>
      {/* Shaggy body: green v-neck */}
      <path d="M42 130 q0 -36 34 -36 q34 0 34 36 Z" fill="#7ba33c" />
      <path d="M62 96 l14 16 14 -16" fill="none" stroke="#5c7c2a" strokeWidth="4" />
      {/* head */}
      <ellipse cx="76" cy="52" rx="27" ry="29" fill="#eec192" />
      {/* shaggy hair */}
      <path d="M50 46 q-4 -34 28 -36 q30 -2 26 32 q-4 -8 -10 -10 q2 8 -4 12 q-2 -12 -10 -14 q0 8 -6 12 q-4 -12 -12 -12 q0 8 -4 12 q-4 -6 -8 4" fill="#8a6430" />
      <path d="M50 46 q0 12 6 18 M104 42 q0 12 -6 18" stroke="#8a6430" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* face */}
      <circle cx="66" cy="54" r="3" fill="#2b1c0c" />
      <circle cx="88" cy="54" r="3" fill="#2b1c0c" />
      <path d="M60 50 q6 -4 10 -1 M84 49 q6 -3 10 1" stroke="#6b4a20" strokeWidth="2.4" fill="none" />
      <ellipse cx="77" cy="63" rx="4.5" ry="3.4" fill="#d69a5e" />
      {/* worried wobbly mouth + goatee */}
      <path d="M68 74 q4 -4 9 0 q4 4 9 0" stroke="#8a5a30" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M70 80 q7 10 14 0 q-2 12 -7 12 q-5 0 -7 -12" fill="#8a6430" />
    </svg>
  )
}

function DaphneBust() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full drop-shadow-lg">
      {/* body: purple dress + green scarf */}
      <path d="M26 130 q0 -38 34 -38 q34 0 34 38 Z" fill="#8b5cf6" />
      <path d="M26 130 q0 -38 34 -38 q34 0 34 38" fill="none" stroke="#6d3fd4" strokeWidth="4" />
      <path d="M44 98 q16 12 32 0 l4 10 q-20 12 -40 0 Z" fill="#6ee7a0" />
      <path d="M58 106 l4 20 6 -20" fill="#4cc07d" />
      {/* head */}
      <ellipse cx="60" cy="52" rx="28" ry="30" fill="#f4cfa4" />
      {/* long red hair */}
      <path d="M32 50 q-8 -42 28 -44 q36 -2 30 42 q-2 26 6 44 q-14 8 -20 -6 q-4 -20 -2 -32 q-8 6 -14 6 q-14 0 -18 -8 q-2 16 -4 34 q-8 12 -20 4 q10 -18 14 -40" fill="#d1502e" />
      <path d="M36 30 q10 -12 24 -12" stroke="#e06a44" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* lavender headband */}
      <path d="M34 32 q26 -16 52 0 l-2 8 q-24 -14 -48 0 Z" fill="#c4b5fd" />
      {/* face */}
      <circle cx="50" cy="54" r="3.2" fill="#2b1c0c" />
      <circle cx="72" cy="54" r="3.2" fill="#2b1c0c" />
      <path d="M44 48 q6 -5 11 -2 M66 46 q6 -3 11 2" stroke="#a3542e" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M46 60 l-4 2 M78 60 l4 2" stroke="#d69a5e" strokeWidth="2" />
      <path d="M52 74 q8 7 16 0" stroke="#b34a5e" strokeWidth="3.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function CharacterBust({ id }: { id: CharacterId }) {
  if (id === 'Velma') return <VelmaBust />
  if (id === 'Daphne') return <DaphneBust />
  return <ShaggyScoobyBust />
}
