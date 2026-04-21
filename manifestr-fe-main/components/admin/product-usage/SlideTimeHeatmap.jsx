const DEFAULT_SLIDES = [1, 2, 3, 4, 5, 6, 7]

const DEFAULT_ROWS = [
  [28, 12, 28, 12, 24, 12, 24],
  [24, 18, 28, 18, 10, 10, 38],
  [28, 28, 24, 28, 18, 12, 18],
  [12, 12, 12, 12, 28, 24, 28],
  [38, 28, 18, 28, 28, 24, 28],
]

function bucketFor(value) {
  if (value == null) return 'empty'
  if (value >= 26) return 'darkest'
  if (value >= 20) return 'dark'
  if (value >= 15) return 'mid'
  return 'light'
}

const BUCKET_STYLES = {
  darkest: { bg: '#020617', color: '#ffffff' },
  dark: { bg: '#334155', color: '#ffffff' },
  mid: { bg: '#94a3b8', color: '#ffffff' },
  light: { bg: '#e2e8f0', color: '#18181b' },
  empty: { bg: '#ffffff', color: '#18181b' },
}

function formatValue(v) {
  if (v == null) return ''
  return typeof v === 'string' ? v : `${v}s`
}

export default function SlideTimeHeatmap({ data }) {
  const title = data?.title || 'Slide Time Heatmap'
  const slides = data?.slides || DEFAULT_SLIDES
  const rows = data?.rows || DEFAULT_ROWS

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6 w-full">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="w-full overflow-x-auto">
        <div className="min-w-full grid" style={{ gridTemplateColumns: `minmax(85px, 1fr) repeat(${slides.length}, minmax(85px, 1fr))` }}>
          <div className="h-12 px-4 flex items-center border-b border-[#e4e4e7]">
            <span className="text-[14px] leading-5 font-medium text-[#71717a]">Deck #</span>
          </div>
          {slides.map((s) => (
            <div key={`head-${s}`} className="h-12 px-4 flex items-center border-b border-[#e4e4e7]">
              <span className="text-[14px] leading-5 font-medium text-[#71717a]">{s}</span>
            </div>
          ))}

          {rows.map((row, rIdx) => (
            <div key={`row-${rIdx}`} className="contents">
              <div className="h-[52px] px-4 flex items-center border-b border-[#e4e4e7]">
                <span className="text-[14px] leading-5 font-medium text-[#18181b]">{rIdx + 1}</span>
              </div>
              {row.map((cell, cIdx) => {
                const bucket = bucketFor(cell)
                const style = BUCKET_STYLES[bucket]
                return (
                  <div
                    key={`cell-${rIdx}-${cIdx}`}
                    className="h-[52px] px-4 flex items-center border-b border-[#e4e4e7]"
                    style={{ backgroundColor: style.bg }}
                  >
                    <span className="text-[14px] leading-5 font-normal" style={{ color: style.color }}>
                      {formatValue(cell)}
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
