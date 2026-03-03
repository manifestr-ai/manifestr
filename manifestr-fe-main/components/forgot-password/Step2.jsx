import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Button from '../ui/Button'

const CORRECT_CODE = '123123'

export default function Step2({ email, onNext }) {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [codeError, setCodeError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const codeInputRefs = useRef([])

  // Focus first input on mount
  useEffect(() => {
    if (codeInputRefs.current[0]) {
      codeInputRefs.current[0].focus()
    }
  }, [])

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return
    
    // Clear error when user starts typing
    if (codeError) {
      setCodeError('')
    }
    
    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)
    
    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus()
    }
  }

  const handleCodeKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus()
    }
  }

  const handleCodePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('')
      setVerificationCode(newCode)
      // Focus last input
      codeInputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const code = verificationCode.join('')
    
    if (code.length !== 6) {
      return
    }
    
    // Check if code is correct
    if (code === CORRECT_CODE) {
      setCodeError('')
      onNext(code)
    } else {
      // Incorrect code - trigger vibration animation
      setCodeError('The verification code is incorrect. Please try again.')
      setIsShaking(true)
      
      // Reset shaking after animation
      setTimeout(() => {
        setIsShaking(false)
      }, 500)
      
      // Clear the code inputs
      setVerificationCode(['', '', '', '', '', ''])
      // Focus first input
      setTimeout(() => {
        if (codeInputRefs.current[0]) {
          codeInputRefs.current[0].focus()
        }
      }, 600)
    }
  }

  const isCodeComplete = verificationCode.every(digit => digit !== '')

  return (
    <>
      {/* Title and Subtitle */}
      <div className="flex flex-col gap-3 items-center text-center w-full">
        <h1 className="text-[24px] leading-[32px] font-semibold text-[#09090b] font-hero">
          Verify
        </h1>
        <p className="text-l2-regular text-base-muted-foreground">
          Enter the code we just sent to your email.
        </p>
      </div>

      {/* Verification Code Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        {/* Code Input Fields */}
        <div className="flex flex-col gap-4 w-full">
          <motion.div 
            className="flex gap-2 justify-center"
            animate={isShaking ? {
              x: [0, -10, 10, -10, 10, -5, 5, 0]
            } : {}}
            transition={{
              duration: 0.5,
              ease: 'easeInOut'
            }}
          >
            {verificationCode.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (codeInputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                onPaste={handleCodePaste}
                className="w-full h-14 bg-white border rounded-md text-center text-[24px] font-semibold text-[#09090b] focus:outline-none focus:ring-2 focus:ring-base-foreground focus:ring-offset-0"
                style={{
                  borderColor: codeError ? '#fca5a5' : '#e4e4e7'
                }}
                animate={isShaking ? {
                  borderColor: ['#fca5a5', '#dc2626', '#fca5a5', '#dc2626', '#fca5a5']
                } : {}}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </motion.div>
          
          {/* Error Message */}
          {codeError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-l2-regular text-[#dc2626] text-center"
            >
              {codeError}
            </motion.p>
          )}
          
          {/* Resend Code Link */}
          <div className="flex items-center justify-center gap-1">
            <p className="text-l2-regular text-base-muted-foreground">
              Didn't receive the code?
            </p>
            <button
              type="button"
              className="text-l2-medium text-zinc-900 hover:opacity-80 px-1"
              onClick={() => {
                // Handle resend logic
              }}
            >
              Resend
            </button>
          </div>
        </div>

        {/* Verify Button */}
        <Button 
          type="submit" 
          variant="primary" 
          size="md" 
          className="w-full"
          disabled={!isCodeComplete}
        >
          Verify
        </Button>

        {/* Back to Login Link */}
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-l2-medium text-zinc-900 hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to log in</span>
        </Link>
      </form>
    </>
  )
}

