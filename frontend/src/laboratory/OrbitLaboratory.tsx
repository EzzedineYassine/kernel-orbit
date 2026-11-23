import { Cpu, Grid2x2, Package, RefreshCw, Sliders, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useOrbitData } from '../hooks/useOrbitData'
import { SlideLayout } from '../presentation/SlideLayout'
import { LatentSpacePanel } from './LatentSpacePanel'
import { ModelConfigPanel } from './ModelConfigPanel'
import { ProductExplorerPanel } from './ProductExplorerPanel'
import { RecommendationsPanel } from './RecommendationsPanel'

type LabTab = 'recommend' | 'products' | 'latent' | 'config'

const TABS: readonly { id: LabTab; label: string; icon: typeof Sparkles }[] = [
  { id: 'recommend', label: 'Customer & Recs', icon: Sparkles },
  { id: 'products', label: 'Product Explorer', icon: Package },
  { id: 'latent', label: 'Matrix & 2D PCA', icon: Grid2x2 },
  { id: 'config', label: 'Configure & Retrain', icon: Sliders },
]

/**
 * Slide 22 — The ORBIT Interactive Recommendation Laboratory.
 * Wrapped in `data-interactive-zone="true"` so typing, scrolling lists, and
 * dragging hyperparameter sliders never interfere with slide navigation.
 */
export function OrbitLaboratory() {
  const { health, loading, retraining, error, refreshAll } = useOrbitData()
  const [activeTab, setActiveTab] = useState<LabTab>('recommend')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedProductCode, setSelectedProductCode] = useState('')

  const handleInspectProduct = (code: string) => {
    setSelectedProductCode(code)
    setActiveTab('products')
  }

  const handleSelectCustomerFromMatrix = (cid: string) => {
    setSelectedCustomerId(cid)
    setActiveTab('recommend')
  }

  return (
    <SlideLayout>
      <div
        data-interactive-zone="true"
        className="col-span-12 flex h-full min-h-0 flex-col gap-2.5"
      >
        {/* Top Lab Header & Tab Bar */}
        <div className="flex shrink-0 items-center justify-between gap-3 rounded-sm border border-[#252834] bg-[#11131A]/95 px-3.5 py-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-[#22D3EE]" />
              <span className="font-display text-[14px] font-semibold tracking-[0.06em] text-[#F5F5F7]">
                ORBIT LABORATORY
              </span>
            </div>
            <span className="h-3.5 w-px bg-[#252834]" />
            <div className="flex items-center gap-1" role="tablist" aria-label="ORBIT Laboratory views">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 rounded-xs border px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] transition-colors ${
                      active
                        ? 'border-[#22D3EE]/80 bg-[#22D3EE]/15 text-[#22D3EE]'
                        : 'border-transparent text-[#858A98] hover:border-[#252834] hover:text-[#F5F5F7]'
                    }`}
                  >
                    <Icon size={11} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Live ALS Status Telemetry */}
          <div className="flex items-center gap-2.5 font-mono text-[9.5px]">
            {health ? (
              <>
                <span className="hidden text-[#858A98] xl:inline">
                  k={health.active_config.factors} · iter={health.active_config.iterations} · λ=
                  {health.active_config.regularization} · α={health.active_config.alpha}
                </span>
                <span className="flex items-center gap-1.5 rounded-xs border border-[#22D3EE]/45 bg-[#22D3EE]/10 px-2 py-0.5 text-[#22D3EE]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
                  {retraining ? 'RETRAINING…' : 'LIVE ALS'}
                </span>
              </>
            ) : (
              <button
                type="button"
                onClick={() => void refreshAll()}
                className="flex items-center gap-1.5 rounded-xs border border-[#A78BFA]/60 bg-[#A78BFA]/12 px-2 py-0.5 text-[#A78BFA] hover:bg-[#A78BFA]/20"
              >
                <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'CONNECTING…' : 'BACKEND OFFLINE · RETRY'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Lab Workspace */}
        <div className="min-h-0 flex-1">
          {error && !health ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-[#252834] bg-[#11131A]/80 p-6 text-center">
              <div className="font-mono text-xs tracking-[0.18em] text-[#A78BFA]">
                ORBIT BACKEND NOT REACHABLE
              </div>
              <p className="max-w-lg font-sans text-sm text-[#858A98]">
                Start the live Implicit ALS FastAPI server so the laboratory can serve real UCI Online Retail recommendations without mock data:
              </p>
              <code className="rounded-sm border border-[#252834] bg-[#08090D] px-4 py-2 font-mono text-xs text-[#22D3EE]">
                cd backend &amp;&amp; .\.venv\Scripts\uvicorn.exe app.main:app --port 8000
              </code>
              <button
                type="button"
                onClick={() => void refreshAll()}
                className="mt-1 rounded-sm border border-[#22D3EE] bg-[#22D3EE]/15 px-4 py-1.5 font-mono text-xs text-[#22D3EE] hover:bg-[#22D3EE]/25"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'recommend' && (
                <RecommendationsPanel
                  selectedCustomerId={selectedCustomerId}
                  onSelectCustomer={setSelectedCustomerId}
                  onInspectProduct={handleInspectProduct}
                />
              )}
              {activeTab === 'products' && (
                <ProductExplorerPanel
                  selectedProductCode={selectedProductCode}
                  onSelectProduct={setSelectedProductCode}
                />
              )}
              {activeTab === 'latent' && (
                <LatentSpacePanel
                  selectedCustomerId={selectedCustomerId}
                  onSelectCustomer={handleSelectCustomerFromMatrix}
                  onInspectProduct={handleInspectProduct}
                />
              )}
              {activeTab === 'config' && <ModelConfigPanel />}
            </>
          )}
        </div>
      </div>
    </SlideLayout>
  )
}
