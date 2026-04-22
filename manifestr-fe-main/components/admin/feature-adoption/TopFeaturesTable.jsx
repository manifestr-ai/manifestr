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
  const periods = data?.periods || ['Discovered', 'First Use', 'Repeat', 'Habitual']
  const keys = data?.keys || ['discovered', 'firstUse', 'repeat', 'habitual']

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 lg:p-[18px] lg:gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
        {subtitle && (
          <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
        )}
      </div>

      <div className="w-full overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
        <div
          className="grid min-w-[520px] items-center gap-x-2 gap-y-2 sm:gap-x-4"
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
        <p className="text-[13px] leading-5 font-medium text-[#18181b] truncate sm:text-[14px]">
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
