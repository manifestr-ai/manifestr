import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Logo from '../components/logo/Logo'
import Button from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { Mail, CheckCircle, XCircle } from 'lucide-react'

export default function VerifyEmail() {
    const router = useRouter()
    const { email: queryEmail, token, type } = router.query
    const { verifyEmail, resendVerification } = useAuth()

    const [email, setEmail] = useState(queryEmail || '')
    const [isResending, setIsResending] = useState(false)
    const [resendMessage, setResendMessage] = useState('')
    const [resendError, setResendError] = useState('')
    const [verifying, setVerifying] = useState(false)
    const [verificationStatus, setVerificationStatus] = useState(null) // 'success' | 'error'
    const [verificationMessage, setVerificationMessage] = useState('')

    useEffect(() => {
        if (queryEmail) {
            setEmail(queryEmail)
        }
    }, [queryEmail])

    // Parse hash fragment for Supabase email confirmation
    useEffect(() => {
        // Supabase sends tokens in the hash fragment, not query params
        const hash = window.location.hash
        if (hash) {
            const params = new URLSearchParams(hash.substring(1)) // Remove '#' and parse
            const accessToken = params.get('access_token')
            const refreshToken = params.get('refresh_token')
            const error = params.get('error')
            const errorDescription = params.get('error_description')

            if (error) {
                setVerificationStatus('error')
                setVerificationMessage(
                    errorDescription
                        ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
                        : 'Verification failed. The link may be expired or invalid.'
                )
            } else if (accessToken) {
                // Supabase has already verified the email! Just need to sync with our backend
                handleSupabaseVerification(accessToken, refreshToken)
            }
        }
    }, [])

    // Auto-verify if token is present in URL query params (fallback)
    useEffect(() => {
        if (token) {
            handleVerifyWithToken(token, type || 'signup')
        }
    }, [token, type])

    const handleSupabaseVerification = async (accessToken, refreshToken) => {
        setVerifying(true)
        setVerificationStatus(null)
        setVerificationMessage('')

        try {
            // Store tokens from Supabase
            localStorage.setItem('accessToken', accessToken)
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken)
            }

            // Fetch user profile from our backend using the access token
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://api.manifestr.ai' : 'http://localhost:8000')}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                const user = data.details.user
                localStorage.setItem('user', JSON.stringify(user))

                setVerificationStatus('success')
                setVerificationMessage('Email verified successfully! Redirecting...')

                // Redirect to home after 1 second
                setTimeout(() => {
                    router.push('/home')
                }, 1000)
            } else {
                throw new Error('Failed to fetch user profile')
            }
        } catch (error) {
            setVerificationStatus('error')
            setVerificationMessage('Verification successful but failed to load profile. Please try logging in.')

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } finally {
            setVerifying(false)
        }
    }

    const handleVerifyWithToken = async (verificationToken, verificationType) => {
        setVerifying(true)
        setVerificationStatus(null)
        setVerificationMessage('')

        try {
            await verifyEmail(verificationToken, verificationType)
            setVerificationStatus('success')
            setVerificationMessage('Email verified successfully! You can now log in.')

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (error) {
            setVerificationStatus('error')
            setVerificationMessage(
                error.response?.data?.message || 'Verification failed. The link may be expired or invalid.'
            )
        } finally {
            setVerifying(false)
        }
    }

    const handleResendEmail = async () => {
        if (!email) {
            setResendError('Please enter your email address')
            return
        }

        setIsResending(true)
        setResendMessage('')
        setResendError('')

        try {
            await resendVerification(email)
            setResendMessage('Verification email sent! Please check your inbox.')
        } catch (error) {
            setResendError(
                error.response?.data?.message || 'Failed to resend email. Please try again.'
            )
        } finally {
            setIsResending(false)
        }
    }

    // If verifying with token
    if (token && verifying) {
        return (
            <>
                <Head>
                    <title>Verifying Email - Manifestr</title>
                    <meta name="description" content="Verifying your email" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
                    <div className="w-full max-w-md text-center">
                        <Logo size="lg" className="mx-auto mb-8" />
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-base-foreground mx-auto mb-6"></div>
                        <h1 className="text-[30px] leading-[38px] font-bold text-base-foreground mb-3">
                            Verifying Your Email
                        </h1>
                        <p className="text-b2-regular text-base-muted-foreground">
                            Please wait while we verify your email address...
                        </p>
                    </div>
                </div>
            </>
        )
    }

    // If verification completed (success or error)
    if (token && verificationStatus) {
        return (
            <>
                <Head>
                    <title>
                        {verificationStatus === 'success' ? 'Email Verified' : 'Verification Failed'} - Manifestr
                    </title>
                    <meta name="description" content="Email verification result" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
                    <div className="w-full max-w-md text-center">
                        <Logo size="lg" className="mx-auto mb-8" />

                        {verificationStatus === 'success' ? (
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                        ) : (
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        )}

                        <h1 className="text-[30px] leading-[38px] font-bold text-base-foreground mb-3">
                            {verificationStatus === 'success' ? 'Email Verified!' : 'Verification Failed'}
                        </h1>
                        <p className="text-b2-regular text-base-muted-foreground mb-6">
                            {verificationMessage}
                        </p>

                        {verificationStatus === 'error' && (
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={() => router.push('/signup')}
                                    variant="primary"
                                    size="md"
                                    className="w-full"
                                >
                                    Return to Sign Up
                                </Button>
                                <Link
                                    href="/login"
                                    className="text-l2-medium text-base-secondary hover:opacity-80"
                                >
                                    Already verified? Log in
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )
    }

    // Default: Waiting for email verification
    return (
        <>
            <Head>
                <title>Verify Your Email - Manifestr</title>
                <meta name="description" content="Verify your email to continue" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Logo size="lg" className="mx-auto" />
                    </div>

                    {/* Main Content */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-10 h-10 text-base-muted-foreground" />
                        </div>

                        <h1 className="text-[30px] leading-[38px] font-bold text-base-foreground mb-3">
                            Check Your Email
                        </h1>
                        <p className="text-b2-regular text-base-muted-foreground mb-2">
                            We've sent a verification link to
                        </p>
                        <p className="text-b2-medium text-base-foreground mb-6">
                            {email}
                        </p>
                        <p className="text-b2-regular text-base-muted-foreground">
                            Click the link in the email to verify your account and get started with MANIFESTR.
                        </p>
                    </div>


                    {/* Additional Actions */}
                    <div className="text-center space-y-3">
                        <p className="text-l2-regular text-base-muted-foreground">
                            Wrong email address?{' '}
                            <Link href="/signup" className="text-l2-medium text-base-foreground hover:opacity-80">
                                Sign up again
                            </Link>
                        </p>
                        <p className="text-l2-regular text-base-muted-foreground">
                            Already verified?{' '}
                            <Link href="/login" className="text-l2-medium text-base-foreground hover:opacity-80">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3 items-center justify-center text-center">
                    <p className="text-l2-regular text-[#71717b]">
                        © MANIFESTR LLC 2050
                    </p>
                    <span className="hidden sm:inline text-zinc-300">|</span>
                    <Link href="/privacy" className="text-l2-regular text-[#71717B] hover:opacity-80">
                        Privacy Policy
                    </Link>
                    <span className="hidden sm:inline text-zinc-300">|</span>
                    <Link href="/terms" className="text-l2-regular text-[#71717B] hover:opacity-80">
                        Terms of Use
                    </Link>
                </div>
            </div>
        </>
    )
}

