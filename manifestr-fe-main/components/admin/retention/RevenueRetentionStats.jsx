import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const METRIC_CONFIG = {
  nrr: {
    description: 'Net Revenue Retention',
    goodAbove: 100,
    Icon: TrendingUp,
  },
  grr: {
    description: 'Gross Revenue Retention',
    goodAbove: 90,
    Icon: TrendingUp,
  },
  expansion: {
    description: 'Revenue from upgrades & seat adds',
    positiveIsGood: true,
    Icon: ArrowUpRight,
  },
  contraction: {
    description: 'Revenue lost from downgrades',
    positiveIsGood: false,
    Icon: ArrowDownRight,
  },
}

function MetricCard({ metric }) {
  const cfg = METRIC_CONFIG[metric?.id] || {}
  const changeStr = metric?.change || ''
  const isPositiveChange = changeStr.startsWith('+')
  const isNegativeChange = changeStr.startsWith('-')

  let badgeBg, badgeBorder, badgeText
  if (metric?.id === 'contraction') {
    // For contraction, a positive change (rising costs) is bad
    badgeBg = isPositiveChange ? '#fef2f2' : '#f0fdf4'
    badgeBorder = isPositiveChange ? '#ef4444' : '#22c55e'
    badgeText = isPositiveChange ? '#991b1b' : '#166534'
  } else {
    badgeBg = isNegativeChange ? '#fef2f2' : '#f0fdf4'
    badgeBorder = isNegativeChange ? '#ef4444' : '#22c55e'
    badgeText = isNegativeChange ? '#991b1b' : '#166534'
  }

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] lg:p-[18px] flex flex-col gap-4 lg:gap-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] leading-6 font-semibold text-[#18181b]">{metric?.title}</p>
          {cfg.description && (
            <p className="text-[12px] leading-[18px] text-[#71717a]">{cfg.description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[24px] leading-[32px] font-bold text-[#18181b] lg:text-[30px] lg:leading-[38px]">{metric?.value}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center px-1.5 text-[12px] leading-[18px] font-medium rounded-full border"
            style={{ backgroundColor: badgeBg, borderColor: badgeBorder, color: badgeText }}
          >
            {changeStr}
          </span>
          <span className="text-[13px] leading-5 text-[#71717a]">{metric?.period}</span>
        </div>
      </div>
    </div>
  )
}

export default function RevenueRetentionStats({ data }) {
  const title = data?.title || 'Revenue Retention'
  const metrics = data?.metrics || []

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <p className="text-[16px] leading-6 font-semibold text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-[18px]">
        {metrics.map((m) => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </div>
    </div>
  )
}
