import { ChapterHeader } from '../../components/ChapterHeader'
import { MathFormula } from '../../components/MathFormula'
import { MetricCard } from '../../components/MetricCard'
import { SlideLayout } from '../../presentation/SlideLayout'

export interface MetricsSlotData {
  accuracy: string | null
  macroPrecision: string | null
  macroRecall: string | null
  macroF1: string | null
}

/** Slide 24 — Accuracy, Precision, Recall & F1-Score (+ Macro Averaging) */
export function Slide24Metrics({ live }: { live?: MetricsSlotData } = {}) {
  const slots: MetricsSlotData = live ?? {
    accuracy: null,
    macroPrecision: null,
    macroRecall: null,
    macroF1: null,
  }

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col justify-between gap-[1.8cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 06 · CLASSIFICATION METRICS"
          title={
            <>
              Accuracy, Precision, Recall & <span className="text-[#22D3EE]">F1-Score</span>
            </>
          }
          subtitle="Four complementary lenses quantify not just how often a model is right, but what kinds of errors it makes."
          compact
        />

        {/* 4 Exact Formulas */}
        <div className="grid grid-cols-2 gap-[1.4cqw]">
          <MathFormula
            label="Accuracy · Overall Correctness"
            compact
            formula={
              <span className="flex items-center gap-2.5 text-[0.82em]">
                <span className="text-[#F5F5F7]">Acc</span>
                <span className="text-[#858A98]">=</span>
                <span className="inline-flex flex-col items-center leading-none">
                  <span className="border-b border-[#858A98] px-1.5 pb-1">Correct Predictions</span>
                  <span className="pt-1 text-[#858A98]">Total Test Samples</span>
                </span>
              </span>
            }
          />
          <MathFormula
            label="Precision · Positive Predictive Purity"
            compact
            formula={
              <span className="flex items-center gap-2.5 text-[0.82em]">
                <span className="text-[#22D3EE]">P</span>
                <span className="text-[#858A98]">=</span>
                <span className="inline-flex flex-col items-center leading-none">
                  <span className="border-b border-[#858A98] px-2 pb-1 text-[#22D3EE]">TP</span>
                  <span className="pt-1">TP + FP</span>
                </span>
              </span>
            }
          />
          <MathFormula
            label="Recall · True Class Coverage"
            compact
            formula={
              <span className="flex items-center gap-2.5 text-[0.82em]">
                <span className="text-[#A78BFA]">R</span>
                <span className="text-[#858A98]">=</span>
                <span className="inline-flex flex-col items-center leading-none">
                  <span className="border-b border-[#858A98] px-2 pb-1 text-[#A78BFA]">TP</span>
                  <span className="pt-1">TP + FN</span>
                </span>
              </span>
            }
          />
          <MathFormula
            label="F1-Score · Harmonic Mean"
            compact
            formula={
              <span className="flex items-center gap-2.5 text-[0.82em]">
                <span className="text-[#F5F5F7]">F₁</span>
                <span className="text-[#858A98]">=</span>
                <span className="inline-flex flex-col items-center leading-none">
                  <span className="border-b border-[#858A98] px-2 pb-1">
                    2 · <span className="text-[#22D3EE]">P</span> · <span className="text-[#A78BFA]">R</span>
                  </span>
                  <span className="pt-1">
                    <span className="text-[#22D3EE]">P</span> + <span className="text-[#A78BFA]">R</span>
                  </span>
                </span>
              </span>
            }
          />
        </div>

        {/* Macro averaging explanation bar */}
        <div className="flex items-center justify-between gap-4 rounded-sm border border-[#A78BFA]/40 bg-[#11131A]/90 px-4 py-2.5">
          <div>
            <span className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#A78BFA] uppercase">
              MULTICLASS MACRO AVERAGING (C = 3 IRIS SPECIES)
            </span>
            <p className="mt-0.5 font-sans text-[clamp(11px,0.92cqw,13px)] text-[#858A98]">
              Compute Precision, Recall, and F₁ independently for each species (one-vs-rest), then take the unweighted mean{' '}
              <span className="font-mono text-[#F5F5F7]">(M₀ + M₁ + M₂) / 3</span> — giving every class equal importance.
            </p>
          </div>
          <span className="shrink-0 rounded-sm border border-[#252834] bg-[#08090D] px-2.5 py-1 font-mono text-[clamp(9px,0.74cqw,10.5px)] text-[#22D3EE]">
            HELD-OUT TEST (N = 30)
          </span>
        </div>

        {/* 4 Live Metric Readout Slots (Phase 7) */}
        <div className="grid grid-cols-4 gap-[1.3cqw]">
          <MetricCard label="Test Accuracy" value={slots.accuracy} accent="neutral" compact />
          <MetricCard label="Macro Precision" value={slots.macroPrecision} accent="secondary" compact />
          <MetricCard label="Macro Recall" value={slots.macroRecall} accent="primary" compact />
          <MetricCard label="Macro F1" value={slots.macroF1} accent="secondary" compact />
        </div>
      </div>
    </SlideLayout>
  )
}
