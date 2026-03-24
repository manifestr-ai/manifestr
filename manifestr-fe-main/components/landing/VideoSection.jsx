import { useState } from 'react'
import { motion } from 'framer-motion'

const VIDEO_THUMB = 'https://www.figma.com/api/mcp/asset/167a1d86-49eb-4823-8f8e-ae2448a6edfc'
const PLAY_ICON   = 'https://www.figma.com/api/mcp/asset/06030f04-597a-4467-a2bd-af642e558fd0'

export default function VideoSection() {
  const [hovered, setHovered] = useState(false)

  return (
    <section className="w-full mt-[-264px] py-[62px] md:py-[62px]">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-[110px]">

        {/* Rounded video card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full overflow-hidden rounded-[18px] cursor-pointer"
          style={{ aspectRatio: '1060 / 596' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Thumbnail */}
          <img
            src={VIDEO_THUMB}
            alt="Watch Manifestr in action"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark overlay */}
          <div
            className="absolute inset-0 rounded-[18px] transition-opacity duration-300"
            style={{ background: 'rgba(0,0,0,0.4)', opacity: hovered ? 0.55 : 1 }}
          />

          {/* Play button — centred exactly as Figma */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: hovered ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <img
                src={PLAY_ICON}
                alt="Play"
                className="w-[80px] h-[80px] md:w-[114px] md:h-[114px] object-contain drop-shadow-lg"
              />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
