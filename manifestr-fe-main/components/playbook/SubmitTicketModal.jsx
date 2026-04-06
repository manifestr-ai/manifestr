import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const CATEGORIES = [
  'Bug Report',
  'Feature Request',
  'Account Issue',
  'Billing',
  'General Question',
]

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function CloudUploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  )
}

function ChevronDownIcon({ className = '' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function TicketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5v2" />
      <path d="M15 11v2" />
      <path d="M15 17v2" />
      <path d="M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z" />
    </svg>
  )
}

function SubmitFormModal({ onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [catOpen, setCatOpen] = useState(false)

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-[16px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_3px_3px_-1.5px_rgba(10,13,18,0.04)] w-full max-w-[544px] overflow-hidden flex flex-col">
      <div className="flex flex-col gap-[24px] px-[24px] pb-[24px]">
        {/* Header */}
        <div className="relative pt-[24px]">
          <div className="flex flex-col gap-[16px]">
            <div className="bg-[#f3f4f6] w-[40px] h-[40px] rounded-[10px] flex items-center justify-center">
              <TicketIcon />
            </div>
            <div className="flex flex-col gap-[4px] pr-[36px]">
              <h2
                className="text-[20px] leading-[30px] font-semibold text-[#181d27]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Submit a Support Ticket
              </h2>
              <p
                className="text-[14px] leading-[20px] text-[#838799]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {"For questions, feedback, or technical issues. Our team's here to help."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-[16px] right-0 w-[44px] h-[44px] rounded-[8px] bg-[#f3f3f5] flex items-center justify-center hover:bg-[#e5e5e7] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Help text */}
        <p
          className="text-[14px] leading-[20px] text-[#6a7282] tracking-[-0.15px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Use this form if you need help, want to report a bug, or request a new feature. For general guidance, visit{' '}
          <Link href="/playbook" className="font-medium text-[#272c38] underline hover:text-black">
            The Playbook Home
          </Link>
        </p>

        {/* Form */}
        <div className="flex flex-col gap-[16px]">
          {/* Name */}
          <div className="flex flex-col gap-[6px]">
            <label
              className="text-[14px] leading-[20px] font-medium text-[#52525b]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Name
            </label>
            <input
              type="text"
              placeholder="Nasir Ali"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#e4e4e7] rounded-[6px] px-[12px] py-[8px] text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] outline-none bg-white focus:border-[#a1a1aa] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-[6px]">
            <label
              className="text-[14px] leading-[20px] font-medium text-[#52525b]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="nasir@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#e4e4e7] rounded-[6px] px-[12px] py-[8px] text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] outline-none bg-white focus:border-[#a1a1aa] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-[6px]">
            <label
              className="text-[14px] leading-[20px] font-medium text-[#52525b]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Category
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCatOpen(!catOpen)}
                className="w-full border border-[#e4e4e7] rounded-[6px] px-[12px] py-[8px] text-[16px] leading-[24px] text-left bg-white flex items-center justify-between focus:border-[#a1a1aa] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span className={category ? 'text-[#18181b]' : 'text-[#71717a]'}>
                  {category || 'Select a category'}
                </span>
                <ChevronDownIcon className={`text-[#71717a] transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-[0px_4px_12px_rgba(0,0,0,0.1)] z-10 overflow-hidden"
                  >
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setCategory(cat); setCatOpen(false) }}
                        className="w-full text-left px-[12px] py-[8px] text-[14px] leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[6px]">
            <label
              className="text-[14px] leading-[20px] font-medium text-[#52525b]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Description
            </label>
            <textarea
              placeholder={"Describe what's happening or what you'd like to see\u2026"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[#e4e4e7] rounded-[6px] px-[12px] py-[8px] text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] outline-none bg-white resize-none min-h-[96px] focus:border-[#a1a1aa] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          {/* Attach Files */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center gap-[2px]">
              <span
                className="text-[14px] leading-[20px] font-medium text-[#464649]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Attach Files
              </span>
              <span
                className="text-[14px] leading-[20px] font-medium text-[#a9b5c6]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                (Optional)
              </span>
            </div>
            <div className="border border-[#e4e4e7] rounded-[6px] bg-white p-[24px] flex flex-col items-center justify-center gap-[8px]">
              <button
                type="button"
                className="h-[36px] px-[12px] rounded-[6px] border border-[#e4e4e7] bg-white text-[14px] leading-[20px] font-medium text-[#18181b] flex items-center gap-[8px] hover:bg-[#f4f4f5] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <CloudUploadIcon />
                Click to upload
              </button>
              <p
                className="text-[12px] leading-[18px] text-[#71717a] text-center"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                PNG, SVG, JPG, or AI file (min. 200×200px)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#e4e4e7] p-[16px]">
        <div className="flex gap-[12px]">
          <button
            onClick={onClose}
            className="flex-1 h-[40px] rounded-[6px] border border-[#e4e4e7] bg-white text-[14px] leading-[20px] font-medium text-[#18181b] flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 h-[40px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium flex items-center justify-center hover:bg-[#27272a] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  )
}

function SuccessModal({ onClose }) {
  const [followUpdates, setFollowUpdates] = useState(false)

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-[16px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_3px_3px_-1.5px_rgba(10,13,18,0.04)] w-full max-w-[544px] overflow-hidden flex flex-col">
      <div className="flex flex-col gap-[24px] px-[24px] pb-[24px]">
        {/* Header */}
        <div className="relative pt-[24px]">
          <div className="flex flex-col gap-[4px] pr-[36px]">
            <h2
              className="text-[20px] leading-[30px] font-semibold text-[#181d27]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Thanks for reaching out.
            </h2>
            <p
              className="text-[14px] leading-[20px] text-[#838799]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {"Your message has been received. We'll get back to you soon."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-[16px] right-0 w-[44px] h-[44px] rounded-[8px] bg-[#f3f3f5] flex items-center justify-center hover:bg-[#e5e5e7] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Ticket info card */}
        <div className="border border-[#e4e4e7] rounded-[12px] p-[16px] flex flex-col gap-[4px]">
          <p
            className="text-[16px] leading-[24px] font-semibold text-[#181d27]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Ticket ID
          </p>
          <p
            className="text-[14px] leading-[20px] text-[#838799]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Average response time
          </p>
        </div>

        {/* Ticket details */}
        <div className="bg-[#f9fafb] rounded-[10px] p-[16px] flex flex-col gap-[12px]">
          <div className="flex flex-col gap-[4px]">
            <p
              className="text-[14px] leading-[20px] text-[#838799]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Ticket ID
            </p>
            <p
              className="text-[16px] leading-[24px] font-semibold text-[#181d27]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              MNFSTR-2024-10847
            </p>
          </div>
          <div className="flex flex-col gap-[4px]">
            <p
              className="text-[14px] leading-[20px] text-[#838799]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Average response time
            </p>
            <p
              className="text-[16px] leading-[24px] font-semibold text-[#181d27]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              2-3 business days
            </p>
          </div>
        </div>

        {/* Follow toggle */}
        <div className="flex items-center justify-between gap-[8px]">
          <p
            className="text-[14px] leading-[20px] font-medium text-[#18181b]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Follow updates related to this ticket
          </p>
          <button
            onClick={() => setFollowUpdates(!followUpdates)}
            className={`relative w-[32px] h-[18px] rounded-full border border-transparent transition-colors shrink-0 ${
              followUpdates ? 'bg-[#18181b]' : 'bg-[#cbced4]'
            }`}
          >
            <span
              className={`absolute top-px w-[14px] h-[14px] rounded-full bg-white transition-transform ${
                followUpdates ? 'left-[16px]' : 'left-px'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-[16px]">
        <div className="flex gap-[12px]">
          <Link
            href="/playbook"
            className="flex-1 h-[40px] rounded-[6px] border border-[#e4e4e7] bg-white text-[14px] leading-[20px] font-medium text-[#18181b] flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Back to The Playbook
          </Link>
          <Link
            href="/"
            className="flex-1 h-[40px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium flex items-center justify-center hover:bg-[#27272a] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Return to MANIFESTR
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SubmitTicketModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false)

  const handleClose = () => {
    setSubmitted(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-[80px]"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-[544px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <SubmitFormModal
                onClose={handleClose}
                onSubmit={() => setSubmitted(true)}
              />
            ) : (
              <SuccessModal onClose={handleClose} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
