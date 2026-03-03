import Head from 'next/head'
import { useState, useMemo, useRef, memo, useEffect } from 'react'
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
  const [currentStep, setCurrentStep] = useState(0) // 0 = initial modal, 1+ = steps
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      personality: "We're an ambitious technology partner...",
      examplePhrases: [{ id: 1, weSay: 'Transform your workflow', weDontSay: 'Disrupt the industry' }],
      personas: [{ id: 1, title: 'CTO', summary: '' }]
    }
  })

  const updateStyleGuideData = (updates) => {
    setStyleGuideData(prev => ({ ...prev, ...updates }))
  }

  const handleCreateStyleGuide = async () => {
    try {
      setIsSubmitting(true)
      const { createStyleGuide } = await import('../services/style-guide')

      // Prepare payload for API
      // The API expects a simple structure or specific fields.
      // Based on service definition: { name, ... }
      // We might need to map our complex state to the API schema.
      // For now, sending what we have as 'config' or similar if API supports dynamic fields,
      // or mapping strict fields. 
      // Assuming a flexible 'config' json column or specific mapped fields.
      // Let's assume we send 'brand_name' as name and the rest in 'config'

      const payload = {
        name: styleGuideData.brandKitName || "Untitled Style Guide",
        brand_name: styleGuideData.brandKitName,
        config: styleGuideData
      }

      await createStyleGuide(payload)
      setShowCompletionModal(true)
    } catch (error) {
      alert("Failed to save style guide. Please try again.")
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

  return (
    <>
      <Head>
        <title>Style Guide - Manifestr</title>
        <meta name="description" content="Create your brand style guide" />
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
                {/* Title Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-[60px] font-bold leading-[72px] tracking-[-1.28px] text-[#18181b] mb-4">
                    Style Guide
                  </h1>
                  <p className="text-[20px] leading-[28px] text-[#6A7282]">
                    Upload your brand kit or create your style from scratch.
                  </p>
                </motion.div>

                {/* Modal Dialog */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full max-w-[520px] mx-4 md:mx-0 bg-white rounded-2xl shadow-xl border border-[#e4e4e7] p-6 md:p-8"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#f4f4f5] rounded-full flex items-center justify-center">
                      <Inbox className="w-8 h-8 text-[#71717a]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-[20px] font-semibold leading-[32px] text-[#18181b] text-center mb-3">
                    Let's build your brand foundation
                  </h2>

                  {/* Description */}
                  <p className="text-[14px] leading-[24px] text-[#71717a] text-center mb-8">
                    Upload your logo or brand kit — MANIFESTR AI will extract colors, fonts, and visuals to create your style guide in seconds.
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={handleCreateManually}
                      className="w-full md:w-auto md:flex-1"
                    >
                      Create Manually
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleUploadBrandKit}
                      className="w-full md:w-auto md:flex-1"
                    >
                      Upload Brand Kit
                    </Button>
                  </div>

                  {/* Help Link */}
                  <div className="text-center">
                    <button className="text-[14px] leading-[20px] text-[#99A1AF] hover:text-[#18181b] transition-colors mx-auto">
                      How MANIFESTR AI works
                    </button>
                  </div>
                </motion.div>
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
            // Redirect to style-guide page or handle completion
            window.location.href = '/style-guide'
          }}
        />
      </div>
    </>
  )
}
