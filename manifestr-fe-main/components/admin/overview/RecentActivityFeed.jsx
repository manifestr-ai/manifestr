import { UserPlus, LogIn, CreditCard, ArrowUpRight, AlertCircle } from 'lucide-react'

const ICON_MAP = {
  signup: UserPlus,
  login: LogIn,
  payment: CreditCard,
  upgrade: ArrowUpRight,
  alert: AlertCircle,
}

const TYPE_STYLES = {
  signup: 'bg-[#f0fdf4] text-[#166534]',
  login: 'bg-[#eff6ff] text-[#1d4ed8]',
  payment: 'bg-[#fefce8] text-[#854d0e]',
  upgrade: 'bg-[#18181b] text-white',
  alert: 'bg-[#fef2f2] text-[#991b1b]',
}

function EventRow({ event }) {
  const Icon = ICON_MAP[event?.type] || LogIn
  const iconStyle = TYPE_STYLES[event?.type] || TYPE_STYLES.login

  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#f4f4f5] last:border-b-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconStyle}`}>
        <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-5 font-medium text-[#18181b] truncate">
          {event?.actor}
        </p>
        <p className="text-[12px] leading-[18px] text-[#71717a]">{event?.description}</p>
      </div>
      <span className="text-[11px] leading-4 text-[#a1a1aa] shrink-0 pt-0.5">{event?.time}</span>
    </div>
  )
}

export default function RecentActivityFeed({ data }) {
  const title = data?.title || 'Recent Activity'
  const events = data?.events || []
  const visibleEvents = events.slice(0, 4)

  return (
    <div className="w-full lg:flex-1 min-w-0 bg-[#f4f4f4] border border-[#e9eaea] rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.05)] p-4 lg:p-[18px] flex flex-col gap-4">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="flex flex-col">
        {visibleEvents.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
