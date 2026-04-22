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
            <div className="flex flex-col gap-2 mb-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="244" height="28" viewBox="0 0 244 28" fill="none">
                    <path d="M175.601 14.5991C174.972 14.0068 174.281 13.4852 173.538 13.0436C172.757 12.5769 171.941 12.1725 171.097 11.8342C170.243 11.4913 169.389 11.1549 168.535 10.8311C167.681 10.5073 166.869 10.1644 166.094 9.80256C165.371 9.47082 164.679 9.07453 164.028 8.61851C163.441 8.2089 162.954 7.6744 162.599 7.05353C162.14 6.22538 161.974 5.26675 162.127 4.33248C162.28 3.39821 162.744 2.54288 163.443 1.90465C164.413 1.02573 165.688 0.562862 166.996 0.615849C167.86 0.612503 168.716 0.775231 169.519 1.09518C170.356 1.44096 171.123 1.93813 171.779 2.56176C172.572 3.32695 173.224 4.22514 173.706 5.21555C174.319 6.44497 174.779 7.7444 175.078 9.08514H175.573V0.0381075H174.62C174.474 0.761871 174.068 0.923765 173.287 0.923765C172.467 0.828233 171.655 0.677638 170.856 0.473C169.642 0.190473 168.401 0.0393487 167.154 0.0222358C166.072 0.020301 164.994 0.16119 163.948 0.441256C162.942 0.709536 161.98 1.12113 161.091 1.6634C160.232 2.18992 159.514 2.91635 158.996 3.78072C158.462 4.67306 158.187 5.69639 158.202 6.73609C158.192 7.63019 158.375 8.51598 158.739 9.33275C159.074 10.0907 159.56 10.7723 160.167 11.3358C160.799 11.9085 161.487 12.4158 162.221 12.85C163.009 13.3228 163.829 13.7407 164.675 14.1007C165.536 14.4689 166.397 14.8276 167.256 15.1768C168.116 15.526 168.932 15.9006 169.706 16.2942C170.428 16.6554 171.115 17.0803 171.76 17.564C172.343 18.001 172.829 18.5531 173.189 19.1861C173.552 19.8274 173.737 20.5539 173.725 21.2907C173.737 22.0062 173.596 22.7161 173.312 23.3729C173.028 24.0297 172.607 24.6185 172.078 25.1C170.979 26.1412 169.57 26.6629 167.849 26.665C166.72 26.6892 165.599 26.4736 164.559 26.0326C163.52 25.5916 162.585 24.9351 161.818 24.1064C160.195 22.4134 159.137 20.0855 158.644 17.1227H158.066V27.2808H158.701C158.806 26.9096 159.019 26.578 159.314 26.3285C159.581 26.131 159.905 26.0262 160.237 26.0301C160.734 26.0658 161.222 26.1727 161.688 26.3475C162.505 26.6071 163.336 26.8191 164.177 26.9824C165.364 27.2062 166.571 27.3125 167.78 27.2998C169.174 27.3142 170.561 27.092 171.881 26.6427C173.016 26.2678 174.068 25.6747 174.976 24.8968C175.765 24.2084 176.412 23.3728 176.881 22.4367C177.319 21.5593 177.55 20.5924 177.554 19.6115C177.567 18.6423 177.389 17.68 177.03 16.7799C176.715 15.9591 176.228 15.2154 175.601 14.5991Z" fill="#18181B" />
                    <path d="M231.614 25.3064C231.506 25.4735 231.358 25.6115 231.185 25.7083C231.011 25.8052 230.816 25.8579 230.617 25.8619C229.586 25.8619 229.013 24.389 228.896 21.4431C228.871 20.2212 228.719 19.0052 228.442 17.8148C228.212 16.8682 227.798 15.9762 227.223 15.1896C226.642 14.4146 225.856 13.8175 224.954 13.4659C223.82 13.0413 222.624 12.8043 221.414 12.7643C224.083 12.3644 226.093 11.593 227.446 10.4502C228.798 9.30741 229.472 7.93925 229.468 6.3457C229.468 4.26964 228.713 2.69302 227.204 1.61585C225.754 0.577817 223.446 0.054041 220.322 0.0286459V0.0127735H207.726V0.539724C208.996 0.577816 209.894 0.749234 210.421 1.05398C210.682 1.20516 210.896 1.42676 211.036 1.69342C211.177 1.96008 211.24 2.26103 211.218 2.56182V24.6874C211.218 25.9317 210.054 26.6068 207.726 26.7126V27.2364H220.545V26.6872C218.852 26.6089 217.688 26.3814 217.053 26.0048C216.761 25.856 216.517 25.6284 216.349 25.3477C216.181 25.0671 216.094 24.7448 216.1 24.4176V13.0786L218.005 13.1548C220.183 13.2352 221.703 13.7992 222.567 14.8467C223.43 15.8943 223.933 17.6265 224.074 20.0432C224.231 22.9362 224.654 24.9149 225.344 25.9794C226.034 27.0438 227.266 27.5729 229.039 27.5666C229.498 27.5863 229.955 27.5119 230.384 27.3482C230.812 27.1844 231.203 26.9346 231.531 26.6142C232.166 25.9794 232.637 24.9286 232.944 23.4621L232.401 23.3827C232.262 24.0678 231.995 24.7204 231.614 25.3064ZM216.078 12.1834V2.43484C216.078 1.68357 216.272 1.13545 216.659 0.790501C217.046 0.44555 217.666 0.274132 218.519 0.276249H219.043C220.833 0.276249 222.158 0.736537 223.017 1.65711C223.877 2.57769 224.3 4.10881 224.287 6.25047C224.287 10.2312 222.308 12.2226 218.351 12.2247C217.339 12.2247 216.582 12.2109 216.078 12.1834Z" fill="#18181B" />
                    <path d="M243.178 22.4018C242.923 22.1328 242.616 21.9195 242.275 21.7752C241.934 21.631 241.567 21.559 241.197 21.5637C240.453 21.5791 239.744 21.8812 239.217 22.4071C238.691 22.933 238.388 23.6418 238.372 24.3858C238.368 24.7608 238.44 25.1326 238.585 25.4786C238.73 25.8246 238.943 26.1375 239.213 26.3983C239.468 26.6682 239.775 26.8827 240.117 27.0285C240.458 27.1743 240.826 27.2483 241.197 27.2459C241.568 27.2504 241.936 27.1773 242.277 27.0313C242.618 26.8854 242.925 26.6698 243.178 26.3983C243.442 26.1348 243.651 25.821 243.793 25.4753C243.934 25.1296 244.004 24.7591 244 24.3858C244.003 24.0167 243.933 23.6508 243.791 23.3098C243.65 22.9689 243.441 22.66 243.178 22.4018Z" fill="#18181B" />
                    <path d="M13.615 17.6052L2.37128 0H0V27.2459H3.40296V7.68522L12.5421 21.9986H14.6879L23.827 7.68522V27.2459H27.2268V0H24.8555L13.615 17.6052Z" fill="#18181B" />
                    <path d="M77.7221 13.7896L71.5034 20.9923V0H68.1068V27.2459H70.4305L70.7003 26.9284L70.7035 26.9316L88.5246 6.29166V27.2459H91.918V0H89.5975L77.7221 13.7896Z" fill="#18181B" />
                    <path d="M102.161 0.0061085H98.7553V27.2329H102.161V0.0061085Z" fill="#18181B" />
                    <path d="M46.5463 0L33.982 27.2459H37.4834L47.6637 5.22189L57.844 27.2459H61.3454L48.7811 0H46.5463Z" fill="#18181B" />
                    <path d="M108.942 0.0222161V0.692015H109.825C110.429 0.721755 111.02 0.877454 111.561 1.14913C111.814 1.30622 112.019 1.53005 112.154 1.79604C112.288 2.06203 112.347 2.3599 112.323 2.65697V24.8778C112.323 26.0713 111.196 26.72 108.942 26.8237V27.2681H121.383V26.8237C120.476 26.8064 119.574 26.6817 118.697 26.4523C118.198 26.3458 117.741 26.0952 117.383 25.7317C117.148 25.4184 117.03 25.0338 117.046 24.6429V13.6086C117.767 13.6086 118.776 13.6086 119.186 13.6086C119.503 13.6086 119.821 13.5928 120.157 13.6086C123.524 13.6086 125.284 15.1958 125.436 18.3702H125.979V8.1582H125.446C125.425 8.85942 125.292 9.55278 125.052 10.212C124.866 10.7294 124.581 11.2058 124.214 11.6151C123.872 11.9779 123.461 12.2683 123.005 12.469C122.542 12.683 122.051 12.8326 121.548 12.9135C121.003 12.9944 120.454 13.0336 119.903 13.0309C119.665 13.0309 119.434 13.0309 119.195 13.0309C118.729 13.0309 117.7 13.0468 117.056 13.0309V2.80616C117.056 2.05277 117.3 1.51524 117.789 1.19357C118.278 0.871897 119.21 0.708944 120.586 0.704712H121.564C123.428 0.704712 124.955 1.2433 126.144 2.32048C127.334 3.39766 128.28 5.3023 128.982 8.0344L129.433 7.95821V0.0222161H108.942Z" fill="#18181B" />
                    <path d="M180.484 0.0222161V7.71061L180.992 7.7868C181.798 5.15839 182.75 3.32888 183.849 2.29826C184.947 1.26764 186.592 0.752328 188.785 0.752328H189.937V24.6397C189.937 25.3783 189.689 25.9073 189.194 26.2269C188.699 26.5443 187.826 26.7284 186.575 26.7919V27.2586H191.654C192.194 27.2586 192.737 27.2586 193.28 27.2586H198.359V26.7919C197.055 26.7136 196.149 26.4967 195.641 26.1412C195.134 25.7856 194.88 25.2058 194.88 24.4016V0.752328H196.299C197.237 0.732951 198.172 0.857129 199.073 1.12056C199.845 1.36934 200.546 1.79929 201.117 2.37445C201.737 3.00509 202.248 3.73461 202.628 4.53304C203.124 5.58337 203.536 6.67136 203.86 7.7868L204.33 7.71061V0.0222161H180.484ZM180.903 4.40289V4.27909C180.912 4.32035 180.909 4.36162 180.903 4.40289ZM203.958 4.80604V4.8854C203.957 4.85897 203.957 4.83247 203.958 4.80604Z" fill="#18181B" />
                    <path d="M132.741 0.0222161V0.625352C134.01 0.663445 134.91 0.833804 135.439 1.13643C135.696 1.28947 135.906 1.51147 136.044 1.77735C136.182 2.04324 136.243 2.34242 136.22 2.6411V24.7317C136.242 25.026 136.181 25.3206 136.043 25.5814C135.905 25.8421 135.695 26.0583 135.439 26.2047C134.916 26.5031 134.017 26.6713 132.741 26.7094V27.2332H151.136C151.327 27.2332 151.524 27.2332 151.717 27.2332H153.304V18.2083H153.196L152.831 18.1766C152.524 19.4234 152.134 20.6482 151.663 21.843C151.335 22.7008 150.909 23.5178 150.393 24.2778C149.974 24.8726 149.433 25.3714 148.806 25.7412C148.233 26.0807 147.606 26.3201 146.952 26.4491C146.189 26.5812 145.416 26.6428 144.641 26.6332H144.556C143.308 26.6332 142.413 26.4681 141.88 26.138C141.616 25.9756 141.402 25.7442 141.261 25.469C141.119 25.1937 141.055 24.885 141.077 24.5762V13.6372H142.204C142.715 13.6372 143.273 13.6372 143.934 13.6372C147.4 13.6372 149.21 15.1948 149.365 18.3099H149.87V8.24391H149.365C149.342 9.0712 149.152 9.88528 148.806 10.6374C148.523 11.2454 148.07 11.7581 147.502 12.1135C146.962 12.4378 146.373 12.6736 145.759 12.8119C145.07 12.9539 144.367 13.022 143.664 13.015C143.165 13.0341 142.686 13.015 142.204 13.015H141.077V2.79982C141.055 2.48747 141.119 2.17515 141.26 1.8958C141.401 1.61645 141.615 1.38042 141.88 1.21262C142.324 0.933269 143.032 0.774549 143.972 0.730107V0.707886H144.924C145.843 0.696117 146.759 0.802809 147.651 1.02533C148.427 1.2411 149.151 1.61383 149.778 2.12049C150.515 2.72734 151.116 3.48359 151.539 4.3394C152.113 5.51509 152.563 6.74697 152.882 8.01535L153.327 7.93917V0.0222161H132.741Z" fill="#18181B" />
                </svg>
                <div className="text-b1-medium text-[#52525B]" style={{ fontFamily: 'Inter' }}>
                    Clarification &bull; Reverse Brief
                </div>
            </div>
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
                        bg-black
                        flex items-center gap-2
                        transition-opacity
                        hover:opacity-90
                        whitespace-nowrap
                        cursor-pointer
                        px-4
                    "
                >
                    <span
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            color: "#FFF",
                            fontFamily: "Inter",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "27px",
                            flex: 1
                        }}
                    >
                        Confident it's all correct? Skip this review
                    </span>
                    <ArrowRight className="w-4 h-4 text-white shrink-0" />
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
