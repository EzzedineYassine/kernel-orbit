import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ChapterHeaderProps {
  eyebrow: string
  title: ReactNode
  subtitle?: string
  align?: 'left' | 'center'
  compact?: boolean
  className?: string
}

/**
 * Editorial slide header: tracked mono eyebrow, hairline accent rule,
 * Space Grotesk display title, and concise Inter subtitle.
 */
export function ChapterHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  compact = false,
  className = '',
}: ChapterHeaderProps) {
  const reduced = useReducedMotion()
  const centered = align === 'center'

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'} ${className}`}
    >
      <div className={`flex items-center gap-2.5 ${centered ? 'justify-center' : ''}`}>
        <span className="h-px w-7 bg-[#A78BFA]" aria-hidden />
        <span className="font-mono text-[clamp(10px,0.82cqw,11.5px)] tracking-[0.22em] text-[#858A98] uppercase">
          {eyebrow}
        </span>
        {centered && <span className="h-px w-7 bg-[#22D3EE]" aria-hidden />}
      </div>

      <h1
        className={`mt-[1.1cqh] font-display font-semibold tracking-[-0.025em] text-[#F5F5F7] ${
          compact
            ? 'text-[clamp(22px,2.45cqw,36px)] leading-[1.1]'
            : 'text-[clamp(26px,2.95cqw,44px)] leading-[1.08]'
        }`}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={`mt-[1cqh] font-sans text-[clamp(12px,1.1cqw,15.5px)] leading-[1.45] text-[#858A98] ${
            centered ? 'max-w-[54cqw]' : 'max-w-[42cqw]'
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.header>
  )
}
