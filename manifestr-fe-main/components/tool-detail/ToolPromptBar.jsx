import Link from 'next/link'
import { Wand2, PenLine, Upload, Mic, ArrowUpRight } from 'lucide-react'

export default function ToolPromptBar({ tool }) {
  return (
    <section className="w-full bg-white py-[48px] md:py-[64px]">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="border border-[#e4e4e7] rounded-[12px] p-[20px] md:p-[24px]">
          <p
            className="text-[11px] md:text-[12px] leading-[18px] font-medium text-[#71717a] uppercase tracking-wider mb-[12px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {tool.inputPlaceholder}
          </p>
          <div className="w-full h-px bg-[#e4e4e7] mb-[16px]" />
          <div className="flex items-center gap-[16px]">
            <Wand2 className="w-[20px] h-[20px] text-[#71717a] shrink-0" />
            <PenLine className="w-[20px] h-[20px] text-[#71717a] shrink-0" />
            <Upload className="w-[20px] h-[20px] text-[#71717a] shrink-0" />
            <Mic className="w-[20px] h-[20px] text-[#71717a] shrink-0" />
            <div className="flex-1" />
            <Link
              href="/signup"
              className="inline-flex items-center gap-[8px] h-[36px] px-[16px] bg-[#18181b] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors shrink-0"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Start Now <ArrowUpRight className="w-[14px] h-[14px]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
