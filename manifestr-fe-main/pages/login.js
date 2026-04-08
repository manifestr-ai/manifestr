import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Logo from '../components/logo/Logo'
import Input from '../components/forms/Input'
import Checkbox from '../components/forms/Checkbox'
import Button from '../components/ui/Button'
import GoogleIcon from '../components/icons/GoogleIcon'
import { Toaster, Intent } from '@blueprintjs/core'
import { useToast } from '../components/ui/Toast'

import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/router'

// Create toaster instance
const AppToaster = typeof window !== 'undefined' ? Toaster.create({
  position: 'top',
  maxToasts: 3,
}) : null

export default function Login() {
  const router = useRouter()
  const { error: showError } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [emailNotVerified, setEmailNotVerified] = useState(false)
  const [touched, setTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    setServerError('')

    const newErrors = {}

    if (!email || !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!password) {
      newErrors.password = 'Password is required.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)

      try {
        await login(email, password)

        // Success - AuthContext handles redirect to /home
        if (AppToaster) {
          AppToaster.show({
            message: 'Welcome back! Redirecting...',
            intent: Intent.SUCCESS,
            icon: 'tick-circle',
            timeout: 2000,
          })
        }
      } catch (err) {

        // Always reset submitting state on error
        setIsSubmitting(false)

        let errorMessage = 'Something went wrong. Please try again.'
        let isEmailNotVerified = false

        // Handle specific error cases
        if (err.response?.status === 401) {
          const message = err.response?.data?.message || ''

          // Check if it's an email verification error
          if (message.toLowerCase().includes('verify your email')) {
            errorMessage = message
            isEmailNotVerified = true
            setEmailNotVerified(true)
          } else {
            // Invalid credentials
            errorMessage = 'Incorrect password or email! Please login with correct credentials.'
            setEmailNotVerified(false)
          }
        } else if (err.response?.data?.message) {
          // Server provided a specific message
          errorMessage = err.response.data.message
          setEmailNotVerified(false)
        } else if (err.message) {
          // Generic error message
          errorMessage = err.message
          setEmailNotVerified(false)
        }


        // Show beautiful toast notification
        if (AppToaster) {
          try {
            AppToaster.show({
              message: errorMessage,
              intent: Intent.DANGER,
              icon: 'error',
              timeout: 5000,
            })
          } catch (toastError) {
            // Fallback: use our toast system
            showError(errorMessage)
          }
        } else {
          // Fallback: use our toast system
          showError(errorMessage)
        }

        // Also set server error for the inline display
        setServerError(errorMessage)
      }
    }
  }

  return (
    <>
      <Head>
        <title>Login - Manifestr</title>
        <meta name="description" content="Login to Manifestr" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col lg:flex-row bg-white">
        {/* Left Section - Login Form */}
        <div className="flex-1 flex flex-col items-center justify-center w-full lg:min-w-[480px] relative py-12 lg:py-0">
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
          <div className="w-full max-w-[550px] px-6 lg:px-8 mt-16 lg:mt-0 mb-20 lg:mb-0">
            <div className="flex flex-col gap-8 items-center">
              {/* Header Text */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h1 className="text-[30px] leading-[38px] font-bold text-base-foreground font-hero">
                  Welcome back
                </h1>
                <p className="text-b2-regular text-base-muted-foreground">
                  Think bold. Move fast. Stay limitless.
                </p>
              </div>

              {/* Form */}
              {serverError && (
                <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  <p>{serverError}</p>
                  {emailNotVerified && (
                    <button
                      type="button"
                      onClick={() => router.push(`/verify-email?email=${encodeURIComponent(email)}`)}
                      className="mt-2 text-sm text-red-700 font-medium underline hover:opacity-80"
                    >
                      Resend verification email →
                    </button>
                  )}
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-start w-full rounded-xl" name="login-form">
                <div className="flex flex-col gap-5 items-start w-full">
                  {/* Email Input */}
                  <Input
                    label="Email address"
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    helperText={!touched || !errors.email ? "Your email stays private." : undefined}
                    error={touched && errors.email ? errors.email : undefined}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (touched && errors.email) {
                        const newErrors = { ...errors }
                        delete newErrors.email
                        setErrors(newErrors)
                      }
                    }}
                    required
                  />

                  {/* Password Input */}
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    helperText={!touched || !errors.password ? "Your data is encrypted and secure." : undefined}
                    error={touched && errors.password ? errors.password : undefined}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (touched && errors.password) {
                        const newErrors = { ...errors }
                        delete newErrors.password
                        setErrors(newErrors)
                      }
                    }}
                    showPasswordToggle
                    required
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 sm:gap-0">
                  <Checkbox
                    label="Remember me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <Link
                    href="/forgot-password"
                    className="text-l2-medium text-base-secondary hover:opacity-80 px-1"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 items-start w-full">
                  <Button type="submit" variant="primary" size="md" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </Button>
                  <Button type="button" variant="secondary" size="md" className="w-full border-[#e4e4e7]">
                    <GoogleIcon className="mr-2" />
                    Sign in with Google
                  </Button>
                </div>
              </form>

              {/* New User Section */}
              <div className="flex flex-col gap-2 items-center w-full">
                <p className="text-c1-regular text-base-muted-foreground">
                  New to MANIFESTR?
                </p>
                <Link
                  href="/signup"
                  className="w-full border-[1.5px] border-[#e4e4e7] rounded-md px-4 py-2 flex flex-col items-center hover:bg-base-muted transition-colors"
                >
                  <span className="text-l2-medium text-base-foreground">
                    Join MANIFESTR
                  </span>
                  <span className="text-[12px] leading-[16px] text-[#71717b]">
                    You're paid to think, not to format.
                  </span>
                </Link>
              </div>
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
