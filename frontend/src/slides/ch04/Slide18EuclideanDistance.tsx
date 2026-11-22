import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MathFormula } from '../../components/MathFormula'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 18 — Euclidean Distance */
export function Slide18EuclideanDistance() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="6/6"
        left={
          <div className="flex flex-col gap-[2.2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 04 · MEASURING DISTANCE"
              title={
                <>
                  Euclidean <span className="text-[#A78BFA]">Distance</span>
                </>
              }
              subtitle="Straight-line geometric distance between two feature vectors generalizes the Pythagorean theorem to n dimensions."
              compact
            />

            <MathFormula
              label="L₂ Metric (Euclidean Norm)"
              formula={
                <div className="flex items-center gap-2.5">
                  <span className="text-[#22D3EE]">d</span>
                  <span className="text-[#858A98]">(</span>
                  <span className="text-[#F5F5F7]">x</span>
                  <span className="text-[#858A98]">,</span>
                  <span className="text-[#F5F5F7]">y</span>
                  <span className="text-[#858A98]">)</span>
                  <span className="text-[#858A98]">=</span>
                  {/* Crisp radical with top vinculum */}
                  <span className="inline-flex items-stretch">
                    <span className="mr-0.5 self-end text-[1.4em] leading-none text-[#A78BFA]">√</span>
                    <span className="inline-flex items-center gap-2 border-t-[1.5px] border-[#A78BFA] px-2 pt-1.5">
                      <span className="inline-flex flex-col items-center leading-none">
                        <span className="text-[0.45em] text-[#858A98]">n</span>
                        <span className="text-[1.1em] text-[#A78BFA]">∑</span>
                        <span className="text-[0.45em] text-[#858A98]">i=1</span>
                      </span>
                      <span className="text-[0.92em]">
                        (x<sub className="text-[0.62em] text-[#22D3EE]">i</sub> − y
                        <sub className="text-[0.62em] text-[#A78BFA]">i</sub>)
                        <sup className="text-[0.65em] text-[#F5F5F7]">2</sup>
                      </span>
                    </span>
                  </span>
                </div>
              }
              annotations={[
                { symbol: 'x, y', meaning: 'Query & training feature vectors', accent: 'neutral' },
                { symbol: 'n', meaning: 'Number of features (n = 2 for Iris petals)', accent: 'secondary' },
                { symbol: '(xᵢ − yᵢ)²', meaning: 'Squared coordinate offset per axis', accent: 'primary' },
              ]}
            />
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 04.C"
            title="PYTHAGOREAN GEOMETRY"
            meta="Δx₁ · Δx₂ → d"
            caption="In 2D petal space, Euclidean distance is literally the hypotenuse of the right triangle formed by Δx₁ and Δx₂."
            className="h-full"
          >
            <svg viewBox="0 0 460 320" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Coordinate axes */}
              <line x1="56" y1="274" x2="424" y2="274" stroke="#252834" strokeWidth="1.25" />
              <line x1="56" y1="30" x2="56" y2="274" stroke="#252834" strokeWidth="1.25" />

              {/* Right-angle projection guide lines */}
              <line x1="128" y1="224" x2="128" y2="274" stroke="#252834" strokeDasharray="3 3" />
              <line x1="354" y1="86" x2="354" y2="274" stroke="#252834" strokeDasharray="3 3" />
              <line x1="56" y1="224" x2="128" y2="224" stroke="#252834" strokeDasharray="3 3" />
              <line x1="56" y1="86" x2="354" y2="86" stroke="#252834" strokeDasharray="3 3" />

              {/* Triangle legs */}
              <motion.line
                x1="128"
                y1="224"
                x2="354"
                y2="224"
                stroke="#858A98"
                strokeWidth="1.75"
                strokeDasharray="5 4"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 0.15 }}
              />
              <motion.line
                x1="354"
                y1="224"
                x2="354"
                y2="86"
                stroke="#858A98"
                strokeWidth="1.75"
                strokeDasharray="5 4"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 0.25 }}
              />

              {/* Right-angle square marker */}
              <polyline points="340,224 340,210 354,210" fill="none" stroke="#858A98" strokeWidth="1.25" />

              {/* Hypotenuse d(x, y) */}
              <motion.line
                x1="128"
                y1="224"
                x2="354"
                y2="86"
                stroke="#22D3EE"
                strokeWidth="2.5"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.38 }}
              />

              {/* Points x and y */}
              <circle cx="128" cy="224" r="6.5" fill="#22D3EE" />
              <text x="114" y="210" textAnchor="end" fill="#22D3EE" fontSize="11.5" fontFamily="JetBrains Mono">
                x (x₁, x₂)
              </text>

              <circle cx="354" cy="86" r="6.5" fill="#A78BFA" />
              <text x="364" y="76" fill="#A78BFA" fontSize="11.5" fontFamily="JetBrains Mono">
                y (y₁, y₂)
              </text>

              {/* Leg & hypotenuse labels */}
              <text x="242" y="244" textAnchor="middle" fill="#858A98" fontSize="11" fontFamily="JetBrains Mono">
                Δx₁ = |x₁ − y₁|
              </text>
              <text x="368" y="160" fill="#858A98" fontSize="11" fontFamily="JetBrains Mono">
                Δx₂ = |x₂ − y₂|
              </text>
              <g transform="rotate(-31 232 142)">
                <text x="232" y="138" textAnchor="middle" fill="#22D3EE" fontSize="12" fontFamily="JetBrains Mono" fontWeight="600">
                  d(x, y) = √(Δx₁² + Δx₂²)
                </text>
              </g>

              <text x="240" y="302" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                FEATURE 1 (z₁)
              </text>
              <text x="24" y="156" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono" transform="rotate(-90 24 156)">
                FEATURE 2 (z₂)
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
