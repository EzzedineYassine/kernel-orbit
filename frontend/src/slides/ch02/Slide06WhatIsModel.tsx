import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MathFormula } from '../../components/MathFormula'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 06 — What Is a Machine Learning Model? */
export function Slide06WhatIsModel() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.4cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 02 · UNDERSTANDING THE MODEL"
              title={
                <>
                  A model is a <span className="text-[#A78BFA]">mathematical function.</span>
                </>
              }
              subtitle="Stripped of mystique, an ML model maps numerical input measurements to an estimated output."
            />

            <MathFormula
              label="Core Mapping"
              formula={
                <span className="flex items-baseline gap-2.5 tracking-wide">
                  <span className="text-[#A78BFA]">f</span>
                  <span className="text-[#858A98]">(</span>
                  <span className="text-[#22D3EE]">x</span>
                  <span className="text-[#858A98]">)</span>
                  <span className="text-[#858A98]">→</span>
                  <span className="text-[#F5F5F7]">ŷ</span>
                </span>
              }
              annotations={[
                { symbol: 'x', meaning: 'Input feature vector (measurements)', accent: 'secondary' },
                { symbol: 'f', meaning: 'Learned mapping function', accent: 'primary' },
                { symbol: 'ŷ', meaning: 'Predicted class or value', accent: 'neutral' },
              ]}
            />
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 02.A"
            title="FUNCTIONAL MAPPING PIPELINE"
            meta="ℝ² → {0, 1, 2}"
            caption="For the Iris task, x is a 2D petal vector and ŷ is the predicted species with class probabilities."
            className="h-full"
          >
            <svg viewBox="0 0 600 340" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Input Vector */}
              <motion.g
                initial={reduced ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <rect x="24" y="96" width="152" height="148" rx="3" fill="#08090D" stroke="#22D3EE" strokeOpacity="0.65" />
                <text x="100" y="122" textAnchor="middle" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.6">
                  INPUT VECTOR x
                </text>
                <rect x="40" y="138" width="120" height="38" rx="2" fill="#11131A" stroke="#252834" />
                <text x="50" y="154" fill="#858A98" fontSize="9" fontFamily="JetBrains Mono">x₁ · petal_len</text>
                <text x="50" y="169" fill="#F5F5F7" fontSize="11.5" fontFamily="JetBrains Mono">4.9 cm</text>

                <rect x="40" y="188" width="120" height="38" rx="2" fill="#11131A" stroke="#252834" />
                <text x="50" y="204" fill="#858A98" fontSize="9" fontFamily="JetBrains Mono">x₂ · petal_wid</text>
                <text x="50" y="219" fill="#F5F5F7" fontSize="11.5" fontFamily="JetBrains Mono">1.5 cm</text>
              </motion.g>

              {/* Arrow 1 */}
              <motion.line
                x1="176"
                y1="170"
                x2="226"
                y2="170"
                stroke="#22D3EE"
                strokeWidth="1.75"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              />
              <polygon points="226,165 236,170 226,175" fill="#22D3EE" />

              {/* Model Function Core */}
              <motion.g
                initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.3 }}
              >
                <rect x="236" y="76" width="144" height="188" rx="4" fill="#A78BFA" fillOpacity="0.1" stroke="#A78BFA" strokeWidth="1.75" />
                <text x="308" y="106" textAnchor="middle" fill="#A78BFA" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.8">
                  MODEL f(x)
                </text>
                <text x="308" y="176" textAnchor="middle" fill="#F5F5F7" fontSize="42" fontFamily="Space Grotesk" fontWeight="600">
                  f
                </text>
                <line x1="260" y1="204" x2="356" y2="204" stroke="#252834" />
                <text x="308" y="226" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  Fitted on
                </text>
                <text x="308" y="242" textAnchor="middle" fill="#A78BFA" fontSize="9.5" fontFamily="JetBrains Mono">
                  training data
                </text>
              </motion.g>

              {/* Arrow 2 */}
              <motion.line
                x1="380"
                y1="170"
                x2="424"
                y2="170"
                stroke="#A78BFA"
                strokeWidth="1.75"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.45 }}
              />
              <polygon points="424,165 434,170 424,175" fill="#A78BFA" />

              {/* Output Prediction */}
              <motion.g
                initial={reduced ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.55 }}
              >
                <rect x="434" y="96" width="142" height="148" rx="3" fill="#08090D" stroke="#252834" />
                <text x="505" y="122" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.6">
                  PREDICTION ŷ
                </text>
                <text x="505" y="160" textAnchor="middle" fill="#F5F5F7" fontSize="13.5" fontFamily="Space Grotesk" fontWeight="600">
                  Iris versicolor
                </text>
                <text x="505" y="182" textAnchor="middle" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono">
                  class_id = 1
                </text>
                <rect x="454" y="198" width="102" height="24" rx="2" fill="#11131A" stroke="#252834" />
                <text x="505" y="214" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  P(y | x) vector
                </text>
              </motion.g>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
