import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Folder, Type, Palette, Grid, FileText, Plus, ArrowRight, Check, ChevronDown, X } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Select from '../forms/Select'
import LogoUploadZone from './LogoUploadZone'
import { useToast } from '../ui/Toast'
import { STYLE_GUIDE_HERO_BANNER_URL } from '../../lib/styleGuideHeroBanner'

export default function StyleGuideStep1Logo({ data, updateData, onBack, onNext, onSaveExit }) {
  const { error: showError } = useToast()
  // Use data from props or fallbacks
  const brandKitName = data?.brandKitName || ''
  const uploadedFiles = data?.logos || []
  const selectedColors = data?.colors?.selected || ['white', 'black']
  const customColors = data?.colors?.custom || []
  const permittedBackgroundTypes = data?.backgrounds?.permitted || 'light-dark'
  const darkBackgroundUses = data?.backgrounds?.darkUses || 'white-reversed'
  const minimumContrastRatio = data?.backgrounds?.minContrast || ''
  const logoUsageRulesEnabled = data?.logoRules?.enabled ?? true
  const minimumSize = data?.logoRules?.minSize || '24px'
  const maximumSize = data?.logoRules?.maxSize || '96px'
  const clearSpace = data?.logoRules?.clearSpace || '4'
  const scalingRule = data?.logoRules?.scaling || 'maintain-aspect-ratio'
  const defaultPlacementZone = data?.logoRules?.placement || 'Top-left'
  const allowAlternatePlacement = data?.logoRules?.allowAlternate || false

  const [isAddingColor, setIsAddingColor] = useState(false)
  const [customColor, setCustomColor] = useState('#18181b')
  const logoUploadZoneRef = useRef(null)

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
      active: true
    },
    { id: 2, label: 'Typography', icon: Type, active: false },
    { id: 3, label: 'Color', icon: Palette, active: false },
    { id: 4, label: 'Style', icon: Grid, active: false },
    { id: 5, label: 'Review & Apply', icon: FileText, active: false },
  ]

  const handleFilesChange = async (files) => {
    // Process new files
    // In a real flow, we might upload immediately or wait.
    // Let's upload immediately here to get the URLs.

    const newFiles = []

    // Import upload services
    try {
      const { getPresignedUrl, uploadToS3 } = await import('../../services/uploads')

      for (const fileItem of files) {
        if (fileItem.file) { // Assuming fileItem has a 'file' object from dropzone
          const file = fileItem.file
          // 1. Get Presigned URL
          const folderPath = 'style-guides/logos'
          const { uploadUrl, fileKey } = await getPresignedUrl(file.name, file.type, folderPath)

          // 2. Upload to S3
          await uploadToS3(uploadUrl, file)

          // 3. Store result
          // We can reconstruct the URL if needed later, or store it now.
          // Public URL: https://bucket.s3.region.amazonaws.com/key
          // Ideally backend returns full URL or we know the bucket domain.
          // For now, let's store fileKey and construct URL or store a flag.
          // Or just store the file metadata.

          newFiles.push({
            ...fileItem,
            fileKey: fileKey,
            uploaded: true,
            url: uploadUrl.split('?')[0] // Approximation of public URL
          })
        } else {
          newFiles.push(fileItem)
        }
      }

      // Update parent state
      updateData((prev) => ({
        ...prev,
        logos: [...(prev.logos ?? []), ...newFiles],
      }))

    } catch (err) {
      // Fallback: just store local preview/file if upload fails, or show error
      showError("Failed to upload logo. Please try again.")
    }
  }

  // Update handlers
  const updateField = (field, value) => updateData({ [field]: value })

  const updateColors = (newSelected) =>
    updateData({
      colors: {
        ...(data?.colors || {}),
        selected: newSelected,
      },
    })

  const updateCustomColors = (newCustom) =>
    updateData({
      colors: {
        ...(data?.colors || {}),
        custom: newCustom,
      },
    })

  const updateBackgrounds = (field, value) =>
    updateData({
      backgrounds: {
        ...(data?.backgrounds || {}),
        [field]: value,
      },
    })

  const updateRules = (field, value) =>
    updateData({
      logoRules: {
        ...(data?.logoRules || {}),
        [field]: value,
      },
    })


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
        {/* Full-width banner header */}
        <div>
          <div className="relative w-full h-[160px] md:h-[199px] overflow-hidden">
            <img
              src={STYLE_GUIDE_HERO_BANNER_URL}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            <div className="relative z-10 flex h-full items-center px-4 md:px-[30px]">
              <h1 className="text-[32px] md:text-[48px] font-bold leading-[40px] md:leading-[56px] tracking-[-0.96px] text-[#18181b]">
                CREATE A{' '}
                <span className="italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                  style guide
                </span>
              </h1>
            </div>
          </div>
          <div className="w-full h-px bg-[#e4e4e7]" />
        </div>

        {/* Content width container */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">

          {/* Let's get started Section */}
          <div className="mb-12 mt-5 md:mt-14">
            <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4 md:gap-0">
              <div>
                <h2 className="text-[20px] md:text-[24px] font-semibold leading-[28px] md:leading-[32px] text-[#18181b] mb-2">
                  Let's get started
                </h2>
                <p className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#71717a]">
                  Ready to build your style guide? Let's start with the essentials.
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
                  Continue to Typography <ArrowRight className="w-4 h-4 ml-1 hidden md:inline" />
                </Button>
              </div>
            </div>
          </div>

          {/* Brand Kit Name Section */}
          <Card className="mb-6 bg-white">
            <h3 className="text-[18px] md:text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
              Brand Kit Name
            </h3>
            <p className="text-[14px] leading-[20px] text-[#71717a] mb-4">
              What would you like to call this brand kit? This will help you identify this kit when applying it to documents or workspaces.
            </p>
            <input
              type="text"
              value={brandKitName}
              onChange={(e) => updateField('brandKitName', e.target.value)}
              className="w-full max-w-[600px] px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
              placeholder="Enter brand kit name"
            />
          </Card>

          {/* Upload Logos Section */}
          <Card className="mb-6 bg-white">
            <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4 md:gap-0">
              <div>
                <h3 className="text-[18px] md:text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                  Upload All Your Brand Logos
                </h3>
                <p className="text-[14px] leading-[20px] text-[#71717a]">
                  Upload your logo files, including all variations and formats, to keep them organized by type.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                type="button"
                onClick={() => logoUploadZoneRef.current?.openFilePicker()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add new
              </Button>
            </div>

            {/* Upload Zone */}
            <div className="mt-6">
              <LogoUploadZone
                ref={logoUploadZoneRef}
                logos={uploadedFiles}
                onFilesAdded={handleFilesChange}
                onLogosChange={(next) => updateData({ logos: next })}
              />
            </div>
          </Card>

          {/* Approved Background Colors — Figma 9874:368896 */}
          <Card className="bg-white !p-6">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-[6px]">
                <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b]">
                  Approved Background Colors
                </h3>
                <p className="text-[18px] font-normal leading-[28px] text-[#71717a]">
                  Select or upload color swatches that your logo can be used against.
                </p>
              </div>

              {/* Color swatches: 80×80 tiles, 16px gap (Figma x-offset 96 − 80) */}
              <div className="flex items-start gap-4 flex-wrap min-h-[108px]">
                {/* White */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-20 flex-col items-center gap-3 cursor-pointer"
                  onClick={() => {
                    updateColors(
                      selectedColors.includes('white')
                        ? selectedColors.filter((c) => c !== 'white')
                        : [...selectedColors, 'white']
                    )
                  }}
                >
                  <div className="relative size-20 shrink-0 rounded-[12px] bg-white border border-black/10 flex items-center justify-center shadow-none">
                    {selectedColors.includes('white') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="size-6 bg-[#030213] rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[12px] font-normal leading-4 text-[#717182]">White</span>
                </motion.div>

                {/* Light Gray */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-20 flex-col items-center gap-3 cursor-pointer"
                  onClick={() => {
                    updateColors(
                      selectedColors.includes('light-gray')
                        ? selectedColors.filter((c) => c !== 'light-gray')
                        : [...selectedColors, 'light-gray']
                    )
                  }}
                >
                  <div className="relative size-20 shrink-0 rounded-[14px] bg-[#f5f5f5] border border-black/10 flex items-center justify-center">
                    {selectedColors.includes('light-gray') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="size-6 bg-[#030213] rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[12px] font-normal leading-4 text-[#717182]">Light Gray</span>
                </motion.div>

                {/* Gray */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-20 flex-col items-center gap-3 cursor-pointer"
                  onClick={() => {
                    updateColors(
                      selectedColors.includes('gray')
                        ? selectedColors.filter((c) => c !== 'gray')
                        : [...selectedColors, 'gray']
                    )
                  }}
                >
                  <div className="relative size-20 shrink-0 rounded-[12px] bg-[#e0e0e0] border border-transparent flex items-center justify-center">
                    {selectedColors.includes('gray') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="size-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-[#030213]" strokeWidth={2.5} />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[12px] font-normal leading-4 text-[#717182]">Gray</span>
                </motion.div>

                {/* Black */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-20 flex-col items-center gap-3 cursor-pointer"
                  onClick={() => {
                    updateColors(
                      selectedColors.includes('black')
                        ? selectedColors.filter((c) => c !== 'black')
                        : [...selectedColors, 'black']
                    )
                  }}
                >
                  <div className="relative size-20 shrink-0 rounded-[12px] bg-[#030213] border border-transparent flex items-center justify-center">
                    {selectedColors.includes('black') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="size-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-[#030213]" strokeWidth={2.5} />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[12px] font-normal leading-4 text-[#717182]">Black</span>
                </motion.div>

                {/* Custom Hex Colors */}
                {customColors.map((color) => (
                  <motion.div
                    key={color}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-20 flex-col items-center gap-3 cursor-pointer"
                    onClick={() => {
                      const isSelected = selectedColors.includes(color)
                      const newSelected = isSelected
                        ? selectedColors.filter((c) => c !== color)
                        : [...selectedColors, color]
                      updateColors(newSelected)
                    }}
                  >
                    <div
                      className="relative size-20 shrink-0 rounded-[12px] border border-black/10 flex items-center justify-center"
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
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-black/10 flex items-center justify-center text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {selectedColors.includes(color) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="size-6 bg-white rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-[#030213]" strokeWidth={2.5} />
                        </motion.div>
                      )}
                    </div>
                    <span className="text-[12px] font-normal leading-4 text-[#717182] max-w-[80px] truncate text-center">
                      {color}
                    </span>
                  </motion.div>
                ))}

                {/* Add Color */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-20 flex-col items-center gap-3 cursor-pointer"
                  onClick={() => {
                    setIsAddingColor(true)
                  }}
                >
                  <div className="relative size-20 shrink-0 rounded-[12px] bg-white border border-black/10 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-[#717182]" strokeWidth={2} />
                  </div>
                  <span className="text-[12px] font-normal leading-4 text-[#717182]">Add Color</span>
                </motion.div>
              </div>
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

          {/* Background & Visibility Section */}
          <Card className="mt-6 bg-white">
            <h3 className="text-[18px] md:text-[20px] font-semibold leading-[28px] text-[#18181b] mb-6">
              Background & Visibility
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] leading-[20px] font-bold text-[#18181b] mb-2">
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
                  <label className="block text-[14px] leading-[20px] font-bold text-[#18181b] mb-2">
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
                <label className="block text-[14px] leading-[20px] font-bold text-[#18181b] mb-2">
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

          {/* Advanced: Logo Usage Rules Section */}
          <Card className="mt-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] md:text-[20px] font-semibold leading-[28px] text-[#18181b]">
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

            {logoUsageRulesEnabled && (
              <div className="space-y-6">
                {/* Size & Spacing */}
                <div>
                  <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b] mb-4">
                    Size & Spacing
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Minimum Size */}
                    <div>
                      <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                        Minimum Size
                      </label>
                      <input
                        type="text"
                        value={minimumSize}
                        onChange={(e) => updateRules('minSize', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                        placeholder="24px"
                      />
                    </div>

                    {/* Maximum Size */}
                    <div>
                      <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                        Maximum Size
                      </label>
                      <input
                        type="text"
                        value={maximumSize}
                        onChange={(e) => updateRules('maxSize', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                        placeholder="96px"
                      />
                    </div>

                    {/* Clear Space */}
                    <div>
                      <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                        Clear Space (x logo height)
                      </label>
                      <input
                        type="text"
                        value={clearSpace}
                        onChange={(e) => updateRules('clearSpace', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                        placeholder="4"
                      />
                    </div>

                    {/* Scaling Rule */}
                    <div>
                      <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                        Scaling Rule
                      </label>
                      <Select
                        value={scalingRule}
                        onChange={(e) => updateRules('scaling', e.target.value)}
                        options={[
                          { value: 'maintain-aspect-ratio', label: 'Maintain aspect ratio' },
                          { value: 'allow-stretch', label: 'Allow stretch' },
                          { value: 'fixed-size', label: 'Fixed size' },
                        ]}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Placement */}
                <div>
                  <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b] mb-4">
                    Placement
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:items-end gap-4">
                    {/* Default Placement Zone */}
                    <div className="flex-1">
                      <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                        Default Placement Zone
                      </label>
                      <input
                        type="text"
                        value={defaultPlacementZone}
                        onChange={(e) => updateRules('placement', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                        placeholder="Top-left"
                      />
                    </div>

                    {/* Allow Alternate Placement */}
                    <div className="flex flex-col items-start gap-2">
                      <label className="text-[14px] leading-[20px] font-medium text-[#18181b]">
                        Allow Alternate Placement
                      </label>
                      <button
                        type="button"
                        onClick={() => updateRules('allowAlternate', !allowAlternatePlacement)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${allowAlternatePlacement ? 'bg-[#18181b]' : 'bg-[#e4e4e7]'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowAlternatePlacement ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
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
              Step 1 of 6 — Next up: Typography
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
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
