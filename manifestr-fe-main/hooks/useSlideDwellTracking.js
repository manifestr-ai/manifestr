import { useEffect } from 'react'
import { trackSlideDwellSample } from '../lib/productAnalytics'

function deckBucketFromKey(key) {
  const seed = key && String(key).length > 0 ? String(key) : 'default'
  let h = 5381
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return (Math.abs(h) % 5) + 1
}

/**
 * Periodically records time on the active slide for admin heatmaps (deck bucket 1–5, slide 1–7).
 */
export function useSlideDwellTracking(store, deckKey) {
  useEffect(() => {
    if (!store || typeof window === 'undefined') return undefined

    const deckBucket = deckBucketFromKey(deckKey)
    let lastPageId = null
    let lastSlideIdx = 1
    let segmentStart = Date.now()

    const flushSegment = () => {
      const elapsedSec = (Date.now() - segmentStart) / 1000
      if (
        lastPageId &&
        elapsedSec >= 2 &&
        lastSlideIdx >= 1 &&
        lastSlideIdx <= 7
      ) {
        trackSlideDwellSample(
          deckBucket,
          lastSlideIdx,
          Math.min(600, Math.round(elapsedSec)),
        )
      }
      segmentStart = Date.now()
    }

    const onStoreChange = () => {
      const ap = store.activePage
      const idx = ap ? Math.min(7, store.pages.indexOf(ap) + 1) : 1
      const pid = ap?.id ?? null
      if (pid !== lastPageId) {
        flushSegment()
        lastPageId = pid
        lastSlideIdx = idx
      }
    }

    onStoreChange()

    const interval = window.setInterval(() => {
      flushSegment()
    }, 15000)

    const unsub = store.on('change', onStoreChange)

    return () => {
      clearInterval(interval)
      flushSegment()
      if (typeof unsub === 'function') unsub()
    }
  }, [store, deckKey])
}
