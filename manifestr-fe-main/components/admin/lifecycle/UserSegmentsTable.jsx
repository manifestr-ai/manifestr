import { ArrowUpRight, Mail, PlayCircle, RotateCcw } from 'lucide-react'

// ─── Stage badge ──────────────────────────────────────────────────────────────
const STAGE_STYLES = {
  new:         { bg: '#f8fafc', border: '#cbd5e1', text: '#475569' },
  activated:   { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  engaged:     { bg: '#f0fdf4', border: '#86efac', text: '#166534' },
  power_user:  { bg: '#ecfdf5', border: '#6ee7b7', text: '#065f46' },
  at_risk:     { bg: '#fffbeb', border: '#fcd34d', text: '#92400e' },
  dormant:     { bg: '#fff7ed', border: '#fdba74', text: '#9a3412' },
  churned:     { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b' },
  reactivated: { bg: '#f5f3ff', border: '#c4b5fd', text: '#5b21b6' },
}

function StageBadge({ stage, label }) {
  const s = STAGE_STYLES[stage] || STAGE_STYLES.new
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] leading-4 font-semibold whitespace-nowrap"
      style={{ backgroundColor: s.bg, borderColor: s.border, color: s.text }}
    >
      {label}
    </span>
  )
}

// ─── Action buttons ───────────────────────────────────────────────────────────
const ACTION_CONFIG = {
  upgrade: {
    Icon: ArrowUpRight,
    classes: 'bg-[#18181b] text-white hover:opacity-90',
  },
  'retention-email': {
    Icon: Mail,
    classes: 'border border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8] hover:bg-[#dbeafe]',
  },
  onboarding: {
    Icon: PlayCircle,
    classes: 'border border-[#86efac] bg-[#f0fdf4] text-[#166534] hover:bg-[#dcfce7]',
  },
  'win-back': {
    Icon: RotateCcw,
    classes: 'border border-[#fcd34d] bg-[#fffbeb] text-[#92400e] hover:bg-[#fef3c7]',
  },
}

function ActionButton({ action }) {
  const cfg = ACTION_CONFIG[action?.intent] || ACTION_CONFIG.upgrade
  const { Icon } = cfg
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] text-[12px] leading-4 font-medium transition-colors whitespace-nowrap ${cfg.classes}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
      {action.label}
    </button>
  )
}

// ─── Table ────────────────────────────────────────────────────────────────────
const GRID = '2fr 0.7fr 0.7fr 0.9fr 0.8fr 1fr 1.8fr'

export default function UserSegmentsTable({ data }) {
  const title = data?.title || 'Lifecycle Segments'
  const subtitle = data?.subtitle || ''
  const rows = data?.rows || []

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 lg:p-[18px] lg:gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
        {subtitle && (
          <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
        )}
      </div>

      {/* Mobile / tablet: segment cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-lg border border-[#e4e4e7] bg-[#fafafa] p-4 flex flex-col gap-3 min-w-0"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-[14px] leading-5 font-semibold text-[#18181b]">{row.name}</p>
              {row.description && (
                <p className="text-[12px] leading-[18px] text-[#71717a]">{row.description}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
              <div>
                <p className="text-[11px] leading-[18px] font-semibold text-[#71717a] uppercase tracking-wider">
                  Users
                </p>
                <p className="text-[14px] leading-5 font-semibold text-[#18181b] mt-0.5">{row.users}</p>
              </div>
              <div>
                <p className="text-[11px] leading-[18px] font-semibold text-[#71717a] uppercase tracking-wider">
                  Avg outputs
                </p>
                <p className="text-[14px] leading-5 text-[#52525b] mt-0.5">{row.avgOutputs}</p>
              </div>
              <div>
                <p className="text-[11px] leading-[18px] font-semibold text-[#71717a] uppercase tracking-wider">
                  Revenue
                </p>
                <p className="text-[14px] leading-5 font-medium text-[#18181b] mt-0.5">{row.revenueValue}</p>
              </div>
              <div>
                <p className="text-[11px] leading-[18px] font-semibold text-[#71717a] uppercase tracking-wider">
                  Last active
                </p>
                <p className="text-[13px] leading-5 text-[#71717a] mt-0.5">{row.lastActivity}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-1 border-t border-[#e4e4e7]">
              <div>
                <p className="text-[11px] leading-[18px] font-semibold text-[#71717a] uppercase tracking-wider mb-1.5">
                  Stage
                </p>
                <StageBadge stage={row.stage} label={row.stageLabel} />
              </div>
              <div>
                <p className="text-[11px] leading-[18px] font-semibold text-[#71717a] uppercase tracking-wider mb-1.5">
                  Actions
                </p>
                <div className="flex flex-wrap gap-2">
                  {(row.actions || []).map((action) => (
                    <ActionButton key={action.intent} action={action} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: wide table */}
      <div className="hidden lg:block w-full overflow-x-auto">
        <div
          className="grid items-center gap-x-4 pb-2 border-b border-[#e4e4e7] min-w-[900px]"
          style={{ gridTemplateColumns: GRID }}
        >
          {['Segment', 'Users', 'Avg Outputs', 'Revenue', 'Last Active', 'Stage', 'Actions'].map((col) => (
            <p
              key={col}
              className="text-[11px] leading-[18px] font-semibold text-[#71717a] uppercase tracking-wider"
            >
              {col}
            </p>
          ))}
        </div>

        <div className="flex flex-col min-w-[900px]">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid items-center gap-x-4 gap-y-2 py-3.5 border-b border-[#e4e4e7] last:border-b-0"
              style={{ gridTemplateColumns: GRID }}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-[14px] leading-5 font-semibold text-[#18181b] truncate">
                  {row.name}
                </p>
                {row.description && (
                  <p className="text-[12px] leading-[18px] text-[#71717a] truncate">
                    {row.description}
                  </p>
                )}
              </div>

              <p className="text-[14px] leading-5 font-semibold text-[#18181b]">{row.users}</p>

              <p className="text-[14px] leading-5 text-[#52525b]">{row.avgOutputs}</p>

              <p className="text-[14px] leading-5 font-medium text-[#18181b]">{row.revenueValue}</p>

              <p className="text-[13px] leading-5 text-[#71717a]">{row.lastActivity}</p>

              <div>
                <StageBadge stage={row.stage} label={row.stageLabel} />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {(row.actions || []).map((action) => (
                  <ActionButton key={action.intent} action={action} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
