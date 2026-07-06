import type { ReactElement, ReactNode } from 'react'

/**
 * Hand-drawn inventory icons, one per item id in src/data/items.ts.
 * Each icon is a 48x48 inline SVG tuned to read at 40px on a dark
 * (#292524) inventory slot: bold silhouette, dark outline, one gradient
 * of shading and a small specular highlight. Gradient ids are prefixed
 * with the item id so many icons can coexist on one page.
 */

const OUTLINE = '#241a10'

function Frame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" className={className ?? 'h-full w-full'}>
      <g strokeLinecap="round" strokeLinejoin="round">{children}</g>
    </svg>
  )
}

/** Two-stop linear gradient (default: soft top-left light). */
function Grad({ id, from, to, x2 = 0.3, y2 = 1 }: { id: string; from: string; to: string; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  )
}

/** Soft radial halo behind glowing props. */
function Glow({ id, color, opacity = 0.5 }: { id: string; color: string; opacity?: number }) {
  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity={opacity} />
          <stop offset="70%" stopColor={color} stopOpacity={opacity * 0.4} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill={`url(#${id})`} />
    </>
  )
}

/** Four-point glint. */
function Sparkle({ cx, cy, r, fill = '#fff' }: { cx: number; cy: number; r: number; fill?: string }) {
  const d = `M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r} Z`
  return <path d={d} fill={fill} />
}

/** Outlined rope/tube: dark understroke with a colored stroke on top. */
function Tube({ d, w, color }: { d: string; w: number; color: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={OUTLINE} strokeWidth={w + 2.6} />
      <path d={d} fill="none" stroke={color} strokeWidth={w} />
    </>
  )
}

/** Gnarled branch shared by `stick` and `sticky_stick` (prefix keeps ids unique). */
function StickBody({ prefix }: { prefix: string }) {
  const wood = `url(#${prefix}-wood)`
  return (
    <>
      <defs>
        <Grad id={`${prefix}-wood`} from="#b5854a" to="#71501f" x2={1} />
      </defs>
      {/* side twig */}
      <path d="M22 21 Q16 15 16.5 8.5 Q21 13 24.5 16.5 Z" fill={wood} stroke={OUTLINE} strokeWidth="1.8" />
      {/* gnarled main branch with a kink in the middle */}
      <path d="M7 43 Q4 41 6.5 38 L16.5 27 Q18.5 25 17.8 22.5 L17 19 Q20 20.5 22.2 18.2 L32.5 7.5 Q35.5 4.5 38.5 7 Q41.5 9.5 38.8 12.5 L28.5 23.5 Q26.5 25.5 27.5 28 L28.4 30.5 Q25 29.5 22.8 31.8 L12.5 42.8 Q9.8 45.5 7 43 Z" fill={wood} stroke={OUTLINE} strokeWidth="2" />
      {/* bark texture + knot */}
      <path d="M10.5 39 l5 -5.5 M14 41 l4.5 -5 M23.5 26.5 l3.5 -3.5 M30 14.5 l4.5 -4.5 M33.5 15.5 l3 -3" stroke="#5c3d14" strokeWidth="1.3" fill="none" />
      <circle cx="20" cy="21.5" r="1.4" fill="#5c3d14" />
      {/* highlight */}
      <path d="M9 40.5 l6 -6.5 M25 20.5 l6.5 -7" stroke="#e2b877" strokeWidth="1.4" opacity="0.8" fill="none" />
    </>
  )
}

function FlashlightArt() {
  return (
    <>
      <defs>
        <Grad id="flashlight-body" from="#fde047" to="#ca8a04" x2={0} />
        <linearGradient id="flashlight-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform="rotate(-45 24 24)">
        {/* beam cone + rays */}
        <path d="M29 18.5 L46 13 L46 35 L29 29.5 Z" fill="url(#flashlight-beam)" />
        <path d="M47 19.5 l3.5 -1.5 M48.5 24 l4.5 0 M47 28.5 l3.5 1.5" stroke="#fde047" strokeWidth="1.8" fill="none" />
        {/* tail cap + handle */}
        <rect x="1" y="19.5" width="5" height="9" rx="2" fill="#a16207" stroke={OUTLINE} strokeWidth="1.8" />
        <rect x="5" y="20.5" width="14" height="7" rx="1.5" fill="url(#flashlight-body)" stroke={OUTLINE} strokeWidth="1.8" />
        <path d="M9 20.5 v7 M13 20.5 v7" stroke="#a16207" strokeWidth="1.4" />
        {/* flared head + lens */}
        <path d="M19 20.5 L27 16 L27 32 L19 27.5 Z" fill="url(#flashlight-body)" stroke={OUTLINE} strokeWidth="1.8" />
        <rect x="26" y="15" width="3.5" height="18" rx="1.6" fill="#854d0e" stroke={OUTLINE} strokeWidth="1.8" />
        <ellipse cx="29.4" cy="24" rx="1.8" ry="7.4" fill="#fefce8" stroke={OUTLINE} strokeWidth="1.5" />
        <path d="M7 22.3 h9" stroke="#fff" strokeWidth="1.6" opacity="0.7" />
      </g>
    </>
  )
}

function ChewingGumArt() {
  return (
    <>
      <defs>
        <Grad id="chewing_gum-pack" from="#f9a8d4" to="#ec4899" x2={0.4} />
      </defs>
      <g transform="rotate(-10 22 22)">
        {/* stick of gum poking out of the pack */}
        <rect x="12" y="6" width="9" height="10" rx="1" fill="#fbcfe8" stroke={OUTLINE} strokeWidth="1.6" />
        <path d="M13.5 8.5 h6 M13.5 11.5 h6" stroke="#f472b6" strokeWidth="1.2" />
        {/* pack with wrapper band */}
        <rect x="8" y="12" width="20" height="26" rx="2.5" fill="url(#chewing_gum-pack)" stroke={OUTLINE} strokeWidth="2" />
        <rect x="8" y="20" width="20" height="9" fill="#fdf2f8" stroke={OUTLINE} strokeWidth="1.4" />
        <text x="18" y="26.6" textAnchor="middle" fontFamily="Trebuchet MS" fontWeight="bold" fontSize="6" fill="#db2777">GUM</text>
        <path d="M10.5 15 v20" stroke="#fff" strokeWidth="1.5" opacity="0.5" />
      </g>
      {/* one chewed blob */}
      <path d="M31.5 31.5 Q30.5 27.5 34 27 Q35.5 24.5 38.5 26 Q42 25.5 42 29 Q45 31 43 33.8 Q43.5 37.5 39.8 37.4 Q37.5 40 34.8 38 Q30.8 38.4 31.5 31.5 Z" fill="#f472b6" stroke={OUTLINE} strokeWidth="1.8" />
      <circle cx="34.4" cy="29.8" r="1.4" fill="#fff" opacity="0.6" />
    </>
  )
}

function StickyStickArt() {
  return (
    <>
      <defs>
        <Grad id="sticky_stick-gum" from="#f9a8d4" to="#ec4899" x2={0.4} />
      </defs>
      <StickBody prefix="sticky_stick" />
      {/* gum wad mashed on the tip */}
      <path d="M32.5 7.5 Q31 3.5 35 3 Q36.5 0.8 39 2.6 Q42.8 1.8 42.8 5.2 Q45.6 7.2 43.2 9.6 Q43.6 12.8 40 12.4 Q37.4 14.8 35.2 12.2 Q31.8 12.4 32.5 7.5 Z" fill="url(#sticky_stick-gum)" stroke={OUTLINE} strokeWidth="1.8" />
      <circle cx="35.6" cy="5.4" r="1.3" fill="#fff" opacity="0.6" />
      <Sparkle cx={44.5} cy={13.5} r={1.9} />
      <Sparkle cx={30} cy={3.2} r={1.4} />
    </>
  )
}

function ScoobySnackArt() {
  return (
    <>
      <defs>
        <Grad id="scooby_snack-dough" from="#e0a34e" to="#a86a24" />
      </defs>
      <Glow id="scooby_snack-glow" color="#fbbf24" opacity={0.35} />
      {/* cookie with a bite out of the upper right */}
      <path d="M34.6 17.5 A13 13 0 1 0 36.95 26.1 Q31.8 24.8 33.4 21.6 Q30.6 19.4 34.6 17.5 Z" fill="url(#scooby_snack-dough)" stroke={OUTLINE} strokeWidth="2.2" />
      {/* baked speckles */}
      <g fill="#7c4a15">
        <circle cx="18" cy="20" r="1.2" />
        <circle cx="24" cy="30" r="1.3" />
        <circle cx="16.5" cy="28" r="1" />
        <circle cx="27" cy="17.5" r="1" />
        <circle cx="30" cy="30" r="1" />
      </g>
      {/* crumbs by the bite */}
      <g fill="#c98d3e">
        <circle cx="40" cy="19.5" r="1.1" />
        <circle cx="42.5" cy="24" r="0.8" />
        <circle cx="39.5" cy="28.5" r="0.9" />
      </g>
      <path d="M14.5 18.5 Q17 13.8 22 12.8" stroke="#f6d18b" strokeWidth="2" fill="none" opacity="0.9" />
    </>
  )
}

function JanitorKeyArt() {
  return (
    <>
      <defs>
        <Grad id="janitor_key-brass" from="#d9b356" to="#8a6a1e" />
      </defs>
      <g transform="rotate(18 24 26)">
        {/* tag on a ring */}
        <rect x="7" y="4.5" width="10" height="11" rx="1.8" fill="#ece1c8" stroke={OUTLINE} strokeWidth="1.6" />
        <text x="12" y="13.6" textAnchor="middle" fontFamily="Trebuchet MS" fontWeight="bold" fontSize="6" fill="#8a6a3c">M</text>
        <circle cx="14.8" cy="7.2" r="1.1" fill={OUTLINE} />
        <circle cx="17.5" cy="9" r="3.2" fill="none" stroke={OUTLINE} strokeWidth="3.2" />
        <circle cx="17.5" cy="9" r="3.2" fill="none" stroke="#c9a84c" strokeWidth="1.6" />
        {/* oval bow with hole */}
        <ellipse cx="24.5" cy="15.5" rx="6.5" ry="5.8" fill="url(#janitor_key-brass)" stroke={OUTLINE} strokeWidth="2" />
        <ellipse cx="24.5" cy="15.5" rx="2.6" ry="2.3" fill={OUTLINE} />
        {/* shaft + teeth */}
        <rect x="22.9" y="21" width="3.2" height="19" rx="1" fill="url(#janitor_key-brass)" stroke={OUTLINE} strokeWidth="1.8" />
        <rect x="26" y="32.5" width="4.4" height="3" fill="#b8923a" stroke={OUTLINE} strokeWidth="1.6" />
        <rect x="26" y="37" width="6" height="3" fill="#b8923a" stroke={OUTLINE} strokeWidth="1.6" />
        {/* worn scratches + shine */}
        <path d="M26.5 24 l-2.4 1.5 M26.8 29 l-2.6 1.6" stroke="#8a6a1e" strokeWidth="1" fill="none" />
        <path d="M20.5 12.2 q3 -2 6 -0.8" stroke="#f0d68a" strokeWidth="1.4" fill="none" opacity="0.85" />
      </g>
    </>
  )
}

function GlowingPaintArt() {
  return (
    <>
      <defs>
        <Grad id="glowing_paint-tin" from="#b8c0c8" to="#6b7280" x2={1} y2={0.2} />
        <Grad id="glowing_paint-pool" from="#86efac" to="#22c55e" x2={0} />
      </defs>
      <Glow id="glowing_paint-glow" color="#4ade80" opacity={0.5} />
      {/* wire handle */}
      <path d="M12.8 18.5 Q8.5 26 13.6 33.5" fill="none" stroke="#4b5563" strokeWidth="1.8" />
      {/* tin body + label */}
      <path d="M13 17 L14.5 40 Q14.6 42 24 42 Q33.4 42 33.5 40 L35 17 Z" fill="url(#glowing_paint-tin)" stroke={OUTLINE} strokeWidth="2" />
      <path d="M13.6 24 L34.4 24 L33.9 33 L14.1 33 Z" fill="#e7e0cf" stroke={OUTLINE} strokeWidth="1.4" />
      <path d="M17 27 h8 M17 30 h11" stroke="#8a8272" strokeWidth="1.4" />
      <circle cx="29.5" cy="28.5" r="2.2" fill="#4ade80" stroke="#166534" strokeWidth="1" />
      {/* rim + glowing paint pool */}
      <ellipse cx="24" cy="17" rx="11" ry="3.6" fill="#9aa3ad" stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx="24" cy="17" rx="8.6" ry="2.5" fill="url(#glowing_paint-pool)" stroke="#166534" strokeWidth="1.2" />
      {/* drip over the rim, down the side */}
      <path d="M31.6 17.8 Q33 18.4 33.2 19.5 L33.8 26 Q33.9 28 32.6 28 Q31.3 28 31.4 26 L31 20.5 Q30.9 18.6 31.6 17.8 Z" fill="#4ade80" stroke="#166534" strokeWidth="1.2" />
      <path d="M16.8 20.5 L17.8 37" stroke="#fff" strokeWidth="1.6" opacity="0.45" />
      <Sparkle cx={37} cy={9.5} r={1.7} fill="#86efac" />
      <Sparkle cx={11} cy={8.5} r={1.3} fill="#86efac" />
    </>
  )
}

function RopeArt() {
  const loop = (cy: number) => `M9 ${cy} A15 6.5 0 1 0 39 ${cy} A15 6.5 0 1 0 9 ${cy}`
  return (
    <>
      {/* three stacked loops, back to front */}
      <Tube d={loop(19)} w={4.5} color="#d3a968" />
      <Tube d={loop(24)} w={4.5} color="#d3a968" />
      <Tube d={loop(29)} w={4.5} color="#d3a968" />
      {/* loose end slipping out of the coil */}
      <Tube d="M37 27.5 Q44 30.5 43 40" w={4.5} color="#c69a55" />
      <path d="M43 40 l-2 3 M43 40 l0.5 3.4 M43 40 l2.6 2.2" stroke="#8a6a3c" strokeWidth="1.6" fill="none" />
      {/* strand hatching */}
      <path d="M16 15.2 l1.2 -2.6 M22 13.8 l0.8 -2.7 M29 14 l-0.8 -2.7 M34.5 15.8 l1.4 -2.5 M9.6 21.8 l-2.8 0.9 M9.6 26.8 l-2.8 0.9 M15 33.2 l-1.5 2.4 M21 34.8 l-0.8 2.7 M28 34.9 l0.8 2.7 M34 33.4 l1.5 2.4" stroke="#8a6a3c" strokeWidth="1.3" fill="none" />
      <path d="M13 15.6 q10 -3.6 21 -0.6" stroke="#ecd0a0" strokeWidth="1.6" fill="none" opacity="0.8" />
    </>
  )
}

function OldBrochureArt() {
  return (
    <>
      <defs>
        <Grad id="old_brochure-paper" from="#f7ecca" to="#d9c08c" x2={0.2} />
      </defs>
      {/* fanned back panels */}
      <g transform="rotate(-14 24 30)">
        <rect x="10" y="8" width="17" height="30" rx="1.5" fill="#e0cfa2" stroke={OUTLINE} strokeWidth="1.8" />
      </g>
      <g transform="rotate(-6 24 30)">
        <rect x="13" y="7" width="17" height="31" rx="1.5" fill="#eeddb0" stroke={OUTLINE} strokeWidth="1.8" />
      </g>
      {/* front panel, 1969 grand-opening print */}
      <g transform="rotate(3 24 30)">
        <rect x="17" y="7.5" width="18" height="32" rx="1.5" fill="url(#old_brochure-paper)" stroke={OUTLINE} strokeWidth="2" />
        {/* sun */}
        <circle cx="30" cy="13.5" r="2.6" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        <path d="M30 9.4 v-1.6 M33.2 11 l1.2 -1.2 M34.4 13.5 h1.7 M26.8 11 l-1.2 -1.2" stroke="#f59e0b" strokeWidth="1.2" fill="none" />
        {/* palm tree */}
        <path d="M23.5 27.5 Q24.6 22 23.2 18" stroke="#8a5a2a" strokeWidth="2" fill="none" />
        <path d="M23.2 18 Q19 16 17.6 18.2 Q20.8 18.4 23.2 18 M23.2 18 Q21 14 18.4 13.8 Q21.8 13 23.8 16.4 M23.2 18 Q25.2 13.6 28.2 14.2 Q25.6 15.2 23.9 17.9 M23.2 18 Q27.2 16.6 28.8 18.7 Q25.6 19 23.2 18 Z" fill="#3f9142" stroke="#2c6e31" strokeWidth="0.8" />
        <text x="30" y="25.4" textAnchor="middle" fontFamily="Trebuchet MS" fontWeight="bold" fontSize="4.6" fill="#b45309">1969</text>
        {/* pool squiggle + copy lines */}
        <path d="M20 29 q2 -1.2 4 0 q2 1.2 4 0" stroke="#60a5fa" strokeWidth="1.3" fill="none" />
        <path d="M20 32.5 h12 M20 35 h12 M20 37.4 h8" stroke="#a08c5a" strokeWidth="1.2" />
        <path d="M19 9.5 l4 3" stroke="#fff" strokeWidth="1.4" opacity="0.6" />
      </g>
    </>
  )
}

function MuddyGloveArt() {
  return (
    <>
      <defs>
        <Grad id="muddy_glove-cloth" from="#fdfaf2" to="#d8d2c2" />
      </defs>
      {/* dress glove, fingers up */}
      <path d="M15.5 36 L15.5 22 Q15.5 13 17.6 13 Q19.7 13 19.7 21.5 Q19.7 9 21.9 9 Q24.1 9 24.1 21.5 Q24.1 7.5 26.3 7.5 Q28.5 7.5 28.5 21.5 Q28.5 10.5 30.6 10.5 Q32.7 10.5 32.7 22 L32.7 24.5 Q35.4 20.8 37.4 22.8 Q39.2 24.7 35.9 28.3 L32.7 31.8 L32.7 36 Z" fill="url(#muddy_glove-cloth)" stroke={OUTLINE} strokeWidth="2" />
      <path d="M19.7 22 v6 M24.1 22 v7 M28.5 22 v6.5" stroke="#b8b09c" strokeWidth="1.2" />
      {/* cuff with button + monogram */}
      <rect x="14" y="35" width="20" height="7" rx="2" fill="#e9e2d2" stroke={OUTLINE} strokeWidth="2" />
      <circle cx="30.5" cy="38.5" r="1.3" fill="#c9b98a" stroke={OUTLINE} strokeWidth="1" />
      <text x="21.5" y="40.4" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold" fontSize="4.6" fill="#4a5d8a">A.C.</text>
      {/* pool-muck splatter */}
      <path d="M16.5 26 Q15 23.5 17.5 23 Q18 21 20 22 Q22.5 21.5 22 24 Q23.5 25.5 21.5 26.8 Q21 29 18.8 28 Q16.5 28.6 16.5 26 Z" fill="#7c5a33" />
      <path d="M27 15 Q26 12.8 28 12.5 Q29.5 11 30.5 13 Q32.5 13.5 31.3 15.4 Q31.5 17.4 29.4 16.8 Q27.4 17.4 27 15 Z" fill="#8a6a3c" />
      <path d="M18.5 28 q0.5 2.4 -0.3 3.8" stroke="#7c5a33" strokeWidth="1.2" fill="none" />
      <circle cx="24" cy="32" r="1.6" fill="#7c5a33" />
      <circle cx="30" cy="27" r="1.2" fill="#8a6a3c" />
      <circle cx="19" cy="17" r="1.1" fill="#7c5a33" />
    </>
  )
}

function OfficeKeyArt() {
  return (
    <>
      <defs>
        <Grad id="office_key-gold" from="#fcd34d" to="#b45309" />
      </defs>
      <g transform="rotate(-22 24 24)">
        {/* round bow with turned ring */}
        <circle cx="24" cy="11.5" r="6.2" fill="url(#office_key-gold)" stroke={OUTLINE} strokeWidth="2" />
        <circle cx="24" cy="11.5" r="4.3" fill="none" stroke="#b45309" strokeWidth="1.2" />
        <circle cx="24" cy="11.5" r="2.4" fill={OUTLINE} />
        {/* collar, slim shaft, refined teeth */}
        <rect x="21.9" y="17.2" width="4.2" height="2.2" rx="0.8" fill="#d99a2b" stroke={OUTLINE} strokeWidth="1.4" />
        <rect x="22.6" y="19" width="2.8" height="17" rx="1.2" fill="url(#office_key-gold)" stroke={OUTLINE} strokeWidth="1.8" />
        <rect x="25.4" y="29.5" width="3.4" height="2.4" rx="0.7" fill="#d99a2b" stroke={OUTLINE} strokeWidth="1.4" />
        <rect x="25.4" y="33.8" width="4.8" height="2.6" rx="0.7" fill="#d99a2b" stroke={OUTLINE} strokeWidth="1.4" />
        <path d="M23.3 20.5 v13" stroke="#fde68a" strokeWidth="1" opacity="0.8" />
        <path d="M20.5 8.5 q1.6 -1.8 4 -1.8" stroke="#fff" strokeWidth="1.4" fill="none" opacity="0.7" />
      </g>
      <Sparkle cx={32.5} cy={7} r={2} />
    </>
  )
}

function BoxCutterArt() {
  return (
    <>
      <defs>
        <Grad id="box_cutter-body" from="#f87171" to="#b91c1c" x2={0.2} />
        <Grad id="box_cutter-steel" from="#e5e7eb" to="#9ca3af" />
      </defs>
      <g transform="rotate(-20 24 24)">
        {/* extended snap-off blade */}
        <path d="M28 19.5 L39.5 19.5 L44 28 L28 28 Z" fill="url(#box_cutter-steel)" stroke={OUTLINE} strokeWidth="1.8" />
        <path d="M33 20 l-1 7.5 M36.5 20 l-1 7.5" stroke="#9ca3af" strokeWidth="1" fill="none" />
        {/* red handle */}
        <rect x="3" y="19.5" width="27" height="11" rx="3" fill="url(#box_cutter-body)" stroke={OUTLINE} strokeWidth="2" />
        <path d="M8 22.2 H24" stroke="#7f1d1d" strokeWidth="1.6" />
        {/* thumb slider */}
        <rect x="10" y="19" width="6.5" height="5" rx="1.2" fill="#fca5a5" stroke={OUTLINE} strokeWidth="1.6" />
        <path d="M11.8 20.2 v2.6 M13.4 20.2 v2.6 M15 20.2 v2.6" stroke="#b91c1c" strokeWidth="0.9" fill="none" />
        {/* grip + lanyard hole + shine */}
        <path d="M18.5 26.5 l2.5 1.8 M22 26.5 l2.5 1.8" stroke="#7f1d1d" strokeWidth="1.4" fill="none" />
        <circle cx="6.5" cy="26.8" r="1.3" fill="none" stroke="#7f1d1d" strokeWidth="1.2" />
        <path d="M6 21.2 h19" stroke="#fff" strokeWidth="1.3" opacity="0.5" />
      </g>
    </>
  )
}

function DeedDraftArt() {
  return (
    <>
      <defs>
        <Grad id="deed_draft-paper" from="#fbf3d9" to="#ddc794" x2={0.2} />
      </defs>
      <g transform="rotate(4 24 24)">
        <rect x="11" y="5.5" width="26" height="36" rx="1.8" fill="url(#deed_draft-paper)" stroke={OUTLINE} strokeWidth="2" />
        {/* tri-fold creases */}
        <path d="M11.4 17 h25.2 M11.4 29 h25.2" stroke="#b49b62" strokeWidth="1.1" />
        {/* heading + legal scribbles */}
        <path d="M15.5 10 h13" stroke="#6b5a34" strokeWidth="2" />
        <path d="M15.5 13.2 h17" stroke="#a08c5a" strokeWidth="1.2" />
        <path d="M15.5 20.5 h17 M15.5 23.3 h17 M15.5 26 h12 M15.5 32.5 h13 M15.5 35.2 h9" stroke="#a08c5a" strokeWidth="1.2" />
        {/* signature squiggle */}
        <path d="M15.5 38.5 q2 -1.6 4 0 q1.5 1.2 3.5 -0.5" stroke="#6b5a34" strokeWidth="1.1" fill="none" />
        <path d="M14 7.5 l5 2.4" stroke="#fff" strokeWidth="1.3" opacity="0.55" />
      </g>
      {/* red wax seal in the corner */}
      <path d="M35 30.8 Q39 30.2 40.6 33.4 Q43 35.6 40.9 38.6 Q40.6 42 36.9 42.4 Q33.4 44 31.2 41 Q28.4 39.6 29.6 36.2 Q29.8 32 35 30.8 Z" fill="#c02626" stroke={OUTLINE} strokeWidth="1.8" />
      <circle cx="35" cy="36.7" r="3.4" fill="none" stroke="#7f1d1d" strokeWidth="1.4" />
      <circle cx="35" cy="36.7" r="1.1" fill="#7f1d1d" />
      <path d="M31.8 33 q1.4 -1.2 3 -1.2" stroke="#ef7d7d" strokeWidth="1.2" fill="none" />
    </>
  )
}

function VoiceMegaphoneArt() {
  return (
    <>
      <defs>
        <Grad id="voice_megaphone-shell" from="#8da3bb" to="#4c5f74" />
      </defs>
      <Glow id="voice_megaphone-glow" color="#4ade80" opacity={0.4} />
      <g transform="rotate(-8 24 24)">
        {/* pistol grip (behind the cone) */}
        <path d="M13.5 29 h5.5 L18.2 39 Q18 40.5 16.3 40.5 H15 Q13.2 40.5 13.2 39 Z" fill="#3f4e5f" stroke={OUTLINE} strokeWidth="1.8" />
        {/* cone + bell */}
        <path d="M9.5 21.5 L28.5 12.5 L28.5 35.5 L9.5 26.5 Z" fill="url(#voice_megaphone-shell)" stroke={OUTLINE} strokeWidth="2" />
        <ellipse cx="28.5" cy="24" rx="3.2" ry="11.5" fill="#31404f" stroke={OUTLINE} strokeWidth="1.8" />
        <ellipse cx="28.5" cy="24" rx="1.6" ry="9" fill="#1d2833" />
        {/* rigged reed mouthpiece */}
        <rect x="6" y="20.5" width="4.5" height="7" rx="2" fill="#3f4e5f" stroke={OUTLINE} strokeWidth="1.8" />
        <path d="M18 17.5 L18 30.5" stroke="#31404f" strokeWidth="1.8" />
        <path d="M12 22.5 L26 16" stroke="#c6d4e2" strokeWidth="1.6" opacity="0.8" />
        {/* phantom-green warble */}
        <path d="M33.5 19 q3.2 5 0 10" fill="none" stroke="#4ade80" strokeWidth="2" />
        <path d="M37 15.5 q4.8 8.5 0 17" fill="none" stroke="#4ade80" strokeWidth="2" opacity="0.85" />
        <path d="M40.5 12 q6.5 12 0 24" fill="none" stroke="#4ade80" strokeWidth="2" opacity="0.65" />
      </g>
      <Sparkle cx={35} cy={8} r={1.5} fill="#86efac" />
    </>
  )
}

const ART: Record<string, () => ReactElement> = {
  flashlight: FlashlightArt,
  stick: () => <StickBody prefix="stick" />,
  chewing_gum: ChewingGumArt,
  sticky_stick: StickyStickArt,
  scooby_snack: ScoobySnackArt,
  janitor_key: JanitorKeyArt,
  glowing_paint: GlowingPaintArt,
  rope: RopeArt,
  old_brochure: OldBrochureArt,
  muddy_glove: MuddyGloveArt,
  office_key: OfficeKeyArt,
  box_cutter: BoxCutterArt,
  deed_draft: DeedDraftArt,
  voice_megaphone: VoiceMegaphoneArt,
}

/**
 * Hand-drawn icon for a known inventory item id, or null so the caller
 * can fall back to the item's lucide icon.
 */
export function ItemIcon({ id, className }: { id: string; className?: string }): ReactElement | null {
  const Art = ART[id]
  if (!Art) return null
  return (
    <Frame className={className}>
      <Art />
    </Frame>
  )
}
