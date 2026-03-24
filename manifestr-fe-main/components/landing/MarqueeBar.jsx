const WORDS = [
  'PRESENTATION',
  'GRAPHS',
  'BUDGETS',
  'SPREADSHEETS',
  'STRATEGY',
]

function MarqueeContent() {
  return (
    <>
      {WORDS.map((word, i) => (
        <span key={i} className="flex items-center gap-[14px] shrink-0">
          <span
            className="text-[20px] md:text-[26px] leading-[42px] tracking-[0.52px] uppercase text-white"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            {word}
          </span>
          {i < WORDS.length - 1 && (
            <span className="text-[20px] md:text-[26px] text-white">-</span>
          )}
        </span>
      ))}
    </>
  )
}

export default function MarqueeBar() {
  return (
    <section className="w-full h-[56px] md:h-[67px] bg-[rgba(0,0,0,0.78)] overflow-hidden flex items-center">
      <div
        className="flex gap-[14px] whitespace-nowrap will-change-transform"
        style={{
          animation: 'marquee-left 20s linear infinite',
          width: 'max-content',
        }}
      >
        <MarqueeContent />
        <span className="text-[20px] md:text-[26px] text-white mx-[14px]">-</span>
        <MarqueeContent />
        <span className="text-[20px] md:text-[26px] text-white mx-[14px]">-</span>
        <MarqueeContent />
        <span className="text-[20px] md:text-[26px] text-white mx-[14px]">-</span>
        <MarqueeContent />
      </div>
    </section>
  )
}
