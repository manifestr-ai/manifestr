import { useState, useRef, useCallback } from 'react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const Y_LABELS = ['$500', '$400', '$300', '$200', '$100', '$0']
const CPS_DATA = [120, 140, 130, 155, 145, 160, 150, 170, 165, 175, 168, 180]
const CPP_DATA = [280, 320, 300, 350, 340, 360, 345, 380, 370, 390, 375, 400]
const LEGEND = [
  { label: 'CPS (Cost per Signup)', color: '#18181b' },
  { label: 'CPP (Cost per Paid)', color: '#a1a1aa' },
]

function toPath(dataArr, max, width, height) {
  const step = width / (dataArr.length - 1)
  return dataArr.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * step},${height - (v / max) * height}`).join(' ')
}

export default function CpsCppTrend({ data }) {
  const W = 460
  const H = 160
  const months = data?.months || MONTHS
  const yLabels = data?.yLabels || Y_LABELS
  const cpsData = data?.cpsData || CPS_DATA
  const cppData = data?.cppData || CPP_DATA
  const maxValue = data?.max || 500
  const title = data?.title || 'CPS vs CPP'
  const legend = data?.legend || LEGEND

  const [hoverIdx, setHoverIdx] = useState(null)
  const svgRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = x / rect.width
    const idx = Math.round(pct * (months.length - 1))
    setHoverIdx(Math.max(0, Math.min(idx, months.length - 1)))
  }, [months.length])

  const step = W / (months.length - 1)

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="relative">
        <div className="flex">
          <div className="flex flex-col justify-between h-[160px] pr-2 shrink-0">
            {yLabels.map((l) => (
              <span key={l} className="text-[12px] leading-[18px] font-medium text-[#40444e] tracking-[0.06px]">{l}</span>
            ))}
          </div>

          <div className="flex-1 min-w-0 relative">
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
              className="w-full h-[160px] cursor-crosshair" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverIdx(null)}>
              {yLabels.map((_, i) => (
                <line key={i} x1={0} y1={(i / (yLabels.length - 1)) * H} x2={W} y2={(i / (yLabels.length - 1)) * H} stroke="#e4e4e7" strokeWidth={1} />
              ))}

              <path d={toPath(cpsData, maxValue, W, H)} fill="none" stroke="#18181b" strokeWidth={2} />
              <path d={toPath(cppData, maxValue, W, H)} fill="none" stroke="#a1a1aa" strokeWidth={2} />

              {hoverIdx !== null && (
                <>
                  <line x1={hoverIdx * step} y1={0} x2={hoverIdx * step} y2={H} stroke="#71717a" strokeWidth={1} strokeDasharray="4 4" />
                  <circle cx={hoverIdx * step} cy={H - (cpsData[hoverIdx] / maxValue) * H} r={4} fill="#18181b" stroke="white" strokeWidth={2} />
                  <circle cx={hoverIdx * step} cy={H - (cppData[hoverIdx] / maxValue) * H} r={4} fill="#a1a1aa" stroke="white" strokeWidth={2} />
                </>
              )}
            </svg>

            {hoverIdx !== null && (
              <div className="absolute top-0 z-10 pointer-events-none" style={{ left: `${(hoverIdx / (months.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}>
                <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded-lg px-3 py-2 flex items-center gap-4 shadow-sm whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#18181b]" />
                    <span className="text-[12px] font-medium text-[#18181b]">CPS ${cpsData[hoverIdx]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#a1a1aa]" />
                    <span className="text-[12px] font-medium text-[#52525b]">CPP ${cppData[hoverIdx]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pl-10 mt-1">
          {months.map((m, i) => (
            <span key={m} className={`text-[12px] leading-[18px] font-medium tracking-[0.06px] ${hoverIdx === i ? 'text-[#18181b] font-semibold' : 'text-[#40444e]'}`}>{m}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[12px] leading-[18px] font-normal text-[#52525b]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
