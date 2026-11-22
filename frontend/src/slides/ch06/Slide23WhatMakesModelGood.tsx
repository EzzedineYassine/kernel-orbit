import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 23 — What Makes a Model Good? */
export function Slide23WhatMakesModelGood() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 06 · THE REALITY CHECK"
              title={
                <>
                  What makes a model <span className="text-[#A78BFA]">good?</span>
                </>
              }
              subtitle="A high score on training data proves nothing. Trustworthy evaluation demands strict separation between fitting, tuning, and testing."
              compact
            />

            <div className="flex flex-col gap-2.5">
              <div className="rounded-sm border border-[#A78BFA]/45 bg-[#11131A]/85 px-4 py-2.5">
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#A78BFA]">
                  WHY ACCURACY ALONE MISLEADS
                </div>
                <p className="mt-1 font-sans text-[clamp(11.5px,0.94cqw,13.5px)] leading-relaxed text-[#858A98]">
                  On imbalanced data (e.g., 99% negative, 1% rare disease), predicting “negative” every time yields 99% accuracy while missing 100% of real cases.
                </p>
              </div>

              <div className="rounded-sm border border-[#252834] bg-[#11131A]/85 px-4 py-2.5">
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#22D3EE]">
                  THREE-ROLE EVALUATION DISCIPLINE
                </div>
                <p className="mt-1 font-sans text-[clamp(11.5px,0.94cqw,13.5px)] leading-relaxed text-[#858A98]">
                  Fit on <span className="font-mono text-[#F5F5F7]">Train</span>, tune hyperparameters on{' '}
                  <span className="font-mono text-[#A78BFA]">5-Fold CV</span>, and touch{' '}
                  <span className="font-mono text-[#22D3EE]">Held-Out Test</span> only for final judgment.
                </p>
              </div>
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 06.A"
            title="EVALUATION FIREWALL ARCHITECTURE"
            meta="FIT → VALIDATE → TEST"
            caption="Keeping the 20% test set behind a firewall prevents hyperparameter overfitting and guarantees honest generalization metrics."
            className="h-full"
          >
            <svg viewBox="0 0 560 350" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Full dataset header bar */}
              <rect x="24" y="20" width="512" height="40" rx="3" fill="#08090D" stroke="#252834" />
              <text x="280" y="45" textAnchor="middle" fill="#F5F5F7" fontSize="11.5" fontFamily="JetBrains Mono" letterSpacing="1.4">
                FULL DATASET · 150 STRATIFIED OBSERVATIONS
              </text>

              {/* Split branches */}
              <line x1="204" y1="60" x2="204" y2="92" stroke="#A78BFA" strokeWidth="1.5" />
              <line x1="454" y1="60" x2="454" y2="92" stroke="#22D3EE" strokeWidth="1.5" />

              {/* Left: 80% Train + 5-Fold CV */}
              <motion.g
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <rect x="24" y="92" width="340" height="172" rx="3" fill="#08090D" stroke="#A78BFA" strokeOpacity="0.7" />
                <text x="42" y="116" fill="#A78BFA" fontSize="10.5" fontFamily="JetBrains Mono" letterSpacing="1.4">
                  TRAINING PARTITION · 80% (120)
                </text>
                <text x="42" y="136" fill="#858A98" fontSize="10" fontFamily="Inter">
                  5-Fold Stratified Cross-Validation selects K, metric &amp; weights
                </text>

                {/* 5 folds visual */}
                {[0, 1, 2, 3, 4].map((fold) => (
                  <g key={fold}>
                    <text x="42" y={162 + fold * 19} fill="#858A98" fontSize="8.5" fontFamily="JetBrains Mono">
                      F{fold + 1}
                    </text>
                    {[0, 1, 2, 3, 4].map((blk) => (
                      <rect
                        key={blk}
                        x={64 + blk * 56}
                        y={152 + fold * 19}
                        width="50"
                        height="12"
                        rx="1.5"
                        fill={blk === fold ? '#A78BFA' : '#11131A'}
                        stroke={blk === fold ? '#A78BFA' : '#252834'}
                      />
                    ))}
                  </g>
                ))}
              </motion.g>

              {/* Firewall dashed divider */}
              <line x1="382" y1="84" x2="382" y2="330" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="5 4" />
              <text x="382" y="344" textAnchor="middle" fill="#22D3EE" fontSize="9" fontFamily="JetBrains Mono">
                LEAKAGE FIREWALL
              </text>

              {/* Right: 20% Test Vault */}
              <motion.g
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <rect x="400" y="92" width="136" height="172" rx="3" fill="#22D3EE" fillOpacity="0.08" stroke="#22D3EE" strokeWidth="1.5" />
                <text x="468" y="118" textAnchor="middle" fill="#22D3EE" fontSize="10.5" fontFamily="JetBrains Mono">
                  TEST VAULT
                </text>
                <text x="468" y="142" textAnchor="middle" fill="#F5F5F7" fontSize="22" fontFamily="JetBrains Mono" fontWeight="600">
                  20%
                </text>
                <text x="468" y="162" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                  30 samples
                </text>
                <line x1="420" y1="184" x2="516" y2="184" stroke="#252834" />
                <text x="468" y="208" textAnchor="middle" fill="#F5F5F7" fontSize="9.5" fontFamily="Inter">
                  Untouched during
                </text>
                <text x="468" y="224" textAnchor="middle" fill="#F5F5F7" fontSize="9.5" fontFamily="Inter">
                  scaling &amp; tuning
                </text>
                <text x="468" y="248" textAnchor="middle" fill="#22D3EE" fontSize="9" fontFamily="JetBrains Mono">
                  FINAL SCORE ONLY
                </text>
              </motion.g>

              {/* Bottom summary */}
              <rect x="24" y="280" width="340" height="44" rx="3" fill="#11131A" stroke="#252834" />
              <text x="194" y="306" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                PURPLE BLOCK = VALIDATION FOLD · DARK = TRAIN FOLD
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
