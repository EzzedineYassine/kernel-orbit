import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MathFormula } from '../../components/MathFormula'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 18 — The Mathematics of Matrix Factorization */
export function Slide18MatrixFactorizationMath() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="6/6"
        left={
          <div className="flex flex-col gap-[2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 04 · THE MATHEMATICS"
              title={
                <>
                  Matrix Factorization:{' '}
                  <span className="text-[#A78BFA]">R ≈ U × Vᵀ</span>
                </>
              }
              subtitle="Approximate the giant sparse interaction matrix as the product of two low-rank dense factor matrices."
              compact
            />

            <MathFormula
              label="Low-Rank Decomposition"
              compact
              formula={
                <span className="flex items-baseline gap-2.5">
                  <span className="text-[#F5F5F7]">R</span>
                  <span className="text-[#858A98]">≈</span>
                  <span className="text-[#22D3EE]">U</span>
                  <span className="text-[#858A98]">×</span>
                  <span className="text-[#A78BFA]">Vᵀ</span>
                  <span className="mx-2 text-[#252834]">|</span>
                  <span className="text-[0.82em] text-[#858A98]">r̂ᵤᵢ = uᵤᵀ vᵢ</span>
                </span>
              }
            />

            <MathFormula
              label="Implicit ALS Objective (Hu, Koren & Volinsky)"
              compact
              formula={
                <span className="flex flex-wrap items-center gap-1.5 text-[0.76em]">
                  <span className="text-[#858A98]">min</span>
                  <span className="text-[#A78BFA]">∑</span>
                  <sub className="text-[0.65em] text-[#858A98]">u,i</sub>
                  <span className="text-[#22D3EE]">C</span>
                  <sub className="text-[0.65em] text-[#858A98]">ui</sub>
                  <span>(pᵤᵢ − uᵤᵀvᵢ)²</span>
                  <span className="text-[#858A98]">+</span>
                  <span className="text-[#A78BFA]">λ</span>
                  <span>(‖U‖² + ‖V‖²)</span>
                </span>
              }
              annotations={[
                { symbol: 'pᵤᵢ ∈ {0,1}', meaning: 'Binary preference indicator', accent: 'neutral' },
                { symbol: 'Cᵤᵢ = 1+αrᵤᵢ', meaning: 'Implicit confidence weight', accent: 'secondary' },
                { symbol: 'λ', meaning: 'L₂ regularization penalty', accent: 'primary' },
              ]}
            />
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 04.C"
            title="LOW-RANK FACTOR GEOMETRY"
            meta="k ≪ min(m, n)"
            caption="Each entry r̂ᵤᵢ is reconstructed by taking the dot product of row u from U and column i from Vᵀ."
            className="h-full"
          >
            <svg viewBox="0 0 480 310" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Matrix R */}
              <motion.g
                initial={reduced ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <rect x="20" y="54" width="136" height="176" rx="3" fill="#08090D" stroke="#252834" strokeWidth="1.5" />
                <rect x="20" y="114" width="136" height="22" fill="#22D3EE" fillOpacity="0.12" />
                <rect x="92" y="54" width="22" height="176" fill="#A78BFA" fillOpacity="0.12" />
                <rect x="92" y="114" width="22" height="22" fill="#F5F5F7" fillOpacity="0.25" stroke="#F5F5F7" />
                <text x="103" y="129" textAnchor="middle" fill="#F5F5F7" fontSize="10" fontFamily="JetBrains Mono">r̂</text>
                <text x="88" y="42" textAnchor="middle" fill="#F5F5F7" fontSize="12" fontFamily="JetBrains Mono" fontWeight="600">
                  R (m × n)
                </text>
                <text x="88" y="252" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  3,751 × 3,049
                </text>
              </motion.g>

              <text x="178" y="148" textAnchor="middle" fill="#858A98" fontSize="20" fontFamily="JetBrains Mono">
                ≈
              </text>

              {/* Matrix U */}
              <motion.g
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <rect x="202" y="54" width="60" height="176" rx="3" fill="#22D3EE" fillOpacity="0.1" stroke="#22D3EE" strokeWidth="1.5" />
                <rect x="202" y="114" width="60" height="22" fill="#22D3EE" fillOpacity="0.35" stroke="#22D3EE" />
                <text x="232" y="129" textAnchor="middle" fill="#F5F5F7" fontSize="10" fontFamily="JetBrains Mono">uᵤ</text>
                <text x="232" y="42" textAnchor="middle" fill="#22D3EE" fontSize="12" fontFamily="JetBrains Mono" fontWeight="600">
                  U (m × k)
                </text>
                <text x="232" y="252" textAnchor="middle" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                  User factors
                </text>
              </motion.g>

              <text x="284" y="148" textAnchor="middle" fill="#858A98" fontSize="18" fontFamily="JetBrains Mono">
                ×
              </text>

              {/* Matrix V^T */}
              <motion.g
                initial={reduced ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <rect x="306" y="110" width="154" height="60" rx="3" fill="#A78BFA" fillOpacity="0.1" stroke="#A78BFA" strokeWidth="1.5" />
                <rect x="378" y="110" width="22" height="60" fill="#A78BFA" fillOpacity="0.38" stroke="#A78BFA" />
                <text x="389" y="144" textAnchor="middle" fill="#F5F5F7" fontSize="10" fontFamily="JetBrains Mono">vᵢ</text>
                <text x="383" y="96" textAnchor="middle" fill="#A78BFA" fontSize="12" fontFamily="JetBrains Mono" fontWeight="600">
                  Vᵀ (k × n)
                </text>
                <text x="383" y="192" textAnchor="middle" fill="#A78BFA" fontSize="9.5" fontFamily="JetBrains Mono">
                  Product factors
                </text>
              </motion.g>

              <text x="240" y="290" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                DEFAULT ORBIT RANK: k = 32 LATENT FACTORS
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
