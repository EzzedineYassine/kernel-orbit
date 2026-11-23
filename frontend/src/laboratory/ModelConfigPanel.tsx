import { RefreshCw, RotateCcw, Sliders } from 'lucide-react'
import { useState } from 'react'
import { useOrbitData } from '../hooks/useOrbitData'
import type { ALSConfig } from '../types/orbit'

const REG_OPTIONS = [0.01, 0.05, 0.1, 0.5, 1.0, 5.0] as const

const DEFAULT_CFG: ALSConfig = {
  factors: 32,
  iterations: 20,
  regularization: 0.1,
  alpha: 15,
  random_state: 42,
}

/**
 * Tab 4 — Live ALS Model Configuration & Explicit Retraining (Section 9D).
 * Slider edits stay local; retraining executes ONLY on explicit Apply click.
 */
export function ModelConfigPanel() {
  const { health, metrics, retraining, retrainModel } = useOrbitData()
  const activeCfg = health?.active_config ?? DEFAULT_CFG

  const [draft, setDraft] = useState<ALSConfig>(activeCfg)
  const [lastRetrainMsg, setLastRetrainMsg] = useState<string | null>(null)
  const [retrainErr, setRetrainErr] = useState<string | null>(null)

  const isDirty =
    draft.factors !== activeCfg.factors ||
    draft.iterations !== activeCfg.iterations ||
    Math.abs(draft.regularization - activeCfg.regularization) > 1e-6 ||
    draft.alpha !== activeCfg.alpha

  const handleApply = async () => {
    setRetrainErr(null)
    setLastRetrainMsg(null)
    try {
      const res = await retrainModel(draft)
      setLastRetrainMsg(
        `Retrained ALS (k=${res.config.factors}, iter=${res.config.iterations}, λ=${res.config.regularization}, α=${res.config.alpha}) in ${res.train_seconds.toFixed(2)}s.`,
      )
    } catch (e) {
      setRetrainErr(e instanceof Error ? e.message : 'Retraining failed.')
    }
  }

  const handleReset = async () => {
    setDraft(DEFAULT_CFG)
    setRetrainErr(null)
    try {
      const res = await retrainModel(DEFAULT_CFG)
      setLastRetrainMsg(`Restored default ALS config and retrained in ${res.train_seconds.toFixed(2)}s.`)
    } catch (e) {
      setRetrainErr(e instanceof Error ? e.message : 'Reset failed.')
    }
  }

  const als10 = metrics?.als.at_10
  const pop10 = metrics?.popularity_baseline.at_10
  const lift = metrics?.lift_vs_popularity_at_10

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-3">
      {/* Left 5 cols: Hyperparameter Controls + Explicit Retrain Trigger */}
      <div className="col-span-5 flex min-h-0 flex-col justify-between gap-3 rounded-sm border border-[#252834] bg-[#08090D]/90 p-3.5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-[#22D3EE] uppercase">
              <Sliders size={12} />
              <span>ALS Hyperparameters</span>
            </div>
            {isDirty && (
              <span className="rounded-xs border border-[#A78BFA]/70 bg-[#A78BFA]/15 px-1.5 py-0.5 font-mono text-[8.5px] text-[#A78BFA]">
                UNAPPLIED CHANGES
              </span>
            )}
          </div>

          {/* Factors slider */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10.5px]">
              <span className="text-[#F5F5F7]">Latent Factors (k)</span>
              <span className="text-[#22D3EE] tabular-nums">{draft.factors}</span>
            </div>
            <input
              type="range"
              min={8}
              max={128}
              step={8}
              value={draft.factors}
              onChange={(e) => setDraft({ ...draft, factors: Number(e.target.value) })}
              aria-label="Latent factors k"
              className="w-full accent-[#22D3EE]"
            />
            <div className="flex justify-between font-mono text-[8.5px] text-[#858A98]">
              <span>8 (compact)</span>
              <span>32 (default)</span>
              <span>128 (high capacity)</span>
            </div>
          </div>

          {/* Iterations slider */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10.5px]">
              <span className="text-[#F5F5F7]">ALS Iterations</span>
              <span className="text-[#A78BFA] tabular-nums">{draft.iterations}</span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              step={5}
              value={draft.iterations}
              onChange={(e) => setDraft({ ...draft, iterations: Number(e.target.value) })}
              aria-label="ALS iterations"
              className="w-full accent-[#A78BFA]"
            />
          </div>

          {/* Alpha confidence slider */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10.5px]">
              <span className="text-[#F5F5F7]">Confidence Scaling (α)</span>
              <span className="text-[#22D3EE] tabular-nums">{draft.alpha}</span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              step={5}
              value={draft.alpha}
              onChange={(e) => setDraft({ ...draft, alpha: Number(e.target.value) })}
              aria-label="Confidence scaling alpha"
              className="w-full accent-[#22D3EE]"
            />
          </div>

          {/* Regularization discrete chips */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-[10.5px]">
              <span className="text-[#F5F5F7]">L₂ Regularization (λ)</span>
              <span className="text-[#A78BFA] tabular-nums">{draft.regularization}</span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {REG_OPTIONS.map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setDraft({ ...draft, regularization: reg })}
                  className={`rounded-xs border py-1 font-mono text-[10px] transition-colors ${
                    Math.abs(draft.regularization - reg) < 1e-6
                      ? 'border-[#A78BFA] bg-[#A78BFA]/20 text-[#F5F5F7]'
                      : 'border-[#252834] bg-[#11131A] text-[#858A98] hover:text-[#F5F5F7]'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Explicit Apply & Retrain action (never auto-retrains on slider drag) */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={retraining}
              onClick={() => void handleApply()}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-[#22D3EE] bg-[#22D3EE]/15 px-3 py-2 font-mono text-[11px] font-medium text-[#22D3EE] transition-colors hover:bg-[#22D3EE]/25 disabled:opacity-50"
            >
              <RefreshCw size={13} className={retraining ? 'animate-spin' : ''} />
              <span>{retraining ? 'Retraining ALS Model…' : 'Apply & Retrain Model'}</span>
            </button>
            <button
              type="button"
              disabled={retraining}
              onClick={() => void handleReset()}
              title="Reset to default parameters"
              className="flex items-center justify-center rounded-sm border border-[#252834] bg-[#11131A] px-2.5 text-[#858A98] transition-colors hover:border-[#A78BFA] hover:text-[#F5F5F7]"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {lastRetrainMsg && (
            <div className="rounded-xs border border-[#22D3EE]/40 bg-[#22D3EE]/8 px-2.5 py-1.5 font-mono text-[9.5px] text-[#22D3EE]">
              {lastRetrainMsg}
            </div>
          )}
          {retrainErr && (
            <div className="rounded-xs border border-[#A78BFA]/60 bg-[#A78BFA]/12 px-2.5 py-1.5 font-mono text-[9.5px] text-[#F5F5F7]">
              {retrainErr}
            </div>
          )}
        </div>
      </div>

      {/* Right 7 cols: Live Evaluation Impact Telemetry */}
      <div className="col-span-7 flex min-h-0 flex-col justify-between gap-3 rounded-sm border border-[#252834] bg-[#08090D]/90 p-3.5">
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span className="tracking-[0.14em] text-[#A78BFA] uppercase">
            Live Chronological Holdout Telemetry (@10)
          </span>
          <span className="text-[#858A98]">
            {health ? `Last fit: ${health.last_train_seconds.toFixed(2)}s` : '—'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Precision@10', als: als10?.precision, pop: pop10?.precision, lift: lift?.precision, pct: true },
            { label: 'Recall@10', als: als10?.recall, pop: pop10?.recall, lift: lift?.recall, pct: true },
            { label: 'MAP@10', als: als10?.map, pop: pop10?.map, lift: lift?.map, pct: true },
            { label: 'NDCG@10', als: als10?.ndcg, pop: pop10?.ndcg, lift: lift?.ndcg, pct: true },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-sm border border-[#252834] bg-[#11131A] p-3"
            >
              <div className="flex items-center justify-between font-mono text-[9.5px] text-[#858A98]">
                <span>{m.label}</span>
                {m.lift !== undefined && (
                  <span className="text-[#A78BFA]">{m.lift.toFixed(2)}× vs Pop</span>
                )}
              </div>
              <div className="mt-1 font-mono text-[22px] font-medium text-[#22D3EE] tabular-nums">
                {m.als !== undefined ? `${(m.als * 100).toFixed(2)}%` : '— —'}
              </div>
              <div className="mt-0.5 font-mono text-[9.5px] text-[#858A98]">
                Popularity baseline: {m.pop !== undefined ? `${(m.pop * 100).toFixed(2)}%` : '—'}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-sm border border-[#252834] bg-[#11131A] p-3 font-mono text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-[#858A98]">CATALOG COVERAGE @10</span>
            <span className="text-[#22D3EE] tabular-nums">
              {als10
                ? `${(als10.catalog_coverage * 100).toFixed(1)}% (${als10.recommended_unique_items.toLocaleString()} SKUs)`
                : '— —'}
            </span>
          </div>
          <p className="mt-1.5 font-sans text-[11px] leading-snug text-[#858A98]">
            Retraining triggers genuine <code className="font-mono text-[#F5F5F7]">implicit.als.AlternatingLeastSquares.fit()</code> on the FastAPI backend and updates Chapter 06 evaluation slides immediately.
          </p>
        </div>
      </div>
    </div>
  )
}
