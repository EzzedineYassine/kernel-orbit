import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MathFormula } from '../../components/MathFormula'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 12 — Data Collection & Preprocessing (StandardScaler) */
export function Slide12PreprocessingScaling() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 03 · PREPROCESSING"
              title={
                <>
                  Normalize before you <span className="text-[#22D3EE]">measure.</span>
                </>
              }
              subtitle="Raw measurements live on unequal scales. Without standardization, wider-range features dominate distance calculations."
              compact
            />

            <MathFormula
              label="StandardScaler (Z-Score)"
              compact
              formula={
                <span className="flex items-center gap-3">
                  <span className="text-[#22D3EE]">z</span>
                  <span className="text-[#858A98]">=</span>
                  <span className="inline-flex flex-col items-center leading-none">
                    <span className="border-b border-[#858A98] px-2 pb-1 text-[0.88em]">
                      x − <span className="text-[#A78BFA]">μ</span>
                      <sub className="text-[0.65em] text-[#858A98]">train</sub>
                    </span>
                    <span className="pt-1 text-[0.88em]">
                      <span className="text-[#A78BFA]">σ</span>
                      <sub className="text-[0.65em] text-[#858A98]">train</sub>
                    </span>
                  </span>
                </span>
              }
              annotations={[
                { symbol: 'μ = 0', meaning: 'Zero-centered mean', accent: 'primary' },
                { symbol: 'σ = 1', meaning: 'Unit variance per feature', accent: 'secondary' },
              ]}
            />

            <p className="font-sans text-[clamp(11.5px,0.96cqw,13.5px)] leading-relaxed text-[#858A98]">
              In Iris, petal length spans <span className="font-mono text-[#F5F5F7]">1.0–6.9 cm</span> (range 5.9), while petal width spans{' '}
              <span className="font-mono text-[#F5F5F7]">0.1–2.5 cm</span> (range 2.4). Standardization gives both features equal geometric voice.
            </p>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 03.B"
            title="SCALE DISTORTION VS. STANDARDIZED SPACE"
            meta="BEFORE / AFTER"
            caption="Unscaled axes stretch circles into ellipses, biasing nearest-neighbor distances toward the larger-range axis."
            className="h-full"
          >
            <svg viewBox="0 0 600 340" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Left: Raw distorted scale */}
              <rect x="16" y="20" width="262" height="300" rx="3" fill="#08090D" stroke="#252834" />
              <text x="32" y="44" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.5">
                RAW UNITS (DISTORTED)
              </text>

              <line x1="44" y1="268" x2="258" y2="268" stroke="#252834" />
              <line x1="44" y1="74" x2="44" y2="268" stroke="#252834" />

              {/* Stretched ellipse */}
              <motion.ellipse
                cx="150"
                cy="176"
                rx="88"
                ry="26"
                fill="#A78BFA"
                fillOpacity="0.1"
                stroke="#A78BFA"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.15 }}
              />
              {[[82, 182], [116, 174], [150, 176], [190, 172], [220, 180]].map(([cx, cy], i) => (
                <circle key={`r-${i}`} cx={cx} cy={cy} r="4.2" fill={i === 2 ? '#F5F5F7' : '#A78BFA'} />
              ))}
              <text x="150" y="294" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                X₁ RANGE: 5.9 cm (DOMINATES)
              </text>

              {/* Arrow */}
              <line x1="286" y1="170" x2="314" y2="170" stroke="#22D3EE" strokeWidth="1.5" />
              <polygon points="314,165 324,170 314,175" fill="#22D3EE" />

              {/* Right: Standardized isotropic */}
              <rect x="326" y="20" width="258" height="300" rx="3" fill="#08090D" stroke="#22D3EE" strokeOpacity="0.6" />
              <text x="342" y="44" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.5">
                STANDARDIZED (μ=0, σ=1)
              </text>

              {/* Centered crosshairs */}
              <line x1="354" y1="170" x2="562" y2="170" stroke="#252834" strokeDasharray="3 3" />
              <line x1="458" y1="68" x2="458" y2="272" stroke="#252834" strokeDasharray="3 3" />

              {/* Isotropic circle */}
              <motion.circle
                cx="458"
                cy="170"
                r="66"
                fill="#22D3EE"
                fillOpacity="0.1"
                stroke="#22D3EE"
                strokeWidth="1.75"
                initial={reduced ? false : { scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
              {[[424, 140], [490, 146], [458, 170], [430, 200], [486, 196]].map(([cx, cy], i) => (
                <circle key={`s-${i}`} cx={cx} cy={cy} r="4.2" fill={i === 2 ? '#F5F5F7' : '#22D3EE'} />
              ))}

              <text x="458" y="294" textAnchor="middle" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                EQUAL WEIGHT ON BOTH AXES
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
