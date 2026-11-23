import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { SlideLayout } from '../../presentation/SlideLayout'

const APPLICATIONS = [
  {
    code: '01',
    domain: 'E-Commerce & Cross-Selling',
    mechanism: 'PERSONALIZED DISCOVERY',
    desc: 'Ranking complementary gifts, “frequently paired with” bundles, and tailored homepage shelves from implicit checkout logs.',
    accent: '#22D3EE',
  },
  {
    code: '02',
    domain: 'Music & Audio Discovery',
    mechanism: 'IMPLICIT PLAY COUNTS',
    desc: 'Factorizing billions of listening sessions and skip signals into latent sonic neighborhoods for weekly personalized playlists.',
    accent: '#A78BFA',
  },
  {
    code: '03',
    domain: 'Video & Streaming Platforms',
    mechanism: 'WATCH-TIME EMBEDDINGS',
    desc: 'Combining collaborative latent factors with watch duration to surface niche documentaries and films across vast catalogs.',
    accent: '#22D3EE',
  },
  {
    code: '04',
    domain: 'Retail Personalization',
    mechanism: 'CRM & INVENTORY FIT',
    desc: 'Powering targeted lifecycle offers, seasonal gift curation, and long-tail catalog activation beyond head bestsellers.',
    accent: '#A78BFA',
  },
] as const

/** Slide 28 — Real-World Applications of Collaborative Filtering */
export function Slide28RealWorldApplications() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <div className="col-span-12 flex h-full min-h-0 flex-col gap-[2.2cqh]">
        <ChapterHeader
          eyebrow="CHAPTER 07 · BEYOND THE ALGORITHM"
          title={
            <>
              Where <span className="text-[#22D3EE]">Recommendation Models</span> live.
            </>
          }
          subtitle="Implicit matrix factorization and latent embedding retrieval sit at the core of modern digital discovery."
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
              <div className="flex h-[10cqh] w-[10cqh] shrink-0 items-center justify-center rounded-sm border border-[#252834] bg-[#08090D]">
                <svg viewBox="0 0 80 80" className="h-full w-full p-1.5" preserveAspectRatio="xMidYMid meet">
                  {idx === 0 && (
                    <g stroke="#22D3EE" fill="none" strokeWidth="1.5">
                      <rect x="16" y="24" width="48" height="38" rx="3" />
                      <path d="M 28 24 C 28 12, 52 12, 52 24" />
                      <circle cx="32" cy="43" r="3" fill="#22D3EE" stroke="none" />
                      <circle cx="48" cy="43" r="3" fill="#A78BFA" stroke="none" />
                    </g>
                  )}
                  {idx === 1 && (
                    <g stroke="#A78BFA" fill="none" strokeWidth="1.6">
                      <circle cx="40" cy="40" r="24" strokeOpacity="0.4" />
                      <circle cx="40" cy="40" r="14" />
                      <circle cx="40" cy="40" r="4" fill="#22D3EE" stroke="none" />
                      <line x1="40" y1="16" x2="40" y2="24" stroke="#22D3EE" />
                    </g>
                  )}
                  {idx === 2 && (
                    <g stroke="#22D3EE" fill="none" strokeWidth="1.5">
                      <rect x="14" y="20" width="52" height="40" rx="3" />
                      <polygon points="35,31 35,49 51,40" fill="#22D3EE" fillOpacity="0.3" />
                    </g>
                  )}
                  {idx === 3 && (
                    <g>
                      <circle cx="40" cy="40" r="5" fill="#A78BFA" />
                      {[[18, 22], [62, 20], [64, 58], [18, 58]].map(([x, y], i) => (
                        <g key={i}>
                          <line x1="40" y1="40" x2={x} y2={y} stroke="#A78BFA" strokeOpacity="0.55" strokeDasharray="2 2" />
                          <circle cx={x} cy={y} r="3.5" fill="#22D3EE" />
                        </g>
                      ))}
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
