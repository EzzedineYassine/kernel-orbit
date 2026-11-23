import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MathFormula } from '../../components/MathFormula'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 06 — What Is a Recommendation Model? */
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
                  A model is a <span className="text-[#A78BFA]">scoring function.</span>
                </>
              }
              subtitle="In recommendation systems, the model maps a customer and a candidate product to an estimated affinity score."
            />

            <MathFormula
              label="Recommendation Scoring Function"
              formula={
                <span className="flex items-baseline gap-2.5 tracking-wide">
                  <span className="text-[#A78BFA]">f</span>
                  <span className="text-[#858A98]">(</span>
                  <span className="text-[#22D3EE]">u</span>
                  <span className="text-[#858A98]">,</span>
                  <span className="text-[#F5F5F7]">i</span>
                  <span className="text-[#858A98]">)</span>
                  <span className="text-[#858A98]">=</span>
                  <span className="text-[#22D3EE]">u</span>
                  <sub className="text-[0.58em] text-[#858A98]">u</sub>
                  <span className="text-[#858A98]">·</span>
                  <span className="text-[#A78BFA]">v</span>
                  <sub className="text-[0.58em] text-[#858A98]">i</sub>
                  <span className="text-[#858A98]">→</span>
                  <span className="text-[#F5F5F7]">r̂</span>
                </span>
              }
              annotations={[
                { symbol: 'u, i', meaning: 'Customer ID & candidate product', accent: 'secondary' },
                { symbol: 'uᵤ · vᵢ', meaning: 'Dot product of learned latent vectors', accent: 'primary' },
                { symbol: 'r̂', meaning: 'Predicted preference rank score', accent: 'neutral' },
              ]}
            />
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 02.A"
            title="PERSONALIZED SCORING PIPELINE"
            meta="(u, i) → SCORE"
            caption="For ORBIT, each customer-product pair is scored in latent space and ranked to produce Top-N unseen gift recommendations."
            className="h-full"
          >
            <svg viewBox="0 0 600 340" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              <motion.g
                initial={reduced ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <rect x="20" y="90" width="166" height="160" rx="3" fill="#08090D" stroke="#22D3EE" strokeOpacity="0.65" />
                <text x="103" y="116" textAnchor="middle" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.5">
                  INPUT PAIR (u, i)
                </text>
                <rect x="34" y="132" width="138" height="44" rx="2" fill="#11131A" stroke="#252834" />
                <text x="44" y="149" fill="#858A98" fontSize="9" fontFamily="JetBrains Mono">CUSTOMER u</text>
                <text x="44" y="166" fill="#F5F5F7" fontSize="11.5" fontFamily="JetBrains Mono">CUST-14911</text>

                <rect x="34" y="186" width="138" height="48" rx="2" fill="#11131A" stroke="#252834" />
                <text x="44" y="203" fill="#858A98" fontSize="9" fontFamily="JetBrains Mono">CANDIDATE ITEM i</text>
                <text x="44" y="220" fill="#F5F5F7" fontSize="10" fontFamily="JetBrains Mono">22782 · WICKER SET</text>
              </motion.g>

              <motion.line
                x1="186"
                y1="170"
                x2="230"
                y2="170"
                stroke="#22D3EE"
                strokeWidth="1.75"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              />
              <polygon points="230,165 240,170 230,175" fill="#22D3EE" />

              <motion.g
                initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.3 }}
              >
                <rect x="240" y="76" width="144" height="188" rx="4" fill="#A78BFA" fillOpacity="0.1" stroke="#A78BFA" strokeWidth="1.75" />
                <text x="312" y="106" textAnchor="middle" fill="#A78BFA" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.6">
                  ALS MODEL
                </text>
                <text x="312" y="168" textAnchor="middle" fill="#F5F5F7" fontSize="28" fontFamily="JetBrains Mono" fontWeight="600">
                  U · Vᵀ
                </text>
                <line x1="262" y1="196" x2="362" y2="196" stroke="#252834" />
                <text x="312" y="220" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  32 latent factors
                </text>
                <text x="312" y="238" textAnchor="middle" fill="#A78BFA" fontSize="9.5" fontFamily="JetBrains Mono">
                  learned from history
                </text>
              </motion.g>

              <motion.line
                x1="384"
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

              <motion.g
                initial={reduced ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.55 }}
              >
                <rect x="434" y="90" width="148" height="160" rx="3" fill="#08090D" stroke="#252834" />
                <text x="508" y="116" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.5">
                  RANKED OUTPUT
                </text>
                <text x="508" y="156" textAnchor="middle" fill="#22D3EE" fontSize="22" fontFamily="JetBrains Mono" fontWeight="600">
                  Top-N
                </text>
                <text x="508" y="182" textAnchor="middle" fill="#F5F5F7" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">
                  Unseen Products
                </text>
                <rect x="450" y="198" width="116" height="28" rx="2" fill="#11131A" stroke="#252834" />
                <text x="508" y="216" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  sorted by r̂ score
                </text>
              </motion.g>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
