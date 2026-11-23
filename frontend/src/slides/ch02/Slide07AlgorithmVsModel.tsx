import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 07 — Algorithm vs. Model */
export function Slide07AlgorithmVsModel() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2.2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 02 · PRECISION IN TERMINOLOGY"
          title={
            <>
              Algorithm <span className="text-[#858A98]">vs.</span>{' '}
              <span className="text-[#22D3EE]">Model</span>
            </>
          }
          subtitle="One is the optimization recipe before seeing transactions; the other is the trained factor artifact storing learned taste."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-[2cqw]">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="col-span-4 flex min-h-0 flex-col justify-between rounded-sm border border-[#252834] bg-[#11131A]/90 p-[clamp(14px,1.5cqw,22px)]"
          >
            <div>
              <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.2em] text-[#A78BFA] uppercase">
                01 · THE PROCEDURE
              </div>
              <h2 className="mt-2 font-display text-[clamp(20px,1.9cqw,28px)] font-semibold text-[#F5F5F7]">
                Algorithm
              </h2>
              <p className="mt-2 font-sans text-[clamp(11.5px,1cqw,14px)] leading-relaxed text-[#858A98]">
                Alternating Least Squares (ALS) — the iterative math procedure that solves regularized least-squares steps for latent factors.
              </p>
            </div>

            <div className="mt-3 rounded-sm border border-[#252834] bg-[#08090D] p-3 font-mono text-[clamp(9.5px,0.8cqw,11.5px)] text-[#A78BFA]">
              <div className="text-[#858A98]"># Unfitted specification</div>
              <div>AlternatingLeastSquares(k=32)</div>
              <div className="mt-1 text-[#858A98]">State: no customer or item factors</div>
            </div>
          </motion.div>

          <div className="col-span-4 flex min-h-0 flex-col">
            <DiagramFrame figure="FIG 02.B" title="TRAINING TRANSFORMATION" className="h-full">
              <svg viewBox="0 0 320 260" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <rect x="44" y="16" width="232" height="50" rx="3" fill="#08090D" stroke="#A78BFA" strokeOpacity="0.7" />
                <text x="160" y="38" textAnchor="middle" fill="#A78BFA" fontSize="10.5" fontFamily="JetBrains Mono">
                  ALS ALGORITHM
                </text>
                <text x="160" y="54" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="Inter">
                  factors · iterations · λ · α
                </text>

                <text x="160" y="86" textAnchor="middle" fill="#858A98" fontSize="16" fontFamily="JetBrains Mono">
                  +
                </text>

                <rect x="44" y="96" width="232" height="50" rx="3" fill="#08090D" stroke="#252834" />
                <text x="160" y="118" textAnchor="middle" fill="#F5F5F7" fontSize="10.5" fontFamily="JetBrains Mono">
                  SPARSE MATRIX R_train
                </text>
                <text x="160" y="134" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="Inter">
                  3,751 customers × 3,049 products
                </text>

                <motion.line
                  x1="160"
                  y1="146"
                  x2="160"
                  y2="184"
                  stroke="#22D3EE"
                  strokeWidth="1.75"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                />
                <polygon points="155,184 160,194 165,184" fill="#22D3EE" />
                <text x="172" y="174" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                  .fit()
                </text>

                <rect x="34" y="196" width="252" height="52" rx="3" fill="#22D3EE" fillOpacity="0.1" stroke="#22D3EE" strokeWidth="1.5" />
                <text x="160" y="218" textAnchor="middle" fill="#22D3EE" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
                  FITTED FACTOR MATRICES (U, V)
                </text>
                <text x="160" y="236" textAnchor="middle" fill="#F5F5F7" fontSize="9.5" fontFamily="Inter">
                  Ready for .recommend(customer_id)
                </text>
              </svg>
            </DiagramFrame>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="col-span-4 flex min-h-0 flex-col justify-between rounded-sm border border-[#22D3EE]/50 bg-[#11131A]/90 p-[clamp(14px,1.5cqw,22px)]"
          >
            <div>
              <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.2em] text-[#22D3EE] uppercase">
                02 · THE ARTIFACT
              </div>
              <h2 className="mt-2 font-display text-[clamp(20px,1.9cqw,28px)] font-semibold text-[#F5F5F7]">
                Model
              </h2>
              <p className="mt-2 font-sans text-[clamp(11.5px,1cqw,14px)] leading-relaxed text-[#858A98]">
                The concrete factor matrices U (customer embeddings) and V (product embeddings) learned from historical gift purchases.
              </p>
            </div>

            <div className="mt-3 rounded-sm border border-[#22D3EE]/35 bg-[#08090D] p-3 font-mono text-[clamp(9.5px,0.8cqw,11.5px)] text-[#22D3EE]">
              <div className="text-[#858A98]"># Learned representations in RAM</div>
              <div>U: (3751, 32) · V: (3049, 32)</div>
              <div className="mt-1 text-[#F5F5F7]">Fast dot-product inference</div>
            </div>
          </motion.div>
        </div>
      </div>
    </SlideLayout>
  )
}
