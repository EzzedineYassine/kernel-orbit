import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

const FACTOR_DEMO = [
  { dim: 'f₁', u: 0.82, v: 0.78 },
  { dim: 'f₂', u: -0.45, v: -0.52 },
  { dim: 'f₃', u: 0.64, v: 0.58 },
  { dim: 'f₄', u: 0.18, v: -0.12 },
  { dim: 'f₅', u: -0.71, v: -0.66 },
  { dim: 'f₆', u: 0.52, v: 0.49 },
] as const

/** Slide 19 — Discovering Latent Factors */
export function Slide19LatentFactors() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 04 · HIDDEN REPRESENTATIONS"
              title={
                <>
                  Discovering <span className="text-[#22D3EE]">Latent Factors</span>
                </>
              }
              subtitle="Latent factors are continuous mathematical coordinates learned automatically to compress purchasing structure across all products."
              compact
            />

            <div className="flex flex-col gap-2.5">
              <div className="rounded-sm border border-[#22D3EE]/45 bg-[#11131A]/85 px-4 py-2.5">
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#22D3EE]">
                  CUSTOMER EMBEDDING uᵤ ∈ ℝᵏ
                </div>
                <p className="mt-1 font-sans text-[clamp(11px,0.92cqw,13px)] text-[#858A98]">
                  Summarizes a customer’s affinity profile across every hidden purchasing pattern in the gift catalog.
                </p>
              </div>
              <div className="rounded-sm border border-[#A78BFA]/45 bg-[#11131A]/85 px-4 py-2.5">
                <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#A78BFA]">
                  PRODUCT EMBEDDING vᵢ ∈ ℝᵏ
                </div>
                <p className="mt-1 font-sans text-[clamp(11px,0.92cqw,13px)] text-[#858A98]">
                  Places products that co-occur across similar taste clusters close together in the same k-dimensional vector space.
                </p>
              </div>
              <div className="rounded-sm border border-[#252834] bg-[#08090D] px-4 py-2 font-mono text-[clamp(9px,0.74cqw,10.5px)] text-[#858A98]">
                <span className="text-[#F5F5F7]">HONEST INTERPRETATION:</span> Latent axes are mathematical directions learned by ALS — they do not have fixed human labels.
              </div>
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 04.D"
            title="VECTOR ALIGNMENT IN LATENT SPACE"
            meta="SIGNED FACTOR PROFILE"
            caption="When a customer vector uᵤ and an unseen product vector vᵢ point in matching directions across factors, their dot product is large."
            className="h-full"
            bodyClassName="flex-col items-stretch justify-center gap-2.5 px-3"
          >
            <div className="flex items-center justify-between font-mono text-[clamp(9px,0.75cqw,10.5px)] text-[#858A98]">
              <span className="flex items-center gap-2 text-[#22D3EE]">
                <span className="h-2 w-4 rounded-xs bg-[#22D3EE]" /> Customer uᵤ
              </span>
              <span>CENTER = 0.0</span>
              <span className="flex items-center gap-2 text-[#A78BFA]">
                <span className="h-2 w-4 rounded-xs bg-[#A78BFA]" /> Product vᵢ
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {FACTOR_DEMO.map((row, idx) => (
                <div key={row.dim} className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-2 font-mono text-[clamp(9.5px,0.8cqw,11px)] text-[#858A98]">
                    {row.dim}
                  </div>
                  <div className="col-span-8 flex flex-col gap-1">
                    {/* User bar */}
                    <div className="relative h-2.5 w-full rounded-xs bg-[#08090D]">
                      <span className="absolute top-0 bottom-0 left-1/2 w-px bg-[#252834]" />
                      <motion.div
                        initial={reduced ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.45, delay: 0.08 + idx * 0.06 }}
                        style={{
                          left: row.u >= 0 ? '50%' : `${50 + row.u * 48}%`,
                          width: `${Math.abs(row.u) * 48}%`,
                          transformOrigin: row.u >= 0 ? 'left center' : 'right center',
                        }}
                        className="absolute top-0 bottom-0 rounded-xs bg-[#22D3EE]/80"
                      />
                    </div>
                    {/* Item bar */}
                    <div className="relative h-2.5 w-full rounded-xs bg-[#08090D]">
                      <span className="absolute top-0 bottom-0 left-1/2 w-px bg-[#252834]" />
                      <motion.div
                        initial={reduced ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.45, delay: 0.14 + idx * 0.06 }}
                        style={{
                          left: row.v >= 0 ? '50%' : `${50 + row.v * 48}%`,
                          width: `${Math.abs(row.v) * 48}%`,
                          transformOrigin: row.v >= 0 ? 'left center' : 'right center',
                        }}
                        className="absolute top-0 bottom-0 rounded-xs bg-[#A78BFA]/85"
                      />
                    </div>
                  </div>
                  <div className="col-span-2 text-right font-mono text-[clamp(9px,0.75cqw,10.5px)] text-[#F5F5F7] tabular-nums">
                    {(row.u * row.v) >= 0 ? '+' : ''}
                    {(row.u * row.v).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
