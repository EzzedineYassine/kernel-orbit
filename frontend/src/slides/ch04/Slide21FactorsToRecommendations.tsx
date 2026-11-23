import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MathFormula } from '../../components/MathFormula'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 21 — From Learned Factors to Recommendations */
export function Slide21FactorsToRecommendations() {
  const reduced = useReducedMotion()

  const candidates = [
    { rank: '#1', code: '22782', name: 'SET 3 WICKER STORAGE BASKETS', state: 'UNSEEN · TOP MATCH', width: 92, accent: '#22D3EE' },
    { rank: '#2', code: '21620', name: 'SET OF 4 ROSE BOTANICAL CANDLES', state: 'UNSEEN · RANK #2', width: 81, accent: '#22D3EE' },
    { rank: '—', code: '22423', name: 'REGENCY CAKESTAND 3 TIER', state: 'ALREADY BOUGHT · MASKED', width: 88, accent: '#858A98' },
    { rank: '#3', code: '21619', name: '4 VANILLA BOTANICAL CANDLES', state: 'UNSEEN · RANK #3', width: 78, accent: '#A78BFA' },
  ] as const

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 04 · INFERENCE & RANKING"
              title={
                <>
                  From Factors to{' '}
                  <span className="text-[#22D3EE]">Recommendations</span>
                </>
              }
              subtitle="Once U and V are fitted, generating personalized product lists requires just three fast steps."
              compact
            />

            <MathFormula
              label="Affinity Score Computation"
              compact
              formula={
                <span className="flex items-center gap-2 text-[0.86em]">
                  <span className="text-[#22D3EE]">r̂</span>
                  <sub className="text-[0.65em] text-[#858A98]">ui</sub>
                  <span className="text-[#858A98]">=</span>
                  <span className="inline-flex flex-col items-center leading-none">
                    <span className="text-[0.48em] text-[#858A98]">k</span>
                    <span className="text-[1.05em] text-[#A78BFA]">∑</span>
                    <span className="text-[0.48em] text-[#858A98]">f=1</span>
                  </span>
                  <span>
                    u<sub className="text-[0.62em] text-[#22D3EE]">uf</sub> · v
                    <sub className="text-[0.62em] text-[#A78BFA]">if</sub>
                  </span>
                </span>
              }
              annotations={[
                { symbol: '1. Score', meaning: 'Dot product across all 3,049 SKUs', accent: 'secondary' },
                { symbol: '2. Mask', meaning: 'Filter out already-purchased items', accent: 'primary' },
                { symbol: '3. Rank', meaning: 'Return highest-scoring Top-N gifts', accent: 'neutral' },
              ]}
            />

            <div className="rounded-sm border border-[#22D3EE]/50 bg-[#22D3EE]/8 px-4 py-2.5 font-mono text-[clamp(9.5px,0.8cqw,11.5px)] text-[#22D3EE]">
              NEXT SLIDE → ENTER THE LIVE ORBIT RECOMMENDATION LABORATORY
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 04.E"
            title="SCORING, MASKING & TOP-N RANKING"
            meta="filter_already_liked = True"
            caption="Previously purchased items are filtered before ranking so every slot introduces a genuinely new product discovery."
            className="h-full"
            bodyClassName="flex-col items-stretch justify-center gap-3 px-2"
          >
            {candidates.map((item, idx) => {
              const masked = item.rank === '—'
              return (
                <motion.div
                  key={item.code}
                  initial={reduced ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
                  className={`rounded-sm border p-3 ${
                    masked
                      ? 'border-dashed border-[#252834] bg-[#08090D]/70 opacity-60'
                      : 'border-[#252834] bg-[#08090D]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-mono text-[clamp(9.5px,0.78cqw,11px)]">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="shrink-0 font-semibold"
                        style={{ color: item.accent }}
                      >
                        {item.rank}
                      </span>
                      <span className="shrink-0 text-[#858A98]">[{item.code}]</span>
                      <span className={`truncate font-sans text-[clamp(10.5px,0.88cqw,12.5px)] ${masked ? 'line-through text-[#858A98]' : 'text-[#F5F5F7]'}`}>
                        {item.name}
                      </span>
                    </div>
                    <span
                      className="shrink-0 text-[clamp(8.5px,0.7cqw,10px)]"
                      style={{ color: item.accent }}
                    >
                      {item.state}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-xs bg-[#11131A]">
                    <div
                      style={{
                        width: `${item.width}%`,
                        backgroundColor: masked ? '#252834' : item.accent,
                      }}
                      className="h-full"
                    />
                  </div>
                </motion.div>
              )
            })}
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
