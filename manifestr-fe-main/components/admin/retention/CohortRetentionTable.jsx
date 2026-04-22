import { useState } from 'react'

function cellStyle(value, isHighlighted) {
  const v = Math.max(0, Math.min(100, value || 0))
  const alpha = isHighlighted
    ? Math.min(0.08 + (v / 100) * 0.55 + 0.18, 1)
    : 0.08 + (v / 100) * 0.55
  const textColor = v >= 55 ? '#ffffff' : '#18181b'
  return {
    backgroundColor: `rgba(24, 24, 27, ${alpha.toFixed(2)})`,
    color: textColor,
    transform: isHighlighted ? 'scale(1.04)' : 'scale(1)',
    zIndex: isHighlighted ? 1 : 'auto',
    transition: 'transform 0.12s, background-color 0.12s',
  }
}

export default function CohortRetentionTable({ data }) {
  const title = data?.title || 'Cohort Retention'
  const subtitle = data?.subtitle || ''
  const periods = data?.periods || ['1d', '7d', '30d']
  const rows = data?.rows || []

  const [hoverCell, setHoverCell] = useState(null) // { row, col }

  return (
    <div className="w-full flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] lg:p-[18px] flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
        {subtitle && (
          <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
        )}
      </div>

      <div className="w-full overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
        <div
          className="grid items-center gap-x-2 gap-y-2 sm:gap-x-4 min-w-[280px]"
          style={{ gridTemplateColumns: `1.4fr 0.9fr repeat(${periods.length}, minmax(0, 1fr))` }}
        >
          {/* Header */}
          <p className="text-[12px] leading-[18px] font-semibold uppercase tracking-[0.06em] text-[#71717a]">Cohort</p>
          <p className="text-[12px] leading-[18px] font-semibold uppercase tracking-[0.06em] text-[#71717a]">Size</p>
          {periods.map((p, colIdx) => (
            <p
              key={p}
              className="text-[12px] leading-[18px] font-semibold uppercase tracking-[0.06em] text-center transition-colors"
              style={{ color: hoverCell?.col === colIdx ? '#18181b' : '#71717a' }}
            >
              {p}
            </p>
          ))}

          {/* Rows */}
          {rows.map((row, rowIdx) => (
            <RowFragment
              key={row.cohort}
              row={row}
              periods={periods}
              rowIdx={rowIdx}
              hoverCell={hoverCell}
              setHoverCell={setHoverCell}
            />
          ))}
        </div>
      </div>

      {/* Hover readout */}
      <div className="h-5">
        {hoverCell && rows[hoverCell.row] && (
          <p className="text-[12px] leading-5 text-[#71717a]">
            <span className="font-semibold text-[#18181b]">{rows[hoverCell.row].cohort}</span>
            {' · '}
            <span className="font-semibold text-[#18181b]">{periods[hoverCell.col]}</span>
            {' retention: '}
            <span className="font-bold text-[#18181b]">{rows[hoverCell.row].values?.[hoverCell.col] ?? 0}%</span>
          </p>
        )}
      </div>
    </div>
  )
}

function RowFragment({ row, periods, rowIdx, hoverCell, setHoverCell }) {
  return (
    <>
      <div className="py-1.5">
        <p
          className="text-[14px] leading-5 font-medium whitespace-nowrap transition-colors"
          style={{ color: hoverCell?.row === rowIdx ? '#18181b' : '#52525b' }}
        >
          {row.cohort}
        </p>
      </div>
      <div className="py-1.5">
        <p className="text-[14px] leading-5 font-normal text-[#71717a] whitespace-nowrap">{row.size}</p>
      </div>
      {periods.map((p, colIdx) => {
        const val = row.values?.[colIdx]
        const isHovered = hoverCell?.row === rowIdx && hoverCell?.col === colIdx
        const sameRow = hoverCell?.row === rowIdx
        const sameCol = hoverCell?.col === colIdx
        const softHighlight = !isHovered && (sameRow || sameCol)

        return (
          <div
            key={p}
            className="h-9 rounded-[6px] flex items-center justify-center text-[14px] leading-5 font-semibold cursor-default relative"
            style={{
              ...cellStyle(val, isHovered),
              outline: isHovered ? '2px solid rgba(24,24,27,0.4)' : softHighlight ? '1.5px solid rgba(24,24,27,0.15)' : 'none',
              outlineOffset: '0px',
            }}
            onMouseEnter={() => setHoverCell({ row: rowIdx, col: colIdx })}
            onMouseLeave={() => setHoverCell(null)}
          >
            {val ?? 0}%
          </div>
        )
      })}
    </>
  )
}
