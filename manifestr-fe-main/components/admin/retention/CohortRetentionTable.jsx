import { Info } from 'lucide-react'

function cellStyle(value) {
  const v = Math.max(0, Math.min(100, value || 0))
  const alpha = 0.08 + (v / 100) * 0.55
  const textColor = v >= 55 ? '#ffffff' : '#18181b'
  return {
    backgroundColor: `rgba(24, 24, 27, ${alpha.toFixed(2)})`,
    color: textColor,
  }
}

export default function CohortRetentionTable({ data }) {
  const title = data?.title || 'Cohort Retention'
  const subtitle = data?.subtitle || ''
  const periods = data?.periods || ['1d', '7d', '30d']
  const rows = data?.rows || []

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
            <Info className="w-4 h-4 text-[#71717a]" strokeWidth={1.75} />
          </div>
          {subtitle && (
            <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="w-full">
        <div
          className="grid items-center gap-x-4 gap-y-2"
          style={{ gridTemplateColumns: `1.4fr 0.9fr repeat(${periods.length}, minmax(0, 1fr))` }}
        >
          <p className="text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wide">
            Cohort
          </p>
          <p className="text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wide">
            Size
          </p>
          {periods.map((p) => (
            <p
              key={p}
              className="text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wide text-center"
            >
              {p}
            </p>
          ))}

          {rows.map((row) => (
            <RowFragment key={row.cohort} row={row} periods={periods} />
          ))}
        </div>
      </div>
    </div>
  )
}

function RowFragment({ row, periods }) {
  return (
    <>
      <div className="py-1.5">
        <p className="text-[14px] leading-5 font-medium text-[#18181b] whitespace-nowrap">
          {row.cohort}
        </p>
      </div>
      <div className="py-1.5">
        <p className="text-[14px] leading-5 font-normal text-[#71717a] whitespace-nowrap">
          {row.size}
        </p>
      </div>
      {periods.map((p, i) => (
        <div
          key={p}
          className="h-9 rounded-[6px] flex items-center justify-center text-[14px] leading-5 font-semibold"
          style={cellStyle(row.values?.[i])}
        >
          {row.values?.[i] ?? 0}%
        </div>
      ))}
    </>
  )
}
