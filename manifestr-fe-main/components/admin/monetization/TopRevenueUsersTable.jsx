const PLAN_STYLES = {
  Enterprise: { bg: '#18181b', text: '#ffffff' },
  Team:       { bg: '#3f3f46', text: '#ffffff' },
  Pro:        { bg: '#e4e4e7', text: '#18181b' },
  Free:       { bg: '#f4f4f5', text: '#52525b' },
}

const GRID = '2fr 1fr 1fr 1fr 1fr'

function HeaderCell({ children, align = 'left' }) {
  return (
    <p
      className="text-[12px] leading-[18px] font-semibold uppercase tracking-[0.06em] text-[#71717a]"
      style={{ textAlign: align }}
    >
      {children}
    </p>
  )
}

function PlanBadge({ plan }) {
  const style = PLAN_STYLES[plan] || { bg: '#e4e4e7', text: '#18181b' }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] leading-[18px] font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {plan}
    </span>
  )
}

export default function TopRevenueUsersTable({ data }) {
  if (!data) return null

  const title = data.title || 'Top Users by Revenue'
  const subtitle = data.subtitle || ''
  const rows = data.rows || []

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-[#e4e4e7] bg-white p-4 sm:gap-5 sm:p-[18px]">
      <div className="flex flex-col gap-0.5">
        <p className="text-[16px] font-medium leading-6 text-[#18181b] sm:text-[18px] sm:leading-7">{title}</p>
        {subtitle && (
          <p className="text-[14px] font-normal leading-5 text-[#71717a]">{subtitle}</p>
        )}
      </div>

      <div className="w-full overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
        <div
          className="grid min-w-[640px] items-center gap-x-4 gap-y-0"
          style={{ gridTemplateColumns: GRID }}
        >
          <HeaderCell>Account</HeaderCell>
          <HeaderCell>Plan</HeaderCell>
          <HeaderCell align="right">MRR</HeaderCell>
          <HeaderCell align="right">Outputs</HeaderCell>
          <HeaderCell align="right">Last Active</HeaderCell>

          {rows.map((row, idx) => (
            <Row key={`${row.user}-${idx}`} row={row} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Row({ row }) {
  return (
    <>
      <div className="py-3 border-t border-[#f4f4f5]">
        <p className="text-[14px] leading-5 font-medium text-[#18181b] truncate">{row.user}</p>
      </div>
      <div className="py-3 border-t border-[#f4f4f5]">
        <PlanBadge plan={row.plan} />
      </div>
      <div className="py-3 border-t border-[#f4f4f5] text-right">
        <span className="text-[14px] leading-5 font-semibold text-[#18181b] tabular-nums">{row.mrr}</span>
      </div>
      <div className="py-3 border-t border-[#f4f4f5] text-right">
        <span className="text-[14px] leading-5 font-normal text-[#52525b] tabular-nums">{row.outputs?.toLocaleString()}</span>
      </div>
      <div className="py-3 border-t border-[#f4f4f5] text-right">
        <span className="text-[13px] leading-5 font-normal text-[#71717a]">{row.lastActive}</span>
      </div>
    </>
  )
}
