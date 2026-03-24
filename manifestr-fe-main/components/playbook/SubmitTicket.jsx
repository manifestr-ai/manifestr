import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PlaybookTabs from './PlaybookTabs'

const HERO_BG = 'https://www.figma.com/api/mcp/asset/1afa9a77-6046-4313-b9d3-389bcc1ef047'
const MAX_MESSAGE_LENGTH = 300

function UserIcon() {
  return (
    <svg className="w-[20px] h-[20px] text-[#94a3b8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="w-[20px] h-[20px] text-[#94a3b8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

export default function SubmitTicket() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

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
      <section className="relative w-full h-[518px] flex items-center justify-center px-[80px] py-[96px] overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img src={HERO_BG} alt="" className="absolute w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/34" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-[20px] text-center"
        >
          <h1 className="text-[72px] leading-[90px] tracking-[-1.44px] text-white whitespace-nowrap">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
              Submit a Support{' '}
            </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              Ticket
            </span>
          </h1>
          <p
            className="text-[18px] leading-[28px] text-white"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Reach out to our support team if you need further assistance.
          </p>
        </motion.div>
      </section>

      {/* ─── Tabs ─── */}
      <PlaybookTabs />

      {/* ─── Form Section ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-[96px]">
        <div className="flex flex-col gap-[64px] items-center">

          {/* Info blockquote */}
          <div
            className="w-full max-w-[772px] border-l-4 border-[#18181b] bg-[#f9fafb] pl-[32px] py-[20px]"
          >
            <p
              className="text-[20px] leading-[28px] tracking-[-0.26px] text-[#374151]"
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

          {/* Form card */}
          <div className="w-full max-w-[800px] flex flex-col gap-[32px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white border border-[#e5e7eb] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] p-[41px] pb-px"
            >
              <div className="flex flex-col gap-[40px] items-center">
                {/* Fields */}
                <div className="flex flex-col gap-[24px] w-full">

                  {/* Full Name */}
                  <div className="flex flex-col gap-[8px] w-full">
                    <label
                      className="text-[14px] leading-[20px] font-bold text-[#18181b] tracking-[-0.084px]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Full Name
                    </label>
                    <div className="flex items-center gap-[8px] border border-[#d1d5db] rounded-[8px] min-h-[48px] p-[12px] bg-white">
                      <UserIcon />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="flex-1 text-[16px] leading-[22px] font-medium text-[#18181b] placeholder:text-[#94a3b8] tracking-[-0.112px] outline-none bg-transparent"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-[8px] w-full">
                    <label
                      className="text-[14px] leading-[20px] font-bold text-[#18181b] tracking-[-0.084px]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Email Address
                    </label>
                    <div className="flex items-center gap-[8px] border border-[#d1d5db] rounded-[8px] min-h-[48px] p-[12px] bg-white">
                      <MailIcon />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 text-[16px] leading-[22px] font-medium text-[#18181b] placeholder:text-[#94a3b8] tracking-[-0.112px] outline-none bg-transparent"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-[8px] w-full">
                    <label
                      className="text-[14px] leading-[20px] font-bold text-[#18181b] tracking-[-0.084px]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Subject
                    </label>
                    <div className="flex items-center border border-[#d1d5db] rounded-[8px] min-h-[48px] p-[12px] bg-white">
                      <input
                        type="text"
                        placeholder="Brief description of your issue"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="flex-1 text-[16px] leading-[22px] font-medium text-[#18181b] placeholder:text-[#94a3b8] tracking-[-0.112px] outline-none bg-transparent"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-[8px] w-full">
                    <label
                      className="text-[14px] leading-[20px] font-bold text-[#18181b] tracking-[-0.084px]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Message
                    </label>
                    <div className="flex flex-col border border-[#d1d5db] rounded-[8px] p-[12px] bg-white" style={{ minHeight: '144px' }}>
                      <textarea
                        placeholder="Enter your main text here..."
                        value={message}
                        onChange={(e) => {
                          if (e.target.value.length <= MAX_MESSAGE_LENGTH) setMessage(e.target.value)
                        }}
                        className="flex-1 text-[16px] leading-[1.6] text-[#18181b] placeholder:text-[#94a3b8] outline-none bg-transparent resize-none"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '90px' }}
                      />
                      <div className="flex items-center justify-between mt-[8px]">
                        <span
                          className="text-[12px] leading-[16px] font-medium text-[#94a3b8] tracking-[-0.06px]"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {message.length}/{MAX_MESSAGE_LENGTH}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  className="w-full h-[44px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium flex items-center justify-center hover:bg-[#27272a] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Send Request
                </button>
              </div>
            </motion.div>

            {/* Help links */}
            <div className="flex flex-col gap-[12px] items-center w-full">
              <p
                className="text-[14px] leading-[21px] text-[#52525b] text-center"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Need immediate help?
              </p>
              <div className="flex items-center gap-[16px] justify-center">
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
