/** Rich article body: Getting Started → first project (matches legacy GettingStarted copy). */
export default function FirstProjectGuideBody() {
  return (
    <div className="flex flex-col gap-[48px]">
      <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
        Welcome to MANIFESTR! This guide will walk you through creating your first project and help you understand the core concepts of our platform.
      </p>

      <div className="flex flex-col gap-[20px]">
        <h2
          className="text-[24px] leading-[32px] text-[#1b1b1f] md:text-[30px] md:leading-[38px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
        >
          {"What you'll learn"}
        </h2>
        <div className="flex flex-col gap-[12px]">
          {[
            'How to create a new project',
            'Understanding the project workspace',
            'Adding your first assets',
            'Inviting team members',
            'Basic navigation and shortcuts',
          ].map((item) => (
            <p key={item} className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[20px]">
        <h2
          className="text-[24px] leading-[32px] text-[#1b1b1f] md:text-[30px] md:leading-[38px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
        >
          Step 1: Creating Your Project
        </h2>
        <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {'To create your first project, navigate to your dashboard and click the "New Project" button in the top right corner. You\'ll be prompted to:'}
        </p>
        {[
          { term: 'Name your project:', desc: "Choose a descriptive name that reflects what you're building." },
          { term: 'Select a template:', desc: 'Choose from our pre-built templates or start from scratch.' },
          { term: 'Choose privacy settings:', desc: 'Decide whether your project will be private or shared with your team.' },
        ].map((item) => (
          <p key={item.term} className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="font-semibold text-[#1b1b1f]">{item.term} </span>
            {item.desc}
          </p>
        ))}
      </div>

      <div className="border-l-4 border-[#09090b] bg-[#f4f4f4] py-[19px] pl-[32px]">
        <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span className="font-semibold text-[#1b1b1f]">Pro tip: </span>
          Use descriptive naming conventions from the start. This will help you and your team stay organized as your projects grow.
        </p>
      </div>

      <div className="flex flex-col gap-[20px]">
        <h2
          className="text-[24px] leading-[32px] text-[#1b1b1f] md:text-[30px] md:leading-[38px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
        >
          Step 2: Understanding Your Workspace
        </h2>
        <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {"Once your project is created, you'll see the main workspace interface. Let's break down the key areas:"}
        </p>
        {[
          { term: 'Toolbar:', desc: 'Quick access to essential Toolkit and actions' },
          { term: 'Canvas:', desc: 'Your main working area for designs and assets' },
          { term: 'Properties Panel:', desc: 'Adjust settings and properties for selected items' },
          { term: 'Asset Library:', desc: 'Browse and manage your project files' },
        ].map((item) => (
          <p key={item.term} className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="font-semibold text-[#1b1b1f]">{item.term} </span>
            {item.desc}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-[20px]">
        <h2
          className="text-[24px] leading-[32px] text-[#1b1b1f] md:text-[30px] md:leading-[38px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
        >
          Step 3: Adding Your First Assets
        </h2>
        <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
          You can add assets to your project in several ways:
        </p>
        <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#71717a] flex flex-col gap-[8px]">
          {[
            'Drag and drop files directly onto the canvas',
            'Use the "Upload" button in the toolbar',
            'Import from cloud storage services',
            'Create new designs using our built-in Toolkit',
          ].map((item) => (
            <li key={item} style={{ fontFamily: 'Inter, sans-serif' }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-[20px]">
        <h2
          className="text-[24px] leading-[32px] text-[#1b1b1f] md:text-[30px] md:leading-[38px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
        >
          Next Steps
        </h2>
        <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Congratulations on creating your first project! Here are some recommended next steps:
        </p>
        <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#71717a] flex flex-col gap-[8px]">
          {[
            'Explore our design templates',
            'Invite your team members',
            'Set up your design system',
            'Learn about keyboard shortcuts',
          ].map((item) => (
            <li key={item} style={{ fontFamily: 'Inter, sans-serif' }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function GenericKbArticleBody({ categoryTitle, articleTitle }) {
  return (
    <div className="flex flex-col gap-[24px]">
      <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
        {`This guide is part of our ${categoryTitle} collection. "${articleTitle}" — expanded documentation is coming soon.`}
      </p>
      <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
        Browse other articles in the sidebar, return to the{' '}
        <span className="font-medium text-[#1b1b1f]">Knowledge Base</span> home, or contact support if you need help right away.
      </p>
    </div>
  )
}

export { GenericKbArticleBody }
