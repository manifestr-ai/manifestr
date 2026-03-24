import Link from 'next/link'
import { useState } from 'react'

const FOOTER_LOGO = '/assets/landing/footer-logo.svg'

const SOCIAL_ICONS = {
  linkedin: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  tiktok: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  instagram: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  facebook: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  twitter: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  threads: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.178.429-2.253 1.39-3.025.856-.687 2.02-1.086 3.39-1.162 1.002-.055 1.929.035 2.775.265-.11-.572-.32-1.06-.629-1.455-.469-.598-1.182-.898-2.122-.898h-.033c-.74.01-1.96.256-2.654 1.344l-1.752-1.03c.749-1.276 2.01-2.304 3.766-2.424h.056c1.562 0 2.822.572 3.645 1.654.741.976 1.14 2.283 1.183 3.882.524.265 1.001.58 1.424.945 1.177 1.016 1.932 2.413 2.187 4.042.335 2.14-.247 4.389-1.744 5.884C18.612 22.889 16.08 23.89 12.186 24zm2.088-9.754c-.878-.046-3.132.066-3.372 1.452-.063.366.017.985.633 1.384.626.405 1.477.457 2.089.422 1.268-.072 2.065-.674 2.515-1.894a7.035 7.035 0 00.346-1.64 5.784 5.784 0 00-2.211.276z" />
    </svg>
  ),
  youtube: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
}

const productLinks = [
  { label: 'The Toolkit', href: '/toolkit' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Affiliate Program', href: '/affiliate' },
]

const supportLinks = [
  { label: 'The Playbook', href: '/playbook' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Security', href: '/security' },
]

function FooterLinkColumn({ title, links }) {
  return (
    <div className="flex flex-col gap-8">
      <h3
        className="text-[24px] md:text-[32px] leading-[36px] text-[#f9fafb] tracking-[-0.64px] font-medium"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-7">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[16px] md:text-[18px] leading-[20px] text-white font-medium hover:text-white/80 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-[#09090b] text-white w-full">
      <div className="w-full overflow-hidden py-6 md:py-10">
        <img
          src={FOOTER_LOGO}
          alt="MANIFESTR"
          className="w-full max-h-[120px] md:max-h-[161px] object-contain"
        />
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px] py-12 md:py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
          <div className="flex flex-wrap gap-12 md:gap-[80px] lg:gap-[127px]">
            <FooterLinkColumn title="Product" links={productLinks} />
            <FooterLinkColumn title="Company" links={companyLinks} />
            <FooterLinkColumn title="Support" links={supportLinks} />
          </div>

          <div className="flex flex-col gap-8 lg:max-w-[460px]">
            <div>
              <p
                className="text-[16px] md:text-[18px] leading-[20px] text-white font-medium mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Unlock exclusive updates
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-[54px] px-3 py-2 bg-white rounded-md text-[18px] text-[#71717a] placeholder:text-[#71717a] outline-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  className="h-[54px] px-6 bg-white rounded-md text-[18px] text-black font-medium hover:bg-white/90 transition-colors cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Subscribe
                </button>
              </div>
              <p
                className="text-[14px] md:text-[18px] leading-[20px] text-white font-medium mt-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Only insights that move your work forward
              </p>
            </div>

            <div>
              <h3
                className="text-[24px] md:text-[32px] leading-[36px] text-[#f9fafb] tracking-[-0.64px] font-medium mb-4"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                Follow us
              </h3>
              <div className="flex gap-4">
                {Object.entries(SOCIAL_ICONS).map(([name, icon]) => (
                  <a
                    key={name}
                    href="#"
                    className="w-10 h-10 flex items-center justify-center text-white hover:text-white/70 transition-colors"
                    aria-label={name}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px]">
        <div className="border-t border-white/20 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-[14px] md:text-[18px] leading-[20px] text-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            &copy; 2025 MANIFESTR. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <Link
              href="/privacy"
              className="text-[14px] md:text-[18px] leading-[20px] text-white hover:text-white/80 transition-colors px-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[14px] md:text-[18px] leading-[20px] text-white hover:text-white/80 transition-colors px-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-[14px] md:text-[18px] leading-[20px] text-white hover:text-white/80 transition-colors px-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Cookies Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
