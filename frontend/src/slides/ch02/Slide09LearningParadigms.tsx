import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 09 — The Three Main Learning Paradigms (+ Where Matrix Factorization Sits) */
export function Slide09LearningParadigms() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[1.8cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 02 · LEARNING PARADIGMS"
          title={
            <>
              Three paradigms — and <span className="text-[#22D3EE]">latent representation.</span>
            </>
          }
          subtitle="Different feedback signals drive different learning architectures; collaborative filtering discovers latent structure from interactions."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-[1.8cqw]">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="col-span-4 flex min-h-0 flex-col"
          >
            <DiagramFrame
              figure="01 · SUPERVISED"
              meta="EXPLICIT TARGETS"
              caption="Learns input-to-label mappings from paired ground-truth answers (classification & regression)."
              className="h-full"
            >
              <svg viewBox="0 0 260 185" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <line x1="24" y1="158" x2="236" y2="158" stroke="#252834" />
                <line x1="24" y1="20" x2="24" y2="158" stroke="#252834" />
                <path d="M 38 144 C 96 122, 134 70, 224 36" fill="none" stroke="#858A98" strokeWidth="1.6" strokeDasharray="4 4" />
                {[[58, 70], [84, 50], [72, 94], [114, 62], [96, 84]].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4.5" fill="#22D3EE" />
                ))}
                {[[156, 130], [184, 112], [206, 90], [168, 96], [198, 136]].map(([cx, cy], i) => (
                  <rect key={i} x={cx - 4} y={cy - 4} width="8" height="8" fill="#A78BFA" />
                ))}
                <text x="130" y="177" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  (x, y) PAIRS → PREDICTOR
                </text>
              </svg>
            </DiagramFrame>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="col-span-4 flex min-h-0 flex-col"
          >
            <DiagramFrame
              figure="02 · LATENT / MATRIX"
              meta="ORBIT FOCUS"
              caption="Factorizes interaction matrices into hidden customer & item embeddings without manual feature tags."
              className="h-full border-[#22D3EE]/60"
            >
              <svg viewBox="0 0 260 185" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <rect x="20" y="34" width="66" height="96" rx="2" fill="#08090D" stroke="#252834" />
                {[0, 1, 2, 3].map((r) =>
                  [0, 1, 2].map((c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={28 + c * 18}
                      y={44 + r * 20}
                      width="12"
                      height="12"
                      rx="1"
                      fill={(r + c) % 3 === 0 ? '#22D3EE' : '#11131A'}
                      fillOpacity={(r + c) % 3 === 0 ? 0.75 : 1}
                      stroke="#252834"
                    />
                  )),
                )}
                <text x="103" y="86" textAnchor="middle" fill="#858A98" fontSize="14" fontFamily="JetBrains Mono">≈</text>
                <rect x="120" y="34" width="28" height="96" rx="2" fill="#22D3EE" fillOpacity="0.16" stroke="#22D3EE" />
                <text x="134" y="86" textAnchor="middle" fill="#22D3EE" fontSize="12" fontFamily="JetBrains Mono">U</text>
                <text x="160" y="86" textAnchor="middle" fill="#858A98" fontSize="13" fontFamily="JetBrains Mono">×</text>
                <rect x="172" y="62" width="70" height="36" rx="2" fill="#A78BFA" fillOpacity="0.16" stroke="#A78BFA" />
                <text x="207" y="84" textAnchor="middle" fill="#A78BFA" fontSize="12" fontFamily="JetBrains Mono">Vᵀ</text>
                <text x="130" y="177" textAnchor="middle" fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono">
                  INTERACTIONS → EMBEDDINGS
                </text>
              </svg>
            </DiagramFrame>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="col-span-4 flex min-h-0 flex-col"
          >
            <DiagramFrame
              figure="03 · REINFORCEMENT"
              meta="REWARD LOOP"
              caption="An agent acts in an environment, adjusting policies to maximize long-term cumulative reward."
              className="h-full"
            >
              <svg viewBox="0 0 260 185" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                <rect x="74" y="22" width="112" height="38" rx="3" fill="#08090D" stroke="#A78BFA" />
                <text x="130" y="45" textAnchor="middle" fill="#F5F5F7" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">
                  AGENT
                </text>
                <rect x="64" y="110" width="132" height="38" rx="3" fill="#08090D" stroke="#252834" />
                <text x="130" y="133" textAnchor="middle" fill="#F5F5F7" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">
                  ENVIRONMENT
                </text>
                <path d="M 186 41 C 228 41, 228 129, 198 129" fill="none" stroke="#22D3EE" strokeWidth="1.5" />
                <polygon points="202,124 194,129 202,134" fill="#22D3EE" />
                <path d="M 64 129 C 28 129, 28 41, 72 41" fill="none" stroke="#A78BFA" strokeWidth="1.5" />
                <polygon points="66,36 74,41 66,46" fill="#A78BFA" />
                <text x="130" y="177" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                  TRIAL &amp; REWARD → POLICY
                </text>
              </svg>
            </DiagramFrame>
          </motion.div>
        </div>
      </div>
    </SlideLayout>
  )
}
