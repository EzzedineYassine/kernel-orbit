import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { SlideLayout } from '../../presentation/SlideLayout'

const APPLICATIONS = [
  {
    code: '01',
    domain: 'Medical Diagnostics',
    mechanism: 'CLASSIFICATION · HIGH RECALL',
    desc: 'Flagging tumors in radiology scans and stratifying patient risk from clinical biomarkers where false negatives carry severe cost.',
    accent: '#22D3EE',
  },
  {
    code: '02',
    domain: 'Recommendation Systems',
    mechanism: 'NEAREST NEIGHBORS · EMBEDDINGS',
    desc: 'Retrieving relevant music, research papers, and products by finding nearest vectors in high-dimensional taste spaces.',
    accent: '#A78BFA',
  },
  {
    code: '03',
    domain: 'Fraud Detection',
    mechanism: 'ANOMALY SCORING · REAL-TIME',
    desc: 'Scoring payment streams in milliseconds to isolate unusual transaction geometry from legitimate customer history.',
    accent: '#22D3EE',
  },
  {
    code: '04',
    domain: 'Autonomous Perception',
    mechanism: 'SPATIAL DETECTION · FUSION',
    desc: 'Segmenting lanes, pedestrians, and obstacles continuously from LiDAR point clouds and camera frames.',
    accent: '#A78BFA',
  },
] as const

/** Slide 28 — Real-World Applications of Machine Learning */
export function Slide28RealWorldApplications() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2.2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 07 · BEYOND THE ALGORITHM"
          title={
            <>
              From Iris petals to <span className="text-[#22D3EE]">real-world systems.</span>
            </>
          }
          subtitle="The exact principles — feature representation, similarity, generalization, and rigorous evaluation — power modern ML in production."
          compact
        />

        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-[1.6cqw]">
          {APPLICATIONS.map((app, idx) => (
            <motion.article
              key={app.code}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
              className="relative flex min-h-0 items-center gap-4 rounded-sm border border-[#252834] bg-[#11131A]/90 p-[clamp(14px,1.5cqw,22px)]"
            >
              {/* Restrained geometric domain glyph */}
              <div className="flex h-[10cqh] w-[10cqh] shrink-0 items-center justify-center rounded-sm border border-[#252834] bg-[#08090D]">
                <svg viewBox="0 0 80 80" className="h-full w-full p-1.5" preserveAspectRatio="xMidYMid meet">
                  {idx === 0 && (
                    <g stroke="#22D3EE" fill="none" strokeWidth="1.6">
                      <polyline points="8,42 22,42 29,22 39,58 48,34 55,42 72,42" />
                      <circle cx="40" cy="40" r="30" stroke="#252834" strokeWidth="1" strokeDasharray="3 3" />
                    </g>
                  )}
                  {idx === 1 && (
                    <g>
                      <circle cx="40" cy="40" r="5" fill="#A78BFA" />
                      {[[18, 22], [62, 20], [64, 56], [20, 60]].map(([x, y], i) => (
                        <g key={i}>
                          <line x1="40" y1="40" x2={x} y2={y} stroke="#A78BFA" strokeOpacity="0.55" strokeDasharray="2 2" />
                          <circle cx={x} cy={y} r="3.5" fill="#22D3EE" />
                        </g>
                      ))}
                    </g>
                  )}
                  {idx === 2 && (
                    <g>
                      <circle cx="34" cy="44" r="18" fill="#22D3EE" fillOpacity="0.08" stroke="#252834" />
                      {[[28, 40], [36, 48], [32, 52], [42, 42]].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="2.8" fill="#858A98" />
                      ))}
                      <circle cx="62" cy="20" r="6" fill="none" stroke="#22D3EE" strokeWidth="1.5" />
                      <circle cx="62" cy="20" r="2.5" fill="#22D3EE" />
                    </g>
                  )}
                  {idx === 3 && (
                    <g stroke="#A78BFA" fill="none" strokeWidth="1.4">
                      <path d="M 14 62 L 32 20 M 66 62 L 48 20" stroke="#252834" />
                      <rect x="28" y="30" width="24" height="20" rx="2" stroke="#A78BFA" />
                      <line x1="40" y1="14" x2="40" y2="24" stroke="#22D3EE" />
                      <line x1="40" y1="56" x2="40" y2="66" stroke="#22D3EE" />
                    </g>
                  )}
                </svg>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[clamp(9px,0.75cqw,10.5px)] tracking-[0.18em] text-[#858A98]">
                    DOMAIN {app.code}
                  </span>
                  <span
                    className="font-mono text-[clamp(9px,0.74cqw,10.5px)] tracking-[0.12em]"
                    style={{ color: app.accent }}
                  >
                    {app.mechanism}
                  </span>
                </div>
                <h2 className="mt-1 font-display text-[clamp(16px,1.4cqw,20px)] font-semibold text-[#F5F5F7]">
                  {app.domain}
                </h2>
                <p className="mt-1 font-sans text-[clamp(11px,0.92cqw,13px)] leading-relaxed text-[#858A98]">
                  {app.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
