import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PlaybookTabs from './PlaybookTabs'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775044849/Frame_4_t9fjae.png'
const MAX_MESSAGE_LENGTH = 300

const TOPICS = [
  'General Inquiry',
  'Technical Support',
  'Billing & Payments',
  'Account & Access',
  'Feature Request',
  'Bug Report',
  'Other',
]

// Icons aligned with contact page form
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function CircleHelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="#18181b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  )
}

export default function SubmitTicket() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('')
  const [topicOpen, setTopicOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <div className="w-full bg-white border-t border-b border-[#e5e7eb] px-6 md:px-[80px]">
        <div className="flex items-center gap-[8px] h-[54px]">
          <Link
            href="/playbook"
            className="text-[14px] leading-[21px] text-[#52525b] hover:underline"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Playbook
          </Link>
          <svg className="w-[16px] h-[16px] text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span
            className="text-[14px] leading-[21px] font-medium text-[#18181b]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Submit a Ticket
          </span>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="relative flex h-[400px] w-full items-center justify-center overflow-hidden px-6 md:h-[518px] md:px-[80px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <CldImage src={HERO_BG} alt="" className="absolute h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex w-full max-w-[560px] flex-col items-center gap-6 text-center md:max-w-[640px] md:gap-8"
        >
          <div className="flex min-w-0 w-full max-w-[min(100%,920px)] flex-col items-center gap-5 px-2 md:gap-6">
            <h1 className="text-center text-[36px] leading-[1.1] tracking-[-0.72px] text-white md:text-[72px] md:leading-[90px] md:tracking-[-1.44px]">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Submit a Support </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Ticket</span>
            </h1>
            <p
              className="text-center text-[16px] leading-[24px] text-white md:text-[18px] md:leading-[28px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Reach out to our support team if you need further assistance.
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-flex h-11 w-full max-w-[449px] items-center justify-center rounded-[6px] bg-white px-6 text-[14px] font-medium leading-5 text-[#0d0d0d] transition-colors hover:bg-[#f4f4f5] sm:w-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Enter MANIFESTR
          </Link>
        </motion.div>
      </section>

      {/* ─── Tabs ─── */}
      <PlaybookTabs />

      {/* ─── Form Section ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] pt-[32px] md:pt-[96px] pb-[96px]">
        <div className="flex flex-col gap-[64px] items-center">

          {/* Info blockquote */}
          <div
            className="w-full max-w-[772px] border-l-4 border-[#18181b] bg-[#f9fafb] pl-[20px] md:pl-[32px] py-[12px] md:py-[20px]"
          >
            <p
              className="text-[16px] md:text-[20px] leading-[26px] md:leading-[28px] tracking-[-0.208px] md:tracking-[-0.26px] text-[#374151]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="font-semibold text-[#18181b]">Before submitting: </span>
              <span>Please check our </span>
              <Link href="/playbook/knowledge-base" className="font-semibold underline text-[#18181b] hover:text-black">
                Knowledge Base
              </Link>
              <span> and </span>
              <Link href="/playbook/faqs" className="font-semibold underline text-[#18181b] hover:text-black">
                FAQs
              </Link>
              <span> for quick answers. For urgent issues, please include detailed steps to reproduce the problem.</span>
            </p>
          </div>

          {/* Form — same colors / layout as contact page */}
          <div className="flex w-full max-w-[880px] flex-col gap-8">
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full flex-col gap-[30px] rounded-[12px] bg-[#eff0f0] p-4 md:p-[50px]"
            >
              <div className="flex flex-col gap-3 md:gap-4">
                {/* Full Name + Email — contact layout */}
                <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <label
                      className="text-[14px] font-medium leading-5 text-[#52525b]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Full Name
                    </label>
                    <div className="flex items-center gap-2 rounded-[6px] border border-[#e4e4e7] bg-white px-3 py-2">
                      <MailIcon />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="min-w-0 flex-1 bg-transparent text-[16px] leading-6 text-[#18181b] outline-none placeholder:text-[#71717a]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                      <CircleHelpIcon />
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <label
                      className="text-[14px] font-medium leading-5 text-[#52525b]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Email
                    </label>
                    <div className="flex items-center gap-2 rounded-[6px] border border-[#e4e4e7] bg-white px-3 py-2">
                      <MailIcon />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="min-w-0 flex-1 bg-transparent text-[16px] leading-6 text-[#18181b] outline-none placeholder:text-[#71717a]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                      <CircleHelpIcon />
                    </div>
                  </div>
                </div>

                {/* Topic */}
                <div className="relative z-20 flex flex-col gap-1.5">
                  <label
                    className="text-[14px] font-medium leading-5 text-[#52525b]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Topic
                  </label>
                  <button
                    type="button"
                    onClick={() => setTopicOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-[6px] border border-[#e4e4e7] bg-white px-3 py-2 text-left"
                  >
                    <span
                      className={`text-[16px] leading-6 ${topic ? 'text-[#18181b]' : 'text-[#71717a]'}`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {topic || 'Select a topic'}
                    </span>
                    <ChevronDownIcon />
                  </button>
                  {topicOpen && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-[6px] border border-[#e4e4e7] bg-white shadow-md">
                      {TOPICS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setTopic(t)
                            setTopicOpen(false)
                          }}
                          className="w-full px-3 py-2.5 text-left text-sm leading-5 text-[#18181b] transition-colors hover:bg-[#f4f4f5]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[14px] font-medium leading-5 text-[#52525b]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Subject
                  </label>
                  <div className="flex items-center rounded-[6px] border border-[#e4e4e7] bg-white px-3 py-2">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief description of your issue"
                      className="w-full min-w-0 flex-1 bg-transparent text-[16px] leading-6 text-[#18181b] outline-none placeholder:text-[#71717a]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[14px] font-medium leading-5 text-[#52525b]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_MESSAGE_LENGTH) setMessage(e.target.value)
                    }}
                    placeholder="Enter your main text here..."
                    rows={4}
                    className="resize-none rounded-[6px] border border-[#e4e4e7] bg-white px-3 py-2 text-[16px] leading-6 text-[#18181b] outline-none placeholder:text-[#71717a]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <p
                    className="text-right text-sm leading-5 text-[#71717a]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {message.length}/{MAX_MESSAGE_LENGTH}
                  </p>
                </div>
              </div>

              {/* Attach Files */}
              <div className="flex flex-col gap-1.5">
                <div
                  className="flex gap-0.5 text-sm font-medium leading-5"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span className="text-[#464649]">Attach Files</span>
                  <span className="text-[#464649]">(Optional)</span>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      fileInputRef.current?.click()
                    }
                  }}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[6px] border border-[#e4e4e7] bg-white p-6 transition-colors hover:border-[#a1a1aa]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".png,.svg,.jpg,.jpeg,.ai,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#18181b]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                  >
                    <UploadIcon />
                    Click to upload
                  </button>
                  <p
                    className="text-center text-xs leading-[18px] text-[#71717a]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    PNG, SVG, JPG, AI, PDF, or Word (max 10MB per file)
                  </p>
                  {files.length > 0 && (
                    <p
                      className="mt-1 max-w-full wrap-break-word text-center text-xs leading-[18px] text-[#18181b]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {files.map((f) => f.name).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="h-12 w-full rounded-[6px] bg-[#18181b] text-sm font-medium leading-5 text-white transition-colors hover:bg-[#27272a]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Send Request
              </button>
            </motion.form>

            {/* Help links */}
            <div className="flex w-full flex-col items-center gap-3">
              <p
                className="text-[14px] leading-[21px] text-[#52525b] text-center"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Need immediate help?
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-[8px] sm:gap-[16px] justify-center">
                <Link
                  href="/playbook/knowledge-base"
                  className="text-[14px] leading-[21px] font-medium text-[#18181b] hover:underline"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Browse Knowledge Base →
                </Link>
                <Link
                  href="/playbook/demo-videos"
                  className="text-[14px] leading-[21px] font-medium text-[#18181b] hover:underline"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Watch Tutorial Videos →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
