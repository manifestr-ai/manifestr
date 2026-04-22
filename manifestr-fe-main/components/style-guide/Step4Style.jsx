import { motion } from 'framer-motion'
import { Folder, Type, Palette, Grid, FileText, Plus, ArrowRight, X, Volume2 } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function StyleGuideStep4Style({ data, updateData, onBack, onNext, onSaveExit }) {
  // Use data from props or defaults
  const selectedToneDescriptors = data?.style?.toneDescriptors || ['Professional', 'Bold', 'Innovative']
  const selectedAudience = data?.style?.audience || ['Technical / Executive-level']
  const audienceNote = data?.style?.audienceNote || ''
  const brandPersonality = data?.style?.personality || "We're an ambitious technology partner delivering web confidence business with impeccable craft."

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
      id: 5,
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

  const updateExamplePhrase = (id, field, value) => {
    updateStyleInfo({
      examplePhrases: examplePhrases.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    })
  }

  const addPersona = () => {
    const newId = Math.max(...personas.map((p) => p.id), 0) + 1
    updateStyleInfo({
      personas: [...personas, { id: newId, title: '', summary: '' }]
    })
  }

  const removePersona = (id) => {
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
                  Style
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleToneDescriptor(descriptor)}
                      disabled={!isSelected && selectedToneDescriptors.length >= 3}
                      className={`px-6 py-2.5 text-[14px] leading-[20px] font-medium transition-all duration-200 ${isSelected
                        ? 'bg-[#18181b] text-white rounded-full shadow-sm'
                        : 'bg-[#f4f4f5] text-[#18181b] hover:bg-[#e4e4e7] rounded-full disabled:opacity-50 disabled:cursor-not-allowed border border-transparent'
                        }`}
                    >
                      {descriptor}
                    </motion.button>
                  )
                })}
              </div>
              <p className="text-[12px] leading-[16px] text-[#71717a] mt-2">
                These words create a baseline voice.
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleAudience(audience)}
                      className={`px-6 py-2.5 rounded-full text-[14px] leading-[20px] font-medium transition-all duration-200 ${isSelected
                        ? 'bg-[#18181b] text-white shadow-sm'
                        : 'bg-[#f4f4f5] text-[#18181b] hover:bg-[#e4e4e7] border border-transparent'
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
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                Brand personality (1-2 sentences)
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-4">
                Describe your brand like you would talk to a new writer.
              </p>
              <textarea
                value={brandPersonality}
                onChange={(e) => updateStyleInfo({ personality: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#71717a] mb-4 resize-none overflow-y-auto"
                placeholder="Enter your brand personality description..."
              />
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  className="bg-white border-[#e4e4e7] text-[#18181b] hover:bg-[#f4f4f5]"
                >
                  <Volume2 className="w-4 h-4 mr-2 text-[#18181b]" />
                  Generate voice sample
                </Button>
                <span className="text-[14px] leading-[20px] text-[#71717a]">
                  Preview how your selections might sound
                </span>
              </div>
            </Card>

            {/* Example Phrases */}
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                Example phrases
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                Teach MANIFESTR how you do and don't speak.
              </p>

              <div className="space-y-4 mb-4">
                {examplePhrases.map((phrase, index) => (
                  <div key={phrase.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                        We say
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          value={phrase.weSay}
                          onChange={(e) => updateExamplePhrase(phrase.id, 'weSay', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                          placeholder="Transform your workflow"
                        />
                        {examplePhrases.length > 1 && (
                          <button
                            onClick={() => removeExamplePhrase(phrase.id)}
                            className="absolute top-3 right-3 w-5 h-5 bg-[#18181b] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                        We don't say
                      </label>
                      <input
                        type="text"
                        value={phrase.weDontSay}
                        onChange={(e) => updateExamplePhrase(phrase.id, 'weDontSay', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                        placeholder="Disrupt the industry"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={addExamplePhrase}
                  className="w-full md:w-auto justify-center bg-white border-[#e4e4e7] text-[#18181b] hover:bg-[#f4f4f5]"
                >
                  <Plus className="w-4 h-4 mr-2 text-[#18181b]" />
                  Add another pair
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full md:w-auto justify-center bg-white border-[#e4e4e7] text-[#18181b] hover:bg-[#f4f4f5]"
                >
                  <Volume2 className="w-4 h-4 mr-2 text-[#18181b]" />
                  Generate voice sample
                </Button>
                <span className="text-[14px] leading-[20px] text-[#71717a] text-center md:text-left">
                  Preview how your selections might sound
                </span>
              </div>
            </Card>

            {/* Primary Audience Personas */}
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                Primary audience personas
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                Add 1-2 personas you speak to most often.
              </p>

              <div className="space-y-4 mb-4">
                {personas.map((persona) => (
                  <div key={persona.id} className="relative group border border-[#e4e4e7] rounded-lg p-4">
                    {personas.length > 1 && (
                      <button
                        onClick={() => removePersona(persona.id)}
                        className="absolute top-4 right-4 w-5 h-5 bg-[#18181b] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    )}
                    <div className="mb-4">
                      <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                        Persona {personas.indexOf(persona) + 1} Title
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
                        Persona Summary
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
                ))}
              </div>

              <Button variant="primary" size="md" onClick={addPersona} className="w-full md:w-auto justify-center">
                <Plus className="w-4 h-4 mr-2" />
                Add persona
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 bg-white border-t border-[#e4e4e7] px-4 md:px-8 py-4 z-50">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="text-[14px] leading-[20px] text-[#71717a]">
            Step 4 of 6 — Next up: Review & Apply
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
