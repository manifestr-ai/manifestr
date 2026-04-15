import { Check } from 'lucide-react'

export default function ToggleCheckBoxTwo({
  label,
  checked = false,
  onChange,
  className = '',
}) {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onChange) {
      onChange({ target: { checked: !checked } })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group bg-transparent border-none flex gap-2 h-8 items-center px-0 py-0 rounded transition-all cursor-pointer select-none ${className}`}
    >
      <span className="relative flex items-center justify-center shrink-0">
        <span
          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all
            ${checked ? 'bg-[#18181b] border-[#18181b]' : 'bg-white border-[#e4e4e7] group-hover:border-[#bdbdbd]'}
          `}
        >
          {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </span>
      </span>
      {label && (
        <span
          className="text-[14px] font-medium leading-[20px] text-[color:var(--base-muted-foreground,#52525B)] font-inter"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {label}
        </span>
   
      )}
    </button>
  )
}

