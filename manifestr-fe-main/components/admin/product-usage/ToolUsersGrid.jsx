const DEFAULT_TOOLS = [
  { name: 'Briefcase', users: '3,200' },
  { name: 'Strategist', users: '5,800' },
  { name: 'The Deck', users: '4,100' },
  { name: 'Analyzer', users: '7,500' },
  { name: 'Design Studio', users: '2,700' },
  { name: 'Cost CTRL', users: '6,300' },
  { name: 'Wordsmith', users: '1,900' },
  { name: 'The Huddle', users: '8,200' },
]

function ToolUserCard({ name, users }) {
  return (
    <div className="min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex items-center gap-3 lg:p-[18px]">
      <div className="w-8 h-8 rounded-full border border-[#e4e4e7] shrink-0" />
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-[12px] leading-[18px] font-medium text-[#52525b] truncate">{name}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-[18px] leading-6 font-semibold text-[#18181b] font-sans sm:text-[20px]">{users}</span>
          <span className="text-[12px] leading-[18px] font-normal text-[#71717a]">users</span>
        </div>
      </div>
    </div>
  )
}

export default function ToolUsersGrid({ data }) {
  const tools = data?.tools || DEFAULT_TOOLS

  return (
    <div className="grid w-full min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-[18px]">
      {tools.map((t) => (
        <ToolUserCard key={t.name} {...t} />
      ))}
    </div>
  )
}
