import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo, useRef, memo, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useAnimationFrame, AnimatePresence } from 'framer-motion'
import Logo from '../logo/Logo'
import Loader from '../ui/Loader'
import Button from '../ui/Button'
import StepperHeader from './StepperHeader'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'

// Marquee Line Component - moved outside to prevent recreation on re-renders
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
        className="flex items-baseline text-[140px] md:text-[140px] font-bold text-white whitespace-nowrap"
        style={{ x }}
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

export default function OnboardingFlow({ onComplete, onSkip }) {
  const router = useRouter()
  const [showWelcome, setShowWelcome] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0) // 0 = welcome, 1-4 = steps

  useEffect(() => {
    // Show loader for 5-6 seconds, then show welcome modal
    const timer = setTimeout(() => {
      setShowWelcome(true)
    }, 5500) // 5.5 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleLetsGo = () => {
    // Start onboarding steps
    setOnboardingStep(1)
  }

  const handleSkip = () => {
    // Skip onboarding
    if (onSkip) onSkip()
    else router.push('/home')
  }

  const [stepData, setStepData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStepNext = async (data) => {
    // Save step data
    const updatedData = { ...stepData, ...data }
    setStepData(updatedData)

    // Move to next step
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      // We are at step 3, moving to... finish?
      // The original code went to 4. Step 4 is likely success.
      // Let's try to submit data now.
      setIsSubmitting(true)
      try {
        if (onComplete) {
          await onComplete({
            expertise: updatedData.expertise,
            job_title: updatedData.jobTitle,
            industry: updatedData.industry,
            goal: updatedData.achievements?.join(","),
            problems: updatedData.bottlenecks?.join(","),
            work_style: updatedData.workStyle,
          })
        }
        // Show step 4 (Success)
        setOnboardingStep(4)
      } catch (error) {
        // Handle error (maybe show toast)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleFinish = () => {
    // Called from Step 4 or automatically?
    // If Step 4 has a "Go Home" button
    router.push('/home')
  }

  const handleStepBack = () => {
    // Go back to previous step
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1)
    }
  }

  const handleStepSkip = () => {
    // Skip remaining steps
    if (onSkip) onSkip()
    else router.push('/home')
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

  return (
    <>
      <Head>
        <title>Onboarding - Manifestr</title>
        <meta name="description" content="Setting up your Manifestr account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#F4F4F5] relative overflow-y-auto flex flex-col items-center">
        {/* Multiple Marquee Lines Filling Screen */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.6] z-0">
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

        {/* Stepper Header (only shown during steps) */}
        {onboardingStep > 0 && (
          <div className="fixed top-0 left-0 w-full z-20">
            <StepperHeader step={onboardingStep} totalSteps={4} />
          </div>
        )}

        {/* Content Container with top padding to avoid header overlap */}
        <div className={`w-full flex-1 flex flex-col items-center z-10 py-12 md:py-20 ${onboardingStep > 0 ? 'pt-24' : 'justify-center'}`}>
          <AnimatePresence mode="wait">
            {onboardingStep === 0 && !showWelcome ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-6 items-center"
              >
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Logo size="xl" />
                </motion.div>

                {/* Loader */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Loader message="Shaping your strategy..." duration={3000} />
                </motion.div>
              </motion.div>
            ) : onboardingStep === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-[520px] px-6"
              >
                {/* Welcome Modal */}
                <div className="bg-white rounded-2xl shadow-[0px_44px_110px_0px_rgba(22,34,51,0.2)] p-8">
                  <div className="flex flex-col gap-6">
                    {/* Title */}
                    <motion.h1
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="text-[28px] text-center leading-[36px] font-semibold text-[#09090b] font-hero"
                    >
                      Welcome to MANIFESTR
                    </motion.h1>

                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="flex flex-col gap-3"
                    >
                      <p className="text-l2-regular text-base-foreground">
                        Your intelligent workspace for ideas that move faster.
                      </p>
                      <p className="text-l2-regular text-base-foreground">
                        From today, you're not working alone.
                      </p>
                      <p className="text-l2-regular text-base-foreground">
                        Every action, document, and idea is powered by intelligence built to help you work faster, think clearer, and execute smarter.
                      </p>
                      <p className="text-l2-regular text-base-foreground">
                        This is your new command center for bringing ideas to life.
                      </p>
                    </motion.div>

                    {/* Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="flex flex-col gap-3"
                    >
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full"
                        onClick={handleLetsGo}
                      >
                        Lets Go →
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        className="w-full"
                        onClick={handleSkip}
                      >
                        Skip for now
                      </Button>
                    </motion.div>

                    {/* AI Status Indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="flex items-center justify-center gap-2 pt-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-black" />
                      <p className="text-l2-regular text-base-muted-foreground">
                        MANIFESTR AI is ready to guide you
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${onboardingStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full max-w-[800px] px-6 my-auto"
              >
                {onboardingStep === 1 && (
                  <Step1 onNext={handleStepNext} onSkip={handleStepSkip} />
                )}
                {onboardingStep === 2 && (
                  <Step2 onNext={handleStepNext} onBack={handleStepBack} />
                )}
                {onboardingStep === 3 && (
                  <Step3 onNext={handleStepNext} onBack={handleStepBack} isSubmitting={isSubmitting} />
                )}
                {onboardingStep === 4 && (
                  <Step4 onFinish={handleFinish} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

