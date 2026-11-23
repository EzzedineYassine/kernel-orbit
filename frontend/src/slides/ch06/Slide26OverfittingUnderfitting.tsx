import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MetricCard } from '../../components/MetricCard'
import { SplitLayout } from '../../components/SplitLayout'
import { useOrbitData } from '../../hooks/useOrbitData'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 26 — Chronological Holdout: ALS vs. Popularity & Cold-Start Accounting */
export function Slide26OverfittingUnderfitting() {
  const reduced = useReducedMotion()
  const { metrics, loading } = useOrbitData()
  const slotLabel = loading ? 'Loading live metrics…' : 'Start ORBIT backend (:8000)'

  const rows = metrics
    ? [
        { label: 'Precision@5', als: metrics.als.at_5.precision, pop: metrics.popularity_baseline.at_5.precision },
        { label: 'Precision@10', als: metrics.als.at_10.precision, pop: metrics.popularity_baseline.at_10.precision },
        { label: 'Recall@10', als: metrics.als.at_10.recall, pop: metrics.popularity_baseline.at_10.recall },
        { label: 'MAP@10', als: metrics.als.at_10.map, pop: metrics.popularity_baseline.at_10.map },
        { label: 'NDCG@10', als: metrics.als.at_10.ndcg, pop: metrics.popularity_baseline.at_10.ndcg },
      ]
    : []

  const maxVal = rows.length ? Math.max(...rows.flatMap((r) => [r.als, r.pop]), 0.01) : 0.1

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[1.8cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 06 · REAL HOLDOUT RESULTS"
              title={
                <>
                  ALS <span className="text-[#858A98]">vs.</span>{' '}
                  <span className="text-[#22D3EE]">Popularity Baseline</span>
                </>
              }
              subtitle="Every number below is computed live by the FastAPI backend on held-out future transactions — zero fabricated figures."
              compact
            />

            <div className="grid grid-cols-1 gap-2">
              <MetricCard
                label="Warm Users Evaluated"
                value={metrics ? metrics.evaluated_warm_users.toLocaleString() : null}
                note="Had training history + unseen future buys"
                accent="secondary"
                slotLabel={slotLabel}
                compact
              />
              <MetricCard
                label="Cold-Start Users Excluded"
                value={metrics ? metrics.excluded_cold_start_users.toLocaleString() : null}
                note="First appeared in test window (need fallback)"
                accent="primary"
                slotLabel={slotLabel}
                compact
              />
              <div className="rounded-sm border border-[#252834] bg-[#08090D] px-3.5 py-2.5 font-sans text-[clamp(10px,0.84cqw,12px)] leading-snug text-[#858A98]">
                <span className="font-mono text-[#A78BFA]">HONEST SCOPE:</span> Offline metrics reflect held-out historical orders, not a guarantee of live future clicks or revenue.
              </div>
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 06.C"
            title="LIVE CHRONOLOGICAL COMPARISON"
            meta={metrics ? `CUTOFF ${metrics.split_cutoff_date}` : 'CONNECTING TO API'}
            caption="ALS outperforms the non-personalized Popularity baseline across every top-K ranking metric on future unseen purchases."
            className="h-full"
            bodyClassName="flex-col items-stretch justify-center gap-3 px-3"
          >
            <div className="flex items-center justify-end gap-5 font-mono text-[clamp(9px,0.74cqw,10.5px)]">
              <span className="flex items-center gap-1.5 text-[#22D3EE]">
                <span className="h-2.5 w-3 rounded-xs bg-[#22D3EE]" /> Implicit ALS
              </span>
              <span className="flex items-center gap-1.5 text-[#858A98]">
                <span className="h-2.5 w-3 rounded-xs bg-[#858A98]/70" /> Popularity Baseline
              </span>
            </div>

            {rows.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-sm border border-dashed border-[#252834] bg-[#08090D] p-6 font-mono text-xs text-[#858A98]">
                {slotLabel}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {rows.map((row, idx) => {
                  const alsW = (row.als / maxVal) * 100
                  const popW = (row.pop / maxVal) * 100
                  const ratio = row.pop > 0 ? row.als / row.pop : 0
                  return (
                    <div key={row.label} className="grid grid-cols-12 items-center gap-2">
                      <div className="col-span-3 font-mono text-[clamp(9.5px,0.8cqw,11px)] text-[#F5F5F7]">
                        {row.label}
                      </div>
                      <div className="col-span-7 flex flex-col gap-1">
                        <div className="h-3.5 w-full overflow-hidden rounded-xs bg-[#08090D]">
                          <motion.div
                            initial={reduced ? false : { scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.45, delay: 0.08 + idx * 0.06 }}
                            style={{ width: `${alsW}%`, transformOrigin: 'left center' }}
                            className="h-full bg-[#22D3EE]/85"
                          />
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-xs bg-[#08090D]">
                          <motion.div
                            initial={reduced ? false : { scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.45, delay: 0.14 + idx * 0.06 }}
                            style={{ width: `${popW}%`, transformOrigin: 'left center' }}
                            className="h-full bg-[#858A98]/60"
                          />
                        </div>
                      </div>
                      <div className="col-span-2 text-right font-mono text-[clamp(9px,0.76cqw,10.5px)] tabular-nums">
                        <div className="text-[#22D3EE]">{(row.als * 100).toFixed(2)}%</div>
                        <div className="text-[#A78BFA]">{ratio.toFixed(2)}×</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
