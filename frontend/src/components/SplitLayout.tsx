import type { ReactNode } from 'react'

type SplitRatio = '5/7' | '6/6' | '7/5' | '4/8'

interface SplitLayoutProps {
  ratio?: SplitRatio
  left: ReactNode
  right: ReactNode
  align?: 'center' | 'stretch'
  className?: string
}

const ratioClasses: Record<SplitRatio, [string, string]> = {
  '5/7': ['col-span-5', 'col-span-7'],
  '6/6': ['col-span-6', 'col-span-6'],
  '7/5': ['col-span-7', 'col-span-5'],
  '4/8': ['col-span-4', 'col-span-8'],
}

/**
 * Asymmetric 12-column editorial layout for SlideLayout's content area.
 * Guarantees min-h-0 containment and zero vertical overflow in 16:9 HUD-safe bounds.
 */
export function SplitLayout({
  ratio = '5/7',
  left,
  right,
  align = 'stretch',
  className = '',
}: SplitLayoutProps) {
  const [leftCol, rightCol] = ratioClasses[ratio]
  const alignCls = align === 'center' ? 'items-center' : 'items-stretch'

  return (
    <div className={`col-span-12 grid h-full min-h-0 grid-cols-12 gap-[2.4cqw] ${alignCls} ${className}`}>
      <div className={`${leftCol} flex min-h-0 flex-col justify-center`}>{left}</div>
      <div className={`${rightCol} flex min-h-0 flex-col justify-center`}>{right}</div>
    </div>
  )
}
