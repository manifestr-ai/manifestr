import { useState } from 'react'
import { Mic, FileText, Upload, Pencil, Sparkles } from 'lucide-react'

const workingStyles = [

  {
    id: 'talk-to-me',
    title: 'Talk To Me',
    subtitle: 'VERBAL THINKERS',
    description: 'Speak your ideas. MANIFESTR turns your words into clear, editable text. Perfect for quick thoughts, brainstorming, and capturing inspiration fast.',
    icon: Mic,
  },
  {
    id: 'drop-zone',
    title: 'Drop Zone',
    subtitle: 'PREP-HEAVY PERFECTIONISTS',
    description: 'Upload files or decks. MANIFESTR analyzes, refines, and rebuilds them into cohesive, presentation ready outputs.',
    icon: Upload,
  },
  {
    id: 'brief-me',
    title: 'Brief Me',
    subtitle: 'STRUCTURED PLANNERS',
    description: 'Answer a brief to build your document. Every response shapes your document step by step, seamlessly.',
    icon: Sparkles,
  },
  {
    id: 'free-style',
    title: 'Free style',
    subtitle: 'FREEFORM THINKERS',
    description: 'Start blank and flow freely. MANIFEST8 helps you shape and refine your ideas into a clean, professional finish.',
    icon: Pencil,
  },
]

function WorkingStyleCard({ style, isSelected, onClick }) {
  const Icon = style.icon

  return (
    <div
      data-style-card="true"
      onClick={onClick}
      className={`flex flex-col items-start pb-[34px] pt-[42px] px-6 rounded-[24px] h-[360px] cursor-pointer transition-all duration-200 ${isSelected
          ? 'border-2 border-[#000000] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.13)]'
          : 'border-2 border-transparent shadow-[2px_2px_15px_0px_rgba(0,0,0,0.13)] hover:shadow-[3px_3px_30px_0px_rgba(0,0,0,0.18)]'
        }`}
    >
      <div className="flex flex-col gap-8 items-center mb-[-10px] w-full">
        {/* Icon */}
        <div className="bg-black flex items-center justify-center rounded-[7.2px] size-[57.6px]">
          <Icon className="text-white size-[28.8px]" />
        </div>

        {/* Title and Subtitle */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex items-start justify-center w-full">
            <h3 className="font-hero font-bold text-[24px] leading-[32px] text-black whitespace-nowrap">
              {style.title}
            </h3>
          </div>
          <div className="flex flex-col font-normal justify-center text-[16px] text-base-muted-foreground+ text-center tracking-[0.8px] w-full">
            <p className="leading-[24px] whitespace-pre-wrap text-[#52525B]">
              {style.subtitle}
              <br aria-hidden="true" />
              <br aria-hidden="true" />
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col font-normal justify-center mb-[-10px] text-[16px] text-base-muted-foreground+ text-center w-full">
        <p className="leading-[24px] text-[#52525B]">{style.description}</p>
      </div>
    </div>
  )
}

export default function Step3({ selectedStyle, onStyleSelect }) {
  return (
    <div className="flex flex-col gap-[35px] items-center w-full max-w-[1301px] mx-auto">
      {/* Heading Section */}
      <div className="flex flex-col gap-[12px] items-center w-full">
        <div className="flex flex-col gap-[5px] items-center w-full">
          <h1 className="font-hero font-semibold text-[36px] leading-[44px] tracking-[-0.3125px] text-black text-center">
            Your working style. Your choice.
          </h1>
          <p className="font-normal text-[18px] leading-[28px] text-center text-zinc-500 tracking-[-0.4395px]">
            MANIFESTR adapts to how you think, plan, and create.
          </p>
        </div>
      </div>

      {/* Working Style Cards */}
      <div className="flex gap-5 h-[360px] items-start w-full">
        {workingStyles.map((style) => (
          <div key={style.id} className="flex-1 h-full">
            <WorkingStyleCard
              style={style}
              isSelected={selectedStyle === style.id}
              onClick={() => onStyleSelect(style.id)}
            />
          </div>
        ))}
      </div>

      {/* Footer Text */}
      <p className="font-normal text-[15px] leading-[28px] text-center text-zinc-500 tracking-[8px]">
        START ANYWHERE. SWITCH ANYTIME.
      </p>
    </div>
  )
}

