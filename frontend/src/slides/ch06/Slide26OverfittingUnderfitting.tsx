import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MetricCard } from '../../components/MetricCard'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

export interface BiasVarianceSlotData {
  trainAccuracy: string | null
  cvMeanAccuracy: string | null
  testAccuracy: string | null
}

/** Slide 26 — Overfitting vs. Underfitting */
export function Slide26OverfittingUnderfitting({ live }: { live?: BiasVarianceSlotData } = {}) {
  const reduced = useReducedMotion()
  const slots: BiasVarianceSlotData = live ?? {
    trainAccuracy: null,
    cvMeanAccuracy: null,
    testAccuracy: null,
  }

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 06 · BIAS–VARIANCE TRADEOFF"
              title={
                <>
                  Overfitting <span className="text-[#858A98]">vs.</span>{' '}
                  <span className="text-[#22D3EE]">Underfitting</span>
                </>
              }
              subtitle="Select K using 5-fold cross-validation on the training split — preserving the 20% test set strictly for unbiased final evaluation."
              compact
            />

            <div className="grid grid-cols-1 gap-2">
              <MetricCard label="Train Accuracy (120)" value={slots.trainAccuracy} accent="primary" compact />
              <MetricCard label="5-Fold CV Accuracy (Train)" value={slots.cvMeanAccuracy} accent="secondary" compact />
              <MetricCard label="Held-Out Test Accuracy (30)" value={slots.testAccuracy} accent="neutral" compact />
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 06.C"
            title="BIAS–VARIANCE CURVE"
            meta="SMALL K → LARGE K"
            caption="Conceptual schematic: live K-sweep CV vs. train curves connect from POST /api/model/experiment in Phase 7."
            className="h-full"
          >
            <svg viewBox="0 0 560 340" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Regime bands */}
              <rect x="64" y="28" width="136" height="248" fill="#A78BFA" fillOpacity="0.06" />
              <rect x="200" y="28" width="150" height="248" fill="#22D3EE" fillOpacity="0.08" />
              <rect x="350" y="28" width="174" height="248" fill="#858A98" fillOpacity="0.05" />

              <line x1="200" y1="28" x2="200" y2="276" stroke="#252834" strokeDasharray="4 4" />
              <line x1="350" y1="28" x2="350" y2="276" stroke="#252834" strokeDasharray="4 4" />

              {/* Axes */}
              <line x1="64" y1="276" x2="524" y2="276" stroke="#252834" strokeWidth="1.25" />
              <line x1="64" y1="28" x2="64" y2="276" stroke="#252834" strokeWidth="1.25" />

              {/* Regime labels */}
              <text x="132" y="48" textAnchor="middle" fill="#A78BFA" fontSize="9.5" fontFamily="JetBrains Mono">
                OVERFITTING
              </text>
              <text x="132" y="62" textAnchor="middle" fill="#858A98" fontSize="8.5" fontFamily="JetBrains Mono">
                High Variance
              </text>

              <text x="275" y="48" textAnchor="middle" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                OPTIMAL ZONE
              </text>
              <text x="275" y="62" textAnchor="middle" fill="#858A98" fontSize="8.5" fontFamily="JetBrains Mono">
                Balanced Fit
              </text>

              <text x="437" y="48" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                UNDERFITTING
              </text>
              <text x="437" y="62" textAnchor="middle" fill="#858A98" fontSize="8.5" fontFamily="JetBrains Mono">
                High Bias
              </text>

              {/* Training Error curve (starts near 0 at K=1, rises monotonically) */}
              <motion.path
                d="M 80 264 C 156 248, 250 220, 360 176 C 428 148, 476 124, 510 108"
                fill="none"
                stroke="#A78BFA"
                strokeWidth="2.2"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
              />

              {/* Validation Error curve (U-shaped: high at K=1, minimum in sweet spot, rises at large K) */}
              <motion.path
                d="M 80 120 C 148 188, 224 214, 278 214 C 344 214, 424 156, 510 92"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2.4"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.85, delay: 0.3 }}
              />

              {/* Minimum validation error marker */}
              <circle cx="275" cy="214" r="5.5" fill="#22D3EE" />
              <line x1="275" y1="214" x2="275" y2="276" stroke="#22D3EE" strokeDasharray="3 3" />

              {/* Curve legend */}
              <line x1="88" y1="306" x2="112" y2="306" stroke="#22D3EE" strokeWidth="2.2" />
              <text x="120" y="310" fill="#F5F5F7" fontSize="10" fontFamily="JetBrains Mono">
                5-Fold CV Error (selects K)
              </text>

              <line x1="316" y1="306" x2="340" y2="306" stroke="#A78BFA" strokeWidth="2.2" />
              <text x="348" y="310" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                Training Error
              </text>

              {/* Axis labels */}
              <text x="294" y="294" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                NEIGHBORHOOD SIZE K (SMALL → LARGE)
              </text>
              <text x="24" y="156" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono" transform="rotate(-90 24 156)">
                PREDICTION ERROR
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
