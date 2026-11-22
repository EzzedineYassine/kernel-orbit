import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { SlideLayout } from '../../presentation/SlideLayout'

const STEPS = [
  {
    num: '01',
    title: 'Select K',
    desc: 'Pick neighborhood size K and distance metric.',
    accent: '#A78BFA',
  },
  {
    num: '02',
    title: 'Measure Distances',
    desc: 'Scale query point and compute d(x, xᵢ) to all 120 rows.',
    accent: '#22D3EE',
  },
  {
    num: '03',
    title: 'Find K Nearest',
    desc: 'Sort ascending and isolate the K closest instances.',
    accent: '#A78BFA',
  },
  {
    num: '04',
    title: 'Count Labels',
    desc: 'Tally votes (uniform or weighted by 1 / d).',
    accent: '#22D3EE',
  },
  {
    num: '05',
    title: 'Predict Majority',
    desc: 'Return the winning species and class probabilities.',
    accent: '#F5F5F7',
  },
] as const

/** Slide 19 — How the KNN Algorithm Works (5-Step Sequence) */
export function Slide19KNNSteps() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[1.8cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 04 · STEP-BY-STEP MECHANICS"
          title={
            <>
              How KNN makes a <span className="text-[#22D3EE]">prediction.</span>
            </>
          }
          subtitle="Five deterministic operations execute every time a new query point arrives."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-5 gap-[1.2cqw]">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
              className="flex min-h-0 flex-col overflow-hidden rounded-sm border border-[#252834] bg-[#11131A]/90 p-[clamp(10px,1.05cqw,16px)]"
            >
              <div className="flex shrink-0 items-center justify-between">
                <span
                  className="font-mono text-[clamp(16px,1.5cqw,22px)] font-semibold"
                  style={{ color: step.accent }}
                >
                  {step.num}
                </span>
                {idx < STEPS.length - 1 && (
                  <span className="font-mono text-xs text-[#858A98]/60">→</span>
                )}
              </div>

              {/* Mini geometric icon per step */}
              <div className="my-[1.4cqh] flex min-h-0 flex-1 items-center justify-center rounded-sm border border-[#252834]/70 bg-[#08090D] p-1">
                <svg viewBox="0 0 120 74" className="h-full max-h-[11cqh] w-full" preserveAspectRatio="xMidYMid meet">
                  {idx === 0 && (
                    <g>
                      <rect x="26" y="17" width="68" height="40" rx="3" fill="none" stroke="#A78BFA" strokeWidth="1.5" />
                      <text x="60" y="42" textAnchor="middle" fill="#F5F5F7" fontSize="15" fontFamily="JetBrains Mono">
                        K = 5
                      </text>
                    </g>
                  )}
                  {idx === 1 && (
                    <g>
                      <circle cx="60" cy="37" r="4" fill="#F5F5F7" />
                      {[[22, 18], [96, 20], [28, 58], [92, 56], [62, 14]].map(([x, y], i) => (
                        <g key={i}>
                          <line x1="60" y1="37" x2={x} y2={y} stroke="#22D3EE" strokeOpacity="0.6" strokeDasharray="2 2" />
                          <circle cx={x} cy={y} r="3" fill="#858A98" />
                        </g>
                      ))}
                    </g>
                  )}
                  {idx === 2 && (
                    <g>
                      <circle cx="60" cy="37" r="24" fill="#A78BFA" fillOpacity="0.12" stroke="#A78BFA" strokeWidth="1.4" strokeDasharray="3 2" />
                      <circle cx="60" cy="37" r="4" fill="#F5F5F7" />
                      {[[46, 28], [72, 26], [52, 49], [74, 46], [60, 22]].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="3.2" fill={i === 4 ? '#34D399' : '#A78BFA'} />
                      ))}
                      <circle cx="18" cy="18" r="2.5" fill="#858A98" fillOpacity="0.35" />
                      <circle cx="102" cy="58" r="2.5" fill="#858A98" fillOpacity="0.35" />
                    </g>
                  )}
                  {idx === 3 && (
                    <g>
                      <rect x="20" y="18" width="64" height="10" rx="1" fill="#A78BFA" />
                      <text x="90" y="26" fill="#A78BFA" fontSize="9.5" fontFamily="JetBrains Mono">4</text>
                      <rect x="20" y="34" width="16" height="10" rx="1" fill="#34D399" />
                      <text x="42" y="42" fill="#34D399" fontSize="9.5" fontFamily="JetBrains Mono">1</text>
                      <rect x="20" y="50" width="4" height="10" rx="1" fill="#252834" />
                      <text x="30" y="58" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">0</text>
                    </g>
                  )}
                  {idx === 4 && (
                    <g>
                      <rect x="14" y="18" width="92" height="38" rx="3" fill="#22D3EE" fillOpacity="0.14" stroke="#22D3EE" strokeWidth="1.5" />
                      <text x="60" y="34" textAnchor="middle" fill="#22D3EE" fontSize="9" fontFamily="JetBrains Mono">
                        CLASS 1 · 80%
                      </text>
                      <text x="60" y="48" textAnchor="middle" fill="#F5F5F7" fontSize="10.5" fontFamily="Space Grotesk" fontWeight="600">
                        Versicolor
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              <div className="shrink-0">
                <h2 className="font-display text-[clamp(13px,1.12cqw,16.5px)] font-semibold text-[#F5F5F7]">
                  {step.title}
                </h2>
                <p className="mt-1 font-sans text-[clamp(10px,0.82cqw,12px)] leading-snug text-[#858A98]">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 rounded-sm border border-[#252834] bg-[#11131A]/85 px-4 py-2 font-mono text-[clamp(9.5px,0.8cqw,11.5px)] text-[#858A98]">
          <span>
            <span className="text-[#22D3EE]">TIE-BREAKING:</span> Odd K reduces ties;{' '}
            <code className="text-[#F5F5F7]">weights=&quot;distance&quot;</code> scales each vote by{' '}
            <span className="text-[#A78BFA]">1 / d</span> so nearer points carry more authority.
          </span>
          <span className="shrink-0 text-[#A78BFA]">5 STEPS PER QUERY</span>
        </div>
      </div>
    </SlideLayout>
  )
}
