import MonetizationFilterButton from './MonetizationFilterButton'

export default function MonetizationHeader({
  title = 'Monetization',
  subtitle = 'Revenue, recurring metrics, and conversion.',
  filters,
}) {
  const filterEntries = filters ? Object.entries(filters) : []

  return (
    <div className="relative z-30 flex flex-col gap-4 overflow-visible  px-4 pb-4 pt-6 lg:gap-6 lg:px-8 lg:pb-6 lg:pt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="flex min-w-0 flex-col gap-1.5 lg:gap-2">
          <h1 className="font-sans text-[26px] font-bold leading-[34px] text-[#18181b] lg:text-[30px] lg:leading-[38px]">
            {title}
          </h1>
          <p className="text-[15px] font-normal leading-6 text-[#71717a] lg:text-[16px]">{subtitle}</p>
        </div>

        <div className="grid w-full min-w-0 grid-cols-2 gap-2 lg:flex lg:w-auto lg:shrink-0 lg:flex-row lg:flex-wrap lg:justify-end">
          {filterEntries.map(([key, config]) => (
            <div key={key} className="min-w-0 w-full lg:w-auto">
              <MonetizationFilterButton
                label={config?.label || key}
                defaultValue={config?.label}
                options={config?.options || []}
                stretch
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
