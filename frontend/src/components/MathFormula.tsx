import type { ReactNode } from 'react'

export interface FormulaAnnotation {
  symbol: string
  meaning: string
  accent?: 'primary' | 'secondary' | 'neutral'
}

interface MathFormulaProps {
  label?: string
  formula: ReactNode
  annotations?: readonly FormulaAnnotation[]
  compact?: boolean
  className?: string
}

const accentText: Record<NonNullable<FormulaAnnotation['accent']>, string> = {
  primary: 'text-[#A78BFA] border-[#A78BFA]/35 bg-[#A78BFA]/8',
  secondary: 'text-[#22D3EE] border-[#22D3EE]/35 bg-[#22D3EE]/8',
  neutral: 'text-[#F5F5F7] border-[#252834] bg-[#08090D]',
}

/**
 * Editorial scientific equation block with optional annotated variable callouts.
 */
export function MathFormula({
  label,
  formula,
  annotations,
  compact = false,
  className = '',
}: MathFormulaProps) {
  return (
    <div
      className={`relative rounded-sm border border-[#252834] bg-[#11131A]/90 ${
        compact ? 'px-4 py-3' : 'px-5 py-4'
      } ${className}`}
    >
      <span className="absolute top-0 left-0 h-full w-[2px] bg-[#A78BFA]" aria-hidden />

      {label && (
        <div className="mb-2 font-mono text-[clamp(9px,0.75cqw,10.5px)] tracking-[0.2em] text-[#858A98] uppercase">
          {label}
        </div>
      )}

      <div
        className={`flex items-center font-mono text-[#F5F5F7] ${
          compact ? 'text-[clamp(14px,1.35cqw,19px)]' : 'text-[clamp(17px,1.75cqw,26px)]'
        }`}
      >
        {formula}
      </div>

      {annotations && annotations.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-[#252834]/80 pt-2.5">
          {annotations.map((item) => (
            <div key={item.symbol} className="flex items-center gap-1.5 text-[clamp(10.5px,0.9cqw,12.5px)]">
              <span
                className={`rounded-sm border px-1.5 py-0.5 font-mono text-[clamp(10px,0.85cqw,12px)] ${
                  accentText[item.accent ?? 'neutral']
                }`}
              >
                {item.symbol}
              </span>
              <span className="text-[#858A98]">{item.meaning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
