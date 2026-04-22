import { Activity, AlertTriangle, BarChart3, Compass, DollarSign, Gem, PlayCircle, RefreshCw, Rocket, RotateCcw, TrendingDown, UserCheck, UserMinus, UserPlus, Users, Wallet } from 'lucide-react'

export default function StatCard({ title, value, change, period = 'vs last 30d', neutralBadge = false }) {
  const isNegative = !neutralBadge && change?.startsWith('-')
  const titleKey = (title || '').toLowerCase()
  const Icon = titleKey.includes('total users')
    ? Users
    : titleKey.includes('new signups')
      ? UserPlus
      : titleKey === 'discovered'
        ? Compass
        : titleKey === 'first use'
          ? PlayCircle
          : titleKey === 'repeat use'
            ? RefreshCw
            : titleKey === 'habitual'
              ? Gem
      : titleKey.includes('outputs per user')
        ? BarChart3
        : titleKey.includes('time to first output')
          ? Rocket
          : titleKey.includes('session frequency')
            ? RefreshCw
            : titleKey.includes('avg session duration')
              ? Activity
              : titleKey.includes('completion rate')
                ? UserCheck
                : titleKey.includes('abandonment rate')
                  ? TrendingDown
                  : titleKey.includes('rewrites per output')
                    ? RefreshCw
                    : titleKey.includes('accept rate')
                      ? UserCheck
                      : titleKey.includes('edit rate')
                        ? Activity
      : titleKey.includes('dau') || titleKey.includes('mau')
        ? Activity
        : titleKey.includes('avg retention')
          ? Activity
        : titleKey.includes('activation')
          ? Rocket
          : titleKey.includes('engaged + power')
            ? UserCheck
            : titleKey === 'at risk'
              ? AlertTriangle
          : titleKey.includes('churn rate')
            ? TrendingDown
            : titleKey.includes('reactivation')
              ? RotateCcw
              : titleKey.includes('churned this month')
                ? UserMinus
          : titleKey.includes('returning users')
            ? RefreshCw
          : titleKey === 'mrr'
            ? DollarSign
            : titleKey.includes('revenue this month')
              ? Wallet
              : BarChart3

  return (
    <div className="flex-1 min-w-0 bg-[#f4f4f4] border border-[#e9eaea] rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[#18181b]" strokeWidth={1.75} />
        </div>
        <p className="text-[18px] leading-7 font-medium text-[#545460] truncate">{title}</p>
      </div>

      {/* Value + Change */}
      <div className="flex flex-col gap-1">
        <p className="text-[20px] leading-[38px] font-semibold text-[#18181b] font-sans tabular-nums truncate">
          {value}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center justify-center px-2.5 py-0.5 text-[14px] leading-5 font-medium rounded-2xl ${
              isNegative
                ? 'bg-[#fef2f2] text-[#ef4444]'
                : 'bg-[#ecfdf3] text-[#027a48]'
            }`}
          >
            {change}
          </span>
          <span className="text-[14px] leading-5 font-normal text-[#52525b]">{period}</span>
        </div>
      </div>
    </div>
  )
}
