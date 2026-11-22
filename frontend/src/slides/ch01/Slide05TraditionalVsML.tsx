import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 05 — Traditional Programming vs. Machine Learning */
export function Slide05TraditionalVsML() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2.2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 01 · THE PARADIGM INVERSION"
          title={
            <>
              Traditional Programming vs.{' '}
              <span className="text-[#22D3EE]">Machine Learning</span>
            </>
          }
          subtitle="We invert the flow: instead of supplying rules to get answers, we supply labeled data to discover the model."
          compact
        />

        <DiagramFrame
          figure="FIG 01.E"
          title="COMPUTATIONAL FLOW INVERSION"
          meta="INPUTS → ENGINE → OUTPUT"
          caption="Classical code executes fixed logic written by engineers; Machine Learning induces logic from historical observations."
          className="min-h-0 flex-1"
        >
          <svg viewBox="0 0 960 320" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
            {/* ── Row 1: Traditional Programming ── */}
            <text x="28" y="34" fill="#858A98" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="2">
              01 / TRADITIONAL PROGRAMMING
            </text>

            <motion.g
              initial={reduced ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <rect x="28" y="50" width="180" height="44" rx="3" fill="#08090D" stroke="#252834" />
              <text x="118" y="77" textAnchor="middle" fill="#F5F5F7" fontSize="13" fontFamily="Space Grotesk" fontWeight="600">
                RULES (Code)
              </text>

              <rect x="28" y="102" width="180" height="44" rx="3" fill="#08090D" stroke="#252834" />
              <text x="118" y="129" textAnchor="middle" fill="#F5F5F7" fontSize="13" fontFamily="Space Grotesk" fontWeight="600">
                DATA (Inputs)
              </text>
            </motion.g>

            {/* Arrows into engine */}
            <motion.path
              d="M 208 72 L 320 72 L 320 98 L 364 98"
              fill="none"
              stroke="#858A98"
              strokeWidth="1.5"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.path
              d="M 208 124 L 320 124 L 320 98 L 364 98"
              fill="none"
              stroke="#858A98"
              strokeWidth="1.5"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            />
            <polygon points="364,93 374,98 364,103" fill="#858A98" />

            {/* Processor box */}
            <rect x="374" y="64" width="210" height="68" rx="3" fill="#11131A" stroke="#858A98" strokeOpacity="0.6" />
            <text x="479" y="94" textAnchor="middle" fill="#F5F5F7" fontSize="13" fontFamily="Space Grotesk" fontWeight="600">
              EXECUTION ENGINE
            </text>
            <text x="479" y="114" textAnchor="middle" fill="#858A98" fontSize="10.5" fontFamily="JetBrains Mono">
              Deterministic logic
            </text>

            {/* Arrow to output */}
            <motion.line
              x1="584"
              y1="98"
              x2="718"
              y2="98"
              stroke="#858A98"
              strokeWidth="1.5"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.35 }}
            />
            <polygon points="718,93 728,98 718,103" fill="#858A98" />

            <rect x="728" y="68" width="204" height="60" rx="3" fill="#08090D" stroke="#252834" />
            <text x="830" y="103" textAnchor="middle" fill="#F5F5F7" fontSize="14" fontFamily="Space Grotesk" fontWeight="600">
              ANSWERS
            </text>

            {/* Horizontal separator */}
            <line x1="28" y1="168" x2="932" y2="168" stroke="#252834" strokeDasharray="4 6" />

            {/* ── Row 2: Machine Learning ── */}
            <text x="28" y="196" fill="#22D3EE" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="2">
              02 / MACHINE LEARNING
            </text>

            <motion.g
              initial={reduced ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <rect x="28" y="212" width="180" height="44" rx="3" fill="#08090D" stroke="#22D3EE" strokeOpacity="0.6" />
              <text x="118" y="239" textAnchor="middle" fill="#22D3EE" fontSize="13" fontFamily="Space Grotesk" fontWeight="600">
                DATA (Features)
              </text>

              <rect x="28" y="264" width="180" height="44" rx="3" fill="#08090D" stroke="#A78BFA" strokeOpacity="0.7" />
              <text x="118" y="291" textAnchor="middle" fill="#A78BFA" fontSize="13" fontFamily="Space Grotesk" fontWeight="600">
                ANSWERS (Labels)
              </text>
            </motion.g>

            {/* Arrows into learning algorithm */}
            <motion.path
              d="M 208 234 L 320 234 L 320 260 L 364 260"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="1.75"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
            <motion.path
              d="M 208 286 L 320 286 L 320 260 L 364 260"
              fill="none"
              stroke="#A78BFA"
              strokeWidth="1.75"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            />
            <polygon points="364,255 374,260 364,265" fill="#22D3EE" />

            {/* Learning Algorithm box */}
            <rect x="374" y="226" width="210" height="68" rx="3" fill="#11131A" stroke="#A78BFA" strokeWidth="1.5" />
            <text x="479" y="256" textAnchor="middle" fill="#F5F5F7" fontSize="13" fontFamily="Space Grotesk" fontWeight="600">
              LEARNING ALGORITHM
            </text>
            <text x="479" y="276" textAnchor="middle" fill="#A78BFA" fontSize="10.5" fontFamily="JetBrains Mono">
              Fits patterns from examples
            </text>

            {/* Arrow to learned model */}
            <motion.line
              x1="584"
              y1="260"
              x2="718"
              y2="260"
              stroke="#22D3EE"
              strokeWidth="1.75"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.55 }}
            />
            <polygon points="718,255 728,260 718,265" fill="#22D3EE" />

            <motion.g
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.65 }}
            >
              <rect x="728" y="226" width="204" height="68" rx="3" fill="#22D3EE" fillOpacity="0.1" stroke="#22D3EE" strokeWidth="1.5" />
              <text x="830" y="256" textAnchor="middle" fill="#22D3EE" fontSize="14" fontFamily="Space Grotesk" fontWeight="700">
                LEARNED MODEL
              </text>
              <text x="830" y="276" textAnchor="middle" fill="#F5F5F7" fontSize="10.5" fontFamily="JetBrains Mono">
                Predicts on new data
              </text>
            </motion.g>
          </svg>
        </DiagramFrame>
      </div>
    </SlideLayout>
  )
}
