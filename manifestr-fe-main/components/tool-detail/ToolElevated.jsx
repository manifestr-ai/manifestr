import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { UnfoldHorizontal } from 'lucide-react'
import CldImage from '../ui/ToolkitCldImage'

const MACBOOK_BG    = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774956948/Group_1577709341_srvq92.jpg'
const COMPARE_LEFT  = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774956947/2406403_1_aufb8m.jpg'
const COMPARE_RIGHT = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774956947/v910-aew-013_1_cvdro4.jpg'

/**
 * Desktop MacBook hero — vertical crop with **real** layout height (no clip-path gap).
 *
 * - ELEVATED_BG_CROP_TOP_PX / _BOTTOM_PX — image is shifted up by TOP, wrapper height is
 *   `displayedHeight − TOP − BOTTOM`, with `overflow: hidden`, so the section is exactly the
 *   visible band (no extra transparent strip in the document).
 *
 * - ELEVATED_TITLE_TOP_EXTRA_PX — base offset with top crop; keep in sync with TOP crop if you change crop.
 *
 * - ELEVATED_TITLE_NUDGE_UP_PX — subtracted from that position to move the headline **up** (tune by eye).
 *
 * - ELEVATED_SLIDER_TOP / _BOTTOM — % of the *cropped* section height.
 */
const ELEVATED_BG_CROP_TOP_PX = 70
const ELEVATED_BG_CROP_BOTTOM_PX = 90
const ELEVATED_TITLE_TOP_EXTRA_PX = ELEVATED_BG_CROP_TOP_PX
const ELEVATED_TITLE_NUDGE_UP_PX = 28
const ELEVATED_SLIDER_TOP = '20%'
const ELEVATED_SLIDER_BOTTOM = '20%'

function CroppedMacbookBackground({ src, topCropPx, bottomCropPx }) {
  const wrapRef = useRef(null)
  const [visibleHeightPx, setVisibleHeightPx] = useState(null)

  const measure = useCallback(() => {
    const wrap = wrapRef.current
    const img = wrap?.querySelector('img')
    if (!img) return
    const full = img.offsetHeight
    if (full <= 0) return
    setVisibleHeightPx(Math.max(1, full - topCropPx - bottomCropPx))
  }, [topCropPx, bottomCropPx])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    const wrap = wrapRef.current
    const img = wrap?.querySelector('img')
    if (!img || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => measure())
    ro.observe(img)
    return () => ro.disconnect()
  }, [measure])

  return (
    <div
      ref={wrapRef}
      className="w-full overflow-hidden leading-none"
      style={visibleHeightPx != null ? { height: `${visibleHeightPx}px` } : undefined}
    >
      <CldImage
        src={src}
        alt=""
        sizes="100vw"
        priority
        className="block h-auto w-full max-w-none"
        style={{ transform: `translateY(-${topCropPx}px)` }}
        onLoad={measure}
      />
    </div>
  )
}

function CompareSlider({ beforeSrc, afterSrc }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, pct)))
  }, [])

  const onPointerDown = (e) => {
    dragging.current = true
    updatePosition(e.clientX)
    e.preventDefault()
  }

  useEffect(() => {
    const onPointerMove = (e) => {
      if (!dragging.current) return
      updatePosition(e.clientX)
    }
    const onPointerUp = () => { dragging.current = false }

    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchmove', (e) => {
      if (!dragging.current) return
      updatePosition(e.touches[0].clientX)
    })
    window.addEventListener('touchend', onPointerUp)

    return () => {
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
    }
  }, [updatePosition])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-col-resize select-none overflow-hidden rounded-[6px]"
      onMouseDown={onPointerDown}
      onTouchStart={(e) => { dragging.current = true; updatePosition(e.touches[0].clientX) }}
    >
      {/* "Before" image — full background layer */}
      <CldImage src={beforeSrc} alt="Before" className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      {/* "After" image — clipped from left to slider position */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
      >
        <CldImage src={afterSrc} alt="After — MANIFESTR enhanced" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      </div>

      {/* Vertical divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white/70 z-10 pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      />

      {/* Draggable pill handle */}
      <div
        className="absolute top-1/2 z-20 pointer-events-none"
        style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-[35px] h-[72px] bg-[#18181b] border-[0.75px] border-white rounded-[55px] flex items-center justify-center shadow-lg">
          <UnfoldHorizontal className="w-[24px] h-[24px] text-white" />
        </div>
      </div>
    </div>
  )
}

export default function ToolElevated({ tool }) {
  const { elevatedTitle } = tool

  // w-full only — avoid w-screen / 100vw + calc(50% - 50vw); that combo overflows when a vertical scrollbar is present.
  return (
    <section className="relative hidden w-full min-w-0 overflow-hidden md:block">
      <CroppedMacbookBackground
        src={MACBOOK_BG}
        topCropPx={ELEVATED_BG_CROP_TOP_PX}
        bottomCropPx={ELEVATED_BG_CROP_BOTTOM_PX}
      />

      <div className="absolute inset-0 z-10">
        {/* Title — above the MacBook */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="absolute left-0 right-0 text-center"
          style={{
            top: `calc(2% + ${ELEVATED_TITLE_TOP_EXTRA_PX - ELEVATED_TITLE_NUDGE_UP_PX}px)`,
            fontFamily: "'IvyPresto Headline', serif",
            fontWeight: 600,
            fontStyle: 'italic',
            fontSize: 'clamp(24px, 4.17vw, 60px)',
            lineHeight: '1.2',
            letterSpacing: '-1.2px',
            color: 'black',
          }}
        >
          {elevatedTitle}
        </motion.h2>

        {/* Comparison slider — pinned to the MacBook screen */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: ELEVATED_SLIDER_TOP, width: '51%', bottom: ELEVATED_SLIDER_BOTTOM }}
        >
          <CompareSlider beforeSrc={COMPARE_RIGHT} afterSrc={COMPARE_LEFT} />
        </motion.div>
      </div>
    </section>
  )
}
