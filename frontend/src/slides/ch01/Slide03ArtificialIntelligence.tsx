import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

const CAPABILITIES = [
  { code: '01', name: 'Perception', desc: 'Extract structured signals from vision, audio, and sensors.' },
  { code: '02', name: 'Reasoning', desc: 'Infer conclusions and evaluate constraints under uncertainty.' },
  { code: '03', name: 'Decision', desc: 'Select actions that optimize a defined objective.' },
  { code: '04', name: 'Learning', desc: 'Improve performance automatically as new data arrives.' },
] as const

/** Slide 03 — Artificial Intelligence */
export function Slide03ArtificialIntelligence() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.4cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 01 · ARTIFICIAL INTELLIGENCE"
              title={
                <>
                  Engineering <span className="text-[#A78BFA]">intelligent</span> behavior.
                </>
              }
              subtitle="Artificial Intelligence is the broad scientific discipline of building systems capable of performing tasks that typically require human cognition."
            />

            <div className="grid grid-cols-1 gap-2">
              {CAPABILITIES.map((cap, idx) => (
                <motion.div
                  key={cap.code}
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 + idx * 0.07 }}
                  className="flex items-baseline gap-3 rounded-sm border border-[#252834] bg-[#11131A]/80 px-3.5 py-2"
                >
                  <span className="font-mono text-[clamp(10px,0.8cqw,11px)] text-[#22D3EE]">{cap.code}</span>
                  <span className="font-display text-[clamp(12px,1.02cqw,14px)] font-medium text-[#F5F5F7]">
                    {cap.name}
                  </span>
                  <span className="text-[clamp(11px,0.92cqw,13px)] text-[#858A98]">{cap.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 01.C"
            title="AI CAPABILITY ARCHITECTURE"
            meta="SCOPE: DISCIPLINE"
            caption="AI encompasses both symbolic rule systems and statistical learning — Machine Learning is one core engine inside it."
            className="h-full"
          >
            <svg viewBox="0 0 560 360" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Outer AI Boundary */}
              <motion.rect
                x="28"
                y="24"
                width="504"
                height="312"
                rx="4"
                fill="#08090D"
                stroke="#A78BFA"
                strokeWidth="1.25"
                initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
              />
              <text x="48" y="50" fill="#A78BFA" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="2">
                ARTIFICIAL INTELLIGENCE (UMBRELLA FIELD)
              </text>

              {/* Four internal pillars */}
              {[
                { x: 52, y: 74, w: 220, h: 110, tag: 'SYMBOLIC AI', sub: 'Search · Logic · Heuristics', accent: '#858A98' },
                { x: 288, y: 74, w: 220, h: 110, tag: 'PLANNING & CONTROL', sub: 'Optimization · Robotics', accent: '#858A98' },
                { x: 52, y: 200, w: 220, h: 112, tag: 'KNOWLEDGE SYSTEMS', sub: 'Graphs · Ontologies', accent: '#858A98' },
                { x: 288, y: 200, w: 220, h: 112, tag: 'MACHINE LEARNING', sub: 'Models learned from data', accent: '#22D3EE' },
              ].map((box, idx) => (
                <motion.g
                  key={box.tag}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + idx * 0.08 }}
                >
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.w}
                    height={box.h}
                    rx="3"
                    fill={box.accent === '#22D3EE' ? '#11131A' : '#0D0F15'}
                    stroke={box.accent === '#22D3EE' ? '#22D3EE' : '#252834'}
                    strokeWidth={box.accent === '#22D3EE' ? '1.5' : '1'}
                  />
                  <circle cx={box.x + 18} cy={box.y + 24} r="3.5" fill={box.accent} />
                  <text x={box.x + 30} y={box.y + 28} fill="#F5F5F7" fontSize="11.5" fontFamily="Space Grotesk" fontWeight="600">
                    {box.tag}
                  </text>
                  <text x={box.x + 18} y={box.y + 56} fill="#858A98" fontSize="11" fontFamily="Inter">
                    {box.sub}
                  </text>
                  {box.accent === '#22D3EE' && (
                    <text x={box.x + 18} y={box.y + 92} fill="#22D3EE" fontSize="9.5" fontFamily="JetBrains Mono" letterSpacing="1.4">
                      FOCUS OF KERNEL →
                    </text>
                  )}
                </motion.g>
              ))}
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
