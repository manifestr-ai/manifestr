import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Menu, X } from 'lucide-react'
import ChevronDown from '../icons/ChevronDown'
import Logo from '../logo/Logo'
import { useAuth } from '../../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const ABOUT_LINKS = [
  { label: 'About Manifestr', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Affiliates', href: '/affiliates' },
]

const SUPPORT_LINKS = [
  { label: 'The Playbook', href: '/playbook' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Security', href: '/security' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Preferences', href: '/cookies' },
]

// Routes that count as "active" for each top-level nav item
const ABOUT_ROUTES = ['/about', '/careers', '/affiliates']
const SUPPORT_ROUTES = ['/playbook', '/faqs', '/contact', '/terms-of-service', '/security', '/privacy', '/cookies', '/support']

function NavDropdown({ label, href, links, align = 'left', isActive }) {
  return (
    <div className="relative group">
      {/* Clicking the label goes to href; hovering the whole group shows dropdown */}
      <Link
        href={href}
        className="flex items-center gap-2 text-l2-medium text-base-foreground px-1"
      >
        <span
          className={`pb-1 border-b-2 transition-colors ${isActive ? 'border-base-foreground' : 'border-transparent'}`}
        >
          {label}
        </span>
        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
      </Link>

      <div
        className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} pt-2
          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}
      >
        <div className="bg-white border border-[#e4e4e7] rounded-md shadow-lg py-2 min-w-[200px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-l2-medium text-base-foreground hover:bg-[#f4f4f5] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileAccordion({ label, href, links, onNavigate }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-between w-full">
        <Link
          href={href}
          className="text-lg font-medium text-gray-900"
          onClick={onNavigate}
        >
          {label}
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-1 text-gray-500"
          aria-label={`Toggle ${label} submenu`}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 pl-4 pt-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={onNavigate}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Header() {
  const { user } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const closeMobile = () => setIsMobileMenuOpen(false)

  const path = router.pathname

  const navLink = (href) =>
    `text-l2-medium text-base-foreground px-1 pb-1 border-b-2 transition-colors ${
      path === href ? 'border-base-foreground' : 'border-transparent'
    }`

  return (
    <>
      <header className="bg-[rgba(255,255,255,0.9)] fixed top-0 left-0 right-0 z-50 border-b border-[#e4e4e7] backdrop-blur-sm">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px] py-[20px]">
          <div className="flex items-center justify-between md:justify-start">

            {/* Mobile: Logo */}
            <div className="md:hidden">
              <Logo size="sm" />
            </div>

            {/* Desktop Left Navigation */}
            <div className="hidden md:flex items-center gap-[44px] flex-1">
              <Link href="/" className={navLink('/')}>Home</Link>
              <Link href="/tools" className={navLink('/tools')}>Tools</Link>
              <NavDropdown
                label="About"
                href="/about"
                links={ABOUT_LINKS}
                isActive={ABOUT_ROUTES.includes(path)}
              />
              <Link href="/blog" className={navLink('/blog')}>Blog</Link>
            </div>

            {/* Desktop Logo - Centered */}
            <div className="hidden md:flex w-[271.392px] justify-center">
              <Logo size="md" />
            </div>

            {/* Desktop Right Navigation */}
            <div className="hidden md:flex items-center gap-[24px] flex-1 justify-end">
              <div className="flex items-center gap-[44px]">
                <Link href="/pricing" className={navLink('/pricing')}>Pricing</Link>
                <NavDropdown
                  label="Support"
                  href="/support"
                  links={SUPPORT_LINKS}
                  align="right"
                  isActive={SUPPORT_ROUTES.includes(path)}
                />
              </div>
              <div className="flex items-center gap-[12px]">
                {user ? (
                  <Link
                    href="/home"
                    className="bg-[#18181b] text-white h-[36px] px-3 py-2 rounded-md text-l2-medium hover:opacity-90 transition-opacity flex items-center"
                  >
                    Home
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="bg-base-background border border-[#e4e4e7] text-base-foreground h-[36px] px-3 py-2 rounded-md text-l2-medium hover:bg-base-muted transition-colors flex items-center"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-[#18181b] text-white h-[36px] px-3 py-2 rounded-md text-l2-medium hover:opacity-90 transition-opacity flex items-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -mr-2 text-gray-800"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer — rendered outside header to avoid backdrop-blur stacking context */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black z-60"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-70 shadow-xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <Logo size="sm" />
                <button onClick={closeMobile} className="p-2 -mr-2 text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <Link
                  href="/"
                  className={`text-lg font-medium ${path === '/' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'}`}
                  onClick={closeMobile}
                >
                  Home
                </Link>
                <Link
                  href="/tools"
                  className={`text-lg font-medium ${path === '/tools' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'}`}
                  onClick={closeMobile}
                >
                  Tools
                </Link>
                <MobileAccordion label="About" href="/about" links={ABOUT_LINKS} onNavigate={closeMobile} />
                <Link
                  href="/blog"
                  className={`text-lg font-medium ${path === '/blog' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'}`}
                  onClick={closeMobile}
                >
                  Blog
                </Link>
                <Link
                  href="/pricing"
                  className={`text-lg font-medium ${path === '/pricing' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'}`}
                  onClick={closeMobile}
                >
                  Pricing
                </Link>
                <MobileAccordion label="Support" href="/support" links={SUPPORT_LINKS} onNavigate={closeMobile} />

                <div className="border-t border-gray-100 my-2" />

                {user ? (
                  <Link
                    href="/home"
                    className="bg-[#18181b] text-white h-[44px] px-4 rounded-md font-medium flex items-center justify-center hover:opacity-90"
                    onClick={closeMobile}
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      className="bg-white border border-[#e4e4e7] text-gray-900 h-[44px] px-4 rounded-md font-medium flex items-center justify-center hover:bg-gray-50"
                      onClick={closeMobile}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-[#18181b] text-white h-[44px] px-4 rounded-md font-medium flex items-center justify-center hover:opacity-90"
                      onClick={closeMobile}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
