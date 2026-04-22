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
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex items-center gap-3">
      <div className="w-8 h-8 rounded-full border border-[#e4e4e7] shrink-0" />
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-[12px] leading-[18px] font-medium text-[#52525b] truncate">{name}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-[20px] leading-6 font-semibold text-[#18181b] font-sans">{users}</span>
          <span className="text-[12px] leading-[18px] font-normal text-[#71717a]">users</span>
        </div>
      </div>
    </div>
  )
}

export default function ToolUsersGrid({ data }) {
  const tools = data?.tools || DEFAULT_TOOLS
  const row1 = tools.slice(0, 4)
  const row2 = tools.slice(4, 8)

  return (
    <div className="flex flex-col gap-[18px] w-full">
      <div className="flex gap-[18px]">
        {row1.map((t) => (
          <ToolUserCard key={t.name} {...t} />
        ))}
      </div>
      {row2.length > 0 && (
        <div className="flex gap-[18px]">
          {row2.map((t) => (
            <ToolUserCard key={t.name} {...t} />
          ))}
        </div>
      )}
    </div>
  )
}
