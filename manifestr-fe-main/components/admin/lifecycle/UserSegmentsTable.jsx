import { ArrowUpRight, RotateCcw } from 'lucide-react'

const HEALTH_STYLES = {
  positive: 'border-[#18181b] text-[#09090b]',
  warn: 'border-[#f59e0b] text-[#b45309] bg-[#fffbeb]',
  negative: 'border-[#ef4444] text-[#b91c1c] bg-[#fef2f2]',
}

function HealthPill({ label, tone = 'positive' }) {
  const classes = HEALTH_STYLES[tone] || HEALTH_STYLES.positive
  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full border text-[12px] leading-[18px] font-medium ${classes}`}
    >
      {label}
    </span>
  )
}

function ActionButton({ action }) {
  if (!action) return null
  const isUpgrade = action.intent === 'upgrade'
  const Icon = isUpgrade ? ArrowUpRight : RotateCcw
  const base =
    'inline-flex items-center gap-2 h-9 px-3 rounded-[6px] text-[14px] leading-5 font-medium transition-colors'
  const classes = isUpgrade
    ? `${base} bg-[#18181b] text-white hover:opacity-90`
    : `${base} border border-[#e4e4e7] bg-white text-[#18181b] hover:bg-[#f4f4f5]`

  return (
    <button type="button" className={classes}>
      <Icon className="w-4 h-4" strokeWidth={1.75} />
      {action.label}
    </button>
  )
}

export default function UserSegmentsTable({ data }) {
  const title = data?.title || 'User Segments'
  const subtitle = data?.subtitle || ''
  const rows = data?.rows || []

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
        {subtitle && (
          <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
        )}
      </div>

      <div className="w-full">
        <div
          className="hidden md:grid items-center gap-x-4 pb-2 border-b border-[#e4e4e7]"
          style={{ gridTemplateColumns: '1.6fr 2fr 0.9fr 0.9fr 1.2fr' }}
        >
          <p className="text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wide">
            Segment
          </p>
          <p className="text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wide">
            Description
          </p>
          <p className="text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wide">
            Users
          </p>
          <p className="text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wide">
            Health
          </p>
          <p className="text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wide text-right">
            Action
          </p>
        </div>

        <div className="flex flex-col">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid items-center gap-x-4 gap-y-2 py-3 border-b border-[#e4e4e7] last:border-b-0 grid-cols-1 md:grid-cols-[1.6fr_2fr_0.9fr_0.9fr_1.2fr]"
            >
              <p className="text-[14px] leading-5 font-medium text-[#18181b] truncate">{row.name}</p>
              <p className="text-[14px] leading-5 font-normal text-[#52525b]">{row.description}</p>
              <p className="text-[14px] leading-5 font-medium text-[#18181b]">{row.users}</p>
              <div>
                <HealthPill label={row.health} tone={row.tone} />
              </div>
              <div className="flex md:justify-end">
                <ActionButton action={row.action} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
