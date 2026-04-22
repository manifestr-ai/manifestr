import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

export default function DataTableWithSearch({
  title,
  columns = [],
  rows = [],
  searchPlaceholder = 'Search accounts...',
  flexBasis = 'flex-1',
}) {
  const [query, setQuery] = useState('')

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows
    const q = query.trim().toLowerCase()
    return rows.filter((row) =>
      columns.some((col) => {
        const v = row[col.key]
        return v != null && String(v).toLowerCase().includes(q)
      }),
    )
  }, [rows, columns, query])

  return (
    <div className={`${flexBasis} min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
        <div className="w-[260px] shrink-0">
          <div className="flex items-center gap-2 h-9 px-3 py-2 rounded-[6px] border border-[#e4e4e7] bg-white">
            <Search className="w-4 h-4 shrink-0 text-[#71717a]" strokeWidth={1.5} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 min-w-0 bg-transparent outline-none text-[14px] leading-5 font-normal text-[#18181b] placeholder:text-[#71717a]"
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-full">
          <div className="flex items-center h-[44px] border-b border-[#e4e4e7]">
            {columns.map((col) => (
              <div
                key={col.key}
                className={`px-4 flex items-center ${col.flex ? 'flex-1 min-w-0' : `${col.width || 'w-[140px]'} shrink-0`} ${col.align === 'right' ? 'justify-end' : ''}`}
              >
                <span className="text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wide">
                  {col.label}
                </span>
              </div>
            ))}
          </div>

          {filteredRows.length === 0 ? (
            <div className="h-[56px] flex items-center justify-center text-[14px] leading-5 text-[#71717a]">
              No results found.
            </div>
          ) : (
            filteredRows.map((row, idx) => (
              <div
                key={row.id || idx}
                className={`flex items-center h-[56px] ${
                  idx !== filteredRows.length - 1 ? 'border-b border-[#e4e4e7]' : ''
                }`}
              >
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={`px-4 flex items-center ${col.flex ? 'flex-1 min-w-0' : `${col.width || 'w-[140px]'} shrink-0`} ${col.align === 'right' ? 'justify-end' : ''}`}
                  >
                    <span
                      className={`text-[14px] leading-5 ${
                        col.emphasis ? 'font-medium text-[#18181b]' : 'font-normal text-[#18181b]'
                      } truncate`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
