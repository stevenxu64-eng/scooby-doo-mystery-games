import { useEffect, useState, type ReactNode } from 'react'

/**
 * Cinematic intro cutscene: the Mystery Machine rolls up to the abandoned
 * Grand Palm Resort at night while a bottom story card steps through four
 * beats explaining why the gang is here. Fully self-contained (inline SVG +
 * scoped "intro-" keyframes).
 */

const STARS: [number, number, number, number][] = [
  [40, 40, 1.6, 0], [95, 150, 1.1, 0.7], [140, 28, 1.3, 1.4], [235, 60, 1.8, 0.3],
  [300, 130, 1.2, 2.1], [345, 36, 1.5, 1.1], [400, 90, 1.1, 0.5], [455, 48, 1.9, 1.8],
  [505, 140, 1.2, 0.9], [548, 24, 1.4, 2.4], [600, 82, 1.7, 0.2], [648, 150, 1.1, 1.6],
  [700, 44, 1.5, 0.8], [742, 108, 1.2, 2.2], [800, 30, 1.7, 1.2], [858, 70, 1.2, 0.4],
  [905, 140, 1.4, 1.9], [935, 42, 1.7, 0.6], [520, 200, 1.0, 1.3], [70, 230, 1.1, 2.6],
]

/** Neon letters — a couple flicker, one is dead and just buzzes. */
function NeonSignRow() {
  const letters = 'GRAND PALM RESORT'.split('')
  const cls = (i: number) => {
    if (i === 6) return 'intro-neon-dead'
    if (i === 2) return 'intro-neon-f1'
    if (i === 9) return 'intro-neon-f2'
    if (i === 13) return 'intro-neon-f3'
    return ''
  }
  return (
    <g>
      {letters.map((ch, i) => (
        <text
          key={i}
          x={770 + i * 10}
          y={250}
          textAnchor="middle"
          fontFamily='"Courier New", monospace'
          fontSize="14"
          fontWeight="bold"
          fill="#8af2d9"
          className={cls(i)}
        >
          {ch}
        </text>
      ))}
    </g>
  )
}

function Palm({ x, y, s, sway, delay = '0s', flip = false }: {
  x: number; y: number; s: number; sway: string; delay?: string; flip?: boolean
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="intro-palm" style={{ animationDuration: sway, animationDelay: delay }} fill="#04121b">
        {/* curved trunk */}
        <path d="M-3 0 Q2 -24 14 -46 L19 -43 Q8 -23 4 0 Z" />
        <path d="M-1 -8 h5 M0 -18 h5 M3 -28 h5" stroke="#04121b" strokeWidth="1.4" />
        {/* frond crown */}
        <path d="M16 -46 Q-6 -58 -25 -50 Q-4 -43 16 -43 Z" />
        <path d="M16 -46 Q-2 -67 -21 -69 Q0 -52 17 -43 Z" />
        <path d="M16 -46 Q13 -73 1 -81 Q10 -58 19 -44 Z" />
        <path d="M16 -46 Q29 -71 47 -73 Q28 -54 17 -43 Z" />
        <path d="M16 -46 Q38 -59 55 -53 Q34 -43 16 -42 Z" />
        <path d="M16 -45 Q36 -45 51 -35 Q30 -37 15 -41 Z" />
        <circle cx="13" cy="-44" r="2.6" />
        <circle cx="19" cy="-42" r="2.2" />
      </g>
    </g>
  )
}

/** The showpiece: side view of the Mystery Machine, facing right. */
function MysteryMachine() {
  const wheel = (cx: number) => (
    <g>
      <circle cx={cx} cy={84} r={19} fill="#0c1622" />
      <circle cx={cx} cy={84} r={15.5} fill="#242b35" stroke="#0f151d" strokeWidth="3" />
      <circle cx={cx} cy={84} r={8.6} fill="url(#intro-chrome)" stroke="#5c6b7a" strokeWidth="1.2" />
      <g className="intro-wheel" stroke="#5c6b7a" strokeWidth="1.6">
        <line x1={cx - 7} y1={84} x2={cx + 7} y2={84} />
        <line x1={cx - 3.5} y1={84 - 6.1} x2={cx + 3.5} y2={84 + 6.1} />
        <line x1={cx - 3.5} y1={84 + 6.1} x2={cx + 3.5} y2={84 - 6.1} />
        <circle cx={cx + 5} cy={84} r={1.2} fill="#5c6b7a" stroke="none" />
        <circle cx={cx - 5} cy={84} r={1.2} fill="#5c6b7a" stroke="none" />
      </g>
      <circle cx={cx} cy={84} r={2.4} fill="#39434f" />
    </g>
  )

  const flower = (cx: number, cy: number, s: number) => (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle
          key={a}
          cx={Math.cos((a * Math.PI) / 180) * 4}
          cy={Math.sin((a * Math.PI) / 180) * 4}
          r="2.7"
          fill="#f08a1d"
          stroke="#b85606"
          strokeWidth="0.7"
        />
      ))}
      <circle r="2.5" fill="#ffd94d" stroke="#c9930a" strokeWidth="0.7" />
    </g>
  )

  return (
    <g transform="translate(60 402)">
      <g className="intro-van">
        {/* ground shadow rides along but does not bounce */}
        <ellipse cx="102" cy="99" rx="102" ry="6" fill="#000" opacity="0.35" />
        <g className="intro-van-brake">
          <g className="intro-van-bob">
            {/* headlight cone sweeping the road ahead */}
            <polygon className="intro-beam" points="203,45 348,16 348,86 203,61" fill="url(#intro-beamgrad)" />
            {/* body */}
            <rect x="2" y="14" width="200" height="64" rx="12" fill="url(#intro-vanbody)" stroke="#123a3a" strokeWidth="2.5" />
            <path d="M12 17 q90 -6 180 0" stroke="#8fe6d6" strokeWidth="2.4" fill="none" opacity="0.55" strokeLinecap="round" />
            {/* orange roof stripe + trim line */}
            <rect x="5" y="15.5" width="194" height="9" rx="4" fill="#f08a1d" stroke="#b85606" strokeWidth="1.2" />
            <rect x="4" y="46" width="197" height="5" fill="#f08a1d" stroke="#b85606" strokeWidth="1" />
            {/* green wave panel along the rocker */}
            <path
              d="M4 77 L4 68 Q20 60 36 68 T68 68 T100 68 T132 68 T160 68 L160 77 Z"
              fill="#7cc043"
              stroke="#4c8827"
              strokeWidth="1.5"
            />
            {/* windshield + door window */}
            <path d="M166 21 L172 44 L198 44 L198 27 Q198 21 190 21 Z" fill="url(#intro-glass)" stroke="#123a3a" strokeWidth="2" />
            <path d="M176 25 l6 15" stroke="#fff" strokeWidth="2" opacity="0.55" strokeLinecap="round" />
            <rect x="124" y="22" width="36" height="22" rx="3.5" fill="url(#intro-glass)" stroke="#123a3a" strokeWidth="2" />
            <path d="M131 25 l5 15" stroke="#fff" strokeWidth="1.8" opacity="0.5" strokeLinecap="round" />
            {/* door seam + handle */}
            <path d="M121 22 V66" stroke="#1d6a60" strokeWidth="1.6" opacity="0.8" />
            <rect x="146" y="49.5" width="9" height="2.6" rx="1.3" fill="#dce4ea" stroke="#5c6b7a" strokeWidth="0.7" />
            {/* side panel lettering */}
            <text x="62" y="34" textAnchor="middle" fontFamily='"Trebuchet MS", sans-serif' fontSize="11.5" fontWeight="bold" fill="#f08a1d" stroke="#8a3f04" strokeWidth="0.35" letterSpacing="0.4">
              THE MYSTERY
            </text>
            <text x="62" y="45" textAnchor="middle" fontFamily='"Trebuchet MS", sans-serif' fontSize="11.5" fontWeight="bold" fill="#f08a1d" stroke="#8a3f04" strokeWidth="0.35" letterSpacing="1.6">
              MACHINE
            </text>
            {/* flower-power decals */}
            {flower(23, 57, 0.9)}
            {flower(86, 70, 1)}
            {flower(112, 56, 0.72)}
            {/* roof rack */}
            <rect x="26" y="8" width="128" height="3.6" rx="1.8" fill="#cbd5df" stroke="#7a8794" strokeWidth="1" />
            <path d="M36 11.5 v4 M76 11.5 v4 M116 11.5 v4 M148 11.5 v4" stroke="#7a8794" strokeWidth="2" />
            {/* mirror */}
            <path d="M197 24 l7 -7" stroke="#123a3a" strokeWidth="2" />
            <rect x="202" y="12" width="5.5" height="8.5" rx="1.4" fill="#2f9c8c" stroke="#123a3a" strokeWidth="1.4" />
            {/* bumpers */}
            <rect x="-5" y="66" width="13" height="8.5" rx="3.5" fill="#f08a1d" stroke="#b85606" strokeWidth="1.4" />
            <rect x="196" y="66" width="13" height="8.5" rx="3.5" fill="#f08a1d" stroke="#b85606" strokeWidth="1.4" />
            {/* tail light + brake flash */}
            <rect x="0.5" y="55" width="4" height="6.5" rx="1.2" fill="#e04b3a" stroke="#8f2418" strokeWidth="0.8" />
            <circle className="intro-brakelight" cx="2.5" cy="58" r="7" fill="#ff5b45" opacity="0" />
            {/* headlight */}
            <circle cx="199" cy="52" r="7" fill="#ffe9a8" opacity="0.4" />
            <circle cx="199" cy="52" r="4.4" fill="#ffe9a8" stroke="#d9a520" strokeWidth="1.4" />
            {/* wheel wells + wheels */}
            {wheel(44)}
            {wheel(164)}
          </g>
        </g>
        {/* dust puff kicked up when it stops */}
        <g className="intro-dust" transform="translate(4 90)" fill="#cdbfa3">
          <circle cx="-4" cy="2" r="7" opacity="0.7" />
          <circle cx="-14" cy="-2" r="5" opacity="0.55" />
          <circle cx="6" cy="-3" r="4.5" opacity="0.5" />
        </g>
      </g>
    </g>
  )
}

function NightScene() {
  return (
    <svg viewBox="0 0 960 540" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="intro-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060d1e" />
          <stop offset="72%" stopColor="#0d2e38" />
          <stop offset="100%" stopColor="#175046" />
        </linearGradient>
        <radialGradient id="intro-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0ebc8" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#f0ebc8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#f0ebc8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="intro-tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#122736" />
          <stop offset="100%" stopColor="#0a1520" />
        </linearGradient>
        <linearGradient id="intro-vanbody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#55cdbb" />
          <stop offset="55%" stopColor="#3bb8a8" />
          <stop offset="100%" stopColor="#2c9384" />
        </linearGradient>
        <linearGradient id="intro-glass" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#c3e6f4" />
          <stop offset="100%" stopColor="#6fa5c4" />
        </linearGradient>
        <radialGradient id="intro-chrome" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#f2f6fa" />
          <stop offset="100%" stopColor="#93a3b2" />
        </radialGradient>
        <linearGradient id="intro-beamgrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffedb0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffedb0" stopOpacity="0" />
        </linearGradient>
        <filter id="intro-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
      </defs>

      {/* ---------- sky ---------- */}
      <rect x="0" y="0" width="960" height="540" fill="url(#intro-sky)" />
      {STARS.map(([x, y, r, d], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#f4f0d8" className="intro-twinkle" style={{ animationDelay: `${d}s` }} />
      ))}
      {/* moon + halo */}
      <circle cx="180" cy="104" r="105" fill="url(#intro-halo)" />
      <circle cx="180" cy="104" r="44" fill="#f2ecd7" />
      <g fill="#b9b092" opacity="0.28">
        <circle cx="166" cy="92" r="7" />
        <circle cx="196" cy="116" r="5" />
        <circle cx="178" cy="126" r="3.5" />
        <circle cx="200" cy="90" r="3" />
      </g>
      {/* drifting night cloud */}
      <g className="intro-cloud" fill="#0b1c2c" opacity="0.5">
        <rect x="90" y="70" width="190" height="12" rx="6" />
        <rect x="140" y="86" width="130" height="9" rx="4.5" />
      </g>

      {/* ---------- sea + headland ---------- */}
      <rect x="0" y="398" width="960" height="72" fill="#0c333a" />
      <path d="M0 398 H960" stroke="#1f5c55" strokeWidth="1.5" opacity="0.8" />
      <g stroke="#9fd8c6" strokeWidth="2" strokeLinecap="round" opacity="0.3">
        <path d="M140 412 h34 M168 424 h26 M150 438 h40 M180 452 h28" className="intro-twinkle" style={{ animationDelay: '0.8s' }} />
        <path d="M420 420 h22 M330 442 h26" opacity="0.5" />
      </g>
      {/* resort headland */}
      <path d="M590 468 Q610 434 660 436 H960 V468 Z" fill="#0d2622" />

      {/* ---------- the coastal road (bottom third) ---------- */}
      <rect x="0" y="468" width="960" height="72" fill="#141a23" />
      <path d="M0 468 H960" stroke="#2a3442" strokeWidth="2.5" />
      <path d="M0 505 H960" stroke="#cfc49a" strokeWidth="3" strokeDasharray="30 24" opacity="0.35" />

      {/* ---------- palm silhouettes ---------- */}
      <Palm x={64} y={452} s={1.5} sway="5.6s" />
      <Palm x={150} y={448} s={1.05} sway="6.4s" delay="1.2s" flip />
      <Palm x={300} y={450} s={1.3} sway="5.1s" delay="0.5s" />
      <Palm x={402} y={446} s={0.85} sway="6.8s" delay="2s" flip />
      <Palm x={628} y={444} s={1.15} sway="5.9s" delay="0.9s" flip />

      {/* ---------- GRAND PALM RESORT facade ---------- */}
      <g>
        {/* low entrance wing */}
        <rect x="636" y="330" width="130" height="138" fill="url(#intro-tower)" />
        <path d="M636 330 h130" stroke="#2f6b62" strokeWidth="2" opacity="0.5" />
        {/* stepped art-deco tower */}
        <rect x="756" y="200" width="188" height="268" fill="url(#intro-tower)" />
        <rect x="782" y="142" width="136" height="58" fill="url(#intro-tower)" />
        <rect x="812" y="92" width="76" height="50" fill="url(#intro-tower)" />
        <rect x="836" y="64" width="28" height="28" fill="url(#intro-tower)" />
        {/* moonlit left edges */}
        <path d="M756 468 V200 M782 200 V142 M812 142 V92 M836 92 V64" stroke="#3f7d70" strokeWidth="2" opacity="0.4" />
        {/* art-deco fluting */}
        <g stroke="#23444f" strokeWidth="2" opacity="0.5">
          <path d="M800 148 V196 M824 148 V196 M848 148 V196 M872 148 V196 M896 148 V196" />
          <path d="M826 98 V138 M850 98 V138 M874 98 V138" />
        </g>
        {/* dead beacon on the antenna, coughing occasionally */}
        <path d="M850 64 V34" stroke="#0a1520" strokeWidth="3" />
        <circle cx="850" cy="31" r="3.5" fill="#ff6a55" className="intro-beacon" />
        {/* neon sign */}
        <rect x="760" y="228" width="178" height="32" rx="5" fill="rgba(5,13,22,0.92)" stroke="#28404e" strokeWidth="1.5" />
        <g filter="url(#intro-glow)" opacity="0.8">
          <NeonSignRow />
        </g>
        <NeonSignRow />
        {/* tower windows — mostly dark, a few dimly lit, one flickering */}
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 6 }).map((_, c) => {
            const x = 772 + c * 27
            const y = 286 + r * 30
            const lit = (r === 1 && c === 4) || (r === 3 && c === 1) || (r === 0 && c === 2)
            const flicker = r === 4 && c === 3
            return (
              <rect
                key={`${r}-${c}`}
                x={x}
                y={y}
                width="11"
                height="15"
                rx="1.5"
                fill={lit || flicker ? '#f7cf7f' : '#0a1622'}
                opacity={lit ? 0.5 : flicker ? 0.6 : 1}
                className={flicker ? 'intro-winflicker' : undefined}
              />
            )
          })
        )}
        {/* upper-step windows */}
        <g fill="#0a1622">
          <rect x="802" y="156" width="13" height="20" rx="4" />
          <rect x="842" y="156" width="13" height="20" rx="4" />
          <rect x="882" y="156" width="13" height="20" rx="4" />
          <rect x="843" y="102" width="14" height="22" rx="5" />
        </g>
        {/* entrance canopy + doors (the lobby that flickers) */}
        <rect x="666" y="402" width="116" height="13" rx="4" fill="#0e2230" stroke="#2f6b62" strokeWidth="1.5" />
        <path d="M672 415 v6 M700 415 v6 M728 415 v6 M756 415 v6 M776 415 v6" stroke="#0e2230" strokeWidth="3" />
        <path d="M676 421 V468 M770 421 V468" stroke="#0a1826" strokeWidth="7" />
        <rect x="694" y="420" width="58" height="48" fill="#081018" stroke="#1c333f" strokeWidth="2" />
        <path d="M723 420 V468" stroke="#1c333f" strokeWidth="2" />
        <rect x="698" y="426" width="21" height="36" fill="#f2c56d" opacity="0.35" className="intro-winflicker" />
        <rect x="727" y="426" width="21" height="36" fill="#f2c56d" opacity="0.35" className="intro-winflicker" />
        <rect x="688" y="460" width="70" height="8" fill="#0c1c28" />
      </g>

      {/* ---------- chained front gate (nearest layer, roadside) ---------- */}
      <g>
        <rect x="700" y="436" width="15" height="62" fill="#0a1a24" />
        <rect x="696" y="430" width="23" height="8" rx="2" fill="#0a1a24" />
        <rect x="786" y="436" width="15" height="62" fill="#0a1a24" />
        <rect x="782" y="430" width="23" height="8" rx="2" fill="#0a1a24" />
        <g stroke="#0d222e" strokeWidth="3">
          <path d="M715 452 H786 M715 490 H786" />
          <path d="M724 452 V490 M736 452 V490 M748 452 V490 M760 452 V490 M772 452 V490" />
          <path d="M715 452 L750 490 M786 452 L750 490" strokeWidth="2.4" />
        </g>
        {/* sagging chain + padlock */}
        <path d="M722 464 Q750 482 779 464" stroke="#3c545f" strokeWidth="4.5" fill="none" strokeDasharray="5 3.5" strokeLinecap="round" />
        <path d="M747 473 v-3.5 a3.5 3.5 0 0 1 7 0 V473" stroke="#4a616c" strokeWidth="2.4" fill="none" />
        <rect x="744.5" y="473" width="12" height="10" rx="2" fill="#3c545f" stroke="#17242c" strokeWidth="1.4" />
      </g>

      {/* ---------- the Mystery Machine rolls in ---------- */}
      <MysteryMachine />
    </svg>
  )
}

function SpeakerLine({ who, note, children }: { who: string; note?: string; children: ReactNode }) {
  return (
    <p className="leading-snug">
      <span className="font-title text-lg tracking-wide text-amber-400">{who}</span>
      {note && <span className="ml-1.5 text-xs italic text-stone-500">({note})</span>}
      <span className="ml-2 text-stone-200">{children}</span>
    </p>
  )
}

export function IntroScreen({ onDone }: { onDone: () => void }) {
  const [beat, setBeat] = useState(0)

  const next = () => {
    if (beat >= 3) onDone()
    else setBeat(beat + 1)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // let focused buttons handle their own Enter/Space activation
      if (e.target instanceof HTMLElement && e.target.tagName === 'BUTTON') return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (beat >= 3) onDone()
        else setBeat(beat + 1)
      } else if (e.key === 'Escape') {
        onDone()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [beat, onDone])

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-[#04070f]">
      <style>{`
        @keyframes intro-drive { from { transform: translateX(-780px); } to { transform: translateX(0); } }
        .intro-van { animation: intro-drive 4s cubic-bezier(0.25, 0.7, 0.35, 1) both; }
        @keyframes intro-bob { from { transform: translateY(0); } to { transform: translateY(-2.5px); } }
        .intro-van-bob { animation: intro-bob 0.4s ease-in-out 10 alternate; }
        @keyframes intro-spin { to { transform: rotate(360deg); } }
        .intro-wheel { animation: intro-spin 0.5s linear 8; transform-box: fill-box; transform-origin: center; }
        @keyframes intro-brake {
          0% { transform: rotate(0deg); }
          35% { transform: rotate(1.8deg); }
          70% { transform: rotate(-0.7deg); }
          100% { transform: rotate(0deg); }
        }
        .intro-van-brake { animation: intro-brake 0.85s ease-out 3.9s both; transform-box: fill-box; transform-origin: 70% 100%; }
        @keyframes intro-dust {
          0% { opacity: 0; transform: translate(6px, 0) scale(0.4); }
          15% { opacity: 0.6; }
          100% { opacity: 0; transform: translate(-32px, -12px) scale(1.7); }
        }
        .intro-dust { animation: intro-dust 1.5s ease-out 3.95s both; transform-box: fill-box; transform-origin: center; }
        @keyframes intro-brakeflash { 0% { opacity: 0; } 30% { opacity: 0.8; } 100% { opacity: 0; } }
        .intro-brakelight { animation: intro-brakeflash 1s ease-out 3.85s both; }
        @keyframes intro-beampulse { from { opacity: 0.5; } to { opacity: 0.8; } }
        .intro-beam { animation: intro-beampulse 1.7s ease-in-out infinite alternate; }
        @keyframes intro-twinkle { 0%, 100% { opacity: 0.95; } 50% { opacity: 0.2; } }
        .intro-twinkle { animation: intro-twinkle 2.8s ease-in-out infinite; }
        @keyframes intro-sway { from { transform: rotate(-1.4deg); } to { transform: rotate(1.4deg); } }
        .intro-palm { animation: intro-sway 5.5s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 100%; }
        @keyframes intro-drift { from { transform: translateX(0); } to { transform: translateX(46px); } }
        .intro-cloud { animation: intro-drift 26s ease-in-out infinite alternate; }
        @keyframes intro-beaconblink { 0%, 86%, 100% { opacity: 0.08; } 90%, 95% { opacity: 0.75; } }
        .intro-beacon { animation: intro-beaconblink 5s linear infinite; }
        @keyframes intro-neon-f1 {
          0%, 6%, 10%, 46%, 55%, 81%, 86%, 100% { opacity: 1; }
          7%, 9% { opacity: 0.08; }
          47%, 54% { opacity: 0.15; }
          82%, 85% { opacity: 0.35; }
        }
        .intro-neon-f1 { animation: intro-neon-f1 2.3s steps(1, end) infinite; }
        @keyframes intro-neon-f2 {
          0%, 18%, 24%, 62%, 70%, 100% { opacity: 1; }
          19%, 23% { opacity: 0.1; }
          63%, 66% { opacity: 0.2; }
          67%, 69% { opacity: 0.55; }
        }
        .intro-neon-f2 { animation: intro-neon-f2 3.4s steps(1, end) infinite; }
        .intro-neon-f3 { animation: intro-neon-f1 2.8s steps(1, end) 0.6s infinite; }
        @keyframes intro-neon-dead {
          0%, 39%, 47%, 100% { opacity: 0.12; }
          40%, 42% { opacity: 0.45; }
          43%, 44% { opacity: 0.12; }
          45%, 46% { opacity: 0.4; }
        }
        .intro-neon-dead { animation: intro-neon-dead 4.2s steps(1, end) infinite; }
        @keyframes intro-winflicker {
          0%, 9%, 15%, 58%, 68%, 100% { opacity: 0.5; }
          10%, 14% { opacity: 0.04; }
          59%, 63% { opacity: 0.1; }
          64%, 67% { opacity: 0.42; }
        }
        .intro-winflicker { animation: intro-winflicker 5s steps(1, end) infinite; }
      `}</style>

      <NightScene />

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 42%, transparent 55%, rgba(0,0,0,0.55) 100%)' }}
      />

      {/* skip */}
      <button
        onClick={onDone}
        className="absolute right-4 top-4 rounded-md border border-stone-500/50 bg-black/40 px-3 py-1.5 text-sm text-stone-300 transition-colors hover:border-amber-300/60 hover:text-amber-200"
      >
        Skip intro ▸
      </button>

      {/* story card */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center p-4 sm:p-6">
        <div
          key={beat}
          onClick={next}
          className="kenney-panel msg-in w-full max-w-2xl cursor-pointer select-none p-5"
        >
          {beat === 0 && (
            <div>
              <h2 className="font-title text-2xl tracking-wider text-amber-400">THREE DAYS AGO...</h2>
              <div className="relative mx-auto mt-3 max-w-md -rotate-1 rounded-sm bg-[#f2e8cf] px-5 py-4 text-[#3a2f1d] shadow-[0_5px_16px_rgba(0,0,0,0.55)]">
                <span className="absolute -top-2 left-8 h-4 w-12 -rotate-3 rounded-sm bg-amber-200/70" />
                <span className="absolute -top-2 right-8 h-4 w-12 rotate-2 rounded-sm bg-amber-200/70" />
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: '"Bradley Hand", "Segoe Script", "Comic Sans MS", cursive' }}
                >
                  Dear Mystery Inc. — Before I decide the fate of my grandfather&rsquo;s resort, I need what
                  only you can deliver: the truth. Something haunts the Grand Palm. Catch it.
                </p>
                <p
                  className="mt-2 text-right text-sm"
                  style={{ fontFamily: '"Bradley Hand", "Segoe Script", "Comic Sans MS", cursive' }}
                >
                  — George Palm III
                </p>
              </div>
            </div>
          )}

          {beat === 1 && (
            <div className="space-y-2.5">
              <SpeakerLine who="Fred" note="driving">
                &ldquo;That&rsquo;s the place, gang — the Grand Palm. Paradise, gone spooky.&rdquo;
              </SpeakerLine>
              <SpeakerLine who="Daphne">
                &ldquo;Our client said he&rsquo;d meet us at the gate. So... where is he?&rdquo;
              </SpeakerLine>
            </div>
          )}

          {beat === 2 && (
            <div className="space-y-2.5">
              <SpeakerLine who="Velma">
                &ldquo;Jinkies — the lobby lights just flickered. Someone knows we&rsquo;re here.&rdquo;
              </SpeakerLine>
              <SpeakerLine who="Shaggy">
                &ldquo;Like, tell me that was the wind, Scoob.&rdquo;
              </SpeakerLine>
              <SpeakerLine who="Scooby">&ldquo;Ruh-roh.&rdquo;</SpeakerLine>
            </div>
          )}

          {beat === 3 && (
            <div>
              <p className="italic leading-relaxed text-stone-300">
                The gang steps inside. Behind them, unseen hands loop a heavy chain through the door
                handles...
              </p>
              <h1 className="mt-3 text-center font-title text-3xl leading-tight text-amber-400 sm:text-4xl">
                THE CURSE OF THE ABANDONED RESORT
              </h1>
              <div className="mt-5 flex justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDone()
                  }}
                  className="kenney-btn bg-amber-700/70 px-7 py-2.5 font-title text-xl tracking-wider text-amber-100"
                >
                  Begin the Mystery
                </button>
              </div>
            </div>
          )}

          {beat < 3 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i === beat ? 'bg-amber-400' : i < beat ? 'bg-amber-700' : 'bg-stone-600'
                    }`}
                  />
                ))}
                <span className="ml-2 text-xs text-stone-500">click or press Enter</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                className="kenney-btn px-4 py-1.5 text-sm font-bold text-stone-100"
              >
                Next ▸
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
