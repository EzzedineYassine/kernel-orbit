import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MetricCard } from '../../components/MetricCard'
import { SplitLayout } from '../../components/SplitLayout'
import { useOrbitData } from '../../hooks/useOrbitData'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 25 — Catalog Coverage & Popularity Bias (Live ALS vs. Popularity) */
export function Slide25ConfusionMatrix() {
  const reduced = useReducedMotion()
  const { metrics, loading } = useOrbitData()
  const als = metrics?.als.at_10
  const pop = metrics?.popularity_baseline.at_10
  const catalogSize = metrics?.catalog_size ?? null
  const slotLabel = loading ? 'Loading live metrics…' : 'Start ORBIT backend (:8000)'

  const alsCovPct = als ? als.catalog_coverage * 100 : 0
  const popCovPct = pop ? pop.catalog_coverage * 100 : 0

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 06 · DISCOVERY VS. ECHO CHAMBER"
              title={
                <>
                  Catalog Coverage &amp; <span className="text-[#A78BFA]">Popularity Bias</span>
                </>
              }
              subtitle="A popularity baseline repeats the same handful of bestsellers to everyone. True personalization explores the long tail."
              compact
            />

            <div className="grid grid-cols-1 gap-2">
              <MetricCard
                label="ALS Catalog Coverage@10"
                value={als ? `${alsCovPct.toFixed(1)}%` : null}
                note={
                  als && catalogSize
                    ? `${als.recommended_unique_items.toLocaleString()} of ${catalogSize.toLocaleString()} SKUs surfaced`
                    : undefined
                }
                accent="secondary"
                slotLabel={slotLabel}
                compact
              />
              <MetricCard
                label="Popularity Baseline Coverage@10"
                value={pop ? `${popCovPct.toFixed(1)}%` : null}
                note={
                  pop && catalogSize
                    ? `Only ${pop.recommended_unique_items.toLocaleString()} bestsellers recommended`
                    : undefined
                }
                accent="neutral"
                slotLabel={slotLabel}
                compact
              />
              <MetricCard
                label="Avg Recommended Popularity Rank"
                value={als ? `#${als.avg_recommended_popularity_rank.toFixed(0)}` : null}
                note={
                  pop
                    ? `vs. #${pop.avg_recommended_popularity_rank.toFixed(1)} for Popularity (higher = deeper long-tail)`
                    : undefined
                }
                accent="primary"
                slotLabel={slotLabel}
                compact
              />
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 06.B"
            title="CATALOG REACH & LONG-TAIL DISCOVERY"
            meta={metrics ? `LIFT: ${metrics.lift_vs_popularity_at_10.catalog_coverage.toFixed(1)}× COVERAGE` : 'LIVE METRICS'}
            caption="Higher catalog coverage means shoppers discover relevant specialty gifts across the store instead of identical bestsellers."
            className="h-full"
            bodyClassName="flex-col items-stretch justify-center gap-5 px-3"
          >
            {/* Coverage comparison bars */}
            <div className="flex flex-col gap-3">
              <div>
                <div className="mb-1.5 flex items-center justify-between font-mono text-[clamp(9.5px,0.8cqw,11.5px)]">
                  <span className="text-[#22D3EE]">IMPLICIT ALS (PERSONALIZED)</span>
                  <span className="text-[#F5F5F7] tabular-nums">
                    {als ? `${alsCovPct.toFixed(2)}% · ${als.recommended_unique_items.toLocaleString()} SKUs` : '— —'}
                  </span>
                </div>
                <div className="h-9 w-full overflow-hidden rounded-sm border border-[#252834] bg-[#08090D]">
                  <motion.div
                    initial={reduced ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      width: `${Math.min(100, Math.max(als ? 4 : 0, alsCovPct * 2))}%`,
                      transformOrigin: 'left center',
                    }}
                    className="h-full border-r-2 border-[#22D3EE] bg-[#22D3EE]/25"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between font-mono text-[clamp(9.5px,0.8cqw,11.5px)]">
                  <span className="text-[#858A98]">POPULARITY BASELINE (NON-PERSONALIZED)</span>
                  <span className="text-[#858A98] tabular-nums">
                    {pop ? `${popCovPct.toFixed(2)}% · ${pop.recommended_unique_items.toLocaleString()} SKUs` : '— —'}
                  </span>
                </div>
                <div className="h-9 w-full overflow-hidden rounded-sm border border-[#252834] bg-[#08090D]">
                  <motion.div
                    initial={reduced ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    style={{
                      width: `${Math.min(100, Math.max(pop ? 2 : 0, popCovPct * 2))}%`,
                      transformOrigin: 'left center',
                    }}
                    className="h-full border-r-2 border-[#858A98] bg-[#858A98]/25"
                  />
                </div>
              </div>
            </div>

            {/* Long-tail distribution visual */}
            <svg viewBox="0 0 460 120" className="w-full" preserveAspectRatio="xMidYMid meet">
              <line x1="24" y1="96" x2="436" y2="96" stroke="#252834" />
              <path
                d="M 28 22 C 62 24, 92 66, 152 78 C 232 90, 326 92, 432 94"
                fill="none"
                stroke="#858A98"
                strokeWidth="1.5"
              />
              {/* Head zone (Popularity only) */}
              <rect x="28" y="16" width="44" height="80" fill="#858A98" fillOpacity="0.14" stroke="#858A98" strokeDasharray="3 3" />
              <text x="50" y="12" textAnchor="middle" fill="#858A98" fontSize="8.5" fontFamily="JetBrains Mono">
                POP HEAD
              </text>
              {/* ALS discovery zone */}
              <rect x="28" y="16" width="218" height="80" fill="#22D3EE" fillOpacity="0.08" stroke="#22D3EE" strokeDasharray="4 3" />
              <text x="158" y="42" textAnchor="middle" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                ALS PERSONALIZED LONG-TAIL REACH
              </text>
              <text x="230" y="112" textAnchor="middle" fill="#858A98" fontSize="9" fontFamily="JetBrains Mono">
                CATALOG PRODUCTS ORDERED BY POPULARITY (HEAD → TAIL)
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
