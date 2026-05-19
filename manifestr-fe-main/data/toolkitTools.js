/**
 * Toolkit / create-project tool cards — copy from Figma (node 9978:11486+).
 * Shared so Toolkit page and Create Project step 1 stay in sync.
 */

const IMG = {
  strategist:
    'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Strageist_oghhch.png',
  briefcase:
    'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749269/Frame_2147229988_oveeki.png',
  analyser:
    'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Anaylzer_z859cm.png',
  designStudio:
    'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Design_Studio_r4wu94.png',
  wordsmith:
    'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/WordSmith_oehdl2.png',
  deck: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Deck_osyogl.png',
  huddle:
    'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749408/Frame_2147229006_zbhsvs.png',
  costCtrl:
    'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Cost_Ctrl_vveufa.png',
}

export const TOOLS_BY_ID = {
  strategist: {
    id: 'strategist',
    title: 'THE strategist',
    subtitle: 'Strategy • Positioning • Direction',
    imageSrc: IMG.strategist,
    outputType: 'presentation',
    description: {
      role: 'Your Strategy Lead',
      purpose: 'Turn complex inputs into clear strategic direction',
      useItFor: 'Planning, positioning, market entry, campaign direction',
      outputs: 'Strategy decks • Roadmaps • Messaging frameworks • Market insights',
      quickTip: 'Start with the objective. Strategy follows clarity',
    },
  },
  briefcase: {
    id: 'briefcase',
    title: 'THE briefcase',
    subtitle: 'Briefs • Templates • Documents',
    imageSrc: IMG.briefcase,
    outputType: 'document',
    description: {
      role: 'Your Project Manager',
      purpose: 'Turn ideas and inputs into structured working documents',
      useItFor: 'Project setup, Team alignment, Workflow organisation',
      outputs: 'Briefs • Scopes • Run sheets • Project Plans • Structured reports',
      quickTip: 'A strong brief saves hours later. Keep it tight and focused',
    },
  },
  analyser: {
    id: 'analyser',
    title: 'THE analyser',
    subtitle: 'Insights • Analysis • Reporting',
    imageSrc: IMG.analyser,
    outputType: 'chart',
    description: {
      role: 'Your Data Analyst',
      purpose: 'Turn raw data into clear insights and decisions',
      useItFor: 'Understanding performance, Spotting trends, making decisions',
      outputs: 'Dashboards • Charts • Trend analysis • Insight & Performance reports',
      quickTip: 'Clean data reveals the insight. Fix inputs first',
    },
  },
  'design-studio': {
    id: 'design-studio',
    title: 'DESIGN studio',
    subtitle: 'Images • Visuals • Moodboards',
    imageSrc: IMG.designStudio,
    outputType: 'image',
    description: {
      role: 'Your Creative Director',
      purpose:
        'Turn ideas into polished visual direction and assets, ready for your decks and documents.',
      useItFor: 'Creative direction, campaign visuals, brand assets',
      outputs: 'Visual concepts • Image assets • Creative directions • Moodboards',
      quickTip: 'Better references produce stronger visuals',
    },
  },
  wordsmith: {
    id: 'wordsmith',
    title: 'WORDSMITH',
    subtitle: 'Copy • Content • Messaging',
    imageSrc: IMG.wordsmith,
    outputType: 'document',
    description: {
      role: 'Your Copywriter',
      purpose: 'Turn ideas into clear, on-brand copy and content.',
      useItFor: 'Marketing copy, scripts, content creation',
      outputs: 'Copy • Messaging frameworks • Content drafts • Scripts • Captions',
      quickTip: 'Define the tone or audience before generating',
    },
  },
  deck: {
    id: 'deck',
    title: 'THE deck',
    subtitle: 'Presentations • Slides • Pitches',
    imageSrc: IMG.deck,
    outputType: 'presentation',
    description: {
      role: 'Your Presentation Specialist',
      purpose:
        'Turn ideas into structured, presentation-ready decks. Build clear narratives and slides that land',
      useItFor: 'Pitches, proposals, reports',
      outputs: 'Slide decks • Speaker notes • Pitch-ready presentations',
      quickTip: "If the message isn't clear, the slides won't be either",
    },
  },
  huddle: {
    id: 'huddle',
    title: 'THE huddle',
    subtitle: 'Agendas • Meetings • Minutes',
    imageSrc: IMG.huddle,
    outputType: 'document',
    description: {
      role: 'Your Meeting Assistant',
      purpose:
        'Turn meetings into clear outcomes and next steps. Capture conversations, structure thinking, and keep everything moving forward.',
      useItFor: 'Updates, alignment, actions',
      outputs: 'Meeting summaries • Action lists • Meeting records • Agendas',
      quickTip: 'Capture decisions, not just discussion',
    },
  },
  'cost-ctrl': {
    id: 'cost-ctrl',
    title: 'COST CTRL',
    subtitle: 'Costs • Budgets • Forecasting',
    imageSrc: IMG.costCtrl,
    outputType: 'spreadsheet',
    description: {
      role: 'Your Finance Manager',
      purpose:
        'Turn numbers into clear financial control. Build budgets, forecast spend, and track costs with confidence.',
      useItFor: 'Budget planning, cost tracking, forecasting',
      outputs: 'Budgets • Financial summaries • Forecasts • Spend tracking',
      quickTip: 'Keep inputs current to maintain accurate forecasts',
    },
  },
}

/** Toolkit page grid order (Figma row layout) */
export const TOOLKIT_PAGE_ORDER = [
  'strategist',
  'briefcase',
  'analyser',
  'design-studio',
  'wordsmith',
  'deck',
  'huddle',
  'cost-ctrl',
]

/** Create project step 1 order */
export const CREATE_PROJECT_TOOL_ORDER = [
  'strategist',
  'analyser',
  'briefcase',
  'design-studio',
  'wordsmith',
  'deck',
  'huddle',
  'cost-ctrl',
]

export function getToolsForPage(order) {
  return order.map((id) => TOOLS_BY_ID[id]).filter(Boolean)
}
