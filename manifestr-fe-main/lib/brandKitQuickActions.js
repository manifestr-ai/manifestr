/**
 * Client-side exports for Style Guide Step 5 — Quick Actions.
 * Dynamic imports keep jspdf/jszip/docx off the initial bundle.
 */

function slugifyExportBase(name) {
  const s = String(name || 'brand-kit')
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  return s || 'brand-kit'
}

export function sanitizeStyleGuideData(data) {
  if (!data || typeof data !== 'object') return {}
  try {
    return JSON.parse(
      JSON.stringify(data, (_key, value) => {
        if (typeof File !== 'undefined' && value instanceof File) return undefined
        if (typeof Blob !== 'undefined' && value instanceof Blob) return undefined
        return value
      }),
    )
  } catch {
    return {}
  }
}

export async function exportBrandKitPdf(data, brandKitName) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 18
  const maxW = pageW - margin * 2
  let y = 18

  const addParagraph = (text, { size = 11, bold = false, gap = 2.5 } = {}) => {
    if (text == null || text === '') return
    const str = String(text)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(size)
    const lineHeight = size * 0.52
    const wrapped = doc.splitTextToSize(str, maxW)
    for (const line of wrapped) {
      if (y + lineHeight > pageH - 12) {
        doc.addPage()
        y = 18
      }
      doc.text(line, margin, y)
      y += lineHeight + 0.8
    }
    y += gap
  }

  addParagraph(brandKitName || 'Brand kit', { size: 18, bold: true, gap: 1 })
  addParagraph(`Exported ${new Date().toISOString().slice(0, 10)}`, { size: 9, gap: 6 })

  const typo = Array.isArray(data?.typography) ? data.typography : []
  if (typo.length) {
    addParagraph('Typography', { size: 14, bold: true })
    typo.forEach((row) => {
      addParagraph(
        `${row.name || 'Style'} — ${row.font || ''} ${row.fontSize || ''}, ${row.fontWeight || ''}, line ${row.lineHeight || ''}`,
      )
    })
  }

  const colors = data?.colors || {}
  const primary = colors.primary || []
  const secondary = colors.secondary || []
  const other = colors.other || []
  if (primary.length || secondary.length || other.length) {
    addParagraph('Color palette', { size: 14, bold: true })
    if (primary.length) addParagraph(`Primary: ${primary.map((c) => c.hex).filter(Boolean).join(', ')}`)
    if (secondary.length) addParagraph(`Secondary: ${secondary.map((c) => c.hex).filter(Boolean).join(', ')}`)
    if (other.length) addParagraph(`Other: ${other.map((c) => c.hex).filter(Boolean).join(', ')}`)
  }

  const style = data?.style || {}
  addParagraph('Brand voice', { size: 14, bold: true })
  if (style.toneDescriptors?.length) addParagraph(`Tone descriptors: ${style.toneDescriptors.join(', ')}`)
  if (style.audience?.length) addParagraph(`Audience: ${style.audience.join(', ')}`)
  if (style.personality) addParagraph(style.personality)
  if (style.audienceNote) addParagraph(`Audience note: ${style.audienceNote}`)

  const phrases = style.examplePhrases || []
  if (phrases.length) {
    addParagraph('Example phrases', { size: 14, bold: true })
    phrases.forEach((p) => {
      addParagraph(`We say: “${p.weSay || ''}”`)
      addParagraph(`We don't say: “${p.weDontSay || ''}”`)
    })
  }

  const personas = style.personas || []
  if (personas.length) {
    addParagraph('Personas', { size: 14, bold: true })
    personas.forEach((p, i) => {
      addParagraph(`${i + 1}. ${p.title || 'Untitled'}`)
      if (p.summary) addParagraph(p.summary)
    })
  }

  const base = slugifyExportBase(brandKitName)
  doc.save(`${base}-style-guide.pdf`)
}

export async function downloadBrandKitAssetsZip(data, brandKitName) {
  const mod = await import('jszip')
  const JSZip = mod.default || mod
  const { saveAs } = await import('file-saver')
  const base = slugifyExportBase(brandKitName)
  const zip = new JSZip()
  const root = zip.folder(base)

  root.file('brand-kit.json', JSON.stringify(sanitizeStyleGuideData(data), null, 2))

  const logos = Array.isArray(data?.logos) ? data.logos : []
  const withFiles = logos.filter((item) => item?.file instanceof File)
  if (withFiles.length) {
    const logosFolder = root.folder('logos')
    withFiles.forEach((item, i) => {
      const fname = item.name || `logo-${i + 1}`
      logosFolder.file(fname, item.file)
    })
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `${base}-assets.zip`)
}

export async function generateBrandGuidelinesDocx(data, brandKitName) {
  const docx = await import('docx')
  const { saveAs } = await import('file-saver')
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx

  const children = []
  const title = brandKitName || 'Brand guidelines'
  children.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
    }),
  )
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated ${new Date().toLocaleString()}`,
          italics: true,
          size: 20,
          color: '666666',
        }),
      ],
      spacing: { after: 400 },
    }),
  )

  const addH = (text) => {
    children.push(
      new Paragraph({
        text,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
      }),
    )
  }

  const addP = (text) => {
    if (!text) return
    children.push(
      new Paragraph({
        children: [new TextRun({ text: String(text) })],
        spacing: { after: 120 },
      }),
    )
  }

  const typo = Array.isArray(data?.typography) ? data.typography : []
  if (typo.length) {
    addH('Typography')
    typo.forEach((row) => {
      addP(
        `${row.name || 'Style'} — ${row.font || ''}, ${row.fontSize || ''}, ${row.fontWeight || ''}, line height ${row.lineHeight || ''}`,
      )
    })
  }

  const colors = data?.colors || {}
  const primary = colors.primary || []
  const secondary = colors.secondary || []
  const other = colors.other || []
  if (primary.length || secondary.length || other.length) {
    addH('Color palette')
    if (primary.length) addP(`Primary: ${primary.map((c) => c.hex).filter(Boolean).join(', ')}`)
    if (secondary.length) addP(`Secondary: ${secondary.map((c) => c.hex).filter(Boolean).join(', ')}`)
    if (other.length) addP(`Accent / other: ${other.map((c) => c.hex).filter(Boolean).join(', ')}`)
  }

  const style = data?.style || {}
  addH('Brand voice & personality')
  if (style.toneDescriptors?.length) addP(`Tone descriptors: ${style.toneDescriptors.join(', ')}`)
  if (style.audience?.length) addP(`Audience: ${style.audience.join(', ')}`)
  if (style.personality) addP(style.personality)
  if (style.audienceNote) addP(`Audience note: ${style.audienceNote}`)

  const phrases = style.examplePhrases || []
  if (phrases.length) {
    addH('Example phrases')
    phrases.forEach((p) => {
      addP(`We say: “${p.weSay || ''}”`)
      addP(`We don't say: “${p.weDontSay || ''}”`)
    })
  }

  const personas = style.personas || []
  if (personas.length) {
    addH('Primary audience personas')
    personas.forEach((p, i) => {
      addP(`${i + 1}. ${p.title || 'Persona'}`)
      if (p.summary) addP(p.summary)
    })
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children.length ? children : [new Paragraph({ text: 'No style data yet.' })],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const base = slugifyExportBase(brandKitName)
  saveAs(blob, `${base}-brand-guidelines.docx`)
}
