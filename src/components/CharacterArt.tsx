import type { CharacterId } from '../types/game'

/**
 * Waist-up portraits for the gang — shaded, gradient-lit busts used in the
 * message bar and as in-scene action cameos.
 */

function Defs({ prefix, skinA, skinB, hairA, hairB }: { prefix: string; skinA: string; skinB: string; hairA: string; hairB: string }) {
  return (
    <defs>
      <linearGradient id={`${prefix}-skin`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor={skinA} />
        <stop offset="100%" stopColor={skinB} />
      </linearGradient>
      <linearGradient id={`${prefix}-hair`} x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stopColor={hairA} />
        <stop offset="100%" stopColor={hairB} />
      </linearGradient>
      <radialGradient id={`${prefix}-cheek`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#e8836a" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#e8836a" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

function Eye({ cx, cy, iris }: { cx: number; cy: number; iris: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="5.6" ry="6.4" fill="#fdfaf4" />
      <circle cx={cx + 0.6} cy={cy + 1} r="3.5" fill={iris} />
      <circle cx={cx + 0.6} cy={cy + 1} r="1.7" fill="#17110a" />
      <circle cx={cx + 2} cy={cy - 0.8} r="1.1" fill="#fff" />
      <path d={`M${cx - 6} ${cy - 5} q6 -3.5 12 0`} stroke="#3a2a18" strokeWidth="1.6" fill="none" />
    </g>
  )
}

function VelmaBust() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full drop-shadow-lg">
      <Defs prefix="v" skinA="#f6d7ac" skinB="#e2b285" hairA="#a05a24" hairB="#6f3c14" />
      {/* shoulders: orange turtleneck with folds */}
      <path d="M20 130 q1 -34 24 -40 q8 10 16 10 q8 0 16 -10 q23 6 24 40 Z" fill="#e8730c" />
      <path d="M20 130 q1 -34 24 -40 q8 10 16 10 q8 0 16 -10 q23 6 24 40" fill="none" stroke="#b85606" strokeWidth="2.5" />
      <path d="M34 108 q26 12 52 0 M30 120 q30 12 60 0" stroke="#c25f05" strokeWidth="3" fill="none" opacity="0.7" />
      {/* turtleneck collar */}
      <path d="M44 92 a16 11 0 0 0 32 0 l0 8 a16 11 0 0 1 -32 0 Z" fill="#c25f05" />
      <path d="M44 92 a16 11 0 0 0 32 0" fill="none" stroke="#a34c04" strokeWidth="2" />
      {/* neck */}
      <path d="M52 78 h16 v14 a8 6 0 0 1 -16 0 Z" fill="url(#v-skin)" />
      <path d="M52 82 q8 5 16 0 v4 q-8 5 -16 0 Z" fill="#caa075" opacity="0.55" />
      {/* head */}
      <path d="M32 48 q0 -30 28 -30 q28 0 28 30 q0 14 -7 22 q-9 11 -21 11 q-12 0 -21 -11 q-7 -8 -7 -22 Z" fill="url(#v-skin)" />
      {/* ears */}
      <ellipse cx="31" cy="54" rx="4.5" ry="7" fill="url(#v-skin)" />
      <ellipse cx="89" cy="54" rx="4.5" ry="7" fill="url(#v-skin)" />
      {/* bob haircut: layered locks with shine */}
      <path d="M26 56 q-4 -44 34 -44 q38 0 34 44 q-3 -7 -7 -9 q1 -12 -6 -18 q1 9 -4 13 q-2 -13 -12 -17 q3 9 -1 14 q-6 -12 -17 -13 q2 8 -3 13 q-5 -8 -12 -9 q-3 6 -3 15 q-2 3 -3 11 Z" fill="url(#v-hair)" />
      <path d="M26 56 q0 12 8 19 q3 3 2 -4 q-2 -7 -1 -13 Z" fill="url(#v-hair)" />
      <path d="M94 56 q0 12 -8 19 q-3 3 -2 -4 q2 -7 1 -13 Z" fill="url(#v-hair)" />
      <path d="M38 22 q10 -6 22 -5" stroke="#c97e3e" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* thick square glasses */}
      <g>
        <rect x="34.5" y="44" width="22" height="19" rx="3.5" fill="rgba(255,252,245,0.32)" stroke="#2e2010" strokeWidth="3.6" />
        <rect x="63.5" y="44" width="22" height="19" rx="3.5" fill="rgba(255,252,245,0.32)" stroke="#2e2010" strokeWidth="3.6" />
        <path d="M56.5 52 h7 M34.5 50 l-7 -2 M85.5 50 l7 -2" stroke="#2e2010" strokeWidth="3.2" />
        <path d="M38 47 l7 4 M67 47 l7 4" stroke="#fff" strokeWidth="2" opacity="0.5" />
      </g>
      <Eye cx={45.5} cy={54} iris="#6b4423" />
      <Eye cx={74.5} cy={54} iris="#6b4423" />
      {/* nose + mouth + freckles */}
      <path d="M60 58 q-2.6 6 0 9 q2 1.6 4 0" stroke="#c99668" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M51 74 q9 6.5 18 0" stroke="#a3542e" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M54 76.5 q6 3.4 12 0" stroke="#d9776b" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="40" cy="66" rx="6" ry="4" fill="url(#v-cheek)" />
      <ellipse cx="80" cy="66" rx="6" ry="4" fill="url(#v-cheek)" />
      <g fill="#c98d58">
        <circle cx="38" cy="66" r="1" /><circle cx="43" cy="68.5" r="1" /><circle cx="77" cy="68.5" r="1" /><circle cx="82" cy="66" r="1" />
      </g>
    </svg>
  )
}

function ShaggyScoobyBust() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full drop-shadow-lg">
      <Defs prefix="sh" skinA="#f2cf9e" skinB="#ddab78" hairA="#9c7136" hairB="#6b4a1e" />
      <defs>
        <linearGradient id="sc-fur" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#c08a3e" />
          <stop offset="100%" stopColor="#8f5f22" />
        </linearGradient>
      </defs>
      {/* -------- Scooby, leaning in from the left -------- */}
      <g>
        <path d="M0 130 q0 -28 18 -33 q20 -5 26 33 Z" fill="url(#sc-fur)" />
        <path d="M8 108 q8 -4 16 -1" stroke="#7a4f1b" strokeWidth="2.4" fill="none" />
        {/* neck + head */}
        <path d="M14 96 q-2 -14 10 -18 q16 -4 22 10 q4 10 -4 16 q-14 8 -28 -8 Z" fill="url(#sc-fur)" />
        <ellipse cx="27" cy="76" rx="18" ry="17" fill="url(#sc-fur)" />
        {/* ears */}
        <path d="M11 68 q-7 -13 0 -19 q7 -4 10 9 q1 6 -2 10 Z" fill="#7a4f1b" />
        <path d="M43 68 q7 -13 0 -19 q-7 -4 -10 9 q-1 6 2 10 Z" fill="#7a4f1b" />
        {/* muzzle */}
        <ellipse cx="27" cy="85" rx="12" ry="9" fill="#dfb277" />
        <ellipse cx="27" cy="80" rx="4.6" ry="3.4" fill="#241a10" />
        <path d="M27 84 v4 M22 91 q5 3.4 10 0" stroke="#4a3316" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* eyes + brows */}
        <g>
          <ellipse cx="20" cy="71" rx="4" ry="4.6" fill="#fdfaf4" />
          <circle cx="21" cy="72" r="2.2" fill="#17110a" />
          <circle cx="21.8" cy="71" r="0.8" fill="#fff" />
          <ellipse cx="34" cy="71" rx="4" ry="4.6" fill="#fdfaf4" />
          <circle cx="35" cy="72" r="2.2" fill="#17110a" />
          <circle cx="35.8" cy="71" r="0.8" fill="#fff" />
        </g>
        <path d="M15 64 q4 -2.6 9 -1 M29 63 q5 -1.6 9 1" stroke="#5c3d14" strokeWidth="1.8" fill="none" />
        {/* black spots */}
        <path d="M6 118 q6 -4 12 0 q-2 8 -12 6 Z" fill="#6b4a1a" opacity="0.85" />
        {/* collar + tag */}
        <path d="M12 96 q15 11 30 2 l-2 7 q-14 8 -28 -2 Z" fill="#35b6ce" />
        <path d="M26 103 l4.6 6 l4.6 -6 l-4.6 -4 Z" fill="#f5c33b" stroke="#b78d1e" strokeWidth="1.2" />
        <text x="30.6" y="104.6" fontFamily="Trebuchet MS" fontSize="5.5" fontWeight="bold" fill="#7a5b10" textAnchor="middle">SD</text>
      </g>
      {/* -------- Shaggy -------- */}
      {/* shoulders: green v-neck with folds */}
      <path d="M44 130 q1 -32 23 -37 q6 8 12 8 q6 0 12 -8 q22 5 23 37 Z" fill="#87b141" />
      <path d="M44 130 q1 -32 23 -37 q6 8 12 8 q6 0 12 -8 q22 5 23 37" fill="none" stroke="#679030" strokeWidth="2.5" />
      <path d="M67 93 l12 15 l12 -15" fill="none" stroke="#5f8329" strokeWidth="3.4" />
      <path d="M56 112 q4 -6 3 -14 M102 112 q-4 -6 -3 -14" stroke="#6d9834" strokeWidth="2.6" fill="none" />
      {/* neck */}
      <path d="M72 80 h14 v12 a7 5 0 0 1 -14 0 Z" fill="url(#sh-skin)" />
      <path d="M72 83 q7 4.6 14 0 v4 q-7 4.6 -14 0 Z" fill="#c69a6b" opacity="0.5" />
      {/* head: long face */}
      <path d="M56 46 q0 -27 23 -27 q23 0 23 27 q0 16 -6 24 q-7 10 -17 10 q-10 0 -17 -10 q-6 -8 -6 -24 Z" fill="url(#sh-skin)" />
      <ellipse cx="55" cy="54" rx="4" ry="6.4" fill="url(#sh-skin)" />
      <ellipse cx="103" cy="54" rx="4" ry="6.4" fill="url(#sh-skin)" />
      {/* shaggy mop hair */}
      <path d="M52 48 q-4 -34 27 -34 q31 0 27 34 q-3 -6 -7 -8 q1 -9 -5 -13 q0 7 -4 10 q-2 -10 -10 -13 q2 7 -2 11 q-5 -9 -13 -10 q1 7 -3 10 q-4 -6 -9 -6 q-2 5 -1 19 Z" fill="url(#sh-hair)" />
      <path d="M52 48 q-1 8 5 13 q2 2 1 -3 q-1 -5 0 -8 Z M106 48 q1 8 -5 13 q-2 2 -1 -3 q1 -5 0 -8 Z" fill="url(#sh-hair)" />
      <path d="M60 20 q9 -4 19 -3" stroke="#b58c4e" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.8" />
      <Eye cx={69} cy={52} iris="#4a5d23" />
      <Eye cx={89} cy={52} iris="#4a5d23" />
      {/* long nose, worried mouth, goatee */}
      <path d="M79 55 q-3 8 -1 12 q2 2.6 5 0.6" stroke="#c69a6b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M70 75 q4.6 -4 9 0 q4.6 4 9 0" stroke="#8a5a30" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M72 80 q7 11 15 0 q-1.6 12 -7.5 12 q-6 0 -7.5 -12" fill="url(#sh-hair)" />
      <ellipse cx="63" cy="64" rx="5" ry="3.4" fill="url(#sh-cheek)" />
      <ellipse cx="95" cy="64" rx="5" ry="3.4" fill="url(#sh-cheek)" />
    </svg>
  )
}

function DaphneBust() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full drop-shadow-lg">
      <Defs prefix="d" skinA="#f8ddb7" skinB="#e5b98c" hairA="#e06a35" hairB="#a83c18" />
      {/* long hair behind shoulders */}
      <path d="M30 52 q-8 34 -12 66 q10 10 22 4 l4 -34 Z" fill="url(#d-hair)" />
      <path d="M90 52 q8 34 12 66 q-10 10 -22 4 l-4 -34 Z" fill="url(#d-hair)" />
      {/* shoulders: purple dress */}
      <path d="M24 130 q1 -33 23 -39 q7 9 13 9 q6 0 13 -9 q22 6 23 39 Z" fill="#9061e8" />
      <path d="M24 130 q1 -33 23 -39 q7 9 13 9 q6 0 13 -9 q22 6 23 39" fill="none" stroke="#7546c9" strokeWidth="2.5" />
      <path d="M36 112 q24 10 48 0" stroke="#7c4fd4" strokeWidth="2.6" fill="none" opacity="0.8" />
      {/* green scarf */}
      <path d="M42 96 q18 12 36 0 l3 9 q-21 12 -42 0 Z" fill="#79dfa4" />
      <path d="M42 96 q18 12 36 0" fill="none" stroke="#54bd7e" strokeWidth="2.4" />
      <path d="M58 105 l3 22 q3 3 6 0 l3 -22" fill="#54bd7e" />
      <path d="M61 112 h8 M60 120 h9" stroke="#3d9c62" strokeWidth="1.8" />
      {/* neck */}
      <path d="M53 79 h14 v13 a7 5 0 0 1 -14 0 Z" fill="url(#d-skin)" />
      <path d="M53 83 q7 4.6 14 0 v4 q-7 4.6 -14 0 Z" fill="#cfa377" opacity="0.5" />
      {/* head */}
      <path d="M33 48 q0 -29 27 -29 q27 0 27 29 q0 14 -7 22 q-9 11 -20 11 q-11 0 -20 -11 q-7 -8 -7 -22 Z" fill="url(#d-skin)" />
      {/* flowing red hair with flip */}
      <path d="M28 54 q-4 -42 32 -42 q36 0 32 42 q-2 -6 -6 -8 q1 -11 -7 -16 q2 9 -3 12 q-3 -12 -13 -15 q3 8 -1 12 q-6 -10 -16 -11 q2 7 -3 11 q-6 -7 -11 -6 q-3 7 -4 21 Z" fill="url(#d-hair)" />
      <path d="M28 54 q-2 16 6 26 q4 5 3 -3 q-2 -10 -1 -17 Z" fill="url(#d-hair)" />
      <path d="M92 54 q2 16 -6 26 q-4 5 -3 -3 q2 -10 1 -17 Z" fill="url(#d-hair)" />
      <path d="M40 20 q10 -5 21 -4" stroke="#f5915c" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85" />
      {/* lavender headband */}
      <path d="M33 33 q27 -15 54 0 l-2 8 q-25 -13 -50 0 Z" fill="#cabcfa" />
      <path d="M33 33 q27 -15 54 0" fill="none" stroke="#a893e8" strokeWidth="2" />
      <Eye cx={47} cy={53} iris="#3f6d8e" />
      <Eye cx={73} cy={53} iris="#3f6d8e" />
      {/* lashes */}
      <path d="M41 48 l-3 -2 M53 47 l1 -2.6 M67 47 l-1 -2.6 M79 48 l3 -2" stroke="#3a2a18" strokeWidth="1.6" strokeLinecap="round" />
      {/* nose + lips */}
      <path d="M60 57 q-2.2 6 0 8.6 q1.8 1.4 3.6 0" stroke="#cfa377" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M51 73 q9 7 18 0" stroke="#b3485c" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M54 71.5 q6 2.6 12 0" stroke="#d9687e" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.8" />
      <ellipse cx="41" cy="64" rx="6" ry="4" fill="url(#d-cheek)" />
      <ellipse cx="79" cy="64" rx="6" ry="4" fill="url(#d-cheek)" />
    </svg>
  )
}

export function CharacterBust({ id }: { id: CharacterId }) {
  if (id === 'Velma') return <VelmaBust />
  if (id === 'Daphne') return <DaphneBust />
  return <ShaggyScoobyBust />
}
