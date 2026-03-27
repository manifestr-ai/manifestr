import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { Loader2, Check } from 'lucide-react'
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
    const [tasks, setTasks] = useState([
        { id: 'intent', label: 'Analyzing Intent', status: 'pending' },
        { id: 'layout', label: 'Structuring Layout', status: 'pending' },
        { id: 'content', label: 'Drafting Content', status: 'pending' },
        { id: 'render', label: 'Finalizing Output', status: 'pending' },
    ])

    useEffect(() => {
        if (!generationId) return

        const pollStatus = async () => {
            try {
                const res = await api.get(`/ai/status/${generationId}`)

                if (res.data && res.data.status === 'success') {
                    const data = res.data.data

                    // Normalize status to UPPERCASE to match statusOrder array
                    const normalizedStatus = data.status?.toUpperCase() || 'QUEUED'
                    setCurrentStatus(normalizedStatus)

                    if (normalizedStatus === 'COMPLETED') {

                        // Redirect IMMEDIATELY based on output type
                        if (outputType === 'presentation') {
                            router.push(`/presentation-editor?id=${generationId}`)
                        } else if (outputType === 'spreadsheet') {
                            router.push(`/spreadsheet-editor?id=${generationId}`)
                        } else if (outputType === 'image') {
                            router.push(`/image-editor?id=${generationId}`)
                        } else {
                            router.push(`/docs-editor?id=${generationId}`)
                        }
                    }
                }
            } catch (e) {
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
            {/* Manifestr Logo - At the top */}
            <div className="flex items-center justify-center shrink-0 mb-8">
                <Logo size="md" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 max-w-[600px]">
                {/* Heading */}
                <div className="flex flex-col gap-2 items-center text-center">
                    <h1 className="text-[36px] leading-[44px] font-semibold text-base-foreground">
                        Manifesting Your Vision
                    </h1>
                    <p className="text-[16px] leading-[24px] text-base-muted-foreground+">
                        {STATUS_LABELS[currentStatus] || 'Processing...'}
                    </p>
                </div>

                {/* Tasks List */}
                <div className="flex flex-col gap-2 w-full mt-8 min-w-[400px]">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-center gap-3 transition-all duration-300"
                        >
                            {task.status === 'completed' ? (
                                <div className="w-5 h-5 rounded-full bg-[#18181b] flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            ) : task.status === 'current' ? (
                                <Loader2 className="w-5 h-5 text-base-secondary animate-spin shrink-0" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border border-base-border shrink-0" />
                            )}
                            <p className={`text-[14px] leading-[20px] transition-colors duration-300 ${task.status === 'completed' || task.status === 'current'
                                ? 'text-base-foreground font-medium'
                                : 'text-base-muted-foreground'
                                }`}>
                                {task.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
