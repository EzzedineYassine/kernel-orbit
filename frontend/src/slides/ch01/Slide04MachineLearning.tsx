import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 04 — Machine Learning (AI → ML → DL nested diagram) */
export function Slide04MachineLearning() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.4cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 01 · MACHINE LEARNING"
              title={
                <>
                  A focused subset of <span className="text-[#22D3EE]">AI.</span>
                </>
              }
              subtitle="Machine Learning builds mathematical models that extract patterns directly from empirical data."
            />

            <div className="flex flex-col gap-2.5">
              {[
                {
                  tag: 'ARTIFICIAL INTELLIGENCE',
                  color: '#858A98',
                  text: 'Any system exhibiting goal-directed intelligent behavior.',
                },
                {
                  tag: 'MACHINE LEARNING',
                  color: '#A78BFA',
                  text: 'Algorithms that learn latent structure from data (Matrix Factorization, Trees, Linear Models).',
                },
                {
                  tag: 'DEEP LEARNING',
                  color: '#22D3EE',
                  text: 'Multi-layer neural networks learning hierarchical representations.',
                },
              ].map((tier) => (
                <div
                  key={tier.tag}
                  className="rounded-sm border border-[#252834] bg-[#11131A]/80 px-4 py-2.5"
                >
                  <div className="flex items-center gap-2 font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em]" style={{ color: tier.color }}>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tier.color }} />
                    {tier.tag}
                  </div>
                  <p className="mt-1 font-sans text-[clamp(11.5px,0.96cqw,13.5px)] text-[#858A98]">{tier.text}</p>
                </div>
              ))}
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 01.D"
            title="CONCENTRIC TAXONOMY"
            meta="AI ⊃ ML ⊃ DL"
            caption="Every Deep Learning model is Machine Learning, and every Machine Learning model is AI — not vice versa."
            className="h-full"
          >
            <svg viewBox="0 0 580 380" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Outer circle: AI */}
              <motion.circle
                cx="225"
                cy="192"
                r="164"
                fill="#0D0F16"
                stroke="#858A98"
                strokeOpacity="0.55"
                strokeWidth="1.25"
                initial={reduced ? false : { scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45 }}
              />
              {/* Middle circle: Machine Learning */}
              <motion.circle
                cx="225"
                cy="214"
                r="116"
                fill="#A78BFA"
                fillOpacity="0.1"
                stroke="#A78BFA"
                strokeWidth="1.75"
                initial={reduced ? false : { scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.14 }}
              />
              {/* Inner circle: Deep Learning */}
              <motion.circle
                cx="225"
                cy="242"
                r="62"
                fill="#22D3EE"
                fillOpacity="0.14"
                stroke="#22D3EE"
                strokeWidth="1.5"
                initial={reduced ? false : { scale: 0.84, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.28 }}
              />

              {/* Inside labels */}
              <text x="225" y="64" textAnchor="middle" fill="#858A98" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="1.8">
                ARTIFICIAL INTELLIGENCE
              </text>
              <text x="225" y="136" textAnchor="middle" fill="#A78BFA" fontSize="11.5" fontFamily="JetBrains Mono" letterSpacing="1.5">
                MACHINE LEARNING
              </text>
              <text x="225" y="246" textAnchor="middle" fill="#22D3EE" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="1.2">
                DEEP LEARNING
              </text>

              {/* Callout rails on the right */}
              <line x1="364" y1="88" x2="416" y2="88" stroke="#858A98" strokeOpacity="0.5" strokeDasharray="3 3" />
              <circle cx="364" cy="88" r="3" fill="#858A98" />
              <text x="424" y="84" fill="#F5F5F7" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">
                Rule Engines & Search
              </text>
              <text x="424" y="100" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                Handcrafted logic
              </text>

              <line x1="336" y1="184" x2="416" y2="184" stroke="#A78BFA" />
              <circle cx="336" cy="184" r="3.5" fill="#A78BFA" />
              <text x="424" y="180" fill="#A78BFA" fontSize="11.5" fontFamily="Space Grotesk" fontWeight="600">
                ALS · Matrix Factorization
              </text>
              <text x="424" y="196" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                Collaborative Filtering · ORBIT
              </text>

              <line x1="286" y1="252" x2="416" y2="252" stroke="#22D3EE" strokeDasharray="3 3" />
              <circle cx="286" cy="252" r="3" fill="#22D3EE" />
              <text x="424" y="248" fill="#F5F5F7" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">
                Neural Networks
              </text>
              <text x="424" y="264" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                Transformers · CNNs
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
