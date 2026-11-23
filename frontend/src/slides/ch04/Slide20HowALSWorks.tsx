import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { SlideLayout } from '../../presentation/SlideLayout'

const ALS_STEPS = [
  {
    num: '01',
    title: 'Initialize Factors',
    desc: 'Seed customer matrix U and product matrix V with small random vectors.',
    accent: '#858A98',
  },
  {
    num: '02',
    title: 'Fix V → Solve U',
    desc: 'Hold product factors fixed; solve closed-form ridge regression for every customer uᵤ.',
    accent: '#22D3EE',
  },
  {
    num: '03',
    title: 'Fix U → Solve V',
    desc: 'Hold customer factors fixed; solve closed-form ridge regression for every product vᵢ.',
    accent: '#A78BFA',
  },
  {
    num: '04',
    title: 'Alternate & Converge',
    desc: 'Repeat steps 02–03 for N iterations (default 20) as weighted loss drops smoothly.',
    accent: '#22D3EE',
  },
  {
    num: '05',
    title: 'Score & Rank',
    desc: 'Compute personalized scores r̂ᵤᵢ = uᵤᵀ vᵢ across unseen catalog items.',
    accent: '#F5F5F7',
  },
] as const

/** Slide 20 — How Alternating Least Squares (ALS) Works */
export function Slide20HowALSWorks() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[1.8cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 04 · OPTIMIZATION MECHANICS"
          title={
            <>
              How <span className="text-[#A78BFA]">Alternating Least Squares</span> Works
            </>
          }
          subtitle="Optimizing U and V simultaneously is non-convex — holding one matrix fixed turns each half-step into an exact convex least-squares solve."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-5 gap-[1.2cqw]">
          {ALS_STEPS.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 + idx * 0.07 }}
              className="flex min-h-0 flex-col overflow-hidden rounded-sm border border-[#252834] bg-[#11131A]/90 p-[clamp(10px,1.05cqw,16px)]"
            >
              <div className="flex shrink-0 items-center justify-between">
                <span
                  className="font-mono text-[clamp(16px,1.5cqw,22px)] font-semibold"
                  style={{ color: step.accent }}
                >
                  {step.num}
                </span>
                {idx < ALS_STEPS.length - 1 && (
                  <span className="font-mono text-xs text-[#858A98]/60">→</span>
                )}
              </div>

              <div className="my-[1.4cqh] flex min-h-0 flex-1 items-center justify-center rounded-sm border border-[#252834]/70 bg-[#08090D] p-1">
                <svg viewBox="0 0 120 74" className="h-full max-h-[11cqh] w-full" preserveAspectRatio="xMidYMid meet">
                  {idx === 0 && (
                    <g>
                      <rect x="18" y="14" width="32" height="46" rx="2" fill="#22D3EE" fillOpacity="0.12" stroke="#858A98" strokeDasharray="3 2" />
                      <text x="34" y="41" textAnchor="middle" fill="#F5F5F7" fontSize="11" fontFamily="JetBrains Mono">U₀</text>
                      <rect x="66" y="24" width="38" height="26" rx="2" fill="#A78BFA" fillOpacity="0.12" stroke="#858A98" strokeDasharray="3 2" />
                      <text x="85" y="41" textAnchor="middle" fill="#F5F5F7" fontSize="11" fontFamily="JetBrains Mono">V₀ᵀ</text>
                    </g>
                  )}
                  {idx === 1 && (
                    <g>
                      <rect x="18" y="14" width="32" height="46" rx="2" fill="#22D3EE" fillOpacity="0.28" stroke="#22D3EE" strokeWidth="1.6" />
                      <text x="34" y="41" textAnchor="middle" fill="#22D3EE" fontSize="11" fontFamily="JetBrains Mono">SOLVE</text>
                      <rect x="68" y="24" width="34" height="26" rx="2" fill="#11131A" stroke="#252834" />
                      <text x="85" y="41" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">V fixed</text>
                    </g>
                  )}
                  {idx === 2 && (
                    <g>
                      <rect x="18" y="14" width="32" height="46" rx="2" fill="#11131A" stroke="#252834" />
                      <text x="34" y="41" textAnchor="middle" fill="#858A98" fontSize="9" fontFamily="JetBrains Mono">U fixed</text>
                      <rect x="64" y="24" width="42" height="26" rx="2" fill="#A78BFA" fillOpacity="0.28" stroke="#A78BFA" strokeWidth="1.6" />
                      <text x="85" y="41" textAnchor="middle" fill="#A78BFA" fontSize="11" fontFamily="JetBrains Mono">SOLVE</text>
                    </g>
                  )}
                  {idx === 3 && (
                    <g>
                      <path d="M 16 54 Q 44 22, 104 18" fill="none" stroke="#22D3EE" strokeWidth="2" />
                      <circle cx="104" cy="18" r="3.5" fill="#22D3EE" />
                      <text x="60" y="65" textAnchor="middle" fill="#858A98" fontSize="8.5" fontFamily="JetBrains Mono">
                        loss converges
                      </text>
                    </g>
                  )}
                  {idx === 4 && (
                    <g>
                      <rect x="14" y="16" width="92" height="42" rx="3" fill="#22D3EE" fillOpacity="0.14" stroke="#22D3EE" strokeWidth="1.4" />
                      <text x="60" y="34" textAnchor="middle" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono">
                        uᵤ · vᵢ → Top-N
                      </text>
                      <text x="60" y="48" textAnchor="middle" fill="#F5F5F7" fontSize="9" fontFamily="JetBrains Mono">
                        Ranked Gift List
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              <div className="shrink-0">
                <h2 className="font-display text-[clamp(13px,1.1cqw,16px)] font-semibold text-[#F5F5F7]">
                  {step.title}
                </h2>
                <p className="mt-1 font-sans text-[clamp(10px,0.82cqw,12px)] leading-snug text-[#858A98]">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 rounded-sm border border-[#252834] bg-[#11131A]/85 px-4 py-2 font-mono text-[clamp(9.5px,0.78cqw,11px)] text-[#858A98]">
          <span>
            <span className="text-[#22D3EE]">PARALLELIZABLE BY DESIGN:</span> Every customer solve in Step 02 is independent (same for products in Step 03) — why <code className="text-[#F5F5F7]">implicit</code> trains 3,751 × 3,049 in &lt;0.3s.
          </span>
          <span className="shrink-0 text-[#A78BFA]">CLOSED-FORM SOLVES</span>
        </div>
      </div>
    </SlideLayout>
  )
}
