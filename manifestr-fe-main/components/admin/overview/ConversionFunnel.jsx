export default function ConversionFunnel({ data }) {
  const title = data?.title || 'Conversion Funnel'
  const steps = data?.steps || []

  const maxValue = steps.reduce((m, s) => Math.max(m, s.value), 1)

  return (
    <div className="w-full lg:flex-1 min-w-0 bg-[#f4f4f4] border border-[#e9eaea] rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.05)] p-4 lg:p-[18px] flex flex-col gap-4 lg:gap-6">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="flex flex-col gap-2">
        {steps.map((step, idx) => {
          const barWidth = (step.value / maxValue) * 100
          const convRate = idx > 0 ? ((step.value / steps[idx - 1].value) * 100).toFixed(0) : null

          return (
            <div key={step.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[13px] leading-5 font-medium text-[#18181b]">
                  {step.label}
                </span>
                <div className="flex items-center gap-2">
                  {convRate !== null && (
                    <span className="text-[11px] leading-4 text-[#71717a]">
                      {convRate}% from prev
                    </span>
                  )}
                  <span className="text-[13px] leading-5 font-semibold text-[#18181b]">
                    {step.valueLabel || step.value.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="h-[10px] bg-[#f4f4f5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: idx === 0 ? '#18181b' : idx === 1 ? '#3f3f46' : idx === 2 ? '#71717a' : '#a1a1aa',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
