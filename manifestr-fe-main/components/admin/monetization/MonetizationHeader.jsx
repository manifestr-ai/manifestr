import MonetizationFilterButton from './MonetizationFilterButton'

export default function MonetizationHeader({
  title = 'Monetization',
  subtitle = 'Revenue, recurring metrics, and conversion.',
  filters,
}) {
  const filterEntries = filters ? Object.entries(filters) : []

  return (
    <div className="relative z-30 flex flex-col gap-6 px-8 pt-8 pb-6 bg-[#f4f4f5] overflow-visible">
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2 min-w-0">
          <h1 className="text-[30px] leading-[38px] font-bold text-[#18181b] font-sans">{title}</h1>
          <p className="text-[16px] leading-6 font-normal text-[#71717a]">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {filterEntries.map(([key, config]) => (
            <MonetizationFilterButton
              key={key}
              label={config?.label || key}
              defaultValue={config?.label}
              options={config?.options || []}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
