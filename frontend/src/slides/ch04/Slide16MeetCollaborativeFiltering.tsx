import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 16 — Meet Collaborative Filtering */
export function Slide16MeetCollaborativeFiltering() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 04 · MEET THE MODEL"
              title={
                <>
                  Meet <span className="text-[#22D3EE]">Collaborative Filtering</span>
                </>
              }
              subtitle="Instead of tagging product attributes manually, collaborative filtering learns shared taste directly from collective purchasing behavior."
              compact
            />

            <div className="flex flex-col gap-2.5">
              {[
                {
                  key: 'BEYOND SIMPLE OVERLAP',
                  accent: '#A78BFA',
                  desc: 'Matrix factorization does not merely find shoppers who bought the exact same item — it captures global structure across the entire matrix.',
                },
                {
                  key: 'ZERO MANUAL METADATA',
                  accent: '#22D3EE',
                  desc: 'Even without category tags or hand-coded descriptions, co-purchasing patterns reveal subtle gift affinities automatically.',
                },
                {
                  key: 'PERSONALIZED DISCOVERY',
                  accent: '#F5F5F7',
                  desc: 'Surfaces niche catalog items tailored to each shopper’s unique history rather than showing everyone the same bestsellers.',
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.key}
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.12 + idx * 0.08 }}
                  className="rounded-sm border border-[#252834] bg-[#11131A]/85 px-4 py-2.5"
                >
                  <div
                    className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em]"
                    style={{ color: item.accent }}
                  >
                    {item.key}
                  </div>
                  <p className="mt-1 font-sans text-[clamp(11px,0.92cqw,13px)] leading-snug text-[#858A98]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 04.A"
            title="LATENT COLLABORATIVE BRIDGE"
            meta="CUSTOMERS ↔ FACTORS ↔ PRODUCTS"
            caption="Customers and products connect through shared latent dimensions learned jointly across all 220,566 training interactions."
            className="h-full"
          >
            <svg viewBox="0 0 560 350" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Column Headers */}
              <text x="86" y="30" textAnchor="middle" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.6">
                CUSTOMERS (U)
              </text>
              <text x="280" y="30" textAnchor="middle" fill="#F5F5F7" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.6">
                LATENT FACTORS (k)
              </text>
              <text x="474" y="30" textAnchor="middle" fill="#A78BFA" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.6">
                PRODUCTS (V)
              </text>

              {/* Edges: Customers -> Latent */}
              {[
                [128, 86, 232, 92, '#22D3EE', 0.7],
                [128, 86, 232, 168, '#22D3EE', 0.35],
                [128, 170, 232, 92, '#22D3EE', 0.45],
                [128, 170, 232, 244, '#22D3EE', 0.75],
                [128, 254, 232, 168, '#22D3EE', 0.8],
                [128, 254, 232, 244, '#22D3EE', 0.35],
              ].map(([x1, y1, x2, y2, c, op], idx) => (
                <motion.line
                  key={`l-${idx}`}
                  x1={x1 as number}
                  y1={y1 as number}
                  x2={x2 as number}
                  y2={y2 as number}
                  stroke={c as string}
                  strokeOpacity={op as number}
                  strokeWidth="1.5"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.12 + idx * 0.04 }}
                />
              ))}

              {/* Edges: Latent -> Products */}
              {[
                [328, 92, 412, 74, '#A78BFA', 0.75],
                [328, 92, 412, 142, '#A78BFA', 0.65],
                [328, 168, 412, 142, '#A78BFA', 0.5],
                [328, 168, 412, 210, '#A78BFA', 0.8],
                [328, 244, 412, 210, '#A78BFA', 0.45],
                [328, 244, 412, 278, '#A78BFA', 0.85],
              ].map(([x1, y1, x2, y2, c, op], idx) => (
                <motion.line
                  key={`r-${idx}`}
                  x1={x1 as number}
                  y1={y1 as number}
                  x2={x2 as number}
                  y2={y2 as number}
                  stroke={c as string}
                  strokeOpacity={op as number}
                  strokeWidth="1.5"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.25 + idx * 0.04 }}
                />
              ))}

              {/* Customer Nodes */}
              {[
                { y: 66, label: 'CUST-14911' },
                { y: 150, label: 'CUST-12748' },
                { y: 234, label: 'CUST-17841' },
              ].map((u) => (
                <g key={u.label}>
                  <rect x="28" y={u.y} width="100" height="40" rx="3" fill="#08090D" stroke="#22D3EE" strokeOpacity="0.8" />
                  <text x="78" y={u.y + 24} textAnchor="middle" fill="#F5F5F7" fontSize="10" fontFamily="JetBrains Mono">
                    {u.label}
                  </text>
                </g>
              ))}

              {/* Latent Nodes */}
              {[
                { y: 72, tag: 'f₁', hint: 'Latent dim 1' },
                { y: 148, tag: 'f₂', hint: 'Latent dim 2' },
                { y: 224, tag: 'fₖ', hint: 'Latent dim k' },
              ].map((f) => (
                <g key={f.tag}>
                  <rect x="232" y={f.y} width="96" height="40" rx="20" fill="#11131A" stroke="#F5F5F7" strokeOpacity="0.55" />
                  <text x="280" y={f.y + 18} textAnchor="middle" fill="#22D3EE" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
                    {f.tag}
                  </text>
                  <text x="280" y={f.y + 32} textAnchor="middle" fill="#858A98" fontSize="8.5" fontFamily="JetBrains Mono">
                    {f.hint}
                  </text>
                </g>
              ))}

              {/* Product Nodes */}
              {[
                { y: 54, label: 'WICKER BASKETS' },
                { y: 122, label: 'ROSE CANDLES' },
                { y: 190, label: 'CAKESTAND' },
                { y: 258, label: 'PARTY BUNTING' },
              ].map((p) => (
                <g key={p.label}>
                  <rect x="412" y={p.y} width="124" height="40" rx="3" fill="#08090D" stroke="#A78BFA" strokeOpacity="0.8" />
                  <text x="474" y={p.y + 24} textAnchor="middle" fill="#F5F5F7" fontSize="9.5" fontFamily="JetBrains Mono">
                    {p.label}
                  </text>
                </g>
              ))}

              <text x="280" y="330" textAnchor="middle" fill="#858A98" fontSize="9.5" fontFamily="JetBrains Mono">
                SHARED LATENT GEOMETRY PREDICTS UNSEEN PAIRS EVEN WITH ZERO DIRECT OVERLAP
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
