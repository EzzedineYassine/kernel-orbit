import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MetricCard } from '../../components/MetricCard'
import { useOrbitData } from '../../hooks/useOrbitData'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 13 — Chronological Train / Test Split (Zero Future Leakage) */
export function Slide13TrainTestSplit() {
  const reduced = useReducedMotion()
  const { summary } = useOrbitData()

  const trainTx = summary ? summary.train_transaction_rows.toLocaleString() : '— —'
  const testTx = summary ? summary.test_transaction_rows.toLocaleString() : '— —'
  const cutoff = summary ? summary.split_cutoff_date : 'LIVE CUTOFF (80%)'
  const warmUsers = summary ? summary.test_warm_eval_users.toLocaleString() : '— —'
  const coldUsers = summary ? summary.test_cold_start_users.toLocaleString() : '— —'

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2cqh]">
        <div className="flex items-end justify-between gap-6">
          <ChapterHeader
            eyebrow="CHAPTER 03 · TEMPORAL DISCIPLINE"
            title={
              <>
                Chronological <span className="text-[#22D3EE]">80 / 20</span> Split
              </>
            }
            subtitle="Never shuffle shopping history randomly. Train strictly on earlier months and evaluate on future unseen purchases."
            compact
          />

          <div className="flex shrink-0 gap-3">
            <MetricCard
              label="Warm Eval Users"
              value={summary ? warmUsers : null}
              note="Have train + unseen test buys"
              accent="secondary"
              slotLabel="Connect ORBIT backend"
              compact
            />
            <MetricCard
              label="Cold-Start Test"
              value={summary ? coldUsers : null}
              note="Zero training history"
              accent="primary"
              slotLabel="Connect ORBIT backend"
              compact
            />
          </div>
        </div>

        <DiagramFrame
          figure="FIG 03.C"
          title="TEMPORAL PARTITION"
          meta={`CUTOFF: ${cutoff}`}
          caption="Future invoices never leak into training thresholds, product catalogs, or ALS latent vectors."
          className="min-h-0 flex-1"
          bodyClassName="flex-col items-stretch justify-center gap-4 px-2"
        >
          {/* Timeline bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-mono text-[clamp(9.5px,0.78cqw,11px)] text-[#858A98]">
              <span>{summary?.date_min ?? '2010-12-01'}</span>
              <span className="text-[#22D3EE]">TEMPORAL CUTOFF · {cutoff}</span>
              <span>{summary?.date_max ?? '2011-12-09'}</span>
            </div>

            <div className="flex h-12 overflow-hidden rounded-sm border border-[#252834] bg-[#08090D]">
              <div className="relative flex w-[80%] shrink-0 items-center justify-between overflow-hidden border-r-2 border-[#22D3EE] px-4 font-mono text-[clamp(10px,0.85cqw,12px)]">
                <motion.span
                  initial={reduced ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  style={{ transformOrigin: 'left center' }}
                  className="pointer-events-none absolute inset-0 bg-[#A78BFA]/20"
                  aria-hidden
                />
                <span className="relative z-10 font-medium text-[#A78BFA]">
                  TRAINING WINDOW (EARLIER 80%)
                </span>
                <span className="relative z-10 text-[#F5F5F7] tabular-nums">{trainTx} rows</span>
              </div>

              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="flex w-[20%] shrink-0 flex-col items-center justify-center bg-[#22D3EE]/12 px-2 font-mono text-[clamp(9px,0.76cqw,11px)]"
              >
                <span className="font-medium text-[#22D3EE]">FUTURE 20%</span>
                <span className="text-[#F5F5F7] tabular-nums">{testTx}</span>
              </motion.div>
            </div>
          </div>

          {/* 2 structured rules */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-sm border border-[#A78BFA]/45 bg-[#A78BFA]/8 px-4 py-2.5">
              <div className="font-mono text-[clamp(9px,0.74cqw,10.5px)] tracking-[0.16em] text-[#A78BFA]">
                ZERO FUTURE LEAKAGE
              </div>
              <p className="mt-1 font-sans text-[clamp(11px,0.9cqw,13px)] text-[#F5F5F7]">
                Interaction thresholds (≥5), product descriptions, and ALS factor matrices are computed strictly on the earlier training window.
              </p>
            </div>
            <div className="rounded-sm border border-[#22D3EE]/45 bg-[#22D3EE]/8 px-4 py-2.5">
              <div className="font-mono text-[clamp(9px,0.74cqw,10.5px)] tracking-[0.16em] text-[#22D3EE]">
                UNSEEN FUTURE DISCOVERY
              </div>
              <p className="mt-1 font-sans text-[clamp(11px,0.9cqw,13px)] text-[#F5F5F7]">
                Already-purchased products are excluded from recommendations — evaluating true discovery of new products bought in the future window.
              </p>
            </div>
          </div>
        </DiagramFrame>
      </div>
    </SlideLayout>
  )
}
