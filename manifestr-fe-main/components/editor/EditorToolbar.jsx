import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Type, 
  Plus, 
  Layout, 
  Move, 
  Wand2, 
  ArrowRight, 
  Zap, 
  Play,
  MessageSquare,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react'

export default function EditorToolbar({ activeTab = 'style', onTabChange, onAction }) {
  const tabs = [
    { id: 'ai', label: 'AI Prompter', icon: Sparkles },
    { id: 'format', label: 'Format', icon: Type },
    { id: 'insert', label: 'Insert', icon: Plus },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'arrange', label: 'Arrange', icon: Move },
    { id: 'style', label: 'Style', icon: Wand2 },
    { id: 'transitions', label: 'Transitions', icon: ArrowRight },
    { id: 'animations', label: 'Animations', icon: Zap },
    { id: 'slideshow', label: 'Slide Show', icon: Play },
  ]

  return (
    <div className="bg-[#3a3a3a] flex items-center gap-2 px-6 py-2 h-[60px]">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id)
              if (onAction) onAction(tab.id)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-[14px] font-medium transition-colors ${
              isActive
                ? 'bg-white text-[#101828] shadow-md'
                : 'text-[#d1d5dc] hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

export function CollaborationToolbar({ position = 'right' }) {
  return (
    <div
      className={`fixed ${position === 'right' ? 'right-24' : 'left-6'} top-[282px] bg-[#3a3a3a] border border-[rgba(0,0,0,0.3)] rounded-[16px] w-[50px] h-[272px] drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)]`}
    >
      {/* Badge */}
      <div className="absolute top-[12px] right-[5px] bg-[#fb2c36] rounded-[8px] size-[16px] flex items-center justify-center overflow-hidden">
        <span className="text-white text-[10px] leading-[15px] font-medium tracking-[0.1172px]">
          1
        </span>
      </div>

      {/* Top icon (comment) */}
      <button
        type="button"
        className="absolute left-[6px] top-[9px] size-[36px] rounded-[10px] flex items-center justify-center text-[#d1d5dc] hover:text-white"
        aria-label="Comments"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Separators */}
      <div className="absolute left-[12px] top-[52px] w-[24px] h-px bg-[rgba(74,85,101,0.5)]" />
      <div className="absolute left-[12px] top-[181px] w-[24px] h-px bg-[rgba(74,85,101,0.5)]" />

      {/* Middle icons */}
      <button
        type="button"
        className="absolute left-[6px] top-[59px] size-[36px] rounded-[10px] flex items-center justify-center text-[#d1d5dc] hover:text-white"
        aria-label="Share"
      >
        <Share2 className="w-5 h-5" />
      </button>
      <button
        type="button"
        className="absolute left-[6px] top-[99px] size-[36px] rounded-[10px] flex items-center justify-center text-[#d1d5dc] hover:text-white"
        aria-label="Highlights"
      >
        <Sparkles className="w-5 h-5" />
      </button>
      <button
        type="button"
        className="absolute left-[6px] top-[139px] size-[36px] rounded-[10px] flex items-center justify-center text-[#d1d5dc] hover:text-white"
        aria-label="Sync"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      {/* Zoom controls */}
      <button
        type="button"
        className="absolute left-[6px] top-[188px] size-[36px] rounded-[10px] flex items-center justify-center text-[#d1d5dc] hover:text-white"
        aria-label="Zoom in"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        type="button"
        className="absolute left-[6px] top-[228px] size-[36px] rounded-[10px] flex items-center justify-center text-[#d1d5dc] hover:text-white"
        aria-label="Zoom out"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
    </div>
  )
}

