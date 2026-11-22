import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { IRIS_SPECIES } from '../../components/irisPalette'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

export interface ConfusionMatrixSlotData {
  matrix: readonly (readonly number[])[] | null
}

/** Slide 25 — The Confusion Matrix (Anatomy + Phase 7 Live Slot) */
export function Slide25ConfusionMatrix({ live }: { live?: ConfusionMatrixSlotData } = {}) {
  const matrix = live?.matrix ?? null

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 06 · ERROR ANATOMY"
              title={
                <>
                  The <span className="text-[#A78BFA]">Confusion Matrix</span>
                </>
              }
              subtitle="Instead of collapsing performance into a single number, a confusion matrix reveals exactly which classes the model confuses."
              compact
            />

            <div className="flex flex-col gap-2">
              {[
                {
                  badge: 'DIAGONAL (TP)',
                  color: '#22D3EE',
                  text: 'True Positives — predicted species matches the actual ground-truth species.',
                },
                {
                  badge: 'OFF-DIAGONAL ROW (FN)',
                  color: '#A78BFA',
                  text: 'False Negatives — true members of a row class missed and assigned elsewhere.',
                },
                {
                  badge: 'OFF-DIAGONAL COL (FP)',
                  color: '#858A98',
                  text: 'False Positives — other species mistakenly predicted into this column.',
                },
              ].map((item) => (
                <div
                  key={item.badge}
                  className="rounded-sm border border-[#252834] bg-[#11131A]/85 px-3.5 py-2.5"
                >
                  <div
                    className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em]"
                    style={{ color: item.color }}
                  >
                    {item.badge}
                  </div>
                  <p className="mt-1 font-sans text-[clamp(11px,0.92cqw,13px)] leading-snug text-[#858A98]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 06.B"
            title="3×3 IRIS MATRIX"
            meta={matrix ? 'HELD-OUT TEST (N = 30)' : 'PHASE 7 LIVE SLOT'}
            caption="Rows represent true labels (10 held-out samples each); columns represent KNN predictions."
            className="h-full"
            bodyClassName="flex-col items-stretch justify-center px-3"
          >
            <div className="flex w-full flex-col gap-2">
              {/* Predicted header */}
              <div className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-3" />
                <div className="col-span-9 text-center font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.2em] text-[#22D3EE] uppercase">
                  PREDICTED CLASS →
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2 font-mono text-[clamp(9.5px,0.78cqw,11px)] text-[#858A98]">
                <div className="col-span-3 text-right pr-2 text-[#A78BFA]">ACTUAL ↓</div>
                {IRIS_SPECIES.map((sp) => (
                  <div key={sp.id} className="col-span-3 text-center">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sp.color }} />
                      <span className="text-[#F5F5F7]">{sp.short}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* 3x3 grid */}
              {IRIS_SPECIES.map((rowSp, r) => (
                <div key={rowSp.id} className="grid grid-cols-12 items-stretch gap-2">
                  <div className="col-span-3 flex items-center justify-end gap-1.5 pr-2 font-mono text-[clamp(10px,0.84cqw,12px)] text-[#F5F5F7]">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: rowSp.color }} />
                    <span>{rowSp.short}</span>
                  </div>

                  {IRIS_SPECIES.map((colSp, c) => {
                    const isDiag = r === c
                    const cellVal = matrix ? matrix[r]?.[c] : null
                    return (
                      <div
                        key={colSp.id}
                        className={`col-span-3 flex h-[9.5cqh] flex-col items-center justify-center rounded-sm border ${
                          isDiag
                            ? 'border-[#22D3EE]/55 bg-[#22D3EE]/10'
                            : 'border-[#252834] bg-[#08090D]'
                        }`}
                      >
                        <span
                          className={`font-mono text-[clamp(18px,1.8cqw,28px)] font-medium tabular-nums ${
                            cellVal === null
                              ? 'text-[#858A98]/55'
                              : isDiag
                                ? 'text-[#22D3EE]'
                                : cellVal > 0
                                  ? 'text-[#A78BFA]'
                                  : 'text-[#858A98]/50'
                          }`}
                        >
                          {cellVal === null ? '—' : cellVal}
                        </span>
                        <span className="mt-0.5 font-mono text-[clamp(8.5px,0.68cqw,10px)] tracking-[0.14em] text-[#858A98]">
                          {isDiag ? 'TP (MATCH)' : 'FP / FN'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}

              {!matrix && (
                <div className="mt-1 text-center font-mono text-[clamp(9px,0.74cqw,10.5px)] tracking-[0.12em] text-[#22D3EE]/85">
                  SLOT READY · LIVE METRICS CONNECT IN PHASE 7 (GET /api/model/evaluate)
                </div>
              )}
            </div>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
