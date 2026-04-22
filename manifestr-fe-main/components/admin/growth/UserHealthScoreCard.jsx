function scoreColor(score) {
  if (score >= 70) return { bg: '#f0fdf4', border: '#86efac', text: '#166534', dot: '#22c55e', label: 'Healthy' }
  if (score >= 40) return { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', dot: '#f59e0b', label: 'At Risk' }
  return { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', dot: '#ef4444', label: 'Critical' }
}

function DistributionBar({ label, range, count, pct, tone }) {
  const TONE = {
    green: { bar: '#22c55e', bg: '#f0fdf4', text: '#166534', border: '#86efac' },
    amber: { bar: '#f59e0b', bg: '#fffbeb', text: '#92400e', border: '#fcd34d' },
    red: { bar: '#ef4444', bg: '#fef2f2', text: '#991b1b', border: '#fca5a5' },
  }
  const c = TONE[tone] || TONE.green

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded-full border text-[11px] leading-4 font-medium"
            style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
          >
            {label}
          </span>
          <span className="text-[12px] leading-[18px] text-[#71717a]">{range}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] leading-[18px] font-semibold text-[#18181b]">{pct}%</span>
          <span className="text-[12px] leading-[18px] text-[#a1a1aa]">· {count.toLocaleString()} users</span>
        </div>
      </div>
      <div className="h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: c.bar }}
        />
      </div>
    </div>
  )
}

function WeightRow({ label, weight }) {
  const pct = Math.round(weight * 100)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[13px] leading-5 text-[#52525b]">{label}</span>
        <span className="text-[13px] leading-5 font-semibold text-[#18181b]">{pct}%</span>
      </div>
      <div className="h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[#18181b] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function UserHealthScoreCard({ data }) {
  const title = data?.title || 'User Health Score'
  const avgScore = data?.averageScore ?? 72
  const dist = data?.distribution || {}
  const weights = data?.weights || []
  const c = scoreColor(avgScore)

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-[14px] lg:p-[18px] flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
        <span
          className="self-start sm:self-auto px-2.5 py-1 rounded-full border text-[12px] leading-[18px] font-semibold shrink-0"
          style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
        >
          {c.label}
        </span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 lg:flex-wrap">
        {/* Left: score + distribution */}
        <div className="flex flex-col gap-4 flex-1 min-w-0 sm:min-w-[220px]">
          <div className="flex items-end gap-3">
            <span className="text-[48px] leading-none font-bold text-[#18181b]">{avgScore}</span>
            <div className="flex flex-col pb-1">
              <span className="text-[14px] leading-5 text-[#71717a]">/ 100</span>
              <span className="text-[13px] leading-5 text-[#71717a]">avg score</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <DistributionBar
              label={dist.green?.label || 'Healthy'}
              range={dist.green?.range || '≥70'}
              count={dist.green?.count || 0}
              pct={dist.green?.pct || 0}
              tone="green"
            />
            <DistributionBar
              label={dist.amber?.label || 'At Risk'}
              range={dist.amber?.range || '40–69'}
              count={dist.amber?.count || 0}
              pct={dist.amber?.pct || 0}
              tone="amber"
            />
            <DistributionBar
              label={dist.red?.label || 'Critical'}
              range={dist.red?.range || '<40'}
              count={dist.red?.count || 0}
              pct={dist.red?.pct || 0}
              tone="red"
            />
          </div>
        </div>

        {/* Right: formula weights */}
        <div className="flex flex-col gap-4 flex-1 min-w-0 sm:min-w-[220px]">
          <div className="flex flex-col gap-1">
            <p className="text-[14px] leading-5 font-semibold text-[#18181b]">Score Formula (v1)</p>
            <p className="text-[12px] leading-[18px] text-[#71717a]">
              Σ (weight × normalised signal)
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {weights.map((w) => (
              <WeightRow key={w.label} label={w.label} weight={w.weight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
