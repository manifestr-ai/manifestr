import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Sun,
  Moon,
  Crown,
  CreditCard,
  BookText,
  Video,
  CircleHelp,
  ThumbsUp,
  MessageCircleHeart,
  Globe,
  LogOut,
  Languages,
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '../../contexts/AuthContext'
import LogoutModal from '../ui/LogoutModal'
import { normalizeUrl } from '../../utils/url'

export default function ProfileDropdown() {
  const router = useRouter()
  const { logout, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [theme, setTheme] = useState('light')
  const dropdownRef = useRef(null)

  const profileImageUrl = normalizeUrl(user?.profile_image_url)
  const displayName = user
    ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email
    : 'User'
  const planLabel = user?.tier
    ? `${user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Plan`
    : 'Free Plan'

  const handleLogout = () => {
    setIsOpen(false)
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    setShowLogoutModal(false)
    await logout()
  }

  const navigate = (path) => {
    setIsOpen(false)
    router.push(path)
  }

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
    <motion.div className="relative" ref={dropdownRef}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.08)] bg-[#f4f4f5] transition-opacity hover:opacity-90"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <Image
            src="/assets/dummy/avatar.png"
            alt="Profile"
            width={40}
            height={40}
            quality={100}
            className="h-full w-full rounded-full object-cover"
          />
        )}
      </motion.button>

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
              className="absolute right-0 top-[calc(100%+12px)] z-50 w-[248px] overflow-hidden rounded-xl border border-[#e4e4e7] bg-white shadow-lg"
            >
              {/* Header — Figma 9889:11368 */}
              <div className="border-b border-[#e4e4e7] px-2 py-3">
                <div className="flex items-start gap-4 rounded-xl border border-[#e8e8e9] bg-[#18181b] px-3 py-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.08)]">
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src="/assets/dummy/avatar.png"
                        alt="Profile"
                        width={48}
                        height={48}
                        quality={100}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold leading-5 text-white">{displayName}</p>
                    <p className="truncate text-[14px] font-normal leading-5 text-[#cfcfcf]">
                      {user?.email || 'user@email.com'}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/settings?tab=Plans')}
                      className="mt-2 inline-flex items-center rounded-2xl border border-[#e4e4e7] bg-[#f4f4f5] px-2 py-0.5"
                    >
                      <span className="text-[12px] font-medium leading-[18px] text-[#0e0e11]">
                        {planLabel}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Menu items — Figma 9889:11377 */}
              <div className="flex max-h-[500px] flex-col overflow-y-auto py-1">
                <MenuItem
                  icon={Settings}
                  label="Settings"
                  onClick={() => navigate('/settings')}
                />
                <MenuItem icon={Languages} label="Language" />
                <ThemeRow theme={theme} onThemeChange={setTheme} />

                <SectionLabel>Billings</SectionLabel>
                <MenuItem
                  icon={Crown}
                  label="Upgrade Plan"
                  onClick={() => navigate('/settings?tab=Plans')}
                />
                <MenuItem
                  icon={CreditCard}
                  label="Billing & Payments"
                  onClick={() => navigate('/settings?tab=Billings')}
                />

                <SectionLabel>Knowledge Hub</SectionLabel>
                <MenuItem
                  icon={BookText}
                  label="The Playbook"
                  onClick={() => navigate('/playbook')}
                />
                <MenuItem icon={Video} label="Tutorials" />

                <SectionLabel>Support</SectionLabel>
                <MenuItem icon={CircleHelp} label="Help" onClick={() => navigate('/faqs')} />
                <MenuItem
                  icon={ThumbsUp}
                  label="Share Feedback"
                  onClick={() =>
                    window.open(
                      'https://mail.google.com/mail/u/0/?fs=1&to=hello@manifestr.ai&su=Feedback&tf=cm',
                      '_blank',
                    )
                  }
                />
                <MenuItem
                  icon={MessageCircleHeart}
                  label="Contact Us"
                  onClick={() =>
                    window.open(
                      'https://mail.google.com/mail/u/0/?fs=1&to=hello@manifestr.ai&tf=cm',
                      '_blank',
                    )
                  }
                />

                <SectionLabel>System</SectionLabel>
                <MenuItem
                  icon={Globe}
                  label="Visit Website"
                  onClick={() => window.open('https://manifestr.ai', '_blank')}
                />
                <MenuItem icon={LogOut} label="Log Out" onClick={handleLogout} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </motion.div>
  )
}

function MenuItem({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center px-1.5 py-px text-left transition-colors hover:bg-[#f4f4f5]"
    >
      <span className="flex w-full items-center gap-2 rounded-md px-2.5 py-2">
        <Icon className="h-4 w-4 shrink-0 text-[#52525b]" strokeWidth={2} />
        <span className="flex-1 text-[14px] font-semibold leading-5 text-[#52525b]">{label}</span>
      </span>
    </button>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="px-4 pb-1.5 pt-2 text-[10px] font-medium uppercase leading-[15px] tracking-[0.4px] text-[#7c7c7c]">
      {children}
    </p>
  )
}

function ThemeRow({ theme, onThemeChange }) {
  return (
    <div className="flex w-full items-center px-1.5 py-px">
      <div className="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 shrink-0 text-[#52525b]" strokeWidth={2} />
          <span className="text-[14px] font-semibold leading-5 text-[#52525b]">Theme</span>
        </div>
        <div className="flex h-[30px] shrink-0 items-center gap-1 rounded-md bg-[#f4f4f5] p-0.5">
          <button
            type="button"
            onClick={() => onThemeChange('light')}
            className={`flex h-full items-center justify-center rounded-md px-3 transition-colors ${theme === 'light'
              ? 'border border-[#e4e4e7] bg-white'
              : 'bg-transparent'
              }`}
            aria-label="Light theme"
          >
            <Sun className="h-4 w-4 text-[#52525b]" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => onThemeChange('dark')}
            className={`flex h-full items-center justify-center rounded-md px-3 transition-colors ${theme === 'dark'
              ? 'border border-[#e4e4e7] bg-white'
              : 'bg-transparent'
              }`}
            aria-label="Dark theme"
          >
            <Moon className="h-4 w-4 text-[#52525b]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
