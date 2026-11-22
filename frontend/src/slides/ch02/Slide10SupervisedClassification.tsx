import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 10 — Supervised Learning: Regression vs. Classification */
export function Slide10SupervisedClassification() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 02 · SUPERVISED LEARNING"
          title={
            <>
              Regression vs. <span className="text-[#22D3EE]">Classification</span>
            </>
          }
          subtitle="Supervised tasks split by target type: continuous numbers (regression) or discrete categories (classification)."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-[2.2cqw]">
          {/* Regression */}
          <div className="col-span-6 flex min-h-0 flex-col">
            <DiagramFrame
              figure="FIG 02.D · REGRESSION"
              meta="ŷ ∈ ℝ (CONTINUOUS)"
              caption="Predicts a numeric quantity — house price, temperature, or demand forecast."
              className="h-full"
            >
              <svg viewBox="0 0 420 250" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <line x1="48" y1="210" x2="390" y2="210" stroke="#252834" />
                <line x1="48" y1="24" x2="48" y2="210" stroke="#252834" />
                <text x="220" y="236" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                  INPUT FEATURE x
                </text>
                <text x="20" y="120" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono" transform="rotate(-90 20 120)">
                  CONTINUOUS y
                </text>

                {/* Regression line */}
                <motion.line
                  x1="64"
                  y1="190"
                  x2="372"
                  y2="46"
                  stroke="#A78BFA"
                  strokeWidth="2.25"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                />

                {/* Scatter + residual ticks */}
                {[
                  [84, 170, 181],
                  [118, 174, 165],
                  [152, 138, 149],
                  [188, 144, 132],
                  [222, 108, 116],
                  [258, 112, 99],
                  [294, 72, 82],
                  [330, 80, 66],
                  [358, 44, 52],
                ].map(([cx, cy, ly], i) => (
                  <g key={i}>
                    <line x1={cx} y1={cy} x2={cx} y2={ly} stroke="#858A98" strokeOpacity="0.45" strokeDasharray="2 2" />
                    <circle cx={cx} cy={cy} r="4.2" fill="#F5F5F7" />
                  </g>
                ))}
              </svg>
            </DiagramFrame>
          </div>

          {/* Classification */}
          <div className="col-span-6 flex min-h-0 flex-col">
            <DiagramFrame
              figure="FIG 02.E · CLASSIFICATION"
              meta="ŷ ∈ {0, 1, 2} · KERNEL"
              caption="Partitions feature space into discrete regions — classifying Iris species from petal geometry."
              className="h-full border-[#22D3EE]/55"
            >
              <svg viewBox="0 0 420 250" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                {/* Decision region tints */}
                <polygon points="48,24 166,24 166,210 48,210" fill="#22D3EE" fillOpacity="0.09" />
                <polygon points="166,24 276,24 264,210 166,210" fill="#A78BFA" fillOpacity="0.09" />
                <polygon points="276,24 390,24 390,210 264,210" fill="#34D399" fillOpacity="0.09" />

                <line x1="48" y1="210" x2="390" y2="210" stroke="#252834" />
                <line x1="48" y1="24" x2="48" y2="210" stroke="#252834" />

                {/* Decision boundaries */}
                <motion.line
                  x1="166"
                  y1="24"
                  x2="166"
                  y2="210"
                  stroke="#22D3EE"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
                <motion.line
                  x1="276"
                  y1="24"
                  x2="264"
                  y2="210"
                  stroke="#A78BFA"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />

                {/* Setosa */}
                {[[82, 178], [98, 166], [116, 174], [92, 152], [126, 158]].map(([cx, cy], i) => (
                  <circle key={`s-${i}`} cx={cx} cy={cy} r="4.5" fill="#22D3EE" />
                ))}
                {/* Versicolor */}
                {[[194, 126], [218, 114], [234, 134], [206, 98], [244, 112]].map(([cx, cy], i) => (
                  <circle key={`v-${i}`} cx={cx} cy={cy} r="4.5" fill="#A78BFA" />
                ))}
                {/* Virginica */}
                {[[302, 74], [326, 62], [344, 82], [316, 48], [358, 56]].map(([cx, cy], i) => (
                  <circle key={`g-${i}`} cx={cx} cy={cy} r="4.5" fill="#34D399" />
                ))}

                <text x="106" y="44" textAnchor="middle" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                  SETOSA
                </text>
                <text x="220" y="44" textAnchor="middle" fill="#A78BFA" fontSize="9.5" fontFamily="JetBrains Mono">
                  VERSICOLOR
                </text>
                <text x="334" y="44" textAnchor="middle" fill="#34D399" fontSize="9.5" fontFamily="JetBrains Mono">
                  VIRGINICA
                </text>
                <text x="220" y="236" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                  PETAL LENGTH (cm)
                </text>
                <text x="20" y="120" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono" transform="rotate(-90 20 120)">
                  PETAL WIDTH (cm)
                </text>
              </svg>
            </DiagramFrame>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
