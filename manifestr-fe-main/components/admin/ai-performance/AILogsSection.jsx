import { useState } from 'react'
import { AlertCircle, Clock, ChevronDown, ChevronUp, Search } from 'lucide-react'

const SEVERITY_STYLES = {
  critical: 'bg-[#fef2f2] border-[#ef4444] text-[#991b1b]',
  error: 'bg-[#fef2f2] border-[#ef4444] text-[#ef4444]',
  warning: 'bg-[#fffbeb] border-[#f59e0b] text-[#92400e]',
  timeout: 'bg-[#fff7ed] border-[#fb923c] text-[#9a3412]',
  info: 'bg-[#f0f9ff] border-[#7dd3fc] text-[#075985]',
}

function LogRow({ log, expanded, onToggle }) {
  const severityStyle = SEVERITY_STYLES[log.severity?.toLowerCase()] || SEVERITY_STYLES.info

  return (
    <div className="border-b border-[#f4f4f5] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-3 py-3 px-4 text-left hover:bg-[#fafafa] transition-colors"
      >
        <span
          className={`mt-0.5 shrink-0 px-1.5 py-0.5 rounded-full border text-[11px] leading-4 font-medium whitespace-nowrap ${severityStyle}`}
        >
          {log.severity}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] leading-5 font-medium text-[#18181b] truncate">{log.message}</p>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-[11px] leading-4 text-[#a1a1aa]">{log.timestamp}</span>
            {log.model && (
              <span className="text-[11px] leading-4 text-[#71717a] font-medium">{log.model}</span>
            )}
            {log.tool && (
              <span className="text-[11px] leading-4 px-1.5 py-0.5 bg-[#f4f4f5] rounded text-[#52525b]">
                {log.tool}
              </span>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[#a1a1aa] shrink-0 mt-0.5" strokeWidth={1.75} />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#a1a1aa] shrink-0 mt-0.5" strokeWidth={1.75} />
        )}
      </button>
      {expanded && log.detail && (
        <div className="px-4 pb-3">
          <div className="bg-[#f4f4f5] rounded-[6px] px-3 py-2">
            <p className="text-[12px] leading-[18px] font-mono text-[#52525b] whitespace-pre-wrap break-all">
              {log.detail}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function LogPanel({ icon: Icon, iconColor, headerBg, headerBorder, headerText, title, logs, badgeBg }) {
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = logs.filter(
    (l) =>
      search === '' ||
      l.message?.toLowerCase().includes(search.toLowerCase()) ||
      l.model?.toLowerCase().includes(search.toLowerCase()) ||
      l.tool?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl overflow-hidden flex flex-col">
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${headerBorder} ${headerBg}`}>
        <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} strokeWidth={1.75} />
        <p className={`text-[14px] leading-5 font-semibold ${headerText}`}>{title}</p>
        <span className={`ml-auto px-1.5 py-0.5 rounded-full border text-[11px] leading-4 font-medium ${badgeBg}`}>
          {logs.length}
        </span>
      </div>

      <div className="px-4 py-2 border-b border-[#f4f4f5]">
        <div className="flex items-center gap-2 bg-[#fafafa] border border-[#e4e4e7] rounded-[6px] px-2.5 py-1.5 h-8">
          <Search className="w-3.5 h-3.5 text-[#a1a1aa]" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter logs..."
            className="flex-1 bg-transparent outline-none text-[13px] leading-5 text-[#18181b] placeholder:text-[#a1a1aa]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[340px]">
        {filtered.length === 0 ? (
          <p className="text-[13px] leading-5 text-[#a1a1aa] py-6 text-center">No logs found</p>
        ) : (
          filtered.map((log) => (
            <LogRow
              key={log.id}
              log={log}
              expanded={expandedId === log.id}
              onToggle={() => setExpandedId(expandedId === log.id ? null : log.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default function AILogsSection({ data }) {
  const title = data?.title || 'AI Logs'
  const errorLogs = data?.errors || []
  const timeoutLogs = data?.timeouts || []

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
      <div className="flex flex-col lg:flex-row gap-[18px]">
        <LogPanel
          icon={AlertCircle}
          iconColor="text-[#71717a]"
          headerBg="bg-[#f4f4f5]"
          headerBorder="border-[#e4e4e7]"
          headerText="text-[#18181b]"
          badgeBg="bg-white border-[#e4e4e7] text-[#52525b]"
          title="AI Errors"
          logs={errorLogs}
        />
        <LogPanel
          icon={Clock}
          iconColor="text-[#71717a]"
          headerBg="bg-[#f4f4f5]"
          headerBorder="border-[#e4e4e7]"
          headerText="text-[#18181b]"
          badgeBg="bg-white border-[#e4e4e7] text-[#52525b]"
          title="Timeouts"
          logs={timeoutLogs}
        />
      </div>
    </div>
  )
}
