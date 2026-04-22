import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

const STATUS_STYLES = {
  healthy:  { bg: '#f0fdf4', border: '#86efac', text: '#166534', dot: '#22c55e' },
  degraded: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', dot: '#f59e0b' },
  down:     { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', dot: '#ef4444' },
}

const METHOD_STYLES = {
  GET:    { bg: '#f0fdf4', text: '#166534' },
  POST:   { bg: '#eff6ff', text: '#1d4ed8' },
  PUT:    { bg: '#fffbeb', text: '#92400e' },
  PATCH:  { bg: '#fdf4ff', text: '#7e22ce' },
  DELETE: { bg: '#fef2f2', text: '#991b1b' },
}

const COLS = [
  { key: 'endpoint',     label: 'Endpoint',    flex: '2fr',   sortable: false },
  { key: 'method',       label: 'Method',      flex: '0.55fr', sortable: false },
  { key: 'p50',          label: 'P50',         flex: '0.7fr', sortable: true  },
  { key: 'p95',          label: 'P95',         flex: '0.7fr', sortable: true  },
  { key: 'p99',          label: 'P99',         flex: '0.7fr', sortable: true  },
  { key: 'errorRate',    label: 'Error Rate',  flex: '1.1fr', sortable: true  },
  { key: 'callsPerHour', label: 'Calls / hr',  flex: '0.7fr', sortable: true  },
  { key: 'status',       label: 'Status',      flex: '0.8fr', sortable: false },
]

const GRID = COLS.map((c) => c.flex).join(' ')

function SortIcon({ active, dir }) {
  if (!active) return <ChevronsUpDown className="w-3 h-3 text-[#c4c4c7]" strokeWidth={1.75} />
  return dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-[#18181b]" strokeWidth={2} />
    : <ChevronDown className="w-3 h-3 text-[#18181b]" strokeWidth={2} />
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.healthy
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Healthy'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] leading-4 font-semibold whitespace-nowrap"
      style={{ backgroundColor: s.bg, borderColor: s.border, color: s.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.dot }} />
      {label}
    </span>
  )
}

function MethodBadge({ method }) {
  const s = METHOD_STYLES[method?.toUpperCase()] || { bg: '#f4f4f5', text: '#52525b' }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] leading-4 font-semibold uppercase"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {method}
    </span>
  )
}

function ErrorRateCell({ value }) {
  const color = value >= 2 ? '#dc2626' : value >= 0.5 ? '#d97706' : '#16a34a'
  const pct = Math.min(value * 10, 100)
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-14 h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden shrink-0">
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[13px] leading-5 font-semibold tabular-nums" style={{ color }}>
        {value.toFixed(2)}%
      </span>
    </div>
  )
}

export default function EndpointPerformanceTable({ data }) {
  const title = data?.title || 'Endpoint Performance'
  const rows = data?.rows || []

  const [sortField, setSortField] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  function handleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sorted = [...rows].sort((a, b) => {
    if (!sortField) return 0
    const va = a[sortField] ?? 0
    const vb = b[sortField] ?? 0
    return sortDir === 'asc' ? va - vb : vb - va
  })

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-5">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="w-full overflow-x-auto">
        {/* Header */}
        <div
          className="grid items-center gap-x-4 pb-2 border-b border-[#e4e4e7] min-w-[760px]"
          style={{ gridTemplateColumns: GRID }}
        >
          {COLS.map((col) =>
            col.sortable ? (
              <button
                key={col.key}
                type="button"
                onClick={() => handleSort(col.key)}
                className="flex items-center gap-1 text-[12px] leading-[18px] font-semibold uppercase tracking-[0.06em] text-[#71717a] hover:text-[#18181b] transition-colors select-none text-left"
              >
                {col.label}
                <SortIcon active={sortField === col.key} dir={sortDir} />
              </button>
            ) : (
              <p
                key={col.key}
                className="text-[12px] leading-[18px] font-semibold uppercase tracking-[0.06em] text-[#71717a]"
              >
                {col.label}
              </p>
            )
          )}
        </div>

        {/* Rows */}
        <div className="flex flex-col min-w-[760px]">
          {sorted.map((row) => (
            <div
              key={row.id}
              className="grid items-center gap-x-4 h-[52px] border-b border-[#e4e4e7] last:border-b-0"
              style={{ gridTemplateColumns: GRID }}
            >
              {/* Endpoint */}
              <p className="text-[13px] leading-5 font-mono font-medium text-[#18181b] truncate">
                {row.endpoint}
              </p>

              {/* Method */}
              <div>
                <MethodBadge method={row.method} />
              </div>

              {/* P50 */}
              <p className="text-[14px] leading-5 font-semibold text-[#18181b] tabular-nums">
                {row.p50}<span className="text-[#a1a1aa] font-normal text-[12px]">ms</span>
              </p>

              {/* P95 */}
              <p className="text-[14px] leading-5 font-semibold text-[#18181b] tabular-nums">
                {row.p95}<span className="text-[#a1a1aa] font-normal text-[12px]">ms</span>
              </p>

              {/* P99 */}
              <p className="text-[14px] leading-5 font-semibold text-[#18181b] tabular-nums">
                {row.p99}<span className="text-[#a1a1aa] font-normal text-[12px]">ms</span>
              </p>

              {/* Error Rate */}
              <ErrorRateCell value={row.errorRate} />

              {/* Calls / hr */}
              <p className="text-[14px] leading-5 font-normal text-[#52525b] tabular-nums">
                {row.callsPerHour?.toLocaleString()}
              </p>

              {/* Status */}
              <div>
                <StatusBadge status={row.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
