import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../components/logo/Logo'
import ProgressBar from '../components/signup/ProgressBar'
import Step1 from '../components/signup/Step1'
import Step2 from '../components/signup/Step2'
import Step3 from '../components/signup/Step3'

import { useAuth } from '../contexts/AuthContext'
import OnboardingFlow from '../components/onboarding/OnboardingFlow'
import api from '../lib/api'

export default function SignUp() {
  const router = useRouter()
  const { signup, setUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  // Step 1 fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 2 fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // Step 3 fields
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [country, setCountry] = useState('')
  const [gender, setGender] = useState('')
  const [earlyAccess, setEarlyAccess] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters.'
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least 1 number.'
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least 1 special character.'
    }
    return null
  }

  const handleStep1Submit = (e) => {
    e.preventDefault()
    setTouched(true)
    setServerError('')

    const newErrors = {}

    if (!email || !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      newErrors.password = passwordError
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setDirection(1)
      setStep(2)
      setTouched(false)
      setErrors({})
    }
  }

  const handleStep2Submit = (e) => {
    e.preventDefault()
    setTouched(true)
    setServerError('')

    const newErrors = {}

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required.'
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setDirection(1)
      setStep(3)
      setTouched(false)
      setErrors({})
    }
  }

  const handleStep3Submit = async (e) => {
    e.preventDefault()
    setTouched(true)
    setServerError('')

    const newErrors = {}

    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required.'
    }

    if (!country) {
      newErrors.country = 'Country is required.'
    }

    if (!gender) {
      newErrors.gender = 'Gender is required.'
    }

    if (!termsAccepted) {
      newErrors.termsAccepted = 'You must agree to the Terms and Conditions and Privacy Policy.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)

      try {
        const result = await signup({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          dob: dateOfBirth,
          country,
          gender: gender ? gender.toLowerCase() : '',
          promotional_emails: earlyAccess
        })

        // Check if email verification is required
        if (result.requiresVerification) {
          // Redirect to verification page
          router.push(`/verify-email?email=${encodeURIComponent(result.email || email)}`)
        } else {
          // User authenticated immediately - show onboarding
          setShowOnboarding(true)
        }
      } catch (err) {
        if (err.response?.status === 409) {
          setServerError('This email is already registered. Please log in instead.')
        } else {
          setServerError(err.response?.data?.message || 'Failed to create account. Please try again.')
        }
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleOnboardingComplete = async (data) => {
    try {
      // Data is already mapped by OnboardingFlow
      const response = await api.post('/auth/onboarding', data)
      const updatedUser = response.data.details.user
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      // Finished!
    } catch (error) {
      if (error.response?.status === 400) {
      }
      throw error
    }
  }

  const handleSkip = () => {
    // Optimistically mark as completed to prevent redirect loop
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        const updatedUser = { ...parsedUser, onboarding_completed: true }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        if (setUser) setUser(updatedUser)
      }
    } catch (e) {
    }
    router.push('/home')
  }

  // If we are showing onboarding, render that instead of the signup form
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} onSkip={handleSkip} />
  }

  const handleBack = () => {
    setDirection(-1)
    setStep(step - 1)
    setTouched(false)
    setErrors({})
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return {
          title: 'Step 1: Create Your MANIFESTR Account',
          subtitle: 'Quick setup. Secure sign-in. Access tools built to give you clarity, wins and focus.',
          placeholder: 'Enter your email and password, Your data says private and protected is missing'
        }
      case 2:
        return {
          title: 'Step 2: Tell us who you are',
          subtitle: 'Add your name so we can personalize your experience.',
          placeholder: ''
        }
      case 3:
        return {
          title: 'Step 3: Complete Your Profile',
          subtitle: 'Just a few more details to get you started.',
          placeholder: ''
        }
      default:
        return { title: '', subtitle: '' }
    }
  }

  const getAnimationVariants = (dir) => {
    if (dir === 1) {
      // Moving forward: current slides left, next slides in from right
      return {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 }
      }
    } else {
      // Moving backward: current slides right, previous slides in from left
      return {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Sign Up - Manifestr</title>
        <meta name="description" content="Sign up for Manifestr" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col lg:flex-row bg-white">
        {/* Left Section - Sign Up Form */}
        <div className="flex-1 flex flex-col items-center justify-center w-full lg:min-w-[480px] relative !py-14">
          {/* Logo - Top Left */}
          <div className="absolute left-6 top-6 lg:left-8 lg:top-8">
            <Logo size="md" />
          </div>

          {/* Footer - Bottom Left */}
          <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 flex flex-wrap gap-3 items-center">
            <p className="text-l2-regular text-[#71717b]">
              © MANIFESTR LLC 2050
            </p>
            <span className="hidden sm:inline text-zinc-300 text-base leading-6 tracking-[-0.3125px]">|</span>
            <Link
              href="/privacy"
              className="text-l2-regular !text-[#71717B] hover:opacity-80"
            >
              Privacy Policy
            </Link>
            <span className="hidden sm:inline text-zinc-300 text-base leading-6 tracking-[-0.3125px]">|</span>
            <Link
              href="/terms"
              className="text-l2-regular !text-[#71717B] hover:opacity-80"
            >
              Terms of Use
            </Link>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-[550px] px-6 lg:px-8 mx-auto mt-16 lg:mt-0 mb-20 lg:mb-0">
            <div className="flex flex-col gap-4 w-full">
              {/* Progress Bar & Header Text */}
              <div className="flex flex-col gap-3 items-start w-full">
                <ProgressBar step={step} totalSteps={3} />

                {/* Title & Subtitle */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <h1 className="text-[30px] leading-[38px] font-bold text-base-foreground font-hero">
                    {getStepTitle().title}
                  </h1>
                  {getStepTitle().subtitle && (
                    <div className="flex flex-col gap-2">
                      <p className="text-b2-regular text-[#2b2b35] font-extrabold">
                 
                      <span className="font-semibold">{getStepTitle().subtitle}</span>
                 
                      </p>

                    {getStepTitle().placeholder && (
                      <p className="text-b2-regular text-[#71717b] font-normal">
                        {getStepTitle().placeholder}
                      </p>
                    )}
               
               
                    </div>
                  )}
                </div>
              </div>

              {/* Form Steps */}
              <AnimatePresence mode="wait" custom={direction}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={getAnimationVariants(direction)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-full"
                  >
                    <Step1
                      email={email}
                      password={password}
                      confirmPassword={confirmPassword}
                      errors={errors}
                      touched={touched}
                      onEmailChange={(e) => {
                        setEmail(e.target.value)
                        if (touched && errors.email) {
                          const newErrors = { ...errors }
                          delete newErrors.email
                          setErrors(newErrors)
                        }
                      }}
                      onPasswordChange={(e) => {
                        setPassword(e.target.value)
                        if (touched && errors.password) {
                          const newErrors = { ...errors }
                          delete newErrors.password
                          setErrors(newErrors)
                        }
                      }}
                      onConfirmPasswordChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (touched && errors.confirmPassword) {
                          const newErrors = { ...errors }
                          delete newErrors.confirmPassword
                          setErrors(newErrors)
                        }
                      }}
                      onSubmit={handleStep1Submit}
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={getAnimationVariants(direction)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-full"
                  >
                    <Step2
                      firstName={firstName}
                      lastName={lastName}
                      errors={errors}
                      touched={touched}
                      onFirstNameChange={(e) => {
                        setFirstName(e.target.value)
                        if (touched && errors.firstName) {
                          const newErrors = { ...errors }
                          delete newErrors.firstName
                          setErrors(newErrors)
                        }
                      }}
                      onLastNameChange={(e) => {
                        setLastName(e.target.value)
                        if (touched && errors.lastName) {
                          const newErrors = { ...errors }
                          delete newErrors.lastName
                          setErrors(newErrors)
                        }
                      }}
                      onSubmit={handleStep2Submit}
                      onBack={handleBack}
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={getAnimationVariants(direction)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-full"
                  >
                    {serverError && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {serverError}
                      </div>
                    )}
                    <Step3
                      dateOfBirth={dateOfBirth}
                      country={country}
                      gender={gender}
                      earlyAccess={earlyAccess}
                      termsAccepted={termsAccepted}
                      errors={errors}
                      touched={touched}
                      onDateOfBirthChange={(e) => {
                        setDateOfBirth(e.target.value)
                        if (touched && errors.dateOfBirth) {
                          const newErrors = { ...errors }
                          delete newErrors.dateOfBirth
                          setErrors(newErrors)
                        }
                      }}
                      onCountryChange={(e) => {
                        setCountry(e.target.value)
                        if (touched && errors.country) {
                          const newErrors = { ...errors }
                          delete newErrors.country
                          setErrors(newErrors)
                        }
                      }}
                      onGenderChange={(e) => {
                        setGender(e.target.value)
                        if (touched && errors.gender) {
                          const newErrors = { ...errors }
                          delete newErrors.gender
                          setErrors(newErrors)
                        }
                      }}
                      onEarlyAccessChange={(e) => {
                        setEarlyAccess(e.target.checked)
                      }}
                      onTermsAcceptedChange={(e) => {
                        setTermsAccepted(e.target.checked)
                        if (touched && errors.termsAccepted) {
                          const newErrors = { ...errors }
                          delete newErrors.termsAccepted
                          setErrors(newErrors)
                        }
                      }}
                      onSubmit={handleStep3Submit}
                      onBack={handleBack}
                      isSubmitting={isSubmitting}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Existing User Prompt */}
              {step === 1 && (
                <div className="flex gap-1 items-baseline justify-center">
                  <p className="text-l2-regular text-[#71717A]">
                    Already have an account?
                  </p>
                  <Link
                    href="/login"
                    className="text-l2-medium !text-[#18181B] hover:opacity-80"
                  >
                    Log in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Banner Image (Hidden on Mobile) */}
        <div className="hidden lg:block flex-1 bg-[#f4f4f5] border-l border-[#e4e4e7] relative overflow-hidden">
          <Image
            src="/assets/banners/girl-banner.png"
            alt="Manifestr Banner"
            fill
            className="object-cover"
            draggable={false}
            priority
          />
        </div>
      </div>
    </>
  )
}

