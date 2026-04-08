import { useState } from 'react'
import { motion } from 'framer-motion'
import { Folder, Type, Palette, Grid, FileText, Plus, ArrowRight, X, Pencil } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

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
    { id: 1, label: 'Logo', icon: Folder, active: false },
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

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative group">
          <div
            className="w-16 h-16 rounded-lg border-2 border-[#e4e4e7] cursor-pointer"
            style={{ backgroundColor: color.hex }}
            onClick={() => setIsEditing(true)}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-[#18181b] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
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
            }}
            className="w-20 px-2 py-1 text-[12px] text-center border border-[#e4e4e7] rounded focus:outline-none focus:ring-2 focus:ring-[#18181b]"
            autoFocus
          />
        ) : (
          <span className="text-[12px] leading-[16px] text-[#71717a]">{color.hex}</span>
        )}
      </div>
    )
  }

  const ColorCard = ({ title, category, colors }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [tempTitle, setTempTitle] = useState(title)
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [newHex, setNewHex] = useState('#000000')

    return (
      <Card className="bg-white mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
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
                className="text-[20px] font-semibold leading-[28px] text-[#18181b] bg-transparent border-b border-[#e4e4e7] focus:outline-none focus:border-[#18181b]"
                autoFocus
              />
            ) : (
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                {title}
              </h3>
            )}
            <Pencil
              className="w-4 h-4 text-[#71717a] cursor-pointer hover:text-[#18181b] transition-colors"
              onClick={() => {
                setTempTitle(title)
                setIsEditingTitle(true)
              }}
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setNewHex('#000000')
              setIsAddingNew(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add new
          </Button>
        </div>

        <div className="flex items-start gap-4 flex-wrap">
          {colors.map((color) => (
            <ColorSwatch
              key={color.id}
              color={color}
              onRemove={() => removeColor(category, color.id)}
              onUpdate={(hex) => updateColorHex(category, color.id, hex)}
            />
          ))}

          {/* Add new placeholder */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => {
              setNewHex('#000000')
              setIsAddingNew(true)
            }}
          >
            <div className="w-16 h-16 rounded-lg bg-white border-2 border-dashed border-[#e4e4e7] flex items-center justify-center hover:border-[#18181b] transition-colors">
              <Plus className="w-6 h-6 text-[#71717a]" />
            </div>
            <span className="text-[12px] leading-[16px] text-[#71717a]">Add new</span>
          </motion.div>

          {isAddingNew && (
            <div className="mt-4 flex items-center gap-3 w-full">
              <input
                type="color"
                value={newHex}
                onChange={(e) => setNewHex(e.target.value)}
                className="w-10 h-10 border border-[#e4e4e7] rounded cursor-pointer"
              />
              <input
                type="text"
                value={newHex}
                onChange={(e) => setNewHex(e.target.value)}
                className="w-[120px] px-3 py-2 border border-[#e4e4e7] rounded-md text-[14px] leading-[20px] text-[#18181b]"
                placeholder="#000000"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (newHex) {
                      addColor(category, colors, newHex)
                    }
                    setIsAddingNew(false)
                  }}
                  className="px-3 py-2 rounded-md bg-[#18181b] text-white text-[12px] leading-[18px] font-medium hover:opacity-90 cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-2 rounded-md border border-[#e4e4e7] text-[12px] leading-[18px] text-[#18181b] hover:bg-[#f4f4f5] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-[calc(100vh-72px)] pb-24" style={{ backgroundColor: 'rgba(242, 242, 247, 1)' }}>
      {/* Left Sidebar - Fixed */}
      <div className="hidden lg:block fixed top-[72px] left-0 w-[240px] h-[calc(100vh-72px)] bg-white border-r border-[#e4e4e7] py-8 z-40">
        <div className="px-8">
          <div className="space-y-2">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${step.active
                    ? 'bg-[#f4f4f5] border border-[#e4e4e7]'
                    : 'hover:bg-[#f4f4f5]'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${step.active ? 'text-[#18181b]' : 'text-[#71717a]'}`} />
                  <span
                    className={`text-[14px] leading-[20px] font-medium ${step.active ? 'text-[#18181b]' : 'text-[#71717a]'
                      }`}
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
      <div className="pl-0 lg:pl-[240px]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-8">
          <div className="mb-8 pt-[51px]">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
              <div>
                <h1 className="text-[32px] md:text-[48px] font-bold leading-[40px] md:leading-[56px] tracking-[-0.96px] text-[#18181b] mb-2">
                  Color
                </h1>
                <p className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#71717a]">
                  Define visual properties like shadows, border and spacing
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button variant="secondary" size="md" onClick={onBack} className="flex-1 md:flex-none justify-center">
                  Skip
                </Button>
                <Button variant="secondary" size="md" onClick={onSaveExit} className="flex-1 md:flex-none justify-center">
                  Save & Exit
                </Button>
                <Button variant="primary" size="md" onClick={onNext} className="flex-1 md:flex-none justify-center">
                  Continue <ArrowRight className="w-4 h-4 ml-1 hidden md:inline" />
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
      <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 bg-white border-t border-[#e4e4e7] px-4 md:px-8 py-4 z-50">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="text-[14px] leading-[20px] text-[#71717a]">
            Step 3 of 6 — Next up: Style
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary" size="md" onClick={onBack} className="flex-1 md:flex-none justify-center">
              Skip
            </Button>
            <Button variant="secondary" size="md" onClick={onBack} className="flex-1 md:flex-none justify-center">
              Back
            </Button>
            <Button variant="primary" size="md" onClick={onNext} className="flex-1 md:flex-none justify-center">
              Continue <ArrowRight className="w-4 h-4 ml-1 hidden md:inline" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
