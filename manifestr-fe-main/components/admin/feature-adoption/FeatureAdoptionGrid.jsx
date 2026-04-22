const STAGE_COLORS = {
  discovered: '#18181b',
  firstUse: '#3f3f46',
  repeat: '#71717a',
  habitual: '#a1a1aa',
}

const STAGE_LABELS = {
  discovered: 'Discovered',
  firstUse: 'First Use',
  repeat: 'Repeat Use',
  habitual: 'Habitual',
}

const STAGE_ORDER = ['discovered', 'firstUse', 'repeat', 'habitual']

function scoreColor(score) {
  if (score >= 60) return { bg: '#dcfce7', text: '#16a34a' }
  if (score >= 35) return { bg: '#fef9c3', text: '#ca8a04' }
  return { bg: '#fee2e2', text: '#dc2626' }
}

function FeatureCard({ feature }) {
  const stages = feature.stages || {}
  const score = feature.adoptionScore ?? stages.habitual ?? 0
  const { bg, text } = scoreColor(score)

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-3 flex flex-col gap-3 sm:p-4 sm:gap-4">
      <div className="flex items-start justify-between gap-3 min-w-0">
        <p className="text-[15px] leading-5 font-semibold text-[#18181b] min-w-0 truncate">
          {feature.name}
        </p>
        <span
          className="shrink-0 text-[12px] leading-[18px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ backgroundColor: bg, color: text }}
        >
          {score}% adopted
        </span>
      </div>

      <div className="flex flex-col gap-[6px]">
        {STAGE_ORDER.map((key) => {
          const val = stages[key] ?? 0
          const pct = Math.max(0, Math.min(100, val))
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-[82px] shrink-0 text-[12px] leading-[18px] font-medium text-[#71717a]">
                {STAGE_LABELS[key]}
              </span>
              <div className="flex-1 h-[6px] bg-[#f4f4f5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: STAGE_COLORS[key] }}
                />
              </div>
              <span className="w-[36px] shrink-0 text-right text-[12px] leading-[18px] font-semibold text-[#18181b]">
                {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function FeatureAdoptionGrid({ data }) {
  const title = data?.title || 'Funnel per Feature'
  const subtitle = data?.subtitle || 'Adoption depth for each tracked feature.'
  const features = data?.features || []

  return (
    <div className="flex flex-col gap-3 min-w-0 sm:gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
        {subtitle && (
          <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[14px]">
        {features.map((f) => (
          <FeatureCard key={f.id} feature={f} />
        ))}
      </div>
    </div>
  )
}
