import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, CheckCircle2, ChevronUp, Sun, Moon, Monitor, Search, UserPlus, MoreVertical, Trash2, Gift, Clock3, Crown, UserCog, Pencil, Eye, HelpCircle, X, Palette, Zap, Stars, Database, Presentation, Briefcase, Loader, CreditCard, Download, RefreshCw, Link, Cloud, Settings as SettingsIcon, CloudCog, Sparkles, Mic, BarChart3, Brain, FileText, Archive, RotateCw, FileImage, Check, Shield, Lock, Key, Smartphone, AlertTriangle, LogOut, Globe, Github, Twitter, Layers, Clock, Building2, Users } from 'lucide-react'
import Image from 'next/image'
import AppHeader from '../components/layout/AppHeader'
import ToggleSwitch from '../components/forms/ToggleSwitch'
import { useAuth } from '../contexts/AuthContext'
import { getUserProfile, updateUserProfile } from '../services/auth'
import { getPresignedUrl, uploadToS3 } from '../services/uploads'
import { useToast } from '../components/ui/Toast'
import { changePassword, getSessions, revokeSession, updateSecurityAlerts, deleteAccount } from '../services/security'
import DeleteAccountModal from '../components/ui/DeleteAccountModal'
import LogoutModal from '../components/ui/LogoutModal'

const tabs = ['General', 'Profile', 'Team', 'Plans', 'Billings', 'Security']

export default function Settings() {
  const router = useRouter()
  const { success, error: showError, info } = useToast()
  const { refreshProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('General')
  const [workspaceSubTab, setWorkspaceSubTab] = useState('Notifications')

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [profileImageUrl, setProfileImageUrl] = useState(null)

  // General settings state
  const [isGeneralExpanded, setIsGeneralExpanded] = useState(true)
  const [isAccessibilityExpanded, setIsAccessibilityExpanded] = useState(true)
  const [themeMode, setThemeMode] = useState('system')
  const [language, setLanguage] = useState('auto-detect')
  const [timeZone, setTimeZone] = useState('auto-detect')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')
  const [fontSize, setFontSize] = useState('large')
  const [fontAdjust, setFontAdjust] = useState(25)
  const [reducedMotion, setReducedMotion] = useState(false)

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showTimeZoneDropdown, setShowTimeZoneDropdown] = useState(false)
  const [showDateFormatDropdown, setShowDateFormatDropdown] = useState(false)

  const languageDropdownRef = useRef(null)
  const timeZoneDropdownRef = useRef(null)
  const dateFormatDropdownRef = useRef(null)

  // Form state
  const [username, setUsername] = useState('omariclam')
  const [displayName, setDisplayName] = useState('Umar')
  const [fullName, setFullName] = useState('Umar Islam')
  const [email, setEmail] = useState('umar@company.com')
  const [phoneCountry, setPhoneCountry] = useState('PK')
  const [phoneNumber, setPhoneNumber] = useState('+92 (555) 123-4567')
  const [yearOfBirth, setYearOfBirth] = useState('2004')
  const [gender, setGender] = useState('Male')
  const [country, setCountry] = useState('Pakistan')
  const [jobTitle, setJobTitle] = useState('Product Designer')
  const [industry, setIndustry] = useState('Technology')
  const [yearsOfExperience, setYearsOfExperience] = useState('5-10 years')

  // Dropdown states
  const [showPhoneCountryDropdown, setShowPhoneCountryDropdown] = useState(false)
  const [showYearOfBirthDropdown, setShowYearOfBirthDropdown] = useState(false)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false)

  const phoneCountryRef = useRef(null)
  const yearOfBirthRef = useRef(null)
  const genderRef = useRef(null)
  const countryRef = useRef(null)
  const industryRef = useRef(null)
  const experienceRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Profile tab dropdowns
      if (phoneCountryRef.current && !phoneCountryRef.current.contains(event.target)) {
        setShowPhoneCountryDropdown(false)
      }
      if (yearOfBirthRef.current && !yearOfBirthRef.current.contains(event.target)) {
        setShowYearOfBirthDropdown(false)
      }
      if (genderRef.current && !genderRef.current.contains(event.target)) {
        setShowGenderDropdown(false)
      }
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setShowCountryDropdown(false)
      }
      if (industryRef.current && !industryRef.current.contains(event.target)) {
        setShowIndustryDropdown(false)
      }
      if (experienceRef.current && !experienceRef.current.contains(event.target)) {
        setShowExperienceDropdown(false)
      }
      // General tab dropdowns
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false)
      }
      if (timeZoneDropdownRef.current && !timeZoneDropdownRef.current.contains(event.target)) {
        setShowTimeZoneDropdown(false)
      }
      if (dateFormatDropdownRef.current && !dateFormatDropdownRef.current.contains(event.target)) {
        setShowDateFormatDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Load user profile data on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true)
        const response = await getUserProfile()
        const user = response.details?.user

        if (user) {
          setUsername(user.username || '')
          setDisplayName(user.display_name || user.first_name || '')
          setFullName(`${user.first_name || ''} ${user.last_name || ''}`.trim())
          setEmail(user.email || '')
          setPhoneNumber(user.phone_number || '')
          setYearOfBirth(user.dob ? new Date(user.dob).getFullYear().toString() : '2004')
          setGender(user.gender || 'Male')
          setCountry(user.country || 'Pakistan')
          setJobTitle(user.job_title || '')
          setIndustry(user.industry || '')
          setYearsOfExperience(user.years_of_experience || '5-10 years')
          setProfileImageUrl(user.profile_image_url || null)
        }
      } catch (error) {
        console.error('Failed to load user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  // Save Basic Information
  const handleSaveBasicInfo = async () => {
    try {
      setIsSaving(true)
      const [firstName, ...lastNameParts] = fullName.split(' ')
      const lastName = lastNameParts.join(' ')

      await updateUserProfile({
        username,
        display_name: displayName,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        dob: yearOfBirth ? `${yearOfBirth}-01-01` : undefined,
        gender,
        country
      })

      // Refresh auth context to update header
      await refreshProfile()

      success('Basic information saved successfully!')
    } catch (error) {
      console.error('Failed to save basic info:', error)
      showError('Failed to save basic information. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Save Professional Information
  const handleSaveProfessionalInfo = async () => {
    try {
      setIsSaving(true)

      await updateUserProfile({
        job_title: jobTitle,
        industry,
        years_of_experience: yearsOfExperience
      })

      // Refresh auth context to update header
      await refreshProfile()

      success('Professional information saved successfully!')
    } catch (error) {
      console.error('Failed to save professional info:', error)
      showError('Failed to save professional information. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle profile image change
  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.match(/^image\/(png|jpe?g)$/)) {
      showError('Please upload a PNG or JPG image.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB.')
      return
    }

    try {
      setProfileImageFile(file)

      // Upload image
      const uploadData = await getPresignedUrl(file.name, file.type, 'profile-images')

      await uploadToS3(uploadData.uploadUrl, file)

      const imageUrl = uploadData.fileUrl
      setProfileImageUrl(imageUrl)

      // Update profile with new image URL
      await updateUserProfile({ profile_image_url: imageUrl })

      // Refresh auth context to update header
      await refreshProfile()

      success('Profile image updated successfully!')
    } catch (error) {
      console.error('Failed to upload profile image:', error)
      showError('Failed to upload profile image. Please try again.')
    }
  }

  // Clear profile image
  const handleClearProfileImage = async () => {
    try {
      await updateUserProfile({ profile_image_url: null })
      setProfileImageUrl(null)
      setProfileImageFile(null)

      // Refresh auth context to update header
      await refreshProfile()

      success('Profile image cleared successfully!')
    } catch (error) {
      console.error('Failed to clear profile image:', error)
      showError('Failed to clear profile image. Please try again.')
    }
  }

  const handleContinueToWorkspace = () => {
    router.push('/home')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <>
      <Head>
        <title>Control Room - Manifestr</title>
        <meta name="description" content="Control Room Settings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white min-h-screen w-full">
        {/* Header */}
        <AppHeader showRightActions={true} />

        {/* Main Content */}
        <main className="pt-[72px] bg-white min-h-screen">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Page Header - Full Width */}
            <motion.div variants={itemVariants} className="pt-12 w-full mb-8">
              <div className="max-w-[1280px] mx-auto px-8">
                <div className="flex flex-col gap-2 mb-6">
                  <h1 className="text-[30px] font-bold leading-[38px] text-[#18181b]">
                    Control Room
                  </h1>
                  <p className="text-[16px] leading-[24px] text-[#71717a]">
                    Manage your account, team, and workspace
                  </p>
                </div>

                {/* Tabs Navigation */}
                <motion.div variants={itemVariants} className="border-b border-[#e4e4e7] overflow-x-auto scrollbar-hide">
                  <div className="flex justify-between items-center gap-6 h-[48px] min-w-max px-2">
                    {tabs.map((tab) => (
                      <motion.button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className={`pb-3 px-1 relative h-full flex items-center justify-center transition-colors whitespace-nowrap ${activeTab === tab
                          ? 'text-[#18181b] font-semibold border-b-2 border-[#18181b]'
                          : 'text-[#71717a] font-medium hover:text-[#18181b]'
                          }`}
                      >
                        <span className="text-[14px] leading-[20px]">{tab}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Content Container */}
            <div className="max-w-[1280px] mx-auto px-8">

              {/* Settings Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'General' ? (
                  <GeneralTabContent
                    isGeneralExpanded={isGeneralExpanded}
                    setIsGeneralExpanded={setIsGeneralExpanded}
                    isAccessibilityExpanded={isAccessibilityExpanded}
                    setIsAccessibilityExpanded={setIsAccessibilityExpanded}
                    themeMode={themeMode}
                    setThemeMode={setThemeMode}
                    language={language}
                    setLanguage={setLanguage}
                    timeZone={timeZone}
                    setTimeZone={setTimeZone}
                    dateFormat={dateFormat}
                    setDateFormat={setDateFormat}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    fontAdjust={fontAdjust}
                    setFontAdjust={setFontAdjust}
                    reducedMotion={reducedMotion}
                    setReducedMotion={setReducedMotion}
                    showLanguageDropdown={showLanguageDropdown}
                    setShowLanguageDropdown={setShowLanguageDropdown}
                    showTimeZoneDropdown={showTimeZoneDropdown}
                    setShowTimeZoneDropdown={setShowTimeZoneDropdown}
                    showDateFormatDropdown={showDateFormatDropdown}
                    setShowDateFormatDropdown={setShowDateFormatDropdown}
                    languageDropdownRef={languageDropdownRef}
                    timeZoneDropdownRef={timeZoneDropdownRef}
                    dateFormatDropdownRef={dateFormatDropdownRef}
                  />
                ) : activeTab === 'Team' ? (
                  <TeamTabContent />
                ) : activeTab === 'Plans' ? (
                  <PlansTabContent />
                ) : activeTab === 'Billings' ? (
                  <BillingsTabContent />
                ) : activeTab === 'Workspace' ? (
                  <WorkspaceTabContent
                    workspaceSubTab={workspaceSubTab}
                    setWorkspaceSubTab={setWorkspaceSubTab}
                  />
                ) : activeTab === 'Security' ? (
                  <SecurityTabContent />
                ) : activeTab === 'Profile' ? (
                  <ProfileTabContent
                    username={username}
                    setUsername={setUsername}
                    displayName={displayName}
                    setDisplayName={setDisplayName}
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    phoneCountry={phoneCountry}
                    setPhoneCountry={setPhoneCountry}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    yearOfBirth={yearOfBirth}
                    setYearOfBirth={setYearOfBirth}
                    gender={gender}
                    setGender={setGender}
                    country={country}
                    setCountry={setCountry}
                    jobTitle={jobTitle}
                    setJobTitle={setJobTitle}
                    industry={industry}
                    setIndustry={setIndustry}
                    yearsOfExperience={yearsOfExperience}
                    setYearsOfExperience={setYearsOfExperience}
                    showPhoneCountryDropdown={showPhoneCountryDropdown}
                    setShowPhoneCountryDropdown={setShowPhoneCountryDropdown}
                    showYearOfBirthDropdown={showYearOfBirthDropdown}
                    setShowYearOfBirthDropdown={setShowYearOfBirthDropdown}
                    showGenderDropdown={showGenderDropdown}
                    setShowGenderDropdown={setShowGenderDropdown}
                    showCountryDropdown={showCountryDropdown}
                    setShowCountryDropdown={setShowCountryDropdown}
                    showIndustryDropdown={showIndustryDropdown}
                    setShowIndustryDropdown={setShowIndustryDropdown}
                    showExperienceDropdown={showExperienceDropdown}
                    setShowExperienceDropdown={setShowExperienceDropdown}
                    phoneCountryRef={phoneCountryRef}
                    yearOfBirthRef={yearOfBirthRef}
                    genderRef={genderRef}
                    countryRef={countryRef}
                    industryRef={industryRef}
                    experienceRef={experienceRef}
                    profileImageUrl={profileImageUrl}
                    handleProfileImageChange={handleProfileImageChange}
                    handleClearProfileImage={handleClearProfileImage}
                    handleSaveBasicInfo={handleSaveBasicInfo}
                    handleSaveProfessionalInfo={handleSaveProfessionalInfo}
                    isSaving={isSaving}
                  />
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full pb-24"
                  >
                    <div className="bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl p-8 text-center">
                      <p className="text-[16px] leading-[24px] text-[#71717a]">
                        {activeTab} settings coming soon
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  )
}

// General Tab Component
function GeneralTabContent({
  isGeneralExpanded,
  setIsGeneralExpanded,
  isAccessibilityExpanded,
  setIsAccessibilityExpanded,
  themeMode,
  setThemeMode,
  language,
  setLanguage,
  timeZone,
  setTimeZone,
  dateFormat,
  setDateFormat,
  fontSize,
  setFontSize,
  fontAdjust,
  setFontAdjust,
  reducedMotion,
  setReducedMotion,
  showLanguageDropdown,
  setShowLanguageDropdown,
  showTimeZoneDropdown,
  setShowTimeZoneDropdown,
  showDateFormatDropdown,
  setShowDateFormatDropdown,
  languageDropdownRef,
  timeZoneDropdownRef,
  dateFormatDropdownRef,
}) {
  return (
    <motion.div
      key="general"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full pb-24 space-y-6"
    >
      {/* General Settings Section */}
      <SettingsCard
        title="General"
        subtitle="Choose your preferred theme appearance."
        isExpanded={isGeneralExpanded}
        onToggle={() => setIsGeneralExpanded(!isGeneralExpanded)}
      >
        <div className="space-y-6">
          {/* Theme Mode */}
          <div className="max-w-[550px] w-full">
            <label className="block text-[14px] leading-[20px] text-[#18181b] font-medium mb-3">
              Theme Mode
            </label>
            <div className="flex flex-wrap items-center gap-2 p-1">
              {[
                { value: 'light', label: 'Light mode', icon: Sun },
                { value: 'dark', label: 'Dark mode', icon: Moon },
                { value: 'system', label: 'System default', icon: Monitor },
              ].map(({ value, label, icon: Icon }) => (
                <motion.button
                  key={value}
                  onClick={() => setThemeMode(value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${themeMode === value
                    ? 'bg-white border border-[#18181b] shadow-sm'
                    : 'bg-[#fff] border border-[#E4E4E7]'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${themeMode === value ? 'text-[#18181b]' : 'text-[#71717a]'}`} />
                  <span className={`text-[14px] leading-[20px] ${themeMode === value ? 'text-[#18181b] font-medium' : 'text-[#71717a]'
                    }`}>
                    {label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Language Settings */}
          <div className="max-w-[450px] w-full">
            <label className="block text-[14px] leading-[20px] text-[#18181b] font-medium mb-3">
              Language Settings
            </label>
            <div className="relative" ref={languageDropdownRef}>
              <motion.button
                onClick={() => {
                  setShowLanguageDropdown(!showLanguageDropdown)
                  setShowTimeZoneDropdown(false)
                  setShowDateFormatDropdown(false)
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 flex items-center justify-between hover:border-[#18181b] transition-colors"
              >
                <span className="text-[14px] leading-[20px] text-[#18181b]">
                  {language === 'auto-detect' ? 'Auto-detect' : language}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#71717a] transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {showLanguageDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10 overflow-hidden"
                  >
                    {['Auto-detect', 'English', 'Spanish', 'French', 'German'].map((lang) => (
                      <motion.button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang.toLowerCase().replace(' ', '-'))
                          setShowLanguageDropdown(false)
                        }}
                        whileHover={{ backgroundColor: '#f4f4f5' }}
                        className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                      >
                        {lang}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Time Zone & Date Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Zone */}
            <div>
              <label className="block text-[14px] leading-[20px] text-[#18181b] font-medium mb-3">
                Time Zone
              </label>
              <div className="relative" ref={timeZoneDropdownRef}>
                <motion.button
                  onClick={() => {
                    setShowTimeZoneDropdown(!showTimeZoneDropdown)
                    setShowLanguageDropdown(false)
                    setShowDateFormatDropdown(false)
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 flex items-center justify-between hover:border-[#18181b] transition-colors"
                >
                  <span className="text-[14px] leading-[20px] text-[#18181b]">
                    {timeZone === 'auto-detect' ? 'Auto-detect' : timeZone}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#71717a] transition-transform ${showTimeZoneDropdown ? 'rotate-180' : ''}`} />
                </motion.button>
                <AnimatePresence>
                  {showTimeZoneDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10 overflow-hidden"
                    >
                      {['Auto-detect', 'UTC', 'EST', 'PST', 'GMT'].map((tz) => (
                        <motion.button
                          key={tz}
                          onClick={() => {
                            setTimeZone(tz.toLowerCase().replace(' ', '-'))
                            setShowTimeZoneDropdown(false)
                          }}
                          whileHover={{ backgroundColor: '#f4f4f5' }}
                          className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                        >
                          {tz}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Date Format */}
            <div>
              <label className="block text-[14px] leading-[20px] text-[#18181b] font-medium mb-3">
                Date Format
              </label>
              <div className="relative" ref={dateFormatDropdownRef}>
                <motion.button
                  onClick={() => {
                    setShowDateFormatDropdown(!showDateFormatDropdown)
                    setShowLanguageDropdown(false)
                    setShowTimeZoneDropdown(false)
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 flex items-center justify-between hover:border-[#18181b] transition-colors"
                >
                  <span className="text-[14px] leading-[20px] text-[#18181b]">
                    {dateFormat}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#71717a] transition-transform ${showDateFormatDropdown ? 'rotate-180' : ''}`} />
                </motion.button>
                <AnimatePresence>
                  {showDateFormatDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10 overflow-hidden"
                    >
                      {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY'].map((format) => (
                        <motion.button
                          key={format}
                          onClick={() => {
                            setDateFormat(format)
                            setShowDateFormatDropdown(false)
                          }}
                          whileHover={{ backgroundColor: '#f4f4f5' }}
                          className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                        >
                          {format}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[36px] text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save
            </motion.button>
          </div>
        </div>
      </SettingsCard>

      {/* Accessibility Options Section */}
      <SettingsCard
        title="Accessibility Options"
        subtitle="Choose your preferred theme appearance."
        isExpanded={isAccessibilityExpanded}
        onToggle={() => setIsAccessibilityExpanded(!isAccessibilityExpanded)}
      >
        <div className="space-y-6">
          {/* Font Size */}
          <div>
            <label className="block text-[14px] leading-[20px] text-[#18181b] font-medium mb-3">
              Font Size
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {['Small', 'Medium', 'Large'].map((label) => {
                const value = label.toLowerCase()
                const isActive = fontSize === value
                return (
                  <motion.label
                    key={value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`inline-flex items-center gap-2 min-w-[96px] px-4 py-2 rounded-md border text-[14px] leading-[20px] transition-colors cursor-pointer ${isActive
                      ? 'border-[#18181b] bg-white text-[#18181b] font-medium'
                      : 'border-[#e4e4e7] bg-white text-[#71717a] hover:border-[#18181b]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="fontSize"
                      value={value}
                      checked={isActive}
                      onChange={() => setFontSize(value)}
                      className="sr-only"
                    />
                    <span className="flex items-center gap-2">
                      <span
                        className={`flex items-center justify-center w-4 h-4 rounded-full border ${isActive
                          ? 'border-[#18181b] bg-white'
                          : 'border-[#e4e4e7] bg-white'
                          }`}
                      >
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[#18181b]" />
                        )}
                      </span>
                      <span>{label}</span>
                    </span>
                  </motion.label>
                )
              })}
            </div>
          </div>

          {/* Adjust Font */}
          <div>
            <label className="block text-[14px] leading-[20px] text-[#18181b] font-medium mb-3">
              Adjust Font
            </label>
            <div className="space-y-2">
              <div className="relative max-w-[400px] w-full">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fontAdjust}
                  onChange={(e) => setFontAdjust(Number(e.target.value))}
                  className="w-full h-2 rounded-lg cursor-pointer bg-[#ffffff]"
                  style={{
                    background: `linear-gradient(to right, #18181b 0%, #18181b ${fontAdjust}%, #ffffff ${fontAdjust}%, #ffffff 100%)`,
                  }}
                />
                <div
                  className="absolute top-full mt-2 text-[14px] leading-[20px] text-[#71717a] pointer-events-none"
                  style={{
                    left: `${fontAdjust}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {fontAdjust}%
                </div>
              </div>
            </div>
          </div>

          {/* Reduced Motion */}
          <div>
            <div className="flex items-center gap-2">
              <input
                id="reduced-motion"
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 rounded border border-[#E4E4E7]"
              />
              <label
                htmlFor="reduced-motion"
                className="text-[14px] leading-[20px] text-[#18181b]"
              >
                Reduced motion
              </label>
            </div>
          </div>

          {/* High Contrast Mode */}
          <div>
            <div className="flex gap-2 items-center">
              <span className="text-[14px] leading-[20px] text-[#18181b]">
                High contrast mode
              </span>
              <span className="text-[12px] leading-[20px] border border-[#E4E4E7] rounded-full px-1 bg-[#fff] text-[#71717a]">
                Coming soon
              </span>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[36px] text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save
            </motion.button>
          </div>
        </div>
      </SettingsCard>
    </motion.div>
  )
}

// Team Tab Component
function TeamTabContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState(['phoenix'])
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(null)
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All roles')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All roles')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmails, setInviteEmails] = useState(['umarzapta@gmail.com', 'umarzapta@gmail.com'])
  const [selectedRole, setSelectedRole] = useState('Editor')
  const [showRoleModalDropdown, setShowRoleModalDropdown] = useState(false)
  const [selectedCollabs, setSelectedCollabs] = useState(['collab1', 'collab4'])
  const [emailInput, setEmailInput] = useState('')

  const roleDropdownRef = useRef(null)
  const statusDropdownRef = useRef(null)
  const roleModalDropdownRef = useRef(null)
  const modalRef = useRef(null)

  const teamMembers = [
    {
      id: 'phoenix',
      name: 'Phoenix Ba...',
      email: 'phoenix@g...',
      role: 'Owner',
      status: 'Active',
      collabs: 12,
      lastActive: '2 hours ago',
      avatar: '/assets/dummy/avatar.png',
    },
    {
      id: 'drew',
      name: 'Drew Cano',
      email: 'drew@gma...',
      role: 'Admin',
      status: 'Active',
      collabs: 6,
      lastActive: '1 day ago',
      avatar: '/assets/dummy/avatar.png',
    },
    {
      id: 'table',
      name: 'Table Cell...',
      email: 'phoenix@g...',
      role: 'Editor',
      status: 'Active',
      collabs: 15,
      lastActive: '20 mints ago',
      avatar: '/assets/dummy/avatar.png',
    },
    {
      id: 'natali',
      name: 'Natali Creg',
      email: 'natali@gm...',
      role: 'Editor',
      status: 'Pending',
      collabs: 0,
      lastActive: 'Never',
      avatar: '/assets/dummy/avatar.png',
    },
    {
      id: 'umar',
      name: 'Umar Islam',
      email: 'umar@gma...',
      role: 'Viewer',
      status: 'Active',
      collabs: 0,
      lastActive: '21 August 2025',
      avatar: '/assets/dummy/avatar.png',
    },
  ]

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false)
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false)
      }
      if (roleModalDropdownRef.current && !roleModalDropdownRef.current.contains(event.target)) {
        setShowRoleModalDropdown(false)
      }
      if (showActionsMenu && !event.target.closest('.actions-menu')) {
        setShowActionsMenu(null)
      }
      if (modalRef.current && !modalRef.current.contains(event.target) && showInviteModal) {
        // Don't close on backdrop click - only via close button
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showActionsMenu, showInviteModal])

  // Modal helper functions
  const removeEmail = (index) => {
    setInviteEmails(prev => prev.filter((_, i) => i !== index))
  }

  const addEmail = () => {
    if (emailInput.trim() && !inviteEmails.includes(emailInput.trim())) {
      setInviteEmails(prev => [...prev, emailInput.trim()])
      setEmailInput('')
    }
  }

  const handleEmailKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addEmail()
    }
  }

  const toggleCollab = (collabId) => {
    setSelectedCollabs(prev =>
      prev.includes(collabId)
        ? prev.filter(id => id !== collabId)
        : [...prev, collabId]
    )
  }

  // Dummy collabs data
  const collabs = [
    { id: 'collab1', name: 'Manifestr Collab', avatar: '/assets/dummy/avatar.png' },
    { id: 'collab2', name: 'Manifestr Collab', avatar: '/assets/dummy/avatar.png' },
    { id: 'collab3', name: 'Manifestr Collab', avatar: '/assets/dummy/avatar.png' },
    { id: 'collab4', name: 'Manifestr Collab', avatar: '/assets/dummy/avatar.png' },
    { id: 'collab5', name: 'Manifestr Collab', avatar: '/assets/dummy/avatar.png' },
    { id: 'collab6', name: 'Manifestr Collab', avatar: '/assets/dummy/avatar.png' },
  ]

  return (
    <motion.div
      key="team"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full pb-24 space-y-6"
    >
      {/* Team Management Card Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-xl overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Section - Title and Description */}
          <div className="w-full lg:w-[260px] bg-[#f4f4f4] px-6 py-6 border-b border-[#e4e4e7] lg:border-b-0 lg:border-r">
            <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b]">
              Team Management
            </h3>
            <p className="text-[14px] leading-[20px] text-[#71717a]">
              Manage all team members and their access levels
            </p>
          </div>

          {/* Right Section - Seat Usage Card */}
          <div className="flex-1 bg-[#f4f4f4] px-6 py-6">
            <div className="bg-white border border-[#e4e4e7] rounded-xl px-6 py-2 flex flex-col gap-6 lg:flex-row lg:items-center">
              {/* Seat usage title and count */}
              <div className="flex flex-col gap-1">
                <span className="text-[12px] leading-[16px] text-[#71717a]">
                  Seat Usage
                </span>
                <span className="text-[20px] font-semibold leading-[30px] text-[#18181b]">
                  8 of 10 seats
                </span>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
                {/* Gauge */}
                <div className="relative w-[200px] h-[110px] flex items-end justify-center overflow-hidden">
                  <svg
                    className="w-[200px] h-[170px] transform rotate-180 translate-y-17"
                    viewBox="0 0 80 80"
                  >
                    {/* Background half-circle */}
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="#e4e4e7"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.PI * 32} ${2 * Math.PI * 32}`}
                      strokeDashoffset={0}
                    />
                    {/* Used half-circle (80%) */}
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.PI * 32} ${2 * Math.PI * 32}`}
                      strokeDashoffset={Math.PI * 32 * (1 - 0.8)}
                    />
                  </svg>
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[12px] leading-[16px] text-[#71717a]">
                      USED
                    </span>
                    <span className="text-[24px] leading-[32px] font-semibold text-[#18181b]">
                      80%
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-1 items-center justify-end gap-8">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-[#f4f4f5] flex items-center justify-center">
                        <Gift className="w-4 h-4 text-[#71717a]" />
                      </div>

                      <span className="text-[12px] leading-[16px] text-[#71717a]">
                        Gifted Seats
                      </span>
                      <span className="text-[18px] leading-[24px] font-semibold text-[#18181b]">
                        2
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-[#e4e4e7]" />
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-[#f4f4f5] flex items-center justify-center">
                        <Clock className="w-4 h-4 text-[#71717a]" />
                      </div>

                      <span className="text-[12px] leading-[16px] text-[#71717a]">
                        Pending Invites
                      </span>
                      <span className="text-[18px] leading-[24px] font-semibold text-[#18181b]">
                        1
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Members Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative z-10 bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl"
      >
        <div className="flex flex-wrap justify-between mb-2">
          {/* Section Header */}
          <div className="p-6 pb-4">
            <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b] mb-1">
              Team Members
            </h3>
            <p className="text-[16px] leading-[24px] text-[#71717a]">
              Manage user roles and permissions
            </p>
          </div>

          {/* Toolbar */}
          <div className="px-6 flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#71717a]" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#e4e4e7] rounded-md pl-10 pr-10 py-2 text-[16px] leading-[24px] text-[#18181b] outline-none focus:border-[#18181b] transition-colors"
              />
              <HelpCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#71717a]" />
            </div>

            {/* Role Filter */}
            <div className="relative" ref={roleDropdownRef}>
              <motion.button
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown)
                  setShowStatusDropdown(false)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-[#e4e4e7] rounded-md px-4 py-2 h-[40px] flex items-center gap-2 hover:border-[#18181b] transition-colors"
              >
                <span className="text-[14px] leading-[20px] text-[#18181b]">{selectedRoleFilter}</span>
                <ChevronDown className={`w-4 h-4 text-[#71717a] transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {showRoleDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10 min-w-[140px]"
                  >
                    {['All roles', 'Owner', 'Admin', 'Editor', 'Viewer'].map((role) => (
                      <motion.button
                        key={role}
                        onClick={() => {
                          setSelectedRoleFilter(role)
                          setShowRoleDropdown(false)
                        }}
                        whileHover={{ backgroundColor: '#f4f4f5' }}
                        className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                      >
                        {role}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status Filter */}
            <div className="relative" ref={statusDropdownRef}>
              <motion.button
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown)
                  setShowRoleDropdown(false)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-[#e4e4e7] rounded-md px-4 py-2 h-[40px] flex items-center gap-2 hover:border-[#18181b] transition-colors"
              >
                <span className="text-[14px] leading-[20px] text-[#18181b]">{selectedStatusFilter}</span>
                <ChevronDown className={`w-4 h-4 text-[#71717a] transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {showStatusDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10 min-w-[140px]"
                  >
                    {['All roles', 'Active', 'Pending'].map((status) => (
                      <motion.button
                        key={status}
                        onClick={() => {
                          setSelectedStatusFilter(status)
                          setShowStatusDropdown(false)
                        }}
                        whileHover={{ backgroundColor: '#f4f4f5' }}
                        className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                      >
                        {status}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Invite User Button */}
            <motion.button
              onClick={() => setShowInviteModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-[14px] font-medium leading-[20px]">Invite user</span>
            </motion.button>
          </div>
        </div>

        {/* Table */}
        <div className="px-6 pb-6">
          <div className="bg-white border border-[#e4e4e7] rounded-md">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-4 bg-[#fff] border-b border-[#e4e4e7] px-4 py-3">
              <div className="text-[14px] font-medium leading-[20px] text-[#71717A]">User name</div>
              <div className="text-[14px] font-medium leading-[20px] text-[#71717A]">Rule</div>
              <div className="text-[14px] font-medium leading-[20px] text-[#71717A]">Status</div>
              <div className="text-[14px] font-medium leading-[20px] text-[#71717A]">Collabs</div>
              <div className="text-[14px] font-medium leading-[20px] text-[#71717A]">Last active</div>
              <div className="text-[14px] font-medium leading-[20px] text-[#71717A] text-right">Actions</div>
            </div>

            {/* Table Rows */}
            <AnimatePresence>
              {teamMembers.map((member, index) => {
                const isSelected = selectedUsers.includes(member.id)
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-4 px-4 py-3 border-b border-[#e4e4e7] last:border-b-0 transition-colors ${isSelected ? 'bg-[#f4f4f5]' : 'bg-white hover:bg-[#fafafa]'
                      }`}
                  >
                    {/* User Name */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleUserSelection(member.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${isSelected
                          ? 'bg-[#22c55e] border-[#22c55e]'
                          : 'bg-white border-[#e4e4e7]'
                          }`}
                      >
                        {isSelected && (
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        )}
                      </button>
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                          {member.name}
                        </p>
                        <p className="text-[12px] leading-[16px] text-[#71717a]">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="flex items-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e4e4e7] text-[12px] font-medium leading-[16px] text-[#18181b]">
                        {member.role === 'Owner' && (
                          <Crown className="w-3.5 h-3.5 text-[#18181b]" />
                        )}
                        {member.role === 'Admin' && (
                          <UserCog className="w-3.5 h-3.5 text-[#18181b]" />
                        )}
                        {member.role === 'Editor' && (
                          <Pencil className="w-3.5 h-3.5 text-[#18181b]" />
                        )}
                        {member.role === 'Viewer' && (
                          <Eye className="w-3.5 h-3.5 text-[#18181b]" />
                        )}
                        <span>{member.role}</span>
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <span className="px-3 py-1 rounded-full border border-[#e4e4e7] bg-white text-[12px] font-medium leading-[16px] text-[#3f3f46]">
                        {member.status}
                      </span>
                    </div>

                    {/* Collabs */}
                    <div className="flex items-center">
                      <span className="text-[14px] leading-[20px] text-[#18181b]">
                        {member.collabs}
                      </span>
                    </div>

                    {/* Last Active */}
                    <div className="flex items-center">
                      <span className="text-[14px] leading-[20px] text-[#71717a]">
                        {member.lastActive}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end relative actions-menu">
                      <motion.button
                        onClick={() =>
                          setShowActionsMenu(showActionsMenu === member.id ? null : member.id)
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 hover:bg-[#f4f4f5] rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-[#71717a]" />
                      </motion.button>
                      <AnimatePresence>
                        {showActionsMenu === member.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-full mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 min-w-[160px]"
                          >
                            <motion.button
                              whileHover={{ backgroundColor: '#f4f4f5' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b] flex items-center gap-2"
                            >
                              Edit Role
                            </motion.button>
                            <motion.button
                              whileHover={{ backgroundColor: '#f4f4f5' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b] flex items-center gap-2"
                            >
                              View Details
                            </motion.button>
                            <div className="border-t border-[#e4e4e7] my-1" />
                            <motion.button
                              whileHover={{ backgroundColor: '#fee2e2' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#e52f2f] flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Selected Row Actions */}
          {selectedUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 flex justify-center"
            >
              <div className="bg-[#18181b] rounded-xl px-2 py-1 flex items-center gap-2 shadow-lg">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[#ef4444] text-[13px] leading-[18px]"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 rounded-lg bg-[#FFFFFF38] text-white text-[13px] leading-[18px]"
                >
                  Role Assignment
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 rounded-lg bg-[#FFFFFF38] text-white text-[13px] leading-[18px]"
                >
                  Collab Reassignment
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Role Types & Permissions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl overflow-hidden"
      >
        {/* Section Header */}
        <div className="p-6 pb-4">
          <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b] mb-1">
            Role Types & Permissions
          </h3>
          <p className="text-[16px] leading-[24px] text-[#71717a]">
            Understanding access levels and capabilities
          </p>
        </div>

        {/* Role Cards */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white border border-[#e8e8e9] rounded-xl p-4"
            >
              <div className="mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e4e4e7] bg-[#f4f4f5] text-[12px] font-medium leading-[16px] text-[#18181b]">
                  <Crown className="w-3.5 h-3.5 text-[#18181b]" />
                  <span>Owner</span>
                </span>
              </div>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Full access to billing, settings, users, all Collabs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white border border-[#e8e8e9] rounded-xl p-4"
            >
              <div className="mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e4e4e7] bg-[#f4f4f5] text-[12px] font-medium leading-[16px] text-[#18181b]">
                  <UserCog className="w-3.5 h-3.5 text-[#18181b]" />
                  <span>Admin</span>
                </span>
              </div>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Manage users, edit settings, access all tools
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white border border-[#e8e8e9] rounded-xl p-4"
            >
              <div className="mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e4e4e7] bg-[#f4f4f5] text-[12px] font-medium leading-[16px] text-[#18181b]">
                  <Pencil className="w-3.5 h-3.5 text-[#18181b]" />
                  <span>Editor</span>
                </span>
              </div>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Create and edit Collabs, no access to billing or team settings
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white border border-[#e8e8e9] rounded-xl p-4"
            >
              <div className="mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e4e4e7] bg-[#f4f4f5] text-[12px] font-medium leading-[16px] text-[#18181b]">
                  <Eye className="w-3.5 h-3.5 text-[#18181b]" />
                  <span>Viewer</span>
                </span>
              </div>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Read-only access to shared Collabs or documents
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Invite User Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowInviteModal(false)
              }
            }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#e4e4e7] rounded-lg w-full max-w-[616px] max-h-[90vh] overflow-hidden flex flex-col my-auto"
            >
              {/* Modal Header */}
              <div className="border-b border-[#e4e4e7] p-4 relative">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                    Invite user
                  </h3>
                  <motion.button
                    onClick={() => setShowInviteModal(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f4f4f5] transition-colors"
                  >
                    <X className="w-5 h-5 text-[#71717a]" />
                  </motion.button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Invite Users Input */}
                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Invite Users
                  </label>
                  <div className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 min-h-[40px] flex flex-wrap gap-2 items-center">
                    {inviteEmails.map((email, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white border border-[#e4e4e7] rounded-md pl-[9px] pr-1 py-0.5 flex items-center gap-1.5"
                      >
                        <span className="text-[14px] font-medium leading-[20px] text-[#464649] whitespace-nowrap">
                          {email}
                        </span>
                        <motion.button
                          onClick={() => removeEmail(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-0.5 rounded hover:bg-[#f4f4f5] transition-colors flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-[#71717a]" />
                        </motion.button>
                      </motion.div>
                    ))}
                    <input
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={handleEmailKeyPress}
                      onBlur={addEmail}
                      placeholder={inviteEmails.length === 0 ? "Enter email addresses..." : ""}
                      className="flex-1 min-w-[120px] outline-none text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] bg-transparent"
                    />
                  </div>
                </div>

                {/* Role Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Role
                  </label>
                  <div className="relative" ref={roleModalDropdownRef}>
                    <motion.button
                      onClick={() => {
                        setShowRoleModalDropdown(!showRoleModalDropdown)
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 h-[40px] flex items-center justify-between hover:border-[#18181b] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Pencil className="w-5 h-5 text-[#71717a]" />
                        <span className="text-[16px] leading-[24px] text-[#18181b]">
                          {selectedRole}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-[#71717a] transition-transform ${showRoleModalDropdown ? 'rotate-180' : ''}`} />
                    </motion.button>
                    <AnimatePresence>
                      {showRoleModalDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10"
                        >
                          {['Owner', 'Admin', 'Editor', 'Viewer'].map((role) => (
                            <motion.button
                              key={role}
                              onClick={() => {
                                setSelectedRole(role)
                                setShowRoleModalDropdown(false)
                              }}
                              whileHover={{ backgroundColor: '#f4f4f5' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                            >
                              {role}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Assign Collabs Section */}
                <div className="space-y-4">
                  <h4 className="text-[16px] font-medium leading-[24px] text-[#18181b]">
                    Assign Collab's
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {collabs.map((collab, index) => {
                      const isSelected = selectedCollabs.includes(collab.id)
                      return (
                        <motion.div
                          key={collab.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleCollab(collab.id)}
                          className={`border rounded-md p-3 cursor-pointer transition-colors w-[280px] ${isSelected
                            ? 'bg-[#f4f4f5] border-[#18181b]'
                            : 'bg-white border-[#e4e4e7] hover:border-[#18181b]'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-8 h-8 rounded-full border border-[rgba(0,0,0,0.08)] overflow-hidden shrink-0">
                                <Image
                                  src={collab.avatar}
                                  alt={collab.name}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-[16px] font-semibold leading-[24px] text-[#09090b] truncate">
                                {collab.name}
                              </p>
                            </div>
                            <motion.div
                              initial={false}
                              animate={{
                                backgroundColor: isSelected ? '#18181b' : 'transparent',
                                borderColor: isSelected ? '#18181b' : '#e4e4e7',
                              }}
                              className="w-4 h-4 border-2 rounded flex items-center justify-center shrink-0 ml-2"
                            >
                              {isSelected && (
                                <motion.svg
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  viewBox="0 0 12 12"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2 6l3 3 5-5"
                                  />
                                </motion.svg>
                              )}
                            </motion.div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Alert/Info Section */}
                <div className="bg-[#fafafa] rounded-lg h-11 flex items-center px-4">
                  {/* Alert content can be added here if needed */}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-[#e4e4e7] p-4 flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-1 py-1 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] rounded-md transition-colors"
                >
                  Help?
                </motion.button>
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setShowInviteModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-[#e4e4e7] rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      // Handle send invite
                      setShowInviteModal(false)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
                  >
                    Send Invite
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Plans Tab Component
function PlansTabContent() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [addedAddOns, setAddedAddOns] = useState(['strategist'])

  const toggleAddOn = (addOnId) => {
    setAddedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    )
  }

  return (
    <motion.div
      key="plans"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full pb-24 space-y-6"
    >
      {/* You're on Pro Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-xl overflow-hidden"
      >
        {/* Section Header */}
        <div className="p-6 pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between h-auto md:h-[52px] gap-4 md:gap-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                  You're on Pro
                </h3>
                <div className="bg-[#18181b] border border-[#18181b] rounded-2xl px-2 py-0.5 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-white" />
                  <span className="text-[12px] font-medium leading-[18px] text-white">
                    Founding member
                  </span>
                </div>
              </div>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Next billing: August 1, 2026
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1.5 items-end">
                <p className="text-[14px] font-medium leading-[20px] text-[#18181b]">
                  Monthly
                </p>
              </div>
              <ToggleSwitch
                checked={isAnnual}
                onChange={(checked) => setIsAnnual(checked)}
              />
              <div className="flex flex-col gap-1.5 items-start">
                <p className="text-[14px] font-medium leading-[20px] text-[#18181b]">
                  Annual
                </p>
                <p className="text-[14px] leading-[20px] text-[#71717a]">
                  Save 20%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Metrics */}
        <div className="p-6 space-y-4">
          {/* First Row - Seats Used & AI Wins */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Seats Used Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex-1 bg-white border border-[#e2e4e9] rounded-xl p-4 h-[100px]"
            >
              <p className="text-[16px] font-semibold leading-[24px] text-[#52525b] mb-2">
                Seats Used
              </p>
              <div className="flex flex-col gap-2 items-end">
                <div className="w-full h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-[#18181b] rounded-full"
                  />
                </div>
                <p className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                  5/5
                </p>
              </div>
            </motion.div>

            {/* AI Wins Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex-1 bg-white border border-[#e2e4e9] rounded-xl p-4 h-[100px]"
            >
              <p className="text-[16px] font-semibold leading-[24px] text-[#52525b] mb-2">
                AI Wins
              </p>
              <div className="flex flex-col gap-2 items-end">
                <div className="w-full h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-[#18181b] rounded-full"
                  />
                </div>
                <p className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                  2000/2000
                </p>
              </div>
            </motion.div>
          </div>

          {/* Second Row - Tools Access & Brand Guides */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Tools Access Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex-1 bg-white border border-[#e2e4e9] rounded-xl p-4 h-[100px] flex flex-col justify-center"
            >
              <p className="text-[16px] font-semibold leading-[24px] text-[#52525b] mb-2">
                Tools Access
              </p>
              <div className="flex gap-2">
                <div className="border border-[#e4e4e7] rounded-2xl px-1.5 py-0.5 flex items-center gap-1 bg-white/80">
                  <Presentation className="w-3 h-3 text-[#71717a]" />
                  <span className="text-[12px] font-medium leading-[18px] text-[#71717a]">
                    The Deck
                  </span>
                </div>
                <div className="border border-[#e4e4e7] rounded-2xl px-1.5 py-0.5 flex items-center gap-1 bg-white/80">
                  <Briefcase className="w-3 h-3 text-[#71717a]" />
                  <span className="text-[12px] font-medium leading-[18px] text-[#71717a]">
                    Briefcase
                  </span>
                </div>
                <div className="border border-[#e4e4e7] rounded-2xl px-1.5 py-0.5 flex items-center gap-1 bg-white/80">
                  <Loader className="w-3 h-3 text-[#71717a]" />
                  <span className="text-[12px] font-medium leading-[18px] text-[#71717a]">
                    Analyzer
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Brand Guides Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex-1 bg-white border border-[#e2e4e9] rounded-xl p-4 h-[100px] border-b border-[#e4e4e7]"
            >
              <p className="text-[16px] font-semibold leading-[24px] text-[#52525b] mb-2">
                Brand Guides
              </p>
              <div className="flex flex-col gap-2 items-end">
                <div className="w-full h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '50%' }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-[#18181b] rounded-l-full"
                  />
                </div>
                <p className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                  2/4
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e4e4e7] p-4 flex items-center justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
          >
            Upgrade
          </motion.button>
        </div>
      </motion.div>

      {/* Add-Ons Marketplace Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-xl overflow-hidden"
      >
        {/* Section Header */}
        <div className="p-6 pb-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
              Add-Ons Marketplace
            </h3>
            <p className="text-[14px] leading-[20px] text-[#71717a]">
              Enhance your plan with additional features
            </p>
          </div>
        </div>

        {/* Add-Ons Grid */}
        <div className="p-6 space-y-4">
          {/* First Row */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Design Studio Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex-1 bg-white border border-[#e2e4e9] rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-violet-100 border border-[#ddd6ff] rounded-md flex items-center justify-center">
                    <Palette className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold leading-[18px] text-[#18181b]">
                      Design Studio Pro
                    </p>
                    <p className="text-[12px] leading-[18px] text-[#71717a]">
                      HD image rendering, video generation
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <motion.button
                    onClick={() => toggleAddOn('design-studio')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] transition-opacity ${addedAddOns.includes('design-studio')
                      ? 'bg-white border border-[#e4e4e7] text-[#18181b] opacity-50'
                      : 'bg-[#18181b] text-white hover:opacity-90'
                      }`}
                  >
                    {addedAddOns.includes('design-studio') ? 'Added' : 'Add'}
                  </motion.button>
                  <p className="text-[12px] font-semibold leading-[18px] text-[#71717a]">
                    $19/month
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Strategist+ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex-1 bg-white border border-[#e2e4e9] rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-yellow-100 border border-[#fee685] rounded-md flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold leading-[18px] text-[#18181b]">
                      Strategist+
                    </p>
                    <p className="text-[12px] leading-[18px] text-[#71717a]">
                      Enhanced business model tools, AI insight bank
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <motion.button
                    onClick={() => toggleAddOn('strategist')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] transition-opacity ${addedAddOns.includes('strategist')
                      ? 'bg-white border border-[#e4e4e7] text-[#18181b] opacity-50'
                      : 'bg-[#18181b] text-white hover:opacity-90'
                      }`}
                  >
                    {addedAddOns.includes('strategist') ? 'Added' : 'Add'}
                  </motion.button>
                  <p className="text-[12px] font-semibold leading-[18px] text-[#71717a]">
                    $29/month
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Second Row */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Additional AI Wins */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex-1 bg-white border border-[#e2e4e9] rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 border border-[#bedbff] rounded-md flex items-center justify-center">
                    <Stars className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold leading-[18px] text-[#18181b]">
                      Additional AI Wins
                    </p>
                    <p className="text-[12px] leading-[18px] text-[#71717a]">
                      1,000 extra Wins per month
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <motion.button
                    onClick={() => toggleAddOn('ai-wins')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] transition-opacity ${addedAddOns.includes('ai-wins')
                      ? 'bg-white border border-[#e4e4e7] text-[#18181b] opacity-50'
                      : 'bg-[#18181b] text-white hover:opacity-90'
                      }`}
                  >
                    {addedAddOns.includes('ai-wins') ? 'Added' : 'Add'}
                  </motion.button>
                  <p className="text-[12px] font-semibold leading-[18px] text-[#71717a]">
                    $10/month
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Storage Upgrade */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex-1 bg-white border border-[#e2e4e9] rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 border border-[#a4f4cf] rounded-md flex items-center justify-center">
                    <Database className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold leading-[18px] text-[#18181b]">
                      Storage Upgrade
                    </p>
                    <p className="text-[12px] leading-[18px] text-[#71717a]">
                      +100GB storage space
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <motion.button
                    onClick={() => toggleAddOn('storage')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] transition-opacity ${addedAddOns.includes('storage')
                      ? 'bg-white border border-[#e4e4e7] text-[#18181b] opacity-50'
                      : 'bg-[#18181b] text-white hover:opacity-90'
                      }`}
                  >
                    {addedAddOns.includes('storage') ? 'Added' : 'Upgrade'}
                  </motion.button>
                  <p className="text-[12px] font-semibold leading-[18px] text-[#71717a]">
                    $15/month
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Add Team Members Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-[#18181b] rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-[#18181b]" />
            </div>
            <div>
              <p className="text-[16px] font-semibold leading-[24px] text-white">
                Add Team Members
              </p>
              <p className="text-[12px] leading-[18px] text-[#a1a1aa]">
                $12/user/month • Pricing is pro-rated
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-[#18181b] rounded-md px-4 py-2 h-[40px] flex items-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
          >
            <UserPlus className="w-4 h-4" />
            Add seats
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Billings Tab Component
function BillingsTabContent() {
  const [billingEmail, setBillingEmail] = useState('umar@company.com')
  const [companyName, setCompanyName] = useState('Manifestr LLC')
  const [promoCode, setPromoCode] = useState('')

  const invoices = [
    { id: 'INV-2024-001', date: '1/1/2024', description: 'Pro Plan - Annual', amount: '$69.00', status: 'Paid' },
    { id: 'INV-2023-012', date: '12/1/2023', description: 'Strategist+ Add-...', amount: '$29.00', status: 'Paid' },
    { id: 'INV-2023-011', date: '11/1/2023', description: 'Pro Plan - Month...', amount: '$69.00', status: 'Paid' },
    { id: 'INV-2023-010', date: '10/1/2023', description: 'Pro Plan - Month...', amount: '$69.00', status: 'Paid' },
    { id: 'INV-2023-010', date: '1/1/2023', description: 'Pro Plan - Annual', amount: '$399.00', status: 'Failed' },
  ]

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-[#d1fae5] text-[#065f46]'
      case 'Failed': return 'bg-[#fee2e2] text-[#991b1b]'
      default: return 'bg-[#f4f4f5] text-[#71717a]'
    }
  }

  return (
    <motion.div
      key="billings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full pb-24"
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Plan Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl overflow-hidden"
          >
            <div className="p-6 pb-0">
              <div className="flex flex-col gap-1 mb-6">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                  Plan Overview
                </h3>
                <p className="text-[14px] leading-[20px] text-[#71717a]">
                  Your current subscription and upcoming charges
                </p>
              </div>
            </div>
            <div className="p-6 pt-0 space-y-6">
              {/* Current Plan */}
              <div className="space-y-2">
                <p className="text-[14px] leading-[20px] text-[#52525b]">Current Plan</p>
                <div className="flex items-center gap-2">
                  <p className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                    Pro - Annual
                  </p>
                  <div className="bg-[#18181b] border border-[#18181b] rounded-2xl pl-1.5 pr-2 py-0.5 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-white" />
                    <span className="text-[12px] font-medium leading-[18px] text-white">
                      Founding member
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Billing */}
              <div className="space-y-2">
                <p className="text-[14px] leading-[20px] text-[#52525b]">Next Billing</p>
                <p className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                  August 1, 2026
                </p>
              </div>

              {/* Estimated Next Charge */}
              <div className="space-y-2">
                <p className="text-[14px] leading-[20px] text-[#52525b]">Estimated Next Charge</p>
                <p className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                  $58.00
                </p>
              </div>

              {/* Founding Member Discount Alert */}
              <div className="bg-white border border-[#e4e4e7] rounded-lg p-4 flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  <Gift className="w-5 h-5 text-[#18181b]" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold leading-[20px] text-[#18181b] mb-1">
                    Founding Member Discount Active
                  </p>
                  <p className="text-[14px] leading-[20px] text-[#71717a]">
                    You're saving $11/month with your founding member pricing.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Method Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl overflow-hidden"
          >
            <div className="p-6 pb-0">
              <div className="flex flex-col gap-1 mb-6">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                  Payment Method
                </h3>
                <p className="text-[14px] leading-[20px] text-[#71717a]">
                  Your default payment method
                </p>
              </div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {/* Credit Card Info */}
              <div className="bg-white border border-[#e2e4e9] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 text-[#18181b]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                      **** **** **** 4242
                    </p>
                    <p className="text-[14px] leading-[20px] text-[#71717a]">
                      Expires 12/2025
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white border border-[#e4e4e7] rounded-md px-4 py-2 h-[40px] flex items-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors shrink-0"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </motion.button>
              </div>

              {/* Add New Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
              >
                Add new
              </motion.button>
            </div>
          </motion.div>

          {/* Billing Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl overflow-hidden"
          >
            <div className="p-6 pb-0">
              <div className="flex flex-col gap-1 mb-6">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                  Billing Contact
                </h3>
                <p className="text-[14px] leading-[20px] text-[#71717a]">
                  Who should receive billing communications
                </p>
              </div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {/* Billing Email */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                  Billing Email
                </label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 h-[40px] text-[16px] leading-[24px] text-[#18181b] outline-none focus:border-[#18181b] transition-colors"
                />
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 h-[40px] text-[16px] leading-[24px] text-[#18181b] outline-none focus:border-[#18181b] transition-colors"
                />
              </div>

              {/* Update Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
              >
                Update Billing Info
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-6">
          {/* Invoice History Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl overflow-hidden"
          >
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                    Invoice History
                  </h3>
                  <p className="text-[14px] leading-[20px] text-[#71717a]">
                    Download and view your billing history
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] flex items-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  Export all
                </motion.button>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="bg-white border border-[#e4e4e7] rounded-md overflow-hidden overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-[129px_102px_154px_93px_91px_118px] gap-4 bg-[#f4f4f5] border-b border-[#e4e4e7] px-4 py-3">
                  <div className="text-[14px] font-semibold leading-[20px] text-[#18181b]">Invoice</div>
                  <div className="text-[14px] font-semibold leading-[20px] text-[#18181b]">Date</div>
                  <div className="text-[14px] font-semibold leading-[20px] text-[#18181b]">Descriptions</div>
                  <div className="text-[14px] font-semibold leading-[20px] text-[#18181b]">Amount</div>
                  <div className="text-[14px] font-semibold leading-[20px] text-[#18181b]">Status</div>
                  <div className="text-[14px] font-semibold leading-[20px] text-[#18181b]">Actions</div>
                </div>

                {/* Table Rows */}
                <AnimatePresence>
                  {invoices.map((invoice, index) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="grid grid-cols-[129px_102px_154px_93px_91px_118px] gap-4 px-4 py-3 border-b border-[#e4e4e7] last:border-b-0 bg-white hover:bg-[#fafafa] transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-[14px] leading-[20px] text-[#18181b]">
                          {invoice.id}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[14px] leading-[20px] text-[#18181b]">
                          {invoice.date}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[14px] leading-[20px] text-[#18181b]">
                          {invoice.description}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[14px] leading-[20px] text-[#18181b]">
                          {invoice.amount}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-3 py-1.5 rounded-md text-[12px] font-medium leading-[18px] ${getStatusBadgeColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        {invoice.status === 'Failed' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 flex items-center justify-center hover:bg-[#f4f4f5] rounded transition-colors"
                          >
                            <RefreshCw className="w-4 h-4 text-[#71717a]" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 flex items-center justify-center hover:bg-[#f4f4f5] rounded transition-colors"
                        >
                          <Download className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Promo Code Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl overflow-hidden"
          >
            <div className="p-6 pb-0">
              <div className="flex flex-col gap-1 mb-6">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                  Promo Code
                </h3>
                <p className="text-[14px] leading-[20px] text-[#71717a]">
                  Apply a discount code to your account
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 bg-white border border-[#e4e4e7] rounded-md px-3 py-2 h-[40px] text-[16px] leading-[24px] text-[#18181b] outline-none focus:border-[#18181b] transition-colors placeholder:text-[#71717a]"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Apply
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// Workspace Tab Component
function WorkspaceTabContent({ workspaceSubTab, setWorkspaceSubTab }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [personalizationSubTab, setPersonalizationSubTab] = useState('Smart Setup')
  const [selectedRole, setSelectedRole] = useState('Creative')

  // Notification preferences state - each notification has: all, email, inApp, none
  const [notificationPrefs, setNotificationPrefs] = useState({
    'account-changes': 'email',
    'billing-alerts': 'email',
    'document-completed': 'inApp',
    'mention-comment': 'email',
    'assigned-task': 'email',
    'shared-document': 'inApp',
    'new-project': 'email',
    'deadline-reminder': 'email',
    'approval-required': 'inApp',
    'product-updates': 'email',
    'new-releases': 'email',
    'beta-feature': 'inApp',
    'newsletter': 'email',
    'tips-tricks': 'email',
    'webinars-events': 'inApp',
    'deck-completed': 'email',
    'strategy-suggestions': 'email',
    'auto-export': 'inApp',
  })

  const workspaceSubTabs = ['Notifications', 'Integration', 'Personalization', 'Data & Memory']

  const handleNotificationToggle = (notificationId, value) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [notificationId]: value
    }))
  }

  const getActiveCount = (categoryNotifications) => {
    return categoryNotifications.filter(id => notificationPrefs[id] !== 'none').length
  }

  const notificationCategories = [
    {
      id: 'account-activity',
      title: 'Account & Activity',
      notifications: [
        { id: 'account-changes', title: 'Account changes', description: 'Profile updates, security changes' },
        { id: 'billing-alerts', title: 'Billing alerts', description: 'Payment failures, subscription updates' },
        { id: 'document-completed', title: 'Document completed', description: 'AI has finished generating content' },
      ]
    },
    {
      id: 'team-collaboration',
      title: 'Team & Collaboration',
      notifications: [
        { id: 'mention-comment', title: 'Mention in comment', description: 'Someone mentions you in a comment' },
        { id: 'assigned-task', title: 'Assigned a task', description: "You've been assigned a new task" },
        { id: 'shared-document', title: 'Shared document', description: 'Someone shares a document with you' },
      ]
    },
    {
      id: 'projects-workflow',
      title: 'Projects & Workflow',
      notifications: [
        { id: 'new-project', title: 'New project created', description: 'A new project has been started' },
        { id: 'deadline-reminder', title: 'Deadline reminder', description: 'Upcoming project deadlines' },
        { id: 'approval-required', title: 'Approval required', description: 'Your approval is needed for content' },
      ]
    },
    {
      id: 'product-updates',
      title: 'Product & Feature Updates',
      notifications: [
        { id: 'product-updates', title: 'Product updates', description: 'New features and improvements' },
        { id: 'new-releases', title: 'New releases', description: 'Major product releases' },
        { id: 'beta-feature', title: 'Beta feature access', description: 'Early access to new features' },
      ]
    },
    {
      id: 'marketing-engagement',
      title: 'Marketing & Engagement',
      notifications: [
        { id: 'newsletter', title: 'Newsletter', description: 'Monthly product newsletter' },
        { id: 'tips-tricks', title: 'Tips & Tricks', description: 'Weekly tips to improve your workflow' },
        { id: 'webinars-events', title: 'Webinars / Events', description: 'Upcoming webinars and events' },
      ]
    },
    {
      id: 'ai-agent',
      title: 'AI Agent Activity',
      notifications: [
        { id: 'deck-completed', title: 'The Deck completed', description: 'AI has finished generating your deck' },
        { id: 'strategy-suggestions', title: 'Strategy suggestions ready', description: 'AI has new strategic insights' },
        { id: 'auto-export', title: 'Auto-export triggered', description: 'Automatic export has been completed' },
      ]
    },
  ]

  return (
    <motion.div
      key="workspace"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full pb-24"
    >
      {/* Sub-navigation Segments */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center gap-0 bg-[#f4f4f5] border border-[#e4e4e7] rounded-md p-1 w-fit">
          {workspaceSubTabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setWorkspaceSubTab(tab)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 h-[40px] rounded-md text-[14px] font-medium leading-[20px] transition-all ${workspaceSubTab === tab
                ? 'bg-white text-[#18181b] shadow-sm'
                : 'text-[#71717a] hover:text-[#18181b]'
                }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Notification Preferences Content */}
      {workspaceSubTab === 'Notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Main Card */}
          <div className="bg-white border border-[#e4e4e7] rounded-xl overflow-hidden">
            <div className="p-6">
              {/* Header with Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b] mb-2">
                    Notification Preferences
                  </h3>
                  <p className="text-[14px] leading-[20px] text-[#71717a]">
                    Configure notifications by category and delivery method
                  </p>
                </div>
                <ToggleSwitch
                  checked={notificationsEnabled}
                  onChange={(checked) => setNotificationsEnabled(checked)}
                />
              </div>

              {/* Notification Categories */}
              <div className="space-y-6">
                {notificationCategories.map((category, categoryIndex) => {
                  const activeCount = getActiveCount(category.notifications.map(n => n.id))
                  const totalCount = category.notifications.length

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + categoryIndex * 0.05 }}
                      className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-xl p-6"
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                            {category.title}
                          </h4>
                          <span className="text-[14px] leading-[20px] text-[#71717a]">
                            ({activeCount}/{totalCount} active)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] leading-[20px] text-[#71717a]">Frequency:</span>
                          <span className="text-[14px] leading-[20px] text-[#18181b] font-medium">Real Time</span>
                        </div>
                      </div>

                      {/* Notification Items */}
                      <div className="space-y-4">
                        {category.notifications.map((notification, notifIndex) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.05 + notifIndex * 0.03 }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <p className="text-[14px] font-medium leading-[20px] text-[#18181b] mb-1">
                                {notification.title}
                              </p>
                              <p className="text-[14px] leading-[18px] text-[#71717a]">
                                {notification.description}
                              </p>
                            </div>

                            {/* Toggle Group */}
                            <div className="flex items-center gap-0 bg-white border border-[#e4e4e7] rounded-md overflow-hidden">
                              {[
                                { value: 'all', label: 'All', width: 'w-[41px]' },
                                { value: 'email', label: 'Email', width: 'w-[60px]' },
                                { value: 'inApp', label: 'In app', width: 'w-[66px]' },
                                { value: 'none', label: 'None', width: 'w-[60px]' },
                              ].map((option) => {
                                const isActive = notificationPrefs[notification.id] === option.value
                                return (
                                  <motion.button
                                    key={option.value}
                                    onClick={() => handleNotificationToggle(notification.id, option.value)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`${option.width} h-[40px] flex items-center justify-center text-[14px] font-medium leading-[20px] transition-colors border-r border-[#e4e4e7] last:border-r-0 ${isActive
                                      ? 'bg-[#18181b] text-white'
                                      : 'bg-white text-[#18181b] hover:bg-[#f4f4f5]'
                                      }`}
                                  >
                                    {option.label}
                                  </motion.button>
                                )
                              })}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Integration Tab Content */}
      {workspaceSubTab === 'Integration' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Overview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-[#e4e4e7] rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b] mb-2">
                  Integrations
                </h3>
                <p className="text-[14px] leading-[20px] text-[#71717a]">
                  Connect MANIFESTR with your favorite tools and services
                </p>
              </div>

              {/* Overview Cards */}
              <div className="mb-6">
                <p className="text-[14px] leading-[20px] text-[#71717a] mb-4">
                  Overview of your active integrations
                </p>
                <div className="flex gap-4">
                  {[
                    { label: 'Connected', value: '3' },
                    { label: 'Auto-sync Enabled', value: '2' },
                    { label: 'Available', value: '7' },
                    { label: 'Premium Features', value: '3' },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                      className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-xl p-4 flex-1"
                    >
                      <p className="text-[30px] font-bold leading-[38px] text-[#18181b] mb-1">
                        {stat.value}
                      </p>
                      <p className="text-[14px] leading-[18px] text-[#71717a]">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* File Storage Section */}
          <IntegrationSection
            title="File Storage"
            subtitle="Connect cloud storage services for seamless file management"
            integrations={[
              {
                id: 'google-drive',
                name: 'Google Drive',
                description: 'Sync documents and export directly to Google Drive. Connected on 1/15/2024',
                connected: true,
                autoSync: true,
                icon: Cloud,
                iconColor: 'bg-blue-100',
              },
              {
                id: 'dropbox',
                name: 'Dropbox',
                description: 'Export and backup your projects to Dropbox',
                connected: false,
                autoSync: false,
                icon: Cloud,
                iconColor: 'bg-blue-100',
              },
              {
                id: 'onedrive',
                name: 'OneDrive',
                description: 'Microsoft OneDrive integration for seamless workflow',
                connected: false,
                autoSync: false,
                icon: Cloud,
                iconColor: 'bg-blue-100',
              },
            ]}
          />

          {/* Design Section */}
          <IntegrationSection
            title="Design"
            subtitle="Integrate with design tools for enhanced creative workflows"
            integrations={[
              {
                id: 'canva',
                name: 'Canva',
                description: 'Import templates and export designs to Canva. Connected on 2/1/2024',
                connected: true,
                autoSync: true,
                icon: Palette,
                iconColor: 'bg-purple-100',
              },
              {
                id: 'figma',
                name: 'Figma',
                description: 'Import design assets and collaborate on prototypes',
                connected: false,
                autoSync: false,
                icon: Palette,
                iconColor: 'bg-purple-100',
              },
            ]}
          />

          {/* Communication Section */}
          <IntegrationSection
            title="Communication"
            subtitle="Stay connected with team communication platforms"
            integrations={[
              {
                id: 'slack',
                name: 'Slack',
                description: 'Get notifications and share updates in Slack channels. Connected on 2/1/2024',
                connected: true,
                autoSync: true,
                icon: UserPlus,
                iconColor: 'bg-pink-100',
              },
              {
                id: 'microsoft-teams',
                name: 'Microsoft Teams',
                description: 'Collaborate and share content in Teams',
                connected: false,
                autoSync: false,
                icon: UserPlus,
                iconColor: 'bg-pink-100',
              },
            ]}
          />

          {/* API & Webhooks Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white border border-[#e4e4e7] rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b]">
                    API & Webhooks
                  </h3>
                  <span className="px-2 py-0.5 bg-[#18181b] text-white rounded-md text-[12px] font-medium leading-[18px]">
                    Premium
                  </span>
                </div>
                <p className="text-[14px] leading-[20px] text-[#71717a]">
                  Sync with productivity tools to streamline your workflow
                </p>
              </div>

              {/* Empty State */}
              <div className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4"
                >
                  <CloudCog className="w-8 h-8 text-[#18181b]" />
                </motion.div>
                <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b] mb-2">
                  Advanced Integration Features
                </h4>
                <p className="text-[14px] leading-[20px] text-[#71717a] mb-6 max-w-md">
                  Access API keys, webhooks, and custom integrations with your Premium plan.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] flex items-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
                >
                  <SettingsIcon className="w-4 h-4" />
                  Configure API Settings
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Personalization Tab Content */}
      {workspaceSubTab === 'Personalization' && (
        <PersonalizationTabContent
          personalizationSubTab={personalizationSubTab}
          setPersonalizationSubTab={setPersonalizationSubTab}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />
      )}

      {/* Data & Memory Content */}
      {workspaceSubTab === 'Data & Memory' && (
        <DataMemoryTabContent />
      )}

      {/* Other sub-tabs placeholder */}
      {workspaceSubTab !== 'Notifications' && workspaceSubTab !== 'Integration' && workspaceSubTab !== 'Personalization' && workspaceSubTab !== 'Data & Memory' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl p-8 text-center"
        >
          <p className="text-[16px] leading-[24px] text-[#71717a]">
            {workspaceSubTab} settings coming soon
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

// Integration Section Component
function IntegrationSection({ title, subtitle, integrations }) {
  const [integrationStates, setIntegrationStates] = useState(
    integrations.reduce((acc, integration) => {
      acc[integration.id] = {
        connected: integration.connected,
        autoSync: integration.autoSync,
      }
      return acc
    }, {})
  )

  const handleConnect = (id) => {
    setIntegrationStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        connected: !prev[id].connected,
      }
    }))
  }

  const handleAutoSync = (id) => {
    setIntegrationStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        autoSync: !prev[id].autoSync,
      }
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white border border-[#e4e4e7] rounded-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b] mb-2">
            {title}
          </h3>
          <p className="text-[14px] leading-[20px] text-[#71717a]">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {integrations.map((integration, index) => {
            const state = integrationStates[integration.id]
            const isConnected = state.connected
            const isAutoSync = state.autoSync

            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-xl overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${integration.iconColor} rounded-md flex items-center justify-center`}>
                        <integration.icon className="w-5 h-5 text-[#18181b]" />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                          {integration.name}
                        </h4>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-[12px] font-medium leading-[18px] ${isConnected
                      ? 'bg-[#d1fae5] text-[#065f46]'
                      : 'bg-[#f4f4f5] text-[#71717a]'
                      }`}>
                      {isConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                    {integration.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#e4e4e7]">
                    <motion.button
                      onClick={() => handleConnect(integration.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-md px-4 py-2 h-[40px] flex items-center gap-2 text-[14px] font-medium leading-[20px] transition-colors ${isConnected
                        ? 'bg-white border border-[#e4e4e7] text-[#18181b] hover:bg-[#f4f4f5]'
                        : 'bg-[#18181b] text-white hover:opacity-90'
                        }`}
                    >
                      {isConnected ? (
                        <>
                          <Link className="w-4 h-4" />
                          Disconnect
                        </>
                      ) : (
                        'Connect'
                      )}
                    </motion.button>

                    {isConnected && (
                      <ToggleSwitch
                        checked={isAutoSync}
                        onChange={() => handleAutoSync(integration.id)}
                        label="Auto-sync"
                        labelPosition="left"
                      />
                    )}
                    {!isConnected && (
                      <ToggleSwitch
                        checked={false}
                        onChange={() => { }}
                        disabled={true}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// Personalization Tab Component
function PersonalizationTabContent({ personalizationSubTab, setPersonalizationSubTab, selectedRole, setSelectedRole }) {
  const personalizationTabs = ['Smart Setup', 'AI Personality & Voice', 'Preferences']

  // AI Personality & Voice state
  const [toneOfVoice, setToneOfVoice] = useState('Cheeky')
  const [formalityLevel, setFormalityLevel] = useState('Medium')
  const [personalityOverlay, setPersonalityOverlay] = useState('Strategic Partner')
  const [customVoiceEnabled, setCustomVoiceEnabled] = useState(false)

  // Preferences state
  const [projectContextEnabled, setProjectContextEnabled] = useState(true)
  const [defaultTool, setDefaultTool] = useState('the-deck')

  const roles = [
    {
      id: 'strategist',
      title: 'Strategist',
      description: 'Focus on high-level planning and business strategy',
    },
    {
      id: 'producer',
      title: 'Producer',
      description: 'Project management and execution-focused workflow',
    },
    {
      id: 'creative',
      title: 'Creative',
      description: 'Emphasis on design, branding, and visual content',
    },
    {
      id: 'analyst',
      title: 'Analyst',
      description: 'Data-driven insights and analytical tools',
    },
  ]

  const getCurrentStepIndex = () => {
    return personalizationTabs.findIndex(tab => tab === personalizationSubTab)
  }

  const handleContinue = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex < personalizationTabs.length - 1) {
      setPersonalizationSubTab(personalizationTabs[currentIndex + 1])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-6"
      >
        {personalizationTabs.map((tab, index) => {
          const currentStepIndex = getCurrentStepIndex()
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex

          return (
            <div key={tab} className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${isActive
                    ? 'bg-white border-[#2563eb]'
                    : 'bg-white border-[#e4e4e7]'
                    }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-[#2563eb]" />
                  ) : (
                    <span className={`text-[12px] font-semibold leading-[18px] ${isActive ? 'text-[#2563eb]' : 'text-[#71717a]'
                      }`}>
                      {index + 1}
                    </span>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
                  <p className={`text-[16px] font-semibold leading-[24px] ${isActive ? 'text-[#2563eb]' : 'text-[#18181b]'
                    }`}>
                    {tab}
                  </p>
                </motion.div>
              </div>
              {index < personalizationTabs.length - 1 && (
                <div className="w-[86px] h-12 flex items-center justify-center">
                  <div className="w-full h-[1px] bg-[#e4e4e7]" />
                </div>
              )}
            </div>
          )
        })}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {personalizationSubTab === 'Smart Setup' && (
          <motion.div
            key="smart-setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-xl overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b] mb-2">
                  Smart Setup
                </h3>
                <p className="text-[14px] leading-[20px] text-[#71717a]">
                  Tell us about your role to personalize your experience
                </p>
              </div>

              {/* Role Selection */}
              <div className="mb-6">
                <label className="text-[14px] font-medium leading-[20px] text-[#464649] mb-4 block">
                  Proffered role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role, index) => {
                    const isSelected = selectedRole === role.id
                    return (
                      <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                        onClick={() => setSelectedRole(role.id)}
                        className={`bg-white border-2 rounded-md p-3 cursor-pointer transition-all ${isSelected
                          ? 'border-[#18181b]'
                          : 'border-[#e4e4e7] hover:border-[#18181b]'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center pt-0.5 shrink-0">
                            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected
                              ? 'bg-[#18181b] border-[#18181b]'
                              : 'bg-white border-[#e4e4e7]'
                              }`}>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  className="w-2 h-2 bg-white rounded-full"
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-[14px] font-medium leading-[20px] text-[#52525b] mb-1">
                              {role.title}
                            </p>
                            <p className="text-[14px] leading-[20px] text-[#71717a]">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#e4e4e7] p-6">
              <div className="flex justify-end">
                <motion.button
                  onClick={handleContinue}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] flex items-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {personalizationSubTab === 'AI Personality & Voice' && (
          <motion.div
            key="ai-personality"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden"
          >
            {/* Header Section */}
            <div className="pt-6 px-6 pb-0">
              <div className="h-[52px] flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                    AI Personality & Voice
                  </h3>
                  <p className="text-[14px] leading-[20px] text-[#71717a]">
                    Configure how the AI communicates with you
                  </p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col gap-6">

              {/* Tone of Voice */}
              <div className="flex flex-col gap-[6px] w-[660px]">
                <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
                  Tone of Voice
                </label>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: 'professional', title: 'Professional', description: 'Formal, business-appropriate tone' },
                      { id: 'casual', title: 'Casual', description: 'Friendly and conversational style' },
                    ].map((tone, index) => {
                      const isSelected = toneOfVoice === tone.id
                      return (
                        <motion.div
                          key={tone.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                          onClick={() => setToneOfVoice(tone.id)}
                          className={`basis-0 grow bg-white border flex gap-2 items-center min-h-0 min-w-0 px-3 py-2 rounded-md cursor-pointer transition-all ${isSelected
                            ? 'border-[#18181b]'
                            : 'border-[#e4e4e7] hover:border-[#18181b]'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center pt-[2px] pb-0 px-0 shrink-0">
                            <div className={`w-4 h-4 rounded-[8px] border flex items-center justify-center transition-colors ${isSelected
                              ? 'bg-[#18181b] border-[#18181b]'
                              : 'border-[#e4e4e7]'
                              }`}>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  className="w-[6px] h-[6px] bg-white rounded-full"
                                />
                              )}
                            </div>
                          </div>
                          <div className="basis-0 grow flex flex-col items-start leading-[20px] min-h-0 min-w-0 text-[14px]">
                            <p className="font-medium text-[#52525b] w-full">
                              {tone.title}
                            </p>
                            <p className="font-normal text-[#71717a] w-full">
                              {tone.description}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: 'cheeky', title: 'Cheeky', description: 'Playful and slightly irreverent' },
                      { id: 'corporate', title: 'Corporate', description: 'Very formal, enterprise-focused' },
                    ].map((tone, index) => {
                      const isSelected = toneOfVoice === tone.id
                      return (
                        <motion.div
                          key={tone.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                          onClick={() => setToneOfVoice(tone.id)}
                          className={`basis-0 grow bg-white border flex gap-2 items-center min-h-0 min-w-0 px-3 py-2 rounded-md cursor-pointer transition-all ${isSelected
                            ? 'border-[#18181b]'
                            : 'border-[#e4e4e7] hover:border-[#18181b]'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center pt-[2px] pb-0 px-0 shrink-0">
                            <div className={`w-4 h-4 rounded-[8px] border flex items-center justify-center transition-colors ${isSelected
                              ? 'bg-[#18181b] border-[#18181b]'
                              : 'border-[#e4e4e7]'
                              }`}>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  className="w-[6px] h-[6px] bg-white rounded-full"
                                />
                              )}
                            </div>
                          </div>
                          <div className="basis-0 grow flex flex-col items-start leading-[20px] min-h-0 min-w-0 text-[14px]">
                            <p className="font-medium text-[#52525b] w-full">
                              {tone.title}
                            </p>
                            <p className="font-normal text-[#71717a] w-full">
                              {tone.description}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Formality Level */}
              <div className="flex flex-col gap-[6px] w-[450px]">
                <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
                  Formality Level
                </label>
                <div className="flex items-center gap-1">
                  {['Low', 'Medium', 'High'].map((level) => {
                    const isSelected = formalityLevel === level
                    return (
                      <motion.button
                        key={level}
                        onClick={() => setFormalityLevel(level)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`h-[40px] px-3 py-[10px] rounded-md text-[14px] font-medium leading-[20px] transition-colors border ${isSelected
                          ? 'bg-[#f4f4f5] border-[#e4e4e7] text-[#18181b]'
                          : 'bg-transparent border-[#e4e4e7] text-[#18181b] hover:bg-[#f4f4f5]'
                          }`}
                      >
                        {level}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* AI Preview Response */}
              <div className="flex flex-col gap-8">
                <div className="bg-white border border-[#e4e4e7] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-[#18181b]" />
                    <h4 className="text-[16px] font-medium leading-[24px] text-[#18181b]">
                      AI Preview Response
                    </h4>
                  </div>
                  <p className="text-[14px] leading-[20px] text-[#71717a]">
                    Hey there! Let's dive into some creative brainstorming. I've got a few cheeky ideas that might just spark your next big breakthrough. Ready to shake things up?
                  </p>
                </div>
              </div>

              {/* Personality Overlay */}
              <div className="flex flex-col gap-[6px] w-[660px]">
                <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
                  Personality Overlay
                </label>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: 'creative-muse', title: 'Creative Muse', description: 'Inspiring and imaginative, helps unlock creative potential' },
                      { id: 'strategic-partner', title: 'Strategic Partner', description: 'Analytical and forward-thinking business advisor' },
                      { id: 'execution-engine', title: 'Execution Engine', description: 'Practical and results-oriented project facilitator' },
                      { id: 'wise-mentor', title: 'Wise Mentor', description: 'Thoughtful guidance with industry expertise' },
                    ].map((personality, index) => {
                      const isSelected = personalityOverlay === personality.id
                      return (
                        <motion.div
                          key={personality.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                          onClick={() => setPersonalityOverlay(personality.id)}
                          className={`basis-0 grow bg-white border flex gap-2 items-center min-h-0 min-w-0 px-3 py-2 rounded-md cursor-pointer transition-all ${isSelected
                            ? 'border-[#18181b]'
                            : 'border-[#e4e4e7] hover:border-[#18181b]'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center pt-[2px] pb-0 px-0 shrink-0">
                            <div className={`w-4 h-4 rounded-[8px] border flex items-center justify-center transition-colors ${isSelected
                              ? 'bg-[#18181b] border-[#18181b]'
                              : 'border-[#e4e4e7]'
                              }`}>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  className="w-[6px] h-[6px] bg-white rounded-full"
                                />
                              )}
                            </div>
                          </div>
                          <div className="basis-0 grow flex flex-col items-start leading-[20px] min-h-0 min-w-0 text-[14px]">
                            <p className="font-medium text-[#52525b] w-full">
                              {personality.title}
                            </p>
                            <p className="font-normal text-[#71717a] w-full">
                              {personality.description}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: 'execution-engine', title: 'Execution Engine', description: 'Practical and results-oriented project facilitator' },
                      { id: 'wise-mentor', title: 'Wise Mentor', description: 'Thoughtful guidance with industry expertise' },
                    ].map((personality, index) => {
                      const isSelected = personalityOverlay === personality.id
                      return (
                        <motion.div
                          key={personality.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                          onClick={() => setPersonalityOverlay(personality.id)}
                          className={`basis-0 grow bg-white border flex gap-2 items-center min-h-0 min-w-0 px-3 py-2 rounded-md cursor-pointer transition-all ${isSelected
                            ? 'border-[#18181b]'
                            : 'border-[#e4e4e7] hover:border-[#18181b]'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center pt-[2px] pb-0 px-0 shrink-0">
                            <div className={`w-4 h-4 rounded-[8px] border flex items-center justify-center transition-colors ${isSelected
                              ? 'bg-[#18181b] border-[#18181b]'
                              : 'border-[#e4e4e7]'
                              }`}>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  className="w-[6px] h-[6px] bg-white rounded-full"
                                />
                              )}
                            </div>
                          </div>
                          <div className="basis-0 grow flex flex-col items-start leading-[20px] min-h-0 min-w-0 text-[14px]">
                            <p className="font-medium text-[#52525b] w-full">
                              {personality.title}
                            </p>
                            <p className="font-normal text-[#71717a] w-full">
                              {personality.description}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Custom AI Voice */}
              <div className="bg-white border border-[#e4e4e7] rounded-md p-4 flex gap-4 items-start">
                <div className="relative rounded-[20px] w-5 h-5 shrink-0">
                  <div className="absolute inset-[-20%] opacity-30 rounded-[24px] bg-[#71717a]" />
                  <div className="absolute h-5 left-0 right-0 top-1/2 -translate-y-1/2">
                    <Mic className="w-4 h-4 text-[#71717a] mx-auto" />
                  </div>
                </div>
                <div className="basis-0 grow flex gap-3 items-start min-h-0 min-w-0">
                  <div className="basis-0 grow flex flex-col gap-1 items-start min-h-0 min-w-0">
                    <div className="flex gap-2 items-center pl-0 pr-8 py-0 w-full">
                      <div className="basis-0 grow flex gap-2 items-center min-h-0 min-w-0">
                        <h4 className="text-[14px] font-semibold leading-[20px] text-[#52525b] whitespace-nowrap">
                          Custom AI Voice
                        </h4>
                        <span className="px-2 py-[2px] bg-[#f4f4f5] border border-[#e4e4e7] rounded-2xl text-[12px] font-medium leading-[18px] text-[#71717a] text-center whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                    <p className="text-[14px] leading-[20px] text-[#71717a] w-full">
                      Choose from different AI narration styles
                    </p>
                  </div>
                  <div className="flex gap-3 items-start shrink-0">
                    <div className="flex gap-2 items-start shrink-0">
                      <motion.button
                        onClick={() => setCustomVoiceEnabled(!customVoiceEnabled)}
                        className={`relative w-11 h-6 rounded-full border-2 border-transparent transition-colors ${customVoiceEnabled ? 'bg-[#18181b]' : 'bg-[#f4f4f5]'
                          }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute w-5 h-5 bg-white rounded-full shadow-lg"
                          initial={false}
                          animate={{ x: customVoiceEnabled ? 20 : 2 }}
                          transition={{ type: "spring", stiffness: 700, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#e4e4e7]">
              <div className="px-6 py-4">
                <div className="flex gap-[208px] items-center w-full">
                  <div className="basis-0 grow flex gap-[10px] items-center justify-center min-h-0 min-w-0 shrink-0" />
                  <div className="flex gap-3 items-center shrink-0">
                    <motion.button
                      onClick={handleContinue}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] flex items-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {personalizationSubTab === 'Preferences' && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-8"
          >
            {/* Memory Management Section */}
            <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
              <div className="pt-6 px-6 pb-0">
                <div className="h-[52px] flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                      Memory Management
                    </h3>
                    <p className="text-[14px] leading-[20px] text-[#71717a]">
                      Control what the AI remembers about your projects and preferences
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-6">
                {/* Enable project context */}
                <div className="flex gap-4 items-start w-full">
                  <div className="basis-0 grow flex flex-col gap-[6px] items-start min-h-0 min-w-0">
                    <div className="flex gap-2 items-center w-full">
                      <h4 className="text-[16px] font-semibold leading-[24px] text-[#09090b]">
                        Enable project context
                      </h4>
                    </div>
                    <p className="text-[14px] leading-[20px] text-[#71717a] w-full">
                      Allow AI to remember project details across sessions
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setProjectContextEnabled(!projectContextEnabled)}
                    className={`relative w-11 h-6 rounded-full border-2 border-transparent transition-colors ${projectContextEnabled ? 'bg-[#18181b]' : 'bg-[#f4f4f5]'
                      }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute w-5 h-5 bg-white rounded-full shadow-lg"
                      initial={false}
                      animate={{ x: projectContextEnabled ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    />
                  </motion.button>
                </div>

                {/* Memory Management Buttons */}
                <div className="flex flex-col gap-[6px] w-[450px]">
                  <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
                    Memory Management
                  </label>
                  <div className="flex gap-4 items-center">
                    {[
                      { id: 'clear-project', label: 'Clear project memory' },
                      { id: 'clear-tools', label: 'Clear tools memory' },
                      { id: 'clear-all', label: 'Clear all memory' },
                    ].map((action) => (
                      <motion.button
                        key={action.id}
                        onClick={() => {
                          // Handle memory clearing action
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-4 py-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                      >
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Default Tools Section */}
            <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
              <div className="pt-6 px-6 pb-0">
                <div className="h-[52px] flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                      Default Tools
                    </h3>
                    <p className="text-[14px] leading-[20px] text-[#71717a]">
                      Which tool should open automatically when you start a new session?
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-6 w-[272px]">
                  {/* First row */}
                  <div className="flex gap-4 items-center w-full">
                    {/* The Deck */}
                    <motion.div
                      onClick={() => setDefaultTool('the-deck')}
                      className={`basis-0 grow min-w-[356px] bg-white border rounded-md cursor-pointer transition-all ${defaultTool === 'the-deck'
                        ? 'border-[#18181b]'
                        : 'border-[#e4e4e7] hover:border-[#18181b]'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="border-b border-[#e4e4e7] p-4">
                        <div className="flex gap-2 items-center">
                          <div className="bg-white border border-[#e4e4e7] rounded-md w-10 h-10 flex items-center justify-center shrink-0">
                            <Palette className="w-4 h-4 text-[#18181b]" />
                          </div>
                          <div className="flex flex-col items-start leading-[18px] text-[12px]">
                            <p className="font-semibold text-[#18181b]">
                              The Deck
                            </p>
                            <p className="font-normal text-[#71717a]">
                              Presentation builder and storytelling tool
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* The Analyzer */}
                    <motion.div
                      onClick={() => setDefaultTool('the-analyzer')}
                      className={`basis-0 grow min-w-[356px] bg-white border rounded-md cursor-pointer transition-all ${defaultTool === 'the-analyzer'
                        ? 'border-[#18181b]'
                        : 'border-[#e4e4e7] hover:border-[#18181b]'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="border-b border-[#e4e4e7] p-4">
                        <div className="flex gap-2 items-center">
                          <div className="bg-white border border-[#e4e4e7] rounded-md w-10 h-10 flex items-center justify-center shrink-0">
                            <BarChart3 className="w-4 h-4 text-[#18181b]" />
                          </div>
                          <div className="flex flex-col items-start leading-[18px] text-[12px]">
                            <p className="font-semibold text-[#18181b]">
                              The Analyzer
                            </p>
                            <p className="font-normal text-[#71717a]">
                              Data analysis and insights generator
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Second row */}
                  <div className="flex gap-4 items-center w-full">
                    {/* The Briefcase */}
                    <motion.div
                      onClick={() => setDefaultTool('the-briefcase')}
                      className={`basis-0 grow min-w-[356px] bg-white border rounded-md cursor-pointer transition-all ${defaultTool === 'the-briefcase'
                        ? 'border-[#18181b]'
                        : 'border-[#e4e4e7] hover:border-[#18181b]'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="border-b border-[#e4e4e7] p-4">
                        <div className="flex gap-2 items-center">
                          <div className="bg-white border border-[#e4e4e7] rounded-md w-10 h-10 flex items-center justify-center shrink-0">
                            <Briefcase className="w-4 h-4 text-[#18181b]" />
                          </div>
                          <div className="flex flex-col items-start leading-[18px] text-[12px]">
                            <p className="font-semibold text-[#18181b]">
                              The Briefcase
                            </p>
                            <p className="font-normal text-[#71717a]">
                              Business strategy and planning hub
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* The Strategist */}
                    <motion.div
                      onClick={() => setDefaultTool('the-strategist')}
                      className={`basis-0 grow min-w-[356px] bg-white border rounded-md cursor-pointer transition-all ${defaultTool === 'the-strategist'
                        ? 'border-[#18181b]'
                        : 'border-[#e4e4e7] hover:border-[#18181b]'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="border-b border-[#e4e4e7] p-4">
                        <div className="flex gap-2 items-center">
                          <div className="bg-white border border-[#e4e4e7] rounded-md w-10 h-10 flex items-center justify-center shrink-0">
                            <Brain className="w-4 h-4 text-[#18181b]" />
                          </div>
                          <div className="flex flex-col items-start leading-[18px] text-[12px]">
                            <p className="font-semibold text-[#18181b]">
                              The Strategist
                            </p>
                            <p className="font-normal text-[#71717a]">
                              AI strategy consultant
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[#e4e4e7]">
                <div className="px-6 py-4">
                  <div className="flex gap-[208px] items-center w-full">
                    <div className="basis-0 grow flex gap-[10px] items-center justify-center min-h-0 min-w-0 shrink-0" />
                    <div className="flex gap-3 items-center shrink-0">
                      <motion.button
                        onClick={() => {
                          // Handle save action
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] flex items-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
                      >
                        Save & Apply to Workspace
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Settings Card Component
function SettingsCard({ title, subtitle, isExpanded, onToggle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-xl p-6"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[18px] font-semibold leading-[28px] text-[#18181b] mb-1">
            {title}
          </h3>
          <p className="text-[14px] leading-[20px] text-[#71717a]">
            {subtitle}
          </p>
        </div>
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-[#18181b] cursor-pointer bg-[#fff] border border-[#E4E4E7] p-2 rounded-md"
        >
          <ChevronUp
            className={`w-5 h-5 transition-transform ${isExpanded ? '' : 'rotate-180'}`}
          />
        </motion.button>
      </div>

      {/* Card Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Profile Tab Component
function ProfileTabContent({
  username,
  setUsername,
  displayName,
  setDisplayName,
  fullName,
  setFullName,
  email,
  setEmail,
  phoneCountry,
  setPhoneCountry,
  phoneNumber,
  setPhoneNumber,
  yearOfBirth,
  setYearOfBirth,
  gender,
  setGender,
  country,
  setCountry,
  jobTitle,
  setJobTitle,
  industry,
  setIndustry,
  yearsOfExperience,
  setYearsOfExperience,
  showPhoneCountryDropdown,
  setShowPhoneCountryDropdown,
  showYearOfBirthDropdown,
  setShowYearOfBirthDropdown,
  showGenderDropdown,
  setShowGenderDropdown,
  showCountryDropdown,
  setShowCountryDropdown,
  showIndustryDropdown,
  setShowIndustryDropdown,
  showExperienceDropdown,
  setShowExperienceDropdown,
  phoneCountryRef,
  yearOfBirthRef,
  genderRef,
  countryRef,
  industryRef,
  experienceRef,
  profileImageUrl,
  handleProfileImageChange,
  handleClearProfileImage,
  handleSaveBasicInfo,
  handleSaveProfessionalInfo,
  isSaving,
}) {
  const fileInputRef = useRef(null)

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const fields = [
      username,
      displayName,
      fullName,
      email,
      phoneNumber,
      yearOfBirth,
      gender,
      country,
      profileImageUrl,
      jobTitle,
      industry,
      yearsOfExperience
    ]

    const filledFields = fields.filter(field => field && field.toString().trim() !== '').length
    const totalFields = fields.length
    const percentage = Math.round((filledFields / totalFields) * 100)

    return { percentage, filledFields, totalFields }
  }

  const { percentage, filledFields, totalFields } = calculateCompletion()

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-6 items-start pb-24"
    >
      {/* Left Column - Profile Image Upload */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl p-4 w-[320px] shrink-0"
      >
        <div className="flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-[80px] h-[80px] rounded-full border border-[rgba(0,0,0,0.08)] overflow-hidden bg-gray-100">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Image
                  src="/assets/dummy/avatar.png"
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </div>
          </div>

          {/* Upload Instructions */}
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-semibold leading-[24px] text-[#161924]">
              Upload your image
            </p>
            <p className="text-[12px] leading-[18px] text-[#5a5c66]">
              formats allowed are *png, *jpg. up to 10 MB with a minimum size of 400px by 400px
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleProfileImageChange}
            className="hidden"
          />

          {/* Progress Bar */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[12px] leading-[18px] text-[#5a5c66]">
              <span>Completed</span>
              <span>{percentage}%</span>
            </div>
            <div className="bg-[#e2e4e9] h-[6px] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-[#14cb74] h-full rounded-full"
              />
            </div>
            <div className="flex items-center gap-1 text-[12px] leading-[18px]">
              <button className="text-[#1e2131] font-medium underline">
                Complete now
              </button>
              <span className="text-[#5a5c66]">to unlock unlimited Features.</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClearProfileImage}
              className="flex-1 h-[36px] border border-[#e8e8e9] rounded-md bg-white text-[#e52f2f] font-medium text-[14px] hover:bg-[#f4f4f5] transition-colors"
            >
              Clear
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 h-[36px] border border-[#e8e8e9] rounded-md bg-white text-[#161924] font-medium text-[14px] hover:bg-[#f4f4f5] transition-colors"
            >
              Change
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Forms */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex-1 flex flex-col gap-6"
      >
        {/* Basic Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl"
        >
          <div className="p-4 pb-0">
            <div className="mb-4">
              <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b] mb-1">
                Basic Information
              </h3>
              <p className="text-[16px] leading-[24px] text-[#71717a]">
                Your core profile details
              </p>
            </div>

            <div className="flex flex-col gap-4 pb-4">
              {/* Row 1: Username, Display Name */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Username
                  </label>
                  <div className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 text-[16px] leading-[24px] text-[#18181b] outline-none"
                    />
                    <CheckCircle2 className="w-4 h-4 text-[#18181b] shrink-0" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-[16px] leading-[24px] text-[#18181b] outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Full Name, Email */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-[16px] leading-[24px] text-[#18181b] outline-none"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-[16px] leading-[24px] text-[#18181b] outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Phone Number, Year of Birth */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Phone Number (Optional)
                  </label>
                  <div className="relative" ref={phoneCountryRef}>
                    <div className="bg-white border border-[#e4e4e7] rounded-md flex">
                      <button
                        onClick={() => {
                          setShowPhoneCountryDropdown(!showPhoneCountryDropdown)
                          setShowYearOfBirthDropdown(false)
                          setShowGenderDropdown(false)
                          setShowCountryDropdown(false)
                        }}
                        className="px-3 py-2 flex items-center gap-1 border-r border-[#e4e4e7]"
                      >
                        <span className="text-[16px] leading-[24px] text-[#71717a]">{phoneCountry}</span>
                        <ChevronDown className="w-4 h-4 text-[#71717a]" />
                      </button>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 px-3 py-2 text-[16px] leading-[24px] text-[#18181b] outline-none"
                      />
                    </div>
                    <AnimatePresence>
                      {showPhoneCountryDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10 min-w-[80px]"
                        >
                          {['PK', 'US', 'UK', 'CA'].map((code) => (
                            <motion.button
                              key={code}
                              onClick={() => {
                                setPhoneCountry(code)
                                setShowPhoneCountryDropdown(false)
                              }}
                              whileHover={{ backgroundColor: '#f4f4f5' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                            >
                              {code}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Year of Birth
                  </label>
                  <div className="relative" ref={yearOfBirthRef}>
                    <button
                      onClick={() => {
                        setShowYearOfBirthDropdown(!showYearOfBirthDropdown)
                        setShowPhoneCountryDropdown(false)
                        setShowGenderDropdown(false)
                        setShowCountryDropdown(false)
                      }}
                      className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 flex items-center justify-between hover:border-[#18181b] transition-colors"
                    >
                      <span className="text-[16px] leading-[24px] text-[#18181b]">{yearOfBirth}</span>
                      <ChevronDown className="w-4 h-4 text-[#71717a]" />
                    </button>
                    <AnimatePresence>
                      {showYearOfBirthDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10 max-h-[200px] overflow-y-auto"
                        >
                          {Array.from({ length: 100 }, (_, i) => 2024 - i).map((year) => (
                            <motion.button
                              key={year}
                              onClick={() => {
                                setYearOfBirth(year.toString())
                                setShowYearOfBirthDropdown(false)
                              }}
                              whileHover={{ backgroundColor: '#f4f4f5' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                            >
                              {year}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Row 4: Gender, Country */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Gender
                  </label>
                  <div className="relative" ref={genderRef}>
                    <button
                      onClick={() => {
                        setShowGenderDropdown(!showGenderDropdown)
                        setShowPhoneCountryDropdown(false)
                        setShowYearOfBirthDropdown(false)
                        setShowCountryDropdown(false)
                      }}
                      className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 flex items-center justify-between hover:border-[#18181b] transition-colors"
                    >
                      <span className="text-[16px] leading-[24px] text-[#18181b]">{gender}</span>
                      <ChevronDown className="w-4 h-4 text-[#71717a]" />
                    </button>
                    <AnimatePresence>
                      {showGenderDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10"
                        >
                          {['Male', 'Female', 'Other', 'Prefer not to say'].map((g) => (
                            <motion.button
                              key={g}
                              onClick={() => {
                                setGender(g)
                                setShowGenderDropdown(false)
                              }}
                              whileHover={{ backgroundColor: '#f4f4f5' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                            >
                              {g}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Country
                  </label>
                  <div className="relative" ref={countryRef}>
                    <button
                      onClick={() => {
                        setShowCountryDropdown(!showCountryDropdown)
                        setShowPhoneCountryDropdown(false)
                        setShowYearOfBirthDropdown(false)
                        setShowGenderDropdown(false)
                      }}
                      className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 flex items-center justify-between hover:border-[#18181b] transition-colors"
                    >
                      <span className="text-[16px] leading-[24px] text-[#18181b]">{country}</span>
                      <ChevronDown className="w-4 h-4 text-[#71717a]" />
                    </button>
                    <AnimatePresence>
                      {showCountryDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10 max-h-[200px] overflow-y-auto"
                        >
                          {['Pakistan', 'United States', 'United Kingdom', 'Canada', 'Australia', 'India'].map((c) => (
                            <motion.button
                              key={c}
                              onClick={() => {
                                setCountry(c)
                                setShowCountryDropdown(false)
                              }}
                              whileHover={{ backgroundColor: '#f4f4f5' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                            >
                              {c}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Save Button */}
          <div className="border-t border-[#e4e4e7] p-6">
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveBasicInfo}
                disabled={isSaving}
                className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Professional Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-[#f4f4f4] border border-[#e8e8e9] rounded-xl"
        >
          <div className="p-4 pb-0">
            <div className="mb-4">
              <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b] mb-1">
                Professional Information
              </h3>
              <p className="text-[16px] leading-[24px] text-[#71717a]">
                Help us personalize your experience
              </p>
            </div>

            <div className="flex flex-col gap-4 pb-4">
              {/* Row 1: Job Title, Job Title (duplicate in design) */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-[16px] leading-[24px] text-[#18181b] outline-none"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    readOnly
                    className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-[16px] leading-[24px] text-[#18181b] outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Industry, Years of Experience */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Industry
                  </label>
                  <div className="relative" ref={industryRef}>
                    <button
                      onClick={() => {
                        setShowIndustryDropdown(!showIndustryDropdown)
                        setShowExperienceDropdown(false)
                      }}
                      className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 flex items-center justify-between hover:border-[#18181b] transition-colors"
                    >
                      <span className={`text-[16px] leading-[24px] ${industry ? 'text-[#18181b]' : 'text-[#d1d5dc]'}`}>
                        {industry || 'Technology'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#71717a]" />
                    </button>
                    <AnimatePresence>
                      {showIndustryDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10"
                        >
                          {['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing'].map((ind) => (
                            <motion.button
                              key={ind}
                              onClick={() => {
                                setIndustry(ind)
                                setShowIndustryDropdown(false)
                              }}
                              whileHover={{ backgroundColor: '#f4f4f5' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                            >
                              {ind}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                    Years of Experience
                  </label>
                  <div className="relative" ref={experienceRef}>
                    <button
                      onClick={() => {
                        setShowExperienceDropdown(!showExperienceDropdown)
                        setShowIndustryDropdown(false)
                      }}
                      className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 flex items-center justify-between hover:border-[#18181b] transition-colors"
                    >
                      <span className="text-[16px] leading-[24px] text-[#18181b]">{yearsOfExperience}</span>
                      <ChevronDown className="w-4 h-4 text-[#71717a]" />
                    </button>
                    <AnimatePresence>
                      {showExperienceDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-10"
                        >
                          {['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'].map((exp) => (
                            <motion.button
                              key={exp}
                              onClick={() => {
                                setYearsOfExperience(exp)
                                setShowExperienceDropdown(false)
                              }}
                              whileHover={{ backgroundColor: '#f4f4f5' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                            >
                              {exp}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Save Button */}
          <div className="border-t border-[#e4e4e7] p-6">
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfessionalInfo}
                disabled={isSaving}
                className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Data & Memory Tab Component
function DataMemoryTabContent() {
  const [selectedProjects, setSelectedProjects] = useState(['project-1'])
  const [autoArchiveEnabled, setAutoArchiveEnabled] = useState(false)
  const [aiMemoryRetentionEnabled, setAiMemoryRetentionEnabled] = useState(true)

  const projects = [
    { id: 'project-1', name: 'Q4 Marketing Strategy', type: 'Strategy Brief', modified: '1/1/2024', size: '2.3 MB', status: 'Active' },
    { id: 'project-2', name: 'Product Launch Deck', type: 'Presentation', modified: '12/1/2023', size: '2.3 MB', status: 'Active' },
    { id: 'project-3', name: 'Competitor Analysis', type: 'Research report', modified: '11/1/2023', size: '2.3 MB', status: 'Archived' },
    { id: 'project-4', name: 'Brand Guidelines 2024', type: 'Brand Guide', modified: '10/1/2023', size: '2.3 MB', status: 'Active' },
    { id: 'project-5', name: 'Q5 Marketing Strategy', type: 'Strategy Brief', modified: '1/1/2023', size: '2.3 MB', status: 'Active' },
  ]

  const usageBreakdown = [
    { label: 'Project Files', value: '1.8 GB' },
    { label: 'AI Memory', value: '0.9 GB' },
    { label: 'Assets & Media', value: '0.1 GB' },
    { label: 'Premium Features', value: '3' },
  ]

  const aiMemoryCards = [
    { id: 'the-deck', name: 'The Deck', icon: Presentation },
    { id: 'the-briefcase', name: 'The Briefcase', icon: Briefcase },
    { id: 'the-strategist', name: 'The Strategist', icon: Brain },
    { id: 'the-analyzer', name: 'The Analyzer', icon: BarChart3 },
  ]

  const exportOptions = [
    { id: 'the-deck', name: 'The Deck', formats: 'PPT, PDF', icon: Presentation },
    { id: 'strategy-briefs', name: 'Strategy Briefs', formats: 'PDF & DOCX', icon: FileText },
    { id: 'analysis-reports', name: 'Analysis Reports', formats: 'PDF & CSV', icon: BarChart3 },
    { id: 'media-assets', name: 'Media Assets', formats: 'ZIP Archive', icon: FileImage },
  ]

  const toggleProjectSelection = (projectId) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const totalUsage = 2.8
  const totalCapacity = 10
  const usagePercentage = (totalUsage / totalCapacity) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
    >
      {/* Data & Memory Usage Section */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Data & Memory
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Monitor your data usage and storage capacity
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Usage Summary */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-baseline">
                <span className="text-[38px] font-semibold leading-[38px] text-[#18181b]">
                  {totalUsage} GB
                </span>
                <span className="text-[16px] leading-[24px] text-[#71717a]">
                  of {totalCapacity} GB used
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full h-4 bg-[#e4e4e7] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-[#18181b] rounded-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(0.9 / totalCapacity) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-[#52525b] rounded-full"
                  style={{ left: `${(1.8 / totalCapacity) * 100}%` }}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(0.1 / totalCapacity) * 100}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-[#71717a] rounded-full"
                  style={{ left: `${((1.8 + 0.9) / totalCapacity) * 100}%` }}
                />
              </div>
              <div className="flex justify-end">
                <span className="text-[14px] leading-[20px] text-[#71717a]">
                  {totalCapacity}GB
                </span>
              </div>
            </div>

            {/* Usage Breakdown Cards */}
            <div className="flex flex-wrap gap-4">
              {usageBreakdown.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="bg-white border border-[#e4e4e7] rounded-md p-4 min-w-[280px]"
                >
                  <p className="text-[12px] leading-[18px] text-[#71717a] mb-2">
                    {item.label}
                  </p>
                  <p className="text-[30px] font-semibold leading-[30px] text-[#18181b]">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Data Section */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Project Data
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Manage your project files and documents
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-4 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
              >
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-4 flex items-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
              >
                <Download className="w-4 h-4" />
                All notes
              </motion.button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Table */}
          <div className="bg-white border border-[#e4e4e7] rounded-md overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[49px_297px_205.5px_205.5px_205.5px_205.5px] border-b border-[#e4e4e7]">
              <div className="p-4">
                <div className="w-4 h-4 border border-[#e4e4e7] rounded-md flex items-center justify-center bg-[#18181b]">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="p-4">
                <p className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                  Project name
                </p>
              </div>
              <div className="p-4">
                <p className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                  Modified
                </p>
              </div>
              <div className="p-4">
                <p className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                  Size
                </p>
              </div>
              <div className="p-4">
                <p className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                  Status
                </p>
              </div>
              <div className="p-4">
                <p className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                  Actions
                </p>
              </div>
            </div>

            {/* Table Rows */}
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="grid grid-cols-[49px_297px_205.5px_205.5px_205.5px_205.5px] border-b border-[#e4e4e7] last:border-b-0 hover:bg-[#f4f4f5] transition-colors"
              >
                <div className="p-4 flex items-center">
                  <motion.button
                    onClick={() => toggleProjectSelection(project.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-4 h-4 border rounded-md flex items-center justify-center transition-colors ${selectedProjects.includes(project.id)
                      ? 'bg-[#18181b] border-[#18181b]'
                      : 'border-[#e4e4e7]'
                      }`}
                  >
                    {selectedProjects.includes(project.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </motion.button>
                </div>
                <div className="p-4 flex items-center gap-2">
                  <div className="w-10 h-10 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#18181b]" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[14px] font-medium leading-[20px] text-[#18181b]">
                      {project.name}
                    </p>
                    <p className="text-[14px] leading-[20px] text-[#71717a]">
                      {project.type}
                    </p>
                  </div>
                </div>
                <div className="p-4 flex items-center">
                  <p className="text-[14px] leading-[20px] text-[#18181b]">
                    {project.modified}
                  </p>
                </div>
                <div className="p-4 flex items-center">
                  <p className="text-[14px] leading-[20px] text-[#18181b]">
                    {project.size}
                  </p>
                </div>
                <div className="p-4 flex items-center">
                  <span className={`px-3 py-1.5 rounded-md text-[14px] font-medium leading-[18px] ${project.status === 'Active'
                    ? 'bg-[#f4f4f5] text-[#18181b]'
                    : 'bg-[#e4e4e7] text-[#71717a]'
                    }`}>
                    {project.status}
                  </span>
                </div>
                <div className="p-4 flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
                  >
                    <Download className="w-4 h-4 text-[#18181b]" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
                  >
                    <Archive className="w-4 h-4 text-[#18181b]" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Memory & Conversations Section */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                AI Memory & Conversations
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Manage AI learning data and conversation history
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* AI Memory Cards Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {aiMemoryCards.map((card, index) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="bg-white border border-[#e4e4e7] rounded-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex gap-4 items-start mb-6">
                      <div className="w-10 h-10 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#18181b]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b] mb-1">
                          {card.name}
                        </h4>
                        <p className="text-[14px] leading-[20px] text-[#71717a]">
                          250 MB
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-6">
                      <div className="flex justify-between items-center">
                        <p className="text-[14px] leading-[20px] text-[#71717a]">
                          Conversations:
                        </p>
                        <p className="text-[14px] font-semibold leading-[24px] text-[#18181b]">
                          47
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[14px] leading-[20px] text-[#71717a]">
                          Insights Generated:
                        </p>
                        <p className="text-[14px] font-semibold leading-[24px] text-[#18181b]">
                          24
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[14px] leading-[20px] text-[#71717a]">
                          Last Used:
                        </p>
                        <p className="text-[14px] font-semibold leading-[24px] text-[#18181b]">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#e4e4e7] p-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white border border-[#e4e4e7] rounded-md h-[40px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                    >
                      <RotateCw className="w-4 h-4" />
                      Reset
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Download Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#18181b] text-white rounded-md h-[40px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Download AI Chat Memory (ZIP)
          </motion.button>
        </div>
      </div>

      {/* Data Export Options Section */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Data Export Options
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Download your data in various formats
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {exportOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="bg-white border border-[#e4e4e7] rounded-md p-4 flex items-center gap-2 hover:border-[#18181b] transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#18181b]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold leading-[18px] text-[#18181b] mb-1">
                      {option.name}
                    </p>
                    <p className="text-[12px] leading-[18px] text-[#71717a]">
                      {option.formats}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Data Retention & Cleanup Section */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Data Retention & Cleanup
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Manage data lifecycle and automated cleanup
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* Auto-Archive Setting */}
          <div className="bg-white border border-[#e4e4e7] rounded-md p-4 flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-[12px] font-semibold leading-[18px] text-[#18181b] mb-1">
                Auto-Archive Old Projects
              </h4>
              <p className="text-[12px] leading-[18px] text-[#71717a]">
                Automatically archive projects not accessed for 90 days
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-4 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              Configure
            </motion.button>
          </div>

          {/* AI Memory Retention Setting */}
          <div className="bg-white border border-[#e4e4e7] rounded-md p-4 flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-[12px] font-semibold leading-[18px] text-[#18181b] mb-1">
                AI Memory Retention
              </h4>
              <p className="text-[12px] leading-[18px] text-[#71717a]">
                Keep conversation history for improved personalization
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-4 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              Configure
            </motion.button>
          </div>
        </div>

        {/* Footer with Clear All Data Button */}
        <div className="border-t border-[#e4e4e7] p-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-red-600 text-white rounded-md h-[40px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear all data memory
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Logout Button Component
function LogoutButton() {
  const { logout, refreshProfile } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    setShowLogoutModal(false)
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoggingOut}
        className="w-full bg-[#18181b] text-white rounded-md h-[40px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] hover:bg-[#27272a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LogOut className="w-4 h-4" />
        {isLoggingOut ? 'Logging out...' : 'Log Out'}
      </motion.button>
      
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  )
}

// Security Tab Component
function SecurityTabContent() {
  const { success, error: showError } = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [activeSessionsEnabled, setActiveSessionsEnabled] = useState(true)
  const [loginHistoryFilter, setLoginHistoryFilter] = useState('All')
  const [securityAlerts, setSecurityAlerts] = useState({
    loginAlerts: true,
    passwordChanges: true,
    suspiciousActivity: true,
    newDeviceLogin: true,
  })
  const [activeSessions, setActiveSessions] = useState([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  
  // Load sessions on mount
  useEffect(() => {
    loadSessions()
  }, [])
  
  const loadSessions = async () => {
    try {
      setIsLoadingSessions(true)
      const response = await getSessions()
      setActiveSessions(response.details.sessions || [])
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setIsLoadingSessions(false)
    }
  }
  
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError('Please fill in all password fields')
      return
    }
    
    if (newPassword !== confirmPassword) {
      showError('New passwords do not match')
      return
    }
    
    if (newPassword.length < 8) {
      showError('New password must be at least 8 characters long')
      return
    }
    
    try {
      setIsChangingPassword(true)
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      success('Password updated successfully!')
    } catch (error) {
      console.error('Failed to change password:', error)
      showError(error.response?.data?.message || 'Failed to change password. Please try again.')
    } finally {
      setIsChangingPassword(false)
    }
  }
  
  const handleRevokeSession = async (sessionId) => {
    try {
      await revokeSession(sessionId)
      success('Session revoked successfully!')
      loadSessions()
    } catch (error) {
      console.error('Failed to revoke session:', error)
      showError('Failed to revoke session. Please try again.')
    }
  }
  
  const handleSaveSecurityAlerts = async () => {
    try {
      await updateSecurityAlerts(securityAlerts)
      success('Security alert preferences saved successfully!')
    } catch (error) {
      console.error('Failed to save security alerts:', error)
      showError('Failed to save security alerts. Please try again.')
    }
  }
  
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
      success('Account deleted successfully. Redirecting...')
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (error) {
      console.error('Failed to delete account:', error)
      showError('Failed to delete account. Please try again.')
    }
  }

  const passwordRequirements = [
    { id: 'length', text: 'At least 8 characters', met: true },
    { id: 'uppercase', text: 'One uppercase letter', met: true },
    { id: 'lowercase', text: 'One lowercase letter', met: false },
    { id: 'number', text: 'One number', met: true },
    { id: 'special', text: 'One special character', met: true },
  ]

  const socialConnections = [
    { id: 'google', name: 'Google', email: 'john.doe@gmail.com', connected: true, icon: Globe },
    { id: 'github', name: 'GitHub', email: 'john.doe@github.com', connected: true, icon: Github },
    { id: 'twitter', name: 'Twitter', email: 'Not connected', connected: false, icon: Twitter },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
    >
      {/* Password & Authentication Section */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Password & Authentication
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Update your password and manage authentication settings
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Password Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-[40px] px-3 border border-[#e4e4e7] rounded-md bg-white text-[14px] leading-[20px] text-[#18181b] focus:outline-none focus:border-[#18181b]"
                placeholder="Enter current password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-[40px] px-3 border border-[#e4e4e7] rounded-md bg-white text-[14px] leading-[20px] text-[#18181b] focus:outline-none focus:border-[#18181b]"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-[40px] px-3 border border-[#e4e4e7] rounded-md bg-white text-[14px] leading-[20px] text-[#18181b] focus:outline-none focus:border-[#18181b]"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
              Password requirements
            </label>
            <div className="flex flex-col gap-2">
              {passwordRequirements.map((req, index) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  {req.met ? (
                    <CheckCircle2 className="w-4 h-4 text-[#18181b]" />
                  ) : (
                    <X className="w-4 h-4 text-[#71717a]" />
                  )}
                  <p className={`text-[14px] leading-[20px] ${req.met ? 'text-[#18181b]' : 'text-[#71717a]'
                    }`}>
                    {req.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="bg-[#18181b] text-white rounded-md px-6 py-2 h-[40px] text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      {/* <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Two-Factor Authentication
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b] mb-1">
                Two-Factor Authentication
              </h4>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-4 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </motion.button>
          </div>

          {!twoFactorEnabled && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                  Setup Progress
                </p>
                <span className="px-2 py-1 bg-[#f4f4f5] border border-[#e4e4e7] rounded-2xl text-[12px] font-medium leading-[18px] text-[#71717a]">
                  Not Started
                </span>
              </div>
              <div className="relative w-full h-9 bg-[#e4e4e7] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '0%' }}
                  className="absolute left-0 top-0 h-full bg-[#18181b] rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </div> */}

      {/* Session Management Section */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Session Management
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Manage your active sessions and login history
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b] mb-1">
                Active Sessions
              </h4>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Monitor and manage devices logged into your account
              </p>
            </div>
            <ToggleSwitch
              checked={activeSessionsEnabled}
              onChange={(checked) => setActiveSessionsEnabled(checked)}
            />
          </div>

          {activeSessionsEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#fff4e6] border border-[#ffd89c] rounded-md p-4"
            >
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h5 className="text-[14px] font-semibold leading-[20px] text-[#18181b] mb-1">
                    Active Sessions Detected
                  </h5>
                  <p className="text-[14px] leading-[20px] text-[#71717a]">
                    You have 3 active sessions. Review them below to ensure they're all authorized.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Login History Section */}
      {/* <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Login History
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                View and manage your login history
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-1 bg-[#f4f4f5] border border-[#e4e4e7] rounded-md p-1 w-fit">
            {['All', 'Active', 'Expired'].map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setLoginHistoryFilter(filter)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`h-[40px] px-4 rounded-md text-[14px] font-medium leading-[20px] transition-colors ${loginHistoryFilter === filter
                  ? 'bg-white text-[#18181b] shadow-sm'
                  : 'text-[#71717a] hover:text-[#18181b]'
                  }`}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </div>
      </div> */}

      {/* Active Sessions Table */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Active Sessions
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Manage devices logged into your account
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white border border-[#e4e4e7] rounded-md overflow-hidden overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-[292px_292px_292px_292px] border-b border-[#e4e4e7]">
              <div className="p-4">
                <p className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                  Device
                </p>
              </div>
              <div className="p-4">
                <p className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                  Location
                </p>
              </div>
              <div className="p-4">
                <p className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                  Last Active
                </p>
              </div>
              <div className="p-4">
                <p className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                  Actions
                </p>
              </div>
            </div>

            {/* Table Rows */}
            {isLoadingSessions ? (
              <div className="p-8 flex items-center justify-center">
                <p className="text-[14px] leading-[20px] text-[#71717a]">Loading sessions...</p>
              </div>
            ) : activeSessions.length === 0 ? (
              <div className="p-8 flex items-center justify-center">
                <p className="text-[14px] leading-[20px] text-[#71717a]">No active sessions found</p>
              </div>
            ) : (
              activeSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="grid grid-cols-[292px_292px_292px_292px] border-b border-[#e4e4e7] last:border-b-0 hover:bg-[#f4f4f5] transition-colors"
                >
                  <div className="p-4 flex items-center">
                    <p className="text-[14px] leading-[20px] text-[#18181b]">
                      {session.device}
                    </p>
                  </div>
                  <div className="p-4 flex items-center">
                    <p className="text-[14px] leading-[20px] text-[#18181b]">
                      {session.location}
                    </p>
                  </div>
                  <div className="p-4 flex items-center">
                    <p className="text-[14px] leading-[20px] text-[#18181b]">
                      {new Date(session.lastActive).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRevokeSession(session.id)}
                      className="w-10 h-10 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-[#18181b]" />
                    </motion.button>
                </div>
              </motion.div>
            ))
            )}
          </div>
        </div>
      </div>

      {/* Security Alerts Section */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Security Alerts
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Configure security notifications and alerts
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {Object.entries(securityAlerts).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              className="bg-white border border-[#e4e4e7] rounded-md p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b] mb-1">
                  {key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h4>
                <p className="text-[14px] leading-[20px] text-[#71717a]">
                  {key === 'loginAlerts' && 'Get notified when someone logs into your account'}
                  {key === 'passwordChanges' && 'Receive alerts when your password is changed'}
                  {key === 'suspiciousActivity' && 'Get notified about suspicious login attempts'}
                  {key === 'newDeviceLogin' && 'Alert when a new device logs into your account'}
                </p>
              </div>
              <ToggleSwitch
                checked={value}
                onChange={(checked) => setSecurityAlerts(prev => ({ ...prev, [key]: checked }))}
              />
            </motion.div>
          ))}
          
          {/* Save Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveSecurityAlerts}
              className="bg-[#18181b] text-white rounded-md px-6 py-2 h-[40px] text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
            >
              Save Preferences
            </motion.button>
          </div>
        </div>
      </div>

      {/* Social Login Connections Section */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Social Login Connections
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Connect your social accounts for easier login
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {socialConnections.map((connection, index) => {
            const Icon = connection.icon
            return (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="bg-white border border-[#e4e4e7] rounded-md p-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0"
              >
                <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#18181b]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                        {connection.name}
                      </h4>
                      {connection.connected && (
                        <span className="px-2 py-1 bg-[#f4f4f5] border border-[#e4e4e7] rounded-2xl text-[12px] font-medium leading-[18px] text-[#71717a]">
                          Connected
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] leading-[20px] text-[#71717a]">
                      {connection.email}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full md:w-auto h-[40px] px-4 rounded-md text-[14px] font-medium leading-[20px] transition-colors ${connection.connected
                    ? 'bg-white border border-[#e4e4e7] text-[#18181b] hover:bg-[#f4f4f5]'
                    : 'bg-[#18181b] text-white hover:opacity-90'
                    }`}
                >
                  {connection.connected ? 'Disconnect' : 'Connect'}
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Log Out
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Sign out of your account on this device
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <LogoutButton />
        </div>
      </div>

      {/* Account Deletion Section */}
      <div className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-lg overflow-hidden">
        <div className="pt-6 px-6 pb-0">
          <div className="h-[52px] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                Account Deletion
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a]">
                Permanently delete your account and all associated data
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDeleteAccountModal(true)}
            className="w-full bg-red-600 text-white rounded-md h-[40px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </motion.button>
        </div>
      </div>
      
      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </motion.div>
  )
}
