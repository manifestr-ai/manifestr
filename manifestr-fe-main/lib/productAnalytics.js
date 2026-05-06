import api from './api'

/**
 * Fire-and-forget product analytics (requires auth cookie / Bearer for user_id).
 */
function postTrack(body) {
  return api.post('/analytics/track', body).catch(() => {})
}

export function trackDeckExport(format) {
  return postTrack({
    eventName: 'Deck Exported',
    eventCategory: 'product_usage',
    eventAction: 'export_deck',
    properties: { format: String(format || 'other').toLowerCase() },
  })
}

/** kind: 'tone' | 'personality' | 'formality' */
export function trackAiStyleSettingSelected(kind, settingId, settingTitle) {
  return postTrack({
    eventName: 'AI Style Setting Selected',
    eventCategory: 'product_usage',
    eventAction: 'ai_style_setting',
    properties: {
      setting_kind: kind,
      setting_id: String(settingId ?? ''),
      setting_title: String(settingTitle ?? '').trim(),
    },
  })
}

export function trackSlideDwellSample(deckBucket, slideIndex, durationSeconds) {
  const db = Number(deckBucket)
  const si = Number(slideIndex)
  const sec = Number(durationSeconds)
  if (!Number.isFinite(db) || !Number.isFinite(si) || !Number.isFinite(sec)) return Promise.resolve()
  if (db < 1 || db > 5 || si < 1 || si > 7 || sec < 1) return Promise.resolve()
  return postTrack({
    eventName: 'Slide Dwell Sample',
    eventCategory: 'product_usage',
    eventAction: 'slide_dwell_sample',
    properties: {
      deck_bucket: db,
      slide_index: si,
      duration_seconds: Math.min(600, Math.round(sec)),
    },
  })
}
