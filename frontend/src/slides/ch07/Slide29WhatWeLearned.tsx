import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { SlideLayout } from '../../presentation/SlideLayout'

const TAKEAWAYS = [
  {
    num: '01',
    stage: 'IMPLICIT SIGNAL',
    title: 'Purchases are confidence, not star ratings',
    desc: 'Cleaning UCI retail logs and applying log(1 + purchases) tames wholesale spikes without inventing ratings.',
    accent: '#22D3EE',
  },
  {
    num: '02',
    stage: 'FACTORIZATION',
    title: 'Sparse matrices compress into latent taste',
    desc: 'Approximating R ≈ U × Vᵀ discovers shared structure across 3,751 shoppers and 3,049 gift items.',
    accent: '#A78BFA',
  },
  {
    num: '03',
    stage: 'OPTIMIZATION',
    title: 'ALS alternates closed-form solves',
    desc: 'Fixing V to solve U, then fixing U to solve V with L₂ regularization makes implicit learning fast and stable.',
    accent: '#22D3EE',
  },
  {
    num: '04',
    stage: 'EVALUATION',
    title: 'Chronological ranking beats popularity',
    desc: 'Precision@K, Recall@K, MAP@K, NDCG@K, and Coverage prove real personalized lift on unseen future orders.',
    accent: '#A78BFA',
  },
  {
    num: '05',
    stage: 'HUMILITY',
    title: 'Design around collaborative limits',
    desc: 'Cold-start users, sparsity, popularity skew, and shifting intent demand hybrid fallbacks and continuous monitoring.',
    accent: '#F5F5F7',
  },
] as const

/** Slide 29 — What We Learned (ORBIT 5-Point Synthesis) */
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
          subtitle="Five engineering principles connecting historical checkout logs to responsible personalized recommendations."
          compact
        />

        <div className="relative grid min-h-0 flex-1 grid-rows-5 gap-[1cqh] pl-6">
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
