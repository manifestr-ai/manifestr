export default function RadioButton({
  label,
  value,
  checked = false,
  onChange,
  name,
  className = '',
}) {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onChange && !checked) {
      onChange({ target: { value } })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`bg-base-background border rounded-md flex gap-2 h-10 items-center justify-left px-3 py-2.5 transition-all cursor-pointer ${
        checked
          ? 'border-[#18181b]'
          : 'border-[#e4e4e7] hover:border-base-foreground'
      } ${className}`}
    >
      <div className={`w-4 h-4 border rounded-full flex items-center justify-center shrink-0 ${
        checked
          ? 'border-[#18181b]'
          : 'border-[#e4e4e7]'
      }`}>
        {checked && (
          <div className="w-2 h-2 bg-[#18181b] rounded-full" />
        )}
      </div>
      <span className={`text-l2-medium ${
        checked ? 'text-[#18181b] font-medium' : 'text-base-foreground'
      }`}>
        {label}
      </span>
    </button>
  )
}
