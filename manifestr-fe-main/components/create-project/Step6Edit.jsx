import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { Check } from 'lucide-react'
import Logo from '../logo/Logo'
import api from '../../lib/api'

// Mapping of API status to UI labels
const STATUS_LABELS = {
    QUEUED: 'In queue...',
    PROCESSING_INTENT: 'Analyzing your intent...',
    PROCESSING_LAYOUT: 'Designing layout...',
    PROCESSING_CONTENT: 'Drafting content...',
    CRITIQUING: 'Reviewing against best practices...',
    RENDERING: 'Finalizing document...',
    COMPLETED: 'Done!',
    FAILED: 'Something went wrong.'
}

const statusOrder = [
    'QUEUED',
    'PROCESSING_INTENT',
    'PROCESSING_LAYOUT',
    'PROCESSING_CONTENT',
    'CRITIQUING',
    'RENDERING',
    'COMPLETED'
]

export default function Step6Edit({ generationId, outputType }) {
    const router = useRouter()
    const [currentStatus, setCurrentStatus] = useState('QUEUED')
    const [progressPercent, setProgressPercent] = useState(0)
    const [currentStatusLabel, setCurrentStatusLabel] = useState('In queue...')
    const [tasks, setTasks] = useState([
        { id: 'intent', label: 'Extracting key themes ...', status: 'pending' },
        { id: 'layout', label: 'Optimizing structure...', status: 'pending' },
        { id: 'content', label: 'Refining clarity...', status: 'pending' },
        { id: 'render', label: 'Generating draft...', status: 'pending' },
    ])

    useEffect(() => {
        if (!generationId) return

        const pollStatus = async () => {
            try {
                const res = await api.get(`/ai/status/${generationId}`)
                console.log('📊 Generation Status:', res.data)

                if (res.data && res.data.status === 'success') {
                    const data = res.data.data

                    // Normalize status to UPPERCASE to match statusOrder array
                    const normalizedStatus = data.status?.toUpperCase() || 'QUEUED'
                    console.log('✅ Current Status:', normalizedStatus)
                    setCurrentStatus(normalizedStatus)

                    if (normalizedStatus === 'COMPLETED') {

                        // Redirect IMMEDIATELY based on output type
                        if (outputType === 'presentation') {
                            router.push(`/presentation-editor?id=${generationId}`)
                        } else if (outputType === 'chart') {
                            // THE analyser shows auto-generated chart visualization
                            router.push(`/chart-viewer?id=${generationId}`)
                        } else if (outputType === 'spreadsheet') {
                            // Other spreadsheet tools (COST CTRL) open spreadsheet editor
                            router.push(`/spreadsheet-editor?id=${generationId}`)
                        } else if (outputType === 'image') {
                            router.push(`/image-editor?id=${generationId}`)
                        } else {
                            router.push(`/docs-editor?id=${generationId}`)
                        }
                    }
                } else {
                    console.error('❌ API Response Error:', res.data)
                }
            } catch (e) {
                console.error('❌ Failed to fetch generation status:', e)
            }
        }

        const interval = setInterval(pollStatus, 2000)

        // Initial call
        pollStatus()

        return () => clearInterval(interval)
    }, [generationId, outputType, router])

    // Update tasks visual state based on global status
    useEffect(() => {
        // Simple logic to mark tasks as done based on current status phase
        // Map status to task completion
        const statusIndex = statusOrder.indexOf(currentStatus)

        // Calculate progress percentage based on status
        const progressMap = {
            'QUEUED': 10,
            'PROCESSING_INTENT': 25,
            'PROCESSING_LAYOUT': 40,
            'PROCESSING_CONTENT': 60,
            'CRITIQUING': 75,
            'RENDERING': 90,
            'COMPLETED': 100
        }
        setProgressPercent(progressMap[currentStatus] || 10)

        // Update status label
        setCurrentStatusLabel(STATUS_LABELS[currentStatus] || 'Processing...')

        setTasks(prev => prev.map(task => {
            let isCompleted = false
            let isCurrent = false

            if (task.id === 'intent') {
                isCompleted = statusIndex > statusOrder.indexOf('PROCESSING_INTENT')
                isCurrent = currentStatus === 'PROCESSING_INTENT'
            } else if (task.id === 'layout') {
                isCompleted = statusIndex > statusOrder.indexOf('PROCESSING_LAYOUT')
                isCurrent = currentStatus === 'PROCESSING_LAYOUT'
            } else if (task.id === 'content') {
                isCompleted = statusIndex > statusOrder.indexOf('PROCESSING_CONTENT')
                isCurrent = currentStatus === 'PROCESSING_CONTENT'
            } else if (task.id === 'render') {
                isCompleted = statusIndex >= statusOrder.indexOf('RENDERING')
                isCurrent = currentStatus === 'RENDERING' || currentStatus === 'CRITIQUING'
            }

            // Override if completed
            if (currentStatus === 'COMPLETED') isCompleted = true

            return {
                ...task,
                status: isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'
            }
        }))

    }, [currentStatus])

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[600px] py-20 -mt-12">
            <style jsx>{`
                @keyframes spin-subtle {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                
                .circle-rotating {
                    animation: spin-subtle 2s linear infinite;
                }
                
                .circle-rotating-current {
                    animation: spin-subtle 1.5s linear infinite;
                }
            `}</style>
            
            {/* Manifestr Logo - At the top */}
            <div className="flex items-center justify-center shrink-0 mb-8">
                <Logo size="md" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 max-w-[600px]">
                {/* Heading */}
                <div className="flex flex-col gap-2 items-center text-center">
                    <h1 className="text-[36px] leading-[44px] font-semibold text-base-foreground">
                        Structuring your Document
                    </h1>
                    <p className="text-[16px] leading-[24px] text-base-muted-foreground+">
                        Final Touches...
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full flex flex-col items-center gap-3">
                    <div className="w-[360px] flex items-center gap-3">
                        <div className="relative w-full h-[6px] bg-[#E5E7EB] rounded-full overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-full bg-[#18181b] rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <span className="text-[14px] leading-[20px] text-[#71717A] font-medium tabular-nums min-w-[38px] text-right">
                            {progressPercent}%
                        </span>
                    </div>
                    <p className="text-[14px] leading-[20px] text-[#71717A]">
                        {currentStatusLabel}
                    </p>
                </div>

                {/* Tasks List */}
                <div className="flex flex-col gap-2 w-[360px] mt-6">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-center gap-3 transition-all duration-300"
                        >
                            {task.status === 'completed' ? (
                                <div className="w-4 h-4 rounded-[4px] bg-[#18181b] flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                            ) : (
                                <div className={`w-4 h-4 rounded-full border shrink-0 relative ${
                                    task.status === 'current' 
                                        ? 'border-[#A1A1AA] border-t-[#18181b] border-t-2 circle-rotating-current' 
                                        : 'border-[#D4D4D8] border-t-[#71717A] circle-rotating'
                                }`}>
                                    {/* Optional: Add a subtle gradient indicator */}
                                    <div className={`absolute inset-0 rounded-full ${
                                        task.status === 'current' ? 'opacity-20' : 'opacity-0'
                                    }`} />
                                </div>
                            )}
                            <p className="text-[16px] leading-[24px] text-base-muted-foreground+">
                                {task.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
