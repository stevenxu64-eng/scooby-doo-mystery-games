import { useEffect, useState, type ReactNode } from 'react'

/**
 * Cinematic intro cutscene: the Mystery Machine rolls up to the abandoned
 * Grand Palm Resort at night while a bottom story card steps through four
 * beats explaining why the gang is here. Fully self-contained (inline SVG +
 * scoped "intro-" keyframes). Scene art matches the repainted backdrop bar:
 * layered depth, gradient lighting with glow pools, dense set dressing,
 * cartoon shapes with dark outline accents, capped vignette.
 */

const STARS: [number, number, number, number][] = [
  [40, 40, 1.6, 0], [95, 150, 1.1, 0.7], [140, 28, 1.3, 1.4], [235, 60, 1.8, 0.3],
  [300, 130, 1.2, 2.1], [345, 36, 1.5, 1.1], [400, 90, 1.1, 0.5], [455, 48, 1.9, 1.8],
  [505, 140, 1.2, 0.9], [548, 24, 1.4, 2.4], [600, 82, 1.7, 0.2], [648, 150, 1.1, 1.6],
  [700, 44, 1.5, 0.8], [742, 108, 1.2, 2.2], [800, 30, 1.7, 1.2], [858, 70, 1.2, 0.4],
  [905, 140, 1.4, 1.9], [935, 42, 1.7, 0.6], [520, 200, 1.0, 1.3], [70, 230, 1.1, 2.6],
  [378, 178, 1.0, 3.1], [618, 218, 1.0, 1.9], [258, 214, 1.1, 0.9], [890, 208, 1.0, 2.8],
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

/** Detailed palm silhouette: curved ringed trunk + reusable fronds via <use>. */
function Palm({ x, y, s, sway, delay = '0s', flip = false }: {
  x: number; y: number; s: number; sway: string; delay?: string; flip?: boolean
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="intro-palm" style={{ animationDuration: sway, animationDelay: delay }}>
        {/* curved trunk with ring notches */}
        <path d="M-5 0 Q-10 -38 -4 -64 Q-1 -79 -8 -92 L3 -97 Q9 -80 5 -63 Q2 -38 9 0 Z" fill="#0a2029" />
        <path d="M-5 -26 q7 3 12 1 M-4 -46 q7 3 12 1 M-4 -66 q6 3 11 1" stroke="#061620" strokeWidth="1.6" fill="none" />
        {/* back frond crown (dark) */}
        <g fill="#0c2a38">
          <g transform="translate(-2 -94)">
            <use href="#intro-frond" transform="rotate(-98)" />
            <use href="#intro-frond" transform="rotate(-62)" />
            <use href="#intro-frond" transform="rotate(-28)" />
            <use href="#intro-frond" transform="rotate(6)" />
            <use href="#intro-frond" transform="rotate(44) scale(0.92)" />
            <use href="#intro-frond" transform="rotate(80) scale(0.8)" />
          </g>
        </g>
        {/* moonlit front fronds */}
        <g fill="#15455a" opacity="0.9">
          <g transform="translate(-2 -94)">
            <use href="#intro-frond" transform="rotate(-44) scale(0.82)" />
            <use href="#intro-frond" transform="rotate(22) scale(0.76)" />
          </g>
        </g>
        {/* coconuts */}
        <circle cx="0" cy="-92" r="3.6" fill="#061821" />
        <circle cx="7" cy="-89" r="3" fill="#061821" />
      </g>
    </g>
  )
}

/** The showpiece: side view of the Mystery Machine, facing right. */
function MysteryMachine() {
  const wheel = (cx: number) => (
    <g>
      <circle cx={cx} cy={84} r={19} fill="#0c1622" />
      <circle cx={cx} cy={84} r={15.5} fill="#2b3440" stroke="#0f151d" strokeWidth="3" />
      <circle cx={cx} cy={84} r={8.6} fill="url(#intro-chrome)" stroke="#5c6b7a" strokeWidth="1.2" />
      <g className="intro-wheel" stroke="#5c6b7a" strokeWidth="1.6">
        <line x1={cx - 7} y1={84} x2={cx + 7} y2={84} />
        <line x1={cx - 3.5} y1={84 - 6.1} x2={cx + 3.5} y2={84 + 6.1} />
        <line x1={cx - 3.5} y1={84 + 6.1} x2={cx + 3.5} y2={84 - 6.1} />
        <circle cx={cx + 5} cy={84} r={1.2} fill="#5c6b7a" stroke="none" />
        <circle cx={cx - 5} cy={84} r={1.2} fill="#5c6b7a" stroke="none" />
      </g>
      <circle cx={cx} cy={84} r={2.4} fill="#39434f" />
      {/* static specular arc so the chrome reads even mid-spin */}
      <path d={`M${cx - 6} ${84 - 5.5} a8.6 8.6 0 0 1 7.5 -3`} stroke="#eef6fb" strokeWidth="1.3" fill="none" opacity="0.75" />
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
        {/* soft ground shadow rides along but does not bounce */}
        <ellipse cx="102" cy="99" rx="106" ry="7.5" fill="url(#intro-vshadow)" />
        <g className="intro-van-brake">
          <g className="intro-van-bob">
            {/* headlight cone sweeping the road ahead */}
            <polygon className="intro-beam" points="203,45 348,16 348,86 203,61" fill="url(#intro-beamgrad)" />
            {/* body */}
            <rect x="2" y="14" width="200" height="64" rx="12" fill="url(#intro-vanbody)" stroke="#123a3a" strokeWidth="2.5" />
            {/* two-tone lower band */}
            <path d="M4 51 H201 V64 Q201 77 189 77 H15 Q4 77 4 64 Z" fill="#1f7f74" />
            <path d="M12 17 q90 -6 180 0" stroke="#a9f0e2" strokeWidth="2.4" fill="none" opacity="0.6" strokeLinecap="round" />
            {/* moonlight reflection streak across the panel */}
            <path d="M172 20 L150 74" stroke="#c9f4ea" strokeWidth="9" opacity="0.14" strokeLinecap="round" />
            <path d="M182 22 L164 68" stroke="#c9f4ea" strokeWidth="3.5" opacity="0.18" strokeLinecap="round" />
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
            {/* wheel wells */}
            <path d="M25 78 a19 19 0 0 1 38 0 Z" fill="#0b161e" />
            <path d="M145 78 a19 19 0 0 1 38 0 Z" fill="#0b161e" />
            {/* windshield + door window */}
            <path d="M166 21 L172 44 L198 44 L198 27 Q198 21 190 21 Z" fill="url(#intro-glass)" stroke="#123a3a" strokeWidth="2" />
            <path d="M176 25 l6 15" stroke="#fff" strokeWidth="2" opacity="0.55" strokeLinecap="round" />
            <rect x="124" y="22" width="36" height="22" rx="3.5" fill="url(#intro-glass)" stroke="#123a3a" strokeWidth="2" />
            <path d="M131 25 l5 15" stroke="#fff" strokeWidth="1.8" opacity="0.5" strokeLinecap="round" />
            {/* door seams + handle */}
            <path d="M121 22 V66" stroke="#1d6a60" strokeWidth="1.6" opacity="0.8" />
            <path d="M162 46 V66" stroke="#1d6a60" strokeWidth="1.4" opacity="0.7" />
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
            {/* roof rack + strapped duffel bag */}
            <rect x="26" y="8" width="128" height="3.6" rx="1.8" fill="#cbd5df" stroke="#7a8794" strokeWidth="1" />
            <path d="M36 11.5 v4 M76 11.5 v4 M116 11.5 v4 M148 11.5 v4" stroke="#7a8794" strokeWidth="2" />
            <rect x="58" y="-2.5" width="46" height="10.5" rx="5" fill="#a8763c" stroke="#6e4a20" strokeWidth="1.3" />
            <path d="M70 -2.5 v10.5 M92 -2.5 v10.5" stroke="#6e4a20" strokeWidth="1.6" />
            <path d="M76 -2.5 q5 -5 10 0" stroke="#6e4a20" strokeWidth="1.6" fill="none" />
            {/* orange fender arcs with dark outline */}
            <path d="M23.5 78 A20.5 20.5 0 0 1 64.5 78" fill="none" stroke="#b85606" strokeWidth="6" />
            <path d="M23.5 78 A20.5 20.5 0 0 1 64.5 78" fill="none" stroke="#f08a1d" strokeWidth="3.4" />
            <path d="M143.5 78 A20.5 20.5 0 0 1 184.5 78" fill="none" stroke="#b85606" strokeWidth="6" />
            <path d="M143.5 78 A20.5 20.5 0 0 1 184.5 78" fill="none" stroke="#f08a1d" strokeWidth="3.4" />
            {/* mirror */}
            <path d="M197 24 l7 -7" stroke="#123a3a" strokeWidth="2" />
            <rect x="202" y="12" width="5.5" height="8.5" rx="1.4" fill="#2f9c8c" stroke="#123a3a" strokeWidth="1.4" />
            {/* chrome bumpers with specular highlights */}
            <rect x="-5" y="66" width="13" height="8.5" rx="3.5" fill="url(#intro-chrome)" stroke="#5c6b7a" strokeWidth="1.3" />
            <rect x="196" y="66" width="13" height="8.5" rx="3.5" fill="url(#intro-chrome)" stroke="#5c6b7a" strokeWidth="1.3" />
            <path d="M-3 67.6 h7 M198 67.6 h7" stroke="#fff" strokeWidth="1.3" opacity="0.85" strokeLinecap="round" />
            {/* tail light + amber reflector + brake flash */}
            <rect x="0.5" y="55" width="4" height="6.5" rx="1.2" fill="#e04b3a" stroke="#8f2418" strokeWidth="0.8" />
            <rect x="0.5" y="63.5" width="4" height="3.6" rx="1" fill="#e0942e" stroke="#8a5210" strokeWidth="0.7" />
            <circle className="intro-brakelight" cx="2.5" cy="58" r="7" fill="#ff5b45" opacity="0" />
            {/* mud flap behind the rear wheel */}
            <rect x="16.5" y="76" width="7" height="15" rx="2" fill="#101820" stroke="#060b10" strokeWidth="1" />
            {/* headlight: glass + radial glow */}
            <circle cx="199" cy="52" r="13" fill="url(#intro-headglow)" />
            <circle cx="199" cy="52" r="7" fill="#ffe9a8" opacity="0.4" />
            <circle cx="199" cy="52" r="4.4" fill="#fff3cd" stroke="#d9a520" strokeWidth="1.4" />
            <path d="M196.4 50.4 a4.4 4.4 0 0 1 3.4 -2" stroke="#fff" strokeWidth="1.1" fill="none" opacity="0.8" />
            {/* wheels */}
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
          <stop offset="0%" stopColor="#0a1128" />
          <stop offset="40%" stopColor="#123650" />
          <stop offset="70%" stopColor="#175a54" />
          <stop offset="100%" stopColor="#1e6a5b" />
        </linearGradient>
        <linearGradient id="intro-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#17595a" />
          <stop offset="50%" stopColor="#10404a" />
          <stop offset="100%" stopColor="#0b2a36" />
        </linearGradient>
        <linearGradient id="intro-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#313c50" />
          <stop offset="55%" stopColor="#222b3c" />
          <stop offset="100%" stopColor="#141a26" />
        </linearGradient>
        <radialGradient id="intro-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0ebc8" stopOpacity="0.32" />
          <stop offset="60%" stopColor="#f0ebc8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#f0ebc8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="intro-moonsurf" cx="42%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#fbfdf2" />
          <stop offset="100%" stopColor="#d9e1ec" />
        </radialGradient>
        <linearGradient id="intro-tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d4254" />
          <stop offset="100%" stopColor="#0f2533" />
        </linearGradient>
        <linearGradient id="intro-vanbody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5fd6c4" />
          <stop offset="55%" stopColor="#3fbcac" />
          <stop offset="100%" stopColor="#27897b" />
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
        <radialGradient id="intro-headglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="intro-vshadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="intro-canopy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffcf7e" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffcf7e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="intro-neonhalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7df2dc" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7df2dc" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="intro-heat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#cfe9ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#cfe9ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="intro-shoot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#eef2fa" stopOpacity="0" />
          <stop offset="100%" stopColor="#eef2fa" stopOpacity="0.9" />
        </linearGradient>
        <filter id="intro-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
        <filter id="intro-glow2" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        {/* reusable flora */}
        <path id="intro-frond" d="M0 0 Q23 -17 54 -13 Q32 -9 23 -5 Q40 -7 59 1 Q33 1 22 2.5 Q10 2.5 0 0 Z" />
        <path id="intro-monst" d="M0 0 Q-5 -26 11 -43 Q8 -28 14 -25 Q17 -46 33 -52 Q26 -34 31 -30 Q41 -44 56 -42 Q45 -29 46 -24 Q59 -26 65 -15 Q51 -12 49 -7 Q56 -2 55 4 Q42 2 27 4 Q10 5 0 0 Z" />
        <g id="intro-fern" fill="none" stroke="#14503a" strokeWidth="2.5" strokeLinecap="round">
          <path d="M0 0 Q5 -25 2 -48 M1.5 -9 l-8 -5 M2 -10 l7 -6 M2.5 -19 l-7.5 -4.5 M3 -20 l6.5 -5.5 M3 -29 l-6.5 -4 M3.5 -30 l5.5 -5 M3 -38 l-5 -3.5 M3.5 -39 l4.5 -4" />
        </g>
      </defs>

      {/* ---------- sky ---------- */}
      <rect x="0" y="0" width="960" height="540" fill="url(#intro-sky)" />
      {/* distant heat lightning over the sea horizon */}
      <ellipse cx="120" cy="400" rx="150" ry="44" fill="url(#intro-heat)" className="intro-heatlight" />
      {STARS.map(([x, y, r, d], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#f4f0d8" className="intro-twinkle" style={{ animationDelay: `${d}s` }} />
      ))}
      {/* cross-sparkles on the brightest stars */}
      <g stroke="#f4f0d8" strokeWidth="1.2" opacity="0.85" fill="none">
        <path d="M235 50 v20 M225 60 h20" className="intro-twinkle" style={{ animationDelay: '0.3s' }} />
        <path d="M455 39 v18 M446 48 h18" className="intro-twinkle" style={{ animationDelay: '1.8s' }} />
        <path d="M700 36 v16 M692 44 h16" className="intro-twinkle" style={{ animationDelay: '0.8s' }} />
      </g>
      {/* shooting star */}
      <path d="M556 58 L668 92 L666 97 L554 62 Z" fill="url(#intro-shoot)" />
      <circle cx="666" cy="94" r="2.4" fill="#fff" />
      {/* moon: layered halo + cratered surface */}
      <circle cx="180" cy="104" r="108" fill="url(#intro-halo)" />
      <circle cx="180" cy="104" r="70" fill="url(#intro-halo)" opacity="0.9" />
      <circle cx="180" cy="104" r="44" fill="url(#intro-moonsurf)" />
      <g fill="#c9d1e0">
        <circle cx="165" cy="92" r="9" />
        <circle cx="196" cy="116" r="6.5" />
        <circle cx="184" cy="84" r="4" />
        <circle cx="162" cy="118" r="5" />
        <circle cx="201" cy="94" r="3" />
        <circle cx="178" cy="104" r="2.6" />
      </g>
      <g fill="#b4bfd2" opacity="0.7">
        <circle cx="167" cy="94" r="5.5" />
        <circle cx="198" cy="118" r="4" />
        <circle cx="164" cy="120" r="3" />
      </g>
      {/* drifting clouds */}
      <g className="intro-cloud" style={{ animationDuration: '30s' }} fill="#0a1a33" opacity="0.7">
        <path d="M250 168 q52 -20 118 -8 q46 8 96 0 q-40 26 -120 18 q-64 -2 -94 -10 Z" />
      </g>
      <g className="intro-cloud" style={{ animationDuration: '34s', animationDelay: '-5s' }} fill="#0a1a33" opacity="0.3">
        <path d="M136 138 q34 -8 78 -3 q-26 12 -78 7 Z" />
      </g>
      <g className="intro-cloud" style={{ animationDuration: '22s', animationDelay: '-8s' }} fill="#0a1a33" opacity="0.55">
        <path d="M520 132 q44 -14 96 -4 q-30 20 -96 12 Z" />
      </g>
      <g className="intro-cloud" style={{ animationDuration: '26s', animationDelay: '-15s' }} fill="#0a1a33" opacity="0.6">
        <path d="M640 60 q48 -14 104 -2 q-34 20 -104 10 Z" />
      </g>

      {/* ---------- moonlit sea ---------- */}
      <rect x="0" y="398" width="960" height="70" fill="url(#intro-sea)" />
      <path d="M0 398 H960" stroke="#2f7a6c" strokeWidth="2" opacity="0.8" />
      {/* moonlight lane glints */}
      <g stroke="#a9e6d2" strokeLinecap="round" fill="none">
        <path d="M150 406 h44" strokeWidth="2.5" opacity="0.5" className="intro-twinkle" style={{ animationDelay: '0.4s' }} />
        <path d="M132 416 h30 M186 419 h22" strokeWidth="2" opacity="0.4" className="intro-twinkle" style={{ animationDelay: '1.5s' }} />
        <path d="M148 430 h52 M120 442 h24" strokeWidth="2.5" opacity="0.35" className="intro-twinkle" style={{ animationDelay: '2.3s' }} />
        <path d="M172 452 h40 M226 436 h18" strokeWidth="2" opacity="0.3" className="intro-twinkle" style={{ animationDelay: '0.9s' }} />
      </g>
      <g stroke="#5fae9c" strokeWidth="1.8" strokeLinecap="round" opacity="0.35" fill="none">
        <path d="M330 424 h24 M420 440 h28 M300 452 h20 M500 430 h22 M96 448 h16" />
      </g>
      {/* distant pier with a lonely lamp */}
      <g fill="#0a232e">
        <rect x="16" y="406" width="146" height="4" rx="1.5" />
        <path d="M24 410 v9 M48 410 v8 M72 410 v8 M96 410 v7 M120 410 v7 M144 410 v6" stroke="#0a232e" strokeWidth="3" />
        <rect x="140" y="396" width="18" height="10" rx="2" />
        <path d="M140 396 l9 -6 9 6 z" />
      </g>
      <circle cx="146" cy="401" r="1.6" fill="#ffd98a" opacity="0.8" />
      {/* bell buoy with blinking light */}
      <path d="M243 434 l5 -12 5 12 q-5 3 -10 0 z" fill="#0d2833" />
      <circle cx="248" cy="419" r="2" fill="#ff6a55" className="intro-beacon" style={{ animationDelay: '2.6s' }} />
      <path d="M239 436 h18" stroke="#0d2833" strokeWidth="2" opacity="0.7" />
      {/* resort headland */}
      <path d="M584 468 Q606 428 662 430 H960 V468 Z" fill="#123a33" />
      <path d="M584 468 Q606 428 662 430 H760" stroke="#1e5f52" strokeWidth="2" fill="none" opacity="0.6" />

      {/* ---------- the coastal road (bottom third) ---------- */}
      <rect x="0" y="468" width="960" height="72" fill="url(#intro-road)" />
      <path d="M0 468 H960" stroke="#3a4658" strokeWidth="2.5" />
      {/* curb toward the resort */}
      <rect x="592" y="462" width="368" height="7" rx="2" fill="#3a4859" />
      <path d="M594 463 H958" stroke="#54687c" strokeWidth="1.5" />
      {/* cracked driveway up to the gate */}
      <path d="M688 468 H812 L846 540 H656 Z" fill="#242e3c" />
      <path d="M688 468 L656 540 M812 468 L846 540" stroke="#333f50" strokeWidth="2.5" />
      <path d="M726 486 l14 10 -6 14 M768 476 q10 14 4 30 M700 512 l22 8" stroke="#141b26" strokeWidth="2.5" fill="none" />
      <path d="M736 512 q3 -8 6 0 M792 500 q3 -8 6 0 M712 496 q2.5 -7 5.5 0" stroke="#2a5c40" strokeWidth="2.5" fill="none" />
      {/* worn center dashes */}
      <path d="M0 506 H960" stroke="#d8cd9e" strokeWidth="3.5" strokeDasharray="30 26" opacity="0.4" />
      <path d="M14 506 H960" stroke="#12161f" strokeWidth="4" strokeDasharray="7 165" opacity="0.8" />
      {/* asphalt cracks + roadside gravel */}
      <path d="M120 522 q30 6 52 -2 M540 514 l28 8 M880 512 q18 10 36 6" stroke="#10151f" strokeWidth="2" fill="none" opacity="0.8" />
      <g fill="#4d5a6e" opacity="0.8">
        <circle cx="36" cy="476" r="1.4" /><circle cx="88" cy="481" r="1.2" /><circle cx="150" cy="474" r="1.5" />
        <circle cx="222" cy="480" r="1.2" /><circle cx="286" cy="475" r="1.4" /><circle cx="352" cy="482" r="1.2" />
        <circle cx="420" cy="476" r="1.5" /><circle cx="470" cy="483" r="1.2" /><circle cx="534" cy="477" r="1.4" />
        <circle cx="120" cy="530" r="1.6" /><circle cx="320" cy="534" r="1.4" /><circle cx="520" cy="531" r="1.5" />
        <circle cx="880" cy="532" r="1.5" /><circle cx="920" cy="524" r="1.3" />
      </g>
      <path d="M60 468 q3 -9 6 0 M240 468 q3 -9 6 0 M430 468 q3 -9 6 0 M560 468 q3 -8 6 0" stroke="#1d5a44" strokeWidth="3" fill="none" />

      {/* ---------- palm silhouettes ---------- */}
      <Palm x={58} y={466} s={1.15} sway="5.6s" />
      <Palm x={148} y={463} s={0.8} sway="6.4s" delay="1.2s" flip />
      <Palm x={298} y={464} s={1.0} sway="5.1s" delay="0.5s" />
      <Palm x={404} y={460} s={0.66} sway="6.8s" delay="2s" flip />
      <Palm x={560} y={462} s={0.88} sway="6.2s" delay="1.6s" />
      <Palm x={630} y={460} s={1.05} sway="5.9s" delay="0.9s" flip />

      {/* ---------- GRAND PALM RESORT facade ---------- */}
      <g>
        {/* low entrance wing + parapet cap */}
        <rect x="636" y="330" width="130" height="138" fill="url(#intro-tower)" />
        <rect x="631" y="324" width="140" height="9" rx="2" fill="#2c5a6c" />
        <path d="M631 325 h140" stroke="#4d9485" strokeWidth="1.5" opacity="0.6" />
        <path d="M636 333 V468" stroke="#3f7d70" strokeWidth="2" opacity="0.45" />
        <g fill="#0d2130">
          <rect x="648" y="348" width="22" height="28" rx="2" />
          <rect x="682" y="348" width="22" height="28" rx="2" />
          <rect x="716" y="348" width="22" height="28" rx="2" />
        </g>
        <path d="M650 350 l16 20 M684 350 l16 20 M718 350 l16 20" stroke="#7ca8b8" strokeWidth="1.2" opacity="0.25" />
        {/* stepped art-deco tower */}
        <rect x="756" y="200" width="188" height="268" fill="url(#intro-tower)" />
        <rect x="782" y="142" width="136" height="58" fill="url(#intro-tower)" />
        <rect x="812" y="92" width="76" height="50" fill="url(#intro-tower)" />
        <rect x="836" y="64" width="28" height="28" fill="url(#intro-tower)" />
        {/* cornice bands at each setback */}
        <g fill="#2c5a6c">
          <rect x="750" y="194" width="200" height="8" rx="2" />
          <rect x="777" y="136" width="146" height="8" rx="2" />
          <rect x="807" y="86" width="86" height="8" rx="2" />
          <rect x="832" y="58" width="36" height="8" rx="2" />
        </g>
        <path d="M750 195 h200 M777 137 h146 M807 87 h86 M832 59 h36" stroke="#4d9485" strokeWidth="1.5" opacity="0.55" />
        {/* moonlit left edges */}
        <path d="M756 468 V202 M782 194 V144 M812 136 V94 M836 86 V66" stroke="#4d9485" strokeWidth="2" opacity="0.45" />
        {/* art-deco fluting */}
        <g stroke="#2a4d5e" strokeWidth="2" opacity="0.7">
          <path d="M800 150 V194 M824 150 V194 M848 150 V194 M872 150 V194 M896 150 V194" />
          <path d="M826 100 V136 M850 100 V136 M874 100 V136" />
        </g>
        {/* upper-step windows */}
        <g fill="#0d2130">
          <rect x="802" y="156" width="13" height="20" rx="4" />
          <rect x="842" y="156" width="13" height="20" rx="4" />
          <rect x="882" y="156" width="13" height="20" rx="4" />
          <rect x="843" y="102" width="14" height="22" rx="5" />
        </g>
        {/* dead beacon on the antenna, coughing occasionally */}
        <path d="M850 64 V34" stroke="#0d2130" strokeWidth="3" />
        <circle cx="850" cy="31" r="3.5" fill="#ff6a55" className="intro-beacon" />
        {/* neon sign: buzzing halo, brackets, twin tube-glow layers */}
        <ellipse cx="850" cy="244" rx="112" ry="30" fill="url(#intro-neonhalo)" className="intro-buzz" />
        <path d="M778 228 v-8 M922 228 v-8" stroke="#28404e" strokeWidth="4" />
        <rect x="760" y="228" width="178" height="32" rx="5" fill="#071520" stroke="#2c5a6c" strokeWidth="1.5" />
        <rect x="764" y="231.5" width="170" height="25" rx="3.5" fill="none" stroke="#173442" strokeWidth="1.2" />
        <g filter="url(#intro-glow2)" opacity="0.55">
          <NeonSignRow />
        </g>
        <g filter="url(#intro-glow)" opacity="0.85">
          <NeonSignRow />
        </g>
        <NeonSignRow />
        {/* decorative band above the window grid */}
        <rect x="756" y="268" width="188" height="5" fill="#234b5c" />
        {/* tower windows — mostly dark, two warmly lit, one flickering */}
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 6 }).map((_, c) => {
            const x = 772 + c * 27
            const y = 286 + r * 30
            const lit = (r === 1 && c === 4) || (r === 3 && c === 1)
            const flicker = r === 4 && c === 3
            return (
              <rect
                key={`${r}-${c}`}
                x={x}
                y={y}
                width="11"
                height="15"
                rx="1.5"
                fill={lit || flicker ? '#ffd98a' : '#0c1e2c'}
                opacity={lit ? 0.55 : flicker ? 0.6 : 1}
                className={flicker ? 'intro-winflicker' : undefined}
              />
            )
          })
        )}
        <path d="M773 288 l8 11 M854 348 l8 11 M800 408 l8 11" stroke="#7ca8b8" strokeWidth="1.2" opacity="0.3" />
        {/* tower base course */}
        <rect x="756" y="452" width="188" height="16" fill="#0d2331" />
        <path d="M756 453 h188" stroke="#2a4d5e" strokeWidth="1.5" />
        {/* porte-cochere: canopy slab, warm underglow, columns */}
        <ellipse cx="723" cy="430" rx="58" ry="22" fill="url(#intro-canopy)" opacity="0.6" />
        <path d="M676 394 L692 374 M770 394 L754 374" stroke="#16333f" strokeWidth="3" />
        <rect x="656" y="392" width="134" height="9" rx="2" fill="#1d4254" />
        <path d="M656 393 h134" stroke="#4d9485" strokeWidth="1.5" opacity="0.6" />
        <rect x="656" y="401" width="134" height="7" fill="#0e2230" />
        <path d="M660 408 v5 M688 408 v5 M716 408 v5 M744 408 v5 M772 408 v5 M786 408 v5" stroke="#0e2230" strokeWidth="3" />
        <g>
          <rect x="666" y="408" width="10" height="56" fill="#1c3a49" />
          <rect x="770" y="408" width="10" height="56" fill="#1c3a49" />
          <path d="M667.5 410 V462 M771.5 410 V462" stroke="#3f7d70" strokeWidth="1.5" opacity="0.5" />
          <rect x="664" y="408" width="14" height="4" rx="1" fill="#254c5c" />
          <rect x="768" y="408" width="14" height="4" rx="1" fill="#254c5c" />
          <rect x="663" y="462" width="16" height="6" rx="1" fill="#14303c" />
          <rect x="767" y="462" width="16" height="6" rx="1" fill="#14303c" />
        </g>
        {/* lobby doors (the lights that flicker) + entry steps */}
        <rect x="694" y="418" width="58" height="50" fill="#081018" stroke="#1c333f" strokeWidth="2" />
        <path d="M723 418 V468" stroke="#1c333f" strokeWidth="2" />
        <rect x="698" y="424" width="21" height="38" fill="#f2c56d" opacity="0.35" className="intro-winflicker" />
        <rect x="727" y="424" width="21" height="38" fill="#f2c56d" opacity="0.35" className="intro-winflicker" />
        <path d="M712 442 h5 M729 442 h5" stroke="#3a2c14" strokeWidth="2" />
        <rect x="688" y="462" width="70" height="4" fill="#243745" />
        <rect x="684" y="466" width="78" height="3" fill="#1a2a36" />
        {/* overgrown planters flanking the drive */}
        <g>
          <rect x="630" y="472" width="44" height="22" rx="3" fill="#33414f" />
          <path d="M632 474 h40" stroke="#4a5c6e" strokeWidth="2" />
          <ellipse cx="644" cy="470" rx="16" ry="9" fill="#16452e" />
          <ellipse cx="662" cy="468" rx="13" ry="8" fill="#1e5a3c" />
          <path d="M640 464 q-3 -9 3 -14 M660 462 q1 -8 8 -11" stroke="#1e5a3c" strokeWidth="2" fill="none" />
          <rect x="826" y="472" width="44" height="22" rx="3" fill="#33414f" />
          <path d="M828 474 h40" stroke="#4a5c6e" strokeWidth="2" />
          <ellipse cx="840" cy="469" rx="15" ry="9" fill="#16452e" />
          <ellipse cx="858" cy="467" rx="13" ry="8" fill="#1e5a3c" />
          <path d="M838 462 q-2 -9 4 -13 M860 460 q2 -8 8 -10" stroke="#1e5a3c" strokeWidth="2" fill="none" />
        </g>
      </g>

      {/* ---------- chained front gate (nearest layer, roadside) ---------- */}
      <g>
        <rect x="700" y="436" width="15" height="62" fill="#122b38" />
        <rect x="696" y="430" width="23" height="8" rx="2" fill="#122b38" />
        <path d="M700 430 l7.5 -7 7.5 7 z" fill="#183848" />
        <rect x="786" y="436" width="15" height="62" fill="#122b38" />
        <rect x="782" y="430" width="23" height="8" rx="2" fill="#122b38" />
        <path d="M786 430 l7.5 -7 7.5 7 z" fill="#183848" />
        <path d="M701 436 V496 M787 436 V496" stroke="#3f7d70" strokeWidth="1.5" opacity="0.4" />
        <g stroke="#16333f" strokeWidth="3">
          <path d="M715 452 H786 M715 490 H786" />
          <path d="M724 446 V490 M736 446 V490 M748 446 V490 M760 446 V490 M772 446 V490" />
          <path d="M715 452 L750 490 M786 452 L750 490" strokeWidth="2.4" />
        </g>
        <g fill="#183848">
          <circle cx="724" cy="445" r="2.2" /><circle cx="736" cy="445" r="2.2" /><circle cx="748" cy="445" r="2.2" />
          <circle cx="760" cy="445" r="2.2" /><circle cx="772" cy="445" r="2.2" />
        </g>
        {/* sagging chain + padlock with glint */}
        <path d="M722 464 Q750 482 779 464" stroke="#46606c" strokeWidth="4.5" fill="none" strokeDasharray="5 3.5" strokeLinecap="round" />
        <path d="M747 473 v-3.5 a3.5 3.5 0 0 1 7 0 V473" stroke="#5a747e" strokeWidth="2.4" fill="none" />
        <rect x="744.5" y="473" width="12" height="10" rx="2" fill="#46606c" stroke="#17242c" strokeWidth="1.4" />
        <circle cx="750.5" cy="477.5" r="1.5" fill="#17242c" />
        <path d="M755 470.5 l1.8 3.9 3.9 1.8 -3.9 1.8 -1.8 3.9 -1.8 -3.9 -3.9 -1.8 3.9 -1.8 z" fill="#fff" opacity="0.9" />
      </g>

      {/* ---------- the Mystery Machine rolls in ---------- */}
      <MysteryMachine />

      {/* ---------- foreground flora framing the corners ---------- */}
      <g className="intro-fgsway" style={{ animationDelay: '0.8s' }}>
        <g fill="#12382a">
          <use href="#intro-monst" transform="translate(936 552) scale(1.7)" />
          <use href="#intro-monst" transform="translate(968 556) scale(-1.5 1.5) rotate(-8)" />
        </g>
        <g fill="#0c2a1f">
          <use href="#intro-monst" transform="translate(896 556) scale(1.25) rotate(8)" />
        </g>
        <use href="#intro-fern" transform="translate(864 550) rotate(-12) scale(1.3)" />
        <use href="#intro-fern" transform="translate(950 554) rotate(10) scale(1.5)" />
      </g>
      <g className="intro-fgsway" style={{ animationDelay: '2s', animationDuration: '7.5s' }}>
        <use href="#intro-fern" transform="translate(16 552) rotate(8) scale(1.2)" />
        <use href="#intro-fern" transform="translate(30 556) rotate(-14) scale(0.9)" />
      </g>
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
        @keyframes intro-fgsway { from { transform: rotate(-1deg); } to { transform: rotate(1deg); } }
        .intro-fgsway { animation: intro-fgsway 6.5s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 60% 100%; }
        @keyframes intro-drift { from { transform: translateX(0); } to { transform: translateX(46px); } }
        .intro-cloud { animation: intro-drift 26s ease-in-out infinite alternate; }
        @keyframes intro-beaconblink { 0%, 86%, 100% { opacity: 0.08; } 90%, 95% { opacity: 0.75; } }
        .intro-beacon { animation: intro-beaconblink 5s linear infinite; }
        @keyframes intro-heatflash { 0%, 87%, 100% { opacity: 0; } 89% { opacity: 0.55; } 91% { opacity: 0.12; } 93% { opacity: 0.4; } 96% { opacity: 0; } }
        .intro-heatlight { animation: intro-heatflash 12s linear infinite; }
        @keyframes intro-buzz {
          0%, 100% { opacity: 0.32; }
          10% { opacity: 0.22; }
          14% { opacity: 0.34; }
          38% { opacity: 0.24; }
          42% { opacity: 0.35; }
          66% { opacity: 0.26; }
          72% { opacity: 0.33; }
        }
        .intro-buzz { animation: intro-buzz 1.4s steps(2, end) infinite; }
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

      {/* vignette (capped) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 42%, transparent 58%, rgba(0,0,0,0.4) 100%)' }}
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
              <div className="relative mx-auto mt-3 max-w-lg -rotate-1 rounded-sm bg-[#f2e8cf] px-6 py-4 text-[#3a2f1d] shadow-[0_5px_16px_rgba(0,0,0,0.55)]">
                <span className="absolute -top-2 left-8 h-4 w-12 -rotate-3 rounded-sm bg-amber-200/70" />
                <span className="absolute -top-2 right-8 h-4 w-12 rotate-2 rounded-sm bg-amber-200/70" />
                {/* faint fold crease */}
                <span className="pointer-events-none absolute inset-x-4 top-[54%] h-px bg-[#b9a87f]/35" />
                {/* letterhead row: postmark + stamp live HERE, never over the words */}
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.2em] text-[#8a7a55]">GRAND PALM POST · JUL 3</span>
                  <span className="flex h-9 w-8 rotate-3 items-center justify-center rounded-[2px] border border-dashed border-[#a8926a]/80 bg-[#e6d9ae] text-[13px]">
                    🌴
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: '"Bradley Hand", "Segoe Script", "Comic Sans MS", cursive' }}
                >
                  Dear Mystery Inc. —
                </p>
                <p
                  className="mt-1.5 text-sm leading-relaxed"
                  style={{ fontFamily: '"Bradley Hand", "Segoe Script", "Comic Sans MS", cursive' }}
                >
                  My grandfather built the Grand Palm in 1969 — &ldquo;a paradise for my family,
                  forever.&rdquo; I came home this month to reopen it. That same week, the
                  &ldquo;Phantom Guest&rdquo; began his performances: wailing in the walls, glowing
                  footprints around the drained pool, every buyer scared off by midnight.
                </p>
                <p
                  className="mt-1.5 text-sm leading-relaxed"
                  style={{ fontFamily: '"Bradley Hand", "Segoe Script", "Comic Sans MS", cursive' }}
                >
                  Our caretaker insists I sell. The bank insists I decide by Friday. Before I sign
                  away my family&rsquo;s name, I need what only you can deliver: the truth.
                  Something haunts the Grand Palm. Catch it.
                </p>
                <p
                  className="mt-2 text-right text-sm"
                  style={{ fontFamily: '"Bradley Hand", "Segoe Script", "Comic Sans MS", cursive' }}
                >
                  — George Palm III
                </p>
                <p
                  className="mt-1.5 text-[12.5px] leading-snug text-[#5c4c30]"
                  style={{ fontFamily: '"Bradley Hand", "Segoe Script", "Comic Sans MS", cursive' }}
                >
                  P.S. — Ask for me at the gate. If I&rsquo;m not there to meet you... start worrying.
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
