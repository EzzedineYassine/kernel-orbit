import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 14 — Training, Inference & Generalization in Recommendations */
export function Slide14Generalization() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 03 · GENERALIZATION & REGULARIZATION"
          title={
            <>
              Memorizing baskets vs. <span className="text-[#A78BFA]">learning taste.</span>
            </>
          }
          subtitle="Too many unregularized latent factors memorize historical noise; proper regularization (λ) generalizes to future purchases."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-[2.2cqw]">
          <div className="col-span-6 flex min-h-0 flex-col">
            <DiagramFrame
              figure="FIG 03.D · OVERFIT FACTORS"
              meta="HIGH k · TINY λ"
              caption="Reconstructs past training orders tightly but fails when recommending unseen future items."
              className="h-full"
            >
              <svg viewBox="0 0 420 240" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <line x1="36" y1="204" x2="392" y2="204" stroke="#252834" />
                <line x1="36" y1="22" x2="36" y2="204" stroke="#252834" />
                <motion.path
                  d="M 52 178 L 96 76 L 138 164 L 184 52 L 228 158 L 272 64 L 320 152 L 368 48"
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="2"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.85, delay: 0.15 }}
                />
                {[[96, 76], [184, 52], [272, 64], [368, 48]].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4.5" fill="#A78BFA" />
                ))}
                <circle cx="152" cy="116" r="7" fill="none" stroke="#F5F5F7" strokeWidth="1.75" />
                <circle cx="296" cy="108" r="7" fill="none" stroke="#F5F5F7" strokeWidth="1.75" />
                <line
                  x1="156"
                  y1="123"
                  x2="188"
                  y2="180"
                  stroke="#858A98"
                  strokeWidth="1"
                  strokeDasharray="2.5 2.5"
                />
                <text x="248" y="191" textAnchor="middle" fill="#F5F5F7" fontSize="9.5" fontFamily="JetBrains Mono">
                  missed future order
                </text>
              </svg>
            </DiagramFrame>
          </div>

          <div className="col-span-6 flex min-h-0 flex-col">
            <DiagramFrame
              figure="FIG 03.E · REGULARIZED FACTORS"
              meta="BALANCED k · L₂ PENALTY λ"
              caption="L₂ regularization shrinks noisy weights, capturing durable cross-product affinity across thousands of shoppers."
              className="h-full border-[#22D3EE]/55"
            >
              <svg viewBox="0 0 420 240" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <line x1="36" y1="204" x2="392" y2="204" stroke="#252834" />
                <line x1="36" y1="22" x2="36" y2="204" stroke="#252834" />
                <motion.path
                  d="M 52 178 C 138 148, 232 108, 368 58"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="2.25"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.75, delay: 0.25 }}
                />
                {[[96, 152], [184, 118], [272, 88], [344, 68]].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4.5" fill="#22D3EE" />
                ))}
                <circle cx="152" cy="134" r="7" fill="#22D3EE" fillOpacity="0.2" stroke="#F5F5F7" strokeWidth="1.75" />
                <circle cx="296" cy="84" r="7" fill="#22D3EE" fillOpacity="0.2" stroke="#F5F5F7" strokeWidth="1.75" />
                <text x="206" y="160" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                  generalizes to unseen future buys
                </text>
              </svg>
            </DiagramFrame>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
