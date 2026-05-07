import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function Select({
  label,
  placeholder,
  value,
  onChange,
  options = [],
  error,
  required = false,
  className = '',
  fieldClassName = '',
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [openDirection, setOpenDirection] = useState('down') // 'down' | 'up'
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  const close = () => setIsOpen(false)

  const estimatedMenuMaxHeight = 240 // matches max-h-60
  const measureAndFlipIfNeeded = () => {
    if (typeof window === 'undefined') return
    const buttonEl = buttonRef.current
    if (!buttonEl) return
    const rect = buttonEl.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    // Prefer opening down, but flip up when cramped.
    if (spaceBelow < estimatedMenuMaxHeight && spaceAbove > spaceBelow) {
      setOpenDirection('up')
    } else {
      setOpenDirection('down')
    }
  }

  useEffect(() => {
    if (!isOpen) return
    measureAndFlipIfNeeded()

    const handleScrollOrResize = () => measureAndFlipIfNeeded()
    window.addEventListener('resize', handleScrollOrResize)
    // capture scroll so it works inside scroll containers too
    window.addEventListener('scroll', handleScrollOrResize, true)
    return () => {
      window.removeEventListener('resize', handleScrollOrResize)
      window.removeEventListener('scroll', handleScrollOrResize, true)
    }
  }, [isOpen])

  return (
    <div className={`flex flex-col gap-1.5 items-start relative w-full ${className}`}>
      {/* Label */}
      <div className="flex gap-0.5 items-start">
        <label className="text-l2-medium text-[#52525B]">
          {label}
        </label>
        {required && (
          <span className="text-l2-medium text-[#dc2626]">*</span>
        )}
      </div>

      {/* Select Field */}
      <div className="relative w-full">
        <button
          type="button"
          ref={buttonRef}
          onClick={() => setIsOpen((v) => !v)}
          className={`border rounded-md w-full flex items-center justify-between gap-2 px-3 py-2 ${
            error ? 'border-[#fca5a5]' : 'border-[#e4e4e7]'
          } ${fieldClassName || 'bg-base-background'}`}
          {...props}
        >
          <span className={`flex-1 text-left text-b2-regular ${
            value ? 'text-base-foreground' : 'text-base-muted-foreground'
          }`}>
            {value ? options.find(opt => opt.value === value)?.label || value : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-base-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-[55]"
              onClick={close}
            />
            <div
              ref={menuRef}
              className={`absolute z-[60] w-full bg-white border border-[#e4e4e7] rounded-md shadow-lg max-h-60 overflow-auto ${
                openDirection === 'up' ? 'bottom-full mb-1' : 'mt-1'
              }`}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange({ target: { value: option.value } })
                    close()
                  }}
                  className={`w-full text-left px-3 py-2 text-b2-regular hover:bg-slate-50 transition-colors ${
                    value === option.value ? 'bg-slate-50 font-medium' : 'text-base-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-l2-regular text-[#dc2626]">
          {error}
        </p>
      )}
    </div>
  )
}

