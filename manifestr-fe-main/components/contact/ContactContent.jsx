import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const M_LOGO = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775028779/Ellipse_elyemk.svg'

const TOPICS = [
  'General Inquiry',
  'Technical Support',
  'Billing & Payments',
  'Partnership Opportunity',
  'Feature Request',
  'Bug Report',
  'Other',
]

const ENQUIRY_CARDS = [
  {
    title: 'Partner with Us',
    description: 'For partnerships, collaborations, and strategic opportunities aligned with MANIFESTR.',
    email: 'partnerships@manifestr.ai',
  },
  {
    title: 'Media Inquiries',
    description: 'For press, interviews, and media-related enquiries.',
    email: 'frontpage@manifestr.ai',
  },
]

const MAX_CHARS = 2000

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function CircleHelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M13 8H7" />
      <path d="M17 12H7" />
    </svg>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}

export default function ContactContent() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    topic: '',
    subject: '',
    message: '',
  })
  const [files, setFiles] = useState([])
  const [topicOpen, setTopicOpen] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (field) => (e) => {
    const val = e.target.value
    if (field === 'message' && val.length > MAX_CHARS) return
    setForm((prev) => ({ ...prev, [field]: val }))
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <>
      {/* Form Section */}
      <section className="w-full bg-white px-6 md:px-[80px] pt-[48px] md:pt-[96px] pb-[20px] md:pb-[28px] flex flex-col items-center gap-[24px] md:gap-[36px]">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[20px] md:text-[24px] leading-[24px] md:leading-[30px] text-black text-center max-w-[312px] md:max-w-[910px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
        >
          Have a question, need support, or want to start a conversation?
          <br />
          Reach out below and we&apos;ll point you in the right direction.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="w-full max-w-[880px] bg-[#eff0f0] rounded-[12px] p-[16px] md:p-[50px] flex flex-col gap-[30px]"
        >
          <div className="flex flex-col gap-[12px] md:gap-[16px]">
            {/* Full Name + Email */}
            <div className="flex flex-col md:flex-row gap-[12px] md:gap-[16px]">
              <div className="flex-1 flex flex-col gap-[6px]">
                <label className="text-[14px] leading-[20px] font-medium text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Full Name
                </label>
                <div className="flex items-center gap-[8px] bg-white border border-[#e4e4e7] rounded-[6px] px-[12px] py-[8px]">
                  <MailIcon />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={handleChange('fullName')}
                    placeholder="Your full name"
                    className="flex-1 bg-transparent text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] outline-none"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <CircleHelpIcon />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-[6px]">
                <label className="text-[14px] leading-[20px] font-medium text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Email
                </label>
                <div className="flex items-center gap-[8px] bg-white border border-[#e4e4e7] rounded-[6px] px-[12px] py-[8px]">
                  <MailIcon />
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="umar@company.com"
                    className="flex-1 bg-transparent text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] outline-none"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <CircleHelpIcon />
                </div>
              </div>
            </div>

            {/* Topic */}
            <div className="flex flex-col gap-[6px] relative">
              <label className="text-[14px] leading-[20px] font-medium text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Topic
              </label>
              <button
                type="button"
                onClick={() => setTopicOpen((prev) => !prev)}
                className="flex items-center justify-between bg-white border border-[#e4e4e7] rounded-[6px] px-[12px] py-[8px] text-left w-full"
              >
                <span
                  className={`text-[16px] leading-[24px] ${form.topic ? 'text-[#18181b]' : 'text-[#71717a]'}`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {form.topic || 'Select a topic'}
                </span>
                <ChevronDownIcon />
              </button>
              {topicOpen && (
                <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-md z-10">
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setForm((prev) => ({ ...prev, topic: t })); setTopicOpen(false) }}
                      className="w-full text-left px-[12px] py-[10px] text-[14px] leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] leading-[20px] font-medium text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Subject
              </label>
              <div className="flex items-center bg-white border border-[#e4e4e7] rounded-[6px] px-[12px] py-[8px]">
                <input
                  type="text"
                  value={form.subject}
                  onChange={handleChange('subject')}
                  placeholder="Brief summary of your message..."
                  className="flex-1 bg-transparent text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] outline-none"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </div>

            {/* Your Message */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] leading-[20px] font-medium text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Your Message
              </label>
              <textarea
                value={form.message}
                onChange={handleChange('message')}
                placeholder="Provide as much detail as you can.."
                rows={4}
                className="bg-white border border-[#e4e4e7] rounded-[6px] px-[12px] py-[8px] text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] outline-none resize-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <p className="text-[14px] leading-[20px] text-[#71717a] text-right" style={{ fontFamily: 'Inter, sans-serif' }}>
                {form.message.length}/{MAX_CHARS}
              </p>
            </div>
          </div>

          {/* Attach Files */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[2px] text-[14px] leading-[20px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="text-[#464649]">Attach Files</span>
              <span className="text-[#464649]">(Optional)</span>
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border border-[#e4e4e7] rounded-[6px] p-[24px] flex flex-col items-center justify-center gap-[8px] cursor-pointer hover:border-[#a1a1aa] transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".png,.svg,.jpg,.jpeg,.ai"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                className="flex items-center gap-[8px] h-[36px] px-[12px] py-[8px] bg-white border border-[#e4e4e7] rounded-[6px] text-[14px] leading-[20px] font-medium text-[#18181b]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <UploadIcon />
                Click to upload
              </button>
              <p className="text-[12px] leading-[18px] text-[#71717a] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                PNG, SVG, JPG, or AI file (min. 200x200px)
              </p>
              {files.length > 0 && (
                <p className="text-[12px] leading-[18px] text-[#18181b] mt-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {files.map((f) => f.name).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-[48px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Send a Message
          </button>
        </motion.form>
      </section>

      {/* Dedicated Enquiries Section */}
      <section className="w-full bg-white px-6 md:px-[80px] pt-[20px] md:pt-[28px] pb-[48px] md:pb-[96px] flex flex-col items-center">
        <div className="flex flex-col items-center gap-[24px] w-full max-w-[1280px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col items-center gap-[16px] md:gap-[24px]"
          >
            <h2 className="text-[30px] md:text-[60px] leading-tight md:leading-[72px] tracking-[-0.6px] md:tracking-[-1.2px]">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>For </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Dedicated</span>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> Enquiries</span>
            </h2>
            <p className="text-[16px] leading-[24px] text-[#52525b] max-w-[603px] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Reach out directly for specific requests or partnerships.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-[16px] md:gap-[24px] w-full max-w-[912px] md:items-stretch">
            {ENQUIRY_CARDS.map((card) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex h-full min-h-0 w-full flex-col items-center gap-[24px] rounded-[12px] bg-[#e4e4e7] p-[14px] text-center shadow-[0px_1px_2px_0px_rgba(10,13,18,0.06)] md:max-w-[444px] md:flex-1 md:min-w-0 md:p-[24px]"
              >
                <div className="size-[60px] shrink-0 overflow-hidden rounded-full">
                  <CldImage src={M_LOGO} alt="MANIFESTR" className="h-full w-full object-cover" />
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-[8px] text-[#3c3c3c]">
                  <h3
                    className="text-[24px] leading-[32px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {card.title}
                  </h3>
                  <p className="flex-1 text-[16px] leading-[24px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {card.description}
                  </p>
                </div>
                <div className="flex h-[34px] w-fit shrink-0 items-center justify-center gap-[8px] rounded-[8px] border border-[#1b1b1b] px-[16px] py-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] md:border-0 md:bg-white">
                  <MessageIcon />
                  <span className="text-[12px] leading-[18px] text-[#020617]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {card.email}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <a
            href="#"
            className="flex items-center gap-[8px] px-[16px] py-[4px] text-[14px] leading-[20px] font-medium text-[#2563eb] hover:underline"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Submit Feedback
            <ArrowUpRightIcon />
          </a>
        </div>
      </section>
    </>
  )
}
