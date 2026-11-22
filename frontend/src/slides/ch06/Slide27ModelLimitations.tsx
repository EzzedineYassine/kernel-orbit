import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { SlideLayout } from '../../presentation/SlideLayout'

const LIMITATIONS = [
  {
    code: '01',
    title: 'Curse of Dimensionality',
    metric: 'D ≫ 10',
    desc: 'In high-dimensional spaces, distances between all points converge — “nearest” neighbors stop being meaningfully close.',
    accent: '#A78BFA',
  },
  {
    code: '02',
    title: 'Inference Latency & Memory',
    metric: 'O(N · D)',
    desc: 'Because KNN stores every training instance, prediction cost and memory grow linearly with dataset size unless indexed.',
    accent: '#22D3EE',
  },
  {
    code: '03',
    title: 'Sensitivity to Feature Scale',
    metric: 'σ₁ ≠ σ₂',
    desc: 'Unscaled units or noisy irrelevant features warp geometric distance immediately — disciplined preprocessing is mandatory.',
    accent: '#A78BFA',
  },
  {
    code: '04',
    title: 'Class Imbalance Bias',
    metric: 'P(maj) ≫ P(min)',
    desc: 'Under uniform voting, majority classes dominate local neighborhoods unless mitigated with distance weights or resampling.',
    accent: '#22D3EE',
  },
] as const

/** Slide 27 — Model Limitations & Generalization */
export function Slide27ModelLimitations() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2.2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 06 · ENGINEERING BOUNDARIES"
          title={
            <>
              Know where the model <span className="text-[#A78BFA]">breaks.</span>
            </>
          }
          subtitle="Every algorithm carries structural trade-offs. Good ML engineering means choosing tools that match the geometry and scale of the problem."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-[1.6cqw]">
          {LIMITATIONS.map((item, idx) => (
            <motion.div
              key={item.code}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
              className="relative flex min-h-0 items-center gap-4 rounded-sm border border-[#252834] bg-[#11131A]/90 p-[clamp(14px,1.5cqw,22px)]"
            >
              <span
                className="absolute top-0 bottom-0 left-0 w-[2px]"
                style={{ backgroundColor: item.accent }}
                aria-hidden
              />

              {/* Compact SVG schematic per limitation */}
              <div className="flex h-[10.5cqh] w-[10.5cqh] shrink-0 items-center justify-center rounded-sm border border-[#252834] bg-[#08090D]">
                <svg viewBox="0 0 84 84" className="h-full w-full p-1.5" preserveAspectRatio="xMidYMid meet">
                  {idx === 0 && (
                    <g stroke="#A78BFA" fill="none" strokeWidth="1.2">
                      <rect x="14" y="24" width="38" height="38" />
                      <rect x="30" y="12" width="38" height="38" strokeDasharray="3 2" strokeOpacity="0.6" />
                      <line x1="14" y1="24" x2="30" y2="12" strokeOpacity="0.5" />
                      <line x1="52" y1="24" x2="68" y2="12" strokeOpacity="0.5" />
                      <line x1="52" y1="62" x2="68" y2="50" strokeOpacity="0.5" />
                      <circle cx="42" cy="40" r="2.5" fill="#22D3EE" stroke="none" />
                    </g>
                  )}
                  {idx === 1 && (
                    <g>
                      <line x1="12" y1="68" x2="74" y2="68" stroke="#252834" />
                      <line x1="12" y1="14" x2="12" y2="68" stroke="#252834" />
                      <line x1="14" y1="64" x2="70" y2="18" stroke="#22D3EE" strokeWidth="2" />
                      <circle cx="70" cy="18" r="3.5" fill="#22D3EE" />
                    </g>
                  )}
                  {idx === 2 && (
                    <g>
                      <ellipse cx="42" cy="42" rx="30" ry="10" fill="#A78BFA" fillOpacity="0.14" stroke="#A78BFA" strokeWidth="1.4" />
                      <circle cx="42" cy="42" r="2.8" fill="#F5F5F7" />
                    </g>
                  )}
                  {idx === 3 && (
                    <g>
                      <rect x="14" y="22" width="56" height="14" rx="1.5" fill="#22D3EE" fillOpacity="0.7" />
                      <rect x="14" y="46" width="11" height="14" rx="1.5" fill="#A78BFA" />
                    </g>
                  )}
                </svg>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.18em] text-[#858A98]">
                    LIMITATION {item.code}
                  </span>
                  <span
                    className="rounded-sm border border-[#252834] bg-[#08090D] px-2 py-0.5 font-mono text-[clamp(9.5px,0.78cqw,11px)]"
                    style={{ color: item.accent }}
                  >
                    {item.metric}
                  </span>
                </div>
                <h2 className="mt-1 font-display text-[clamp(15px,1.32cqw,19px)] font-semibold text-[#F5F5F7]">
                  {item.title}
                </h2>
                <p className="mt-1 font-sans text-[clamp(11px,0.92cqw,13px)] leading-relaxed text-[#858A98]">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
