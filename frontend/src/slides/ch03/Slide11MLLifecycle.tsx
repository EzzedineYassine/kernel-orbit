import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SlideLayout } from '../../presentation/SlideLayout'

const STAGES = [
  { num: '01', name: 'Data', detail: 'Collect 150 labeled Iris observations', accent: '#858A98' },
  { num: '02', name: 'Preprocess', detail: 'Clean & validate features (no leakage)', accent: '#A78BFA' },
  { num: '03', name: 'Split', detail: 'Stratified 80 / 20 train-test partition', accent: '#22D3EE' },
  { num: '04', name: 'Fit', detail: 'Fit scaler + KNN strictly on train set', accent: '#A78BFA' },
  { num: '05', name: 'Evaluate', detail: 'Measure held-out test & 5-fold CV', accent: '#22D3EE' },
  { num: '06', name: 'Infer', detail: 'Classify unseen points in real time', accent: '#F5F5F7' },
] as const

/** Slide 11 — The Machine Learning Lifecycle */
export function Slide11MLLifecycle() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2.2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 03 · HOW LEARNING HAPPENS"
          title={
            <>
              The Machine Learning <span className="text-[#A78BFA]">Lifecycle</span>
            </>
          }
          subtitle="Training a reliable model is an engineering pipeline — order matters to prevent subtle bias."
          compact
        />

        <DiagramFrame
          figure="FIG 03.A"
          title="SIX-STAGE SUPERVISED PIPELINE"
          meta="DATA → MODEL → INFERENCE"
          caption="Note: Fitting any scaling or feature transform happens strictly inside Stage 04 on the training split alone."
          className="min-h-0 flex-1"
          bodyClassName="flex-col justify-center"
        >
          <div className="flex w-full flex-col gap-[3cqh] px-2">
            {/* Animated horizontal flow */}
            <svg viewBox="0 0 1040 165" className="w-full" preserveAspectRatio="xMidYMid meet">
              {/* Connecting track */}
              <motion.line
                x1="82"
                y1="68"
                x2="958"
                y2="68"
                stroke="#252834"
                strokeWidth="2"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.75, delay: 0.1 }}
              />
              <motion.line
                x1="82"
                y1="68"
                x2="958"
                y2="68"
                stroke="#22D3EE"
                strokeOpacity="0.45"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.25 }}
              />

              {STAGES.map((stage, idx) => {
                const cx = 82 + idx * 175
                return (
                  <motion.g
                    key={stage.num}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
                  >
                    <rect
                      x={cx - 68}
                      y="24"
                      width="136"
                      height="88"
                      rx="3"
                      fill="#08090D"
                      stroke={stage.accent}
                      strokeOpacity="0.7"
                      strokeWidth="1.25"
                    />
                    <text x={cx - 54} y="46" fill={stage.accent} fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.5">
                      STAGE {stage.num}
                    </text>
                    <text x={cx - 54} y="74" fill="#F5F5F7" fontSize="17" fontFamily="Space Grotesk" fontWeight="600">
                      {stage.name}
                    </text>
                    <line x1={cx - 54} y1="86" x2={cx + 54} y2="86" stroke="#252834" />
                    <circle cx={cx} cy="112" r="4" fill={stage.accent} />

                    {idx < STAGES.length - 1 && (
                      <polygon points={`${cx + 80},63 ${cx + 90},68 ${cx + 80},73`} fill="#22D3EE" />
                    )}
                  </motion.g>
                )
              })}

              {/* Iteration feedback loop from Evaluate back to Fit */}
              <motion.path
                d="M 782 120 L 782 148 L 607 148 L 607 124"
                fill="none"
                stroke="#A78BFA"
                strokeWidth="1.25"
                strokeDasharray="4 3"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.65 }}
              />
              <polygon points="602,126 607,117 612,126" fill="#A78BFA" />
              <text x="694" y="160" textAnchor="middle" fill="#A78BFA" fontSize="9.5" fontFamily="JetBrains Mono" letterSpacing="1">
                TUNE HYPERPARAMETERS (CV ONLY)
              </text>
            </svg>

            {/* Stage notes row */}
            <div className="grid grid-cols-6 gap-2.5">
              {STAGES.map((stage) => (
                <div
                  key={stage.num}
                  className="rounded-sm border border-[#252834]/80 bg-[#08090D]/80 px-2.5 py-2 text-center font-sans text-[clamp(10px,0.84cqw,12px)] leading-snug text-[#858A98]"
                >
                  {stage.detail}
                </div>
              ))}
            </div>
          </div>
        </DiagramFrame>
      </div>
    </SlideLayout>
  )
}
