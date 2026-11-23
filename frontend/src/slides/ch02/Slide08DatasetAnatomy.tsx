import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

const SAMPLE_TRANSACTIONS = [
  { cust: 'CUST-17850', code: '85123A', desc: 'WHITE HANGING HEART T-LIGHT HOLDER', qty: '6', date: '2010-12-01' },
  { cust: 'CUST-13047', code: '84879', desc: 'ASSORTED COLOUR BIRD ORNAMENT', qty: '32', date: '2010-12-01' },
  { cust: 'CUST-14911', code: '22423', desc: 'REGENCY CAKESTAND 3 TIER', qty: '12', date: '2011-03-14' },
  { cust: 'CUST-14911', code: '47566', desc: 'PARTY BUNTING', qty: '8', date: '2011-05-09' },
  { cust: 'CUST-12748', code: '22720', desc: 'SET OF 3 CAKE TINS PANTRY DESIGN', qty: '4', date: '2011-08-22' },
  { cust: 'CUST-14646', code: '23084', desc: 'RABBIT NIGHT LIGHT', qty: '24', date: '2011-10-19' },
] as const

/** Slide 08 — Dataset, Customers, Products & Interactions (UCI Online Retail) */
export function Slide08DatasetAnatomy() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 02 · ANATOMY OF RETAIL DATA"
              title={
                <>
                  Customers, Products &amp; <span className="text-[#22D3EE]">Interactions</span>
                </>
              }
              subtitle="ORBIT trains on the official UCI Online Retail dataset — 541,909 real gift store transactions from a UK retailer."
              compact
            />

            <div className="flex flex-col gap-2">
              {[
                { term: 'CustomerID', color: '#22D3EE', desc: 'Privacy-safe identifier representing one shopper row in matrix R.' },
                { term: 'StockCode', color: '#A78BFA', desc: 'Normalized product identifier representing one item column in R.' },
                { term: 'Invoice & Qty', color: '#F5F5F7', desc: 'Implicit purchase events aggregated into repeat interaction strength.' },
                { term: 'InvoiceDate', color: '#858A98', desc: 'Timestamp enabling strict chronological train/test evaluation.' },
              ].map((item) => (
                <div
                  key={item.term}
                  className="flex items-baseline gap-3 rounded-sm border border-[#252834] bg-[#11131A]/85 px-3.5 py-2"
                >
                  <span
                    className="w-[7.8cqw] shrink-0 font-mono text-[clamp(9.5px,0.8cqw,11px)] font-medium"
                    style={{ color: item.color }}
                  >
                    {item.term}
                  </span>
                  <span className="font-sans text-[clamp(11px,0.92cqw,13px)] text-[#858A98]">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 02.C"
            title="UCI ONLINE RETAIL LOG (ID: 352)"
            meta="541,909 RAW ROWS"
            caption="Real retail logs have no star ratings — every invoice line is an implicit signal of customer interest."
            className="h-full"
            bodyClassName="flex-col items-stretch justify-center"
          >
            <div className="flex w-full flex-col gap-2.5 px-1">
              <div className="grid grid-cols-12 gap-1 font-mono text-[clamp(8.5px,0.72cqw,10px)] tracking-[0.12em] uppercase">
                <div className="col-span-3 border-b border-[#22D3EE]/70 pb-1 text-center text-[#22D3EE]">USER u</div>
                <div className="col-span-6 border-b border-[#A78BFA]/70 pb-1 text-center text-[#A78BFA]">PRODUCT i</div>
                <div className="col-span-3 border-b border-[#252834] pb-1 text-center text-[#858A98]">SIGNAL</div>
              </div>

              <div className="overflow-hidden rounded-sm border border-[#252834] bg-[#08090D]">
                <div className="grid grid-cols-12 border-b border-[#252834] bg-[#11131A] px-2.5 py-2 font-mono text-[clamp(9px,0.74cqw,10.5px)] text-[#858A98]">
                  <div className="col-span-3 text-[#22D3EE]">Customer</div>
                  <div className="col-span-2 text-[#A78BFA]">Code</div>
                  <div className="col-span-4 text-[#A78BFA]">Description</div>
                  <div className="col-span-1 text-right">Qty</div>
                  <div className="col-span-2 text-right">Date</div>
                </div>

                {SAMPLE_TRANSACTIONS.map((row, idx) => (
                  <motion.div
                    key={`${row.cust}-${row.code}`}
                    initial={reduced ? false : { opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                    className={`grid grid-cols-12 items-center border-b border-[#252834]/50 px-2.5 py-2 font-mono text-[clamp(9.5px,0.78cqw,11px)] last:border-b-0 ${
                      idx === 2 ? 'bg-[#A78BFA]/8' : ''
                    }`}
                  >
                    <div className="col-span-3 truncate text-[#22D3EE]">{row.cust}</div>
                    <div className="col-span-2 text-[#F5F5F7]">{row.code}</div>
                    <div className="col-span-4 truncate pr-2 font-sans text-[clamp(9.5px,0.78cqw,11px)] text-[#F5F5F7]">
                      {row.desc}
                    </div>
                    <div className="col-span-1 text-right text-[#858A98] tabular-nums">{row.qty}</div>
                    <div className="col-span-2 text-right text-[#858A98] tabular-nums">{row.date}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between font-mono text-[clamp(9px,0.74cqw,10.5px)] text-[#858A98]">
                <span>
                  <span className="text-[#A78BFA]">REAL GIFT CATALOG</span> · UK Online Retailer (Dec 2010 – Dec 2011)
                </span>
                <span>archive.ics.uci.edu/dataset/352</span>
              </div>
            </div>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
