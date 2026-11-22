import { motion, useReducedMotion } from 'framer-motion'
import { ChapterHeader } from '../../components/ChapterHeader'
import { DiagramFrame } from '../../components/DiagramFrame'
import { SplitLayout } from '../../components/SplitLayout'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 16 — What Is K-Nearest Neighbors? */
export function Slide16MeetKNN() {
  const reduced = useReducedMotion()

  return (
    <SlideLayout>
      <SplitLayout
        ratio="5/7"
        left={
          <div className="flex flex-col gap-[2.4cqh]">
            <ChapterHeader
              eyebrow="CHAPTER 04 · MEET KNN"
              title={
                <>
                  K-Nearest <span className="text-[#A78BFA]">Neighbors</span>
                </>
              }
              subtitle="A non-parametric, distance-based classifier that classifies any new point by consulting its closest historical neighbors in feature space."
            />

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { key: 'NON-PARAMETRIC', desc: 'Makes no assumption that data follows a straight line or Gaussian bell curve.' },
                { key: 'DISTANCE-DRIVEN', desc: 'Uses geometric proximity in standardized space as the measure of similarity.' },
                { key: 'TRANSPARENT', desc: 'Every prediction can be audited directly by inspecting the exact K neighbors.' },
              ].map((item, idx) => (
                <motion.div
                  key={item.key}
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.14 + idx * 0.08 }}
                  className="rounded-sm border border-[#252834] bg-[#11131A]/85 px-4 py-2.5"
                >
                  <div className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.18em] text-[#22D3EE]">
                    {item.key}
                  </div>
                  <p className="mt-1 font-sans text-[clamp(11.5px,0.96cqw,13.5px)] text-[#858A98]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        }
        right={
          <DiagramFrame
            figure="FIG 04.A"
            title="FEATURE SPACE NEIGHBORHOOD"
            meta="NON-PARAMETRIC GEOMETRY"
            caption="Every point occupies coordinates in feature space; locality alone defines class membership."
            className="h-full"
          >
            <svg viewBox="0 0 560 360" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              {/* Subtle coordinate grid */}
              {[90, 180, 270, 360, 450].map((x) => (
                <line key={`gx-${x}`} x1={x} y1="24" x2={x} y2="320" stroke="#252834" strokeOpacity="0.4" />
              ))}
              {[80, 160, 240].map((y) => (
                <line key={`gy-${y}`} x1="36" y1={y} x2="528" y2={y} stroke="#252834" strokeOpacity="0.4" />
              ))}

              {/* Concentric search radius around query */}
              <motion.circle
                cx="296"
                cy="182"
                r="108"
                fill="#A78BFA"
                fillOpacity="0.06"
                stroke="#A78BFA"
                strokeOpacity="0.35"
                strokeDasharray="4 4"
                initial={reduced ? false : { scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              />
              <motion.circle
                cx="296"
                cy="182"
                r="66"
                fill="#22D3EE"
                fillOpacity="0.08"
                stroke="#22D3EE"
                strokeWidth="1.5"
                initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />

              {/* Setosa cluster */}
              {[[88, 272], [116, 254], [132, 286], [102, 232], [150, 260]].map(([cx, cy], i) => (
                <circle key={`s-${i}`} cx={cx} cy={cy} r="5.5" fill="#22D3EE" fillOpacity="0.85" />
              ))}
              {/* Versicolor cluster */}
              {[[252, 166], [280, 146], [318, 152], [274, 214], [326, 206], [234, 202]].map(([cx, cy], i) => (
                <circle key={`v-${i}`} cx={cx} cy={cy} r="5.5" fill="#A78BFA" />
              ))}
              {/* Virginica cluster */}
              {[[418, 92], [446, 118], [468, 86], [428, 134], [484, 112], [386, 112]].map(([cx, cy], i) => (
                <circle key={`g-${i}`} cx={cx} cy={cy} r="5.5" fill="#34D399" fillOpacity="0.85" />
              ))}

              {/* Distance rays to 5 nearest */}
              {[
                [252, 166],
                [280, 146],
                [318, 152],
                [274, 214],
                [326, 206],
              ].map(([nx, ny], i) => (
                <motion.line
                  key={`ray-${i}`}
                  x1="296"
                  y1="182"
                  x2={nx}
                  y2={ny}
                  stroke="#F5F5F7"
                  strokeOpacity="0.65"
                  strokeWidth="1.25"
                  strokeDasharray="3 3"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.35 + i * 0.05 }}
                />
              ))}

              {/* Query star/ring */}
              <circle cx="296" cy="182" r="9" fill="#08090D" stroke="#F5F5F7" strokeWidth="2" />
              <circle cx="296" cy="182" r="3" fill="#22D3EE" />
              <text x="296" y="344" textAnchor="middle" fill="#858A98" fontSize="10" fontFamily="JetBrains Mono">
                STANDARDIZED PETAL LENGTH (z₁) →
              </text>
            </svg>
          </DiagramFrame>
        }
      />
    </SlideLayout>
  )
}
