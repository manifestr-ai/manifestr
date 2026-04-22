import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function MonetizationFilterButton({ label, options = [], defaultValue, stretch = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue || label)
  const ref = useRef(null)

  useEffect(() => {
    function handleOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  return (
    <div className={`relative z-300 min-w-0 ${stretch ? 'w-full lg:w-auto' : ''}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-10 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-4 py-2 text-[14px] font-medium leading-5 text-[#18181b] transition-colors hover:bg-[#f4f4f5] ${
          stretch ? 'w-full min-w-0 justify-between lg:w-auto' : ''
        }`}
      >
        {stretch ? (
          <span className="min-w-0 flex-1 truncate text-left">{selected}</span>
        ) : (
          selected
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
        />
      </button>

      {isOpen && options.length > 0 && (
        <div className="absolute right-0 top-full mt-1 z-400 min-w-[180px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-lg py-1">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setSelected(opt)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-[14px] leading-5 ${
                selected === opt
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#52525b] hover:bg-[#f4f4f5]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
