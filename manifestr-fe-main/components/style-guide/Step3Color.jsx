import { useState } from 'react'
import { motion } from 'framer-motion'
import { Folder, Type, Palette, Grid, FileText, Plus, ArrowRight, X, Pencil } from 'lucide-react'
import Button from '../ui/Button'

export default function StyleGuideStep3Color({ data, updateData, onBack, onNext, onSaveExit }) {
  // Defaults
  const defaultPrimaryCallback = () => [
    { id: 1, hex: '#E0E7FF' },
    { id: 2, hex: '#C7D2FE' },
    { id: 3, hex: '#818CF8' },
    { id: 4, hex: '#4338CA' },
    { id: 5, hex: '#3730A3' },
  ]
  const defaultSecondaryCallback = () => [
    { id: 1, hex: '#FEF3C7' },
    { id: 2, hex: '#FDE68A' },
    { id: 3, hex: '#FBBF24' },
    { id: 4, hex: '#92400E' },
    { id: 5, hex: '#78350F' },
  ]
  const defaultOtherCallback = () => [
    { id: 1, hex: '#FEF3EB' },
    { id: 2, hex: '#FFDAC2' },
    { id: 3, hex: '#F17B2C' },
    { id: 4, hex: '#C2540A' },
    { id: 5, hex: '#6E330C' },
  ]

  // Initialize if empty, but we can't easily write back in render. 
  // We'll just derive. If saving to API, we'll need to make sure these exist.
  // Actually, let's treat data.colors as the source of truth.
  // We need to handle if data.colors.primary is undefined.

  const primaryColors = data?.colors?.primary || defaultPrimaryCallback()
  const secondaryColors = data?.colors?.secondary || defaultSecondaryCallback()
  const otherColors = data?.colors?.other || defaultOtherCallback()

  const colorNames = data?.colors?.names || {}
  const primaryTitle = colorNames.primary || 'Primary Colors'
  const secondaryTitle = colorNames.secondary || 'Secondary Colors'
  const otherTitle = colorNames.other || 'Others'

  const steps = [
    {
      id: 1,
      label: 'Logo',
      icon: (props) => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
          <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      active: false
    },
    { id: 2, label: 'Typography', icon: Type, active: false },
    { id: 3, label: 'Color', icon: Palette, active: true },
    { id: 4, label: 'Style', icon: Grid, active: false },
    { id: 5, label: 'Review & Apply', icon: FileText, active: false },
  ]

  const updateColorCategory = (category, newColors) => {
    updateData({
      colors: {
        ...(data?.colors || {}),
        [category]: newColors
      }
    })
  }

  const updateColorNames = (category, name) => {
    updateData({
      colors: {
        ...(data?.colors || {}),
        names: {
          ...(data?.colors?.names || {}),
          [category]: name
        }
      }
    })
  }

  const removeColor = (category, id) => {
    const current = category === 'primary' ? primaryColors : category === 'secondary' ? secondaryColors : otherColors
    const updated = current.filter((color) => color.id !== id)
    updateColorCategory(category, updated)
  }

  const addColor = (category, currentColors, hex) => {
    const newId = Math.max(...currentColors.map((c) => c.id), 0) + 1
    const newHex = hex || '#000000'
    const updated = [...currentColors, { id: newId, hex: newHex }]
    updateColorCategory(category, updated)
  }

  const updateColorHex = (category, id, hex) => {
    const current = category === 'primary' ? primaryColors : category === 'secondary' ? secondaryColors : otherColors
    const updated = current.map((color) => (color.id === id ? { ...color, hex } : color))
    updateColorCategory(category, updated)
  }

  const ColorSwatch = ({ color, onRemove, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [tempHex, setTempHex] = useState(color.hex)

    const handleHexChange = (e) => {
      const value = e.target.value
      setTempHex(value)
      if (/^#[0-9A-Fa-f]{0,6}$/.test(value) && value.length === 7) {
        onUpdate(value)
      }
    }

    const displayHex = String(color.hex || '').toUpperCase()

    return (
      <div className="flex w-28 shrink-0 flex-col items-center">
        {/* Figma 9258:3483 — 112×112 hit area, 96×96 swatch, 12px radius, remove 32px @ top -3 right 4 */}
        <div className="relative h-28 w-28 shrink-0 rounded-lg p-2">
          <button
            type="button"
            className="relative mx-auto block size-24 shrink-0 rounded-xl border border-[#e4e4e7] shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2"
            style={{ backgroundColor: color.hex }}
            aria-label={`Edit color ${displayHex}`}
            onClick={() => {
              setTempHex(color.hex)
              setIsEditing(true)
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute -top-[3px] right-1 z-10 flex size-8 items-center justify-center rounded-full bg-[var(--base-muted,#f4f4f5)] p-2 text-[#18181b] transition-colors hover:opacity-90"
            aria-label={`Remove ${displayHex}`}
          >
            <X className="size-4 shrink-0" strokeWidth={2} />
          </button>
        </div>
        <div className="mt-1 flex min-h-10 w-[92px] shrink-0 items-center justify-center px-0.5">
          {isEditing ? (
            <input
              type="text"
              value={tempHex}
              onChange={handleHexChange}
              onBlur={() => {
                setIsEditing(false)
                onUpdate(tempHex)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditing(false)
                  onUpdate(tempHex)
                }
                if (e.key === 'Escape') {
                  setTempHex(color.hex)
                  setIsEditing(false)
                }
              }}
              className="w-full border-0 bg-transparent px-0 py-0.5 text-center text-[14px] font-normal leading-5 text-[color:var(--base-foreground,#18181b)] shadow-none outline-none ring-0 focus:ring-0 [font-family:var(--typography-font-family-font-sans,Inter)]"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setTempHex(color.hex)
                setIsEditing(true)
              }}
              className="w-full border-0 bg-transparent p-0 text-center text-[14px] font-normal leading-5 text-[color:var(--base-foreground,#18181b)] shadow-none outline-none transition-opacity hover:opacity-80 focus-visible:underline [font-family:var(--typography-font-family-font-sans,Inter)]"
            >
              <span className="block truncate uppercase">{displayHex}</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  const ColorCard = ({ title, category, colors }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [tempTitle, setTempTitle] = useState(title)
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [newHex, setNewHex] = useState('#000000')

    const openAddFlow = () => {
      setNewHex('#000000')
      setIsAddingNew(true)
    }

    const confirmAdd = () => {
      const raw = String(newHex || '').trim()
      const normalized = raw.startsWith('#') ? raw : `#${raw}`
      if (/^#[0-9A-Fa-f]{6}$/.test(normalized)) {
        addColor(category, colors, normalized)
        setIsAddingNew(false)
      }
    }

    return (
      <div
        className="mb-6 w-full rounded-xl border border-[#e4e4e7] bg-[var(--base-background,#FFF)] shadow-none"
        data-figma-node="9258:3464"
      >
        <div className="flex flex-col gap-6 p-6">
          {/* Header — Figma 9258:3466 */}
          <div className="flex w-full flex-wrap items-center gap-6">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={() => {
                    setIsEditingTitle(false)
                    updateColorNames(category, tempTitle || title)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingTitle(false)
                      updateColorNames(category, tempTitle || title)
                    }
                  }}
                  className="min-w-0 flex-1 border-b border-[#e4e4e7] bg-transparent text-[20px] font-semibold leading-[30px] text-[color:var(--base-foreground,#18181b)] focus:border-[#18181b] focus:outline-none [font-family:var(--typography-font-family-font-sans,Inter)]"
                  autoFocus
                />
              ) : (
                <h3 className="whitespace-nowrap text-[20px] font-semibold leading-[30px] text-[color:var(--base-foreground,#18181b)] [font-family:var(--typography-font-family-font-sans,Inter)]">
                  {title}
                </h3>
              )}
              <button
                type="button"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-[var(--base-background,#FFF)] text-[#18181b] transition-colors hover:bg-[var(--base-muted,#f4f4f5)]"
                aria-label="Edit section title"
                onClick={() => {
                  setTempTitle(title)
                  setIsEditingTitle(true)
                }}
              >
                <Pencil className="size-4" strokeWidth={1.75} />
              </button>
            </div>
            <button
              type="button"
              onClick={openAddFlow}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md bg-[#18181b] px-3 py-2 text-[14px] font-medium leading-5 text-white transition-opacity hover:opacity-90 [font-family:var(--typography-font-family-font-sans,Inter)]"
            >
              <Plus className="size-4 shrink-0 text-white" strokeWidth={2} />
              Add new
            </button>
          </div>

          {/* Swatches row — Figma 9258:3482 gap 48px */}
          <div className="flex flex-wrap items-start gap-12">
            {colors.map((color) => (
              <ColorSwatch
                key={color.id}
                color={color}
                onRemove={() => removeColor(category, color.id)}
                onUpdate={(hex) => updateColorHex(category, color.id, hex)}
              />
            ))}

            {/* Add-new tile — Figma 9258:3568 (96×96, solid border, +16); column offset pt-2 for alignment */}
            <div className="flex w-24 shrink-0 flex-col items-center pt-2">
              <button
                type="button"
                onClick={openAddFlow}
                className="flex size-24 shrink-0 items-center justify-center rounded-md border border-[#e4e4e7] bg-[var(--base-background,#FFF)] text-[#18181b] transition-colors hover:bg-[var(--base-muted,#f4f4f5)]"
                aria-label="Add new color"
              >
                <Plus className="size-4 shrink-0" strokeWidth={2} />
              </button>
              <div className="mt-0 flex h-10 w-[92px] shrink-0 items-center justify-center">
                <span className="text-center text-[14px] font-medium leading-5 text-[color:var(--base-foreground,#18181b)] [font-family:var(--typography-font-family-font-sans,Inter)]">
                  Add new
                </span>
              </div>
            </div>

            {isAddingNew && (
              <div className="flex w-full basis-full flex-col gap-3 border-t border-[#e4e4e7] pt-4 sm:flex-row sm:items-center">
                <input
                  type="color"
                  value={/^#[0-9A-Fa-f]{6}$/i.test(newHex) ? newHex : '#000000'}
                  onChange={(e) => setNewHex(e.target.value)}
                  className="h-10 w-10 shrink-0 cursor-pointer rounded border border-[#e4e4e7] bg-white"
                  aria-label="Pick color"
                />
                <input
                  type="text"
                  value={newHex}
                  onChange={(e) => setNewHex(e.target.value)}
                  className="h-10 w-[140px] max-w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-[14px] leading-5 text-[color:var(--base-foreground,#18181b)] shadow-[0px_1px_1px_rgba(10,13,18,0.05)] focus:border-[#18181b] focus:outline-none [font-family:var(--typography-font-family-font-sans,Inter)]"
                  placeholder="#000000"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={confirmAdd}
                    className="h-9 rounded-md bg-[#18181b] px-3 text-[14px] font-medium leading-5 text-white hover:opacity-90 [font-family:var(--typography-font-family-font-sans,Inter)]"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="h-9 rounded-md border border-[#e4e4e7] bg-white px-3 text-[14px] font-medium leading-5 text-[#18181b] hover:bg-[#f4f4f5] [font-family:var(--typography-font-family-font-sans,Inter)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-72px)] pb-24" style={{ backgroundColor: 'rgba(242, 242, 247, 1)' }}>
      {/* Left sidebar — Figma 9509:11698 (MCP): 256px wide, px-16 pt-32, item gap 8px, 40px rows, 16/Semibold/24 */}
      <div className="hidden lg:flex lg:flex-col lg:items-start fixed top-[72px] left-0 w-[256px] h-[calc(100vh-72px)] box-border bg-[var(--base-background,#FFF)] border-r border-[color:var(--base-border,#E4E4E7)] z-40">
        <div className="w-full flex flex-col items-start px-4 pt-8 pb-8 shrink-0">
          <div className="flex flex-col gap-2 w-full min-w-0">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex w-full items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors border border-solid ${step.active
                    ? 'bg-[var(--base-muted,#f4f4f5)] border-[color:var(--base-border,#E4E4E7)]'
                    : 'bg-[var(--base-background,#FFF)] border-transparent hover:bg-[var(--base-muted,#f4f4f5)]'
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${step.active ? 'text-[color:var(--base-foreground,#18181b)]' : 'text-[color:var(--base-muted-foreground-plus,#52525b)]'}`}
                  />
                  <span
                    className={`text-base font-semibold leading-6 whitespace-nowrap ${step.active ? 'text-[color:var(--base-foreground,#18181b)]' : 'text-[color:var(--base-muted-foreground-plus,#52525b)]'}`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-0 lg:pl-[256px]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-8">
          <div className="mb-8 pt-[51px]">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
              <div>
                <h1 className="self-stretch text-[30px] leading-[38px] font-bold not-italic text-[color:var(--base-foreground,#18181B)] font-hero mb-2">
                  Color
                </h1>
                <p className="self-stretch text-[18px] leading-[28px] font-normal not-italic text-[color:var(--base-muted-foreground,#71717A)] [font-family:var(--typography-font-family-font-sans,Inter)]">
                  Define visual properties like shadows, border and spacing
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onBack}
                  className="flex-1 md:flex-none justify-center !bg-[#FFFFFF] !text-[#000000] border-[#e4e4e7] hover:!bg-[#FFFFFF] hover:!text-[#000000]"
                >
                  Skip
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onSaveExit}
                  className="flex-1 md:flex-none justify-center !bg-[#FFFFFF] !text-[#000000] border-[#e4e4e7] hover:!bg-[#FFFFFF] hover:!text-[#000000]"
                >
                  Save & Exit
                </Button>
                <Button variant="primary" size="md" onClick={onNext} className="flex-1 md:flex-none justify-center">
                  Continue To Style <ArrowRight className="w-4 h-4 ml-1 hidden md:inline" />
                </Button>
              </div>
            </div>
          </div>

          {/* Color Cards */}
          <div className="mt-16">
            <ColorCard
              title={primaryTitle}
              category="primary"
              colors={primaryColors}
            />

            <ColorCard
              title={secondaryTitle}
              category="secondary"
              colors={secondaryColors}
            />

            <ColorCard
              title={otherTitle}
              category="other"
              colors={otherColors}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="fixed bottom-0 left-0 lg:left-[256px] right-0 px-4 md:px-8 py-4 z-50"
        style={{ backgroundColor: 'rgba(242, 242, 247, 1)' }}
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="h-px bg-[#e4e4e7] mx-[5px] mb-4" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="text-[14px] leading-[20px] text-[#71717a]">
              Step 3 of 6 — Next up: Style
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="secondary"
                size="md"
                onClick={onBack}
                className="flex-1 md:flex-none justify-center !bg-[#FFFFFF] !text-[#000000] border-[#e4e4e7] hover:!bg-[#FFFFFF] hover:!text-[#000000]"
              >
                Skip
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={onBack}
                className="flex-1 md:flex-none justify-center !bg-[#FFFFFF] !text-[#000000] border-[#e4e4e7] hover:!bg-[#FFFFFF] hover:!text-[#000000]"
              >
                Back
              </Button>
              <Button variant="primary" size="md" onClick={onNext} className="flex-1 md:flex-none justify-center">
                Continue <ArrowRight className="w-4 h-4 ml-1 hidden md:inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
