import Head from 'next/head'
import { useState, useMemo, useRef, memo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { Inbox, Upload } from 'lucide-react'
import AppHeader from '../components/layout/AppHeader'
import Button from '../components/ui/Button'
import StyleGuideStep1Logo from '../components/style-guide/Step1Logo'
import StyleGuideStep2Typography from '../components/style-guide/Step2Typography'
import StyleGuideStep3Color from '../components/style-guide/Step3Color'
import StyleGuideStep4Style from '../components/style-guide/Step4Style'
import StyleGuideStep5Review from '../components/style-guide/Step5Review'
import CompletionModal from '../components/style-guide/CompletionModal'
import { useToast } from '../components/ui/Toast'

const DEFAULT_BRAND_PERSONALITY =
  "We're an ambitious technology partner delivering web confidence business with impeccable craft."

// Marquee Line Component - copied from onboarding
const MarqueeLine = memo(function MarqueeLine({ lineIndex, topPosition, shuffledPhrases, getFontFamily }) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const baseX = useMotionValue(0)
  const direction = lineIndex % 2 === 0 ? 1 : -1 // 1 for right, -1 for left

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    const container = containerRef.current
    const content = contentRef.current
    const contentWidth = content.scrollWidth
    const halfContentWidth = contentWidth / 2

    // Calculate speed: move half content width in 210 seconds - slower
    const speedPxPerMs = halfContentWidth / 210000

    let animationId
    let lastTime = performance.now()
    let isRunning = true

    const animate = (currentTime) => {
      if (!isRunning) return

      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      const currentX = baseX.get()
      const movement = direction * speedPxPerMs * deltaTime
      let newX = currentX + movement

      // Reset when we've moved exactly half the content width
      if (direction > 0 && newX >= 0) {
        newX = newX - halfContentWidth
      } else if (direction < 0 && newX <= -halfContentWidth) {
        newX = newX + halfContentWidth
      }

      baseX.set(newX)
      animationId = requestAnimationFrame(animate)
    }

    // Set initial position
    baseX.set(direction > 0 ? -halfContentWidth : 0)
    lastTime = performance.now()
    animationId = requestAnimationFrame(animate)

    return () => {
      isRunning = false
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  const x = useTransform(baseX, (value) => `${value}px`)

  return (
    <div
      ref={containerRef}
      className="absolute left-0 w-full overflow-hidden"
      style={{
        top: `${topPosition}px`
      }}
    >
      <motion.div
        ref={contentRef}
        className="flex items-baseline text-[80px] md:text-[140px] font-bold text-[#18181b] whitespace-nowrap"
        style={{ x, opacity: 0.03 }}
      >
        {/* First set of phrases */}
        {shuffledPhrases.map((phrase, phraseIndex) => (
          <span
            key={`first-${lineIndex}-${phraseIndex}`}
            className="px-8 inline-block"
            style={{
              lineHeight: '1',
              verticalAlign: 'baseline',
            }}
          >
            {phrase.parts.map((part, partIndex) => (
              <span
                key={partIndex}
                style={{
                  fontFamily: getFontFamily(part.font),
                }}
              >
                {part.text}
              </span>
            ))}
          </span>
        ))}
        {/* Duplicate set - this is what creates the seamless loop */}
        {shuffledPhrases.map((phrase, phraseIndex) => (
          <span
            key={`second-${lineIndex}-${phraseIndex}`}
            className="px-8 inline-block"
            style={{
              lineHeight: '1',
              verticalAlign: 'baseline',
            }}
          >
            {phrase.parts.map((part, partIndex) => (
              <span
                key={partIndex}
                style={{
                  fontFamily: getFontFamily(part.font),
                }}
              >
                {part.text}
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  )
})

export default function CreateStyleGuide() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const { id: editingId } = router.query
  const isEditMode = !!editingId
  
  const [currentStep, setCurrentStep] = useState(0) // 0 = initial modal, 1+ = steps
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingExisting, setIsLoadingExisting] = useState(false)

  // Centralized state for the style guide
  const [styleGuideData, setStyleGuideData] = useState({
    name: "Draft Style Guide", // Or prompt for it early
    brandKitName: "",
    logos: [], // { file, url, type, ... }
    colors: {
      selected: ['white', 'black'],
      custom: []
    },
    backgrounds: {
      permitted: 'light-dark',
      darkUses: 'white-reversed',
      minContrast: ''
    },
    logoRules: {
      enabled: true,
      minSize: '24px',
      maxSize: '96px',
      clearSpace: '4',
      scaling: 'maintain-aspect-ratio',
      placement: 'Top-left',
      allowAlternate: false
    },
    typography: {
      headings: { family: 'Inter', weight: 'Bold' },
      body: { family: 'Inter', weight: 'Regular' }
    },
    style: {
      toneDescriptors: ['Professional', 'Bold'],
      audience: ['B2B (Business)'],
      personality: DEFAULT_BRAND_PERSONALITY,
      examplePhrases: [{ id: 1, weSay: 'Transform your workflow', weDontSay: 'Disrupt the industry' }],
      personas: [{ id: 1, title: 'CTO', summary: '' }]
    }
  })

  const updateStyleGuideData = (updates) => {
    setStyleGuideData((prev) =>
      typeof updates === 'function' ? updates(prev) : { ...prev, ...updates }
    )
  }

  // Load existing style guide if in edit mode
  useEffect(() => {
    if (!editingId) return

    const loadExistingGuide = async () => {
      try {
        setIsLoadingExisting(true)
        const { getStyleGuideDetails } = await import('../services/style-guide')
        const response = await getStyleGuideDetails(editingId)
        const guide = response.data

        // Map backend data to component state
        if (guide) {
          // Backend stores data in separate JSONB columns: logo, typography, colors, style
          // The logo column contains: { logos: [], backgrounds: {}, logoRules: {} }
          const logoData = guide.logo || {};
          const loadedData = {
            name: guide.name || "Draft Style Guide",
            brandKitName: guide.brand_name || guide.name || "",
            logos: logoData.logos || [],
            backgrounds: logoData.backgrounds || { permitted: 'light-dark', darkUses: 'white-reversed', minContrast: '' },
            logoRules: logoData.logoRules || { enabled: true, minSize: '24px', maxSize: '96px', clearSpace: '4', scaling: 'maintain-aspect-ratio', placement: 'Top-left', allowAlternate: false },
            colors: guide.colors || { selected: ['white', 'black'], custom: [] },
            typography: guide.typography || { headings: { family: 'Inter', weight: 'Bold' }, body: { family: 'Inter', weight: 'Regular' } },
            style: {
              toneDescriptors: ['Professional', 'Bold'],
              audience: ['B2B (Business)'],
              personality: DEFAULT_BRAND_PERSONALITY,
              personas: [{ id: 1, title: 'CTO', summary: '' }],
              examplePhrases: [{ id: 1, weSay: 'Transform your workflow', weDontSay: 'Disrupt the industry' }],
              ...guide.style,
              personality:
                guide.style?.personality != null && String(guide.style.personality).trim() !== ''
                  ? guide.style.personality
                  : DEFAULT_BRAND_PERSONALITY
            }
          }
          
          setStyleGuideData(loadedData)
          // Skip the initial modal and go directly to editing
          setCurrentStep(1)
        }
      } catch (error) {
        console.error('Failed to load style guide:', error)
        showError('Failed to load style guide. Please try again.')
      } finally {
        setIsLoadingExisting(false)
      }
    }

    loadExistingGuide()
  }, [editingId])

  const handleSaveAndExit = async () => {
    try {
      setIsSubmitting(true)

      // Prepare payload matching backend schema
      const payload = {
        name: styleGuideData.brandKitName || "Untitled Style Guide",
        brand_name: styleGuideData.brandKitName,
        logo: {
          logos: styleGuideData.logos || [],
          backgrounds: styleGuideData.backgrounds || {},
          logoRules: styleGuideData.logoRules || {}
        },
        typography: styleGuideData.typography || {},
        colors: styleGuideData.colors || {},
        style: styleGuideData.style || {},
        isCompleted: false,
        currentStep: currentStep
      }

      if (isEditMode) {
        // Update existing style guide
        const { updateStyleGuide } = await import('../services/style-guide')
        await updateStyleGuide(editingId, payload)
        success('Progress saved successfully!')
      } else {
        // Create new style guide with current progress
        const { createStyleGuide } = await import('../services/style-guide')
        await createStyleGuide(payload)
        success('Style guide saved as draft!')
      }
      
      // Redirect to style guide list
      router.push('/style-guide')
    } catch (error) {
      console.error('Failed to save:', error)
      showError("Failed to save progress. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateStyleGuide = async () => {
    try {
      setIsSubmitting(true)

      // Prepare payload matching backend schema
      // Backend expects: name, brand_name, logo, typography, colors, style (as separate fields)
      const payload = {
        name: styleGuideData.brandKitName || "Untitled Style Guide",
        brand_name: styleGuideData.brandKitName,
        logo: {
          logos: styleGuideData.logos || [],
          backgrounds: styleGuideData.backgrounds || {},
          logoRules: styleGuideData.logoRules || {}
        },
        typography: styleGuideData.typography || {},
        colors: styleGuideData.colors || {},
        style: styleGuideData.style || {},
        isCompleted: true,
        currentStep: 6
      }

      if (isEditMode) {
        // Update existing style guide
        const { updateStyleGuide } = await import('../services/style-guide')
        await updateStyleGuide(editingId, payload)
        success('Style guide updated successfully!')
      } else {
        // Create new style guide
        const { createStyleGuide } = await import('../services/style-guide')
        await createStyleGuide(payload)
        success('Style guide created successfully!')
      }
      
      setShowCompletionModal(true)
    } catch (error) {
      console.error('Failed to save style guide:', error)
      showError("Failed to save style guide. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to get font family
  const getFontFamily = (fontClass) => {
    if (fontClass === 'font-castoro-titling') return 'Castoro Titling, serif'
    if (fontClass === 'font-monte-carlo') return 'MonteCarlo, cursive'
    return 'Hanken Grotesk, sans-serif' // font-hero or default
  }

  // Background text phrases with font-matched words and punctuation
  const backgroundPhrases = [
    {
      parts: [
        { text: 'LUXURIOUS', font: 'font-castoro-titling' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'PREMIUM', font: 'font-hero' },
        { text: '.', font: 'font-hero' }
      ]
    },
    {
      parts: [
        { text: 'BOLD', font: 'font-hero' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'ELEGANT', font: 'font-monte-carlo' },
        { text: ',', font: 'font-castoro-titling' },
        { text: ' ', font: 'font-hero' },
        { text: 'POWERFUL', font: 'font-hero' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'DYNAMIC', font: 'font-hero' },
        { text: '.', font: 'font-hero' }
      ]
    },
    {
      parts: [
        { text: 'VISIONARY', font: 'font-castoro-titling' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'INNOVATIVE', font: 'font-monte-carlo' },
        { text: '.', font: 'font-hero' }
      ]
    },
    {
      parts: [
        { text: 'REFINED', font: 'font-castoro-titling' },
        { text: ',', font: 'font-castoro-titling' },
        { text: ' ', font: 'font-hero' },
        { text: 'SOPHISTICATED', font: 'font-hero' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'EXCEPTIONAL', font: 'font-castoro-titling' },
        { text: '.', font: 'font-hero' }
      ]
    },
    {
      parts: [
        { text: 'EXQUISITE', font: 'font-castoro-titling' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'TIMELESS', font: 'font-castoro-titling' },
        { text: ',', font: 'font-castoro-titling' },
        { text: ' ', font: 'font-hero' },
        { text: 'AUTHENTIC', font: 'font-castoro-titling' },
        { text: '.', font: 'font-hero' }
      ]
    },
    {
      parts: [
        { text: 'CREATIVE', font: 'font-monte-carlo' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'INSPIRING', font: 'font-monte-carlo' },
        { text: '.', font: 'font-hero' }
      ]
    },
    {
      parts: [
        { text: 'PRECISE', font: 'font-hero' },
        { text: ',', font: 'font-castoro-titling' },
        { text: ' ', font: 'font-hero' },
        { text: 'FOCUSED', font: 'font-hero' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'STRATEGIC', font: 'font-hero' },
        { text: '.', font: 'font-hero' }
      ]
    },
    {
      parts: [
        { text: 'MASTERFUL', font: 'font-castoro-titling' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'DISTINCTIVE', font: 'font-hero' },
        { text: '.', font: 'font-hero' }
      ]
    },
    {
      parts: [
        { text: 'PROFOUND', font: 'font-castoro-titling' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'TRANSCENDENT', font: 'font-monte-carlo' },
        { text: '.', font: 'font-hero' }
      ]
    },
    {
      parts: [
        { text: 'REVOLUTIONARY', font: 'font-hero' },
        { text: ',', font: 'font-castoro-titling' },
        { text: ' ', font: 'font-hero' },
        { text: 'LIMITLESS', font: 'font-hero' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'UNPARALLELED', font: 'font-castoro-titling' },
        { text: '.', font: 'font-hero' }
      ]
    },
    {
      parts: [
        { text: 'SUBLIME', font: 'font-castoro-titling' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'RADIANT', font: 'font-monte-carlo' },
        { text: '.', font: 'font-hero' }
      ]
    },
    {
      parts: [
        { text: 'MINIMAL', font: 'font-hero' },
        { text: ',', font: 'font-castoro-titling' },
        { text: ' ', font: 'font-hero' },
        { text: 'CALM', font: 'font-monte-carlo' },
        { text: ' & ', font: 'font-castoro-titling' },
        { text: 'SERENE', font: 'font-monte-carlo' },
        { text: '.', font: 'font-hero' }
      ]
    },
  ]

  // Pre-calculate shuffled phrases for each line (only once)
  const linePhrases = useMemo(() => {
    return [...Array(8)].map((_, lineIndex) => {
      const startOffset = lineIndex % backgroundPhrases.length
      return [
        ...backgroundPhrases.slice(startOffset),
        ...backgroundPhrases.slice(0, startOffset)
      ]
    })
  }, [])

  const handleCreateManually = () => {
    // Move to step 1 (Logo step)
    setCurrentStep(1)
  }

  const handleUploadBrandKit = () => {
    // Move to step 1 (Logo step) - same for both buttons
    setCurrentStep(1)
  }

  // Show loading screen while loading existing guide
  if (isLoadingExisting) {
    return (
      <>
        <Head>
          <title>Loading Style Guide - Manifestr</title>
        </Head>
        <div className="bg-white min-h-screen w-full flex flex-col">
          <AppHeader showRightActions={true} />
          <div className="h-[72px]" />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#18181b] border-t-transparent rounded-full animate-spin" />
              <p className="text-[16px] text-[#71717a]">Loading style guide...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{isEditMode ? 'Edit' : 'Create'} Style Guide - Manifestr</title>
        <meta name="description" content={`${isEditMode ? 'Edit' : 'Create'} your brand style guide`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white min-h-screen w-full flex flex-col">
        {/* Header */}
        <AppHeader showRightActions={true} />

        {/* Spacer for fixed header */}
        <div className="h-[72px]" />

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden">
          {/* Multiple Marquee Lines Filling Screen */}
          <div className="absolute top-[-2%] left-0 w-full h-[200vh] overflow-hidden pointer-events-none z-0">
            {[...Array(8)].map((_, lineIndex) => {
              const lineHeight = 150
              const gap = -10
              const totalLineHeight = lineHeight + gap
              const topPosition = lineIndex * totalLineHeight

              const shuffledPhrases = linePhrases[lineIndex]

              return (
                <MarqueeLine
                  key={lineIndex}
                  lineIndex={lineIndex}
                  topPosition={topPosition}
                  shuffledPhrases={shuffledPhrases}
                  getFontFamily={getFontFamily}
                />
              )
            })}
          </div>

          {/* Content Container */}
          <AnimatePresence mode="wait">
            {currentStep === 0 ? (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 w-full min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-8 py-20"
              >
                <div className="w-full max-w-[672px] flex flex-col items-center gap-8">
                  {/* Title Section (match Figma) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full text-center"
                  >
                    <h1 className="text-[32px] font-semibold leading-[40px] tracking-[0.0703px] text-[#0a0a0a] mb-3">
                      Style Guide
                    </h1>
                    <p className="text-[18px] leading-[26px] tracking-[-0.3125px] text-[#6A7282]">
                      Upload your brand kit or create your style from scratch.
                    </p>
                  </motion.div>

                  {/* Modal Card (match Figma) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="w-full bg-white rounded-[16px] px-8 py-12 shadow-[0px_44px_109.2px_0px_rgba(22,34,51,0.2)]"
                  >
                    <div className="flex flex-col items-center gap-6">
                      {/* Icon wrap */}
                      <div className="bg-[#efefef] p-8 rounded-[200px] flex items-center justify-center">
                        <Inbox className="w-10 h-10 text-[#71717a]" />
                      </div>

                      <div className="w-full flex flex-col items-center">
                        <h2 className="text-[16px] font-medium leading-[24px] tracking-[-0.3125px] text-[#0a0a0a] text-center">
                          Let's build your brand foundation
                        </h2>
                        <p className="mt-4 text-[16px] leading-[24px] tracking-[-0.3125px] text-[#71717b] text-center max-w-[475px]">
                          Upload your logo or brand kit — MANIFESTR AI will extract colors, fonts, and visuals to create your style guide in seconds.
                        </p>

                        {/* Actions */}
                        <div className="mt-10 flex items-center justify-center gap-3">
                          <Button variant="secondary" size="md" onClick={handleCreateManually}>
                            Create Manually
                          </Button>
                          <Button variant="primary" size="md" onClick={handleUploadBrandKit}>
                            Upload Brand Kit
                          </Button>
                        </div>

                        {/* Help Link */}
                        <button
                          type="button"
                          className="mt-11 text-[16px] leading-[24px] tracking-[-0.3125px] text-[#99A1AF] hover:text-[#18181b] transition-colors"
                        >
                          How MANIFESTR AI works
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : currentStep === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full"
              >
                <StyleGuideStep1Logo
                  data={styleGuideData}
                  updateData={updateStyleGuideData}
                  onBack={() => setCurrentStep(0)}
                  onNext={() => setCurrentStep(2)}
                  onSaveExit={handleSaveAndExit}
                />
              </motion.div>
            ) : currentStep === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full"
              >
                <StyleGuideStep2Typography
                  data={styleGuideData}
                  updateData={updateStyleGuideData}
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                  onSaveExit={handleSaveAndExit}
                />
              </motion.div>
            ) : currentStep === 3 ? (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full"
              >
                <StyleGuideStep3Color
                  data={styleGuideData}
                  updateData={updateStyleGuideData}
                  onBack={() => setCurrentStep(2)}
                  onNext={() => setCurrentStep(4)}
                  onSaveExit={handleSaveAndExit}
                />
              </motion.div>
            ) : currentStep === 4 ? (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full"
              >
                <StyleGuideStep4Style
                  data={styleGuideData}
                  updateData={updateStyleGuideData}
                  onBack={() => setCurrentStep(3)}
                  onNext={() => setCurrentStep(5)}
                  onSaveExit={handleSaveAndExit}
                />
              </motion.div>
            ) : currentStep === 5 ? (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full"
              >
                <StyleGuideStep5Review
                  data={styleGuideData}
                  updateData={updateStyleGuideData}
                  onBack={() => setCurrentStep(4)}
                  onNext={handleCreateStyleGuide}
                  isSubmitting={isSubmitting}
                  isEditMode={isEditMode}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>

        {/* Completion Modal */}
        <CompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          onContinue={() => {
            setShowCompletionModal(false)
            // Redirect based on mode
            if (isEditMode) {
              router.push(`/style-guide/${editingId}`)
            } else {
              router.push('/style-guide')
            }
          }}
        />
      </div>
    </>
  )
}
