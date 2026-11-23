import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { useOrbitData } from '../../hooks/useOrbitData'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 15 — From Sparse Matrix to Dense Latent Representations */
export function Slide15LazyLearning() {
  const reduced = useReducedMotion()
  const { summary } = useOrbitData()

  const sparsityPct = summary ? `${(summary.matrix_sparsity * 100).toFixed(2)}%` : '98.07%'
  const cells = summary
    ? `${(summary.num_users * summary.num_items).toLocaleString()}`
    : '11,436,799'

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 03 · COMPRESSING SPARSITY"
              title={
                <>
                  Sparse matrix in,{' '}
                  <span className="text-[#22D3EE]">dense embeddings</span> out.
                </>
              }
              subtitle="Almost every cell in a retail user–item matrix is empty. Matrix factorization compresses millions of sparse entries into compact vectors."
              compact
            />

            <div className="flex flex-col gap-2.5">
              <div className="rounded-sm border border-[#252834] bg-[#11131A]/85 px-4 py-3">
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#858A98] uppercase">
                  AT TRAINING TIME (.fit)
                </div>
                <p className="mt-1 font-sans text-[clamp(11.5px,0.96cqw,13.5px)] text-[#F5F5F7]">
                  ALS solves 20 alternating optimization steps over {cells} possible pairs ({sparsityPct} empty) to learn compact k-dimensional factors.
                </p>
              </div>
              <div className="rounded-sm border border-[#22D3EE]/50 bg-[#11131A]/85 px-4 py-3">
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#22D3EE] uppercase">
                  AT SERVING TIME (.recommend)
                </div>
                <p className="mt-1 font-sans text-[clamp(11.5px,0.96cqw,13.5px)] text-[#F5F5F7]">
                  The trained U and V matrices stay loaded in RAM — scoring all 3,049 products for a customer takes less than 1 millisecond.
                </p>
              </div>
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 03.F"
            title="REPRESENTATION COMPRESSION"
            meta={`${sparsityPct} SPARSE → DENSE k=32`}
            caption="Training is paid once up front; live recommendations require only fast vector dot products, never retraining per request."
            className="h-full"
          >
            <svg viewBox="0 0 580 320" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              <text x="115" y="34" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.4">
                SPARSE CSR MATRIX R
              </text>
              <rect x="24" y="48" width="182" height="196" rx="3" fill="#08090D" stroke="#252834" />
              {[0, 1, 2, 3, 4, 5].map((r) =>
                [0, 1, 2, 3, 4, 5].map((c) => {
                  const filled = (r * 7 + c * 3) % 11 === 0 || (r === 2 && c === 4)
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={38 + c * 26}
                      y={62 + r * 28}
                      width="18"
                      height="18"
                      rx="1.5"
                      fill={filled ? '#22D3EE' : '#11131A'}
                      fillOpacity={filled ? 0.7 : 0.7}
                      stroke="#252834"
                    />
                  )
                }),
              )}
              <text x="115" y="268" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                3,751 × 3,049 (98.1% empty)
              </text>

              <motion.line
                x1="214"
                y1="146"
                x2="276"
                y2="146"
                stroke="#22D3EE"
                strokeWidth="1.75"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <polygon points="276,141 286,146 276,151" fill="#22D3EE" />
              <text x="248" y="134" textAnchor="middle" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                ALS .fit()
              </text>

              <motion.g
                initial={reduced ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.3 }}
              >
                <text x="336" y="34" textAnchor="middle" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono">
                  USERS U
                </text>
                <rect x="296" y="48" width="80" height="196" rx="3" fill="#22D3EE" fillOpacity="0.14" stroke="#22D3EE" strokeWidth="1.5" />
                <text x="336" y="150" textAnchor="middle" fill="#F5F5F7" fontSize="12" fontFamily="JetBrains Mono">
                  3751 × 32
                </text>

                <text x="404" y="152" textAnchor="middle" fill="#858A98" fontSize="18" fontFamily="JetBrains Mono">
                  ×
                </text>

                <text x="492" y="96" textAnchor="middle" fill="#A78BFA" fontSize="10" fontFamily="JetBrains Mono">
                  PRODUCTS Vᵀ
                </text>
                <rect x="428" y="110" width="128" height="72" rx="3" fill="#A78BFA" fillOpacity="0.14" stroke="#A78BFA" strokeWidth="1.5" />
                <text x="492" y="150" textAnchor="middle" fill="#F5F5F7" fontSize="12" fontFamily="JetBrains Mono">
                  32 × 3049
                </text>
              </motion.g>

              <text x="426" y="268" textAnchor="middle" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                ~52× FEWER PARAMETERS THAN FULL MATRIX
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
