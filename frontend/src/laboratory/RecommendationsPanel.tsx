import { RefreshCw, Search, Shuffle, Sparkles, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useOrbitData } from '../hooks/useOrbitData'
import { orbitApi } from '../services/orbitApi'
import type {
  CustomerHistoryResponse,
  CustomerSummary,
  RecommendationsResponse,
} from '../types/orbit'

interface RecommendationsPanelProps {
  selectedCustomerId: string
  onSelectCustomer: (id: string) => void
  onInspectProduct: (stockCode: string) => void
}

/**
 * Tab 1 — Customer Explorer (Section 9A) + ALS Recommendation Engine (Section 9B).
 */
export function RecommendationsPanel({
  selectedCustomerId,
  onSelectCustomer,
  onInspectProduct,
}: RecommendationsPanelProps) {
  const { modelVersion } = useOrbitData()
  const [search, setSearch] = useState('')
  const [customers, setCustomers] = useState<CustomerSummary[]>([])
  const [topN, setTopN] = useState<5 | 10>(10)
  const [historyData, setHistoryData] = useState<CustomerHistoryResponse | null>(null)
  const [recData, setRecData] = useState<RecommendationsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // Fetch customer directory whenever search changes.
  useEffect(() => {
    let active = true
    const timer = window.setTimeout(() => {
      orbitApi
        .customers(search, 40)
        .then((res) => {
          if (!active) return
          setCustomers(res.customers)
          if (!selectedCustomerId && res.customers.length > 0) {
            onSelectCustomer(res.customers[0].customer_id)
          }
        })
        .catch(() => {
          // Top-level lab handles offline banner
        })
    }, 140)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [search, selectedCustomerId, onSelectCustomer])

  // Fetch selected customer's purchase history + live ALS recommendations.
  useEffect(() => {
    if (!selectedCustomerId) return
    let active = true
    Promise.all([
      orbitApi.customerHistory(selectedCustomerId, 20),
      orbitApi.recommendations(selectedCustomerId, topN),
    ])
      .then(([hist, recs]) => {
        if (!active) return
        setHistoryData(hist)
        setRecData(recs)
        setErr(null)
      })
      .catch((e: unknown) => {
        if (!active) return
        setErr(e instanceof Error ? e.message : 'Failed to load recommendations.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [selectedCustomerId, topN, modelVersion])

  const handleSelect = (cid: string) => {
    setLoading(true)
    onSelectCustomer(cid)
  }

  const handleRandomCustomer = () => {
    if (customers.length < 2) return
    const others = customers.filter((c) => c.customer_id !== selectedCustomerId)
    const pick = others[Math.floor(Math.random() * others.length)]
    if (pick) handleSelect(pick.customer_id)
  }

  const maxScore = recData?.recommendations.length
    ? Math.max(...recData.recommendations.map((r) => Math.abs(r.score)), 0.01)
    : 1

  const latentPreview = historyData?.latent_factors.slice(0, 16) ?? []
  const maxFactor = latentPreview.length
    ? Math.max(...latentPreview.map((v) => Math.abs(v)), 0.01)
    : 1

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-3">
      {/* Left 5 cols: Customer Explorer + History + Latent Vector */}
      <div className="col-span-5 flex min-h-0 flex-col gap-2.5 rounded-sm border border-[#252834] bg-[#08090D]/90 p-3">
        <div className="flex shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-[#22D3EE] uppercase">
            <User size={12} />
            <span>Customer Explorer</span>
          </div>
          <button
            type="button"
            onClick={handleRandomCustomer}
            className="flex items-center gap-1 rounded-sm border border-[#252834] bg-[#11131A] px-2 py-0.5 font-mono text-[9.5px] text-[#858A98] transition-colors hover:border-[#22D3EE]/60 hover:text-[#F5F5F7]"
          >
            <Shuffle size={10} />
            <span>Random</span>
          </button>
        </div>

        {/* Search + dropdown selector */}
        <div className="flex shrink-0 gap-2">
          <div className="relative flex-1">
            <Search size={12} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-[#858A98]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter CUST-ID or country…"
              aria-label="Filter customers"
              className="w-full rounded-sm border border-[#252834] bg-[#11131A] py-1.5 pr-2 pl-7 font-mono text-[11px] text-[#F5F5F7] placeholder:text-[#858A98]/60 focus:border-[#22D3EE] focus:outline-none"
            />
          </div>
          <select
            aria-label="Select customer"
            value={selectedCustomerId}
            onChange={(e) => handleSelect(e.target.value)}
            className="w-[46%] rounded-sm border border-[#252834] bg-[#11131A] px-2 py-1.5 font-mono text-[11px] text-[#F5F5F7] focus:border-[#22D3EE] focus:outline-none"
          >
            {customers.map((c) => (
              <option key={c.customer_id} value={c.customer_id}>
                {c.customer_id} ({c.unique_products} SKUs)
              </option>
            ))}
          </select>
        </div>

        {/* Customer stats + latent representation sparkline */}
        {historyData && (
          <div className="shrink-0 rounded-sm border border-[#252834] bg-[#11131A] p-2.5">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="font-semibold text-[#F5F5F7]">
                {historyData.customer.customer_id}
                <span className="ml-2 font-normal text-[#858A98]">{historyData.customer.country}</span>
              </span>
              <span className="text-[#A78BFA]">
                {historyData.customer.unique_products} SKUs · {historyData.customer.total_invoices} orders
              </span>
            </div>

            {/* Latent factor vector sparkline */}
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between font-mono text-[9px] text-[#858A98]">
                <span>LEARNED USER EMBEDDING uᵤ (FIRST 16 OF {historyData.latent_factors.length} FACTORS)</span>
                <span className="text-[#22D3EE]">‖uᵤ‖ = {historyData.latent_norm.toFixed(2)}</span>
              </div>
              <div className="grid h-7 grid-cols-16 items-center gap-0.5 rounded-xs bg-[#08090D] px-1">
                {latentPreview.map((val, idx) => {
                  const pct = Math.max(8, (Math.abs(val) / maxFactor) * 95)
                  return (
                    <div key={idx} className="relative flex h-full items-center justify-center" title={`f${idx + 1}: ${val}`}>
                      <span
                        style={{ height: `${pct}%` }}
                        className={`w-full rounded-[1px] ${val >= 0 ? 'bg-[#22D3EE]/80' : 'bg-[#A78BFA]/80'}`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Historical Purchased Products (scrollable inside interactive zone) */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-1 flex shrink-0 items-center justify-between font-mono text-[9.5px] tracking-[0.14em] text-[#858A98] uppercase">
            <span>Training Purchase History</span>
            <span>{historyData ? `${historyData.history.length} shown` : '—'}</span>
          </div>
          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
            {historyData?.history.map((item) => (
              <button
                key={item.stock_code}
                type="button"
                onClick={() => onInspectProduct(item.stock_code)}
                className="flex w-full items-center justify-between gap-2 rounded-xs border border-[#252834]/70 bg-[#11131A]/75 px-2.5 py-1.5 text-left transition-colors hover:border-[#A78BFA]/60"
              >
                <div className="min-w-0">
                  <div className="truncate font-sans text-[11px] text-[#F5F5F7]">{item.description}</div>
                  <div className="font-mono text-[9px] text-[#858A98]">
                    {item.stock_code} · {item.purchase_count}× orders · qty {item.total_quantity}
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[9.5px] text-[#22D3EE] tabular-nums">
                  r={item.interaction_strength.toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Similar customers */}
        {historyData && historyData.similar_customers.length > 0 && (
          <div className="shrink-0 border-t border-[#252834]/70 pt-2">
            <div className="mb-1 font-mono text-[9px] tracking-[0.14em] text-[#858A98] uppercase">
              Similar Customers in Latent Space (click to switch)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {historyData.similar_customers.slice(0, 4).map((sc) => (
                <button
                  key={sc.customer_id}
                  type="button"
                  onClick={() => handleSelect(sc.customer_id)}
                  className="rounded-xs border border-[#252834] bg-[#11131A] px-2 py-0.5 font-mono text-[9.5px] text-[#F5F5F7] transition-colors hover:border-[#22D3EE]"
                >
                  {sc.customer_id}{' '}
                  <span className="text-[#22D3EE]">{sc.similarity_score.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right 7 cols: Live Personalized ALS Recommendations */}
      <div className="col-span-7 flex min-h-0 flex-col gap-2.5 rounded-sm border border-[#252834] bg-[#08090D]/90 p-3">
        <div className="flex shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-[#A78BFA]" />
            <span className="font-mono text-[10px] tracking-[0.16em] text-[#F5F5F7] uppercase">
              Live ALS Top-{topN} Recommendations
            </span>
            {recData && (
              <span className="rounded-xs border border-[#252834] bg-[#11131A] px-1.5 py-0.5 font-mono text-[9px] text-[#858A98]">
                {recData.excluded_purchased_count} bought items excluded
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {([5, 10] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setTopN(n)}
                className={`rounded-xs border px-2 py-0.5 font-mono text-[10px] transition-colors ${
                  topN === n
                    ? 'border-[#22D3EE] bg-[#22D3EE]/15 text-[#22D3EE]'
                    : 'border-[#252834] bg-[#11131A] text-[#858A98] hover:text-[#F5F5F7]'
                }`}
              >
                Top {n}
              </button>
            ))}
          </div>
        </div>

        {err && (
          <div className="rounded-sm border border-[#A78BFA]/50 bg-[#A78BFA]/10 px-3 py-2 font-mono text-[11px] text-[#F5F5F7]">
            {err}
          </div>
        )}

        <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
          {loading && !recData ? (
            <div className="flex h-full items-center justify-center gap-2 font-mono text-xs text-[#858A98]">
              <RefreshCw size={14} className="animate-spin text-[#22D3EE]" />
              <span>Scoring catalog with ALS…</span>
            </div>
          ) : (
            recData?.recommendations.map((rec) => {
              const barPct = Math.max(8, (Math.max(0, rec.score) / maxScore) * 100)
              return (
                <button
                  key={rec.stock_code}
                  type="button"
                  onClick={() => onInspectProduct(rec.stock_code)}
                  className="group flex w-full flex-col gap-1.5 rounded-sm border border-[#252834] bg-[#11131A]/90 px-3 py-2 text-left transition-colors hover:border-[#22D3EE]/65"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="w-6 shrink-0 font-mono text-[11px] font-semibold text-[#22D3EE] tabular-nums">
                        #{String(rec.rank).padStart(2, '0')}
                      </span>
                      <span className="truncate font-display text-[12.5px] font-medium text-[#F5F5F7] group-hover:text-[#22D3EE]">
                        {rec.description}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {rec.in_chronological_test && (
                        <span className="rounded-xs border border-[#A78BFA]/70 bg-[#A78BFA]/15 px-1.5 py-0.5 font-mono text-[8.5px] tracking-[0.1em] text-[#A78BFA]">
                          BOUGHT IN TEST
                        </span>
                      )}
                      <span className="font-mono text-[11px] font-medium text-[#22D3EE] tabular-nums">
                        {rec.score.toFixed(3)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-xs bg-[#08090D]">
                      <div
                        style={{ width: `${barPct}%` }}
                        className="h-full bg-gradient-to-r from-[#A78BFA] to-[#22D3EE]"
                      />
                    </div>
                    <span className="shrink-0 font-mono text-[9.5px] text-[#858A98] tabular-nums">
                      SKU {rec.stock_code} · {rec.train_customers} buyers · £{rec.avg_unit_price.toFixed(2)}
                    </span>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
