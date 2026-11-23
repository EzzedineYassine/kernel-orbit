import { useEffect, useState } from 'react'
import { useOrbitData } from '../hooks/useOrbitData'
import { orbitApi } from '../services/orbitApi'
import type { LatentPoint, LatentSpaceResponse } from '../types/orbit'

interface LatentSpacePanelProps {
  selectedCustomerId: string
  onSelectCustomer: (id: string) => void
  onInspectProduct: (code: string) => void
}

/**
 * Tab 3 — Model Explanation: Real Sparse Submatrix Heatmap + 2D PCA Projection
 * of Learned ALS Latent Space (Section 9E).
 */
export function LatentSpacePanel({
  selectedCustomerId,
  onSelectCustomer,
  onInspectProduct,
}: LatentSpacePanelProps) {
  const { summary, modelVersion } = useOrbitData()
  const [space, setSpace] = useState<LatentSpaceResponse | null>(null)
  const [hovered, setHovered] = useState<LatentPoint | null>(null)

  useEffect(() => {
    let active = true
    orbitApi
      .latentSpace(selectedCustomerId || undefined, 130, 65)
      .then((res) => {
        if (active) setSpace(res)
      })
      .catch(() => {
        // Offline handled by parent
      })
    return () => {
      active = false
    }
  }, [selectedCustomerId, modelVersion])

  // Compute SVG scatter bounds cleanly.
  const pts = space?.points ?? []
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)
  const minX = xs.length ? Math.min(...xs) : -1
  const maxX = xs.length ? Math.max(...xs) : 1
  const minY = ys.length ? Math.min(...ys) : -1
  const maxY = ys.length ? Math.max(...ys) : 1
  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1

  const toSvgX = (x: number) => 38 + ((x - minX) / spanX) * 444
  const toSvgY = (y: number) => 270 - ((y - minY) / spanY) * 234

  const activeUserPoint = pts.find((p) => p.kind === 'customer' && p.is_highlighted)
  const highlightedProducts = pts.filter((p) => p.kind === 'product' && p.is_highlighted)

  const sampleMatrix = summary?.sample_matrix
  const maxCellVal = sampleMatrix
    ? Math.max(...sampleMatrix.values.flat(), 0.01)
    : 1

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-3">
      {/* Left 5 cols: Real Sparse Matrix Heatmap + Factorization Mechanics */}
      <div className="col-span-5 flex min-h-0 flex-col gap-2.5 rounded-sm border border-[#252834] bg-[#08090D]/90 p-3">
        <div className="flex shrink-0 items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase">
          <span className="text-[#22D3EE]">Real Sparse Matrix Block R</span>
          <span className="text-[#858A98]">12 USERS × 16 SKUS</span>
        </div>

        {sampleMatrix && (
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-1">
            {sampleMatrix.users.map((uid, r) => (
              <div key={uid} className="grid grid-cols-18 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onSelectCustomer(uid)}
                  className={`col-span-3 truncate pr-1 text-right font-mono text-[8.5px] transition-colors hover:text-[#22D3EE] ${
                    uid === selectedCustomerId ? 'font-semibold text-[#22D3EE]' : 'text-[#858A98]'
                  }`}
                >
                  {uid.replace('CUST-', '')}
                </button>
                <div className="col-span-15 grid grid-cols-16 gap-0.5">
                  {sampleMatrix.values[r].map((val, c) => {
                    const intensity = val > 0 ? 0.25 + (val / maxCellVal) * 0.75 : 0
                    const code = sampleMatrix.items[c]
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => onInspectProduct(code)}
                        title={`${uid} × SKU ${code}: r=${val.toFixed(2)}`}
                        className="aspect-square w-full rounded-[1px] border border-[#252834]/40 transition-transform hover:scale-125"
                        style={{
                          backgroundColor:
                            val > 0 ? `rgba(34, 211, 238, ${intensity.toFixed(2)})` : '#11131A',
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="shrink-0 rounded-sm border border-[#252834] bg-[#11131A] p-2.5 font-mono text-[9.5px] leading-relaxed text-[#858A98]">
          <div className="text-[#A78BFA]">MATRIX FACTORIZATION MECHANISM</div>
          <div className="mt-1 text-[#F5F5F7]">
            R ({summary?.num_users.toLocaleString() ?? '3,751'} × {summary?.num_items.toLocaleString() ?? '3,049'}) ≈ U × Vᵀ
          </div>
          <div className="mt-0.5">
            Dark cells are unobserved (?); ALS estimates affinity via dot product uᵤᵀ · vᵢ and ranks unseen SKUs.
          </div>
        </div>
      </div>

      {/* Right 7 cols: 2D PCA Projection of Learned ALS Embeddings */}
      <div className="col-span-7 flex min-h-0 flex-col gap-2 rounded-sm border border-[#252834] bg-[#08090D]/90 p-3">
        <div className="flex shrink-0 items-center justify-between gap-2 font-mono text-[10px]">
          <span className="tracking-[0.14em] text-[#A78BFA] uppercase">
            2D PCA Projection of Learned Latent Space
          </span>
          <span className="text-[#858A98]">
            {space ? `Explained Variance: ${(space.total_explained_variance * 100).toFixed(1)}%` : 'Projecting…'}
          </span>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm border border-[#252834] bg-[#11131A]/75">
          <svg viewBox="0 0 520 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
            {/* Axis hairlines */}
            <line x1="38" y1="270" x2="494" y2="270" stroke="#252834" />
            <line x1="38" y1="24" x2="38" y2="270" stroke="#252834" />

            {/* Rays from highlighted customer to its top-5 recommended products */}
            {activeUserPoint &&
              highlightedProducts.map((hp) => (
                <line
                  key={`ray-${hp.id}`}
                  x1={toSvgX(activeUserPoint.x)}
                  y1={toSvgY(activeUserPoint.y)}
                  x2={toSvgX(hp.x)}
                  y2={toSvgY(hp.y)}
                  stroke="#22D3EE"
                  strokeOpacity="0.45"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                />
              ))}

            {/* Background points */}
            {pts
              .filter((p) => !p.is_highlighted)
              .map((p) => (
                <circle
                  key={`${p.kind}-${p.id}`}
                  cx={toSvgX(p.x)}
                  cy={toSvgY(p.y)}
                  r={p.kind === 'product' ? 3.2 : 2.6}
                  fill={p.kind === 'product' ? '#A78BFA' : '#22D3EE'}
                  fillOpacity={p.kind === 'product' ? 0.55 : 0.35}
                  className="cursor-pointer"
                  onMouseEnter={() => setHovered(p)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() =>
                    p.kind === 'customer' ? onSelectCustomer(p.id) : onInspectProduct(p.id)
                  }
                />
              ))}

            {/* Highlighted Top-5 recommended products */}
            {highlightedProducts.map((p) => (
              <g
                key={`hi-p-${p.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onInspectProduct(p.id)}
              >
                <circle cx={toSvgX(p.x)} cy={toSvgY(p.y)} r="6" fill="#A78BFA" stroke="#F5F5F7" strokeWidth="1.5" />
              </g>
            ))}

            {/* Highlighted active customer */}
            {activeUserPoint && (
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHovered(activeUserPoint)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle
                  cx={toSvgX(activeUserPoint.x)}
                  cy={toSvgY(activeUserPoint.y)}
                  r="11"
                  fill="#22D3EE"
                  fillOpacity="0.16"
                  stroke="#22D3EE"
                  strokeWidth="1.2"
                />
                <circle
                  cx={toSvgX(activeUserPoint.x)}
                  cy={toSvgY(activeUserPoint.y)}
                  r="4.5"
                  fill="#22D3EE"
                  stroke="#F5F5F7"
                  strokeWidth="1.5"
                />
              </g>
            )}

            <text x="266" y="292" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
              {space?.x_label ?? 'PC1 (2D PCA projection)'}
            </text>
            <text
              x="16"
              y="148"
              textAnchor="middle"
              fill="#858A98"
              fontSize="9.5"
              fontFamily="JetBrains Mono"
              transform="rotate(-90 16 148)"
            >
              {space?.y_label ?? 'PC2 (2D PCA projection)'}
            </text>
          </svg>

          {/* Hover readout overlay */}
          {hovered && (
            <div className="pointer-events-none absolute top-2.5 right-2.5 max-w-[240px] rounded-sm border border-[#22D3EE]/60 bg-[#08090D]/95 px-2.5 py-1.5 font-mono text-[9.5px]">
              <div className={hovered.kind === 'customer' ? 'text-[#22D3EE]' : 'text-[#A78BFA]'}>
                {hovered.kind.toUpperCase()} · {hovered.id}
              </div>
              <div className="truncate font-sans text-[10.5px] text-[#F5F5F7]">{hovered.label}</div>
              <div className="text-[#858A98]">
                ({hovered.x.toFixed(2)}, {hovered.y.toFixed(2)}) · {hovered.interactions} links
              </div>
            </div>
          )}
        </div>

        {/* Honest PCA disclaimer + legend */}
        <div className="flex shrink-0 items-center justify-between gap-3 font-mono text-[9px] text-[#858A98]">
          <span className="truncate">
            <span className="text-[#F5F5F7]">PCA PROJECTION ONLY:</span> Axes show principal variance directions, not semantic categories.
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="flex items-center gap-1 text-[#22D3EE]">
              <span className="h-2 w-2 rounded-full bg-[#22D3EE]" /> Active User
            </span>
            <span className="flex items-center gap-1 text-[#A78BFA]">
              <span className="h-2 w-2 rounded-full border border-[#F5F5F7] bg-[#A78BFA]" /> Top-5 Recs
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
