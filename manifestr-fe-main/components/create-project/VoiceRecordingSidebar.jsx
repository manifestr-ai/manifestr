import { CheckCircle2, Circle, AlertCircle, Edit2 } from 'lucide-react'

export default function VoiceRecordingSidebar({ 
  capturedFields = {}, 
  progressCount = 0, 
  totalFields = 8,
  transcript = ''
}) {
  const fields = {
    core: [
      { id: 'documentType', label: 'Document Type', icon: CheckCircle2, captured: capturedFields.documentType },
      { id: 'documentName', label: 'Document Name', icon: CheckCircle2, captured: capturedFields.documentName },
      { id: 'projectName', label: 'Project Name', icon: CheckCircle2, captured: capturedFields.projectName },
      { id: 'websiteUrl', label: 'Website URL', icon: CheckCircle2, captured: capturedFields.websiteUrl },
      { id: 'supportingLinks', label: 'Supporting Links', icon: CheckCircle2, captured: capturedFields.supportingLinks },
      { id: 'deadlines', label: 'Deadlines', icon: AlertCircle, captured: capturedFields.deadlines, warning: true },
      { id: 'purpose', label: 'Purpose', icon: AlertCircle, captured: capturedFields.purpose, warning: true },
    ],
    strategic: [
      { id: 'keyMessage', label: 'Key Message', icon: AlertCircle, captured: capturedFields.keyMessage, warning: true },
      { id: 'audience', label: 'Audience', icon: AlertCircle, captured: capturedFields.audience, warning: true },
      { id: 'keyImpact', label: 'Key Impact', icon: AlertCircle, captured: capturedFields.keyImpact, warning: true },
    ],
  }

  const progressPercentage = (progressCount / totalFields) * 100

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

function DetailItem({ field }) {
  const IconComponent = field.captured ? CheckCircle2 : Circle
  const iconColor = field.captured 
    ? 'text-[#06b6d4]' // cyan/teal for captured
    : field.warning 
      ? 'text-[#fbbf24]' // yellow for warning
      : 'text-[#d1d5db]' // light gray for not captured

  return (
    <div className="flex items-center justify-between py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <IconComponent className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
        <span className="text-[13px] font-medium text-[#101828]">
          {field.label}
        </span>
      </div>
      <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] text-[#99a1af] hover:text-[#6b7280] transition-colors">
        <Edit2 className="w-3.5 h-3.5" />
        <span>Refine</span>
      </button>
    </div>
  )
}
