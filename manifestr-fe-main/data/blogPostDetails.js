/**
 * Blog article content keyed by URL slug. Used by `pages/blog/[slug].js` and
 * should stay aligned with `BlogHero` / index card slugs.
 */

const SUIT_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029368/men-suit-analyzing-results-chart_4_mgr4hr.png'
const PLACEHOLDER_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029367/beautiful-beach-sunrise-blue-sky_1_gzozft.png'
const BRANDING_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029366/Placeholder_Image_1_ydy8yg.png'
const DESK_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029366/branding-strategy-marketing-business-graphic-design_1_f1jg2a.png'
const BEACH_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029365/high-angle-desk-arrangement-with-cup_1_vpih60.png'
const SMILING_HERO = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775038474/Mads_smiling_2_oufgbz.png'
const PSYCHOLOGIST = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775038690/close-up-female-psychologist-writing-down-notes-therapy-with-her-male-patient_1_mg0o0u.png'
const LANDSCAPE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775038867/image-13-1536x609_1_1_thstte.png'

const AUTHOR = 'Author Name'
const DATE = 'Aug 15, 2021'
const READ = '16 min read'

const P_INTRO = [
  'Hello there! As a marketing manager in the SaaS industry, you might be looking for innovative ways to engage your audience. I bet generative AI has crossed your mind as an option for creating content. Well, let me share from my firsthand experience.',
  'Google encourages high-quality blogs regardless of whether they\'re written by humans or created using artificial intelligence like ChatGPT. Here\'s what matters: producing original material with expertise and trustworthiness based on Google E-E-A-T principles.',
  'This means focusing more on people-first writing rather than primarily employing AI Toolkit to manipulate search rankings. There comes a time when many experienced professionals want to communicate their insights but get stuck due to limited writing skills – that\'s where Generative AI can step in.',
  'So, together, we\'re going explore how this technology could help us deliver valuable content without sounding robotic or defaulting into mere regurgitations of existing materials (spoiler alert – common pitfalls!). Hang tight - it\'ll be a fun learning journey!',
]

const P_LMS = [
  'Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.',
  'Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.',
]

/** Section ids match anchor targets for “In this article”. */
export const SHARED_SECTIONS = [
  { id: 'indexing', heading: 'Indexing', paragraphs: P_INTRO },
  {
    id: 'steering-clear-of-common-ai-writing-pitfalls',
    heading: 'Steering Clear of Common AI Writing Pitfalls',
    paragraphs: P_LMS,
  },
  {
    id: 'understanding-chatgpt-capabilities-define-your-style',
    heading: 'Understanding ChatGPT Capabilities - Define Your Style',
    paragraphs: P_INTRO,
  },
  {
    id: 'understand-your-readers',
    heading: 'Understand Your Readers',
    paragraphs: P_LMS,
  },
  {
    id: 'creating-quality-ai-powered-blogs-that-stand-out',
    heading: 'Creating Quality AI-powered Blogs that Stand Out',
    paragraphs: P_INTRO,
  },
  {
    id: 'conclusion-embracing-ai-in-blog-creation',
    heading: 'Conclusion: Embracing AI in Blog Creation',
    paragraphs: P_LMS,
  },
  {
    id: 'afterword-the-ai-behind-this-article',
    heading: 'Afterword: The AI Behind This Article',
    paragraphs: P_INTRO,
  },
]

function withSections(overrides) {
  const { titleDisplay, ...rest } = overrides
  return {
    ...rest,
    titleDisplay,
    title: overrides.title,
    sections: SHARED_SECTIONS.map((s) => ({
      id: s.id,
      heading: s.heading,
      paragraphs: [...s.paragraphs],
    })),
  }
}

export const BLOG_POSTS_BY_SLUG = {
  'mi-tincidunt-elit': withSections({
    title: 'Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam.',
    titleDisplay: [
      { text: 'Mi tincidunt elit, id quisque ', italic: false },
      { text: 'ligula ac diam, amet. ', italic: true },
      { text: 'Vel etiam.', italic: false },
    ],
    subtitle:
      'Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at donec. In turpis vel et quam imperdiet.',
    author: AUTHOR,
    date: DATE,
    readTime: READ,
    category: 'AI & Automation',
    heroImg: SUIT_IMG,
    contentImg: SUIT_IMG,
  }),

  'integrating-ai-business-workflows': withSections({
    title: 'Best Practices for Integrating AI into Your Existing Business Workflows',
    titleDisplay: [
      { text: 'Best Practices for ', italic: false },
      { text: 'Integrating AI', italic: true },
      { text: ' into Your Existing Business Workflows', italic: false },
    ],
    subtitle:
      'A practical look at how teams adopt AI without losing their voice. Learn to align stakeholders, set guardrails, and ship content that still feels unmistakably yours.',
    author: AUTHOR,
    date: DATE,
    readTime: READ,
    category: 'Tools & Workflows',
    heroImg: PLACEHOLDER_IMG,
    contentImg: LANDSCAPE,
  }),

  'branding-strategy-ai': withSections({
    title: 'Branding, Strategy, and the AI-Assisted Creative Process',
    titleDisplay: [
      { text: 'Branding, Strategy, and the ', italic: false },
      { text: 'AI-Assisted', italic: true },
      { text: ' Creative Process', italic: false },
    ],
    subtitle:
      'From positioning to campaign execution, see how modern teams mix human judgment with AI speed — without sounding generic.',
    author: AUTHOR,
    date: DATE,
    readTime: READ,
    category: 'Business Growth',
    heroImg: BRANDING_IMG,
    contentImg: PSYCHOLOGIST,
  }),

  'desk-productivity-ai': withSections({
    title: 'Deep Work, Desk Time, and Productivity in the AI Era',
    titleDisplay: [
      { text: 'Deep Work, Desk Time, and ', italic: false },
      { text: 'Productivity', italic: true },
      { text: ' in the AI Era', italic: false },
    ],
    subtitle:
      'Rituals, tools, and boundaries that help you get more from every focused block — with AI as a support, not a distraction.',
    author: AUTHOR,
    date: DATE,
    readTime: READ,
    category: 'Productivity',
    heroImg: DESK_IMG,
    contentImg: LANDSCAPE,
  }),

  'team-collaboration-ai': withSections({
    title: 'Collaboration, Clarity, and the Future of Work',
    titleDisplay: [
      { text: 'Collaboration, Clarity, and the ', italic: false },
      { text: 'Future of Work', italic: true },
    ],
    subtitle:
      'How distributed teams use AI to document decisions, align on narrative, and move faster from meeting to deliverable.',
    author: AUTHOR,
    date: DATE,
    readTime: READ,
    category: 'Future of Work',
    heroImg: BEACH_IMG,
    contentImg: SMILING_HERO,
  }),
}

export const ALL_BLOG_SLUGS = Object.keys(BLOG_POSTS_BY_SLUG)

const RECOMMENDED_BASE = [
  { img: SMILING_HERO, title: 'Best Practices for Integrating AI into Your Existing Business Workflows', slug: 'integrating-ai-business-workflows' },
  { img: PSYCHOLOGIST, title: 'Branding, Strategy, and the AI-Assisted Creative Process', slug: 'branding-strategy-ai' },
  { img: LANDSCAPE, title: 'Deep Work, Desk Time, and Productivity in the AI Era', slug: 'desk-productivity-ai' },
  { img: LANDSCAPE, title: 'Collaboration, Clarity, and the Future of Work', slug: 'team-collaboration-ai' },
  { img: SUIT_IMG, title: 'Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam.', slug: 'mi-tincidunt-elit' },
]

export function getRelatedPosts(excludeSlug) {
  return RECOMMENDED_BASE.filter((c) => c.slug !== excludeSlug)
}

export function getBlogPost(slug) {
  return BLOG_POSTS_BY_SLUG[slug] || null
}
