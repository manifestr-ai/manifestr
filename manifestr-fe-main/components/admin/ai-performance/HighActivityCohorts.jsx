import { ArrowUpRight } from 'lucide-react'

function CohortCard({ cohort }) {
  const metrics = cohort?.metrics || []
  const showUpsell = Boolean(cohort?.action?.label)

  return (
    <div className="flex-1 min-w-[220px] bg-white border border-[#e4e4e7] rounded-xl p-4 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[16px] leading-6 font-semibold text-[#18181b] truncate">
          {cohort?.name}
        </p>
        <span className="px-2 py-0.5 rounded-full border border-[#e4e4e7] bg-[#f4f4f5]/80 text-[12px] leading-[18px] font-medium text-[#52525b] whitespace-nowrap">
          {cohort?.badge}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between">
            <span className="text-[14px] leading-5 text-[#71717a]">{m.label}</span>
            <span className="text-[14px] leading-5 font-semibold text-[#18181b]">
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {showUpsell && (
        <button
          type="button"
          className="mt-auto h-9 px-3 rounded-[6px] bg-[#18181b] text-white text-[14px] leading-5 font-medium inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
          {cohort.action.label}
        </button>
      )}
    </div>
  )
}

export default function HighActivityCohorts({ data }) {
  const title = data?.title || 'High Activity Cohorts'
  const cohorts = data?.cohorts || []

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-4">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
        {cohorts.map((cohort) => (
          <CohortCard key={cohort.id} cohort={cohort} />
        ))}
      </div>
    </div>
  )
}
