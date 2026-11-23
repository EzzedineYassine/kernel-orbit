import { motion, useReducedMotion } from 'framer-motion'
import { SlideLayout } from '../../presentation/SlideLayout'

/** Slide 30 — Final Cinematic Conclusion (KERNEL / ORBIT) */
export function Slide30Conclusion() {
  const reduced = useReducedMotion()

  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        viewBox="0 0 1280 720"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <motion.circle
          cx="640"
          cy="360"
          r="230"
          fill="none"
          stroke="#252834"
          strokeWidth="1"
          initial={reduced ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 0.65, scale: 1 }}
          transition={{ duration: 0.9 }}
        />
        <motion.circle
          cx="640"
          cy="360"
          r="330"
          fill="none"
          stroke="#A78BFA"
          strokeOpacity="0.2"
          strokeWidth="1"
          strokeDasharray="4 10"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.15 }}
        />
        <line x1="180" y1="360" x2="360" y2="360" stroke="#252834" strokeWidth="1" />
        <line x1="920" y1="360" x2="1100" y2="360" stroke="#252834" strokeWidth="1" />
        <circle cx="360" cy="360" r="3" fill="#A78BFA" />
        <circle cx="920" cy="360" r="3" fill="#22D3EE" />
      </svg>

      <SlideLayout>
        <div className="col-span-12 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-[3cqh] flex items-center gap-3 font-mono text-[clamp(10px,0.82cqw,11.5px)] tracking-[0.28em] text-[#858A98] uppercase"
          >
            <span className="h-px w-8 bg-[#A78BFA]" />
            <span>CHAPTER 07 · CONCLUSION</span>
            <span className="h-px w-8 bg-[#22D3EE]" />
          </motion.div>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[76cqw] font-display text-[clamp(30px,4.2cqw,64px)] leading-[1.06] font-bold tracking-[-0.03em] text-[#F5F5F7]"
          >
            THE MODEL DOESN&apos;T{' '}
            <span className="text-[#A78BFA]">THINK LIKE US.</span>
          </motion.h1>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-[3.4cqh] flex flex-col gap-1.5 font-sans text-[clamp(15px,1.5cqw,22px)] text-[#858A98]"
          >
            <p>It learns latent patterns from collective behavior.</p>
            <p className="text-[#F5F5F7]">We decide how to recommend responsibly.</p>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.52 }}
            className="mt-[6cqh] flex items-center gap-3 font-mono text-[clamp(10px,0.84cqw,12px)] tracking-[0.28em] text-[#22D3EE]"
          >
            <span className="h-1.5 w-1.5 rotate-45 bg-[#22D3EE]" />
            <span>KERNEL / ORBIT · END OF EXPERIENCE.</span>
            <span className="h-1.5 w-1.5 rotate-45 bg-[#A78BFA]" />
          </motion.div>
        </div>
      </SlideLayout>
    </div>
  )
}
