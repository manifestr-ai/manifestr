import { useState } from 'react'
import { Key, ArrowLeft, CheckCircle2, X } from 'lucide-react'
import Link from 'next/link'
import Button from '../ui/Button'
import Input from '../forms/Input'

export default function Step3({ email, onNext }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Password requirements validation
  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasLowercase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  }

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean)

  const validatePassword = (password) => {
    if (!password) return null // Don't show error until user tries to submit
    
    // Check if password was used in last 3 passwords
    // Mock: For now, we'll simulate this with a hardcoded check
    const lastThreePasswords = ['oldpass123', 'previous456', 'lastpass789']
    if (lastThreePasswords.includes(password)) {
      return 'You cannot reuse your last 3 passwords.'
    }
    
    return null
  }

  const validateConfirmPassword = (confirm) => {
    if (!confirm) return 'Please confirm your password'
    if (confirm !== newPassword) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ newPassword: true, confirmPassword: true })
  
    if (!allRequirementsMet) {
      setErrors({
        newPassword: 'Password does not meet all requirements',
        confirmPassword:
          touched.confirmPassword && confirmPassword !== newPassword
            ? 'Passwords do not match'
            : undefined,
      })
      return
    }
  
    const newPasswordError = validatePassword(newPassword)
    const confirmPasswordError = validateConfirmPassword(confirmPassword)
  
    if (newPasswordError || confirmPasswordError) {
      setErrors({
        newPassword: newPasswordError,
        confirmPassword: confirmPasswordError,
      })
      return
    }
  
    try {
      setIsSubmitting(true)
      setErrors({})
  
      await onNext({ password: newPassword })
  
    } catch (err) {
      setErrors({
        newPassword:
          err?.response?.data?.message || "Failed to reset password",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewPasswordChange = (e) => {
    const value = e.target.value
    setNewPassword(value)
    
    // Check for reused password in real-time
    const lastThreePasswords = ['oldpass123', 'previous456', 'lastpass789']
    if (value && lastThreePasswords.includes(value)) {
      setErrors((prev) => ({
        ...prev,
        newPassword: 'You cannot reuse your last 3 passwords.',
      }))
    } else if (touched.newPassword && errors.newPassword) {
      // Clear error if password is valid
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.newPassword
        return newErrors
      })
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)
    
    // Clear error when user starts typing
    if (touched.confirmPassword && errors.confirmPassword) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.confirmPassword
        return newErrors
      })
    }
  }

  const isFormValid = allRequirementsMet && 
                      newPassword && 
                      confirmPassword && 
                      newPassword === confirmPassword &&
                      !errors.newPassword &&
                      !errors.confirmPassword

  return (
    <>
      {/* Key Icon */}
      <div className="w-10 h-10 border border-[#e4e4e7] rounded-md flex items-center justify-center">
        <Key className="w-5 h-5 text-zinc-400" />
      </div>

      {/* Title and Subtitle */}
      <div className="flex flex-col gap-3 items-center text-center w-full">
        <h1 className="text-[24px] leading-[32px] font-semibold text-[#09090b] font-hero">
          Create a New Password
        </h1>
        <p className="text-l2-regular text-base-muted-foreground">
          Your new password must be different to previously
          <br />
          used passwords.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        {/* Password Inputs */}
        <div className="flex flex-col gap-4 w-full">
          {/* New Password */}
          <Input
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            showPasswordToggle={true}
            error={touched.newPassword && errors.newPassword ? errors.newPassword : undefined}
            value={newPassword}
            onChange={handleNewPasswordChange}
            onFocus={() => setTouched((prev) => ({ ...prev, newPassword: true }))}
            required
          />

          {/* Confirm New Password */}
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm your new password"
            showPasswordToggle={true}
            error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onFocus={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
            required
          />
        </div>

        {/* Password Requirements Checklist */}
        <div className="flex flex-col gap-2 items-start w-full">
          <div className={`flex gap-2 items-center ${passwordRequirements.minLength ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {passwordRequirements.minLength ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <p className="text-[12px] leading-[18px]">
              At least 8 characters
            </p>
          </div>
          
          <div className={`flex gap-2 items-center ${passwordRequirements.hasUppercase ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {passwordRequirements.hasUppercase ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <p className="text-[12px] leading-[18px]">
              Contains uppercase letter
            </p>
          </div>
          
          <div className={`flex gap-2 items-center ${passwordRequirements.hasLowercase ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {passwordRequirements.hasLowercase ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <p className="text-[12px] leading-[18px]">
              Contains lowercase letter
            </p>
          </div>
          
          <div className={`flex gap-2 items-center ${passwordRequirements.hasNumber ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {passwordRequirements.hasNumber ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <p className="text-[12px] leading-[18px]">
              Contains number
            </p>
          </div>
          
          <div className={`flex gap-2 items-center ${passwordRequirements.hasSpecialChar ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {passwordRequirements.hasSpecialChar ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <p className="text-[12px] leading-[18px]">
              Contains special character
            </p>
          </div>
        </div>

        {/* Reset Password Button */}
        <Button 
          type="submit" 
          variant="primary" 
          size="md" 
          className="w-full"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Reset password"}
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

