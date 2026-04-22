import { useState } from 'react'
import { BookOpen, Rocket, BarChart2, ChevronDown, ChevronUp } from 'lucide-react'

const SEVERITY_STYLES = {
  critical: 'bg-[#fef2f2] border-[#ef4444] text-[#991b1b]',
  high: 'bg-[#fff7ed] border-[#fb923c] text-[#9a3412]',
  medium: 'bg-[#fffbeb] border-[#f59e0b] text-[#92400e]',
  low: 'bg-[#f4f4f5] border-[#e4e4e7] text-[#52525b]',
  info: 'bg-[#f0f9ff] border-[#7dd3fc] text-[#075985]',
}

const STATUS_STYLES = {
  resolved: { dot: '#16a34a', text: '#166534' },
  investigating: { dot: '#d97706', text: '#92400e' },
  active: { dot: '#dc2626', text: '#991b1b' },
  success: { dot: '#16a34a', text: '#166534' },
  failed: { dot: '#dc2626', text: '#991b1b' },
  rollback: { dot: '#d97706', text: '#92400e' },
  positive: { dot: '#16a34a', text: '#166534' },
  neutral: { dot: '#8696b0', text: '#52525b' },
  negative: { dot: '#dc2626', text: '#991b1b' },
}

function StatusPill({ status }) {
  const s = STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.neutral
  const label = status?.charAt(0).toUpperCase() + status?.slice(1)
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] leading-[18px] font-medium" style={{ color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.dot }} />
      {label}
    </span>
  )
}

function SeverityBadge({ severity }) {
  const cls = SEVERITY_STYLES[severity?.toLowerCase()] || SEVERITY_STYLES.info
  return (
    <span className={`px-1.5 py-0.5 rounded-full border text-[11px] leading-4 font-medium ${cls}`}>
      {severity}
    </span>
  )
}

function IncidentRow({ log, expanded, onToggle }) {
  return (
    <div className="border-b border-[#f4f4f5] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#fafafa] transition-colors"
      >
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={log.severity} />
            <span className="text-[11px] leading-4 text-[#a1a1aa]">{log.timestamp}</span>
          </div>
          <p className="text-[13px] leading-5 font-semibold text-[#18181b]">{log.title}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {log.service && (
              <span className="text-[11px] leading-4 px-1.5 py-0.5 bg-[#f4f4f5] rounded text-[#52525b]">{log.service}</span>
            )}
            <StatusPill status={log.status} />
            {log.duration && (
              <span className="text-[11px] leading-4 text-[#a1a1aa]">Duration: {log.duration}</span>
            )}
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-[#a1a1aa] shrink-0 mt-0.5" strokeWidth={1.75} />
          : <ChevronDown className="w-4 h-4 text-[#a1a1aa] shrink-0 mt-0.5" strokeWidth={1.75} />}
      </button>
      {expanded && log.detail && (
        <div className="px-4 pb-3">
          <div className="bg-[#f4f4f5] rounded-[6px] px-3 py-2">
            <p className="text-[12px] leading-[18px] text-[#52525b]">{log.detail}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function DeployRow({ log }) {
  return (
    <div className="border-b border-[#f4f4f5] last:border-b-0 px-4 py-3 flex items-start gap-3">
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] leading-[18px] font-mono font-semibold text-[#18181b]">{log.version}</span>
          <StatusPill status={log.status} />
          <span className="text-[11px] leading-4 text-[#a1a1aa]">{log.timestamp}</span>
        </div>
        <p className="text-[13px] leading-5 font-medium text-[#18181b]">{log.title}</p>
        {log.author && (
          <p className="text-[12px] leading-[18px] text-[#71717a]">by {log.author}</p>
        )}
        {log.tags && log.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            {log.tags.map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 bg-[#f4f4f5] rounded text-[11px] leading-4 text-[#52525b]">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ReleaseRow({ log }) {
  const impactStyle = STATUS_STYLES[log.impact?.toLowerCase()] || STATUS_STYLES.neutral

  return (
    <div className="border-b border-[#f4f4f5] last:border-b-0 px-4 py-3 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] leading-[18px] font-mono font-semibold text-[#18181b]">{log.version}</span>
            <span className="text-[11px] leading-4 text-[#a1a1aa]">{log.timestamp}</span>
          </div>
          <p className="text-[13px] leading-5 font-medium text-[#18181b]">{log.title}</p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-[12px] leading-[18px] font-medium shrink-0"
          style={{ color: impactStyle.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: impactStyle.dot }} />
          {log.impact}
        </span>
      </div>
      {log.metrics && log.metrics.length > 0 && (
        <div className="flex items-center gap-4 flex-wrap bg-[#fafafa] rounded-[6px] px-3 py-2">
          {log.metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-0">
              <span className="text-[11px] leading-4 text-[#a1a1aa]">{m.label}</span>
              <span className="text-[13px] leading-5 font-semibold text-[#18181b]">{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const TABS = [
  { id: 'incidents', label: 'Incident Log', Icon: BookOpen },
  { id: 'deploys', label: 'Deploy Log', Icon: Rocket },
  { id: 'releases', label: 'Release Impact', Icon: BarChart2 },
]

export default function SystemLogsSection({ data }) {
  const [activeTab, setActiveTab] = useState('incidents')
  const [expandedId, setExpandedId] = useState(null)

  const title = data?.title || 'System Logs'
  const incidents = data?.incidents || []
  const deploys = data?.deploys || []
  const releases = data?.releases || []

  const counts = { incidents: incidents.length, deploys: deploys.length, releases: releases.length }

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl overflow-hidden flex flex-col">
      <div className="px-4 pt-4 pb-0 sm:px-[18px] sm:pt-[18px]">
        <p className="text-[18px] leading-7 font-medium text-[#18181b] mb-4">{title}</p>
        <div className="flex items-center gap-1 border-b border-[#f4f4f5] overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 text-[13px] leading-5 font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-[#18181b] text-[#18181b]'
                  : 'border-transparent text-[#71717a] hover:text-[#18181b]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
              {label}
              <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[11px] leading-4 font-medium ${
                activeTab === id ? 'bg-[#18181b] text-white' : 'bg-[#f4f4f5] text-[#71717a]'
              }`}>
                {counts[id]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col max-h-[420px] overflow-y-auto">
        {activeTab === 'incidents' && (
          incidents.length === 0
            ? <p className="text-[13px] text-[#a1a1aa] py-6 text-center">No incidents recorded</p>
            : incidents.map((log) => (
                <IncidentRow
                  key={log.id}
                  log={log}
                  expanded={expandedId === log.id}
                  onToggle={() => setExpandedId(expandedId === log.id ? null : log.id)}
                />
              ))
        )}
        {activeTab === 'deploys' && (
          deploys.length === 0
            ? <p className="text-[13px] text-[#a1a1aa] py-6 text-center">No deployments recorded</p>
            : deploys.map((log) => <DeployRow key={log.id} log={log} />)
        )}
        {activeTab === 'releases' && (
          releases.length === 0
            ? <p className="text-[13px] text-[#a1a1aa] py-6 text-center">No release impact data</p>
            : releases.map((log) => <ReleaseRow key={log.id} log={log} />)
        )}
      </div>
    </div>
  )
}
