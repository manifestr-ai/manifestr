/**
 * MANIFESTR - Document Logic Frameworks
 * 
 * Professional thinking frameworks that structure documents according to
 * proven methodologies used by top consultancies (McKinsey, BCG, Bain).
 * 
 * Each framework defines the strategic narrative flow for a document type.
 */

export interface LogicStep {
    step: string;
    description: string;
    purpose: string;
    slides?: string; // e.g., "1-2" or "1"
}

export interface LogicFramework {
    id: string;
    name: string;
    description: string;
    bestFor: string[];
    structure: LogicStep[];
    totalSlides: string;
}

/**
 * PROPOSAL LOGIC
 * Framework for persuasive documents that need to convince stakeholders
 * Used by: Pitch Decks, Client Proposals, Sales Presentations, Sponsorships
 */
export const ProposalLogic: LogicFramework = {
    id: 'proposal',
    name: 'Proposal Logic',
    description: 'Persuasive framework for convincing stakeholders to take action',
    bestFor: [
        'Pitch Decks',
        'Investor Presentations', 
        'Client Proposals',
        'Sales Presentations',
        'Sponsorship Proposals',
        'Partnership Proposals',
        'Agency Pitches'
    ],
    totalSlides: '10-12',
    structure: [
        {
            step: 'Hook & Context',
            description: 'Grab attention and set the stage',
            purpose: 'Establish credibility and frame the conversation',
            slides: '1'
        },
        {
            step: 'The Problem',
            description: 'Define the pain point or market gap',
            purpose: 'Create urgency and demonstrate understanding',
            slides: '1-2'
        },
        {
            step: 'The Opportunity',
            description: 'Why now? Market timing and potential',
            purpose: 'Show the upside and timing advantage',
            slides: '1'
        },
        {
            step: 'The Solution',
            description: 'Your offering and how it works',
            purpose: 'Present your unique approach',
            slides: '2-3'
        },
        {
            step: 'Proof & Validation',
            description: 'Evidence, traction, testimonials, data',
            purpose: 'Build trust through tangible results',
            slides: '1-2'
        },
        {
            step: 'Impact & ROI',
            description: 'Expected outcomes and value delivery',
            purpose: 'Quantify the benefit',
            slides: '1'
        },
        {
            step: 'Call to Action',
            description: 'Clear next steps and what you need',
            purpose: 'Drive decision and commitment',
            slides: '1'
        }
    ]
};

/**
 * STRATEGY LOGIC
 * Framework for strategic planning and vision documents
 * Used by: Corporate Strategy, Vision Decks, Strategic Plans, Roadmaps
 */
export const StrategyLogic: LogicFramework = {
    id: 'strategy',
    name: 'Strategy Logic',
    description: 'Framework for articulating vision and strategic direction',
    bestFor: [
        'Corporate Strategy',
        'Vision Presentations',
        'Strategic Plans',
        'Business Roadmaps',
        'Quarterly Business Reviews',
        'Executive Briefings'
    ],
    totalSlides: '10-12',
    structure: [
        {
            step: 'Vision & Mission',
            description: 'The big picture and organizational purpose',
            purpose: 'Align everyone on the destination',
            slides: '1'
        },
        {
            step: 'Current State',
            description: 'Where we are today - context and situation',
            purpose: 'Establish baseline and shared reality',
            slides: '1-2'
        },
        {
            step: 'Market Context',
            description: 'Industry trends, competitive landscape, forces',
            purpose: 'Demonstrate environmental awareness',
            slides: '1-2'
        },
        {
            step: 'Strategic Pillars',
            description: 'Core focus areas and priorities',
            purpose: 'Define the strategic bets',
            slides: '2-3'
        },
        {
            step: 'Execution Plan',
            description: 'How we will deliver - initiatives and programs',
            purpose: 'Make strategy actionable',
            slides: '2'
        },
        {
            step: 'Metrics & Milestones',
            description: 'How we measure success',
            purpose: 'Create accountability',
            slides: '1'
        },
        {
            step: 'Next Steps',
            description: 'Immediate actions and timeline',
            purpose: 'Drive momentum',
            slides: '1'
        }
    ]
};

/**
 * REPORT LOGIC
 * Framework for analytical and informational documents
 * Used by: Business Reports, Analysis, Findings, White Papers
 */
export const ReportLogic: LogicFramework = {
    id: 'report',
    name: 'Report Logic',
    description: 'Analytical framework for presenting findings and recommendations',
    bestFor: [
        'Business Reports',
        'Market Analysis',
        'Research Reports',
        'White Papers',
        'Performance Reports',
        'Audit Reports'
    ],
    totalSlides: '10-12',
    structure: [
        {
            step: 'Executive Summary',
            description: 'Key findings and recommendations upfront',
            purpose: 'Give busy executives the headlines',
            slides: '1'
        },
        {
            step: 'Background & Context',
            description: 'Why this analysis was conducted',
            purpose: 'Frame the scope and objectives',
            slides: '1'
        },
        {
            step: 'Current State',
            description: 'Baseline metrics and situation',
            purpose: 'Establish the starting point',
            slides: '1-2'
        },
        {
            step: 'Analysis & Insights',
            description: 'Deep dive into data and findings',
            purpose: 'Present evidence and patterns',
            slides: '3-4'
        },
        {
            step: 'Key Findings',
            description: 'Most important discoveries',
            purpose: 'Highlight what matters most',
            slides: '1-2'
        },
        {
            step: 'Recommendations',
            description: 'Proposed actions based on analysis',
            purpose: 'Guide decision-making',
            slides: '1-2'
        },
        {
            step: 'Next Steps',
            description: 'Implementation roadmap',
            purpose: 'Make recommendations actionable',
            slides: '1'
        }
    ]
};

/**
 * EDUCATION LOGIC
 * Framework for teaching and training documents
 * Used by: Training Materials, Workshops, Onboarding, How-To Guides
 */
export const EducationLogic: LogicFramework = {
    id: 'education',
    name: 'Education Logic',
    description: 'Framework for teaching concepts and building skills',
    bestFor: [
        'Training Presentations',
        'Workshop Materials',
        'Onboarding Decks',
        'Tutorial Content',
        'Educational Materials',
        'Knowledge Transfer'
    ],
    totalSlides: '10-12',
    structure: [
        {
            step: 'Learning Objectives',
            description: 'What participants will learn',
            purpose: 'Set expectations and goals',
            slides: '1'
        },
        {
            step: 'Context & Why',
            description: 'Why this topic matters',
            purpose: 'Create motivation to learn',
            slides: '1'
        },
        {
            step: 'Core Concepts',
            description: 'Fundamental principles and theory',
            purpose: 'Build foundational understanding',
            slides: '2-3'
        },
        {
            step: 'Examples & Applications',
            description: 'Real-world use cases',
            purpose: 'Make concepts tangible',
            slides: '2-3'
        },
        {
            step: 'Step-by-Step Process',
            description: 'How to apply the knowledge',
            purpose: 'Enable practical application',
            slides: '2'
        },
        {
            step: 'Common Pitfalls',
            description: 'Mistakes to avoid',
            purpose: 'Prevent errors',
            slides: '1'
        },
        {
            step: 'Practice & Next Steps',
            description: 'How to continue learning',
            purpose: 'Encourage ongoing development',
            slides: '1'
        }
    ]
};

/**
 * COMMUNICATION LOGIC
 * Framework for updates, announcements, and internal communications
 * Used by: Team Updates, Company Announcements, Meeting Agendas
 */
export const CommunicationLogic: LogicFramework = {
    id: 'communication',
    name: 'Communication Logic',
    description: 'Framework for clear organizational communication',
    bestFor: [
        'Team Updates',
        'All-Hands Presentations',
        'Company Announcements',
        'Meeting Agendas',
        'Project Updates',
        'Status Reports'
    ],
    totalSlides: '8-10',
    structure: [
        {
            step: 'Opening & Purpose',
            description: 'Why we are gathered',
            purpose: 'Set context for the communication',
            slides: '1'
        },
        {
            step: 'Key Updates',
            description: 'Most important news and changes',
            purpose: 'Inform stakeholders',
            slides: '2-3'
        },
        {
            step: 'Impact & Implications',
            description: 'What this means for the team/company',
            purpose: 'Connect updates to people',
            slides: '1-2'
        },
        {
            step: 'Looking Ahead',
            description: 'Future plans and expectations',
            purpose: 'Provide direction',
            slides: '2'
        },
        {
            step: 'Q&A / Discussion',
            description: 'Open floor for questions',
            purpose: 'Address concerns',
            slides: '1'
        },
        {
            step: 'Action Items',
            description: 'Next steps and responsibilities',
            purpose: 'Drive execution',
            slides: '1'
        }
    ]
};

/**
 * ANALYSIS LOGIC
 * Framework for deep analytical documents
 * Used by: Market Analysis, Competitive Analysis, Data Reports
 */
export const AnalysisLogic: LogicFramework = {
    id: 'analysis',
    name: 'Analysis Logic',
    description: 'Framework for rigorous analytical work',
    bestFor: [
        'Market Analysis',
        'Competitive Analysis',
        'Data Analysis Reports',
        'SWOT Analysis',
        'Industry Research',
        'Feasibility Studies'
    ],
    totalSlides: '10-12',
    structure: [
        {
            step: 'Research Question',
            description: 'What we set out to understand',
            purpose: 'Define the analytical scope',
            slides: '1'
        },
        {
            step: 'Methodology',
            description: 'How the analysis was conducted',
            purpose: 'Establish credibility',
            slides: '1'
        },
        {
            step: 'Data & Sources',
            description: 'Information gathered and sources',
            purpose: 'Show evidence base',
            slides: '1-2'
        },
        {
            step: 'Analysis Framework',
            description: 'Analytical lens applied',
            purpose: 'Explain the thinking model',
            slides: '1'
        },
        {
            step: 'Detailed Findings',
            description: 'Layer-by-layer analysis results',
            purpose: 'Present comprehensive insights',
            slides: '3-4'
        },
        {
            step: 'Synthesis',
            description: 'Big picture conclusions',
            purpose: 'Connect the dots',
            slides: '1-2'
        },
        {
            step: 'Implications',
            description: 'What this means for decision-makers',
            purpose: 'Make analysis actionable',
            slides: '1'
        }
    ]
};

/**
 * ALL FRAMEWORKS REGISTRY
 */
export const ALL_FRAMEWORKS: LogicFramework[] = [
    ProposalLogic,
    StrategyLogic,
    ReportLogic,
    EducationLogic,
    CommunicationLogic,
    AnalysisLogic
];

/**
 * DOCUMENT TYPE TO LOGIC MAPPING
 * Maps specific document types to their optimal logic framework
 */
export const DOCUMENT_LOGIC_MAP: Record<string, string> = {
    // Proposal Logic
    'pitch-deck': 'proposal',
    'investor-deck': 'proposal',
    'agency-pitch': 'proposal',
    'client-proposal': 'proposal',
    'sales-deck': 'proposal',
    'partnership-proposal': 'proposal',
    'sponsorship-proposal': 'proposal',
    
    // Strategy Logic
    'corporate-strategy': 'strategy',
    'vision-deck': 'strategy',
    'strategic-plan': 'strategy',
    'qbr': 'strategy',
    'quarterly-review': 'strategy',
    'executive-briefing': 'strategy',
    'roadmap': 'strategy',
    
    // Report Logic
    'business-report': 'report',
    'performance-report': 'report',
    'white-paper': 'report',
    'research-report': 'report',
    'audit-report': 'report',
    
    // Education Logic
    'training': 'education',
    'workshop': 'education',
    'onboarding': 'education',
    'tutorial': 'education',
    'keynote': 'education',
    
    // Communication Logic
    'all-hands': 'communication',
    'team-update': 'communication',
    'announcement': 'communication',
    'meeting-agenda': 'communication',
    'project-update': 'communication',
    
    // Analysis Logic
    'market-analysis': 'analysis',
    'competitive-analysis': 'analysis',
    'swot-analysis': 'analysis',
    'data-analysis': 'analysis',
    'feasibility-study': 'analysis',
};

/**
 * Get appropriate logic framework for a document type
 */
export function getLogicFramework(documentType: string): LogicFramework {
    const normalizedType = documentType.toLowerCase().replace(/\s+/g, '-');
    const logicId = DOCUMENT_LOGIC_MAP[normalizedType] || 'proposal'; // Default to proposal
    
    return ALL_FRAMEWORKS.find(f => f.id === logicId) || ProposalLogic;
}

/**
 * Select logic framework based on user prompt and metadata
 */
export function selectLogicFramework(prompt: string, meta: any = {}): LogicFramework {
    const promptLower = prompt.toLowerCase();
    
    // Explicit document type in prompt
    for (const [docType, logicId] of Object.entries(DOCUMENT_LOGIC_MAP)) {
        if (promptLower.includes(docType)) {
            return ALL_FRAMEWORKS.find(f => f.id === logicId) || ProposalLogic;
        }
    }
    
    // Analyze intent from keywords
    if (promptLower.match(/pitch|investor|funding|raise|sell|convince|proposal/)) {
        return ProposalLogic;
    }
    
    if (promptLower.match(/strategy|vision|roadmap|plan|future|direction|qbr/)) {
        return StrategyLogic;
    }
    
    if (promptLower.match(/report|analysis|findings|research|study|audit/)) {
        return ReportLogic;
    }
    
    if (promptLower.match(/train|teach|learn|workshop|onboard|tutorial|education/)) {
        return EducationLogic;
    }
    
    if (promptLower.match(/update|announce|meeting|team|communication|huddle/)) {
        return CommunicationLogic;
    }
    
    if (promptLower.match(/market|competitive|data|swot|feasibility/)) {
        return AnalysisLogic;
    }
    
    // Default: If talking to investors/clients = Proposal, otherwise = Report
    if (meta.audience?.toLowerCase().match(/investor|client|customer|external/)) {
        return ProposalLogic;
    }
    
    return ReportLogic; // Safe default
}
