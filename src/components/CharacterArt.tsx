import type { CharacterId } from '../types/game'

/**
 * Waist-up portraits for the gang — outlined, gradient-lit cartoon busts used
 * in the walkie hub, the message bar, and as in-scene action cameos.
 *
 * Shared lighting model: warm key light upper-left (sheen bands, catchlights),
 * cool moonlit rim upper-right (RIM strokes), and a dark chocolate outline
 * around every outer silhouette so the busts pop at 56px and at 130px.
 */

const OUT = '#241505'
const RIM = '#a9c8e8'

function Defs({
  prefix,
  skinA,
  skinB,
  hairA,
  hairB,
  hairUA,
  hairUB,
  irisA,
  irisB,
}: {
  prefix: string
  skinA: string
  skinB: string
  hairA: string
  hairB: string
  hairUA: string
  hairUB: string
  irisA: string
  irisB: string
}) {
  return (
    <defs>
      <linearGradient id={`${prefix}-skin`} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stopColor={skinA} />
        <stop offset="100%" stopColor={skinB} />
      </linearGradient>
      <linearGradient id={`${prefix}-hair`} x1="0" y1="0" x2="0.25" y2="1">
        <stop offset="0%" stopColor={hairA} />
        <stop offset="100%" stopColor={hairB} />
      </linearGradient>
      <linearGradient id={`${prefix}-hairU`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={hairUA} />
        <stop offset="100%" stopColor={hairUB} />
      </linearGradient>
      <radialGradient id={`${prefix}-iris`} cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor={irisA} />
        <stop offset="100%" stopColor={irisB} />
      </radialGradient>
      <radialGradient id={`${prefix}-cheek`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#e8836a" stopOpacity="0.42" />
        <stop offset="100%" stopColor="#e8836a" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

/** Eye with lid shade, iris gradient, upper-lash weight and lower-lid line. */
function Eye({ cx, cy, irisId }: { cx: number; cy: number; irisId: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="5.4" ry="6.2" fill="#fdfaf2" />
      <path d={`M${cx - 5} ${cy - 3.2} q5 -3 10 0 q-5 2 -10 0 Z`} fill="#cfc2a8" opacity="0.55" />
      <circle cx={cx} cy={cy + 0.8} r="3.7" fill={`url(#${irisId})`} stroke="#2b1a0c" strokeWidth="0.7" />
      <circle cx={cx + 0.2} cy={cy + 1} r="1.8" fill="#150d05" />
      <circle cx={cx - 1.3} cy={cy - 0.6} r="1.15" fill="#fff" />
      <circle cx={cx + 1.6} cy={cy + 2.4} r="0.55" fill="#fff" opacity="0.7" />
      <path d={`M${cx - 6} ${cy - 4.2} q6 -4.2 12 0`} stroke="#2b1a0c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d={`M${cx - 4.4} ${cy + 5.8} q4.4 1.8 8.8 0`} stroke="#b98a5c" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.75" />
    </g>
  )
}

function VelmaBust() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full drop-shadow-lg">
      <Defs
        prefix="v"
        skinA="#f9dcae"
        skinB="#e2b285"
        hairA="#a95f26"
        hairB="#7a4314"
        hairUA="#5f3410"
        hairUB="#3d1d05"
        irisA="#a06c34"
        irisB="#4e2c0c"
      />
      {/* silhouette outline */}
      <g fill={OUT} stroke={OUT} strokeWidth="4.6" strokeLinejoin="round">
        <path d="M20 130 q1 -33 24 -39 q8 9 16 9 q8 0 16 -9 q23 6 24 39 Z" />
        <path d="M52 78 h16 v14 a8 6 0 0 1 -16 0 Z" />
        <path d="M27 78 Q19 52 25 36 Q32 12 60 12 Q88 12 95 36 Q101 52 93 78 Q90 85 84 86 L36 86 Q30 85 27 78 Z" />
        <path d="M32 48 q0 -30 28 -30 q28 0 28 30 q0 14 -7 22 q-9 11 -21 11 q-12 0 -21 -11 q-7 -8 -7 -22 Z" />
      </g>
      {/* bob under-layer: dark mass behind face + jaw */}
      <path d="M27 78 Q19 52 25 36 Q32 12 60 12 Q88 12 95 36 Q101 52 93 78 Q90 85 84 86 L36 86 Q30 85 27 78 Z" fill="url(#v-hairU)" />
      {/* neck */}
      <path d="M52 78 h16 v14 a8 6 0 0 1 -16 0 Z" fill="url(#v-skin)" />
      <path d="M52 81 q8 5 16 0 v5 q-8 5 -16 0 Z" fill="#c69463" opacity="0.6" />
      {/* chunky orange turtleneck */}
      <path d="M20 130 q1 -33 24 -39 q8 9 16 9 q8 0 16 -9 q23 6 24 39 Z" fill="#ef7d14" />
      <path d="M42 97 q18 10 36 0" stroke="#a34c04" strokeWidth="2.6" fill="none" opacity="0.7" />
      <path d="M33 106 q27 12 54 0" stroke="#c25f05" strokeWidth="3" fill="none" opacity="0.8" />
      <path d="M29 118 q31 12 62 0" stroke="#c25f05" strokeWidth="2.6" fill="none" opacity="0.7" />
      <path d="M25 106 q4 -12 14 -17" stroke="#f9a049" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M78 92 q14 4 18 16" stroke={RIM} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* ribbed roll collar */}
      <path d="M44 90 a16 10 0 0 0 32 0 l0 9 a16 10 0 0 1 -32 0 Z" fill="#d96a08" />
      <path d="M48 91.5 v9 M53 94.5 v9 M60 95.8 v9 M67 94.5 v9 M72 91.5 v9" stroke="#a84e04" strokeWidth="1.6" fill="none" />
      <path d="M44 90 a16 10 0 0 0 32 0" stroke="#8f4003" strokeWidth="1.8" fill="none" />
      {/* head */}
      <path d="M32 48 q0 -30 28 -30 q28 0 28 30 q0 14 -7 22 q-9 11 -21 11 q-12 0 -21 -11 q-7 -8 -7 -22 Z" fill="url(#v-skin)" />
      <path d="M40 62 q4 12 12 17 M80 62 q-4 12 -12 17" stroke="#d8a878" strokeWidth="1.8" fill="none" opacity="0.5" />
      <path d="M56 77.5 q4 2.4 8 0" stroke="#cb9c6c" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* bob: scalloped fringe with distinct locks */}
      <path d="M29 58 Q24 20 60 14 Q96 20 91 58 Q88 44 82 52 Q76 40 70 50 Q64 38 58 50 Q52 40 46 52 Q40 42 36 54 Q32 48 29 58 Z" fill="url(#v-hair)" />
      <path d="M29 54 Q25 68 30 80 Q34 87 39 82 Q34 70 34 54 Z" fill="url(#v-hair)" />
      <path d="M91 54 Q95 68 90 80 Q86 87 81 82 Q86 70 86 54 Z" fill="url(#v-hair)" />
      <path d="M46 45 q-1 4 0 7 M58 43 q-1 4 0 7 M70 43 q-1 4 0 7 M82 45 q-1 4 0 7" stroke="#7a4314" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M36 24 Q47 15 61 15" stroke="#d69352" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M68 16 Q78 19 84 26" stroke="#d69352" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
      <path d="M92 30 Q96 40 95 52" stroke={RIM} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* brows peeking over the bangs (classic cartoon cheat) */}
      <path d="M38.5 42.5 q6.5 -2.5 13 -0.8 M68.5 41.7 q6.5 -1.7 13 0.8" stroke="#4a2a0c" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* eyes behind the lenses */}
      <Eye cx={45.5} cy={54} irisId="v-iris" />
      <Eye cx={74.5} cy={54} irisId="v-iris" />
      {/* thick square glasses */}
      <g>
        <rect x="34" y="44" width="23" height="19" rx="4" fill="rgba(255,252,244,0.28)" stroke="#1d1206" strokeWidth="3.4" />
        <rect x="63" y="44" width="23" height="19" rx="4" fill="rgba(255,252,244,0.28)" stroke="#1d1206" strokeWidth="3.4" />
        <path d="M57 52.5 h6 M34 50 l-7 -2.5 M86 50 l7 -2.5" stroke="#1d1206" strokeWidth="3" />
        <path d="M37.5 47.5 l7.5 4.5 M66.5 47.5 l7.5 4.5" stroke="#fff" strokeWidth="2" opacity="0.5" />
      </g>
      {/* nose: bridge, wing, nostril hint, shadow side */}
      <path d="M60 56 q-2.2 6 -0.6 9" stroke="#c99668" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M59.4 65 q1.6 1.8 4 0.6" stroke="#b8875a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="62.8" cy="65.4" rx="1" ry="0.7" fill="#a5764a" opacity="0.8" />
      <path d="M61.6 58.5 q1.2 3.5 0.6 5.4" stroke="#d8a878" strokeWidth="1.4" fill="none" opacity="0.6" />
      {/* open smile with inner mouth + teeth */}
      <path d="M51 71.5 q9 8 18 0" stroke="#8f4a28" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M52.8 72.6 q7.2 6 14.4 0 q-2.4 5.4 -7.2 5.4 q-4.8 0 -7.2 -5.4 Z" fill="#7c2f20" />
      <path d="M54.4 73.6 q5.6 3.6 11.2 0 l-0.4 2.2 q-5.2 2.8 -10.4 0 Z" fill="#f7efe2" />
      <path d="M54 79.8 q6 2.6 12 0" stroke="#d9776b" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* blush + freckles */}
      <ellipse cx="40" cy="65" rx="6" ry="4" fill="url(#v-cheek)" />
      <ellipse cx="80" cy="65" rx="6" ry="4" fill="url(#v-cheek)" />
      <g fill="#c98d58">
        <circle cx="38" cy="65.5" r="0.9" />
        <circle cx="42.5" cy="68" r="0.9" />
        <circle cx="77.5" cy="68" r="0.9" />
        <circle cx="82" cy="65.5" r="0.9" />
      </g>
    </svg>
  )
}

function ShaggyScoobyBust() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full drop-shadow-lg">
      <Defs
        prefix="sh"
        skinA="#f2cf9e"
        skinB="#ddab78"
        hairA="#a1763a"
        hairB="#6f4d20"
        hairUA="#5c3d14"
        hairUB="#402907"
        irisA="#7c9440"
        irisB="#3a5014"
      />
      <defs>
        <linearGradient id="sc-fur" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#c68f40" />
          <stop offset="100%" stopColor="#8f5f22" />
        </linearGradient>
      </defs>
      {/* -------- Scooby, leaning in from off-frame left -------- */}
      <g>
        {/* outline */}
        <g fill={OUT} stroke={OUT} strokeWidth="4.6" strokeLinejoin="round">
          <path d="M0 130 q0 -30 17 -35 q23 -6 29 35 Z" />
          <path d="M14 104 Q12 84 24 78 L38 78 Q45 84 44 96 L44 106 Q29 114 14 104 Z" />
          <ellipse cx="28" cy="64" rx="15.5" ry="14.5" />
          <circle cx="20" cy="52.5" r="5" />
          <circle cx="35" cy="52.5" r="5" />
          <path d="M13 76 Q10 90 18 96 Q26 101 34 97 Q40 94 40 85 Q40 77 33 73 Q24 69 17 72 Q13 73 13 76 Z" />
          <path d="M12 54 Q4 44 8 34 Q11 28 16 33 Q21 39 19 50 Z" />
          <path d="M40 52 Q48 42 45 32 Q42 26 37 31 Q33 37 35 48 Z" />
        </g>
        {/* chest + neck with folds and a black spot */}
        <path d="M0 130 q0 -30 17 -35 q23 -6 29 35 Z" fill="url(#sc-fur)" />
        <path d="M8 112 q8 -5 16 -2" stroke="#7a4f1b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M5 117 q7 -6 14 0 q-2 9 -14 7 Z" fill="#4a3010" />
        <path d="M14 104 Q12 84 24 78 L38 78 Q45 84 44 96 L44 106 Q29 114 14 104 Z" fill="url(#sc-fur)" />
        <path d="M17 106 q10 6 20 2 M19 112 q9 5 18 2" stroke="#7a4f1b" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M40 98 q5 -3 8 2 q-2 6 -8 3 Z" fill="#4a3010" />
        {/* ears: far ear + near ear with a visible turn */}
        <path d="M12 54 Q4 44 8 34 Q11 28 16 33 Q21 39 19 50 Z" fill="#6b4423" />
        <path d="M13 47 Q9 40 11 35" stroke="#3d2408" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M40 52 Q48 42 45 32 Q42 26 37 31 Q33 37 35 48 Z" fill="#6b4423" />
        <path d="M38 34 Q42 31 43 36 Q44 42 40 47 Z" fill="#9c6a30" />
        {/* head with brow bumps */}
        <ellipse cx="28" cy="64" rx="15.5" ry="14.5" fill="url(#sc-fur)" />
        <circle cx="20" cy="52.5" r="5" fill="url(#sc-fur)" />
        <circle cx="35" cy="52.5" r="5" fill="url(#sc-fur)" />
        {/* worried brows */}
        <path d="M14.5 56.5 q4.5 -3.5 9 -2.5 M32 54 q4.5 -1 9 2.5" stroke="#3a250a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* eyes: heavy upper lids, catchlight upper-left */}
        <g>
          <ellipse cx="21" cy="62.5" rx="4.1" ry="4.7" fill="#fdfaf2" />
          <circle cx="21.6" cy="63.5" r="2.2" fill="#150d05" />
          <circle cx="20.4" cy="61.8" r="0.9" fill="#fff" />
          <path d="M17 58.6 q4 -2.6 8 0" stroke={OUT} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <ellipse cx="34.5" cy="62.5" rx="4.1" ry="4.7" fill="#fdfaf2" />
          <circle cx="35.1" cy="63.5" r="2.2" fill="#150d05" />
          <circle cx="33.9" cy="61.8" r="0.9" fill="#fff" />
          <path d="M30.5 58.6 q4 -2.6 8 0" stroke={OUT} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
        {/* proper Great Dane muzzle: deep, squared, with chin + jowl */}
        <path d="M13 76 Q10 90 18 96 Q26 101 34 97 Q40 94 40 85 Q40 77 33 73 Q24 69 17 72 Q13 73 13 76 Z" fill="#dcae70" />
        <path d="M15 74 Q25 70 36 74" stroke="#a5793c" strokeWidth="1.6" fill="none" opacity="0.7" />
        <ellipse cx="22" cy="77.5" rx="5.2" ry="4" fill="#1c1208" />
        <ellipse cx="20.4" cy="76" rx="1.5" ry="1" fill="#8a8078" opacity="0.9" />
        <path d="M23 81.5 v4 M16.5 88 q7 5 14 1" stroke="#4a3316" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <ellipse cx="24" cy="94.5" rx="4" ry="2.6" fill="#c89a58" />
        <path d="M36.5 82 q2.5 6 -2 10" stroke="#8a5c26" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* collar + gold SD tag with glint */}
        <path d="M12 94 Q28 106 44 98 L43 106 Q28 113 13 102 Z" fill="#35b6ce" />
        <path d="M13 102 Q28 113 43 106" stroke="#1f8ba0" strokeWidth="2" fill="none" />
        <path d="M14 95 Q28 105 42 99" stroke="#7fd9e8" strokeWidth="1.5" fill="none" opacity="0.8" />
        <circle cx="29" cy="103" r="1.4" fill="none" stroke="#b78d1e" strokeWidth="1" />
        <path d="M29 103.5 L33.8 108 L29 112.5 L24.2 108 Z" fill="#f5c33b" stroke="#b78d1e" strokeWidth="1.2" />
        <path d="M26.6 106 l1.8 -1.6" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
        <text x="29" y="110" fontFamily="Trebuchet MS" fontSize="4.6" fontWeight="bold" fill="#7a5b10" textAnchor="middle">SD</text>
        {/* cool rim on the head, upper-right */}
        <path d="M38 51 Q44 55 45.5 61" stroke={RIM} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      </g>
      {/* -------- Shaggy -------- */}
      {/* outline */}
      <g fill={OUT} stroke={OUT} strokeWidth="4.6" strokeLinejoin="round">
        <path d="M44 130 q1 -32 23 -37 q6 8 12 8 q6 0 12 -8 q22 5 23 37 Z" />
        <path d="M72 80 h14 v12 a7 5 0 0 1 -14 0 Z" />
        <path d="M53 50 Q49 13 79 13 Q109 13 105 50 Q104 60 100 62 L58 62 Q54 60 53 50 Z" />
        <path d="M56 46 q0 -27 23 -27 q23 0 23 27 q0 16 -6 24 q-7 10 -17 10 q-10 0 -17 -10 q-6 -8 -6 -24 Z" />
      </g>
      {/* mop under-layer */}
      <path d="M53 50 Q49 13 79 13 Q109 13 105 50 Q104 60 100 62 L58 62 Q54 60 53 50 Z" fill="url(#sh-hairU)" />
      {/* rumpled green v-neck tee */}
      <path d="M44 130 q1 -32 23 -37 q6 8 12 8 q6 0 12 -8 q22 5 23 37 Z" fill="#8cb748" />
      <path d="M67 93 L79 108 L91 93" fill="none" stroke="#5f8329" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M69.5 93 L79 104.5 L88.5 93" fill="none" stroke="#6d9834" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M53 112 q5 -5 4 -12 M105 112 q-5 -5 -4 -12 M64 121 q15 7 30 0 M60 106 q3 6 2 11 M98 106 q-3 6 -2 11" stroke="#679030" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M50 102 q5 -9 13 -12" stroke="#a4cc60" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M97 94 q11 6 14 18" stroke={RIM} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* neck */}
      <path d="M72 80 h14 v12 a7 5 0 0 1 -14 0 Z" fill="url(#sh-skin)" />
      <path d="M72 83 q7 4.6 14 0 v4.5 q-7 4.6 -14 0 Z" fill="#c69a6b" opacity="0.55" />
      {/* long face */}
      <path d="M56 46 q0 -27 23 -27 q23 0 23 27 q0 16 -6 24 q-7 10 -17 10 q-10 0 -17 -10 q-6 -8 -6 -24 Z" fill="url(#sh-skin)" />
      <path d="M62 64 q2 7 6 10 M96 64 q-2 7 -6 10" stroke="#d8a878" strokeWidth="1.6" fill="none" opacity="0.5" />
      {/* shaggy mop: jagged fringe locks + side falls */}
      <path d="M53 50 Q49 14 79 13 Q109 14 105 50 Q102 40 97 48 Q93 36 87 46 Q84 34 78 45 Q73 35 68 46 Q64 38 60 50 Q56 42 53 50 Z" fill="url(#sh-hair)" />
      <path d="M53 48 Q50 60 54 72 Q57 78 61 74 Q56 62 57 48 Z" fill="url(#sh-hair)" />
      <path d="M105 48 Q108 60 104 72 Q101 78 97 74 Q102 62 101 48 Z" fill="url(#sh-hair)" />
      <path d="M64 43 q-1 4 0 7 M78 41 q-1 4 0 7 M91 43 q-1 4 0 7" stroke="#6b4a1e" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M62 19 Q72 14 84 16" stroke="#c9a45e" strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M101 22 Q106 30 106 42" stroke={RIM} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* brows */}
      <path d="M62 47.5 q5 -2.5 10 -1.2 M86 46.3 q5 -1.3 10 1.2" stroke="#5c4318" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <Eye cx={69} cy={52} irisId="sh-iris" />
      <Eye cx={89} cy={52} irisId="sh-iris" />
      {/* long nose with nostril + shadow side */}
      <path d="M79 54 q-3.5 8 -1.2 12.5" stroke="#c69a6b" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M77.8 66.5 q2.2 2.4 5.4 0.8" stroke="#b8875a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="82.8" cy="66.8" rx="1" ry="0.7" fill="#a5764a" opacity="0.8" />
      <path d="M80.6 57 q1.4 4.2 0.8 6.8" stroke="#d8a878" strokeWidth="1.4" fill="none" opacity="0.6" />
      {/* easy grin with inner mouth */}
      <path d="M70 73 q9 6.5 18 0" stroke="#8a5a30" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M72 74 q7 5 14 0 q-2.5 4.6 -7 4.6 q-4.5 0 -7 -4.6 Z" fill="#6e2c1c" />
      <path d="M73.6 75 q5.4 3.2 10.8 0 l-0.3 2 q-5.1 2.4 -10.2 0 Z" fill="#f4ecdc" />
      {/* scraggly goatee: compact patch right under the lower lip, jagged edge */}
      <path d="M74.8 79.2 q4.2 2.6 8.4 0 q0.6 2.8 -0.6 5 l-1.2 -1.6 l-0.9 3.4 l-1.5 -2 l-1.5 2 l-0.9 -3.4 l-1.2 1.6 q-1.2 -2.2 -0.6 -5 Z" fill="url(#sh-hair)" />
      <path d="M76.4 80.8 q-0.5 2.4 0.2 4.2 M79 81.4 q-0.3 2.6 0 4.6 M81.6 80.8 q0.5 2.4 -0.2 4.2" stroke="#6b4a1e" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.9" />
      <g fill="#7a5a28" opacity="0.7">
        <circle cx="73.4" cy="78" r="0.55" /><circle cx="84.6" cy="78" r="0.55" /><circle cx="75.6" cy="76.4" r="0.5" /><circle cx="82.4" cy="76.4" r="0.5" />
      </g>
      <ellipse cx="63" cy="63" rx="5" ry="3.4" fill="url(#sh-cheek)" />
      <ellipse cx="95" cy="63" rx="5" ry="3.4" fill="url(#sh-cheek)" />
    </svg>
  )
}

function DaphneBust() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full drop-shadow-lg">
      <Defs
        prefix="d"
        skinA="#f8ddb7"
        skinB="#e5b98c"
        hairA="#e06a35"
        hairB="#b0421a"
        hairUA="#9c3812"
        hairUB="#6e2408"
        irisA="#8a7fd0"
        irisB="#403680"
      />
      {/* silhouette outline */}
      <g fill={OUT} stroke={OUT} strokeWidth="4.6" strokeLinejoin="round">
        <path d="M31 46 Q19 80 14 112 Q13 125 27 127 Q38 127 38 116 Q41 86 41 60 Z" />
        <path d="M89 46 Q101 80 106 112 Q107 125 93 127 Q82 127 82 116 Q79 86 79 60 Z" />
        <path d="M24 130 q1 -33 23 -39 q7 9 13 9 q6 0 13 -9 q22 6 23 39 Z" />
        <path d="M53 79 h14 v13 a7 5 0 0 1 -14 0 Z" />
        <path d="M28 54 Q23 12 60 12 Q97 12 92 54 Q92 62 86 64 L34 64 Q28 62 28 54 Z" />
        <path d="M33 48 q0 -29 27 -29 q27 0 27 29 q0 14 -7 22 q-9 11 -20 11 q-11 0 -20 -11 q-7 -8 -7 -22 Z" />
      </g>
      {/* long falls behind the shoulders, flipped out at the ends */}
      <path d="M31 46 Q19 80 14 112 Q13 125 27 127 Q38 127 38 116 Q41 86 41 60 Z" fill="url(#d-hairU)" />
      <path d="M89 46 Q101 80 106 112 Q107 125 93 127 Q82 127 82 116 Q79 86 79 60 Z" fill="url(#d-hairU)" />
      <path d="M22 92 Q18 108 24 120 M98 92 Q102 108 96 120" stroke="#c85a28" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M18 118 q3 6 10 6 M102 118 q-3 6 -10 6" stroke="#f5915c" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M100 78 Q104 96 104 112" stroke={RIM} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45" />
      {/* crown mass behind the face */}
      <path d="M28 54 Q23 12 60 12 Q97 12 92 54 Q92 62 86 64 L34 64 Q28 62 28 54 Z" fill="url(#d-hairU)" />
      {/* satin purple dress */}
      <path d="M24 130 q1 -33 23 -39 q7 9 13 9 q6 0 13 -9 q22 6 23 39 Z" fill="#9061e8" />
      <path d="M38 108 q22 10 44 0" stroke="#7546c9" strokeWidth="2.6" fill="none" opacity="0.8" />
      <path d="M30 120 q30 11 60 0" stroke="#7546c9" strokeWidth="2.4" fill="none" opacity="0.7" />
      <path d="M36 110 q6 -10 14 -14 M86 112 q-6 -11 -14 -15" stroke="#c3a5f7" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M28 104 q5 -11 14 -15" stroke="#b591f5" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M78 92 q13 5 17 16" stroke={RIM} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* green scarf: band, knot, hanging tail */}
      <path d="M42 94 q18 12 36 0 l3 9 q-21 12 -42 0 Z" fill="#7fe3ab" />
      <path d="M45 104 q16 9 33 -1" stroke="#54bd7e" strokeWidth="2.2" fill="none" />
      <path d="M44 95 q17 10 33 0" stroke="#a9f0c8" strokeWidth="1.8" fill="none" opacity="0.8" />
      <path d="M55 109 l2.5 19 q3.5 3.5 7.5 0 l2.5 -19 q-6 4 -12.5 0 Z" fill="#5fca8b" />
      <path d="M58 114 h8 M57.5 120 h8.5" stroke="#3d9c62" strokeWidth="1.6" />
      <path d="M56 111 l2 16" stroke="#a9f0c8" strokeWidth="1.2" opacity="0.7" />
      <path d="M52 102 q6 -3.5 11 0 q2.5 3.5 0 7 q-6 3.5 -11 0 q-2.5 -3.5 0 -7 Z" fill="#66d693" stroke="#46a86c" strokeWidth="1.5" />
      {/* neck */}
      <path d="M53 79 h14 v13 a7 5 0 0 1 -14 0 Z" fill="url(#d-skin)" />
      <path d="M53 82 q7 4.6 14 0 v4.5 q-7 4.6 -14 0 Z" fill="#cfa377" opacity="0.55" />
      {/* head */}
      <path d="M33 48 q0 -29 27 -29 q27 0 27 29 q0 14 -7 22 q-9 11 -20 11 q-11 0 -20 -11 q-7 -8 -7 -22 Z" fill="url(#d-skin)" />
      <path d="M41 62 q4 11 11 16 M79 62 q-4 11 -11 16" stroke="#d8a878" strokeWidth="1.6" fill="none" opacity="0.45" />
      {/* side-swept bangs (lower on the right) */}
      <path d="M33 50 Q28 16 60 13 Q94 16 90 54 Q86 44 81 50 Q76 38 69 46 Q63 34 55 40 Q48 32 42 38 Q36 42 33 50 Z" fill="url(#d-hair)" />
      <path d="M52 38 q-2 4 -1 7 M66 41 q-2 4 -1 7 M78 45 q-2 4 -1 6" stroke="#b0421a" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M46 32 Q58 26 72 30" stroke="#f5915c" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* lavender headband over the crown */}
      <path d="M32 38 Q60 21 88 38 L86 46 Q60 30 34 46 Z" fill="#cabcfa" />
      <path d="M32 38 Q60 21 88 38" fill="none" stroke="#a893e8" strokeWidth="1.8" />
      <path d="M34 46 Q60 30 86 46" fill="none" stroke="#9c86dd" strokeWidth="1.5" />
      <path d="M44 30 Q56 24 70 26" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* front side locks framing the face */}
      <path d="M32 50 Q28 64 32 78 Q35 85 40 81 Q35 68 36 52 Z" fill="url(#d-hair)" />
      <path d="M88 50 Q93 64 90 78 Q88 86 82 82 Q87 68 85 52 Z" fill="url(#d-hair)" />
      <path d="M44 16 Q56 12 68 14" stroke="#f5915c" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85" />
      {/* arched brows + lashes */}
      <path d="M40 46.5 q6.5 -3.5 13 -1.5 M67 45 q6.5 -2 13 1.5" stroke="#8a3c14" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <Eye cx={47} cy={53} irisId="d-iris" />
      <Eye cx={73} cy={53} irisId="d-iris" />
      <path d="M40.8 49.6 l-3.2 -2.4 M42.4 47.2 l-2.6 -3 M79.2 49.6 l3.2 -2.4 M77.6 47.2 l2.6 -3" stroke="#2b1a0c" strokeWidth="1.5" strokeLinecap="round" />
      {/* petite nose */}
      <path d="M60 56.5 q-1.8 5.5 -0.5 8" stroke="#cfa377" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M59.5 64.5 q1.5 1.6 3.6 0.5" stroke="#c0885c" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <ellipse cx="62.4" cy="64.8" rx="0.9" ry="0.65" fill="#b07a4e" opacity="0.8" />
      <path d="M61.4 58.5 q1 3.2 0.5 5" stroke="#d8a878" strokeWidth="1.3" fill="none" opacity="0.6" />
      {/* two-tone lips with highlight */}
      <path d="M51.5 72 q8.5 6.5 17 0" stroke="#b3485c" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M53.6 73.8 q6.4 4.2 12.8 0 q-2.4 4.4 -6.4 4.4 q-4 0 -6.4 -4.4 Z" fill="#d9687e" />
      <circle cx="58" cy="75.8" r="0.9" fill="#f2a9b8" opacity="0.9" />
      <path d="M56.5 78.8 q3.5 1.6 7 0" stroke="#a4404f" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="41" cy="64" rx="6" ry="4" fill="url(#d-cheek)" />
      <ellipse cx="79" cy="64" rx="6" ry="4" fill="url(#d-cheek)" />
    </svg>
  )
}

function FredBust() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full drop-shadow-lg">
      <Defs
        prefix="f"
        skinA="#f7d8ab"
        skinB="#e4b384"
        hairA="#ecce66"
        hairB="#c9a53e"
        hairUA="#a5802a"
        hairUB="#7d5f1c"
        irisA="#6fa3c8"
        irisB="#27506e"
      />
      {/* silhouette outline */}
      <g fill={OUT} stroke={OUT} strokeWidth="4.6" strokeLinejoin="round">
        <path d="M22 130 q1 -33 23 -39 q8 9 15 9 q7 0 15 -9 q22 6 23 39 Z" />
        <path d="M53 77 h14 v13 a7 5 0 0 1 -14 0 Z" />
        <ellipse cx="31" cy="54" rx="4.5" ry="7" />
        <ellipse cx="89" cy="54" rx="4.5" ry="7" />
        <path d="M30 48 Q25 11 60 11 Q95 11 90 48 Q89 56 85 54 L35 54 Q31 56 30 48 Z" />
        <path d="M32 46 q0 -28 28 -28 q28 0 28 28 q0 16 -6 24 q-6 9 -22 9 q-16 0 -22 -9 q-6 -8 -6 -24 Z" />
      </g>
      {/* hair under-layer */}
      <path d="M30 48 Q25 11 60 11 Q95 11 90 48 Q89 56 85 54 L35 54 Q31 56 30 48 Z" fill="url(#f-hairU)" />
      {/* crisp white shirt */}
      <path d="M22 130 q1 -33 23 -39 q8 9 15 9 q7 0 15 -9 q22 6 23 39 Z" fill="#f8f5ee" />
      <path d="M34 112 q26 10 52 0" stroke="#d8d2c2" strokeWidth="2.4" fill="none" opacity="0.9" />
      <path d="M31 104 q3 9 2 16 M89 104 q-3 9 -2 16" stroke="#d8d2c2" strokeWidth="2.2" fill="none" opacity="0.8" />
      <path d="M27 106 q4 -11 13 -16" stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M79 92 q13 4 17 15" stroke={RIM} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* blue jeans hint at the waist crop */}
      <path d="M22 130 q0 -6 1 -10 q37 12 74 0 q1 4 1 10 Z" fill="#3b5b8a" />
      <path d="M23 121 q37 12 74 0" fill="none" stroke="#2c4569" strokeWidth="2.2" />
      <path d="M26 125 q34 10 68 0" fill="none" stroke="#7fa0c8" strokeWidth="1.2" strokeDasharray="2.5 2" opacity="0.8" />
      <rect x="38" y="121.5" width="4" height="7" rx="1" fill="#2c4569" transform="rotate(6 40 125)" />
      <rect x="78" y="121.5" width="4" height="7" rx="1" fill="#2c4569" transform="rotate(-6 80 125)" />
      <rect x="58" y="124" width="4" height="6" rx="1" fill="#2c4569" />
      {/* soft blue collar flaps */}
      <path d="M46 91 l-13 13 l17 -3 Z" fill="#bcd2e8" stroke="#8fb0d0" strokeWidth="1.8" />
      <path d="M74 91 l13 13 l-17 -3 Z" fill="#bcd2e8" stroke="#8fb0d0" strokeWidth="1.8" />
      {/* neck */}
      <path d="M53 77 h14 v13 a7 5 0 0 1 -14 0 Z" fill="url(#f-skin)" />
      <path d="M53 80 q7 4.6 14 0 v4.5 q-7 4.6 -14 0 Z" fill="#cfa377" opacity="0.55" />
      {/* iconic orange ascot: drape, knot, hanging tail */}
      <path d="M44 92 q16 13 32 0 q6 6 7 13 q-23 16 -46 0 q1 -7 7 -13 Z" fill="#f6a418" />
      <path d="M46 94 q14 11 28 0" stroke="#ffc14a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M50 100 q3 6 2 10 M70 100 q-3 6 -2 10 M60 104 q0 5 0 8" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M52 111 q8 4 16 0" stroke="#b85c06" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M55 111 q-4 10 -0.5 17 q5.5 4 11 0 q3.5 -7 -0.5 -17 Z" fill="#f6a418" stroke="#d97706" strokeWidth="1.6" />
      <path d="M60 113 v12" stroke="#d97706" strokeWidth="1.6" opacity="0.8" />
      <path d="M56 124 q4 3 8 0" stroke="#c1670a" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M53 102 q7 -4.5 14 0 q3 4.8 0 9.6 q-7 4 -14 0 q-3 -4.8 0 -9.6 Z" fill="#fbb43a" stroke="#d97706" strokeWidth="1.8" />
      <path d="M56.5 104 q-1.5 3.5 0 6.5 M63.5 104 q1.5 3.5 0 6.5" stroke="#d97706" strokeWidth="1.4" fill="none" opacity="0.85" />
      {/* strong square-jawed head */}
      <path d="M32 46 q0 -28 28 -28 q28 0 28 28 q0 16 -6 24 q-6 9 -22 9 q-16 0 -22 -9 q-6 -8 -6 -24 Z" fill="url(#f-skin)" />
      <path d="M44 64 q3 8 9 11 M76 64 q-3 8 -9 11" stroke="#d8ab7c" strokeWidth="1.8" fill="none" opacity="0.5" />
      <path d="M55.5 77.5 q4.5 2.6 9 0" stroke="#cb9c6c" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.85" />
      {/* ears with inner whorl */}
      <ellipse cx="31" cy="54" rx="4.5" ry="7" fill="url(#f-skin)" />
      <ellipse cx="89" cy="54" rx="4.5" ry="7" fill="url(#f-skin)" />
      <path d="M29 51.5 q3.2 -2.2 3.8 1.4 q0.4 2.8 -1.8 4.6" stroke="#c08a58" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M91 51.5 q-3.2 -2.2 -3.8 1.4 q-0.4 2.8 1.8 4.6" stroke="#c08a58" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* neat blond side-part swoop */}
      <path d="M30 46 Q26 12 60 12 Q94 12 90 46 Q89 53 86 49 Q88 40 80 31 Q66 24 52 29 Q45 32 44 38 Q41 35 42 30 Q35 35 34 47 Q32 53 30 46 Z" fill="url(#f-hair)" />
      <path d="M44 36 Q60 26 80 32" stroke="#a5802a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M48 27 Q64 21 78 28 M45 33 Q58 28 72 32" stroke="#b08c2e" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M48 18 Q60 14 73 18" stroke="#f6e296" strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M87 20 Q92 28 93 40" stroke={RIM} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* confident straight brows with ridge shading */}
      <path d="M40.5 47.5 l13 -1.2 M66.5 46.3 l13 1.2" stroke="#7a5c1e" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M41 50.5 l12 -1 M67 49.5 l12 1" stroke="#e0b384" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.6" />
      <Eye cx={47} cy={53} irisId="f-iris" />
      <Eye cx={73} cy={53} irisId="f-iris" />
      {/* nose */}
      <path d="M60 55.5 q-2.4 6 -0.6 9.5" stroke="#cfa377" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      <path d="M59.2 65 q1.8 1.8 4.2 0.5" stroke="#c0885c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="63" cy="65.3" rx="1" ry="0.7" fill="#b07a4e" opacity="0.8" />
      <path d="M61.8 58 q1.2 3.6 0.7 5.6" stroke="#d8ab7c" strokeWidth="1.4" fill="none" opacity="0.7" />
      {/* confident smile with teeth */}
      <path d="M50 70 q10 8.5 20 0" stroke="#a3542e" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M52 71.2 q8 6.6 16 0 q-2.8 5.6 -8 5.6 q-5.2 0 -8 -5.6 Z" fill="#6e2517" />
      <path d="M53.6 72.3 q6.4 4.4 12.8 0 l-0.3 2.6 q-6 3.2 -12.2 0 Z" fill="#f7efe2" />
      <path d="M54 78.6 q6 2.6 12 0" stroke="#d9927b" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.85" />
      <ellipse cx="41" cy="62.5" rx="5.5" ry="3.5" fill="url(#f-cheek)" />
      <ellipse cx="79" cy="62.5" rx="5.5" ry="3.5" fill="url(#f-cheek)" />
    </svg>
  )
}

export function CharacterBust({ id }: { id: CharacterId }) {
  if (id === 'Fred') return <FredBust />
  if (id === 'Velma') return <VelmaBust />
  if (id === 'Daphne') return <DaphneBust />
  return <ShaggyScoobyBust />
}
