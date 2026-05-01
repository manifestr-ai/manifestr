/**
 * Normalize style guide JSON from API exports or frontend-shaped objects
 * into the Create Style Guide wizard state shape.
 */

function unwrapPayload(parsed) {
  if (!parsed || typeof parsed !== 'object') return null
  if (parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data)) {
    return parsed.data
  }
  return parsed
}

function defaultLogoRules() {
  return {
    enabled: true,
    minSize: '24px',
    maxSize: '96px',
    clearSpace: '4',
    scaling: 'maintain-aspect-ratio',
    placement: 'Top-left',
    allowAlternate: false,
  }
}

function defaultBackgrounds() {
  return {
    permitted: 'light-dark',
    darkUses: 'white-reversed',
    minContrast: '',
  }
}

function defaultStyle(defaultBrandPersonality) {
  return {
    toneDescriptors: ['Professional', 'Bold'],
    audience: ['B2B (Business)'],
    personality: defaultBrandPersonality,
    examplePhrases: [{ id: 1, weSay: 'Transform your workflow', weDontSay: 'Disrupt the industry' }],
    personas: [{ id: 1, title: 'CTO', summary: '' }],
  }
}

function defaultTypography() {
  return {
    headings: { family: 'Inter', weight: 'Bold' },
    body: { family: 'Inter', weight: 'Regular' },
  }
}

/**
 * Map API / downloaded style guide record → wizard state (same as edit-mode load).
 */
export function mapApiGuideToFrontendState(guide, defaultBrandPersonality) {
  const logoData = guide.logo || {}
  return {
    name: guide.name || 'Draft Style Guide',
    brandKitName: guide.brand_name || guide.name || '',
    logos: logoData.logos || [],
    backgrounds: logoData.backgrounds || defaultBackgrounds(),
    logoRules: logoData.logoRules || defaultLogoRules(),
    colors: guide.colors || { selected: ['white', 'black'], custom: [] },
    typography: guide.typography || defaultTypography(),
    style: {
      ...defaultStyle(defaultBrandPersonality),
      ...guide.style,
      personality:
        guide.style?.personality != null && String(guide.style.personality).trim() !== ''
          ? guide.style.personality
          : defaultBrandPersonality,
    },
  }
}

function isLikelyApiShape(obj) {
  return obj && typeof obj === 'object' && (obj.logo !== undefined || obj.brand_name !== undefined)
}

function mergeFrontendShape(raw, baseState, defaultBrandPersonality) {
  return {
    ...baseState,
    ...raw,
    name: raw.name ?? baseState.name,
    brandKitName: raw.brandKitName ?? raw.brand_name ?? raw.name ?? baseState.brandKitName,
    logos: Array.isArray(raw.logos) ? raw.logos : baseState.logos,
    backgrounds: { ...baseState.backgrounds, ...(raw.backgrounds || {}) },
    logoRules: { ...baseState.logoRules, ...(raw.logoRules || {}) },
    colors: { ...baseState.colors, ...(raw.colors || {}) },
    typography: {
      ...baseState.typography,
      ...(raw.typography || {}),
      headings: {
        ...baseState.typography.headings,
        ...(raw.typography?.headings || {}),
      },
      body: {
        ...baseState.typography.body,
        ...(raw.typography?.body || {}),
      },
    },
    style: {
      ...baseState.style,
      ...(raw.style || {}),
      personality:
        raw.style?.personality != null && String(raw.style.personality).trim() !== ''
          ? raw.style.personality
          : baseState.style.personality ?? defaultBrandPersonality,
    },
  }
}

/**
 * @param {unknown} parsed - JSON.parse result
 * @param {object} options
 * @param {string} options.defaultBrandPersonality
 * @param {object} options.baseState - initial wizard state to merge missing keys (same shape as styleGuideData)
 * @returns {object} styleGuideData
 */
export function styleGuideStateFromImportedJson(parsed, { defaultBrandPersonality, baseState }) {
  const raw = unwrapPayload(parsed)
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Invalid JSON: expected a style guide object.')
  }

  if (isLikelyApiShape(raw)) {
    return mapApiGuideToFrontendState(raw, defaultBrandPersonality)
  }

  return mergeFrontendShape(raw, baseState, defaultBrandPersonality)
}
