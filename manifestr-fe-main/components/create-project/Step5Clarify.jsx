import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight, Pencil, CheckCircle2, Check, X } from 'lucide-react'

export default function Step5Clarify({ onSkip, projectData, updateProjectData, selectedTool }) {
    const [expandedSections, setExpandedSections] = useState({
        documentOverview: true,
        purposeObjectives: true,
        keyMessage: true,
        audienceImpact: true,
        kpisSuccess: true,
        structureOutput: true,
        requirementsConstraints: true,
        evidenceBenchmarks: true,
        deliverablesTimeline: true,
    })

    const [sensitiveContent, setSensitiveContent] = useState(false)
    const [editingField, setEditingField] = useState(null)

    const [tempValue, setTempValue] = useState("")

    const data = projectData || {}

    const fieldToSection = {
        documentName: 'documentOverview',
        projectBrandName: 'documentOverview',
        websiteUrl: 'documentOverview',
        primaryObjective: 'purposeObjectives',
        keyMessage: 'keyMessage',
        primaryAudience: 'audienceImpact',
        think: 'audienceImpact',
        feel: 'audienceImpact',
        do: 'audienceImpact',
        successDefinition: 'kpisSuccess',
        structure: 'structureOutput',
        tone: 'structureOutput',
        dependencies: 'evidenceBenchmarks',
        approvers: 'evidenceBenchmarks',
        deliverables: 'deliverablesTimeline',
        timeline: 'deliverablesTimeline',
        budget: 'deliverablesTimeline',
    }

    const editingContainerRef = useRef(null)

    useEffect(() => {
        if (!editingField) return
        const onDocClick = (e) => {
            if (editingContainerRef.current && editingContainerRef.current.contains(e.target)) return
            const current = editingField
            const sectionKey = fieldToSection[current]
            handleSave(current)
            if (sectionKey) {
                setExpandedSections((prev) => ({ ...prev, [sectionKey]: false }))
            }
        }
        document.addEventListener('mousedown', onDocClick)
        return () => document.removeEventListener('mousedown', onDocClick)
    }, [editingField, tempValue])

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }))
    }

    const handleEdit = (fieldKey, currentValue) => {
        setEditingField(fieldKey)
        setTempValue(currentValue || "")
    }

    const handleSave = (fieldKey) => {
        if (updateProjectData) {
            updateProjectData({ [fieldKey]: tempValue })
        }
        setEditingField(null)
    }

    const handleCancel = () => {
        setEditingField(null)
        setTempValue("")
    }

    const EditableField = ({ label, fieldKey, value, placeholder = "Not specified" }) => {
        const isEditing = editingField === fieldKey
        const currentValue = value || ""
        const displayValue = currentValue || placeholder

        return (
            <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                ref={isEditing ? editingContainerRef : null}
                data-editing-field={isEditing ? 'true' : undefined}
                className="flex items-center justify-between px-4 py-4 bg-white border border-[#e4e4e7] rounded-lg hover:shadow-md transition-all duration-200 group"
            >
                {!isEditing ? (
                    <>
                        <div
                            className="flex flex-col gap-1 flex-1 cursor-pointer"
                            onClick={() => handleEdit(fieldKey, currentValue)}
                        >
                            <p className="text-[14px] leading-[20px] text-base-muted-foreground+">
                                {label}
                            </p>
                            <p className={`text-[14px] leading-[24px] font-medium ${currentValue ? 'text-base-foreground' : 'text-base-muted-foreground'
                                }`}>
                                {displayValue}
                            </p>
                        </div>
                        <button
                            onClick={() => handleEdit(fieldKey, currentValue)}
                            className="ml-4 p-2 hover:bg-base-muted rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                            <Pencil className="w-4 h-4 text-base-muted-foreground" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col gap-3 flex-1">
                        <div className="flex flex-col gap-1">
                            <p className="text-[14px] leading-[20px] text-base-muted-foreground+">
                                {label}
                            </p>
                            <input
                                type="text"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="text-[14px] leading-[24px] font-medium text-base-foreground px-3 py-2 border border-[#e4e4e7] rounded-md focus:outline-none focus:ring-2 focus:ring-base-secondary focus:border-transparent"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => handleSave(fieldKey)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18181b] text-white rounded-md hover:opacity-90 transition-opacity text-[12px] leading-[18px] font-medium cursor-pointer"
                            >
                                <Check className="w-3.5 h-3.5" />
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e4e4e7] text-base-foreground rounded-md hover:bg-base-muted transition-colors text-[12px] leading-[18px] font-medium cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        )
    }

    const CollapsibleSection = ({
        title,
        subtitle,
        sectionKey,
        children,
        defaultExpanded = true
    }) => {
        const isExpanded = expandedSections[sectionKey] ?? defaultExpanded

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#e4e4e7] rounded-lg overflow-hidden"
            >
                {/* Header */}
                <motion.button
                    whileHover={{ backgroundColor: '#e4e4e7' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full flex items-center justify-between px-6 py-6 bg-[#f4f4f5] transition-colors cursor-pointer"
                >
                    <div className="flex flex-col gap-1 items-start text-left">
                        <h3 className="text-[18px] leading-[30px] font-medium text-base-foreground">
                            {title}
                        </h3>
                        <p className="text-[14px] leading-[24px] text-base-muted-foreground+">
                            {subtitle}
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-6 h-6 text-base-foreground shrink-0" />
                    </motion.div>
                </motion.button>

                {/* Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 pb-6">
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        )
    }

    const toolTitle = selectedTool?.title || 'Project'

    return (
        <div className="w-full max-w-[1268px] mx-auto px-10 py-10">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-10">
                <div className="flex flex-col gap-2 flex-1">
                    <h1 className="text-[28px] leading-[36px] font-semibold text-base-foreground">
                        Review & Approve Your Summary
                    </h1>
                    <p className="text-[16px] leading-[24px] text-[#71717A] text-base-muted-foreground+ max-w-[935px]">
                        Your brief has been captured. Review the essentials, refine if needed, and confirm when you're ready for MANIFESTR to generate your document.
                    </p>
                </div>
                <button
                    onClick={onSkip}
                    className="
                        w-[321px]
                        h-[35px]
                        rounded-[6px]
                        border border-[#D1D5DC]
                        bg-white
                        shadow-[0_1px_4px_0_#EEE]
                        flex items-center gap-2
                        transition-opacity
                        hover:opacity-90
                        whitespace-nowrap
                        cursor-pointer
                        px-2
                    "
                >
                    <span
                        style={{
                            width: "276px",
                            height: "11px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            color: "#000",
                            fontFamily: "Inter",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "27px"
                        }}
                    >
                        Confident it's all correct? Skip this review
                    </span>
               
                    <ArrowRight className="w-4 h-4 mr-2 text-[#18181b]" />
                </button>
           
            </div>

            {/* Executive Summary Box */}
            <div className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-lg p-4 mb-6">
                <div className="flex gap-3 items-start">
                    <div className="relative shrink-0 pt-0.5">
                        <div className="w-5 h-5 rounded-full bg-base-secondary flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-base-secondary -mt-0.5" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <p className="text-[14px] leading-[20px] font-medium text-base-foreground">
                            Executive Summary
                        </p>
                        <p className="text-[14px] leading-[20px] text-base-muted-foreground+">
                            {data.documentName ? `${data.documentName} for ${data.projectBrandName || 'unnamed project'}` : `New ${toolTitle} Project`}
                            {data.primaryAudience && ` targeting ${data.primaryAudience}`}.
                            {data.primaryObjective && ` Objective: ${data.primaryObjective}.`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Collapsible Sections */}
            <div className="flex flex-col gap-6">
                {/* Document Overview */}
                <CollapsibleSection
                    title="Document Overview"
                    subtitle="Core identifiers and links"
                    sectionKey="documentOverview"
                >
                    <div style={{ height: '20px' }} />
                    <div className="flex flex-col gap-3">
                        <EditableField
                            label="Document Name"
                            fieldKey="documentName"
                            value={data.documentName}
                        />
                        <EditableField
                            label="Project / Brand Name"
                            fieldKey="projectBrandName"
                            value={data.projectBrandName}
                        />
                        <EditableField
                            label="Website / URL"
                            fieldKey="websiteUrl"
                            value={data.websiteUrl}
                        />
                    </div>
                </CollapsibleSection>

                {/* Purpose & Objectives */}
                <CollapsibleSection
                    title="Purpose & Objectives"
                    subtitle="Why this document exists"
                    sectionKey="purposeObjectives"
                >
                    <div style={{ height: '20px' }} />
                    <EditableField
                        label="Primary Objective"
                        fieldKey="primaryObjective"
                        value={data.primaryObjective}
                    />
                </CollapsibleSection>

                {/* Key Message */}
                <CollapsibleSection
                    title="Key Message"
                    subtitle="What must land clearly?"
                    sectionKey="keyMessage"
                >
                    <div style={{ height: '20px' }} />
                    <EditableField
                        label="Key Message"
                        fieldKey="keyMessage"
                        value={data.keyMessage}
                    />
                </CollapsibleSection>

                {/* Audience & Impact */}
                <CollapsibleSection
                    title="Audience & Impact"
                    subtitle="Who is this for, and what should they think/feel/do?"
                    sectionKey="audienceImpact"
                >
                    <div style={{ height: '20px' }} />
                    <div className="flex flex-col gap-3">
                        <EditableField
                            label="Primary Audience"
                            fieldKey="primaryAudience"
                            value={data.primaryAudience}
                        />
                        <div className="grid grid-cols-3 gap-3">
                            <EditableField
                                label="Think"
                                fieldKey="think"
                                value={data.think}
                            />
                            <EditableField
                                label="Feel"
                                fieldKey="feel"
                                value={data.feel}
                            />
                            <EditableField
                                label="Do"
                                fieldKey="do"
                                value={data.do}
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* KPIs & Success */}
                <CollapsibleSection
                    title="KPIs & Success"
                    subtitle="How will we measure impact?"
                    sectionKey="kpisSuccess"
                >
                    <div style={{ height: '20px' }} />
                    <EditableField
                        label="Success Definition"
                        fieldKey="successDefinition"
                        value={data.successDefinition}
                    />
                </CollapsibleSection>

                {/* Structure & Output Preferences */}
                <CollapsibleSection
                    title="Structure & Output Preferences"
                    subtitle="Format and depth"
                    sectionKey="structureOutput"
                >
                    <div style={{ height: '20px' }} />
                    <EditableField
                        label="Structure"
                        fieldKey="structure"
                        value={data.structure}
                    />
                    <EditableField
                        label="Tone"
                        fieldKey="tone"
                        value={data.tone}
                    />
                </CollapsibleSection>

                {/* Requirements & Constraints */}
                <CollapsibleSection
                    title="Requirements & Constraints"
                    subtitle="Guardrails & sensitivity"
                    sectionKey="requirementsConstraints"
                >
                    <div style={{ height: '20px' }} />
                    <div className="flex items-center justify-between px-4 py-4 bg-white border border-[#e4e4e7] rounded-lg">
                        <div className="flex flex-col gap-1 flex-1">
                            <p className="text-[14px] leading-[20px] text-base-muted-foreground+">
                                Confidentiality / Sensitivity
                            </p>
                            <p className="text-[14px] leading-[24px] text-base-foreground font-medium">
                                Toggle if sensitive content or restricted distribution applies.
                            </p>
                        </div>
                        <button
                            onClick={() => setSensitiveContent(!sensitiveContent)}
                            className={`ml-4 flex items-center rounded-full w-11 h-6 transition-colors cursor-pointer ${sensitiveContent ? 'bg-[#18181B]' : 'bg-[#F4F4F5]'
                                }`}
                        >
                            <div
                                className={`bg-white rounded-full w-5 h-5 shadow-sm transition-transform ${sensitiveContent ? 'translate-x-5' : 'translate-x-0.5'
                                    }`}
                            />
                        </button>
                    </div>
                </CollapsibleSection>

                {/* Evidence & Benchmarks */}
                <CollapsibleSection
                    title="Evidence & Benchmarks"
                    subtitle="Should we include competitor benchmarks?"
                    sectionKey="evidenceBenchmarks"
                >
                    <div style={{ height: '20px' }} />
                    <EditableField
                        label="Dependencies"
                        fieldKey="dependencies"
                        value={data.dependencies}
                    />
                    <EditableField
                        label="Approvers"
                        fieldKey="approvers"
                        value={data.approvers}
                    />
                </CollapsibleSection>

                {/* Deliverables • Timeline • Budget */}
                <CollapsibleSection
                    title="Deliverables • Timeline • Budget"
                    subtitle="What we'll hand over & when"
                    sectionKey="deliverablesTimeline"
                >
                    <div style={{ height: '20px' }} />
                    <EditableField
                        label="Deliverables"
                        fieldKey="deliverables"
                        value={data.deliverables}
                    />
                    <EditableField
                        label="Timeline"
                        fieldKey="timeline"
                        value={data.timeline}
                    />
                    <EditableField
                        label="Budget"
                        fieldKey="budget"
                        value={data.budget}
                    />
                </CollapsibleSection>
            </div>
        </div>
    )
}
