import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 14 — Training, Inference & Generalization */
export function Slide14Generalization() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 03 · THE TRUE OBJECTIVE"
          title={
            <>
              Memorization is not <span className="text-[#A78BFA]">generalization.</span>
            </>
          }
          subtitle="Training fits known data; inference faces the unseen. Real learning means performing well on examples never observed before."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-[2.2cqw]">
          {/* Memorization */}
          <div className="col-span-6 flex min-h-0 flex-col">
            <DiagramFrame
              figure="FIG 03.D · MEMORIZING NOISE"
              meta="HIGH TRAIN / POOR UNSEEN"
              caption="Chasing every noisy outlier yields 100% training score but misclassifies new observations (white rings)."
              className="h-full"
            >
              <svg viewBox="0 0 420 245" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <line x1="36" y1="210" x2="392" y2="210" stroke="#252834" />
                <line x1="36" y1="22" x2="36" y2="210" stroke="#252834" />

                {/* Jagged overfit boundary */}
                <motion.path
                  d="M 54 190 L 116 146 L 146 184 L 182 96 L 214 148 L 246 72 L 284 132 L 324 52 L 372 78"
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="2"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.85, delay: 0.15 }}
                />

                {/* Training points */}
                {[[88, 126], [116, 108], [164, 72], [218, 66], [272, 46], [146, 166]].map(([cx, cy], i) => (
                  <circle key={`m1-${i}`} cx={cx} cy={cy} r="4.5" fill="#22D3EE" />
                ))}
                {[[162, 182], [228, 174], [280, 164], [332, 140], [344, 184], [214, 134]].map(([cx, cy], i) => (
                  <circle key={`m2-${i}`} cx={cx} cy={cy} r="4.5" fill="#A78BFA" />
                ))}

                {/* Unseen test points (misclassified by jagged loop) */}
                <circle cx="152" cy="144" r="7" fill="none" stroke="#F5F5F7" strokeWidth="1.75" />
                <circle cx="242" cy="108" r="7" fill="none" stroke="#F5F5F7" strokeWidth="1.75" />
                <text x="166" y="148" fill="#F5F5F7" fontSize="9" fontFamily="JetBrains Mono">
                  unseen error
                </text>
              </svg>
            </DiagramFrame>
          </div>

          {/* Generalization */}
          <div className="col-span-6 flex min-h-0 flex-col">
            <DiagramFrame
              figure="FIG 03.E · GENERALIZING STRUCTURE"
              meta="STABLE ON UNSEEN DATA"
              caption="Capturing the underlying trend tolerates training noise and classifies unseen points accurately."
              className="h-full border-[#22D3EE]/55"
            >
              <svg viewBox="0 0 420 245" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <line x1="36" y1="210" x2="392" y2="210" stroke="#252834" />
                <line x1="36" y1="22" x2="36" y2="210" stroke="#252834" />

                {/* Smooth generalizing boundary */}
                <motion.path
                  d="M 54 190 C 140 162, 230 116, 372 48"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="2.25"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.75, delay: 0.25 }}
                />

                {/* Training points */}
                {[[88, 126], [116, 108], [164, 72], [218, 66], [272, 46], [146, 166]].map(([cx, cy], i) => (
                  <circle key={`g1-${i}`} cx={cx} cy={cy} r="4.5" fill="#22D3EE" />
                ))}
                {[[162, 182], [228, 174], [280, 164], [332, 140], [344, 184], [214, 134]].map(([cx, cy], i) => (
                  <circle key={`g2-${i}`} cx={cx} cy={cy} r="4.5" fill="#A78BFA" />
                ))}

                {/* Unseen test points classified correctly */}
                <circle cx="152" cy="144" r="7" fill="#22D3EE" fillOpacity="0.2" stroke="#F5F5F7" strokeWidth="1.75" />
                <circle cx="242" cy="108" r="7" fill="#A78BFA" fillOpacity="0.2" stroke="#F5F5F7" strokeWidth="1.75" />
                <text x="256" y="112" fill="#22D3EE" fontSize="9" fontFamily="JetBrains Mono">
                  unseen correct
                </text>
              </svg>
            </DiagramFrame>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
