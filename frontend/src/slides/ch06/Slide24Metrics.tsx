import { ChapterHeader } from '../../components/ChapterHeader'
import { MathFormula } from '../../components/MathFormula'
import { MetricCard } from '../../components/MetricCard'
import { useOrbitData } from '../../hooks/useOrbitData'
import { SlideLayout } from '../../presentation/SlideLayout'

const pct = (v: number) => `${(v * 100).toFixed(2)}%`

/** Slide 24 — Recommender Ranking Metrics: Precision@K, Recall@K, MAP@K & NDCG@K */
export function Slide24Metrics() {
  const { metrics, loading } = useOrbitData()
  const als = metrics?.als.at_10
  const pop = metrics?.popularity_baseline.at_10
  const lift = metrics?.lift_vs_popularity_at_10

  const slotLabel = loading ? 'Loading live metrics…' : 'Start ORBIT backend (:8000)'

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col justify-between gap-[1.7cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 06 · RANKING METRICS"
          title={
            <>
              Precision@K, Recall@K, MAP@K &amp; <span className="text-[#22D3EE]">NDCG@K</span>
            </>
          }
          subtitle="Top-K ranking metrics measure both hit rate and whether the most relevant unseen products rise to the top of the list."
          compact
        />

        <div className="grid grid-cols-2 gap-[1.3cqw]">
          <MathFormula
            label="Precision@K · Top-K Hit Purity"
            compact
            formula={
              <span className="flex items-center gap-2 text-[0.8em]">
                <span className="text-[#22D3EE]">P@K</span>
                <span className="text-[#858A98]">=</span>
                <span className="inline-flex flex-col items-center leading-none">
                  <span className="border-b border-[#858A98] px-1.5 pb-1">|Relevant ∩ Top-K|</span>
                  <span className="pt-1 text-[#858A98]">K</span>
                </span>
              </span>
            }
          />
          <MathFormula
            label="Recall@K · Unseen Purchase Capture"
            compact
            formula={
              <span className="flex items-center gap-2 text-[0.8em]">
                <span className="text-[#A78BFA]">R@K</span>
                <span className="text-[#858A98]">=</span>
                <span className="inline-flex flex-col items-center leading-none">
                  <span className="border-b border-[#858A98] px-1.5 pb-1">|Relevant ∩ Top-K|</span>
                  <span className="pt-1 text-[#858A98]">|Relevant Future Buys|</span>
                </span>
              </span>
            }
          />
          <MathFormula
            label="MAP@K · Mean Average Precision"
            compact
            formula={
              <span className="flex items-center gap-2 text-[0.8em]">
                <span className="text-[#22D3EE]">AP@K</span>
                <span className="text-[#858A98]">=</span>
                <span className="text-[#858A98]">(1 / min(|Rel|,K)) ·</span>
                <span>∑ P@r · rel(r)</span>
              </span>
            }
          />
          <MathFormula
            label="NDCG@K · Position-Discounted Gain"
            compact
            formula={
              <span className="flex items-center gap-2 text-[0.8em]">
                <span className="text-[#A78BFA]">NDCG@K</span>
                <span className="text-[#858A98]">=</span>
                <span className="inline-flex flex-col items-center leading-none">
                  <span className="border-b border-[#858A98] px-1.5 pb-1">∑ rel(r) / log₂(r+1)</span>
                  <span className="pt-1 text-[#858A98]">IDCG@K</span>
                </span>
              </span>
            }
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-sm border border-[#A78BFA]/40 bg-[#11131A]/90 px-4 py-2 font-mono text-[clamp(9px,0.76cqw,11px)]">
          <span className="text-[#858A98]">
            <span className="text-[#A78BFA]">LIVE CHRONOLOGICAL HOLDOUT @10:</span>{' '}
            {metrics
              ? `Evaluated on ${metrics.evaluated_warm_users.toLocaleString()} warm users (k=${metrics.config.factors}, iter=${metrics.config.iterations}, λ=${metrics.config.regularization})`
              : 'Live metrics populate automatically when the ORBIT FastAPI backend is running.'}
          </span>
          <span className="shrink-0 text-[#22D3EE]">
            {lift ? `NDCG LIFT: ${lift.ndcg.toFixed(2)}× vs POP` : 'LIVE API'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-[1.3cqw]">
          <MetricCard
            label="ALS Precision@10"
            value={als ? pct(als.precision) : null}
            note={pop && lift ? `Pop: ${pct(pop.precision)} (${lift.precision.toFixed(2)}×)` : undefined}
            accent="secondary"
            slotLabel={slotLabel}
            compact
          />
          <MetricCard
            label="ALS Recall@10"
            value={als ? pct(als.recall) : null}
            note={pop && lift ? `Pop: ${pct(pop.recall)} (${lift.recall.toFixed(2)}×)` : undefined}
            accent="primary"
            slotLabel={slotLabel}
            compact
          />
          <MetricCard
            label="ALS MAP@10"
            value={als ? pct(als.map) : null}
            note={pop && lift ? `Pop: ${pct(pop.map)} (${lift.map.toFixed(2)}×)` : undefined}
            accent="secondary"
            slotLabel={slotLabel}
            compact
          />
          <MetricCard
            label="ALS NDCG@10"
            value={als ? pct(als.ndcg) : null}
            note={pop && lift ? `Pop: ${pct(pop.ndcg)} (${lift.ndcg.toFixed(2)}×)` : undefined}
            accent="primary"
            slotLabel={slotLabel}
            compact
          />
        </div>
      </div>
    </SlideLayout>
  )
}
