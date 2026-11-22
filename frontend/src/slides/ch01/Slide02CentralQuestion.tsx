import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 02 — The Central Question */
export function Slide02CentralQuestion() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.8cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 01 · THE CENTRAL QUESTION"
              title={
                <>
                  Patterns without{' '}
                  <span className="text-[#22D3EE]">explicit rules.</span>
                </>
              }
              subtitle="How can a computer recognize complex patterns without a human writing every single condition?"
            />

            <div className="flex flex-col gap-3 border-l border-[#252834] pl-4">
              <div>
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#A78BFA] uppercase">
                  The Limit of Handcrafted Logic
                </div>
                <p className="mt-1 font-sans text-[clamp(12px,1.05cqw,14.5px)] leading-relaxed text-[#858A98]">
                  Real-world signals — petals, voices, pixels, medical scans — have too many edge cases for static{' '}
                  <code className="font-mono text-[#F5F5F7]">if / else</code> trees.
                </p>
              </div>
              <div>
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#22D3EE] uppercase">
                  The Shift
                </div>
                <p className="mt-1 font-sans text-[clamp(12px,1.05cqw,14.5px)] leading-relaxed text-[#858A98]">
                  Instead of encoding answers manually, we let the machine infer structure directly from observed examples.
                </p>
              </div>
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 01.B"
            title="BRITTLE RULES VS. LEARNED STRUCTURE"
            caption="Static thresholds fracture on edge cases; learned boundaries adapt to the geometry of data."
            className="h-full"
          >
            <svg viewBox="0 0 600 360" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Left panel: Brittle rule stack */}
              <rect x="16" y="18" width="256" height="324" rx="3" fill="#08090D" stroke="#252834" />
              <text x="32" y="42" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.5">
                EXPLICIT RULE TREE
              </text>

              {[
                { y: 66, text: 'if (len < 2.1 && wid < 0.7)' },
                { y: 108, text: 'else if (len < 4.8 && hue == ...)' },
                { y: 150, text: 'else if (noise > 0.12 && tilt)' },
                { y: 192, text: 'else if (edge_case_419 == true)' },
              ].map((rule, idx) => (
                <motion.g
                  key={rule.y}
                  initial={reduced ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 + idx * 0.08 }}
                >
                  <rect x="30" y={rule.y} width="228" height="30" rx="2" fill="#11131A" stroke="#252834" />
                  <text x="40" y={rule.y + 19} fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                    {rule.text}
                  </text>
                </motion.g>
              ))}

              <rect x="30" y="242" width="228" height="44" rx="2" fill="#11131A" stroke="#A78BFA" strokeDasharray="4 4" />
              <text x="144" y="261" textAnchor="middle" fill="#A78BFA" fontSize="10" fontFamily="JetBrains Mono">
                UNSEEN VARIATION
              </text>
              <text x="144" y="277" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="Inter">
                Breaks when data shifts
              </text>

              <text x="144" y="324" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                COMPLEXITY: EXPLODES
              </text>

              {/* Divider arrow */}
              <line x1="286" y1="180" x2="314" y2="180" stroke="#22D3EE" strokeWidth="1.5" />
              <polygon points="314,175 324,180 314,185" fill="#22D3EE" />

              {/* Right panel: Continuous pattern manifold */}
              <rect x="334" y="18" width="250" height="324" rx="3" fill="#08090D" stroke="#252834" />
              <text x="350" y="42" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.5">
                LEARNED PATTERN SPACE
              </text>

              {/* Coordinate axes */}
              <line x1="364" y1="288" x2="562" y2="288" stroke="#252834" />
              <line x1="364" y1="68" x2="364" y2="288" stroke="#252834" />

              {/* Smooth learned boundary curve */}
              <motion.path
                d="M 374 265 C 430 245, 455 170, 488 145 C 515 125, 540 105, 558 84"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2"
                strokeDasharray="5 4"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.25 }}
              />

              {/* Cluster A (cyan) */}
              {[
                [394, 198],
                [412, 165],
                [430, 140],
                [388, 152],
                [418, 118],
                [446, 108],
                [402, 104],
              ].map(([cx, cy], i) => (
                <motion.circle
                  key={`a-${i}`}
                  cx={cx}
                  cy={cy}
                  r="4.5"
                  fill="#22D3EE"
                  initial={reduced ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
                />
              ))}

              {/* Cluster B (violet) */}
              {[
                [476, 250],
                [504, 232],
                [532, 206],
                [512, 180],
                [544, 156],
                [488, 205],
                [538, 250],
              ].map(([cx, cy], i) => (
                <motion.circle
                  key={`b-${i}`}
                  cx={cx}
                  cy={cy}
                  r="4.5"
                  fill="#A78BFA"
                  initial={reduced ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.35 + i * 0.04 }}
                />
              ))}

              {/* Unseen query point */}
              <motion.g
                initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <circle cx="468" cy="182" r="11" fill="none" stroke="#F5F5F7" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="468" cy="182" r="4" fill="#F5F5F7" />
              </motion.g>

              <text x="459" y="324" textAnchor="middle" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono">
                GENERALIZES FROM EXAMPLES
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
