import type { ReactNode } from 'react'

interface DiagramFrameProps {
  figure: string
  title?: string
  caption?: string
  meta?: string
  children: ReactNode
  className?: string
  bodyClassName?: string
}

/**
 * Scientific figure container: #11131A surface, #252834 hairline border,
 * corner registration ticks, monospace figure tag, and flex-safe interior.
 */
export function DiagramFrame({
  figure,
  title,
  caption,
  meta,
  children,
  className = '',
  bodyClassName = '',
}: DiagramFrameProps) {
  return (
    <figure
      className={`relative flex min-h-0 flex-col rounded-sm border border-[#252834] bg-[#11131A]/85 p-[clamp(12px,1.35cqw,20px)] ${className}`}
    >
      {/* Corner registration ticks */}
      <span className="pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-t border-l border-[#A78BFA]/70" aria-hidden />
      <span className="pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-t border-r border-[#22D3EE]/70" aria-hidden />
      <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-[#252834]" aria-hidden />
      <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-[#252834]" aria-hidden />

      <div className="mb-2 flex shrink-0 items-center justify-between gap-3 border-b border-[#252834]/70 pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 whitespace-nowrap font-mono text-[clamp(9.5px,0.78cqw,11px)] font-medium tracking-[0.16em] text-[#22D3EE] uppercase">
            {figure}
          </span>
          {title && (
            <span className="truncate font-mono text-[clamp(9px,0.74cqw,10.5px)] tracking-[0.08em] text-[#858A98] uppercase">
              / {title}
            </span>
          )}
        </div>
        {meta && (
          <span className="shrink-0 whitespace-nowrap font-mono text-[clamp(8.5px,0.7cqw,10px)] tracking-[0.12em] text-[#858A98] uppercase">
            {meta}
          </span>
        )}
      </div>

      <div className={`relative flex min-h-0 flex-1 items-center justify-center overflow-hidden ${bodyClassName}`}>
        {children}
      </div>

      {caption && (
        <figcaption className="mt-2 shrink-0 border-t border-[#252834]/60 pt-2 font-mono text-[clamp(9.5px,0.78cqw,11px)] leading-snug text-[#858A98]">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
