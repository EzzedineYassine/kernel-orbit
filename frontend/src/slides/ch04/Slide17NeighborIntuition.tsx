import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 17 — The Intuition Behind Nearest Neighbors */
export function Slide17NeighborIntuition() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.4cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 04 · THE CORE INTUITION"
              title={
                <>
                  Proximity implies <span className="text-[#22D3EE]">similarity.</span>
                </>
              }
              subtitle="Objects close together in feature space tend to share the same underlying label."
            />

            <blockquote className="rounded-sm border-l-2 border-[#A78BFA] bg-[#11131A]/85 px-4 py-3.5 font-display text-[clamp(14px,1.3cqw,19px)] leading-snug text-[#F5F5F7]">
              “Show me your <span className="text-[#22D3EE]">K closest neighbors</span>, and I will infer who you are.”
            </blockquote>

            <div className="flex flex-col gap-2 font-mono text-[clamp(10px,0.84cqw,12px)] text-[#858A98]">
              <div className="flex items-center justify-between rounded-sm border border-[#252834] bg-[#11131A]/70 px-3.5 py-2">
                <span>LOCAL NEIGHBORHOOD (K = 5)</span>
                <span className="text-[#A78BFA]">4 Versicolor · 1 Virginica</span>
              </div>
              <div className="flex items-center justify-between rounded-sm border border-[#252834] bg-[#11131A]/70 px-3.5 py-2">
                <span>MAJORITY VOTE OUTCOME</span>
                <span className="text-[#22D3EE]">Iris versicolor (80%)</span>
              </div>
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 04.B"
            title="2D LOCAL NEIGHBORHOOD VOTE"
            meta="K = 5 · UNIFORM WEIGHTS"
            caption="Only training observations inside the K-neighbor boundary cast a vote; distant points have zero influence."
            className="h-full"
          >
            <svg viewBox="0 0 560 350" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              <line x1="44" y1="310" x2="532" y2="310" stroke="#252834" />
              <line x1="44" y1="26" x2="44" y2="310" stroke="#252834" />

              {/* K=5 circle */}
              <motion.circle
                cx="280"
                cy="168"
                r="92"
                fill="#A78BFA"
                fillOpacity="0.09"
                stroke="#22D3EE"
                strokeWidth="1.75"
                strokeDasharray="6 4"
                initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.15 }}
              />

              {/* Outside points (dimmed) */}
              {[
                [108, 260, '#22D3EE'],
                [136, 240, '#22D3EE'],
                [152, 274, '#22D3EE'],
                [446, 78, '#34D399'],
                [474, 112, '#34D399'],
                [424, 108, '#34D399'],
                [456, 152, '#34D399'],
                [172, 92, '#A78BFA'],
              ].map(([cx, cy, c], i) => (
                <circle key={`out-${i}`} cx={cx as number} cy={cy as number} r="5" fill={c as string} fillOpacity="0.3" />
              ))}

              {/* 5 Nearest Neighbors inside radius */}
              {[
                { x: 232, y: 148, c: '#A78BFA', n: '1' },
                { x: 266, y: 112, c: '#A78BFA', n: '2' },
                { x: 248, y: 214, c: '#A78BFA', n: '3' },
                { x: 318, y: 218, c: '#A78BFA', n: '4' },
                { x: 344, y: 128, c: '#34D399', n: '5' },
              ].map((nb, idx) => (
                <motion.g
                  key={nb.n}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.25 + idx * 0.08 }}
                >
                  <line x1="280" y1="168" x2={nb.x} y2={nb.y} stroke={nb.c} strokeWidth="1.4" strokeOpacity="0.7" />
                  <circle cx={nb.x} cy={nb.y} r="9" fill="#08090D" stroke={nb.c} strokeWidth="2" />
                  <text x={nb.x} y={nb.y + 3.5} textAnchor="middle" fill="#F5F5F7" fontSize="9.5" fontFamily="JetBrains Mono">
                    {nb.n}
                  </text>
                </motion.g>
              ))}

              {/* Unknown query point */}
              <circle cx="280" cy="168" r="11" fill="#F5F5F7" />
              <text x="280" y="172" textAnchor="middle" fill="#08090D" fontSize="12" fontFamily="JetBrains Mono" fontWeight="700">
                ?
              </text>

              <text x="280" y="58" textAnchor="middle" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.4">
                K = 5 NEIGHBORHOOD RADIUS
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
