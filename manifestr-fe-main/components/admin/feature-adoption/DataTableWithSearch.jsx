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
    <div className={`${flexBasis} min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 lg:p-[18px] lg:gap-6`}>
      <div className="flex flex-col gap-3 min-w-0 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
        <div className="w-full shrink-0 lg:w-[260px]">
          <div className="flex h-9 items-center gap-2 rounded-[6px] border border-[#e4e4e7] bg-white px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-[#71717a]" strokeWidth={1.5} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-5 text-[#18181b] outline-none placeholder:text-[#71717a]"
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
        <div className="min-w-[600px]">
          <div className="flex h-[44px] items-center border-b border-[#e4e4e7]">
            {columns.map((col) => (
              <div
                key={col.key}
                className={`flex items-center px-3 sm:px-4 ${col.flex ? 'min-w-0 flex-1' : `${col.width || 'w-[140px]'} shrink-0`} ${col.align === 'right' ? 'justify-end' : ''}`}
              >
                <span className="text-[11px] font-medium uppercase tracking-wide text-[#71717a] sm:text-[12px] sm:leading-[18px]">
                  {col.label}
                </span>
              </div>
            ))}
          </div>

          {filteredRows.length === 0 ? (
            <div className="flex h-[56px] items-center justify-center text-[14px] leading-5 text-[#71717a]">
              No results found.
            </div>
          ) : (
            filteredRows.map((row, idx) => (
              <div
                key={row.id || idx}
                className={`flex h-[56px] items-center ${
                  idx !== filteredRows.length - 1 ? 'border-b border-[#e4e4e7]' : ''
                }`}
              >
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={`flex items-center px-3 sm:px-4 ${col.flex ? 'min-w-0 flex-1' : `${col.width || 'w-[140px]'} shrink-0`} ${col.align === 'right' ? 'justify-end' : ''}`}
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
