function HealthBadge({ score }) {
  if (score >= 70) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#86efac] bg-[#f0fdf4] text-[12px] leading-[18px] font-semibold text-[#166534]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" />
        {score}
      </span>
    )
  }
  if (score >= 40) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#fcd34d] bg-[#fffbeb] text-[12px] leading-[18px] font-semibold text-[#92400e]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shrink-0" />
        {score}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#fca5a5] bg-[#fef2f2] text-[12px] leading-[18px] font-semibold text-[#991b1b]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shrink-0" />
      {score}
    </span>
  )
}

const COLS = [
  { key: 'name', label: 'User', flex: '1.6fr' },
  { key: 'company', label: 'Company', flex: '1.4fr' },
  { key: 'outputsCreated', label: 'Outputs', flex: '0.8fr' },
  { key: 'sessions', label: 'Sessions (30d)', flex: '1fr' },
  { key: 'lastActive', label: 'Last Active', flex: '1fr' },
  { key: 'healthScore', label: 'Health Score', flex: '1fr' },
]

export default function PowerUsersTable({ data }) {
  const title = data?.title || 'Power Users'
  const subtitle = data?.subtitle || ''
  const rows = data?.rows || []
  const gridTemplate = COLS.map((c) => c.flex).join(' ')

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
        {subtitle && (
          <p className="text-[14px] leading-5 text-[#71717a]">{subtitle}</p>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        {/* Header */}
        <div
          className="hidden md:grid items-center gap-x-4 pb-2 border-b border-[#e4e4e7]"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {COLS.map((col) => (
            <p key={col.key} className="text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wide">
              {col.label}
            </p>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid items-center gap-x-4 gap-y-2 py-3 border-b border-[#e4e4e7] last:border-b-0 grid-cols-1 md:grid-cols-[1.6fr_1.4fr_0.8fr_1fr_1fr_1fr]"
            >
              <p className="text-[14px] leading-5 font-medium text-[#18181b] truncate">{row.name}</p>
              <p className="text-[14px] leading-5 text-[#52525b] truncate">{row.company}</p>
              <p className="text-[14px] leading-5 font-semibold text-[#18181b]">{row.outputsCreated}</p>
              <p className="text-[14px] leading-5 text-[#52525b]">{row.sessions}</p>
              <p className="text-[14px] leading-5 text-[#52525b]">{row.lastActive}</p>
              <div>
                <HealthBadge score={row.healthScore} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
