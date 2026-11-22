import type { ReactNode } from 'react'

interface SlideLayoutProps {
  /** Optional small mono label rendered above the content (e.g. chapter tag). */
  eyebrow?: string
  children: ReactNode
  /** Extra classes for the 12-column content grid. */
  className?: string
}

/**
 * Reusable slide wrapper. Fills the 16:9 canvas, reserves vertical clearance
 * for the HUD (top bar + bottom bar) and exposes a 12-column content grid.
 */
export function SlideLayout({ eyebrow, children, className = '' }: SlideLayoutProps) {
  return (
    <div
      className="absolute inset-0 flex flex-col px-[6cqw]"
      style={{
        paddingTop: 'var(--kernel-hud-top)',
        paddingBottom: 'var(--kernel-hud-bottom)',
      }}
    >
      {eyebrow && (
        <div className="mb-[1.6cqh] flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-kernel-muted uppercase">
          <span className="h-px w-6 bg-kernel-primary" aria-hidden />
          {eyebrow}
        </div>
      )}
      <div className={`relative grid min-h-0 flex-1 grid-cols-12 gap-[2cqw] ${className}`}>
        {children}
      </div>
    </div>
  )
}
