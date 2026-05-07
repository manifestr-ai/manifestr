import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, AlertCircle, Edit2, Check, X } from 'lucide-react'

export default function VoiceRecordingSidebar({
  capturedFields = {},
  fieldValues = {},
  progressCount = 0,
  totalFields = 8,
  transcript = '',
  onRefineField,
}) {
  const [editingFieldId, setEditingFieldId] = useState(null)

  const fields = {
    core: [
      { id: 'documentType', label: 'Document Type', captured: capturedFields.documentType },
      { id: 'documentName', label: 'Document Name', captured: capturedFields.documentName },
      { id: 'projectName', label: 'Project Name', captured: capturedFields.projectName },
      { id: 'websiteUrl', label: 'Website URL', captured: capturedFields.websiteUrl },
      { id: 'supportingLinks', label: 'Supporting Links', captured: capturedFields.supportingLinks },
      { id: 'deadlines', label: 'Deadlines', captured: capturedFields.deadlines, warning: true },
      { id: 'purpose', label: 'Purpose', captured: capturedFields.purpose, warning: true },
    ],
    strategic: [
      { id: 'keyMessage', label: 'Key Message', captured: capturedFields.keyMessage, warning: true },
      { id: 'audience', label: 'Audience', captured: capturedFields.audience, warning: true },
      { id: 'keyImpact', label: 'Key Impact', captured: capturedFields.keyImpact, warning: true },
    ],
  }

  const progressPercentage = (progressCount / totalFields) * 100

  const handleStartEdit = (fieldId) => setEditingFieldId(fieldId)
  const handleCancelEdit = () => setEditingFieldId(null)
  const handleSaveEdit = (fieldId, nextValue) => {
    if (typeof onRefineField === 'function') {
      onRefineField(fieldId, nextValue)
    }
    setEditingFieldId(null)
  }

  return (
    <div className="fixed left-0 top-[80px] h-[calc(100vh-80px)] w-[344px] bg-white border-r border-[#e5e7eb] overflow-y-auto z-40">
      <div className="px-6 py-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <p className="text-[11px] tracking-[0.55px] text-[#99a1af] uppercase font-normal">
            PROJECT OVERVIEW CAPTURED
          </p>
          <div>
            <h2 className="text-[16px] leading-[24px] text-[#101828] font-semibold mb-2">
              Here's what I've gathered so far
            </h2>
            <p className="text-[11px] leading-[17px] text-[#4a5565] font-normal">
              Every detail sharpens the creative edge. This summary evolves as you talk — helping MANIFESTR craft a refined, on-brand brief.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[12px] tracking-[0.5px] text-[#18181b]">
              PROGRESS
            </p>
            <p className="text-[12px] tracking-[0.55px] text-[#6a7282]">
              {progressCount} OF {totalFields}
            </p>
          </div>
          <div className="w-full h-[6px] bg-[rgba(3,2,19,0.2)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#030213] transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Core Details */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[11px] tracking-[0.5px] text-[#18181b] mb-3 font-medium uppercase">
            CORE DETAILS
          </h3>
          <div className="flex flex-col">
            {fields.core.map((field) => (
              <DetailItem
                key={field.id}
                field={field}
                value={fieldValues[field.id] || ''}
                isEditing={editingFieldId === field.id}
                onStartEdit={() => handleStartEdit(field.id)}
                onCancel={handleCancelEdit}
                onSave={(nextValue) => handleSaveEdit(field.id, nextValue)}
              />
            ))}
          </div>
        </div>

        {/* Strategic Inputs */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[11px] tracking-[0.5px] text-[#18181b] mb-3 font-medium uppercase">
            STRATEGIC INPUTS
          </h3>
          <div className="flex flex-col">
            {fields.strategic.map((field) => (
              <DetailItem
                key={field.id}
                field={field}
                value={fieldValues[field.id] || ''}
                isEditing={editingFieldId === field.id}
                onStartEdit={() => handleStartEdit(field.id)}
                onCancel={handleCancelEdit}
                onSave={(nextValue) => handleSaveEdit(field.id, nextValue)}
              />
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <div className="pt-4 mt-2">
          <p className="text-[11px] leading-[17px] text-[#99a1af] italic">
            Not everything has to be perfect right now. Consider this your creative draft in motion. We'll refine, align, and perfect it together.
          </p>
        </div>

        {/* Bottom Status */}
        <div className="text-center pt-4">
          <p className="text-[10px] tracking-[1px] text-[#d1d5dc] uppercase font-normal">
            LISTENING. INTERPRETING. REFINING.
          </p>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ field, value, isEditing, onStartEdit, onCancel, onSave }) {
  const [draft, setDraft] = useState(value || '')

  useEffect(() => {
    if (isEditing) {
      setDraft(value || '')
    }
  }, [isEditing, value])

  const hasValue = !!(value && String(value).trim())
  const isCaptured = field.captured || hasValue
  const IconComponent = isCaptured ? CheckCircle2 : (field.warning ? AlertCircle : Circle)
  const iconColor = isCaptured
    ? 'text-[#06b6d4]'
    : field.warning
      ? 'text-[#fbbf24]'
      : 'text-[#d1d5db]'

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
    } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      onSave(draft.trim())
    }
  }

  if (isEditing) {
    return (
      <div className="py-2.5 px-1">
        <div className="flex items-center gap-2 mb-2">
          <IconComponent className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
          <span className="text-[13px] font-medium text-[#101828]">
            {field.label}
          </span>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          autoFocus
          placeholder={`Add ${field.label.toLowerCase()}…`}
          className="w-full text-[13px] leading-[18px] px-2.5 py-2 bg-white border border-[#e5e7eb] rounded-md focus:outline-none focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b] resize-none"
        />
        <div className="flex items-center justify-end gap-1.5 mt-1.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[12px] text-[#6b7280] hover:bg-gray-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(draft.trim())}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[12px] text-white bg-[#18181b] hover:opacity-90 transition-opacity"
          >
            <Check className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start justify-between gap-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <IconComponent className={`w-4 h-4 ${iconColor} flex-shrink-0 mt-[2px]`} />
        <div className="min-w-0 flex-1">
          <span className="text-[13px] font-medium text-[#101828]">
            {field.label}
          </span>
          {hasValue && (
            <p className="text-[12px] leading-[16px] text-[#6b7280] mt-0.5 line-clamp-2 break-words">
              {value}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onStartEdit}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] text-[#99a1af] hover:text-[#6b7280] transition-colors flex-shrink-0"
        aria-label={`Refine ${field.label}`}
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span>Refine</span>
      </button>
    </div>
  )
}
