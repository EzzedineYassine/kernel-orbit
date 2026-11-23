import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { SlideLayout } from '../../presentation/SlideLayout'

const CF_LIMITATIONS = [
  {
    code: '01',
    title: 'Cold-Start Problem',
    tag: 'NEW USERS & SKUS',
    desc: 'Brand-new customers or newly launched gift items have zero interactions — requiring popularity or content-based fallbacks.',
    accent: '#22D3EE',
  },
  {
    code: '02',
    title: 'Extreme Interaction Sparsity',
    tag: '98.1% EMPTY',
    desc: 'Rarely purchased niche products provide weak collaborative signal, limiting embedding accuracy on sparse tails.',
    accent: '#A78BFA',
  },
  {
    code: '03',
    title: 'Popularity Bias',
    tag: 'EXPOSURE SKEW',
    desc: 'Bestsellers accumulate far more positive observations, risking self-reinforcing exposure unless regularly audited.',
    accent: '#22D3EE',
  },
  {
    code: '04',
    title: 'Opaque Latent Factors',
    tag: 'EXPLAINABILITY',
    desc: 'Learned dimensions are continuous math vectors, not human-readable rules — explaining “why” takes extra care.',
    accent: '#A78BFA',
  },
  {
    code: '05',
    title: 'Shifting Human Preferences',
    tag: 'NON-STATIONARY',
    desc: 'Historical gift purchases (e.g., seasonal holidays or one-off occasions) do not guarantee future customer intent.',
    accent: '#F5F5F7',
  },
] as const

/** Slide 27 — Limitations of Collaborative Filtering */
export function Slide27ModelLimitations() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[1.8cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 06 · REAL-WORLD BOUNDARIES"
          title={
            <>
              Limitations of <span className="text-[#A78BFA]">Collaborative Filtering</span>
            </>
          }
          subtitle="Matrix factorization is powerful — yet honest deployment requires designing explicitly around its five structural failure modes."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-rows-5 gap-[1cqh]">
          {CF_LIMITATIONS.map((item, idx) => (
            <motion.div
              key={item.code}
              initial={reduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.08 + idx * 0.06 }}
              className="relative flex min-h-0 items-center justify-between gap-4 rounded-sm border border-[#252834] bg-[#11131A]/90 px-4"
            >
              <span
                className="absolute top-0 bottom-0 left-0 w-[2px]"
                style={{ backgroundColor: item.accent }}
                aria-hidden
              />
              <div className="flex min-w-0 items-baseline gap-3.5">
                <span
                  className="shrink-0 font-mono text-[clamp(11px,0.95cqw,14px)] font-semibold"
                  style={{ color: item.accent }}
                >
                  {item.code}
                </span>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="font-display text-[clamp(13px,1.15cqw,16.5px)] font-semibold text-[#F5F5F7]">
                    {item.title}
                  </span>
                  <span className="font-sans text-[clamp(10.5px,0.88cqw,12.5px)] text-[#858A98]">
                    {item.desc}
                  </span>
                </div>
              </div>
              <span
                className="shrink-0 rounded-sm border border-[#252834] bg-[#08090D] px-2.5 py-0.5 font-mono text-[clamp(8.5px,0.7cqw,10px)] tracking-[0.14em]"
                style={{ color: item.accent }}
              >
                {item.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
