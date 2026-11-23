import { Package, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useOrbitData } from '../hooks/useOrbitData'
import { orbitApi } from '../services/orbitApi'
import type { ProductSummary, SimilarProductsResponse } from '../types/orbit'

interface ProductExplorerPanelProps {
  selectedProductCode: string
  onSelectProduct: (code: string) => void
}

/**
 * Tab 2 — Product Explorer & ALS Item-to-Item Similarity (Section 9C).
 */
export function ProductExplorerPanel({
  selectedProductCode,
  onSelectProduct,
}: ProductExplorerPanelProps) {
  const { modelVersion } = useOrbitData()
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [totalMatches, setTotalMatches] = useState(0)
  const [similarData, setSimilarData] = useState<SimilarProductsResponse | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const timer = window.setTimeout(() => {
      orbitApi
        .searchProducts(query, 35)
        .then((res) => {
          if (!active) return
          setProducts(res.products)
          setTotalMatches(res.total_matches)
          if (!selectedProductCode && res.products.length > 0) {
            onSelectProduct(res.products[0].stock_code)
          }
        })
        .catch(() => {
          // Top-level lab displays offline banner
        })
    }, 140)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [query, selectedProductCode, onSelectProduct])

  useEffect(() => {
    if (!selectedProductCode) return
    let active = true
    orbitApi
      .similarProducts(selectedProductCode, 8)
      .then((res) => {
        if (!active) return
        setSimilarData(res)
        setErr(null)
      })
      .catch((e: unknown) => {
        if (!active) return
        setErr(e instanceof Error ? e.message : 'Unable to load similar products.')
      })
    return () => {
      active = false
    }
  }, [selectedProductCode, modelVersion])

  const factors = similarData?.item_factors.slice(0, 16) ?? []
  const maxFactor = factors.length ? Math.max(...factors.map((v) => Math.abs(v)), 0.01) : 1

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-3">
      {/* Left 5 cols: Catalog Search */}
      <div className="col-span-5 flex min-h-0 flex-col gap-2.5 rounded-sm border border-[#252834] bg-[#08090D]/90 p-3">
        <div className="flex shrink-0 items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-[#A78BFA] uppercase">
            <Package size={12} />
            <span>Catalog Search</span>
          </div>
          <span className="font-mono text-[9.5px] text-[#858A98] tabular-nums">
            {totalMatches.toLocaleString()} SKUs
          </span>
        </div>

        <div className="relative shrink-0">
          <Search size={12} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-[#858A98]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products (e.g. HEART, CANDLE, CAKE)…"
            aria-label="Search catalog products"
            className="w-full rounded-sm border border-[#252834] bg-[#11131A] py-1.5 pr-2 pl-7 font-mono text-[11px] text-[#F5F5F7] placeholder:text-[#858A98]/60 focus:border-[#A78BFA] focus:outline-none"
          />
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {products.map((prod) => {
            const active = prod.stock_code === selectedProductCode
            return (
              <button
                key={prod.stock_code}
                type="button"
                onClick={() => onSelectProduct(prod.stock_code)}
                className={`flex w-full items-center justify-between gap-2 rounded-xs border px-2.5 py-1.5 text-left transition-colors ${
                  active
                    ? 'border-[#A78BFA] bg-[#A78BFA]/12'
                    : 'border-[#252834]/70 bg-[#11131A]/75 hover:border-[#22D3EE]/55'
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate font-sans text-[11px] text-[#F5F5F7]">{prod.description}</div>
                  <div className="font-mono text-[9px] text-[#858A98]">
                    {prod.stock_code} · £{prod.avg_unit_price.toFixed(2)}
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[9.5px] text-[#A78BFA] tabular-nums">
                  {prod.train_customers} buyers
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right 7 cols: Selected Product Embedding + Similar Products */}
      <div className="col-span-7 flex min-h-0 flex-col gap-2.5 rounded-sm border border-[#252834] bg-[#08090D]/90 p-3">
        {err && (
          <div className="rounded-sm border border-[#A78BFA]/50 bg-[#A78BFA]/10 px-3 py-2 font-mono text-[11px] text-[#F5F5F7]">
            {err}
          </div>
        )}

        {similarData && (
          <>
            <div className="shrink-0 rounded-sm border border-[#A78BFA]/45 bg-[#11131A] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[9.5px] tracking-[0.16em] text-[#A78BFA]">
                    SKU {similarData.product.stock_code} · SELECTED PRODUCT
                  </div>
                  <h3 className="mt-0.5 truncate font-display text-[15px] font-semibold text-[#F5F5F7]">
                    {similarData.product.description}
                  </h3>
                </div>
                <div className="shrink-0 text-right font-mono text-[10px] text-[#858A98]">
                  <div className="text-[#22D3EE]">{similarData.product.train_customers} unique buyers</div>
                  <div>
                    {similarData.product.train_purchases} orders · £{similarData.product.avg_unit_price.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <div className="mb-1 font-mono text-[9px] text-[#858A98]">
                  LEARNED ITEM EMBEDDING vᵢ (FIRST 16 OF {similarData.item_factors.length} FACTORS)
                </div>
                <div className="grid h-6 grid-cols-16 items-center gap-0.5 rounded-xs bg-[#08090D] px-1">
                  {factors.map((val, idx) => (
                    <div key={idx} className="flex h-full items-center" title={`f${idx + 1}: ${val}`}>
                      <span
                        style={{ height: `${Math.max(8, (Math.abs(val) / maxFactor) * 95)}%` }}
                        className={`w-full rounded-[1px] ${val >= 0 ? 'bg-[#A78BFA]/85' : 'bg-[#22D3EE]/80'}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <div className="mb-1.5 flex shrink-0 items-center justify-between font-mono text-[9.5px] tracking-[0.14em] text-[#22D3EE] uppercase">
                <span>Nearest Products in ALS Latent Space (similar_items)</span>
                <span className="text-[#858A98]">COSINE SIMILARITY</span>
              </div>

              <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
                {similarData.similar_products.map((sp, idx) => (
                  <button
                    key={sp.stock_code}
                    type="button"
                    onClick={() => onSelectProduct(sp.stock_code)}
                    className="flex w-full items-center justify-between gap-3 rounded-sm border border-[#252834] bg-[#11131A]/90 px-3 py-2 text-left transition-colors hover:border-[#22D3EE]/60"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="w-5 shrink-0 font-mono text-[10.5px] text-[#A78BFA]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-sans text-[12px] text-[#F5F5F7]">{sp.description}</div>
                        <div className="font-mono text-[9.5px] text-[#858A98]">
                          SKU {sp.stock_code} · {sp.train_customers} buyers · £{sp.avg_unit_price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-xs bg-[#08090D]">
                        <div
                          style={{ width: `${Math.max(5, Math.min(100, sp.similarity_score * 100))}%` }}
                          className="h-full bg-[#22D3EE]"
                        />
                      </div>
                      <span className="w-11 text-right font-mono text-[10.5px] text-[#22D3EE] tabular-nums">
                        {sp.similarity_score.toFixed(3)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
