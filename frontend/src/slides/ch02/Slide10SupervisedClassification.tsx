import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 10 — Explicit Ratings vs. Implicit Purchase Feedback */
export function Slide10SupervisedClassification() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 02 · IMPLICIT FEEDBACK"
          title={
            <>
              Explicit Ratings <span className="text-[#858A98]">vs.</span>{' '}
              <span className="text-[#22D3EE]">Implicit Purchases</span>
            </>
          }
          subtitle="Real e-commerce customers rarely leave 5-star reviews — ORBIT models purchases honestly as implicit confidence signals."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-[2.2cqw]">
          <div className="col-span-6 flex min-h-0 flex-col">
            <DiagramFrame
              figure="FIG 02.D · EXPLICIT FEEDBACK"
              meta="1–5 STAR RATINGS"
              caption="Direct likes and dislikes — rare, biased toward extremes, and unavailable in transaction logs."
              className="h-full"
            >
              <svg viewBox="0 0 400 220" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                {[
                  { y: 34, label: 'Positive Preference', val: '5 / 5', c: '#22D3EE', w: 180 },
                  { y: 88, label: 'Neutral Opinion', val: '3 / 5', c: '#858A98', w: 108 },
                  { y: 142, label: 'Explicit Dislike', val: '1 / 5', c: '#A78BFA', w: 36 },
                ].map((row, idx) => (
                  <motion.g
                    key={row.label}
                    initial={reduced ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + idx * 0.1 }}
                  >
                    <text x="24" y={row.y + 14} fill="#F5F5F7" fontSize="11.5" fontFamily="Space Grotesk" fontWeight="500">
                      {row.label}
                    </text>
                    <rect x="176" y={row.y} width="180" height="22" rx="2" fill="#08090D" stroke="#252834" />
                    <rect x="176" y={row.y} width={row.w} height="22" rx="2" fill={row.c} fillOpacity="0.35" stroke={row.c} />
                    <text x="366" y={row.y + 15} fill={row.c} fontSize="10.5" fontFamily="JetBrains Mono">
                      {row.val}
                    </text>
                  </motion.g>
                ))}
                <text x="200" y="202" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  ABSENCE OF A RATING ≠ EXPLICIT NEGATIVE PREFERENCE
                </text>
              </svg>
            </DiagramFrame>
          </div>

          <div className="col-span-6 flex min-h-0 flex-col">
            <DiagramFrame
              figure="FIG 02.E · IMPLICIT FEEDBACK"
              meta="ORBIT · C = 1 + α·r"
              caption="Purchases indicate preference confidence; unbought items are unobserved (low confidence), not disliked."
              className="h-full border-[#22D3EE]/55"
            >
              <svg viewBox="0 0 400 220" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                {[
                  { y: 30, label: 'Unobserved Item', tag: 'p = 0 · C = 1.0', desc: 'May simply be undiscovered', c: '#858A98', w: 34 },
                  { y: 90, label: 'Purchased Once', tag: 'p = 1 · C = 11.4', desc: 'Positive preference signal', c: '#A78BFA', w: 120 },
                  { y: 150, label: 'Repeat Purchases', tag: 'p = 1 · C = 27.9', desc: 'High confidence affinity', c: '#22D3EE', w: 200 },
                ].map((row, idx) => (
                  <motion.g
                    key={row.label}
                    initial={reduced ? false : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 + idx * 0.1 }}
                  >
                    <text x="20" y={row.y + 12} fill="#F5F5F7" fontSize="11.5" fontFamily="Space Grotesk" fontWeight="600">
                      {row.label}
                    </text>
                    <text x="20" y={row.y + 28} fill="#858A98" fontSize="9.5" fontFamily="Inter">
                      {row.desc}
                    </text>
                    <rect x="176" y={row.y + 4} width="204" height="24" rx="2" fill="#08090D" stroke="#252834" />
                    <rect x="176" y={row.y + 4} width={row.w} height="24" rx="2" fill={row.c} fillOpacity="0.28" stroke={row.c} />
                    <text x="184" y={row.y + 20} fill="#F5F5F7" fontSize="9.5" fontFamily="JetBrains Mono">
                      {row.tag}
                    </text>
                  </motion.g>
                ))}
                <text x="200" y="206" textAnchor="middle" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                  HU, KOREN &amp; VOLINSKY (2008) IMPLICIT CONFIDENCE MODEL
                </text>
              </svg>
            </DiagramFrame>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
