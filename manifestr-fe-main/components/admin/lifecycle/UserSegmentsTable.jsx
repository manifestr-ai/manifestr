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
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
        {subtitle && (
          <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        {/* Header */}
        <div
          className="hidden lg:grid items-center gap-x-4 pb-2 border-b border-[#e4e4e7] min-w-[900px]"
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

        {/* Rows */}
        <div className="flex flex-col min-w-[900px]">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid items-center gap-x-4 gap-y-2 py-3.5 border-b border-[#e4e4e7] last:border-b-0"
              style={{ gridTemplateColumns: GRID }}
            >
              {/* Segment */}
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

              {/* Users */}
              <p className="text-[14px] leading-5 font-semibold text-[#18181b]">{row.users}</p>

              {/* Avg Outputs */}
              <p className="text-[14px] leading-5 text-[#52525b]">{row.avgOutputs}</p>

              {/* Revenue */}
              <p className="text-[14px] leading-5 font-medium text-[#18181b]">{row.revenueValue}</p>

              {/* Last Active */}
              <p className="text-[13px] leading-5 text-[#71717a]">{row.lastActivity}</p>

              {/* Stage */}
              <div>
                <StageBadge stage={row.stage} label={row.stageLabel} />
              </div>

              {/* Actions */}
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
