import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Folder, Type, Palette, Grid, FileText, Plus, ArrowRight, Check, Upload, CloudUpload, Download, FileText as FileTextIcon, X, Share, RefreshCw, ChevronDown, Volume2, Network } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Select from '../forms/Select'
import { useToast } from '../ui/Toast'
import {
  exportBrandKitPdf,
  downloadBrandKitAssetsZip,
  generateBrandGuidelinesDocx,
} from '../../lib/brandKitQuickActions'

function assignLogosToTiles(logos, tiles) {
  const list = Array.isArray(logos) ? logos : []
  const used = new Set()
  const byKey = {}

  const takeFirstMatch = (predicate) => {
    const idx = list.findIndex((item, i) => !used.has(i) && predicate(item, i))
    if (idx === -1) return null
    used.add(idx)
    return list[idx]
  }

  for (const tile of tiles) {
    const categorized = takeFirstMatch((item) => tile.categories.includes(item?.category || ''))
    if (categorized) {
      byKey[tile.key] = categorized
    }
  }

  for (const tile of tiles) {
    if (byKey[tile.key]) continue
    const fallback = takeFirstMatch(() => true)
    byKey[tile.key] = fallback || null
  }

  return byKey
}

/** Same defaults as Step 2 — keeps review in sync when typography was never persisted */
const STEP2_DEFAULT_TYPOGRAPHY = [
  { id: 1, name: 'Heading 1', font: 'Inter', fontSize: '62px', fontWeight: 'Bold', lineHeight: '62px', letterSpacing: '0' },
  { id: 2, name: 'Heading 2', font: 'Inter', fontSize: '48px', fontWeight: 'Bold', lineHeight: '48px', letterSpacing: '0' },
  { id: 3, name: 'Heading 3', font: 'Inter', fontSize: '34px', fontWeight: 'Bold', lineHeight: '34px', letterSpacing: '0' },
  { id: 4, name: 'Sub title 1', font: 'Inter', fontSize: '28px', fontWeight: 'Bold', lineHeight: '28px', letterSpacing: '0' },
  { id: 5, name: 'Sub title 2', font: 'Inter', fontSize: '20px', fontWeight: 'Bold', lineHeight: '20px', letterSpacing: '0' },
  { id: 6, name: 'Body 1', font: 'Inter', fontSize: '16px', fontWeight: 'Medium', lineHeight: '16px', letterSpacing: '0' },
  { id: 7, name: 'Body 1 - Bold', font: 'Inter', fontSize: '16px', fontWeight: 'SemiBold', lineHeight: '16px', letterSpacing: '0' },
  { id: 8, name: 'Body 2', font: 'Inter', fontSize: '16px', fontWeight: 'Medium', lineHeight: '16px', letterSpacing: '0' },
  { id: 9, name: 'Body 2 - Bold', font: 'Inter', fontSize: '16px', fontWeight: 'SemiBold', lineHeight: '16px', letterSpacing: '0' },
  { id: 10, name: 'Caption', font: 'Inter', fontSize: '14px', fontWeight: 'Medium', lineHeight: '14px', letterSpacing: '0' },
]

const TYPOGRAPHY_FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter · Sans-serif' },
  { value: 'Roboto', label: 'Roboto · Sans-serif' },
  { value: 'Open Sans', label: 'Open Sans · Sans-serif' },
  { value: 'Lato', label: 'Lato · Sans-serif' },
  { value: 'Montserrat', label: 'Montserrat · Sans-serif' },
]

const TYPOGRAPHY_WEIGHT_OPTIONS = [
  { value: 'Light', label: 'Light' },
  { value: 'Regular', label: 'Regular' },
  { value: 'Medium', label: 'Medium' },
  { value: 'SemiBold', label: 'SemiBold' },
  { value: 'Bold', label: 'Bold' },
  { value: 'ExtraBold', label: 'ExtraBold' },
]

function cssFontWeightFromToken(weight) {
  const map = { Light: 300, Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800 }
  return map[weight] ?? 400
}

/** Same as Step 3 Color — used for “Regenerate with AI” reset */
const STEP3_DEFAULT_PRIMARY_COLORS = [
  { id: 1, hex: '#E0E7FF' },
  { id: 2, hex: '#C7D2FE' },
  { id: 3, hex: '#818CF8' },
  { id: 4, hex: '#4338CA' },
  { id: 5, hex: '#3730A3' },
]
const STEP3_DEFAULT_SECONDARY_COLORS = [
  { id: 1, hex: '#FEF3C7' },
  { id: 2, hex: '#FDE68A' },
  { id: 3, hex: '#FBBF24' },
  { id: 4, hex: '#92400E' },
  { id: 5, hex: '#78350F' },
]
const STEP3_DEFAULT_OTHER_COLORS = [
  { id: 1, hex: '#FEF3EB' },
  { id: 2, hex: '#FFDAC2' },
  { id: 3, hex: '#F17B2C' },
  { id: 4, hex: '#C2540A' },
  { id: 5, hex: '#6E330C' },
]

/** Step 4 Style — Example phrases voice actions (same as Step4Style.jsx) */
const STYLE_GUIDE_VOICE_PRIMARY_BTN =
  'h-10 min-h-10 rounded-[6px] !px-[18px] !text-b2-regular !font-normal !text-white hover:!text-white font-[Inter,sans-serif] tracking-[-0.3125px] disabled:!text-white/50'

const STYLE_GUIDE_VOICE_PREVIEW_HINT =
  'font-[Inter,sans-serif] text-[16px] font-normal italic leading-[24px] tracking-[-0.3125px] text-[#71717b] sm:flex sm:min-h-10 sm:items-center'

const STYLE_GUIDE_VOICE_ACTION_ROW =
  'flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center'

const STEP4_DEFAULT_EXAMPLE_PHRASES = [
  { id: 1, weSay: 'Transform your workflow', weDontSay: 'Disrupt the industry' },
]

function formatHexDisplay(hex) {
  const s = String(hex || '').trim()
  if (!s) return ''
  const upper = s.startsWith('#') ? s.toUpperCase() : `#${s.toUpperCase()}`
  return upper
}

function isHeadingTypographyRow(name) {
  const n = String(name || '').toLowerCase()
  return n.includes('heading') || n.includes('sub title')
}

function isBodyTypographyRow(name) {
  return typeof name === 'string' && name.toLowerCase().includes('body')
}

export default function StyleGuideStep5Review({
  data,
  updateData,
  onBack,
  onNext,
  isSubmitting,
  isEditMode = false,
  onShare,
  onApplyToDocument,
}) {
  const router = useRouter()
  const { success, error: showError } = useToast()

  // Derive state from props
  const selectedColors = data?.colors?.selected || []
  const permittedBackgroundTypes = data?.backgrounds?.permitted || 'light-dark'
  const darkBackgroundUses = data?.backgrounds?.darkUses || 'white-reversed'
  const minimumContrastRatio = data?.backgrounds?.minContrast || ''
  const logoUsageRulesEnabled = data?.logoRules?.enabled ?? true
  const selectedToneDescriptors = data?.style?.toneDescriptors || []
  const selectedAudience = data?.style?.audience || []
  const brandPersonality = data?.style?.personality || ''
  const examplePhrases = data?.style?.examplePhrases || STEP4_DEFAULT_EXAMPLE_PHRASES
  const personas = data?.style?.personas || []
  const brandKitName = data?.brandKitName || 'Untitled Brand Kit'
  const uploadedLogos = data?.logos || []

  const handleHeaderShare = async () => {
    if (onShare) {
      await Promise.resolve(onShare())
      return
    }
    if (typeof window === 'undefined') return
    const url = window.location.href
    const title = brandKitName || 'Brand style guide'
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ title, text: title, url })
        return
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        success('Link copied to clipboard.')
        return
      }
      showError('Sharing is not supported in this browser.')
    } catch (err) {
      if (err?.name === 'AbortError') return
      showError('Could not share. Copy the address from your browser bar.')
    }
  }

  const handleApplyToDocument = () => {
    if (onApplyToDocument) {
      onApplyToDocument()
      return
    }
    router.push('/docs-editor')
  }
  const logoConfirmations = data?.logoConfirmations || {}

  const primaryLogoInputRef = useRef(null)
  const horizontalLogoInputRef = useRef(null)
  const iconLogoInputRef = useRef(null)

  const logoTiles = useMemo(
    () => ([
      {
        key: 'primary',
        title: 'Primary Logo',
        spec: 'SVG · 2400×2400px',
        previewBg: 'bg-[#f9fafb]',
        placeholder: <div className="bg-[#101828] rounded-[10px] size-[96px]" />,
        categories: ['Primary Logo'],
        inputRef: primaryLogoInputRef,
      },
      {
        key: 'horizontal',
        title: 'Horizontal Logo',
        spec: 'SVG · 3200×1200px',
        previewBg: 'bg-[#f9fafb]',
        placeholder: <div className="bg-[#101828] rounded-[4px] w-[128px] h-[48px]" />,
        categories: ['Secondary / Horizontal Lockup'],
        inputRef: horizontalLogoInputRef,
      },
      {
        key: 'icon',
        title: 'Icon / Favicon',
        spec: 'SVG · 512×512px',
        previewBg: 'bg-[#101828]',
        placeholder: <div className="bg-white rounded-[10px] size-[64px]" />,
        categories: ['App Icon', 'Favicon'],
        inputRef: iconLogoInputRef,
      },
    ]),
    []
  )

  const logoByTileKey = useMemo(
    () => assignLogosToTiles(uploadedLogos, logoTiles),
    [logoTiles, uploadedLogos]
  )

  const objectUrls = useMemo(() => {
    const next = {}
    for (const tile of logoTiles) {
      const item = logoByTileKey[tile.key]
      if (item?.url) {
        next[tile.key] = item.url
        continue
      }
      if (typeof File !== 'undefined' && item?.file instanceof File) {
        next[tile.key] = URL.createObjectURL(item.file)
      } else {
        next[tile.key] = null
      }
    }
    return next
  }, [logoByTileKey, logoTiles])

  useEffect(() => {
    return () => {
      Object.values(objectUrls).forEach((value) => {
        if (typeof value === 'string' && value.startsWith('blob:')) {
          URL.revokeObjectURL(value)
        }
      })
    }
  }, [objectUrls])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const upsertLogoForTile = (tileKey, category, file) => {
    if (typeof File === 'undefined' || !(file instanceof File)) return
    const nextItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      category,
      file,
    }

    const assigned = assignLogosToTiles(uploadedLogos, logoTiles)
    const current = assigned[tileKey]
    const currentId = current?.id ?? null

    let nextLogos
    if (currentId != null) {
      nextLogos = uploadedLogos.map((item) => (item?.id === currentId ? nextItem : item))
    } else {
      const idx = uploadedLogos.findIndex((item) => (item?.category || '') === category)
      nextLogos =
        idx >= 0 ? uploadedLogos.map((item, i) => (i === idx ? nextItem : item)) : [...uploadedLogos, nextItem]
    }

    updateData({
      logos: nextLogos,
      logoConfirmations: {
        ...(logoConfirmations || {}),
        [tileKey]: false,
      },
    })
  }

  const handleTileFileChange = (tileKey, categories, event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const category = categories[0]
    upsertLogoForTile(tileKey, category, file)
  }

  const triggerTilePicker = (tile) => {
    tile.inputRef?.current?.click()
  }

  const confirmTile = (tileKey) => {
    updateData({
      logoConfirmations: {
        ...(logoConfirmations || {}),
        [tileKey]: true,
      },
    })
  }

  const livePreviewLogoSrc =
    objectUrls.primary || objectUrls.horizontal || objectUrls.icon || null

  const defaultPrimaryColors = [
    { id: 1, hex: '#E0E7FF' },
    { id: 2, hex: '#C7D2FE' },
    { id: 3, hex: '#818CF8' },
    { id: 4, hex: '#4338CA' },
    { id: 5, hex: '#3730A3' },
  ]

  const defaultSecondaryColors = [
    { id: 1, hex: '#FEF3C7' },
    { id: 2, hex: '#FDE68A' },
    { id: 3, hex: '#FBBF24' },
    { id: 4, hex: '#92400E' },
    { id: 5, hex: '#78350F' },
  ]

  const defaultOtherColors = [
    { id: 1, hex: '#FEF3EB' },
    { id: 2, hex: '#FFDAC2' },
    { id: 3, hex: '#F17B2C' },
    { id: 4, hex: '#C2540A' },
    { id: 5, hex: '#6E330C' },
  ]

  const primaryColors = data?.colors?.primary || defaultPrimaryColors
  const secondaryColors = data?.colors?.secondary || defaultSecondaryColors
  const otherColors = data?.colors?.other || defaultOtherColors
  const customColors = data?.colors?.custom || []

  const rawSelectedPrimaryColorKeys = data?.colors?.primarySelected || []

  const defaultSelectedPrimaryKeys = primaryColors.map((color, index) =>
    `primary-${color.id || color.hex || index}`
  )

  const hasExplicitPrimarySelection = rawSelectedPrimaryColorKeys.length > 0

  const selectedPrimaryColorKeys = hasExplicitPrimarySelection
    ? rawSelectedPrimaryColorKeys
    : defaultSelectedPrimaryKeys

  const presetBackgroundColors = [
    { id: 'white', label: 'White', hex: '#ffffff' },
    { id: 'light-gray', label: 'Light Gray', hex: '#f4f4f5' },
    { id: 'gray', label: 'Gray', hex: '#71717a' },
    { id: 'black', label: 'Black', hex: '#18181b' },
  ]

  const toneDescriptors = [
    'Professional',
    'Bold',
    'Innovative',
    'Sophisticated',
    'Empathetic',
    'Friendly',
    'Playful',
    'Confident',
    'Minimalist',
    'Disruptive',
    'Luxe',
  ]

  const audienceTypes = [
    'B2B / Corporate',
    'Consumer / Lifestyle',
    'Creative / Cultural',
    'Technical / Executive-level',
    'Startup / Entrepreneurial',
  ]

  const typographyStyles = useMemo(() => {
    if (Array.isArray(data?.typography) && data.typography.length > 0) return data.typography
    return STEP2_DEFAULT_TYPOGRAPHY
  }, [data?.typography])

  const headingTypographyAnchor = useMemo(
    () =>
      typographyStyles.find((s) => s.name === 'Heading 1') ||
      typographyStyles.find((s) => isHeadingTypographyRow(s.name)) ||
      typographyStyles[0],
    [typographyStyles]
  )

  const bodyTypographyAnchor = useMemo(
    () =>
      typographyStyles.find((s) => s.name === 'Body 1') ||
      typographyStyles.find((s) => isBodyTypographyRow(s.name)) ||
      typographyStyles[0],
    [typographyStyles]
  )

  const primaryTypeface = typographyStyles[0]?.font || 'Inter'
  const bodyStyle =
    typographyStyles.find(
      (style) => typeof style.name === 'string' && style.name.toLowerCase().includes('body')
    ) || typographyStyles[0]
  const bodyDescription = bodyStyle
    ? `${bodyStyle.font || primaryTypeface} for body text`
    : 'Inter for body text'

  const allPaletteColors = [
    ...primaryColors.map((color) => ({ ...color, role: 'primary' })),
    ...secondaryColors.map((color) => ({ ...color, role: 'secondary' })),
    ...otherColors.map((color) => ({ ...color, role: 'other' })),
  ]

  const selectedPrimaryColors = selectedPrimaryColorKeys
    .map((key) => {
      return allPaletteColors.find((color, index) => {
        const colorKey = `${color.role}-${color.id || color.hex || index}`
        return colorKey === key
      })
    })
    .filter(Boolean)

  const primaryAudiencePreview = selectedAudience.join(', ')

  const [isAddingColor, setIsAddingColor] = useState(false)
  const [customColor, setCustomColor] = useState('#000000')
  const [paletteAddOpen, setPaletteAddOpen] = useState(false)
  const [paletteDraftHex, setPaletteDraftHex] = useState('#18181b')
  const [livePreviewVoiceDraft, setLivePreviewVoiceDraft] = useState('')
  const [reviewVoiceSamplePreview, setReviewVoiceSamplePreview] = useState('')
  const [reviewVoiceSpeaking, setReviewVoiceSpeaking] = useState(false)
  const [quickActionBusy, setQuickActionBusy] = useState(null)

  const completionStatus = {
    brandKitName: !!brandKitName,
    logoUpload: uploadedLogos.length > 0,
    logoConfirmed: !!(logoConfirmations?.primary || logoConfirmations?.horizontal || logoConfirmations?.icon),
    typography: Array.isArray(data?.typography) && data.typography.length > 0,
    colorPalette: (data?.colors?.primary?.length > 0 || selectedColors.length > 0),
    brandVoice: (selectedToneDescriptors.length > 0 || !!brandPersonality),
  }

  const completionPercentage = Math.round(
    (Object.values(completionStatus).filter(Boolean).length / Object.keys(completionStatus).length) * 100
  )

  const steps = [
    {
      id: 1,
      label: 'Logo',
      icon: (props) => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
          <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      active: false
    },
    { id: 2, label: 'Typography', icon: Type, active: false },
    { id: 3, label: 'Color', icon: Palette, active: false },
    { id: 4, label: 'Style', icon: Grid, active: false },
    { id: 5, label: 'Review & Apply', icon: FileText, active: true },
  ]

  // Helpers to update data if review allows editing
  // For brevity, I'll allow some edits (like background/visibility) as they were in the original file, 
  // but many sections like Style/Voice are just display or have minimal edit controls in this view 
  // (unless we duplicate the edit logic from previous steps). 
  // Given the UI allows "Regenerate" etc, I'll keep the input fields for the ones that were present.

  const updateBackgrounds = (field, value) => updateData({ backgrounds: { ...data?.backgrounds, [field]: value } })
  const updateRules = (field, value) => updateData({ logoRules: { ...data?.logoRules, [field]: value } })
  const updateStyleInfo = (updates) => updateData({ style: { ...data?.style, ...updates } })

  const updateColors = (newSelected) =>
    updateData({
      colors: {
        ...(data?.colors || {}),
        selected: newSelected,
        custom: customColors,
      },
    })

  const togglePrimaryColorSelection = (key) => {
    const current = data?.colors?.primarySelected || []
    const exists = current.includes(key)
    const next = exists ? current.filter((value) => value !== key) : [...current, key]
    updateData({
      colors: {
        ...(data?.colors || {}),
        primarySelected: next,
      },
    })
  }

  const toggleToneDescriptor = (descriptor) => {
    const exists = selectedToneDescriptors.includes(descriptor)
    const next = exists
      ? selectedToneDescriptors.filter((item) => item !== descriptor)
      : selectedToneDescriptors.length < 3
        ? [...selectedToneDescriptors, descriptor]
        : selectedToneDescriptors
    updateStyleInfo({ toneDescriptors: next })
  }

  const toggleAudience = (audience) => {
    const exists = selectedAudience.includes(audience)
    const next = exists
      ? selectedAudience.filter((item) => item !== audience)
      : [...selectedAudience, audience]
    updateStyleInfo({ audience: next })
  }

  const addPersona = () => {
    const newId = Math.max(...personas.map((p) => p.id || 0), 0) + 1
    updateStyleInfo({
      personas: [...personas, { id: newId, title: '', summary: '' }],
    })
  }

  const removePersona = (id) => {
    updateStyleInfo({
      personas: personas.filter((p) => p.id !== id),
    })
  }

  const updatePersona = (id, field, value) => {
    updateStyleInfo({
      personas: personas.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    })
  }

  const addExamplePhrase = () => {
    const newId = Math.max(0, ...examplePhrases.map((p) => Number(p.id) || 0)) + 1
    updateStyleInfo({
      examplePhrases: [...examplePhrases, { id: newId, weSay: '', weDontSay: '' }],
    })
  }

  const removeExamplePhrase = (id) => {
    updateStyleInfo({
      examplePhrases: examplePhrases.filter((p) => p.id !== id),
    })
  }

  const updateExamplePhrase = (id, field, value) => {
    updateStyleInfo({
      examplePhrases: examplePhrases.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    })
  }

  const buildReviewVoiceSampleText = useCallback(() => {
    const personality = String(data?.style?.personality || brandPersonality || '').trim()
    const tones = selectedToneDescriptors.filter(Boolean)
    const audiences = selectedAudience.filter(Boolean)
    const parts = []
    if (personality) parts.push(personality)
    if (tones.length) {
      parts.push(`Our voice feels ${tones.slice(0, 3).join(', ')}—clear, deliberate, and human.`)
    }
    if (audiences.length) {
      parts.push(`We speak to ${audiences.join(' and ')} with confidence and care.`)
    }
    if (!parts.length) {
      parts.push(
        'Define your brand personality and tone above to generate a voice sample that stitches those choices together.'
      )
    }
    parts.push('This line previews how your selections might sound when spoken aloud.')
    return parts.join(' ')
  }, [data?.style?.personality, brandPersonality, selectedToneDescriptors, selectedAudience])

  const handleReviewGenerateVoiceSample = useCallback(() => {
    const text = buildReviewVoiceSampleText()
    setReviewVoiceSamplePreview(text)

    if (typeof window === 'undefined' || !window.speechSynthesis) return

    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.onstart = () => setReviewVoiceSpeaking(true)
      utterance.onend = () => setReviewVoiceSpeaking(false)
      utterance.onerror = () => setReviewVoiceSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } catch {
      setReviewVoiceSpeaking(false)
    }
  }, [buildReviewVoiceSampleText])

  const runQuickExport = async (key, fn) => {
    if (quickActionBusy || typeof window === 'undefined') return
    setQuickActionBusy(key)
    try {
      await fn(data, brandKitName)
      if (key === 'pdf') success('Style guide PDF downloaded.')
      else if (key === 'zip') success('Asset package downloaded.')
      else success('Brand guidelines document downloaded.')
    } catch (err) {
      console.error(err)
      showError(err?.message || 'Export failed. Please try again.')
    } finally {
      setQuickActionBusy(null)
    }
  }

  const patchTypographyGroup = (group, updates) => {
    const base =
      Array.isArray(data?.typography) && data.typography.length > 0 ? data.typography : STEP2_DEFAULT_TYPOGRAPHY
    const next = base.map((row) => {
      if (group === 'heading' && isHeadingTypographyRow(row.name)) return { ...row, ...updates }
      if (group === 'body' && isBodyTypographyRow(row.name)) return { ...row, ...updates }
      return row
    })
    updateData({ typography: next })
  }

  const handleTypographyRegenerate = () => {
    updateData({
      typography: STEP2_DEFAULT_TYPOGRAPHY.map((row) => ({ ...row })),
    })
    success('Typography reset to defaults.')
  }

  const handleTypographyConfirmAll = () => {
    success('Typography settings confirmed.')
  }

  const scrollToReviewColorPalette = () => {
    if (typeof document === 'undefined') return
    document.getElementById('review-color-palette-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleRegeneratePaletteAi = () => {
    const primary = STEP3_DEFAULT_PRIMARY_COLORS.map((c) => ({ ...c }))
    const secondary = STEP3_DEFAULT_SECONDARY_COLORS.map((c) => ({ ...c }))
    const other = STEP3_DEFAULT_OTHER_COLORS.map((c) => ({ ...c }))
    const primarySelected = primary.map((c, i) => `primary-${c.id || c.hex || i}`)
    updateData({
      colors: {
        ...(data?.colors || {}),
        primary,
        secondary,
        other,
        primarySelected,
      },
    })
    success('Palette regenerated from brand defaults.')
  }

  const commitPaletteCustomColor = () => {
    const hex = formatHexDisplay(paletteDraftHex)
    if (!hex || hex.length < 4) {
      showError('Pick a valid color.')
      return
    }
    const nextId = Math.max(0, ...primaryColors.map((c) => Number(c.id) || 0)) + 1
    const newPrimary = [...primaryColors, { id: nextId, hex }]
    const newKey = `primary-${nextId}`
    const prevSel = Array.isArray(data?.colors?.primarySelected) ? data.colors.primarySelected : []
    updateData({
      colors: {
        ...(data?.colors || {}),
        primary: newPrimary,
        primarySelected: prevSel.includes(newKey) ? prevSel : [...prevSel, newKey],
      },
    })
    success('Custom color added to your palette.')
    setPaletteAddOpen(false)
  }

  const removePaletteSwatch = (role, colorId) => {
    if (colorId == null) return
    const key = `${role}-${colorId}`
    const prevSel = Array.isArray(data?.colors?.primarySelected) ? data.colors.primarySelected : []
    let nextPrimary = primaryColors
    let nextSecondary = secondaryColors
    let nextOther = otherColors
    if (role === 'primary') nextPrimary = primaryColors.filter((c) => c.id !== colorId)
    else if (role === 'secondary') nextSecondary = secondaryColors.filter((c) => c.id !== colorId)
    else if (role === 'other') nextOther = otherColors.filter((c) => c.id !== colorId)
    updateData({
      colors: {
        ...(data?.colors || {}),
        primary: nextPrimary,
        secondary: nextSecondary,
        other: nextOther,
        primarySelected: prevSel.filter((k) => k !== key),
      },
    })
    success('Color removed from palette.')
  }

  const removeToneDescriptor = (descriptor) => {
    updateStyleInfo({ toneDescriptors: selectedToneDescriptors.filter((d) => d !== descriptor) })
  }

  const handleLivePreviewAddVoice = () => {
    const trimmed = livePreviewVoiceDraft.trim()
    if (!trimmed) {
      showError('Enter a brand voice to add.')
      return
    }
    if (selectedToneDescriptors.includes(trimmed)) {
      showError('That voice is already added.')
      return
    }
    if (selectedToneDescriptors.length >= 3) {
      showError('You can add up to 3 tone descriptors.')
      return
    }
    updateStyleInfo({ toneDescriptors: [...selectedToneDescriptors, trimmed] })
    setLivePreviewVoiceDraft('')
    success('Brand voice added.')
  }

  return (
    <div className="min-h-[calc(100vh-72px)] pb-24" style={{ backgroundColor: '#F4F4F5' }}>
      {/* Left sidebar — Figma 9509:11698 (MCP): 256px wide, px-16 pt-32, item gap 8px, 40px rows, 16/Semibold/24 */}
      <div className="hidden lg:flex lg:flex-col lg:items-start fixed top-[72px] left-0 w-[256px] h-[calc(100vh-72px)] box-border bg-[var(--base-background,#FFF)] border-r border-[color:var(--base-border,#E4E4E7)] z-40">
        <div className="w-full flex flex-col items-start px-4 pt-8 pb-8 shrink-0">
          <div className="flex flex-col gap-2 w-full min-w-0">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex w-full items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors border border-solid ${step.active
                    ? 'bg-[var(--base-muted,#f4f4f5)] border-[color:var(--base-border,#E4E4E7)]'
                    : 'bg-[var(--base-background,#FFF)] border-transparent hover:bg-[var(--base-muted,#f4f4f5)]'
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${step.active ? 'text-[color:var(--base-foreground,#18181b)]' : 'text-[color:var(--base-muted-foreground-plus,#52525b)]'}`}
                  />
                  <span
                    className={`text-base font-semibold leading-6 whitespace-nowrap ${step.active ? 'text-[color:var(--base-foreground,#18181b)]' : 'text-[color:var(--base-muted-foreground-plus,#52525b)]'}`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-0 lg:pl-[256px] pr-0">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-8 min-w-0">
          <div className="mb-8 pt-[51px]">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0 min-w-0">
              <div className="min-w-0 max-w-full">
                <h1 className="self-stretch text-[color:var(--base-foreground,#18181B)] font-['HK Grotesk'] text-[30px] font-bold leading-[38px] mb-2">
                  Review & Apply
                </h1>
                <p className="self-stretch text-[color:var(--base-muted-foreground,#71717A)] font-sans text-[18px] font-normal leading-[28px]">
                  Review your brand style guide and apply it to your workspace
                </p>
              </div>
              <div className="flex w-full min-w-0 flex-col gap-3 md:w-auto md:max-w-full md:shrink-0 md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={handleHeaderShare}
                  className="w-full justify-center md:w-auto md:flex-none md:min-w-0 !bg-[#FFFFFF] !text-[#000000] border-[#e4e4e7] hover:!bg-[#FFFFFF] hover:!text-[#000000]"
                >
                  <Share className="w-4 h-4 mr-2 shrink-0" />
                  Share
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={handleApplyToDocument}
                  className="w-full justify-center md:w-auto md:flex-none md:min-w-0 !bg-[#FFFFFF] !text-[#000000] border-[#e4e4e7] hover:!bg-[#FFFFFF] hover:!text-[#000000]"
                >
                  Apply to Document
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={onNext}
                  disabled={isSubmitting}
                  className="w-full justify-center md:w-auto md:flex-none md:min-w-0"
                >
                  {isSubmitting ? (isEditMode ? 'Saving...' : 'Applying...') : (isEditMode ? 'Save Changes' : 'Apply Workspace Default')}{' '}

                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-10">
            {/* Content Cards */}
            <div className="min-w-0 flex-1 space-y-6 xl:max-w-[min(920px,calc(100%-400px))]">
              {/* Logo Card */}
              <Card className="bg-white">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-[6px]">
                    <h3 className="text-[20px] font-semibold leading-[30px] text-[color:var(--base-foreground,#18181b)]">
                      Logo
                    </h3>
                    <p className="text-[18px] font-normal leading-[28px] text-[color:var(--base-muted-foreground,#71717A)]">
                      Upload or use AI-detected logo variations
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 w-full md:flex-row md:items-stretch">
                    {logoTiles.map((tile) => {
                      const src = objectUrls[tile.key]
                      const isConfirmed = !!logoConfirmations?.[tile.key]
                      const hasFile = !!logoByTileKey[tile.key]

                      return (
                        <div
                          key={tile.key}
                          className="bg-white border border-[#e5e3e3] rounded-[12px] p-4 flex flex-1 min-w-0 flex-col gap-[9px] items-start"
                        >
                          <div
                            className={`${tile.previewBg} w-full h-[160px] sm:h-[180px] lg:h-[206px] rounded-[10px] flex items-center justify-center overflow-hidden`}
                          >
                            {src ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                alt={`${tile.title} preview`}
                                src={src}
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              tile.placeholder
                            )}
                          </div>

                          <div className="flex flex-col gap-1 w-[149px]">
                            <div className="text-[#09090b] text-[15px] font-bold leading-[22.5px] tracking-[-0.2344px]">
                              {tile.title}
                            </div>
                            <div className="text-[#18181b] text-[12px] font-normal leading-[18px]">
                              {tile.spec}
                            </div>
                          </div>

                          <div className="flex w-full flex-col gap-3">
                            <button
                              type="button"
                              onClick={() => triggerTilePicker(tile)}
                              className="w-full h-10 px-4 rounded-[6px] border border-[#dcdcde] shadow-[0px_1px_1.5px_0.1px_rgba(22,25,36,0.05)] flex items-center justify-center gap-2"
                              style={{
                                backgroundImage:
                                  'linear-gradient(180deg, rgba(232, 232, 233, 0) 0%, rgba(220, 220, 222, 0.08) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)',
                              }}
                            >
                              <Upload className="w-4 h-4 text-black" />
                              <span className="text-[14px] font-medium leading-[normal] text-black text-center">
                                Upload
                              </span>
                            </button>

                            <button
                              type="button"
                              disabled={!hasFile}
                              onClick={() => confirmTile(tile.key)}
                              className={`w-full h-10 px-4 rounded-[6px] border border-black shadow-[0px_1px_1.5px_0.1px_rgba(22,25,36,0.05)] flex items-center justify-center gap-2 ${
                                hasFile ? 'bg-[#18181b]' : 'bg-[#18181b]/60 cursor-not-allowed'
                              }`}
                            >
                              <Check className="w-4 h-4 text-white" />
                              <span className="text-[14px] font-medium leading-[normal] text-white text-center">
                                {isConfirmed ? 'Confirmed' : 'Confirm'}
                              </span>
                            </button>
                          </div>

                          <input
                            ref={tile.inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleTileFileChange(tile.key, tile.categories, e)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>

              {/* Approved Background Colors — Figma 9258:4349 LogoSection */}
              <Card className="rounded-[10px] border-[#e5e7eb] bg-white !p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-[Inter,sans-serif] text-[20px] font-semibold leading-[27px] tracking-[-0.4395px] text-[#101828]">
                      Approved Background Colors
                    </h3>
                    <p className="font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#6a7282]">
                      Select or upload color swatches that your logo can be used against.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-start gap-3">
                    {/* Preset swatches — same toggle behavior as Steps 1–4 (`colors.selected`) */}
                    <button
                      type="button"
                      onClick={() =>
                        updateColors(
                          selectedColors.includes('white')
                            ? selectedColors.filter((c) => c !== 'white')
                            : [...selectedColors, 'white']
                        )
                      }
                      className="flex w-20 cursor-pointer flex-col items-center gap-2 border-0 bg-transparent p-0 text-left transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2"
                    >
                      <div className="relative flex size-20 shrink-0 items-center justify-center rounded-[10px] border-2 border-[#e5e7eb] bg-white">
                        {selectedColors.includes('white') ? (
                          <span className="flex size-6 items-center justify-center rounded-full bg-[#18181b]">
                            <Check className="size-4 text-white" strokeWidth={2.5} aria-hidden />
                          </span>
                        ) : null}
                      </div>
                      <span className="w-full text-center font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#364153]">
                        White
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateColors(
                          selectedColors.includes('light-gray')
                            ? selectedColors.filter((c) => c !== 'light-gray')
                            : [...selectedColors, 'light-gray']
                        )
                      }
                      className="flex w-20 cursor-pointer flex-col items-center gap-2 border-0 bg-transparent p-0 text-left transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2"
                    >
                      <div className="relative flex size-20 shrink-0 items-center justify-center rounded-[10px] border-2 border-[#e5e7eb] bg-[#f3f4f6]">
                        {selectedColors.includes('light-gray') ? (
                          <span className="flex size-6 items-center justify-center rounded-full bg-[#18181b]">
                            <Check className="size-4 text-white" strokeWidth={2.5} aria-hidden />
                          </span>
                        ) : null}
                      </div>
                      <span className="w-full text-center font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#364153]">
                        Light Gray
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateColors(
                          selectedColors.includes('gray')
                            ? selectedColors.filter((c) => c !== 'gray')
                            : [...selectedColors, 'gray']
                        )
                      }
                      className="flex w-20 cursor-pointer flex-col items-center gap-2 border-0 bg-transparent p-0 text-left transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2"
                    >
                      <div className="relative flex size-20 shrink-0 items-center justify-center rounded-[10px] border-2 border-[#e5e7eb] bg-[#9ca3af]">
                        {selectedColors.includes('gray') ? (
                          <span className="flex size-6 items-center justify-center rounded-full bg-white">
                            <Check className="size-4 text-[#18181b]" strokeWidth={2.5} aria-hidden />
                          </span>
                        ) : null}
                      </div>
                      <span className="w-full text-center font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#364153]">
                        Gray
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateColors(
                          selectedColors.includes('black')
                            ? selectedColors.filter((c) => c !== 'black')
                            : [...selectedColors, 'black']
                        )
                      }
                      className="flex w-20 cursor-pointer flex-col items-center gap-2 border-0 bg-transparent p-0 text-left transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2"
                    >
                      <div
                        className={`relative flex size-20 shrink-0 items-center justify-center rounded-[10px] border-2 border-[#8c94a4] bg-black ${
                          selectedColors.includes('black')
                            ? 'shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]'
                            : ''
                        }`}
                      >
                        {selectedColors.includes('black') ? (
                          <Check className="size-6 text-white" strokeWidth={2.75} aria-hidden />
                        ) : null}
                      </div>
                      <span className="w-full text-center font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#364153]">
                        Black
                      </span>
                    </button>

                    {customColors.map((color) => (
                      <div key={color} className="flex w-20 flex-col items-center gap-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedColors.includes(color)
                              const newSelected = isSelected
                                ? selectedColors.filter((c) => c !== color)
                                : [...selectedColors, color]
                              updateColors(newSelected)
                            }}
                            className="relative flex size-20 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-2 border-[#e5e7eb] transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2"
                            style={{ backgroundColor: color }}
                          >
                            {selectedColors.includes(color) ? (
                              <span className="pointer-events-none flex size-6 items-center justify-center rounded-full bg-white">
                                <Check className="size-4 text-[#18181b]" strokeWidth={2.5} aria-hidden />
                              </span>
                            ) : null}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newCustom = customColors.filter((c) => c !== color)
                              const newSelected = selectedColors.filter((c) => c !== color)
                              updateData({
                                colors: {
                                  ...(data?.colors || {}),
                                  selected: newSelected,
                                  custom: newCustom,
                                },
                              })
                            }}
                            className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#71717a] shadow-sm hover:bg-[#f3f3f5] hover:text-[#18181b]"
                            aria-label={`Remove color ${color}`}
                          >
                            <X className="size-3" strokeWidth={2} />
                          </button>
                        </div>
                        <span className="max-w-[80px] truncate text-center font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#364153]">
                          {color}
                        </span>
                      </div>
                    ))}

                    {/* Add — Figma: 80px tile, border #d1d5dc, 24px icon; no caption under tile */}
                    <button
                      type="button"
                      onClick={() => setIsAddingColor(true)}
                      className="flex size-20 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-2 border-[#d1d5dc] bg-white p-0.5 transition-colors hover:border-[#9ca3af] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2"
                      aria-label="Add custom background color"
                    >
                      <Plus className="size-6 text-[#9ca3af]" strokeWidth={2} aria-hidden />
                    </button>
                  </div>
                </div>

                {isAddingColor && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#e5e7eb] pt-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="size-10 cursor-pointer rounded border border-[#e5e7eb]"
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-[120px] rounded-lg border border-[#e5e7eb] px-3 py-2 font-[Inter,sans-serif] text-[14px] leading-5 text-[#18181b]"
                        placeholder="#000000"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (customColor) {
                            const newCustom = customColors.includes(customColor)
                              ? customColors
                              : [...customColors, customColor]
                            const newSelected = selectedColors.includes(customColor)
                              ? selectedColors
                              : [...selectedColors, customColor]
                            updateData({
                              colors: {
                                ...(data?.colors || {}),
                                selected: newSelected,
                                custom: newCustom,
                              },
                            })
                          }
                          setIsAddingColor(false)
                        }}
                        className="rounded-lg bg-[#18181b] px-3 py-2 font-[Inter,sans-serif] text-[12px] font-medium leading-[18px] text-white hover:opacity-90"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingColor(false)}
                        className="rounded-lg border border-[#e5e7eb] px-3 py-2 font-[Inter,sans-serif] text-[12px] leading-[18px] text-[#18181b] hover:bg-[#f9fafb]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Background & Visibility */}
              <Card className="bg-white">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-6">
                  Background & Visibility
                </h3>

                <div className="space-y-4">
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                    <div>
                      <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                        Permitted Background Types
                      </label>
                      <Select
                        value={permittedBackgroundTypes}
                        onChange={(e) => updateBackgrounds('permitted', e.target.value)}
                        options={[
                          { value: 'light-dark', label: 'Light & Dark backgrounds' },
                          { value: 'light-only', label: 'Light backgrounds only' },
                          { value: 'dark-only', label: 'Dark backgrounds only' },
                        ]}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                        Dark Background Uses
                      </label>
                      <Select
                        value={darkBackgroundUses}
                        onChange={(e) => updateBackgrounds('darkUses', e.target.value)}
                        options={[
                          { value: 'white-reversed', label: 'White or Reversed Logo' },
                          { value: 'white-only', label: 'White Logo only' },
                          { value: 'reversed-only', label: 'Reversed Logo only' },
                        ]}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                      Minimum Contrast Ratio
                    </label>
                    <input
                      type="text"
                      value={minimumContrastRatio}
                      onChange={(e) => updateBackgrounds('minContrast', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                      placeholder="e.g., 4.5:1"
                    />
                  </div>
                </div>
              </Card>

              {/* Advanced: Logo Usage Rules */}
              <Card className="bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                    Advanced: Logo Usage Rules
                  </h3>
                  <button
                    type="button"
                    onClick={() => updateRules('enabled', !logoUsageRulesEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${logoUsageRulesEnabled ? 'bg-[#18181b]' : 'bg-[#e4e4e7]'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${logoUsageRulesEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </Card>

              {/* Typography review — Figma 9258:4426 (syncs with Step 2 `typography` rows) */}
              <Card className="border-[#e5e7eb] bg-white !p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-[Inter,sans-serif] text-[20px] font-semibold leading-[30px] tracking-[-0.4492px] text-[#101828]">
                        Typography
                      </h3>
                      <p className="mt-1 font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]">
                        Font families for headings and body text
                      </p>
                    </div>
                    <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:gap-2">
                      <button
                        type="button"
                        onClick={handleTypographyRegenerate}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-2.5 font-[Inter,sans-serif] text-[14px] font-medium leading-5 tracking-[-0.1504px] text-[#0a0a0a] transition-colors hover:bg-[#f9fafb] sm:flex-none"
                      >
                        <RefreshCw className="size-4 shrink-0" aria-hidden />
                        Regenerate
                      </button>
                      <button
                        type="button"
                        onClick={handleTypographyConfirmAll}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-[#18181b] px-4 font-[Inter,sans-serif] text-[14px] font-medium leading-5 tracking-[-0.1504px] text-white transition-opacity hover:opacity-90 sm:flex-none"
                      >
                        <Check className="size-4 shrink-0 text-white" strokeWidth={2.5} aria-hidden />
                        Confirm All
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Headings column */}
                    <div className="flex flex-col gap-4 rounded-[10px] border border-[#e5e7eb] bg-gradient-to-br from-white to-[#f9fafb] px-4 pb-px pt-[25px]">
                      <p className="font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#6a7282]">
                        Headings
                      </p>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <span className="font-[Inter,sans-serif] text-[14px] font-medium leading-[14px] tracking-[-0.1504px] text-[#364153]">
                            Font Family
                          </span>
                          <div className="relative">
                            <select
                              value={headingTypographyAnchor?.font || 'Inter'}
                              onChange={(e) => patchTypographyGroup('heading', { font: e.target.value })}
                              className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-transparent bg-[#f3f3f5] py-px pl-[13px] pr-10 font-[Inter,sans-serif] text-[14px] leading-5 text-[#0a0a0a] tracking-[-0.1504px] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/15"
                            >
                              {TYPOGRAPHY_FONT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-[13px] top-1/2 size-4 -translate-y-1/2 text-[#0a0a0a]/60" aria-hidden />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="font-[Inter,sans-serif] text-[14px] font-medium leading-[14px] tracking-[-0.1504px] text-[#364153]">
                            Weight
                          </span>
                          <div className="relative">
                            <select
                              value={headingTypographyAnchor?.fontWeight || 'Bold'}
                              onChange={(e) => patchTypographyGroup('heading', { fontWeight: e.target.value })}
                              className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-transparent bg-[#f3f3f5] py-px pl-[13px] pr-10 font-[Inter,sans-serif] text-[14px] leading-5 tracking-[-0.1504px] text-[#0a0a0a] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/15"
                            >
                              {TYPOGRAPHY_WEIGHT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-[13px] top-1/2 size-4 -translate-y-1/2 text-[#0a0a0a]/60" aria-hidden />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 rounded-[10px] border border-[#e5e7eb] bg-white p-3">
                        <p
                          style={{
                            fontFamily: `'${headingTypographyAnchor?.font || 'Inter'}', sans-serif`,
                            fontWeight: cssFontWeightFromToken(headingTypographyAnchor?.fontWeight || 'Bold'),
                          }}
                          className="text-[26px] leading-[33.6px] text-[#101828]"
                        >
                          The quick brown fox
                        </p>
                        <p className="font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]">
                          jumps over the lazy dog
                        </p>
                        <p className="font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#99a1af]">
                          ABCDEFGHIJKLMNOPQRSTUVWXYZ
                        </p>
                        <p className="font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#99a1af]">
                          0123456789
                        </p>
                      </div>
                    </div>

                    {/* Body column */}
                    <div className="flex flex-col gap-4 rounded-[10px] border border-[#e5e7eb] bg-gradient-to-br from-white to-[#f9fafb] px-4 pb-px pt-[25px]">
                      <p className="font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#6a7282]">
                        Body Text
                      </p>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <span className="font-[Inter,sans-serif] text-[14px] font-medium leading-[14px] tracking-[-0.1504px] text-[#364153]">
                            Font Family
                          </span>
                          <div className="relative">
                            <select
                              value={bodyTypographyAnchor?.font || 'Inter'}
                              onChange={(e) => patchTypographyGroup('body', { font: e.target.value })}
                              className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-transparent bg-[#f3f3f5] py-px pl-[13px] pr-10 font-[Inter,sans-serif] text-[14px] leading-5 text-[#0a0a0a] tracking-[-0.1504px] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/15"
                            >
                              {TYPOGRAPHY_FONT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-[13px] top-1/2 size-4 -translate-y-1/2 text-[#0a0a0a]/60" aria-hidden />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="font-[Inter,sans-serif] text-[14px] font-medium leading-[14px] tracking-[-0.1504px] text-[#364153]">
                            Weight
                          </span>
                          <div className="relative">
                            <select
                              value={bodyTypographyAnchor?.fontWeight || 'Regular'}
                              onChange={(e) => patchTypographyGroup('body', { fontWeight: e.target.value })}
                              className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-transparent bg-[#f3f3f5] py-px pl-[13px] pr-10 font-[Inter,sans-serif] text-[14px] leading-5 tracking-[-0.1504px] text-[#0a0a0a] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/15"
                            >
                              {TYPOGRAPHY_WEIGHT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-[13px] top-1/2 size-4 -translate-y-1/2 text-[#0a0a0a]/60" aria-hidden />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 rounded-[10px] border border-[#e5e7eb] bg-white px-3 py-[13px]">
                        <p
                          style={{
                            fontFamily: `'${bodyTypographyAnchor?.font || 'Inter'}', sans-serif`,
                            fontWeight: cssFontWeightFromToken(bodyTypographyAnchor?.fontWeight || 'Regular'),
                          }}
                          className="font-[Inter,sans-serif] text-[16px] leading-[25.6px] text-[#101828]"
                        >
                          The quick brown fox
                        </p>
                        <p className="font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]">
                          jumps over the lazy dog
                        </p>
                        <p className="font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#99a1af]">
                          ABCDEFGHIJKLMNOPQRSTUVWXYZ
                        </p>
                        <p className="font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#99a1af]">
                          0123456789
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Color Palette — Figma 9258:4507 (syncs with Step 3 `colors.primary|secondary|other` + `primarySelected`) */}
              <Card id="review-color-palette-section" className="scroll-mt-24 border-[#e5e7eb] bg-white !p-6">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-[Inter,sans-serif] text-[20px] font-semibold leading-[30px] text-[#18181b]">
                        Color Palette
                      </h3>
                      <p className="font-[Inter,sans-serif] text-[18px] font-normal leading-7 text-[#71717a]">
                        Select your primary brand colors ({selectedPrimaryColorKeys.length} selected)
                      </p>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:gap-2">
                      <button
                        type="button"
                        aria-expanded={paletteAddOpen}
                        aria-controls="review-palette-add-panel"
                        onClick={() => {
                          setPaletteAddOpen((o) => !o)
                          setPaletteDraftHex((d) => d || '#18181b')
                        }}
                        className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md border border-black/10 bg-[#18181b] px-2.5 font-[Inter,sans-serif] text-[14px] font-medium leading-5 tracking-[-0.1504px] text-white transition-opacity hover:opacity-90 sm:w-[172px]"
                      >
                        <Plus className="size-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
                        Add Custom Color
                      </button>
                      {/* Figma 9258:4519 — 40px height, 16px icon @ 10px from left, 14px medium label; compact “Regenerate” */}
                      <button
                        type="button"
                        onClick={handleRegeneratePaletteAi}
                        className="inline-flex h-10 w-auto shrink-0 items-center gap-3 rounded-md border border-black/10 bg-[#18181b] py-0 pl-2.5 pr-3 font-[Inter,sans-serif] text-[14px] font-medium leading-5 tracking-[-0.1504px] text-white transition-opacity hover:opacity-90"
                      >
                        <RefreshCw className="size-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
                        Regenerate
                      </button>
                    </div>
                    {paletteAddOpen ? (
                      <div
                        id="review-palette-add-panel"
                        className="flex flex-col gap-3 rounded-[10px] border border-[#e5e7eb] bg-[#fafafa] p-4 sm:flex-row sm:flex-wrap sm:items-center"
                      >
                        <label className="flex items-center gap-3 font-[Inter,sans-serif] text-[14px] text-[#52525b]">
                          <span className="sr-only">Choose color</span>
                          <input
                            type="color"
                            value={paletteDraftHex}
                            onChange={(e) => setPaletteDraftHex(e.target.value)}
                            className="h-10 w-14 cursor-pointer rounded-md border border-[#e5e7eb] bg-white p-0.5"
                          />
                          <span className="tabular-nums text-[#18181b]">{formatHexDisplay(paletteDraftHex)}</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={commitPaletteCustomColor}
                            className="inline-flex h-9 items-center justify-center rounded-md bg-[#18181b] px-4 font-[Inter,sans-serif] text-[14px] font-medium text-white hover:opacity-90"
                          >
                            Add to palette
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaletteAddOpen(false)}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-[#e5e7eb] bg-white px-4 font-[Inter,sans-serif] text-[14px] font-medium text-[#18181b] hover:bg-[#f4f4f5]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      ...primaryColors.map((color) => ({ ...color, role: 'primary' })),
                      ...secondaryColors.map((color) => ({ ...color, role: 'secondary' })),
                      ...otherColors.map((color) => ({ ...color, role: 'other' })),
                    ].map((color, index) => {
                      const key = `${color.role}-${color.id || color.hex || index}`
                      const isSelected = selectedPrimaryColorKeys.includes(key)
                      const hexDisp = formatHexDisplay(color.hex)
                      const label = color.name || color.label
                      const showLabelRow = Boolean(label) && formatHexDisplay(label) !== hexDisp
                      return (
                        <div
                          key={key}
                          className={`relative flex min-h-[188px] w-full flex-col gap-2 rounded-[10px] border p-4 transition-colors ${
                            isSelected ? 'border-[#29303e]' : 'border-[#e5e7eb]'
                          }`}
                        >
                          <button
                            type="button"
                            aria-label={`Remove ${hexDisp} from palette`}
                            className="absolute left-2 top-2 z-30 flex size-7 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#52525b] shadow-sm hover:bg-[#f4f4f5] hover:text-[#18181b]"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (color.id != null) removePaletteSwatch(color.role, color.id)
                            }}
                          >
                            <X className="size-3.5" strokeWidth={2} aria-hidden />
                          </button>
                          {isSelected ? (
                            <span
                              className="pointer-events-none absolute -right-1 -top-1 z-20 flex size-5 items-center justify-center rounded-full bg-[#1a1a1a] ring-2 ring-white"
                              aria-hidden
                            >
                              <Check className="size-3 text-white" strokeWidth={3} />
                            </span>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => togglePrimaryColorSelection(key)}
                            className="flex flex-1 flex-col gap-2 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2"
                          >
                            <div
                              className="relative h-24 w-full shrink-0 overflow-hidden rounded-[10px]"
                              style={{ backgroundColor: color.hex }}
                            >
                              {isSelected ? (
                                <span className="pointer-events-none absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm">
                                  <Check className="size-5 text-[#18181b]" strokeWidth={2.5} aria-hidden />
                                </span>
                              ) : null}
                            </div>
                            <div className="flex flex-col gap-1 font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px]">
                              {showLabelRow ? (
                                <>
                                  <span className="text-[#101828]">{label}</span>
                                  <span className="text-[#6a7282]">{hexDisp}</span>
                                </>
                              ) : (
                                <span className="text-[#101828]">{hexDisp}</span>
                              )}
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex flex-col gap-2 rounded-[10px] bg-[#f4f4f4] px-[17px] pb-px pt-[17px]">
                    <p className="font-[Inter,sans-serif] text-[20px] font-semibold leading-[30px] text-[#18181b]">
                      💡 Color Harmony Tips
                    </p>
                    <ul className="flex flex-col gap-1 font-[Inter,sans-serif] text-[16px] font-normal leading-6 tracking-[-0.3125px] text-[#2c303e]">
                      <li>• Use 3-5 colors for a balanced palette</li>
                      <li>• Include at least one neutral color</li>
                      <li>• Ensure sufficient contrast for accessibility</li>
                      <li>• Consider color psychology for your industry</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Style: Brand Voice & Personality */}
              <Card className="bg-white">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-1">
                  Style: Brand Voice & Personality
                </h3>
                <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                  Define how your brand communicates and expresses itself.
                </p>

                <div className="space-y-8">
                  {/* Tone Descriptors */}
                  <div>
                    <div className="mb-2">
                      <div className="text-[16px] font-medium text-[#18181b]">
                        Select up to 3 core tone descriptors
                      </div>
                      <p className="text-[14px] leading-[20px] text-[#71717a]">
                        Words to describe how your brand "sounds" when speaking.{' '}
                        {selectedToneDescriptors.length > 0 && `${selectedToneDescriptors.length} selected.`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {toneDescriptors.map((descriptor) => {
                        const isSelected = selectedToneDescriptors.includes(descriptor)
                        return (
                          <motion.button
                            key={descriptor}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleToneDescriptor(descriptor)}
                            className={`px-4 py-2 rounded-full border text-[14px] font-medium transition-colors ${isSelected
                              ? 'bg-[#18181b] text-white border-[#18181b]'
                              : 'bg-white text-[#18181b] border-[#e4e4e7]'
                              }`}
                          >
                            {descriptor}
                          </motion.button>
                        )
                      })}
                    </div>
                    <p className="text-[12px] leading-[16px] text-[#a1a1aa] mt-2">
                      e.g. These words make a clearer voice.
                    </p>
                  </div>

                  {/* Audience */}
                  <div>
                    <div className="mb-2">
                      <div className="text-[16px] font-medium text-[#18181b]">
                        Who is your brand speaking to?
                      </div>
                      <p className="text-[14px] leading-[20px] text-[#71717a]">
                        This audience helps AI dial in a tone if there's overlap (e.g. B2B is more formal).
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {audienceTypes.map((audience) => {
                        const isSelected = selectedAudience.includes(audience)
                        return (
                          <motion.button
                            key={audience}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleAudience(audience)}
                            className={`px-4 py-2 rounded-full border text-[14px] font-medium transition-colors ${isSelected
                              ? 'bg-[#18181b] text-white border-[#18181b]'
                              : 'bg-white text-[#18181b] border-[#e4e4e7]'
                              }`}
                          >
                            {audience}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Brand Personality */}
                  <div>
                    <div className="mb-2">
                      <div className="text-[16px] font-medium text-[#18181b]">
                        Brand personality (1–2 sentences)
                      </div>
                      <p className="text-[14px] leading-[20px] text-[#71717a]">
                        Describe how this brand thinks and behaves at a high level. This helps AI align with the brand's core character.
                      </p>
                    </div>
                    <textarea
                      value={brandPersonality}
                      onChange={(e) => updateStyleInfo({ personality: e.target.value })}
                      rows={4}
                      className="box-border min-h-[120px] w-full resize-y whitespace-pre-wrap break-words rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 font-[Inter,sans-serif] text-[16px] font-normal not-italic leading-[24px] tracking-[-0.312px] text-[rgba(10,10,10,0.5)] placeholder:text-[rgba(10,10,10,0.5)] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/20"
                      placeholder="Describe your brand's personality in 1–2 sentences."
                    />
                  </div>
                </div>
              </Card>

              {/* Example phrases — same as Step4Style.jsx (Figma 9258:4053), synced via data.style.examplePhrases */}
              <Card className="w-full min-w-0 !border-[#e5e7eb] !bg-white !p-8">
                <div className="flex w-full flex-col gap-4">
                  <div className="flex w-full flex-col gap-4">
                    <h3 className="font-[Inter,sans-serif] text-[20px] font-semibold leading-[30px] text-[#18181b]">
                      Example phrases
                    </h3>
                    <p className="font-[Inter,sans-serif] text-[18px] font-normal leading-[28px] text-[#71717a]">
                      Teach MANIFESTR how you do and don&apos;t speak.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {examplePhrases.map((phrase) => (
                      <div key={phrase.id} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                        <div className="flex min-w-0 flex-col gap-2">
                          <label className="block font-[Inter,sans-serif] text-[14px] font-semibold leading-[20px] tracking-[-0.084px] text-[#1e293b]">
                            We say
                          </label>
                          <div className="group relative">
                            <input
                              type="text"
                              value={phrase.weSay}
                              onChange={(e) => updateExamplePhrase(phrase.id, 'weSay', e.target.value)}
                              className={`box-border w-full min-w-0 rounded-lg border border-[#CBD5E1] bg-white py-3 pl-3 font-[Inter,sans-serif] text-[16px] font-medium leading-[22px] tracking-[-0.112px] text-[#18181b] placeholder:text-[#71717a] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/20 ${examplePhrases.length > 1 ? 'pr-10' : 'pr-3'}`}
                              placeholder="Transform your workflow"
                            />
                            {examplePhrases.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeExamplePhrase(phrase.id)}
                                className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#18181b] opacity-0 transition-opacity group-hover:opacity-100"
                                aria-label="Remove phrase pair"
                              >
                                <X className="h-3 w-3 text-white" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex min-w-0 flex-col gap-2">
                          <label className="block font-[Inter,sans-serif] text-[14px] font-semibold leading-[20px] tracking-[-0.084px] text-[#1e293b]">
                            We don&apos;t say
                          </label>
                          <input
                            type="text"
                            value={phrase.weDontSay}
                            onChange={(e) => updateExamplePhrase(phrase.id, 'weDontSay', e.target.value)}
                            className="box-border w-full min-w-0 rounded-lg border border-[#CBD5E1] bg-white px-3 py-3 font-[Inter,sans-serif] text-[16px] font-medium leading-[22px] tracking-[-0.112px] text-[#18181b] placeholder:text-[#71717a] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/20"
                            placeholder="Disrupt the industry"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={STYLE_GUIDE_VOICE_ACTION_ROW}>
                    <Button variant="primary" size="md" onClick={addExamplePhrase} className={STYLE_GUIDE_VOICE_PRIMARY_BTN}>
                      <span className="flex items-center gap-[6px]">
                        <Plus className="size-[23px] shrink-0 text-white" strokeWidth={1.75} aria-hidden />
                        <span>Add another pair</span>
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={handleReviewGenerateVoiceSample}
                      disabled={reviewVoiceSpeaking}
                      className={STYLE_GUIDE_VOICE_PRIMARY_BTN}
                    >
                      <span className="flex items-center gap-[6px]">
                        <Volume2 className="size-[23px] shrink-0 text-white" strokeWidth={1.75} aria-hidden />
                        <span>{reviewVoiceSpeaking ? 'Playing sample…' : 'Generate voice sample'}</span>
                      </span>
                    </Button>
                    <span className={STYLE_GUIDE_VOICE_PREVIEW_HINT}>Preview how your selections might sound</span>
                  </div>
                  {reviewVoiceSamplePreview ? (
                    <p className="mt-0 rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-4 py-3 text-[14px] leading-[22px] text-[#374151]">
                      {reviewVoiceSamplePreview}
                    </p>
                  ) : null}
                </div>
              </Card>

              {/* Primary Audience Personas */}
              <Card className="bg-white">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                  Primary audience personas
                </h3>
                <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                  Add 1–2 personas you speak to most often.
                </p>

                <div className="space-y-4 mb-4">
                  {personas.map((persona) => (
                    <div key={persona.id} className="relative group">
                      {personas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePersona(persona.id)}
                          className="absolute top-2 right-0 w-8 h-8 rounded-md bg-[#18181b] flex items-center justify-center text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10 md:pr-12">
                        <div>
                          <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                            Persona title
                          </label>
                          <input
                            type="text"
                            value={persona.title}
                            onChange={(e) => updatePersona(persona.id, 'title', e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                            placeholder="CTO / Engineering Leader"
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                            Persona summary
                          </label>
                          <textarea
                            value={persona.summary}
                            onChange={(e) => updatePersona(persona.id, 'summary', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b] resize-none"
                            placeholder="Enter your main text here..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {personas.length === 0 && (
                    <div className="text-[14px] leading-[20px] text-[#a1a1aa] italic">
                      No personas added yet.
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={addPersona}
                  className="w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add persona
                </Button>
              </Card>
            </div>


            <div className="relative z-30 mb-24 h-auto w-full shrink-0 overflow-y-auto px-0 xl:mb-0 xl:w-[360px] xl:px-0">
              <div className="space-y-6">
                {/* Live Preview — Figma 9258:4759 SummaryPanel */}
                <Card className="border-[#e5e7eb] bg-white !p-6">
                  <div className="flex w-full flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-start gap-1.5">
                        <h3 className="shrink-0 font-[Inter,sans-serif] text-[20px] font-semibold leading-[30px] text-[#18181b]">
                          Live Preview
                        </h3>
                        <span className="relative mt-0.5 inline-flex size-[17px] shrink-0 items-center justify-center" aria-hidden>
                          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[17px]">
                            <path d="M7.48871 1.91435C7.51784 1.75841 7.60058 1.61757 7.72262 1.51621C7.84466 1.41486 7.9983 1.35937 8.15694 1.35938C8.31558 1.35937 8.46922 1.41486 8.59126 1.51621C8.7133 1.61757 8.79605 1.75841 8.82517 1.91435L9.53963 5.69262C9.59038 5.96124 9.72092 6.20832 9.91422 6.40162C10.1075 6.59492 10.3546 6.72546 10.6232 6.7762L14.4015 7.49066C14.5574 7.51979 14.6983 7.60254 14.7996 7.72458C14.901 7.84661 14.9565 8.00026 14.9565 8.1589C14.9565 8.31753 14.901 8.47118 14.7996 8.59321C14.6983 8.71525 14.5574 8.798 14.4015 8.82713L10.6232 9.54159C10.3546 9.59233 10.1075 9.72287 9.91422 9.91617C9.72092 10.1095 9.59038 10.3566 9.53963 10.6252L8.82517 14.4034C8.79605 14.5594 8.7133 14.7002 8.59126 14.8016C8.46922 14.9029 8.31558 14.9584 8.15694 14.9584C7.9983 14.9584 7.84466 14.9029 7.72262 14.8016C7.60058 14.7002 7.51784 14.5594 7.48871 14.4034L6.77425 10.6252C6.72351 10.3566 6.59297 10.1095 6.39967 9.91617C6.20637 9.72287 5.95928 9.59233 5.69067 9.54159L1.9124 8.82713C1.75646 8.798 1.61561 8.71525 1.51426 8.59321C1.4129 8.47118 1.35742 8.31753 1.35742 8.1589C1.35742 8.00026 1.4129 7.84661 1.51426 7.72458C1.61561 7.60254 1.75646 7.51979 1.9124 7.49066L5.69067 6.7762C5.95928 6.72546 6.20637 6.59492 6.39967 6.40162C6.59297 6.20832 6.72351 5.96124 6.77425 5.69262L7.48871 1.91435Z" stroke="#9810FA" strokeWidth="1.35958" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.5957 1.35938V4.07853" stroke="#9810FA" strokeWidth="1.35958" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.9555 2.71875H12.2363" stroke="#9810FA" strokeWidth="1.35958" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.71895 14.9535C3.46983 14.9535 4.07853 14.3448 4.07853 13.594C4.07853 12.8431 3.46983 12.2344 2.71895 12.2344C1.96808 12.2344 1.35938 12.8431 1.35938 13.594C1.35938 14.3448 1.96808 14.9535 2.71895 14.9535Z" stroke="#9810FA" strokeWidth="1.35958" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                      <p className="font-[Inter,sans-serif] text-[18px] font-normal leading-[28px] text-[#71717a]">
                        Real-time brand application
                      </p>
                    </div>

                    <div className="flex w-full min-w-0 flex-col gap-6">
                      {/* Brand Kit Name */}
                      <div className="flex w-full flex-col gap-2">
                        <label className="font-[Inter,sans-serif] text-[14px] font-medium leading-[14px] tracking-[-0.1504px] text-[#4a5565]">
                          Brand Kit Name
                        </label>
                        <div className="flex h-9 w-full min-w-0 items-center overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f3f3f5] px-3 py-1">
                          <p className="truncate font-[Inter,sans-serif] text-[14px] font-normal leading-5 tracking-[-0.1504px] text-[#18181b]">
                            {brandKitName}
                          </p>
                        </div>
                      </div>

                      {/* Logo */}
                      <div className="flex w-full flex-col gap-2">
                        <p className="font-[Inter,sans-serif] text-[14px] font-medium leading-4 text-[#6a7282]">
                          Logo
                        </p>
                        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-[#e4e4e7] bg-white px-4 py-4">
                          {uploadedLogos.length === 0 ? (
                            <>
                              <p className="text-center font-[Inter,sans-serif] text-[14px] font-medium leading-5 text-[#18181b]">
                                No logo uploaded
                              </p>
                              <button
                                type="button"
                                onClick={() => primaryLogoInputRef.current?.click()}
                                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md bg-[#18181b] px-3 font-[Inter,sans-serif] text-[14px] font-medium leading-5 text-white transition-opacity hover:opacity-90"
                              >
                                <CloudUpload className="size-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
                                Click to upload
                              </button>
                            </>
                          ) : (
                            <div className="flex w-full min-w-0 flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-start">
                              {livePreviewLogoSrc ? (
                                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#e4e4e7] bg-[#f3f3f5]">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img alt="Logo preview" src={livePreviewLogoSrc} className="max-h-full max-w-full object-contain" />
                                </div>
                              ) : null}
                              <div className="min-w-0 flex-1 text-center sm:text-left">
                                <p className="font-[Inter,sans-serif] text-[14px] font-medium leading-5 text-[#18181b]">
                                  {uploadedLogos.length} logo{uploadedLogos.length > 1 ? 's' : ''} uploaded
                                </p>
                                <button
                                  type="button"
                                  onClick={() => primaryLogoInputRef.current?.click()}
                                  className="mt-2 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#18181b] px-3 font-[Inter,sans-serif] text-[14px] font-medium leading-5 text-white transition-opacity hover:opacity-90"
                                >
                                  <CloudUpload className="size-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
                                  Replace logo
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Typography */}
                      <div className="flex w-full flex-col gap-2">
                        <label className="font-[Inter,sans-serif] text-[14px] font-medium leading-[14px] tracking-[-0.1504px] text-[#4a5565]">
                          Typography
                        </label>
                        <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f3f3f5] px-3 py-1">
                          <p className="truncate font-[Inter,sans-serif] text-[14px] font-normal leading-5 tracking-[-0.1504px] text-[#0a0a0a]">
                            {primaryTypeface}
                          </p>
                        </div>
                        <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f3f3f5] px-3 py-1">
                          <p className="truncate font-[Inter,sans-serif] text-[14px] font-normal tracking-[-0.1504px] text-[#717182]">
                            {bodyDescription}
                          </p>
                        </div>
                      </div>

                      {/* Color Palette */}
                      <div className="flex w-full flex-col gap-2">
                        <label className="font-[Inter,sans-serif] text-[14px] font-medium leading-[14px] tracking-[-0.1504px] text-[#4a5565]">
                          Color Palette
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          {(selectedPrimaryColors.length > 0 ? selectedPrimaryColors : primaryColors)
                            .slice(0, 3)
                            .map((color, index) => (
                              <div
                                key={color.hex || index}
                                className="size-12 shrink-0 rounded-[10px] border-2 border-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)]"
                                style={{ backgroundColor: color.hex || color }}
                                title={color.name || color.label || color.hex}
                              />
                            ))}
                          <button
                            type="button"
                            onClick={scrollToReviewColorPalette}
                            className="inline-flex shrink-0 items-center justify-center rounded-[10px] border border-[#e4e4e7] bg-white px-3 py-3.5 font-[Inter,sans-serif] text-[14px] font-medium leading-5 tracking-[-0.1504px] text-[#0a0a0a] transition-colors hover:bg-[#f9fafb]"
                          >
                            + Add
                          </button>
                        </div>
                      </div>

                      {/* Brand Voice */}
                      <div className="flex w-full flex-col gap-2">
                        <label className="font-[Inter,sans-serif] text-[14px] font-medium leading-[14px] tracking-[-0.1504px] text-[#4a5565]">
                          Brand Voice
                        </label>
                        <div className="flex min-h-[22px] flex-wrap gap-2">
                          {selectedToneDescriptors.map((descriptor) => (
                            <div
                              key={descriptor}
                              className="inline-flex h-[22px] max-w-full items-center gap-1 rounded-lg bg-[#101828] pl-2 pr-1"
                            >
                              <span className="truncate font-[Inter,sans-serif] text-[12px] font-medium leading-4 text-white">
                                {descriptor}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeToneDescriptor(descriptor)}
                                className="flex size-4 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                                aria-label={`Remove ${descriptor}`}
                              >
                                <X className="size-3" strokeWidth={2.5} aria-hidden />
                              </button>
                            </div>
                          ))}
                          {selectedToneDescriptors.length === 0 ? (
                            <span className="font-[Inter,sans-serif] text-[12px] leading-4 text-[#a1a1aa]">
                              No tone selected
                            </span>
                          ) : null}
                        </div>
                        <div className="flex w-full min-w-0 flex-col gap-2 sm:h-9 sm:flex-row sm:items-stretch sm:gap-2">
                          <input
                            type="text"
                            value={livePreviewVoiceDraft}
                            onChange={(e) => setLivePreviewVoiceDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleLivePreviewAddVoice()
                              }
                            }}
                            className="min-h-9 w-full min-w-0 flex-1 rounded-lg border border-[#e5e7eb] bg-[#f3f3f5] px-3 py-2 font-[Inter,sans-serif] text-[14px] font-normal tracking-[-0.1504px] text-[#0a0a0a] placeholder:text-[#717182] focus:border-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#18181b]/15 sm:py-1"
                            placeholder="Add brand voice"
                            disabled={selectedToneDescriptors.length >= 3}
                          />
                          <button
                            type="button"
                            onClick={handleLivePreviewAddVoice}
                            disabled={selectedToneDescriptors.length >= 3}
                            className="inline-flex h-9 w-full shrink-0 items-center justify-center rounded-lg bg-[#18181b] px-4 font-[Inter,sans-serif] text-[14px] font-medium leading-5 tracking-[-0.1504px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[60px] sm:min-w-[60px] sm:px-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Primary Audience */}
                      <div className="flex w-full flex-col gap-2">
                        <label className="font-[Inter,sans-serif] text-[14px] font-medium leading-[14px] tracking-[-0.1504px] text-[#4a5565]">
                          Primary Audience
                        </label>
                        <div className="flex h-9 w-full min-w-0 items-center overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f3f3f5] px-3 py-1">
                          <p className="truncate font-[Inter,sans-serif] text-[14px] font-normal leading-5 tracking-[-0.1504px] text-[#0a0a0a]">
                            {primaryAudiencePreview || 'Not set'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Completion Status */}
                <Card className="bg-white">
                  <h3 className="text-[18px] font-semibold leading-[24px] text-[#18181b] mb-4">
                    Completion Status
                  </h3>
                  <div className="mb-4">
                    <div className="w-full bg-[#e4e4e7] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#22c55e] h-2 rounded-full transition-all"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                    <div className="mt-2 text-[13px] leading-[18px] text-[#71717a]">
                      {completionPercentage}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {completionStatus.brandKitName ? (
                        <Check className="w-4 h-4 text-[#16a34a]" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                      )}
                      <span className="text-[14px] leading-[20px] text-[#18181b]">Brand Kit Name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {completionStatus.logoUpload ? (
                        <Check className="w-4 h-4 text-[#16a34a]" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                      )}
                      <span className="text-[14px] leading-[20px] text-[#18181b]">Logo Upload</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {completionStatus.logoConfirmed ? (
                        <Check className="w-4 h-4 text-[#16a34a]" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                      )}
                      <span className="text-[14px] leading-[20px] text-[#18181b]">Logo Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {completionStatus.typography ? (
                        <Check className="w-4 h-4 text-[#16a34a]" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                      )}
                      <span className="text-[14px] leading-[20px] text-[#18181b]">Typography</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {completionStatus.colorPalette ? (
                        <Check className="w-4 h-4 text-[#16a34a]" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                      )}
                      <span className="text-[14px] leading-[20px] text-[#18181b]">Color Palette</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {completionStatus.brandVoice ? (
                        <Check className="w-4 h-4 text-[#16a34a]" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded-full" />
                      )}
                      <span className="text-[14px] leading-[20px] text-[#18181b]">Brand Voice</span>
                    </div>
                  </div>
                </Card>

                {/* Quick Actions — sidebar utilities (PDF, ZIP, guidelines DOCX) */}
                <Card className="border-[#e5e7eb] bg-white !p-6">
                  <h3 className="font-[Inter,sans-serif] text-[18px] font-semibold leading-6 text-[#18181b] mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      disabled={!!quickActionBusy}
                      onClick={() => runQuickExport('pdf', exportBrandKitPdf)}
                      className="w-full !h-11 !rounded-lg !bg-[#1a1a1a] !px-4 hover:!opacity-90"
                    >
                      <FileTextIcon className="size-[18px] shrink-0 text-white" strokeWidth={2} aria-hidden />
                      <span className="ml-2 font-[Inter,sans-serif] text-[14px] font-medium text-white">
                        {quickActionBusy === 'pdf' ? 'Preparing…' : 'Export as PDF'}
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      disabled={!!quickActionBusy}
                      onClick={() => runQuickExport('zip', downloadBrandKitAssetsZip)}
                      className="w-full !h-11 !rounded-lg !bg-[#1a1a1a] !px-4 hover:!opacity-90"
                    >
                      <Download className="size-[18px] shrink-0 text-white" strokeWidth={2} aria-hidden />
                      <span className="ml-2 font-[Inter,sans-serif] text-[14px] font-medium text-white">
                        {quickActionBusy === 'zip' ? 'Zipping…' : 'Download Assets'}
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      disabled={!!quickActionBusy}
                      onClick={() => runQuickExport('docx', generateBrandGuidelinesDocx)}
                      className="w-full !h-11 !rounded-lg !bg-[#1a1a1a] !px-4 hover:!opacity-90"
                    >
                      <Network className="size-[18px] shrink-0 text-white" strokeWidth={2} aria-hidden />
                      <span className="ml-2 font-[Inter,sans-serif] text-[14px] font-medium text-white">
                        {quickActionBusy === 'docx' ? 'Generating…' : 'Generate Guidelines'}
                      </span>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Sidebar - Stacked on mobile, Fixed on XL */}


      {/* Footer */}
      <div
        className="fixed bottom-0 left-0 lg:left-[256px] right-0 px-4 md:px-8 py-4 z-50"
        style={{ backgroundColor: '#F4F4F5' }}
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="h-px bg-[#e4e4e7] mx-[5px] mb-4" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="text-[14px] leading-[20px] text-[#71717a]">
              Step 5 of 5 - Review
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="secondary"
                size="md"
                onClick={onBack}
                disabled={isSubmitting}
                className="flex-1 md:flex-none justify-center !bg-[#FFFFFF] !text-[#000000] border-[#e4e4e7] hover:!bg-[#FFFFFF] hover:!text-[#000000] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </Button>
              <Button variant="primary" size="md" onClick={onNext} disabled={isSubmitting} className="flex-1 md:flex-none justify-center">
                {isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Brand Kit')} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
