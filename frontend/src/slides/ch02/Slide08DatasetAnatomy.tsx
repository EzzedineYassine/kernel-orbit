import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { IRIS_SPECIES } from '../../components/irisPalette'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

const SAMPLE_ROWS = [
  { id: '#000', pl: '1.4', pw: '0.2', species: IRIS_SPECIES[0] },
  { id: '#014', pl: '1.2', pw: '0.2', species: IRIS_SPECIES[0] },
  { id: '#052', pl: '4.9', pw: '1.5', species: IRIS_SPECIES[1] },
  { id: '#078', pl: '4.5', pw: '1.5', species: IRIS_SPECIES[1] },
  { id: '#109', pl: '6.1', pw: '2.5', species: IRIS_SPECIES[2] },
  { id: '#141', pl: '5.1', pw: '2.3', species: IRIS_SPECIES[2] },
] as const

/** Slide 08 — Dataset, Samples, Features, and Labels */
export function Slide08DatasetAnatomy() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 02 · ANATOMY OF DATA"
              title={
                <>
                  Dataset, Samples, <span className="text-[#22D3EE]">Features</span> &{' '}
                  <span className="text-[#A78BFA]">Labels</span>
                </>
              }
              subtitle="Every supervised dataset is a structured matrix pairing measurable inputs with known outcomes."
              compact
            />

            <div className="flex flex-col gap-2">
              {[
                { term: 'Dataset', color: '#F5F5F7', desc: 'Complete collection of 150 Iris flower observations.' },
                { term: 'Sample (Row)', color: '#858A98', desc: 'One individual observation — a single measured flower.' },
                { term: 'Features (X)', color: '#22D3EE', desc: 'Numerical inputs: petal length (cm) and petal width (cm).' },
                { term: 'Label (y)', color: '#A78BFA', desc: 'Ground-truth target class we want the model to predict.' },
              ].map((item) => (
                <div
                  key={item.term}
                  className="flex items-baseline gap-3 rounded-sm border border-[#252834] bg-[#11131A]/85 px-3.5 py-2"
                >
                  <span
                    className="w-[8.5cqw] shrink-0 font-mono text-[clamp(10px,0.82cqw,11.5px)] font-medium"
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
            title="IRIS PETAL MATRIX (X, y)"
            meta="N = 150 · D = 2 · C = 3"
            caption="Each row is a point in 2D feature space ℝ²; the rightmost column provides its supervised class label."
            className="h-full"
            bodyClassName="flex-col items-stretch justify-center"
          >
            <div className="flex w-full flex-col gap-2.5 px-1">
              {/* Top bracket annotations */}
              <div className="grid grid-cols-12 gap-2 font-mono text-[clamp(9px,0.74cqw,10.5px)] tracking-[0.14em] uppercase">
                <div className="col-span-2 text-center text-[#858A98]">INDEX</div>
                <div className="col-span-6 border-b border-[#22D3EE]/70 pb-1 text-center text-[#22D3EE]">
                  FEATURES MATRIX X (2 COLUMNS)
                </div>
                <div className="col-span-4 border-b border-[#A78BFA]/70 pb-1 text-center text-[#A78BFA]">
                  TARGET LABEL y
                </div>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-sm border border-[#252834] bg-[#08090D]">
                <div className="grid grid-cols-12 border-b border-[#252834] bg-[#11131A] px-3 py-2 font-mono text-[clamp(9.5px,0.78cqw,11px)] text-[#858A98]">
                  <div className="col-span-2">ID</div>
                  <div className="col-span-3 text-[#22D3EE]">petal_len</div>
                  <div className="col-span-3 text-[#22D3EE]">petal_wid</div>
                  <div className="col-span-4 text-[#A78BFA]">species (y)</div>
                </div>

                {SAMPLE_ROWS.map((row, idx) => (
                  <motion.div
                    key={row.id}
                    initial={reduced ? false : { opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                    className={`grid grid-cols-12 items-center border-b border-[#252834]/50 px-3 py-2 font-mono text-[clamp(10.5px,0.88cqw,12.5px)] last:border-b-0 ${
                      idx === 2 ? 'bg-[#A78BFA]/8' : ''
                    }`}
                  >
                    <div className="col-span-2 text-[#858A98]">{row.id}</div>
                    <div className="col-span-3 text-[#F5F5F7] tabular-nums">{row.pl} cm</div>
                    <div className="col-span-3 text-[#F5F5F7] tabular-nums">{row.pw} cm</div>
                    <div className="col-span-4 flex items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: row.species.color }}
                      />
                      <span className="truncate text-[#F5F5F7]">{row.species.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Row callout */}
              <div className="flex items-center justify-between font-mono text-[clamp(9.5px,0.76cqw,11px)] text-[#858A98]">
                <span>
                  <span className="text-[#A78BFA]">HIGHLIGHTED ROW</span> → Sample x = [4.9, 1.5], y = Iris versicolor
                </span>
                <span>… 144 more rows</span>
              </div>
            </div>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
