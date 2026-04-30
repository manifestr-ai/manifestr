import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Folder, Type, Palette, Grid, FileText, Plus, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react'
import Button from '../ui/Button'
import Select from '../forms/Select'

export default function StyleGuideStep2Typography({ data, updateData, onBack, onNext, onSaveExit }) {
  const defaultStyles = [
    { id: 1, name: 'Heading 1', font: 'Inter', fontSize: '62px', fontWeight: 'Bold', lineHeight: '62px', letterSpacing: '0' },
    { id: 2, name: 'Heading 2', font: 'Inter', fontSize: '48px', fontWeight: 'Bold', lineHeight: '48px', letterSpacing: '0' },
    { id: 3, name: 'Heading 3', font: 'Inter', fontSize: '34px', fontWeight: 'Bold', lineHeight: '34px', letterSpacing: '0' },
    { id: 4, name: 'Sub title 1', font: 'Inter', fontSize: '28px', fontWeight: 'Bold', lineHeight: '28px', letterSpacing: '0' },
    { id: 5, name: 'Sub title 2', font: 'Inter', fontSize: '20px', fontWeight: 'Bold', lineHeight: '20px', letterSpacing: '0' },
    { id: 6, name: 'Body 1', font: 'Inter', fontSize: '16px', fontWeight: 'Medium', lineHeight: '16px', letterSpacing: '0' },
    { id: 7, name: 'Body 1 - Bold', font: 'Inter', fontSize: '16px', fontWeight: 'SemiBold', lineHeight: '16px', letterSpacing: '0' },
    { id: 8, name: 'Body 2', font: 'Inter', fontSize: '16px', fontWeight: 'Medium', lineHeight: '16px', letterSpacing: '0' },
    { id: 9, name: 'Body 2 - Bold', font: 'Inter', fontSize: '16px', fontWeight: 'SemiBold', lineHeight: '16px', letterSpacing: '0' },
    { id: 10, name: 'Caption', font: 'Inter', fontSize: '14px', fontWeight: 'Medium', lineHeight: '14px', letterSpacing: '0' },
  ]

  // Use data from props or defaults. Handle case where typography might be the initial object structure.
  const typographyStyles = Array.isArray(data?.typography) ? data.typography : defaultStyles

  const nextStyleId = useMemo(() => {
    const ids = typographyStyles.map((s) => (typeof s?.id === 'number' ? s.id : 0))
    return (ids.length ? Math.max(...ids) : 0) + 1
  }, [typographyStyles])

  const [isAddFontOpen, setIsAddFontOpen] = useState(false)
  const [newStyleName, setNewStyleName] = useState('')
  const [newStyleFont, setNewStyleFont] = useState('Inter')
  const [newStyleFontSize, setNewStyleFontSize] = useState('16px')
  const [newStyleFontWeight, setNewStyleFontWeight] = useState('Regular')
  const [newStyleLineHeight, setNewStyleLineHeight] = useState('16px')
  const [newStyleLetterSpacing, setNewStyleLetterSpacing] = useState('0')

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
    { id: 2, label: 'Typography', icon: Type, active: true },
    { id: 3, label: 'Color', icon: Palette, active: false },
    { id: 4, label: 'Style', icon: Grid, active: false },
    { id: 5, label: 'Review & Apply', icon: FileText, active: false },
  ]

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
  ]

  const fontWeightOptions = [
    { value: 'Light', label: 'Light' },
    { value: 'Regular', label: 'Regular' },
    { value: 'Medium', label: 'Medium' },
    { value: 'SemiBold', label: 'SemiBold' },
    { value: 'Bold', label: 'Bold' },
    { value: 'ExtraBold', label: 'ExtraBold' },
  ]

  const updateStyle = (id, field, value) => {
    const newStyles = typographyStyles.map((style) => (style.id === id ? { ...style, [field]: value } : style))
    updateData({ typography: newStyles })
  }

  const adjustNumericValue = (rawValue, delta, withPx) => {
    const numeric = parseInt(String(rawValue || '').replace('px', ''), 10)
    const base = Number.isNaN(numeric) ? 0 : numeric
    const next = Math.max(0, base + delta)
    return withPx ? `${next}px` : String(next)
  }

  const bumpField = (id, field, delta) => {
    const style = typographyStyles.find((item) => item.id === id)
    if (!style) return
    const withPx = field === 'fontSize' || field === 'lineHeight'
    const nextValue = adjustNumericValue(style[field], delta, withPx)
    updateStyle(id, field, nextValue)
  }

  const rowHeights = [104, 88, 64, 64, 60, 60, 56, 56, 56, 48]

  const openAddFont = () => {
    setNewStyleName('')
    setNewStyleFont('Inter')
    setNewStyleFontSize('16px')
    setNewStyleFontWeight('Regular')
    setNewStyleLineHeight('16px')
    setNewStyleLetterSpacing('0')
    setIsAddFontOpen(true)
  }

  const confirmAddFont = () => {
    const trimmedName = String(newStyleName || '').trim()
    const name = trimmedName || `Custom style ${nextStyleId}`
    const newStyle = {
      id: nextStyleId,
      name,
      font: newStyleFont,
      fontSize: newStyleFontSize,
      fontWeight: newStyleFontWeight,
      lineHeight: newStyleLineHeight,
      letterSpacing: newStyleLetterSpacing,
    }
    updateData({ typography: [...typographyStyles, newStyle] })
    setIsAddFontOpen(false)
  }

  return (
    <div className="min-h-[calc(100vh-72px)] pb-24" style={{ backgroundColor: '#F4F4F5' }}>
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
                <h1 className="self-stretch text-[30px] leading-[38px] font-bold not-italic text-base-foreground font-hero mb-2">
                  Typography
                </h1>
                <p className="self-stretch text-[18px] leading-[28px] font-normal not-italic text-[color:var(--base-muted-foreground,#71717A)] [font-family:var(--typography-font-family-font-sans,Inter)]">
                  Establish a clear typographic hierarchy for your brand
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={onBack}
                  className="flex-1 md:flex-none justify-center !bg-[#FFFFFF] !text-[#000000] border-[#e4e4e7] hover:!bg-[#FFFFFF] hover:!text-[#000000]"
                >
                  Skip
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={onSaveExit}
                  className="flex-1 md:flex-none justify-center !bg-[#FFFFFF] !text-[#000000] border-[#e4e4e7] hover:!bg-[#FFFFFF] hover:!text-[#000000]"
                >
                  Save & Exit
                </Button>
                <Button variant="primary" size="md" type="button" onClick={onNext} className="flex-1 md:flex-none justify-center">
                  Continue to Color <ArrowRight className="w-4 h-4 ml-1 hidden md:inline" />
                </Button>
              </div>
            </div>
          </div>

          {/* Typography Table Card (Figma: 1120px, r=16, shadow) */}
          <div className="w-full flex justify-center mb-12">
            <div className="w-full max-w-[1120px]">
              <div className="bg-white rounded-[16px] shadow-[0px_4px_30px_rgba(26,28,33,0.05)] overflow-hidden">
                {/* Top action row */}
                <div className="px-[24px] py-[16px] border-b border-[#E0E2E7]">
                  <Button
                    variant="primary"
                    size="md"
                    className="!bg-[#18181b] !text-white hover:opacity-90 flex items-center !rounded-[6px] !h-[40px] px-4 py-2 !font-medium"
                    type="button"
                    onClick={openAddFont}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Font
                  </Button>
                </div>

                <div className="sg-typoGrid bg-white">
                  <div className="no-scrollbar overflow-x-auto">
                    <div className="min-w-[1120px]">
                      {/* Header */}
                      <div
                        className="grid"
                        style={{ gridTemplateColumns: '329px 150px 150px 151px 150px 190px' }}
                      >
                        <div className="sg-cellHeader text-left">Style</div>
                        <div className="sg-cellHeader text-left">font</div>
                        <div className="sg-cellHeader text-left">font-size</div>
                        <div className="sg-cellHeader text-left">font-weight</div>
                        <div className="sg-cellHeader text-left">line-height</div>
                        <div className="sg-cellHeader text-left">letter-spacing</div>
                      </div>

                      {/* Rows */}
                      {typographyStyles.map((style, index) => (
                        <div
                          key={style.id}
                          className="grid"
                          style={{
                            gridTemplateColumns: '329px 150px 150px 151px 150px 190px',
                            height: rowHeights[index] || 56,
                          }}
                        >
                          <div className="sg-cellStyle flex items-center">
                            <div
                              style={{
                                fontFamily: style.font,
                                fontSize: style.fontSize,
                                fontWeight:
                                  style.fontWeight === 'Bold'
                                    ? '700'
                                    : style.fontWeight === 'SemiBold'
                                      ? '600'
                                      : style.fontWeight === 'Medium'
                                        ? '500'
                                        : style.fontWeight === 'Regular'
                                          ? '400'
                                          : style.fontWeight === 'Light'
                                            ? '300'
                                            : '400',
                                lineHeight: style.lineHeight,
                                letterSpacing: style.letterSpacing,
                              }}
                              className="text-[#18181b] whitespace-nowrap"
                            >
                              {style.name}
                            </div>
                          </div>

                          <div className="sg-cellControl flex items-center">
                            <Select
                              value={style.font}
                              onChange={(e) => updateStyle(style.id, 'font', e.target.value)}
                              options={fontOptions}
                              className="w-full sg-typoControl"
                              fieldClassName="!bg-[#F3F3F5] !border !border-[#CAD5E2] !rounded-[6px] !h-[36px] !px-[13px] !py-0 !text-[14px] !leading-[20px]"
                            />
                          </div>

                          <div className="sg-cellControl flex items-center">
                            <input
                              type="text"
                              value={style.fontSize}
                              onChange={(e) => updateStyle(style.id, 'fontSize', e.target.value)}
                              className="w-full max-w-[130px] h-[36px] px-[12px] py-[4px] bg-[#F3F3F5] border border-[#CAD5E2] rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#cad5e2] text-[14px] leading-[20px] text-[#717182]"
                            />
                          </div>

                          <div className="sg-cellControl flex items-center">
                            <Select
                              value={style.fontWeight}
                              onChange={(e) => updateStyle(style.id, 'fontWeight', e.target.value)}
                              options={fontWeightOptions}
                              className="w-full sg-typoControl"
                              fieldClassName="!bg-[#F3F3F5] !border !border-[#CAD5E2] !rounded-[6px] !h-[36px] !px-[13px] !py-0 !text-[14px] !leading-[20px]"
                            />
                          </div>

                          <div className="sg-cellControl flex items-center">
                            <input
                              type="text"
                              value={style.lineHeight}
                              onChange={(e) => updateStyle(style.id, 'lineHeight', e.target.value)}
                              className="w-full max-w-[130px] h-[36px] px-[12px] py-[4px] bg-[#F3F3F5] border border-[#CAD5E2] rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#cad5e2] text-[14px] leading-[20px] text-[#717182]"
                            />
                          </div>

                          <div className="sg-cellControl flex items-center">
                            <input
                              type="text"
                              value={style.letterSpacing}
                              onChange={(e) => updateStyle(style.id, 'letterSpacing', e.target.value)}
                              className="w-full max-w-[130px] h-[36px] px-[12px] py-[4px] bg-[#F3F3F5] border border-[#CAD5E2] rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#cad5e2] text-[14px] leading-[20px] text-[#717182]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Div-grid version (avoids global.css table borders entirely) */
        .sg-typoGrid .sg-cellHeader {
          padding: 16px 24px !important;
          background: #f9fafb !important;
          border-bottom: 1px solid #e0e2e7 !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          line-height: 21px !important;
          color: #4a5565 !important;
          letter-spacing: -0.1504px !important;
        }

        .sg-typoGrid .sg-cellStyle {
          padding: 16px 24px !important;
          background: #ffffff !important;
        }

        .sg-typoGrid .sg-cellControl {
          padding: 8px 24px !important;
          background: #ffffff !important;
        }

        /* Match Figma select value + chevron styling */
        .sg-typoGrid .sg-typoControl button {
          box-shadow: none !important;
        }

        .sg-typoGrid .sg-typoControl button > span {
          color: #0a0a0a !important;
          font-size: 14px !important;
          line-height: 20px !important;
        }

        .sg-typoGrid .sg-typoControl svg {
          width: 16px !important;
          height: 16px !important;
          color: #a0aec0 !important;
        }
      `}</style>

      {/* Add Font Modal */}
      <AnimatePresence>
        {isAddFontOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onMouseDown={() => setIsAddFontOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[720px] bg-white rounded-[20px] border border-[#e4e4e7] shadow-[0px_20px_60px_rgba(0,0,0,0.18)] p-6"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-[18px] font-semibold leading-[28px] text-[#18181b]">
                    Add a font style
                  </div>
                  <div className="text-[14px] leading-[20px] text-[#71717a]">
                    Create a new row in your typography hierarchy.
                  </div>
                </div>
                <button
                  type="button"
                  className="text-[#71717a] hover:text-[#18181b] px-2 py-1"
                  onClick={() => setIsAddFontOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-medium text-[#18181b] mb-2">
                    Style name
                  </label>
                  <input
                    type="text"
                    value={newStyleName}
                    onChange={(e) => setNewStyleName(e.target.value)}
                    placeholder={`e.g., Button / Small (defaults to Custom style ${nextStyleId})`}
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-none rounded-[12px] focus:outline-none focus:ring-1 focus:ring-[#e4e4e7] text-[14px] leading-[20px] text-[#18181b]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#18181b] mb-2">
                    Font
                  </label>
                  <Select
                    value={newStyleFont}
                    onChange={(e) => setNewStyleFont(e.target.value)}
                    options={fontOptions}
                    className="w-full"
                    fieldClassName="!bg-[#F3F3F5] !border-none !rounded-[12px] !py-3 !px-4"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#18181b] mb-2">
                    Font weight
                  </label>
                  <Select
                    value={newStyleFontWeight}
                    onChange={(e) => setNewStyleFontWeight(e.target.value)}
                    options={fontWeightOptions}
                    className="w-full"
                    fieldClassName="!bg-[#F3F3F5] !border-none !rounded-[12px] !py-3 !px-4"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#18181b] mb-2">
                    Font size
                  </label>
                  <input
                    type="text"
                    value={newStyleFontSize}
                    onChange={(e) => setNewStyleFontSize(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-none rounded-[12px] focus:outline-none focus:ring-1 focus:ring-[#e4e4e7] text-[14px] leading-[20px] text-[#4A5565]"
                    placeholder="16px"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#18181b] mb-2">
                    Line height
                  </label>
                  <input
                    type="text"
                    value={newStyleLineHeight}
                    onChange={(e) => setNewStyleLineHeight(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-none rounded-[12px] focus:outline-none focus:ring-1 focus:ring-[#e4e4e7] text-[14px] leading-[20px] text-[#4A5565]"
                    placeholder="16px"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[13px] font-medium text-[#18181b] mb-2">
                    Letter spacing
                  </label>
                  <input
                    type="text"
                    value={newStyleLetterSpacing}
                    onChange={(e) => setNewStyleLetterSpacing(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F3F3F5] border-none rounded-[12px] focus:outline-none focus:ring-1 focus:ring-[#e4e4e7] text-[14px] leading-[20px] text-[#4A5565]"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setIsAddFontOpen(false)}
                  className="bg-white text-black hover:bg-white border-[#e4e4e7]"
                >
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="button" onClick={confirmAddFont}>
                  Add Font
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div
        className="fixed bottom-0 left-0 lg:left-[256px] right-0 px-4 md:px-8 py-4 z-50"
        style={{ backgroundColor: '#F4F4F5' }}
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="h-px bg-[#e4e4e7] mx-[5px] mb-4" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="text-[14px] leading-[20px] text-[#71717a]">
            Step 2 of 6 — Next up: Color
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
