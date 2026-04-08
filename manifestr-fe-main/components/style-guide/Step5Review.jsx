import { useState } from 'react'
import { motion } from 'framer-motion'
import { Folder, Type, Palette, Grid, FileText, Plus, ArrowRight, Check, Upload, Download, FileText as FileTextIcon, Share2, X, Share } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Select from '../forms/Select'

export default function StyleGuideStep5Review({ data, updateData, onBack, onNext, isSubmitting, isEditMode = false }) {
  // Derive state from props
  const selectedColors = data?.colors?.selected || []
  const permittedBackgroundTypes = data?.backgrounds?.permitted || 'light-dark'
  const darkBackgroundUses = data?.backgrounds?.darkUses || 'white-reversed'
  const minimumContrastRatio = data?.backgrounds?.minContrast || ''
  const logoUsageRulesEnabled = data?.logoRules?.enabled ?? true
  const selectedToneDescriptors = data?.style?.toneDescriptors || []
  const selectedAudience = data?.style?.audience || []
  const brandPersonality = data?.style?.personality || ''
  const examplePhrases = data?.style?.examplePhrases || []
  const personas = data?.style?.personas || []
  const brandKitName = data?.brandKitName || 'Untitled Brand Kit'
  const uploadedLogos = data?.logos || []

  const defaultPrimaryColors = [
    { id: 1, hex: '#E0E7FF' },
    { id: 2, hex: '#C7D2FE' },
    { id: 3, hex: '#818CF8' },
    { id: 4, hex: '#4338CA' },
    { id: 5, hex: '#3730A3' },
  ]

  const defaultSecondaryColors = [
    { id: 1, hex: '#FEF3C7' },
    { id: 2, hex: '#FDE68A' },
    { id: 3, hex: '#FBBF24' },
    { id: 4, hex: '#92400E' },
    { id: 5, hex: '#78350F' },
  ]

  const defaultOtherColors = [
    { id: 1, hex: '#FEF3EB' },
    { id: 2, hex: '#FFDAC2' },
    { id: 3, hex: '#F17B2C' },
    { id: 4, hex: '#C2540A' },
    { id: 5, hex: '#6E330C' },
  ]

  const primaryColors = data?.colors?.primary || defaultPrimaryColors
  const secondaryColors = data?.colors?.secondary || defaultSecondaryColors
  const otherColors = data?.colors?.other || defaultOtherColors
  const customColors = data?.colors?.custom || []

  const rawSelectedPrimaryColorKeys = data?.colors?.primarySelected || []

  const defaultSelectedPrimaryKeys = primaryColors.map((color, index) =>
    `primary-${color.id || color.hex || index}`
  )

  const hasExplicitPrimarySelection = rawSelectedPrimaryColorKeys.length > 0

  const selectedPrimaryColorKeys = hasExplicitPrimarySelection
    ? rawSelectedPrimaryColorKeys
    : defaultSelectedPrimaryKeys

  const presetBackgroundColors = [
    { id: 'white', label: 'White', hex: '#ffffff' },
    { id: 'light-gray', label: 'Light Gray', hex: '#f4f4f5' },
    { id: 'gray', label: 'Gray', hex: '#71717a' },
    { id: 'black', label: 'Black', hex: '#18181b' },
  ]

  const toneDescriptors = [
    'Professional',
    'Bold',
    'Innovative',
    'Sophisticated',
    'Empathetic',
    'Friendly',
    'Playful',
    'Confident',
    'Minimalist',
    'Disruptive',
    'Luxe',
  ]

  const audienceTypes = [
    'B2B / Corporate',
    'Consumer / Lifestyle',
    'Creative / Cultural',
    'Technical / Executive-level',
    'Startup / Entrepreneurial',
  ]

  const typographyStyles = Array.isArray(data?.typography) ? data.typography : []
  const primaryTypeface = typographyStyles[0]?.font || 'Inter'
  const bodyStyle =
    typographyStyles.find(
      (style) => typeof style.name === 'string' && style.name.toLowerCase().includes('body')
    ) || typographyStyles[0]
  const bodyDescription = bodyStyle
    ? `${bodyStyle.font || primaryTypeface} for body text`
    : 'Inter for body text'

  const allPaletteColors = [
    ...primaryColors.map((color) => ({ ...color, role: 'primary' })),
    ...secondaryColors.map((color) => ({ ...color, role: 'secondary' })),
    ...otherColors.map((color) => ({ ...color, role: 'other' })),
  ]

  const selectedPrimaryColors = selectedPrimaryColorKeys
    .map((key) => {
      return allPaletteColors.find((color, index) => {
        const colorKey = `${color.role}-${color.id || color.hex || index}`
        return colorKey === key
      })
    })
    .filter(Boolean)

  const primaryAudiencePreview = selectedAudience.join(', ')

  const [isAddingColor, setIsAddingColor] = useState(false)
  const [customColor, setCustomColor] = useState('#000000')

  const completionStatus = {
    brandKitName: !!brandKitName,
    logoUpload: uploadedLogos.length > 0,
    logoConfirmed: uploadedLogos.length > 0,
    typography: typographyStyles.length > 0,
    colorPalette: (data?.colors?.primary?.length > 0 || selectedColors.length > 0),
    brandVoice: (selectedToneDescriptors.length > 0 || !!brandPersonality),
  }

  const completionPercentage = Math.round(
    (Object.values(completionStatus).filter(Boolean).length / Object.keys(completionStatus).length) * 100
  )

  const steps = [
    { id: 1, label: 'Logo', icon: Folder, active: false },
    { id: 2, label: 'Typography', icon: Type, active: false },
    { id: 3, label: 'Color', icon: Palette, active: false },
    { id: 4, label: 'Style', icon: Grid, active: false },
    { id: 5, label: 'Review & Apply', icon: FileText, active: true },
  ]

  // Helpers to update data if review allows editing
  // For brevity, I'll allow some edits (like background/visibility) as they were in the original file, 
  // but many sections like Style/Voice are just display or have minimal edit controls in this view 
  // (unless we duplicate the edit logic from previous steps). 
  // Given the UI allows "Regenerate" etc, I'll keep the input fields for the ones that were present.

  const updateBackgrounds = (field, value) => updateData({ backgrounds: { ...data?.backgrounds, [field]: value } })
  const updateRules = (field, value) => updateData({ logoRules: { ...data?.logoRules, [field]: value } })
  const updateStyleInfo = (updates) => updateData({ style: { ...data?.style, ...updates } })

  const updateColors = (newSelected) =>
    updateData({
      colors: {
        ...(data?.colors || {}),
        selected: newSelected,
        custom: customColors,
      },
    })

  const togglePrimaryColorSelection = (key) => {
    const current = data?.colors?.primarySelected || []
    const exists = current.includes(key)
    const next = exists ? current.filter((value) => value !== key) : [...current, key]
    updateData({
      colors: {
        ...(data?.colors || {}),
        primarySelected: next,
      },
    })
  }

  const toggleToneDescriptor = (descriptor) => {
    const exists = selectedToneDescriptors.includes(descriptor)
    const next = exists
      ? selectedToneDescriptors.filter((item) => item !== descriptor)
      : selectedToneDescriptors.length < 3
        ? [...selectedToneDescriptors, descriptor]
        : selectedToneDescriptors
    updateStyleInfo({ toneDescriptors: next })
  }

  const toggleAudience = (audience) => {
    const exists = selectedAudience.includes(audience)
    const next = exists
      ? selectedAudience.filter((item) => item !== audience)
      : [...selectedAudience, audience]
    updateStyleInfo({ audience: next })
  }

  const addPersona = () => {
    const newId = Math.max(...personas.map((p) => p.id || 0), 0) + 1
    updateStyleInfo({
      personas: [...personas, { id: newId, title: '', summary: '' }],
    })
  }

  const removePersona = (id) => {
    updateStyleInfo({
      personas: personas.filter((p) => p.id !== id),
    })
  }

  const updatePersona = (id, field, value) => {
    updateStyleInfo({
      personas: personas.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    })
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
      <div className="pl-0 lg:pl-[240px] pr-0">
        <div className="w-full mx-auto px-4 md:px-8 pb-8">
          <div className="mb-8 pt-[51px]">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
              <div>
                <h1 className="text-[32px] md:text-[48px] font-bold leading-[40px] md:leading-[56px] tracking-[-0.96px] text-[#18181b] mb-2">
                  Review & Apply
                </h1>
                <p className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#71717a]">
                  Review your brand style guide and apply it to your workspace
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  className="flex-1 md:flex-none justify-center bg-[#fff]"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  className="flex-1 md:flex-none justify-center bg-[#fff]"
                >
                  Apply to Document
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={onNext}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none justify-center"
                >
                  {isSubmitting ? (isEditMode ? 'Saving...' : 'Applying...') : (isEditMode ? 'Save Changes' : 'Apply Workspace Default')}{' '}

                </Button>
              </div>
            </div>
          </div>

          <div className='flex'>
          {/* Content Cards */}
          <div className="space-y-6">
            {/* Logo Card */}
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                Logo
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                {uploadedLogos.length} logo(s) uploaded
              </p>

              <div className="space-y-4">
                {uploadedLogos.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-[#e4e4e7] rounded-lg">
                    <div>
                      <div className="text-[16px] font-medium text-[#18181b] mb-1">{file.name || 'Logo File'}</div>
                      <div className="text-[14px] text-[#71717a]">{((file.size || 0) / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                ))}
                {uploadedLogos.length === 0 && (
                  <div className="text-sm text-gray-500 italic">No logos uploaded.</div>
                )}
              </div>
            </Card>

            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                Approved Background Colors
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                Select or upload color swatches that your logo can be used against.
              </p>

              <div className="flex items-start gap-4 flex-wrap">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => {
                    updateColors(
                      selectedColors.includes('white')
                        ? selectedColors.filter((c) => c !== 'white')
                        : [...selectedColors, 'white']
                    )
                  }}
                >
                  <div className="relative w-16 h-16 rounded-lg bg-white border-2 border-[#e4e4e7] flex items-center justify-center">
                    {selectedColors.includes('white') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-[#18181b] rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[12px] leading-[16px] text-[#71717a]">White</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => {
                    updateColors(
                      selectedColors.includes('light-gray')
                        ? selectedColors.filter((c) => c !== 'light-gray')
                        : [...selectedColors, 'light-gray']
                    )
                  }}
                >
                  <div className="relative w-16 h-16 rounded-lg bg-[#f4f4f5] border-2 border-[#e4e4e7] flex items-center justify-center">
                    {selectedColors.includes('light-gray') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-[#18181b] rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[12px] leading-[16px] text-[#71717a]">Light Gray</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => {
                    updateColors(
                      selectedColors.includes('gray')
                        ? selectedColors.filter((c) => c !== 'gray')
                        : [...selectedColors, 'gray']
                    )
                  }}
                >
                  <div className="relative w-16 h-16 rounded-lg bg-[#71717a] border-2 border-[#e4e4e7] flex items-center justify-center">
                    {selectedColors.includes('gray') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-[#18181b]" />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[12px] leading-[16px] text-[#71717a]">Gray</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => {
                    updateColors(
                      selectedColors.includes('black')
                        ? selectedColors.filter((c) => c !== 'black')
                        : [...selectedColors, 'black']
                    )
                  }}
                >
                  <div className="relative w-16 h-16 rounded-lg bg-[#18181b] border-2 border-[#e4e4e7] flex items-center justify-center">
                    {selectedColors.includes('black') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-[#18181b]" />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[12px] leading-[16px] text-[#71717a]">Black</span>
                </motion.div>

                {customColors.map((color) => (
                  <motion.div
                    key={color}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => {
                      const isSelected = selectedColors.includes(color)
                      const newSelected = isSelected
                        ? selectedColors.filter((c) => c !== color)
                        : [...selectedColors, color]
                      updateColors(newSelected)
                    }}
                  >
                    <div
                      className="relative w-16 h-16 rounded-lg border-2 border-[#e4e4e7] flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          const newCustom = customColors.filter((c) => c !== color)
                          const newSelected = selectedColors.filter((c) => c !== color)
                          updateData({
                            colors: {
                              ...(data?.colors || {}),
                              selected: newSelected,
                              custom: newCustom,
                            },
                          })
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-[#e4e4e7] flex items-center justify-center text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {selectedColors.includes(color) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-[#18181b]" />
                        </motion.div>
                      )}
                    </div>
                    <span className="text-[12px] leading-[16px] text-[#71717a]">
                      {color}
                    </span>
                  </motion.div>
                ))}

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setIsAddingColor(true)
                  }}
                >
                  <div className="relative w-16 h-16 rounded-lg bg-white border-2 border-dashed border-[#e4e4e7] flex items-center justify-center hover:border-[#18181b] transition-colors">
                    <Plus className="w-6 h-6 text-[#71717a]" />
                  </div>
                  <span className="text-[12px] font-bold leading-[16px] text-[#71717a]">
                    Add Color
                  </span>
                </motion.div>
              </div>

              {isAddingColor && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-10 h-10 border border-[#e4e4e7] rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-[120px] px-3 py-2 border border-[#e4e4e7] rounded-md text-[14px] leading-[20px] text-[#18181b]"
                      placeholder="#000000"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (customColor) {
                          const newCustom = customColors.includes(customColor)
                            ? customColors
                            : [...customColors, customColor]
                          const newSelected = selectedColors.includes(customColor)
                            ? selectedColors
                            : [...selectedColors, customColor]
                          updateData({
                            colors: {
                              ...(data?.colors || {}),
                              selected: newSelected,
                              custom: newCustom,
                            },
                          })
                        }
                        setIsAddingColor(false)
                      }}
                      className="px-3 py-2 rounded-md bg-[#18181b] text-white text-[12px] leading-[18px] font-medium hover:opacity-90 cursor-pointer"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingColor(false)}
                      className="px-3 py-2 rounded-md border border-[#e4e4e7] text-[12px] leading-[18px] text-[#18181b] hover:bg-[#f4f4f5] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </Card>

            {/* Background & Visibility */}
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-6">
                Background & Visibility
              </h3>

              <div className="space-y-4">
                <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                <div>
                  <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                    Permitted Background Types
                  </label>
                  <Select
                    value={permittedBackgroundTypes}
                    onChange={(e) => updateBackgrounds('permitted', e.target.value)}
                    options={[
                      { value: 'light-dark', label: 'Light & Dark backgrounds' },
                      { value: 'light-only', label: 'Light backgrounds only' },
                      { value: 'dark-only', label: 'Dark backgrounds only' },
                    ]}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                    Dark Background Uses
                  </label>
                  <Select
                    value={darkBackgroundUses}
                    onChange={(e) => updateBackgrounds('darkUses', e.target.value)}
                    options={[
                      { value: 'white-reversed', label: 'White or Reversed Logo' },
                      { value: 'white-only', label: 'White Logo only' },
                      { value: 'reversed-only', label: 'Reversed Logo only' },
                    ]}
                    className="w-full"
                  />
                </div>
                </div>

                <div>
                  <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                    Minimum Contrast Ratio
                  </label>
                  <input
                    type="text"
                    value={minimumContrastRatio}
                    onChange={(e) => updateBackgrounds('minContrast', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                    placeholder="e.g., 4.5:1"
                  />
                </div>
              </div>
            </Card>

            {/* Advanced: Logo Usage Rules */}
            <Card className="bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                  Advanced: Logo Usage Rules
                </h3>
                <button
                  type="button"
                  onClick={() => updateRules('enabled', !logoUsageRulesEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${logoUsageRulesEnabled ? 'bg-[#18181b]' : 'bg-[#e4e4e7]'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${logoUsageRulesEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                    Color Palette
                  </h3>
                  <p className="text-[14px] leading-[20px] text-[#71717a]">
                    Select your primary brand colors ({selectedPrimaryColorKeys.length} selected)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {[
                  ...primaryColors.map((color) => ({ ...color, role: 'primary' })),
                  ...secondaryColors.map((color) => ({ ...color, role: 'secondary' })),
                  ...otherColors.map((color) => ({ ...color, role: 'other' })),
                ].map((color, index) => (
                  (() => {
                    const key = `${color.role}-${color.id || color.hex || index}`
                    const isSelected = selectedPrimaryColorKeys.includes(key)
                    return (
                  <div
                    key={key}
                    onClick={() => togglePrimaryColorSelection(key)}
                    className={`relative rounded-xl border bg-white overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)] cursor-pointer transition-colors ${
                      isSelected ? 'border-[#18181b]' : 'border-[#e4e4e7]'
                    }`}
                  >
                    <div
                      className="h-20 w-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white border border-[#e4e4e7] flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#18181b]" />
                      </div>
                    )}
                    <div className="px-3 py-2">
                      <div className="text-[13px] font-medium leading-[18px] text-[#18181b] truncate">
                        {color.name || color.label || color.hex}
                      </div>
                      <div className="text-[12px] leading-[16px] text-[#71717a]">
                        {color.hex}
                      </div>
                    </div>
                  </div>
                    )
                  })()
                ))}
              </div>

              <div className="mt-2 rounded-xl bg-[#f4f4f5] border border-[#e4e4e7] px-4 py-3">
                <div className="text-[13px] font-medium leading-[18px] text-[#18181b] mb-1">
                  Color Harmony Tips
                </div>
                <ul className="text-[12px] leading-[18px] text-[#71717a] space-y-1 list-disc pl-4">
                  <li>Use 3–5 colors for a balanced palette</li>
                  <li>Include at least one neutral color</li>
                  <li>Ensure sufficient contrast for accessibility</li>
                  <li>Consider color psychology for your industry</li>
                </ul>
              </div>
            </Card>

            {/* Style: Brand Voice & Personality */}
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-1">
                Style: Brand Voice & Personality
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                Define how your brand communicates and expresses itself.
              </p>

              <div className="space-y-8">
                {/* Tone Descriptors */}
                <div>
                  <div className="mb-2">
                    <div className="text-[16px] font-medium text-[#18181b]">
                      Select up to 3 core tone descriptors
                    </div>
                    <p className="text-[14px] leading-[20px] text-[#71717a]">
                      Words to describe how your brand "sounds" when speaking.{' '}
                      {selectedToneDescriptors.length > 0 && `${selectedToneDescriptors.length} selected.`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {toneDescriptors.map((descriptor) => {
                      const isSelected = selectedToneDescriptors.includes(descriptor)
                      return (
                        <motion.button
                          key={descriptor}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleToneDescriptor(descriptor)}
                          className={`px-4 py-2 rounded-full border text-[14px] font-medium transition-colors ${
                            isSelected
                              ? 'bg-[#18181b] text-white border-[#18181b]'
                              : 'bg-white text-[#18181b] border-[#e4e4e7]'
                          }`}
                        >
                          {descriptor}
                        </motion.button>
                      )
                    })}
                  </div>
                  <p className="text-[12px] leading-[16px] text-[#a1a1aa] mt-2">
                    e.g. These words make a clearer voice.
                  </p>
                </div>

                {/* Audience */}
                <div>
                  <div className="mb-2">
                    <div className="text-[16px] font-medium text-[#18181b]">
                      Who is your brand speaking to?
                    </div>
                    <p className="text-[14px] leading-[20px] text-[#71717a]">
                      This audience helps AI dial in a tone if there's overlap (e.g. B2B is more formal).
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {audienceTypes.map((audience) => {
                      const isSelected = selectedAudience.includes(audience)
                      return (
                        <motion.button
                          key={audience}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleAudience(audience)}
                          className={`px-4 py-2 rounded-full border text-[14px] font-medium transition-colors ${
                            isSelected
                              ? 'bg-[#18181b] text-white border-[#18181b]'
                              : 'bg-white text-[#18181b] border-[#e4e4e7]'
                          }`}
                        >
                          {audience}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Brand Personality */}
                <div>
                  <div className="mb-2">
                    <div className="text-[16px] font-medium text-[#18181b]">
                      Brand personality (1–2 sentences)
                    </div>
                    <p className="text-[14px] leading-[20px] text-[#71717a]">
                      Describe how this brand thinks and behaves at a high level. This helps AI align with the brand's core character.
                    </p>
                  </div>
                  <textarea
                    value={brandPersonality}
                    onChange={(e) => updateStyleInfo({ personality: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg text-[15px] leading-[22px] text-[#18181b] min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent"
                    placeholder="Describe your brand's personality in 1–2 sentences."
                  />
                </div>
              </div>
            </Card>

            {/* Primary Audience Personas */}
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                Primary audience personas
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                Add 1–2 personas you speak to most often.
              </p>

              <div className="space-y-4 mb-4">
                {personas.map((persona) => (
                  <div key={persona.id} className="relative group">
                    {personas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePersona(persona.id)}
                        className="absolute top-2 right-0 w-8 h-8 rounded-md bg-[#18181b] flex items-center justify-center text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10 md:pr-12">
                      <div>
                        <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                          Persona title
                        </label>
                        <input
                          type="text"
                          value={persona.title}
                          onChange={(e) => updatePersona(persona.id, 'title', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                          placeholder="CTO / Engineering Leader"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                          Persona summary
                        </label>
                        <textarea
                          value={persona.summary}
                          onChange={(e) => updatePersona(persona.id, 'summary', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b] resize-none"
                          placeholder="Enter your main text here..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {personas.length === 0 && (
                  <div className="text-[14px] leading-[20px] text-[#a1a1aa] italic">
                    No personas added yet.
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={addPersona}
                className="w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add persona
              </Button>
            </Card>
          </div>


          <div className="relative w-full h-auto xl:w-[360px] px-6 overflow-y-auto z-30 mb-24 xl:mb-0">
        <div className="space-y-6">
          {/* Live Preview */}
          <Card className="bg-white">
            <h3 className="text-[18px] font-semibold leading-[24px] text-[#18181b]">
              Live Preview
            </h3>
            <p className="text-[13px] leading-[18px] text-[#71717a] mb-4">
              Real-time brand application
            </p>
            <div className="space-y-5">
              <div>
                <div className="text-[12px] font-medium text-[#71717a] mb-1">Brand Kit Name</div>
                <div className="w-full px-3 py-2 rounded-lg bg-[#f4f4f5] text-[14px] leading-[20px] text-[#18181b]">
                  {brandKitName}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-medium text-[#71717a] mb-1">Logo</div>
                <div className="w-full border border-[#e4e4e7] rounded-lg bg-[#f9fafb] px-4 py-4 flex flex-col items-center justify-center text-center">
                  {uploadedLogos.length === 0 ? (
                    <>
                      <div className="text-[13px] leading-[18px] text-[#71717a] mb-3">
                        No logo uploaded
                      </div>
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center px-4 py-2 rounded-full bg-[#18181b] text-white text-[13px] leading-[18px] font-medium opacity-70 cursor-not-allowed"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Click to upload
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-[13px] leading-[18px] text-[#18181b] mb-1">
                        {uploadedLogos.length} logo{uploadedLogos.length > 1 ? 's' : ''} uploaded
                      </div>
                      <div className="text-[12px] leading-[16px] text-[#71717a]">
                        Manage uploads in the Logo step.
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-medium text-[#71717a] mb-1">Typography</div>
                <div className="space-y-2">
                  <div className="w-full px-3 py-2 rounded-lg bg-[#f4f4f5] text-[14px] leading-[20px] text-[#18181b]">
                    {primaryTypeface}
                  </div>
                  <div className="w-full px-3 py-2 rounded-lg bg-[#f4f4f5] text-[13px] leading-[18px] text-[#71717a]">
                    {bodyDescription}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[12px] font-medium text-[#71717a] mb-1">Color Palette</div>
                <div className="flex flex-wrap items-center gap-2">
                  {(selectedPrimaryColors.length > 0 ? selectedPrimaryColors : primaryColors)
                    .map((color, index) => (
                    <div
                      key={color.hex || index}
                      className="w-8 h-8 rounded-md border border-[#e4e4e7]"
                      style={{ backgroundColor: color.hex || color }}
                    />
                  ))}
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1 rounded-full border border-[#e4e4e7] text-[12px] leading-[18px] text-[#18181b] bg-white cursor-not-allowed"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[12px] font-medium text-[#71717a] mb-1">Brand Voice</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedToneDescriptors.map((descriptor) => (
                    <div
                      key={descriptor}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-[#18181b] text-white text-[12px] leading-[18px]"
                    >
                      <span>{descriptor}</span>
                      <span className="ml-2 w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                        ×
                      </span>
                    </div>
                  ))}
                  {selectedToneDescriptors.length === 0 && (
                    <span className="text-[12px] leading-[18px] text-[#a1a1aa]">
                      No tone selected
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                  disabled
                  value={brandPersonality}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] text-[13px] leading-[18px] text-[#71717a] cursor-not-allowed"
                    placeholder="Add brand voice"
                  />
                  <button
                    type="button"
                    disabled
                    className="px-3 py-2 rounded-lg bg-[#18181b] text-white text-[13px] leading-[18px] font-medium opacity-70 cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[12px] font-medium text-[#71717a] mb-1">Primary Audience</div>
                <div className="w-full px-3 py-2 rounded-lg bg-[#f4f4f5] text-[13px] leading-[18px] text-[#18181b]">
                  {primaryAudiencePreview || 'Not set'}
                </div>
              </div>
            </div>
          </Card>

          {/* Completion Status */}
          <Card className="bg-white">
            <h3 className="text-[18px] font-semibold leading-[24px] text-[#18181b] mb-4">
              Completion Status
            </h3>
            <div className="mb-4">
              <div className="w-full bg-[#e4e4e7] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#22c55e] h-2 rounded-full transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="mt-2 text-[13px] leading-[18px] text-[#71717a]">
                {completionPercentage}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {completionStatus.brandKitName ? (
                  <Check className="w-4 h-4 text-[#16a34a]" />
                ) : (
                  <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                )}
                <span className="text-[14px] leading-[20px] text-[#18181b]">Brand Kit Name</span>
              </div>
              <div className="flex items-center gap-2">
                {completionStatus.logoUpload ? (
                  <Check className="w-4 h-4 text-[#16a34a]" />
                ) : (
                  <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                )}
                <span className="text-[14px] leading-[20px] text-[#18181b]">Logo Upload</span>
              </div>
              <div className="flex items-center gap-2">
                {completionStatus.logoConfirmed ? (
                  <Check className="w-4 h-4 text-[#16a34a]" />
                ) : (
                  <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                )}
                <span className="text-[14px] leading-[20px] text-[#18181b]">Logo Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                {completionStatus.typography ? (
                  <Check className="w-4 h-4 text-[#16a34a]" />
                ) : (
                  <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                )}
                <span className="text-[14px] leading-[20px] text-[#18181b]">Typography</span>
              </div>
              <div className="flex items-center gap-2">
                {completionStatus.colorPalette ? (
                  <Check className="w-4 h-4 text-[#16a34a]" />
                ) : (
                  <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                )}
                <span className="text-[14px] leading-[20px] text-[#18181b]">Color Palette</span>
              </div>
              <div className="flex items-center gap-2">
                {completionStatus.brandVoice ? (
                  <Check className="w-4 h-4 text-[#16a34a]" />
                ) : (
                  <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                )}
                <span className="text-[14px] leading-[20px] text-[#18181b]">Brand Voice</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white">
            <h3 className="text-[18px] font-semibold leading-[24px] text-[#18181b] mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="primary" size="md" className="w-full justify-center">
                <FileTextIcon className="w-4 h-4 mr-2" />
                Export as PDF
              </Button>
              <Button variant="primary" size="md" className="w-full justify-center">
                <Download className="w-4 h-4 mr-2" />
                Download Assets
              </Button>
              <Button variant="primary" size="md" className="w-full justify-center">
                <Share2 className="w-4 h-4 mr-2" />
                Generate Guidelines
              </Button>
            </div>
          </Card>
        </div>
      </div>

          </div>
        </div>
      </div>

      {/* Right Sidebar - Stacked on mobile, Fixed on XL */}
      

      {/* Footer */}
      <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 bg-white border-t border-[#e4e4e7] px-4 md:px-8 py-4 z-50">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="text-[14px] leading-[20px] text-[#71717a]">
            Step 5 of 5 - Review
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary" size="md" onClick={onBack} disabled={isSubmitting} className="flex-1 md:flex-none justify-center">
              Back
            </Button>
            <Button variant="primary" size="md" onClick={onNext} disabled={isSubmitting} className="flex-1 md:flex-none justify-center">
              {isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Brand Kit')} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
