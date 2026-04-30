import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Folder, Type, Palette, Grid, FileText, Plus, ArrowRight, X, Volume2 } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

/** Primary black actions + hint — matched across Brand personality & Example phrases (Figma) */
const STYLE_GUIDE_VOICE_PRIMARY_BTN =
  'h-10 min-h-10 rounded-[6px] !px-[18px] !text-b2-regular !font-normal !text-white hover:!text-white font-[Inter,sans-serif] tracking-[-0.3125px] disabled:!text-white/50'

const STYLE_GUIDE_VOICE_PREVIEW_HINT =
  'font-[Inter,sans-serif] text-[16px] font-normal italic leading-[24px] tracking-[-0.3125px] text-[#71717b] sm:flex sm:min-h-10 sm:items-center'

const STYLE_GUIDE_VOICE_ACTION_ROW =
  'flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center'

/** Primary audience personas — inputs (Figma 9258:4086) */
const PERSONA_FIELD_LABEL_CLASS =
  'block font-[Inter,sans-serif] text-[14px] font-semibold leading-[20px] tracking-[-0.084px] text-[#1e293b]'

const PERSONA_TITLE_INPUT_CLASS =
  'box-border min-h-[48px] w-full min-w-0 rounded-lg border border-[#CBD5E1] bg-white px-3 py-3 font-[Inter,sans-serif] text-[16px] font-medium leading-[22px] tracking-[-0.112px] text-[#18181b] placeholder:font-[Inter,sans-serif] placeholder:text-[16px] placeholder:font-normal placeholder:leading-[24px] placeholder:tracking-[-0.312px] placeholder:text-[rgba(10,10,10,0.5)] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/20'

const PERSONA_SUMMARY_TEXTAREA_CLASS =
  'box-border min-h-[99px] w-full min-w-0 resize-y rounded-lg border border-[#CBD5E1] bg-white px-3 py-3 font-[Inter,sans-serif] text-[16px] font-medium leading-[22px] tracking-[-0.112px] text-[#18181b] placeholder:font-[Inter,sans-serif] placeholder:text-[16px] placeholder:font-normal placeholder:leading-[24px] placeholder:tracking-[-0.312px] placeholder:text-[rgba(10,10,10,0.5)] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/20'

const STYLE_GUIDE_ADD_PERSONA_BTN =
  'h-10 min-h-10 rounded-[6px] !px-4 !text-l2-medium !font-medium !text-white hover:!text-white font-[Inter,sans-serif] disabled:!text-white/50 disabled:!opacity-60'

export default function StyleGuideStep4Style({ data, updateData, onBack, onNext, onSaveExit }) {
  const [voiceSamplePreview, setVoiceSamplePreview] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Use data from props or defaults
  const selectedToneDescriptors = data?.style?.toneDescriptors || ['Professional', 'Bold', 'Innovative']
  const selectedAudience = data?.style?.audience || ['Technical / Executive-level']
  const audienceNote = data?.style?.audienceNote || ''
  const brandPersonality = data?.style?.personality || "We're an ambitious technology partner delivering web confidence business with impeccable craft"

  const examplePhrases = data?.style?.examplePhrases || [
    { id: 1, weSay: 'Transform your workflow', weDontSay: 'Disrupt the industry' },
  ]
  const personas = data?.style?.personas || [
    { id: 1, title: 'CTO / Engineering Leader', summary: '' },
    { id: 2, title: 'CTO / Engineering Leader', summary: '' },
  ]

  // Use typography from Step 2 for preview
  const typographyStyles = Array.isArray(data?.typography) ? data.typography : [
    { id: 1, name: 'Heading 1', font: 'Inter', fontSize: '62px', fontWeight: 'Bold', lineHeight: '62px', letterSpacing: '0' },
    // Default fallback if Step 2 wasn't visited/filled
  ]

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
    { id: 3, label: 'Color', icon: Palette, active: false },
    { id: 4, label: 'Style', icon: Grid, active: true },
    { id: 5, label: 'Review & Apply', icon: FileText, active: false },
  ]

  const toneDescriptors = [
    'Professional', 'Bold', 'Innovative', 'Sophisticated', 'Empathetic',
    'Friendly', 'Playful', 'Confident', 'Minimalist', 'Disruptive', 'Luxe',
  ]

  const audienceTypes = [
    'B2B / Corporate', 'Consumer / Lifestyle', 'Creative / Cultural',
    'Technical / Executive-level', 'Startup / Entrepreneurial',
  ]

  // Helper to update style object
  const updateStyleInfo = (updates) => {
    updateData({
      style: {
        ...data?.style,
        ...updates
      }
    })
  }

  const toggleToneDescriptor = (descriptor) => {
    let newDescriptors
    if (selectedToneDescriptors.includes(descriptor)) {
      newDescriptors = selectedToneDescriptors.filter((d) => d !== descriptor)
    } else if (selectedToneDescriptors.length < 3) {
      newDescriptors = [...selectedToneDescriptors, descriptor]
    } else {
      return // Limit reached
    }
    updateStyleInfo({ toneDescriptors: newDescriptors })
  }

  const toggleAudience = (audience) => {
    let newAudience
    if (selectedAudience.includes(audience)) {
      newAudience = selectedAudience.filter((a) => a !== audience)
    } else {
      newAudience = [...selectedAudience, audience]
    }
    updateStyleInfo({ audience: newAudience })
  }

  const addExamplePhrase = () => {
    const newId = Math.max(...examplePhrases.map((p) => p.id), 0) + 1
    updateStyleInfo({
      examplePhrases: [...examplePhrases, { id: newId, weSay: '', weDontSay: '' }]
    })
  }

  const removeExamplePhrase = (id) => {
    updateStyleInfo({
      examplePhrases: examplePhrases.filter((p) => p.id !== id)
    })
  }

  const buildVoiceSampleText = useCallback(() => {
    const personality = String(data?.style?.personality || brandPersonality || '').trim()
    const tones = selectedToneDescriptors.filter(Boolean)
    const audiences = selectedAudience.filter(Boolean)
    const parts = []
    if (personality) parts.push(personality)
    if (tones.length) parts.push(`Our voice feels ${tones.slice(0, 3).join(', ')}—clear, deliberate, and human.`)
    if (audiences.length) parts.push(`We speak to ${audiences.join(' and ')} with confidence and care.`)
    if (!parts.length) {
      parts.push(
        'Define your brand personality and tone above to generate a voice sample that stitches those choices together.'
      )
    }
    parts.push('This line previews how your selections might sound when spoken aloud.')
    return parts.join(' ')
  }, [data?.style?.personality, brandPersonality, selectedToneDescriptors, selectedAudience])

  const handleGenerateVoiceSample = useCallback(() => {
    const text = buildVoiceSampleText()
    setVoiceSamplePreview(text)

    if (typeof window === 'undefined' || !window.speechSynthesis) return

    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } catch {
      setIsSpeaking(false)
    }
  }, [buildVoiceSampleText])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const updateExamplePhrase = (id, field, value) => {
    updateStyleInfo({
      examplePhrases: examplePhrases.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    })
  }

  const addPersona = () => {
    if (personas.length >= 2) return
    const newId = Math.max(...personas.map((p) => p.id), 0) + 1
    updateStyleInfo({
      personas: [...personas, { id: newId, title: '', summary: '' }]
    })
  }

  const removePersona = (id) => {
    if (personas.length <= 1) return
    updateStyleInfo({
      personas: personas.filter((p) => p.id !== id)
    })
  }

  const updatePersona = (id, field, value) => {
    updateStyleInfo({
      personas: personas.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    })
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
      <div className="pl-0 lg:pl-[280px]">
        <div className="mx-auto w-full min-w-0 max-w-[1280px] px-4 md:px-8 pb-8">
          <div className="mb-8 pt-[51px]">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
              <div>
                <h1 className="self-stretch text-[30px] leading-[38px] font-bold not-italic text-[color:var(--base-foreground,#18181B)] font-hero mb-2">
                  Style
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
                  Continue to Grid<ArrowRight className="w-4 h-4 ml-1 hidden md:inline" />
                </Button>
              </div>
            </div>
          </div>

          {/* Typography Preview Section */}
          <div className="bg-white border border-[#e4e4e7] rounded-xl p-8 mb-6 mt-16">
            <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-6">
              Typography Preview
            </h3>
            <div className="space-y-4">
              {typographyStyles.length > 0 ? typographyStyles.map((style) => {
                const isHeading = style.name.toLowerCase().includes('heading')
                const fontSize = parseInt(style.fontSize)
                const displaySize = isHeading ? fontSize * 1.2 : fontSize

                return (
                  <div key={style.id} className="border-b border-[#e4e4e7] pb-4 last:border-b-0 last:pb-0">
                    <div className="mb-2">
                      <span className="text-[12px] leading-[16px] text-[#71717a] uppercase">
                        {style.name}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: style.font,
                        fontSize: `${displaySize}px`,
                        fontWeight: style.fontWeight === 'Bold' ? '700' :
                          style.fontWeight === 'SemiBold' ? '600' :
                            style.fontWeight === 'Medium' ? '500' :
                              style.fontWeight === 'Regular' ? '400' :
                                style.fontWeight === 'Light' ? '300' : '400',
                        lineHeight: style.lineHeight,
                        letterSpacing: style.letterSpacing,
                        fontStyle: 'italic'
                      }}
                      className="text-[#18181b] break-words"
                    >
                      {style.name.includes('Heading') && 'The Quick Brown Fox Jumps Over The Lazy Dog'}
                      {style.name.includes('Sub') && 'The Quick Brown Fox Jumps Over The Lazy Dog'}
                      {style.name.includes('Body') && 'The quick brown fox jumps over the lazy dog. This is a sample body text to preview the typography style.'}
                      {style.name === 'Caption' && 'The quick brown fox jumps over the lazy dog.'}
                    </div>
                  </div>
                )
              }) : (
                <div className="text-gray-500 italic">No typography styles defined yet. Go back to Step 2.</div>
              )}
            </div>
          </div>

          {/* Content Cards */}
          <div className="mt-16 space-y-6">
            {/* Tone Descriptors */}
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                Select up to 3 core tone descriptors
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-4">
                Choose words that describe how your brand should sound. ({selectedToneDescriptors.length}/3 selected)
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {toneDescriptors.map((descriptor) => {
                  const isSelected = selectedToneDescriptors.includes(descriptor)
                  return (
                    <motion.button
                      key={descriptor}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleToneDescriptor(descriptor)}
                      disabled={!isSelected && selectedToneDescriptors.length >= 3}
                      className={`inline-flex min-h-[42px] items-center justify-center rounded-full border px-4 py-[9px] text-[16px] font-normal leading-6 tracking-[-0.3125px] transition-colors duration-200 [font-family:var(--typography-font-family-font-sans,Inter)] ${
                        isSelected
                          ? 'border-[#18181b] bg-[#18181b] text-white'
                          : 'border-[#CBD5E1] bg-[#FFFFFF] text-[#18181b] hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:opacity-50'
                      }`}
                    >
                      {descriptor}
                    </motion.button>
                  )
                })}
              </div>
              <p className="mt-6 text-[16px] font-normal italic leading-6 tracking-[-0.312px] text-[#99A1AF] [font-family:var(--typography-font-family-font-sans,Inter)]">
                Tip : These words create a baseline voice.
              </p>
            </Card>

            {/* Audience */}
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                Who is your brand speaking to?
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-4">
                Select the audience types that fit. Add a note if there's something unique.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {audienceTypes.map((audience) => {
                  const isSelected = selectedAudience.includes(audience)
                  return (
                    <motion.button
                      key={audience}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleAudience(audience)}
                      className={`inline-flex min-h-[42px] items-center justify-center rounded-full border px-4 py-[9px] text-[16px] font-normal leading-6 tracking-[-0.3125px] transition-colors duration-200 [font-family:var(--typography-font-family-font-sans,Inter)] ${
                        isSelected
                          ? 'border-[#18181b] bg-[#18181b] text-white'
                          : 'border-[#CBD5E1] bg-[#FFFFFF] text-[#18181b] hover:bg-[#f4f4f5]'
                      }`}
                    >
                      {audience}
                    </motion.button>
                  )
                })}
              </div>
              <input
                type="text"
                value={audienceNote}
                onChange={(e) => updateStyleInfo({ audienceNote: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                placeholder="e.g., FinTech leaders in growth stage, APAC focus, compliance-sensitive."
              />
            </Card>

            {/* Brand Personality */}
            <Card className="w-full min-w-0 bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                Brand personality (1-2 sentences)
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-4">
                Describe your brand like you would talk to a new writer.
              </p>
              <div className="mb-4 w-full min-w-0">
                <textarea
                  value={brandPersonality}
                  onChange={(e) => updateStyleInfo({ personality: e.target.value })}
                  rows={4}
                  className="box-border block min-h-[120px] w-full min-w-0 max-w-full resize-y overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 font-[Inter,sans-serif] text-[16px] font-normal not-italic leading-[24px] tracking-[-0.312px] text-[rgba(10,10,10,0.5)] placeholder:text-[rgba(10,10,10,0.5)] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/20"
                  placeholder="Enter your brand personality description..."
                />
              </div>
              <div className={STYLE_GUIDE_VOICE_ACTION_ROW}>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleGenerateVoiceSample}
                  disabled={isSpeaking}
                  className={STYLE_GUIDE_VOICE_PRIMARY_BTN}
                >
                  <span className="flex items-center gap-[6px]">
                    <Volume2 className="size-[23px] shrink-0 text-white" strokeWidth={1.75} aria-hidden />
                    <span>{isSpeaking ? 'Playing sample…' : 'Generate voice sample'}</span>
                  </span>
                </Button>
                <span className={STYLE_GUIDE_VOICE_PREVIEW_HINT}>
                  Preview how your selections might sound
                </span>
              </div>
              {voiceSamplePreview ? (
                <p className="mt-4 rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-4 py-3 text-[14px] leading-[22px] text-[#374151]">
                  {voiceSamplePreview}
                </p>
              ) : null}
            </Card>

            {/* Example Phrases — Figma 9258:4053 */}
            <Card className="w-full min-w-0 !border-[#e5e7eb] !bg-white !p-8">
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <h3 className="font-[Inter,sans-serif] text-[20px] font-semibold leading-[30px] text-[#18181b]">
                    Example phrases
                  </h3>
                  <p className="font-[Inter,sans-serif] text-[18px] font-normal leading-[28px] text-[#71717a]">
                    Teach MANIFESTR how you do and don&apos;t speak.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {examplePhrases.map((phrase) => (
                    <div key={phrase.id} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                      <div className="flex min-w-0 flex-col gap-2">
                        <label className="block font-[Inter,sans-serif] text-[14px] font-semibold leading-[20px] tracking-[-0.084px] text-[#1e293b]">
                          We say
                        </label>
                        <div className="group relative">
                          <input
                            type="text"
                            value={phrase.weSay}
                            onChange={(e) => updateExamplePhrase(phrase.id, 'weSay', e.target.value)}
                            className={`box-border w-full min-w-0 rounded-lg border border-[#CBD5E1] bg-white py-3 pl-3 font-[Inter,sans-serif] text-[16px] font-medium leading-[22px] tracking-[-0.112px] text-[#18181b] placeholder:text-[#71717a] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/20 ${examplePhrases.length > 1 ? 'pr-10' : 'pr-3'}`}
                            placeholder="Transform your workflow"
                          />
                          {examplePhrases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeExamplePhrase(phrase.id)}
                              className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#18181b] opacity-0 transition-opacity group-hover:opacity-100"
                              aria-label="Remove phrase pair"
                            >
                              <X className="h-3 w-3 text-white" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex min-w-0 flex-col gap-2">
                        <label className="block font-[Inter,sans-serif] text-[14px] font-semibold leading-[20px] tracking-[-0.084px] text-[#1e293b]">
                          We don&apos;t say
                        </label>
                        <input
                          type="text"
                          value={phrase.weDontSay}
                          onChange={(e) => updateExamplePhrase(phrase.id, 'weDontSay', e.target.value)}
                          className="box-border w-full min-w-0 rounded-lg border border-[#CBD5E1] bg-white px-3 py-3 font-[Inter,sans-serif] text-[16px] font-medium leading-[22px] tracking-[-0.112px] text-[#18181b] placeholder:text-[#71717a] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/20"
                          placeholder="Disrupt the industry"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className={STYLE_GUIDE_VOICE_ACTION_ROW}>
                  <Button variant="primary" size="md" onClick={addExamplePhrase} className={STYLE_GUIDE_VOICE_PRIMARY_BTN}>
                    <span className="flex items-center gap-[6px]">
                      <Plus className="size-[23px] shrink-0 text-white" strokeWidth={1.75} aria-hidden />
                      <span>Add another pair</span>
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleGenerateVoiceSample}
                    disabled={isSpeaking}
                    className={STYLE_GUIDE_VOICE_PRIMARY_BTN}
                  >
                    <span className="flex items-center gap-[6px]">
                      <Volume2 className="size-[23px] shrink-0 text-white" strokeWidth={1.75} aria-hidden />
                      <span>{isSpeaking ? 'Playing sample…' : 'Generate voice sample'}</span>
                    </span>
                  </Button>
                  <span className={STYLE_GUIDE_VOICE_PREVIEW_HINT}>
                    Preview how your selections might sound
                  </span>
                </div>
              </div>
            </Card>

            {/* Primary Audience Personas — Figma 9258:4086 */}
            <Card className="w-full min-w-0 !border-[#e5e7eb] !bg-white !p-8">
              <div className="flex w-full flex-col">
                <div className="flex w-full flex-col gap-8">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-[Inter,sans-serif] text-[20px] font-semibold leading-[30px] text-[#18181b]">
                      Primary audience personas
                    </h3>
                    <p className="font-[Inter,sans-serif] text-[18px] font-normal leading-[28px] text-[#71717a]">
                      Add 1-2 personas you speak to most often.
                    </p>
                  </div>

                  {personas.map((persona, personaIndex) => (
                    <div
                      key={persona.id}
                      className="flex w-full min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:gap-8"
                    >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2">
                        <label htmlFor={`persona-title-${persona.id}`} className={PERSONA_FIELD_LABEL_CLASS}>
                          Persona {personaIndex + 1} Title
                        </label>
                        <input
                          id={`persona-title-${persona.id}`}
                          type="text"
                          value={persona.title}
                          onChange={(e) => updatePersona(persona.id, 'title', e.target.value)}
                          className={PERSONA_TITLE_INPUT_CLASS}
                          placeholder="CTO / Engineering Leader"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2">
                        <label htmlFor={`persona-summary-${persona.id}`} className={PERSONA_FIELD_LABEL_CLASS}>
                          Persona Summary
                        </label>
                        <textarea
                          id={`persona-summary-${persona.id}`}
                          value={persona.summary}
                          onChange={(e) => updatePersona(persona.id, 'summary', e.target.value)}
                          rows={3}
                          className={PERSONA_SUMMARY_TEXTAREA_CLASS}
                          placeholder="Enter your main text here..."
                        />
                      </div>
                    </div>
                    {personas.length > 1 ? (
                      <div className="flex shrink-0 items-start justify-end lg:justify-center lg:pt-7">
                        <button
                          type="button"
                          onClick={() => removePersona(persona.id)}
                          className="flex items-center justify-center rounded-[4px] bg-[#18181b] p-0 transition-opacity hover:opacity-90"
                          aria-label={`Remove persona ${personaIndex + 1}`}
                        >
                          <span className="flex size-7 items-center justify-center rounded-[8px]">
                            <X className="size-5 text-white" strokeWidth={2} aria-hidden />
                          </span>
                        </button>
                      </div>
                    ) : null}
                    </div>
                  ))}
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={addPersona}
                  disabled={personas.length >= 2}
                  className={`mt-4 max-w-full self-start !w-auto shrink-0 justify-center ${STYLE_GUIDE_ADD_PERSONA_BTN}`}
                >
                  <span className="flex items-center gap-2">
                    <Plus className="size-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
                    <span>Add persona</span>
                  </span>
                </Button>
              </div>
            </Card>
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
              Step 4 of 6 — Next up: Review & Apply
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
