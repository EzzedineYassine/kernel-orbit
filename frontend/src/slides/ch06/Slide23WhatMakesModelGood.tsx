import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 23 — Evaluating a Recommendation Model (Chronological Holdout vs. Popularity) */
export function Slide23WhatMakesModelGood() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 06 · EVALUATION PROTOCOL"
              title={
                <>
                  Why <span className="text-[#A78BFA]">classification accuracy</span> fails here.
                </>
              }
              subtitle="Recommendation is a top-N ranking problem over thousands of sparse products — not binary label prediction."
              compact
            />

            <div className="flex flex-col gap-2.5">
              <div className="rounded-sm border border-[#A78BFA]/45 bg-[#11131A]/85 px-4 py-2.5">
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#A78BFA]">
                  THE SPARSITY TRAP
                </div>
                <p className="mt-1 font-sans text-[clamp(11px,0.92cqw,13px)] leading-relaxed text-[#858A98]">
                  Because 98.1% of cells are empty, predicting “no purchase” everywhere yields 98.1% accuracy while recommending nothing useful.
                </p>
              </div>

              <div className="rounded-sm border border-[#252834] bg-[#11131A]/85 px-4 py-2.5">
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#22D3EE]">
                  HONEST BENCHMARKING
                </div>
                <p className="mt-1 font-sans text-[clamp(11px,0.92cqw,13px)] leading-relaxed text-[#858A98]">
                  We evaluate Top-K ranking strictly on{' '}
                  <span className="font-mono text-[#F5F5F7]">future unseen purchases</span> and compare ALS directly against a{' '}
                  <span className="font-mono text-[#22D3EE]">Popularity Baseline</span>.
                </p>
              </div>
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 06.A"
            title="CHRONOLOGICAL RANKING BENCHMARK"
            meta="PAST → FUTURE HOLDOUT"
            caption="Cold-start test users with zero training history cannot be scored by pure collaborative filtering and are tracked separately."
            className="h-full"
          >
            <svg viewBox="0 0 560 340" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              <rect x="24" y="20" width="512" height="42" rx="3" fill="#08090D" stroke="#252834" />
              <text x="280" y="45" textAnchor="middle" fill="#F5F5F7" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="1.3">
                CHRONOLOGICAL ORDER STREAM (DEC 2010 → DEC 2011)
              </text>

              <line x1="196" y1="62" x2="196" y2="96" stroke="#A78BFA" strokeWidth="1.5" />
              <line x1="452" y1="62" x2="452" y2="96" stroke="#22D3EE" strokeWidth="1.5" />

              <motion.g
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <rect x="24" y="96" width="332" height="168" rx="3" fill="#08090D" stroke="#A78BFA" strokeOpacity="0.7" />
                <text x="42" y="120" fill="#A78BFA" fontSize="10.5" fontFamily="JetBrains Mono" letterSpacing="1.4">
                  EARLIER 80% · TRAINING HISTORY
                </text>
                <rect x="42" y="138" width="296" height="44" rx="2" fill="#11131A" stroke="#22D3EE" strokeOpacity="0.6" />
                <text x="54" y="158" fill="#22D3EE" fontSize="10.5" fontFamily="JetBrains Mono">
                  MODEL A: Implicit ALS (U · Vᵀ)
                </text>
                <text x="54" y="173" fill="#858A98" fontSize="9.5" fontFamily="Inter">
                  Personalized latent factor ranking
                </text>

                <rect x="42" y="196" width="296" height="44" rx="2" fill="#11131A" stroke="#252834" />
                <text x="54" y="216" fill="#F5F5F7" fontSize="10.5" fontFamily="JetBrains Mono">
                  BASELINE B: Popularity Frequency
                </text>
                <text x="54" y="231" fill="#858A98" fontSize="9.5" fontFamily="Inter">
                  Top training bestsellers (non-personalized)
                </text>
              </motion.g>

              <line x1="374" y1="88" x2="374" y2="324" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="5 4" />
              <text x="374" y="336" textAnchor="middle" fill="#22D3EE" fontSize="9" fontFamily="JetBrains Mono">
                TIME CUTOFF
              </text>

              <motion.g
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <rect x="392" y="96" width="144" height="168" rx="3" fill="#22D3EE" fillOpacity="0.08" stroke="#22D3EE" strokeWidth="1.5" />
                <text x="464" y="122" textAnchor="middle" fill="#22D3EE" fontSize="10.5" fontFamily="JetBrains Mono">
                  FUTURE 20%
                </text>
                <text x="464" y="148" textAnchor="middle" fill="#F5F5F7" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">
                  Unseen Buys
                </text>
                <line x1="412" y1="164" x2="516" y2="164" stroke="#252834" />
                <text x="464" y="186" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  Precision@K
                </text>
                <text x="464" y="204" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  Recall@K
                </text>
                <text x="464" y="222" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  MAP@K · NDCG@K
                </text>
                <text x="464" y="244" textAnchor="middle" fill="#22D3EE" fontSize="9" fontFamily="JetBrains Mono">
                  COVERAGE@K
                </text>
              </motion.g>

              <rect x="24" y="278" width="332" height="38" rx="3" fill="#11131A" stroke="#252834" />
              <text x="190" y="301" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                ALREADY-PURCHASED ITEMS MASKED BEFORE SCORING
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
