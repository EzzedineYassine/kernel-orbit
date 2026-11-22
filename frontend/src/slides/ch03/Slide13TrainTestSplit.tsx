import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { IRIS_SPECIES } from '../../components/irisPalette'
import { MetricCard } from '../../components/MetricCard'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 13 — Training & Testing Datasets (Stratified 80/20 + Leakage Warning) */
export function Slide13TrainTestSplit() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2cqh]">
        <div className="flex items-end justify-between gap-6">
          <ChapterHeader
            eyebrow="CHAPTER 03 · DISCIPLINED EVALUATION"
            title={
              <>
                Stratified <span className="text-[#22D3EE]">80 / 20</span> Split
              </>
            }
            subtitle="Never judge a model on the same examples it studied. Hold out an untouched test set with balanced class ratios."
            compact
          />

          <div className="flex shrink-0 gap-3">
            <MetricCard label="Train Split" value="120" note="80% · Fit & 5-fold CV" accent="primary" compact />
            <MetricCard label="Test Split" value="30" note="20% · Held-out exam" accent="secondary" compact />
          </div>
        </div>

        <DiagramFrame
          figure="FIG 03.C"
          title="STRATIFIED IRIS PARTITION (RANDOM_STATE = 42)"
          meta="40 TRAIN / 10 TEST PER SPECIES"
          caption="Stratification guarantees every species keeps an exact 80/20 ratio across training and evaluation."
          className="min-h-0 flex-1"
          bodyClassName="flex-col items-stretch justify-center gap-4 px-2"
        >
          {/* Per-species split bars */}
          <div className="flex flex-col gap-3">
            {IRIS_SPECIES.map((sp, idx) => (
              <div key={sp.id} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-3 flex items-center gap-2 font-mono text-[clamp(10.5px,0.9cqw,12.5px)] text-[#F5F5F7]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: sp.color }} />
                  <span>{sp.name}</span>
                </div>

                <div className="col-span-9 flex h-9 overflow-hidden rounded-sm border border-[#252834] bg-[#08090D]">
                  <div className="relative flex w-[80%] shrink-0 items-center justify-between overflow-hidden border-r border-[#08090D] px-3 font-mono text-[clamp(10px,0.82cqw,11.5px)]">
                    <motion.span
                      initial={reduced ? false : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 + idx * 0.08 }}
                      style={{ backgroundColor: `${sp.color}22`, transformOrigin: 'left center' }}
                      className="pointer-events-none absolute inset-0"
                      aria-hidden
                    />
                    <span className="relative z-10 font-medium" style={{ color: sp.color }}>
                      TRAIN
                    </span>
                    <span className="relative z-10 whitespace-nowrap" style={{ color: sp.color }}>
                      40 samples
                    </span>
                  </div>
                  <motion.div
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.35 + idx * 0.08 }}
                    className="flex w-[20%] shrink-0 items-center justify-between bg-[#11131A] px-2.5 font-mono text-[clamp(9.5px,0.78cqw,11px)] text-[#F5F5F7]"
                  >
                    <span>TEST</span>
                    <span>10</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>

          {/* Zero-leakage warning callout */}
          <div className="flex items-center justify-between gap-4 rounded-sm border border-[#A78BFA]/45 bg-[#A78BFA]/8 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="rounded-sm border border-[#A78BFA] px-2 py-0.5 font-mono text-[clamp(9px,0.74cqw,10.5px)] tracking-[0.16em] text-[#A78BFA]">
                ZERO LEAKAGE RULE
              </span>
              <span className="font-sans text-[clamp(11px,0.94cqw,13.5px)] text-[#F5F5F7]">
                <code className="font-mono text-[#22D3EE]">StandardScaler</code> computes μ and σ strictly on the{' '}
                <strong className="font-semibold text-[#F5F5F7]">120 training rows</strong> — never on the 30 test rows.
              </span>
            </div>
            <span className="shrink-0 font-mono text-[clamp(9.5px,0.78cqw,11px)] text-[#858A98]">
              VERIFIED IN PYTEST
            </span>
          </div>
        </DiagramFrame>
      </div>
    </SlideLayout>
  )
}
