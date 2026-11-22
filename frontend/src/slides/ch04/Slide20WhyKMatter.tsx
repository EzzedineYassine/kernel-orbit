import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 20 — Why Does K Matter? */
export function Slide20WhyKMatter() {
  const reduced = useReducedMotion()

  const panels = [
    {
      fig: 'K = 1 · SMALL K',
      tag: 'HIGH VARIANCE / OVERFIT',
      accent: '#A78BFA',
      caption: 'Boundary twists around single noisy points, forming fragile islands that fail on unseen data.',
      path: 'M 28 176 L 76 136 L 98 166 L 130 82 L 154 134 L 182 54 L 210 118 L 246 42',
      island: true,
    },
    {
      fig: 'K = 5 · BALANCED',
      tag: 'BIAS–VARIANCE SWEET SPOT',
      accent: '#22D3EE',
      caption: 'Smoothly separates species clusters while ignoring isolated outliers.',
      path: 'M 28 176 C 96 146, 152 108, 246 46',
      island: false,
    },
    {
      fig: 'K = 15 · LARGE K',
      tag: 'HIGH BIAS / UNDERFIT',
      accent: '#858A98',
      caption: 'Over-smooths the boundary into a rigid line, blurring genuine local curvature between classes.',
      path: 'M 28 150 L 246 78',
      island: false,
    },
  ] as const

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 04 · HYPERPARAMETER SENSITIVITY"
          title={
            <>
              Why does <span className="text-[#A78BFA]">K</span> matter?
            </>
          }
          subtitle="K controls model complexity directly — sliding smoothly from memorization (K = 1) toward rigid averaging (large K)."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-[1.8cqw]">
          {panels.map((p, idx) => (
            <motion.div
              key={p.fig}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.1 }}
              className="col-span-4 flex min-h-0 flex-col"
            >
              <DiagramFrame
                figure={p.fig}
                meta={p.tag}
                caption={p.caption}
                className={`h-full ${idx === 1 ? 'border-[#22D3EE]/55' : ''}`}
              >
                <svg viewBox="0 0 272 204" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                  <line x1="20" y1="184" x2="256" y2="184" stroke="#252834" />
                  <line x1="20" y1="18" x2="20" y2="184" stroke="#252834" />

                  {/* Optional noisy island for K=1 */}
                  {p.island && (
                    <circle
                      cx="98"
                      cy="160"
                      r="14"
                      fill="#22D3EE"
                      fillOpacity="0.14"
                      stroke="#A78BFA"
                      strokeWidth="1.2"
                      strokeDasharray="3 2"
                    />
                  )}

                  {/* Boundary curve */}
                  <motion.path
                    d={p.path}
                    fill="none"
                    stroke={p.accent}
                    strokeWidth="2.2"
                    initial={reduced ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 + idx * 0.1 }}
                  />

                  {/* Class A points */}
                  {[[54, 114], [78, 86], [116, 62], [156, 48], [86, 118], [98, 160]].map(([cx, cy], i) => (
                    <circle key={`a-${i}`} cx={cx} cy={cy} r="4.2" fill="#22D3EE" />
                  ))}
                  {/* Class B points */}
                  {[[124, 162], [164, 148], [198, 128], [224, 102], [214, 158], [154, 126]].map(([cx, cy], i) => (
                    <circle key={`b-${i}`} cx={cx} cy={cy} r="4.2" fill="#A78BFA" />
                  ))}
                </svg>
              </DiagramFrame>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
