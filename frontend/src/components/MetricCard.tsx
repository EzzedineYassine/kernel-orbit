interface MetricCardProps {
  label: string
  /** Pass null for Phase 7 live-metric slots (renders an explicit empty slot, never fake data). */
  value: string | null
  note?: string
  accent?: 'primary' | 'secondary' | 'neutral'
  slotLabel?: string
  compact?: boolean
  className?: string
}

const accentBorder: Record<NonNullable<MetricCardProps['accent']>, string> = {
  primary: 'bg-[#A78BFA]',
  secondary: 'bg-[#22D3EE]',
  neutral: 'bg-[#252834]',
}

const accentValue: Record<NonNullable<MetricCardProps['accent']>, string> = {
  primary: 'text-[#A78BFA]',
  secondary: 'text-[#22D3EE]',
  neutral: 'text-[#F5F5F7]',
}

/**
 * Restrained scientific metric readout card.
 * When `value` is null, clearly displays a Phase 7 live-connection slot.
 */
export function MetricCard({
  label,
  value,
  note,
  accent = 'neutral',
  slotLabel = 'Live metrics connect in Phase 7',
  compact = false,
  className = '',
}: MetricCardProps) {
  const isSlot = value === null

  return (
    <div
      className={`relative flex flex-col justify-between rounded-sm border border-[#252834] bg-[#11131A]/90 ${
        compact ? 'px-3.5 py-2.5' : 'px-4 py-3.5'
      } ${className}`}
    >
      <span className={`absolute top-0 left-0 right-0 h-[2px] ${accentBorder[accent]}`} aria-hidden />

      <span className="font-mono text-[clamp(9.5px,0.78cqw,11px)] tracking-[0.16em] text-[#858A98] uppercase">
        {label}
      </span>

      <div
        className={`mt-1.5 font-mono leading-none font-medium tabular-nums ${
          compact ? 'text-[clamp(18px,1.75cqw,26px)]' : 'text-[clamp(22px,2.2cqw,32px)]'
        } ${isSlot ? 'text-[#858A98]/60' : accentValue[accent]}`}
      >
        {isSlot ? '— —' : value}
      </div>

      {isSlot ? (
        <span className="mt-1.5 whitespace-nowrap font-mono text-[clamp(8px,0.68cqw,10px)] tracking-[0.04em] text-[#22D3EE]/80">
          {slotLabel}
        </span>
      ) : (
        note && (
          <span className="mt-1.5 font-sans text-[clamp(10.5px,0.85cqw,12px)] leading-snug text-[#858A98]">
            {note}
          </span>
        )
      )}
    </div>
  )
}
