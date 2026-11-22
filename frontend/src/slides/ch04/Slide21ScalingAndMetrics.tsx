import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MathFormula } from '../../components/MathFormula'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 21 — Feature Scaling & Distance Metrics (Euclidean L2 vs. Manhattan L1) */
export function Slide21ScalingAndMetrics() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 04 · GEOMETRY OF PROXIMITY"
          title={
            <>
              Distance Metrics & <span className="text-[#22D3EE]">Feature Scaling</span>
            </>
          }
          subtitle="Changing the distance metric reshapes what 'equidistant' means — and scaling ensures no single axis hijacks the neighborhood."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-[2cqw]">
          {/* Euclidean L2 */}
          <div className="col-span-6 flex min-h-0 flex-col gap-2.5">
            <DiagramFrame
              figure="FIG 04.D · EUCLIDEAN (L₂)"
              meta="CIRCULAR ISO-CONTOUR"
              caption="Straight-line flight path. Constant-distance contours form perfect circles in standardized space."
              className="min-h-0 flex-1"
            >
              <svg viewBox="0 0 360 200" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <line x1="180" y1="16" x2="180" y2="184" stroke="#252834" strokeDasharray="3 3" />
                <line x1="60" y1="100" x2="300" y2="100" stroke="#252834" strokeDasharray="3 3" />

                <motion.circle
                  cx="180"
                  cy="100"
                  r="68"
                  fill="#22D3EE"
                  fillOpacity="0.09"
                  stroke="#22D3EE"
                  strokeWidth="1.75"
                  initial={reduced ? false : { scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                />
                <motion.line
                  x1="180"
                  y1="100"
                  x2="228"
                  y2="52"
                  stroke="#F5F5F7"
                  strokeWidth="2"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                <circle cx="180" cy="100" r="4.5" fill="#F5F5F7" />
                <circle cx="228" cy="52" r="4.5" fill="#22D3EE" />
                <text x="242" y="48" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono">
                  r = 1.0
                </text>
              </svg>
            </DiagramFrame>

            <MathFormula
              compact
              formula={
                <span className="inline-flex items-center gap-2 text-[0.86em]">
                  <span className="text-[#22D3EE]">L₂</span>
                  <span className="text-[#858A98]">(x, y) =</span>
                  <span className="inline-flex items-stretch">
                    <span className="mr-0.5 self-end text-[1.25em] leading-none text-[#22D3EE]">√</span>
                    <span className="border-t border-[#22D3EE] px-1.5 pt-0.5">∑ (xᵢ − yᵢ)²</span>
                  </span>
                </span>
              }
            />
          </div>

          {/* Manhattan L1 */}
          <div className="col-span-6 flex min-h-0 flex-col gap-2.5">
            <DiagramFrame
              figure="FIG 04.E · MANHATTAN (L₁)"
              meta="DIAMOND ISO-CONTOUR"
              caption="Axis-aligned city-block path. Less sensitive to extreme single-feature outliers."
              className="min-h-0 flex-1"
            >
              <svg viewBox="0 0 360 200" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <line x1="180" y1="16" x2="180" y2="184" stroke="#252834" strokeDasharray="3 3" />
                <line x1="60" y1="100" x2="300" y2="100" stroke="#252834" strokeDasharray="3 3" />

                <motion.polygon
                  points="180,32 248,100 180,168 112,100"
                  fill="#A78BFA"
                  fillOpacity="0.1"
                  stroke="#A78BFA"
                  strokeWidth="1.75"
                  initial={reduced ? false : { scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                />
                <motion.polyline
                  points="180,100 214,100 214,66"
                  fill="none"
                  stroke="#F5F5F7"
                  strokeWidth="2"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
                <circle cx="180" cy="100" r="4.5" fill="#F5F5F7" />
                <circle cx="214" cy="66" r="4.5" fill="#A78BFA" />
                <text x="226" y="62" fill="#A78BFA" fontSize="10" fontFamily="JetBrains Mono">
                  |Δx₁|+|Δx₂| = 1.0
                </text>
              </svg>
            </DiagramFrame>

            <MathFormula
              compact
              formula={
                <span className="text-[0.86em]">
                  <span className="text-[#A78BFA]">L₁</span>
                  <span className="text-[#858A98]">(x, y) = </span>∑ |xᵢ − yᵢ|
                </span>
              }
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between rounded-sm border border-[#252834] bg-[#11131A]/85 px-4 py-2 font-mono text-[clamp(9.5px,0.8cqw,11.5px)] text-[#858A98]">
          <span>
            <span className="text-[#22D3EE]">SCALING INVARIANT:</span> Both L₂ circles and L₁ diamonds collapse into skewed shapes unless features share unit variance.
          </span>
          <span className="shrink-0 text-[#A78BFA]">NEXT → LIVE LABORATORY</span>
        </div>
      </div>
    </SlideLayout>
  )
}
