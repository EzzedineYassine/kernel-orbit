import { motion, useReducedMotion } from 'framer-motion'
import { SlideLayout } from '../../presentation/SlideLayout'

const NODES = [
  { x: 110, y: 120, r: 2.8, c: '#22D3EE', delay: 0.1 },
  { x: 240, y: 95, r: 2.2, c: '#858A98', delay: 0.25 },
  { x: 370, y: 155, r: 3.0, c: '#A78BFA', delay: 0.2 },
  { x: 165, y: 270, r: 2.5, c: '#22D3EE', delay: 0.35 },
  { x: 295, y: 315, r: 2.2, c: '#A78BFA', delay: 0.4 },
  { x: 135, y: 410, r: 2.6, c: '#22D3EE', delay: 0.5 },
  { x: 960, y: 110, r: 2.8, c: '#A78BFA', delay: 0.15 },
  { x: 1090, y: 175, r: 2.4, c: '#22D3EE', delay: 0.3 },
  { x: 870, y: 180, r: 2.2, c: '#858A98', delay: 0.35 },
  { x: 1030, y: 330, r: 3.1, c: '#A78BFA', delay: 0.25 },
  { x: 910, y: 415, r: 2.5, c: '#22D3EE', delay: 0.45 },
  { x: 1125, y: 445, r: 2.2, c: '#858A98', delay: 0.5 },
] as const

const EDGES: readonly [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [3, 5],
  [2, 4],
  [6, 7],
  [6, 8],
  [7, 9],
  [8, 9],
  [9, 10],
  [9, 11],
]

/** Slide 01 — Cinematic Opening */
export function Slide01Awakening() {
  const reduced = useReducedMotion()

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Restrained geometric / particle vector backdrop */}
      <svg
        viewBox="0 0 1280 720"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {/* Subtle orbital geometry centered behind title */}
        <motion.circle
          cx="640"
          cy="360"
          r="210"
          fill="none"
          stroke="#252834"
          strokeWidth="1"
          strokeDasharray="3 7"
          initial={reduced ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 0.75, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx="640"
          cy="360"
          r="300"
          fill="none"
          stroke="#252834"
          strokeWidth="0.75"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ duration: 1.1, delay: 0.15 }}
        />
        <line x1="640" y1="60" x2="640" y2="135" stroke="#252834" strokeWidth="1" />
        <line x1="640" y1="585" x2="640" y2="660" stroke="#252834" strokeWidth="1" />

        {/* Constellation edges */}
        {EDGES.map(([a, b], idx) => (
          <motion.line
            key={`${a}-${b}`}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="#252834"
            strokeWidth="1"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{ duration: 0.7, delay: 0.15 + idx * 0.04 }}
          />
        ))}

        {/* Coordinate particles */}
        {NODES.map((n, idx) => (
          <g key={idx}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={n.r * 3.2}
              fill={n.c}
              initial={reduced ? false : { opacity: 0 }}
              animate={reduced ? { opacity: 0.1 } : { opacity: [0.06, 0.18, 0.06] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: n.delay }}
            />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={n.c}
              initial={reduced ? false : { opacity: 0, scale: 0 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0.45, delay: n.delay }}
            />
          </g>
        ))}
      </svg>

      <SlideLayout>
        <div className="col-span-12 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-[2.4cqh] flex items-center gap-3 font-mono text-[clamp(10px,0.85cqw,12px)] tracking-[0.3em] text-[#858A98] uppercase"
          >
            <span className="h-px w-10 bg-[#A78BFA]" />
            <span>KERNEL / ORBIT · CHAPTER 01</span>
            <span className="h-px w-10 bg-[#22D3EE]" />
          </motion.div>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(38px,5.4cqw,80px)] leading-[0.98] font-bold tracking-[-0.03em] text-[#F5F5F7]"
          >
            MACHINES CAN{' '}
            <span className="text-[#A78BFA]">LEARN.</span>
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-[2.4cqh] font-sans text-[clamp(15px,1.5cqw,22px)] font-normal tracking-[-0.01em] text-[#858A98]"
          >
            Discover what customers will want next — inside the recommendation model.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.46 }}
            className="mt-[4.6cqh] flex items-center gap-5 rounded-sm border border-[#252834] bg-[#11131A]/80 px-5 py-2.5 font-mono text-[clamp(10px,0.82cqw,11.5px)] tracking-[0.15em] text-[#858A98]"
          >
            <span>
              PROJECT <span className="text-[#F5F5F7]">ORBIT</span>
            </span>
            <span className="h-3 w-px bg-[#252834]" />
            <span>
              MODEL <span className="text-[#22D3EE]">IMPLICIT ALS</span>
            </span>
            <span className="h-3 w-px bg-[#252834]" />
            <span>
              DATA <span className="text-[#A78BFA]">UCI RETAIL (541,909)</span>
            </span>
          </motion.div>
        </div>
      </SlideLayout>
    </div>
  )
}
