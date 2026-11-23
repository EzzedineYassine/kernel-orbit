import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MathFormula } from '../../components/MathFormula'
import { SplitLayout } from '../../components/SplitLayout'
import { useOrbitData } from '../../hooks/useOrbitData'
import { SlideLayout } from '../../presentation/SlideLayout'

const MATRIX_USERS = ['CUST-14911', 'CUST-12748', 'CUST-17841', 'CUST-14606', 'CUST-15311'] as const
const MATRIX_ITEMS = ['85123A', '22423', '47566', '22720', '20725', '21620'] as const
const MATRIX_CELLS: readonly (readonly (number | null)[])[] = [
  [2.1, 1.4, null, 1.1, null, null],
  [null, 1.8, 1.1, null, 2.3, null],
  [1.4, null, 1.8, null, null, 0.7],
  [null, null, null, 1.6, 1.1, null],
  [1.1, 0.7, null, null, null, 1.4],
]

/** Slide 17 — The Customer-Product Interaction Matrix */
export function Slide17InteractionMatrix() {
  const reduced = useReducedMotion()
  const { summary } = useOrbitData()

  const usersStr = summary ? summary.num_users.toLocaleString() : '3,751'
  const itemsStr = summary ? summary.num_items.toLocaleString() : '3,049'
  const nnzStr = summary ? summary.train_interactions.toLocaleString() : '220,566'
  const sparsityStr = summary ? `${(summary.matrix_sparsity * 100).toFixed(2)}%` : '98.07%'

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 04 · THE INTERACTION MATRIX"
              title={
                <>
                  Customer × Product <span className="text-[#A78BFA]">Matrix R</span>
                </>
              }
              subtitle="Every customer is a row, every product is a column, and every cell records implicit purchase strength."
              compact
            />

            <MathFormula
              label="Sparse Implicit Matrix"
              compact
              formula={
                <span className="flex items-baseline gap-2.5 text-[0.9em]">
                  <span className="text-[#22D3EE]">R</span>
                  <span className="text-[#858A98]">∈</span>
                  <span>
                    ℝ<sup className="text-[0.65em] text-[#A78BFA]">m × n</sup>
                  </span>
                </span>
              }
              annotations={[
                { symbol: `m = ${usersStr}`, meaning: 'Active customers', accent: 'secondary' },
                { symbol: `n = ${itemsStr}`, meaning: 'Merchandise SKUs', accent: 'primary' },
                { symbol: sparsityStr, meaning: 'Empty unobserved entries', accent: 'neutral' },
              ]}
            />

            <p className="font-sans text-[clamp(11px,0.92cqw,13px)] leading-relaxed text-[#858A98]">
              Only <span className="font-mono text-[#22D3EE]">{nnzStr}</span> pairs have recorded purchases. The remaining{' '}
              <span className="font-mono text-[#F5F5F7]">?</span> cells are unknown opportunities — the exact targets ORBIT scores.
            </p>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 04.B"
            title="OBSERVED VS. UNOBSERVED ENTRIES"
            meta={`${sparsityStr} SPARSE`}
            caption="Bright cells encode log(1 + purchases); empty '?' cells represent unseen candidate products to rank."
            className="h-full"
            bodyClassName="flex-col items-stretch justify-center px-2"
          >
            <div className="flex w-full flex-col gap-2">
              <div className="grid grid-cols-7 gap-1.5 font-mono text-[clamp(8.5px,0.72cqw,10px)] text-[#858A98]">
                <div className="text-right pr-1 text-[#22D3EE]">u \ i</div>
                {MATRIX_ITEMS.map((code) => (
                  <div key={code} className="text-center text-[#A78BFA]">
                    {code}
                  </div>
                ))}
              </div>

              {MATRIX_USERS.map((uid, r) => (
                <div key={uid} className="grid grid-cols-7 items-center gap-1.5">
                  <div className="truncate pr-1 text-right font-mono text-[clamp(8.5px,0.72cqw,10px)] text-[#F5F5F7]">
                    {uid}
                  </div>
                  {MATRIX_CELLS[r].map((val, c) => (
                    <motion.div
                      key={`${r}-${c}`}
                      initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: 0.06 + (r + c) * 0.025 }}
                      className={`flex h-[6.2cqh] items-center justify-center rounded-sm border font-mono text-[clamp(9.5px,0.82cqw,11.5px)] tabular-nums ${
                        val !== null
                          ? 'border-[#22D3EE]/65 bg-[#22D3EE]/16 text-[#22D3EE]'
                          : 'border-[#252834]/70 bg-[#08090D] text-[#858A98]/40'
                      }`}
                    >
                      {val !== null ? val.toFixed(1) : '?'}
                    </motion.div>
                  ))}
                </div>
              ))}

              <div className="mt-1 flex items-center justify-between font-mono text-[clamp(9px,0.74cqw,10.5px)] text-[#858A98]">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-xs border border-[#22D3EE] bg-[#22D3EE]/25" />
                  Observed implicit interaction rᵤᵢ
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-xs border border-[#252834] bg-[#08090D]" />
                  Unobserved candidate (?)
                </span>
              </div>
            </div>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
