import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { SlideLayout } from '../../presentation/SlideLayout'

const TAKEAWAYS = [
  {
    num: '01',
    stage: 'REPRESENTATION',
    title: 'Learning starts with data geometry',
    desc: 'Features turn observations into coordinates in ℝⁿ where similarity becomes measurable.',
    accent: '#22D3EE',
  },
  {
    num: '02',
    stage: 'DISCIPLINE',
    title: 'Split and scale without leakage',
    desc: 'Stratified 80/20 splits and train-only StandardScaler fitting keep evaluation honest.',
    accent: '#A78BFA',
  },
  {
    num: '03',
    stage: 'MECHANISM',
    title: 'KNN classifies by local proximity',
    desc: 'No opaque weights — just distance metrics, K nearest neighbors, and transparent voting.',
    accent: '#22D3EE',
  },
  {
    num: '04',
    stage: 'TRADEOFF',
    title: 'Complexity balances bias and variance',
    desc: 'Small K memorizes noise; large K oversmooths; 5-fold CV finds the balanced sweet spot.',
    accent: '#A78BFA',
  },
  {
    num: '05',
    stage: 'EVALUATION',
    title: 'Metrics expose how a model fails',
    desc: 'Macro precision, recall, F₁, and the confusion matrix reveal errors beyond accuracy.',
    accent: '#F5F5F7',
  },
] as const

/** Slide 29 — What We Learned (5-Point Arc Synthesis) */
export function Slide29WhatWeLearned() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[1.6cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 07 · SYNTHESIS"
          title={
            <>
              What we <span className="text-[#A78BFA]">learned.</span>
            </>
          }
          subtitle="Five foundational principles that scale from KNN to every modern machine learning system."
          compact
        />

        <div className="relative grid min-h-0 flex-1 grid-rows-5 gap-[1cqh] pl-6">
          {/* Vertical progression rail */}
          <span
            className="pointer-events-none absolute top-3 bottom-3 left-2 w-px bg-gradient-to-b from-[#22D3EE] via-[#A78BFA] to-[#252834]"
            aria-hidden
          />

          {TAKEAWAYS.map((item, idx) => (
            <motion.div
              key={item.num}
              initial={reduced ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.08 + idx * 0.07 }}
              className="relative flex min-h-0 items-center justify-between gap-3 rounded-sm border border-[#252834] bg-[#11131A]/85 px-4"
            >
              {/* Rail node */}
              <span
                className="pointer-events-none absolute -left-[20px] h-2.5 w-2.5 rounded-full border border-[#08090D]"
                style={{ backgroundColor: item.accent }}
                aria-hidden
              />

              <div className="flex min-w-0 items-baseline gap-3">
                <span
                  className="shrink-0 font-mono text-[clamp(11px,0.98cqw,14px)] font-semibold"
                  style={{ color: item.accent }}
                >
                  {item.num}
                </span>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <span className="font-display text-[clamp(13px,1.12cqw,16.5px)] font-semibold text-[#F5F5F7]">
                    {item.title}
                  </span>
                  <span className="font-sans text-[clamp(10.5px,0.88cqw,12.5px)] text-[#858A98]">
                    {item.desc}
                  </span>
                </div>
              </div>

              <span className="shrink-0 rounded-sm border border-[#252834] bg-[#08090D] px-2 py-0.5 font-mono text-[clamp(8.5px,0.68cqw,10px)] tracking-[0.14em] text-[#858A98]">
                {item.stage}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
