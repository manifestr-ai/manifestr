import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Sun, Moon, Crown, CreditCard, FileText, Video, HelpCircle, ThumbsUp, MessageSquare, Globe, LogOut, Languages } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '../../contexts/AuthContext'
import LogoutModal from '../ui/LogoutModal'
import { normalizeUrl } from '../../utils/url'

export default function ProfileDropdown() {
  const router = useRouter()
  const { logout, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [theme, setTheme] = useState('light') // 'light' or 'dark'
  const dropdownRef = useRef(null)
  
  const profileImageUrl = normalizeUrl(user?.profile_image_url)

  const handleLogout = () => {
    setIsOpen(false)
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    setShowLogoutModal(false)
    await logout()
  }



  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-[40px] h-[40px] rounded-full border border-[rgba(0,0,0,0.08)] bg-[#f4f4f5] flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
      >
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
            width={32}
            height={32}
            className="w-full h-full object-cover rounded-full"
          />
        )}
      </motion.button>

      {/* Profile Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-[calc(100%+12px)] w-[320px] bg-white rounded-xl shadow-lg border border-[#e4e4e7] z-50 overflow-hidden"
            >
              {/* Main Content */}
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Profile Card - Dark Background */}
                <div className="bg-[#18181b] rounded-xl px-4 pt-4 pb-3 mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-[48px] h-[48px] rounded-full overflow-hidden shrink-0 bg-gray-700">
                      {profileImageUrl ? (
                        <img
                          src={profileImageUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src="/assets/dummy/avatar.png"
                          alt="Profile"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-[16px] leading-[24px] mb-0.5">
                        {user ? `${user.first_name} ${user.last_name}` : 'User'}
                      </h3>
                      <p className="text-gray-300 text-[14px] leading-[20px] truncate">
                        {user?.email || 'user@email.com'}
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full bg-white text-[#18181b] font-medium text-[14px] leading-[20px] py-2 px-3 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      setIsOpen(false)
                      router.push('/settings?tab=Plans')
                    }}
                  >
                    {user?.tier ? `${user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Plan` : 'Free Plan'}
                  </button>
                </div>

                {/* General Settings */}
                <div className="py-2">
                  <MenuItem
                    icon={Settings}
                    label="Settings"
                    onClick={() => {
                      setIsOpen(false)
                      router.push('/settings')
                    }}
                  />
                  <MenuItem icon={Languages} label="Language" />
                  <div className="flex items-center justify-between px-3 py-2.5 hover:bg-[#f4f4f5] rounded-md transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Sun className="w-5 h-5 text-[#18181b]" />
                      <span className="text-[14px] leading-[20px] text-[#18181b] font-normal">Theme</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#f4f4f5] border border-[#e4e4e7] rounded-md p-0.5">
                      <button
                        onClick={() => setTheme('light')}
                        className={`px-2 py-1 rounded transition-colors ${theme === 'light'
                          ? 'bg-white border border-[#e4e4e7]'
                          : 'bg-transparent'
                          }`}
                      >
                        <Sun className="w-4 h-4 text-[#18181b]" />
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`px-2 py-1 rounded transition-colors ${theme === 'dark'
                          ? 'bg-white border border-[#e4e4e7]'
                          : 'bg-transparent'
                          }`}
                      >
                        <Moon className="w-4 h-4 text-[#18181b]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* BILLINGS */}
                <div className="py-2">
                  <CategoryHeading label="BILLINGS" />
                  <MenuItem icon={Crown} label="Upgrade Plan" />
                  <MenuItem icon={CreditCard} label="Billing & Payments" />
                </div>

                {/* KNOWLEDGE HUB */}
                <div className="py-2">
                  <CategoryHeading label="KNOWLEDGE HUB" />
                  <MenuItem icon={FileText} label="The Playbook" />
                  <MenuItem icon={Video} label="Tutorials" />
                </div>

                {/* SUPPORT */}
                <div className="py-2">
                  <CategoryHeading label="SUPPORT" />
                  <MenuItem icon={HelpCircle} label="Help" />
                  <MenuItem icon={ThumbsUp} label="Share Feedback" onClick={() => window.open('https://mail.google.com/mail/u/0/?fs=1&to=hello@manifestr.ai&su=Feedback&tf=cm', '_blank')} />
                  <MenuItem icon={MessageSquare} label="Contact Us" onClick={() => window.open('https://mail.google.com/mail/u/0/?fs=1&to=hello@manifestr.ai&tf=cm', '_blank')} />
                </div>

                {/* SYSTEM */}
                <div className="py-2">
                  <CategoryHeading label="SYSTEM" />
                  <MenuItem icon={Globe} label="Visit Website" onClick={() => window.open('https://manifestr.ai', '_blank')} />
                  <MenuItem icon={LogOut} label="Log Out" onClick={handleLogout} isDestructive />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </div>
  )
}

// Menu Item Component
function MenuItem({ icon: Icon, label, onClick, isDestructive = false }) {
  const textColor = isDestructive ? 'text-[#dc2626]' : 'text-[#18181b]'
  const hoverBg = isDestructive ? 'hover:bg-red-50' : 'hover:bg-[#f4f4f5]'

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 ${hoverBg} rounded-md transition-colors cursor-pointer text-left`}
    >
      <Icon className={`w-5 h-5 ${textColor}`} />
      <span className={`text-[14px] leading-[20px] ${textColor} font-normal`}>{label}</span>
    </motion.button>
  )
}

// Category Heading Component
function CategoryHeading({ label }) {
  return (
    <div className="px-3 py-1.5 mb-1">
      <p className="text-[12px] leading-[16px] text-[#71717a] font-medium uppercase tracking-wide">
        {label}
      </p>
    </div>
  )
}

