import { useState } from 'react'
import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const VIDEO_THUMB = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941092/Placeholder_Image_tlxlt9.jpg'
const PLAY_ICON   = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941137/play_icon_fhit9r.svg'

export default function VideoSection() {
  const [hovered, setHovered] = useState(false)

  return (
    <section className="w-full relative z-10 mt-[-60px] md:mt-[-264px] pt-[24px] md:pt-[62px] pb-12 md:pb-[62px]">
      <div className="w-full max-w-[1480px] mx-auto px-6 md:px-[110px]">

        {/* Rounded video card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full overflow-hidden rounded-[10px] md:rounded-[18px] cursor-pointer"
          style={{ aspectRatio: '342 / 200' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Thumbnail */}
          <CldImage
            src={VIDEO_THUMB}
            alt="Watch Manifestr in action"
            className="absolute inset-0 w-full h-full object-cover"
            priority={false}
          />

          {/* Dark overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: 'rgba(0,0,0,0.4)', opacity: hovered ? 0.55 : 1 }}
          />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: hovered ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <CldImage
                src={PLAY_ICON}
                alt="Play"
                className="w-[56px] h-[56px] md:w-[114px] md:h-[114px] object-contain drop-shadow-lg"
              />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
