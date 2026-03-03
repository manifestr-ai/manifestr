import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../lib/api'

export default function DailyMotivation() {
  const [loading, setLoading] = useState(true)
  const [quoteParts, setQuoteParts] = useState({
    prefix: 'Amateurs improvise. Professionals',
    word: 'prepare',
    suffix: '.'
  })

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await api.get('/ai/motivation-quote')
        const quote = response.data?.details?.quote
        if (quote) {
          const words = quote.trim().split(/\s+/)
          if (words.length > 0) {
            const lastChunk = words[words.length - 1]
            // Extract word and potential punctuation at the end
            // Match word characters (including hyphens/apostrophes) followed by non-word characters
            const match = lastChunk.match(/^([a-zA-Z0-9'\-]+)(.*)$/)

            if (match) {
              const [_, lastWord, punctuation] = match
              const prefix = words.slice(0, -1).join(' ')
              setQuoteParts({
                prefix: prefix,
                word: lastWord,
                suffix: punctuation
              })
            } else {
              // Fallback if regex match fails (e.g. only symbols?)
              setQuoteParts({
                prefix: words.slice(0, -1).join(' '),
                word: lastChunk,
                suffix: ''
              })
            }
          }
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.02 }}
      className="rounded-xl p-6 pb-22 mb-6 relative overflow-visible h-min"
      style={{ backgroundColor: 'rgba(36, 36, 36, 0.9)' }}
    >
      {/* Background gradient overlay */}
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <p className="text-[15px] font-medium leading-[28px] text-white text-center tracking-[0.6px] mb-4 uppercase">
          DAILY MOTIVATION
        </p>

        {loading ? (
          <div className="w-full h-[31px] flex justify-center items-center">
            <div className="w-3/4 h-4 bg-white/20 animate-pulse rounded"></div>
          </div>
        ) : (
          <p className="text-[26.094px] font-extrabold leading-[31.53px] text-white text-center">
            <span className="font-hero">{quoteParts.prefix} </span>
            <span className="italic" style={{ fontFamily: "'IvyPresto Headline', serif", fontSize: '38px' }}>{quoteParts.word}&nbsp;</span>
            <span className="font-hero">{quoteParts.suffix}</span>
          </p>
        )}
      </div>

      {/* Bottom decorative text - positioned to not be cut */}
      <div className="absolute bottom-0 left-0 right-1 pointer-events-none overflow-visible" style={{ height: 'auto' }}>
        <div
          className="absolute bottom-0 right-0 text-[58px] italic whitespace-nowrap"
          style={{
            color: 'rgba(255, 255, 255, 0.1)',
            fontFamily: "'Castoro Titling', serif",
            letterSpacing: '-4px',
            lineHeight: '35px',
            fontWeight: '700'
          }}
        >
          FOCUS MODE
        </div>
      </div>
    </motion.div>
  )
}

