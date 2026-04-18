const COHORTS = [
  { label: 'May', values: [100, 26, 80, 38, 75] },
  { label: 'Jun', values: [75, 44, 100, 14, 38] },
  { label: 'Jul', values: [80, 90, 75, 29, 59] },
  { label: 'Aug', values: [30, 29, 38, 63, 100] },
  { label: 'Sep', values: [38, 80, 54, 75, 80] },
]
const PERIODS = ['W1', 'W2', 'W3', 'W4', 'W5']

function getCellStyle(value) {
  if (value >= 80) return { bg: '#020617', text: 'white' }
  if (value >= 60) return { bg: '#334155', text: 'white' }
  if (value >= 40) return { bg: '#94a3b8', text: 'white' }
  if (value >= 25) return { bg: '#e2e8f0', text: '#18181b' }
  return { bg: 'white', text: '#18181b' }
}

export default function RetentionHeatmap({ data }) {
  const title = data?.title || 'Closed-Won This Month'
  const cohorts = data?.cohorts || COHORTS
  const periods = data?.periods || PERIODS

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="w-full overflow-x-auto">
        <div className="flex w-full">
          <div className="flex-1 min-w-[85px] flex flex-col overflow-hidden">
            <div className="h-12 flex items-center px-4 border-b border-[#e4e4e7]">
              <span className="text-[14px] leading-5 font-medium text-[#71717a]">Signup Month</span>
            </div>
            {cohorts.map((c) => (
              <div key={c.label} className="h-[52px] flex items-center px-4 border-b border-[#e4e4e7]">
                <span className="text-[14px] leading-5 font-medium text-[#18181b]">{c.label}</span>
              </div>
            ))}
          </div>

          {periods.map((period, colIdx) => (
            <div key={period} className="flex-1 min-w-[85px] flex flex-col overflow-hidden">
              <div className="h-12 flex items-center px-4 border-b border-[#e4e4e7]">
                <span className="text-[14px] leading-5 font-medium text-[#71717a]">{period}</span>
              </div>
              {cohorts.map((cohort) => {
                const val = cohort.values[colIdx]
                const style = getCellStyle(val)
                return (
                  <div
                    key={cohort.label}
                    className="h-[52px] flex items-center px-4"
                    style={{ backgroundColor: style.bg }}
                  >
                    <span className="text-[14px] leading-5 font-normal" style={{ color: style.text }}>
                      {val}%
                    </span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
