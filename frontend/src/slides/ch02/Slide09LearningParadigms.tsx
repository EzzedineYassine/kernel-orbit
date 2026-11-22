import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 09 — The Three Main Learning Paradigms */
export function Slide09LearningParadigms() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 02 · LEARNING PARADIGMS"
          title={
            <>
              Three ways machines <span className="text-[#A78BFA]">learn.</span>
            </>
          }
          subtitle="The structure of feedback determines the learning paradigm."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-[1.8cqw]">
          {/* Supervised */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="col-span-4 flex min-h-0 flex-col"
          >
            <DiagramFrame
              figure="01 · SUPERVISED"
              meta="KERNEL FOCUS"
              caption="Learns from (input, label) pairs to predict targets on unseen data."
              className="h-full border-[#22D3EE]/55"
            >
              <svg viewBox="0 0 260 190" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <line x1="24" y1="162" x2="236" y2="162" stroke="#252834" />
                <line x1="24" y1="22" x2="24" y2="162" stroke="#252834" />
                <path d="M 38 148 C 96 126, 134 72, 224 38" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeDasharray="4 4" />
                {[
                  [58, 72],
                  [84, 52],
                  [72, 96],
                  [114, 64],
                  [96, 86],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="5" fill="#22D3EE" />
                ))}
                {[
                  [156, 132],
                  [184, 114],
                  [206, 92],
                  [168, 98],
                  [198, 138],
                ].map(([cx, cy], i) => (
                  <rect key={i} x={cx - 4.5} y={cy - 4.5} width="9" height="9" fill="#A78BFA" />
                ))}
                <text x="130" y="182" textAnchor="middle" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                  LABELED EXAMPLES → BOUNDARY
                </text>
              </svg>
            </DiagramFrame>
          </motion.div>

          {/* Unsupervised */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="col-span-4 flex min-h-0 flex-col"
          >
            <DiagramFrame
              figure="02 · UNSUPERVISED"
              meta="NO LABELS"
              caption="Discovers latent structure, clusters, or compressed representations in raw inputs."
              className="h-full"
            >
              <svg viewBox="0 0 260 190" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <circle cx="84" cy="84" r="42" fill="#A78BFA" fillOpacity="0.08" stroke="#A78BFA" strokeDasharray="3 3" />
                <circle cx="178" cy="112" r="40" fill="#22D3EE" fillOpacity="0.08" stroke="#22D3EE" strokeDasharray="3 3" />
                {[
                  [72, 74],
                  [94, 68],
                  [86, 96],
                  [66, 94],
                  [102, 86],
                  [164, 102],
                  [186, 98],
                  [178, 124],
                  [194, 118],
                  [164, 122],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#F5F5F7" fillOpacity="0.85" />
                ))}
                <text x="130" y="182" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  UNLABELED DATA → CLUSTERS
                </text>
              </svg>
            </DiagramFrame>
          </motion.div>

          {/* Reinforcement */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="col-span-4 flex min-h-0 flex-col"
          >
            <DiagramFrame
              figure="03 · REINFORCEMENT"
              meta="REWARD LOOP"
              caption="An agent interacts with an environment, learning policies that maximize cumulative reward."
              className="h-full"
            >
              <svg viewBox="0 0 260 190" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <rect x="74" y="24" width="112" height="40" rx="3" fill="#08090D" stroke="#A78BFA" />
                <text x="130" y="48" textAnchor="middle" fill="#F5F5F7" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">
                  AGENT
                </text>

                <rect x="64" y="114" width="132" height="40" rx="3" fill="#08090D" stroke="#252834" />
                <text x="130" y="138" textAnchor="middle" fill="#F5F5F7" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">
                  ENVIRONMENT
                </text>

                {/* Action arc */}
                <path d="M 186 44 C 228 44, 228 134, 198 134" fill="none" stroke="#22D3EE" strokeWidth="1.5" />
                <polygon points="202,129 194,134 202,139" fill="#22D3EE" />
                <text x="234" y="92" textAnchor="middle" fill="#22D3EE" fontSize="9" fontFamily="JetBrains Mono">
                  action
                </text>

                {/* State/Reward arc */}
                <path d="M 64 134 C 28 134, 28 44, 72 44" fill="none" stroke="#A78BFA" strokeWidth="1.5" />
                <polygon points="66,39 74,44 66,49" fill="#A78BFA" />
                <text x="27" y="88" textAnchor="middle" fill="#A78BFA" fontSize="9" fontFamily="JetBrains Mono">
                  state
                </text>
                <text x="27" y="100" textAnchor="middle" fill="#A78BFA" fontSize="9" fontFamily="JetBrains Mono">
                  +reward
                </text>

                <text x="130" y="182" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  TRIAL &amp; FEEDBACK → POLICY
                </text>
              </svg>
            </DiagramFrame>
          </motion.div>
        </div>
      </div>
    </SlideLayout>
  )
}
