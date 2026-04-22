function getCellStyle(value) {
  const v = typeof value === 'number' ? value : 0

  if (v >= 75) {
    return { backgroundColor: '#18181b', color: '#ffffff' }
  }
  if (v >= 50) {
    return { backgroundColor: '#475569', color: '#ffffff' }
  }
  if (v >= 35) {
    return { backgroundColor: '#94a3b8', color: '#ffffff' }
  }
  return { backgroundColor: '#e2e8f0', color: '#18181b' }
}

export default function ChurnRiskHeatmap({ data }) {
  const title = data?.title || 'Churn Risk Heatmap'
  const columns = data?.columns || ['Low Risk', 'Medium Risk', 'High Risk', 'Critical']
  const rows = data?.rows || []

  const gridTemplate = `120px repeat(${columns.length}, minmax(0, 1fr))`

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-4">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="w-full">
        <div
          className="grid items-center gap-x-4 pb-3 border-b border-[#e4e4e7]"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <p className="text-[12px] leading-[18px] font-medium text-[#71717a]">
            Segment
          </p>
          {columns.map((col) => (
            <p
              key={col}
              className="text-[12px] leading-[18px] font-medium text-[#71717a] text-center"
            >
              {col}
            </p>
          ))}
        </div>

        <div className="flex flex-col">
          {rows.map((row) => (
            <div
              key={row.segment}
              className="grid items-center gap-x-4 py-3 border-b border-[#e4e4e7] last:border-b-0"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              <p className="text-[14px] leading-5 font-medium text-[#18181b]">
                {row.segment}
              </p>
              {columns.map((col, idx) => {
                const value = row.values?.[idx]
                return (
                  <div
                    key={`${row.segment}-${col}`}
                    className="h-9 rounded-[6px] flex items-center justify-center text-[13px] leading-5 font-medium"
                    style={getCellStyle(value)}
                  >
                    {typeof value === 'number' ? `${value}%` : '—'}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
