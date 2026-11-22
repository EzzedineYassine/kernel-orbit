import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 15 — Lazy Learning (Instance-Based) */
export function Slide15LazyLearning() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 03 · INSTANCE-BASED LEARNING"
              title={
                <>
                  KNN is a <span className="text-[#22D3EE]">lazy learner.</span>
                </>
              }
              subtitle="Unlike neural networks or linear models, KNN does not compress training data into parametric weights during .fit()."
              compact
            />

            <div className="flex flex-col gap-2.5">
              <div className="rounded-sm border border-[#252834] bg-[#11131A]/85 px-4 py-3">
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#858A98] uppercase">
                  AT TRAINING TIME (.fit)
                </div>
                <p className="mt-1 font-sans text-[clamp(11.5px,0.96cqw,13.5px)] text-[#F5F5F7]">
                  Stores the standardized training coordinates and labels directly in memory. Zero gradient updates.
                </p>
              </div>
              <div className="rounded-sm border border-[#22D3EE]/50 bg-[#11131A]/85 px-4 py-3">
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#22D3EE] uppercase">
                  AT INFERENCE TIME (.predict)
                </div>
                <p className="mt-1 font-sans text-[clamp(11.5px,0.96cqw,13.5px)] text-[#F5F5F7]">
                  Computes distance from the new query point to stored instances on demand — deferring the work until prediction.
                </p>
              </div>
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 03.F"
            title="EAGER PARAMETRIC VS. LAZY INSTANCE-BASED"
            meta="COMPUTE PROFILE"
            caption="Lazy learning trades near-instant training for inference-time distance search across stored training examples."
            className="h-full"
          >
            <svg viewBox="0 0 580 340" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Top track: Eager */}
              <text x="24" y="34" fill="#858A98" fontSize="10.5" fontFamily="JetBrains Mono" letterSpacing="1.6">
                EAGER LEARNER (E.G. LINEAR / NEURAL NET)
              </text>
              <rect x="24" y="48" width="132" height="62" rx="3" fill="#08090D" stroke="#252834" />
              <text x="90" y="76" textAnchor="middle" fill="#F5F5F7" fontSize="11.5" fontFamily="Space Grotesk" fontWeight="600">
                Training Data
              </text>
              <text x="90" y="95" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                X_train, y_train
              </text>

              <line x1="156" y1="79" x2="206" y2="79" stroke="#858A98" strokeWidth="1.5" />
              <polygon points="206,74 216,79 206,84" fill="#858A98" />

              <rect x="216" y="48" width="160" height="62" rx="3" fill="#11131A" stroke="#A78BFA" strokeOpacity="0.6" />
              <text x="296" y="76" textAnchor="middle" fill="#A78BFA" fontSize="11.5" fontFamily="Space Grotesk" fontWeight="600">
                Heavy Optimization
              </text>
              <text x="296" y="95" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                Learn weights θ
              </text>

              <line x1="376" y1="79" x2="416" y2="79" stroke="#858A98" strokeWidth="1.5" />
              <polygon points="416,74 426,79 416,84" fill="#858A98" />

              <rect x="426" y="48" width="130" height="62" rx="3" fill="#08090D" stroke="#252834" />
              <text x="491" y="76" textAnchor="middle" fill="#F5F5F7" fontSize="11.5" fontFamily="Space Grotesk" fontWeight="600">
                Fast Predict
              </text>
              <text x="491" y="95" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                O(1) matrix mul
              </text>

              <line x1="24" y1="142" x2="556" y2="142" stroke="#252834" strokeDasharray="4 6" />

              {/* Bottom track: Lazy (KNN) */}
              <text x="24" y="176" fill="#22D3EE" fontSize="10.5" fontFamily="JetBrains Mono" letterSpacing="1.6">
                LAZY LEARNER (K-NEAREST NEIGHBORS)
              </text>
              <motion.g
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <rect x="24" y="192" width="132" height="68" rx="3" fill="#08090D" stroke="#22D3EE" strokeOpacity="0.65" />
                <text x="90" y="220" textAnchor="middle" fill="#F5F5F7" fontSize="11.5" fontFamily="Space Grotesk" fontWeight="600">
                  Index Instances
                </text>
                <text x="90" y="239" textAnchor="middle" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                  Store 120 points
                </text>
              </motion.g>

              <line x1="156" y1="226" x2="206" y2="226" stroke="#22D3EE" strokeWidth="1.5" />
              <polygon points="206,221 216,226 206,231" fill="#22D3EE" />

              <motion.g
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <rect x="216" y="192" width="160" height="68" rx="3" fill="#11131A" stroke="#252834" strokeDasharray="4 3" />
                <text x="296" y="220" textAnchor="middle" fill="#858A98" fontSize="11.5" fontFamily="Space Grotesk" fontWeight="600">
                  No Weights Fitted
                </text>
                <text x="296" y="239" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  Data IS the model
                </text>
              </motion.g>

              <line x1="376" y1="226" x2="416" y2="226" stroke="#22D3EE" strokeWidth="1.5" />
              <polygon points="416,221 426,226 416,231" fill="#22D3EE" />

              <motion.g
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                <rect x="426" y="192" width="130" height="68" rx="3" fill="#22D3EE" fillOpacity="0.1" stroke="#22D3EE" strokeWidth="1.5" />
                <text x="491" y="220" textAnchor="middle" fill="#22D3EE" fontSize="11.5" fontFamily="Space Grotesk" fontWeight="600">
                  Query Distance
                </text>
                <text x="491" y="239" textAnchor="middle" fill="#F5F5F7" fontSize="9.5" fontFamily="JetBrains Mono">
                  O(N) lookup
                </text>
              </motion.g>

              <text x="290" y="302" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                NON-PARAMETRIC: DECISION BOUNDARY SHAPES NATURALLY TO LOCAL DENSITY
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
