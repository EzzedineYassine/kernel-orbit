import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { MathFormula } from '../../components/MathFormula'
import { SplitLayout } from '../../components/SplitLayout'
import { useOrbitData } from '../../hooks/useOrbitData'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 12 — Transaction Cleaning & Implicit Confidence Scaling */
export function Slide12PreprocessingScaling() {
  const reduced = useReducedMotion()
  const { summary } = useOrbitData()

  const rawRows = summary ? summary.raw_rows.toLocaleString() : '541,909'
  const cancelled = summary ? summary.cancelled_invoices_removed.toLocaleString() : '9,288'
  const missingCust = summary ? summary.missing_customer_id_removed.toLocaleString() : '135,080'
  const cleanRows = summary ? summary.clean_transaction_rows.toLocaleString() : '396,337'
  const qtyMax = summary ? summary.quantity_max.toLocaleString() : '80,995'

  const filters = [
    { label: 'Raw UCI Invoice Lines', count: rawRows, pct: 100, color: '#858A98' },
    { label: 'Remove Missing CustomerID', count: `−${missingCust}`, pct: 75, color: '#A78BFA' },
    { label: 'Remove Cancelled & Returns', count: `−${cancelled}`, pct: 73, color: '#A78BFA' },
    { label: 'Clean Merchandise Rows', count: cleanRows, pct: 73, color: '#22D3EE' },
  ] as const

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 03 · DATA PREPROCESSING"
              title={
                <>
                  Clean logs &amp; dampen <span className="text-[#22D3EE]">wholesale outliers.</span>
                </>
              }
              subtitle="Raw transaction logs contain cancelled invoices, missing IDs, postage fees, and massive wholesale orders."
              compact
            />

            <MathFormula
              label="Implicit Interaction Confidence"
              compact
              formula={
                <div className="flex flex-col gap-1 text-[0.8em]">
                  <div>
                    <span className="text-[#22D3EE]">r</span>
                    <sub className="text-[0.65em] text-[#858A98]">ui</sub>
                    <span className="text-[#858A98]"> = </span>
                    ln(1 + purchases<sub className="text-[0.65em] text-[#858A98]">ui</sub>)
                  </div>
                  <div>
                    <span className="text-[#A78BFA]">C</span>
                    <sub className="text-[0.65em] text-[#858A98]">ui</sub>
                    <span className="text-[#858A98]"> = 1 + </span>
                    <span className="text-[#A78BFA]">α</span> ·{' '}
                    <span className="text-[#22D3EE]">r</span>
                    <sub className="text-[0.65em] text-[#858A98]">ui</sub>
                  </div>
                </div>
              }
              annotations={[
                { symbol: 'max qty = ' + qtyMax, meaning: 'Wholesale spike damped by invoice log', accent: 'primary' },
                { symbol: 'k ≥ 5', meaning: 'Min user & product support on train split', accent: 'secondary' },
              ]}
            />
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 03.B"
            title="TRANSACTION CLEANING FUNNEL"
            meta="UCI RETAIL AUDIT"
            caption="Using log(1 + distinct purchase invoices) prevents a single 80,995-unit wholesale order from hijacking latent factors."
            className="h-full"
            bodyClassName="flex-col items-stretch justify-center gap-3.5 px-2"
          >
            {filters.map((step, idx) => (
              <div key={step.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-mono text-[clamp(9.5px,0.8cqw,11.5px)]">
                  <span className="text-[#F5F5F7]">{step.label}</span>
                  <span style={{ color: step.color }} className="tabular-nums">
                    {step.count}
                  </span>
                </div>
                <div className="h-6 w-full overflow-hidden rounded-sm border border-[#252834] bg-[#08090D]">
                  <motion.div
                    initial={reduced ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.45, delay: 0.1 + idx * 0.08 }}
                    style={{
                      width: `${step.pct}%`,
                      backgroundColor: `${step.color}28`,
                      borderRight: `2px solid ${step.color}`,
                      transformOrigin: 'left center',
                    }}
                    className="h-full"
                  />
                </div>
              </div>
            ))}

            <div className="mt-1 rounded-sm border border-[#252834] bg-[#08090D] px-3.5 py-2 font-mono text-[clamp(9px,0.75cqw,10.5px)] text-[#858A98]">
              <span className="text-[#22D3EE]">OPERATIONAL CODES EXCLUDED:</span> POST · DOT · M · BANK CHARGES · AMAZONFEE · C2 · CRUK
            </div>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
