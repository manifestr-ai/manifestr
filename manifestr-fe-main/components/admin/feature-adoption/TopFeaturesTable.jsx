function cellStyle(value) {
  const v = Math.max(0, Math.min(100, value || 0))
  const alpha = 0.08 + (v / 100) * 0.55
  const textColor = v >= 55 ? '#ffffff' : '#18181b'
  return {
    backgroundColor: `rgba(24, 24, 27, ${alpha.toFixed(2)})`,
    color: textColor,
  }
}

export default function TopFeaturesTable({ data }) {
  const title = data?.title || 'Top Features by Adoption'
  const subtitle = data?.subtitle || ''
  const rows = data?.rows || []
  const periods = ['First Use', 'Repeat', 'Habitual']
  const keys = ['firstUse', 'repeat', 'habitual']

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
          className="grid items-center gap-x-4 gap-y-2"
          style={{ gridTemplateColumns: `1.4fr repeat(${periods.length}, minmax(0, 1fr))` }}
        >
          <p className="text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wide">
            Feature
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
            <Row key={row.feature} row={row} keys={keys} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Row({ row, keys }) {
  return (
    <>
      <div className="py-1.5">
        <p className="text-[14px] leading-5 font-medium text-[#18181b] whitespace-nowrap">
          {row.feature}
        </p>
      </div>
      {keys.map((k) => (
        <div
          key={k}
          className="h-9 rounded-[6px] flex items-center justify-center text-[14px] leading-5 font-semibold"
          style={cellStyle(row[k])}
        >
          {row[k] ?? 0}%
        </div>
      ))}
    </>
  )
}
