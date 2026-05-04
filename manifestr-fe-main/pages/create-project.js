import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import StepperHeader from '../components/create-project/StepperHeader'
import ToolCard from '../components/create-project/ToolCard'
import Step2DocumentSelection from '../components/create-project/Step2DocumentSelection'
import Step3 from '../components/create-project/Step3'

import Step4BriefMe from '../components/create-project/Step4BriefMe'
import Step4DropZone from '../components/create-project/Step4DropZone'
import Step4FreeStyle from '../components/create-project/Step4FreeStyle'
import Step5Clarify from '../components/create-project/Step5Clarify'
import Step6Edit from '../components/create-project/Step6Edit'
import api from '../lib/api'
import ContextSidebar from '../components/create-project/ContextSidebar'
import Button from '../components/ui/Button'
import LogoFooter from '../components/home/LogoFooter'
import { useToast } from '../components/ui/Toast'

// Tools ordered to match Figma layout:
// Row 1: THE strategist, THE briefcase, THE analyser, DESIGN studio
// Row 2: WORDSMITH, THE deck, THE huddle, COST CTRL
const tools = [
  // Row 1
  {
    id: 'strategist',
    title: 'THE strategist',
    subtitle: 'Strategic Planning • Corporate Vision',
    imageSrc: '/assets/cards/the-strategist.svg',
    outputType: 'presentation',
    description: {
      title: 'Strategic Planning Studio',
      content: `Purpose: Align stakeholders with high-level strategic narratives.

Best For: Quarterly Business Reviews • Corporate Strategy • Vision Decks

Outputs: Comprehensive strategy presentations`,
      quickTip: 'Upload your strategic pillars - STRATEGIST visualizes them instantly.',
    },
  },
  {
    id: 'analyser',
    title: 'THE analyser',
    subtitle: 'Data Analysis • Insights',
    imageSrc: '/assets/cards/the-analyzer.svg',
    outputType: 'chart',
    description: {
      title: 'Data Insight Engine',
      content: `Purpose: Transform raw data into actionable insights.

Best For: Market Analysis • Performance Tracking • Data Modeling

Outputs: Interactive charts and data visualizations`,
      quickTip: 'Provide your dataset - ANALYSER builds the model.',
    },
  },
  {
    id: 'briefcase',
    title: 'THE briefcase',
    subtitle: 'Business Reports • Executive Briefs',
    imageSrc: '/assets/cards/the-briefcase.svg',
    outputType: 'document',
    description: {
      title: 'Executive Documentation Center',
      content: `Purpose: Professionalize your business documentation.

Best For: Annual Reports • White Papers • Executive Summaries

Outputs: Structured, professional documents`,
      quickTip: 'Outline your key points - BRIEFCASE drafts the full report.',
    },
  },
  {
    id: 'design-studio',
    title: 'DESIGN studio',
    subtitle: 'AI Image Generation • Visual Creation',
    imageSrc: '/assets/cards/design-studio.svg',
    outputType: 'image',
    description: {
      title: 'AI-Powered Image Studio',
      content: `Purpose: Generate stunning AI images from text descriptions.

Best For: Marketing Visuals • Social Media • Creative Concepts • Product Mockups

Outputs: High-quality AI-generated images ready for editing`,
      quickTip: 'Describe your vision - DESIGN STUDIO creates it visually.',
    },
  },
  // Row 2
  {
    id: 'wordsmith',
    title: 'WORDSMITH',
    subtitle: 'Copywriting • Editorial Content',
    imageSrc: '/assets/cards/the-wordsmith.svg',
    outputType: 'document',
    description: {
      title: 'Editorial Content Creator',
      content: `Purpose: Craft compelling written content.

Best For: Blog Posts • Articles • Marketing Copy • Newsletters

Outputs: Engaging, well-written articles and posts`,
      quickTip: 'Give a topic - WORDSMITH writes the article.',
    },
  },
  {
    id: 'deck',
    title: 'THE deck',
    subtitle: 'Pitch Decks • Sales Presentations',
    imageSrc: '/assets/cards/the-deck.svg',
    outputType: 'presentation',
    description: {
      title: 'Pitch Perfector',
      content: `Purpose: Win deals and investment.

Best For: Startup Pitches • Sales Decks • Investor Updates

Outputs: Persuasive, high-impact decks`,
      quickTip: 'Describe your product - THE DECK builds the pitch.',
    },
  },
  {
    id: 'huddle',
    title: 'THE huddle',
    subtitle: 'Meeting Notes • Team Agendas',
    imageSrc: '/assets/cards/the-huddle.svg',
    outputType: 'document',
    description: {
      title: 'Team Collaboration Hub',
      content: `Purpose: Streamline team communication.

Best For: Meeting Minutes • Project Agendas • Internal Memos

Outputs: Clear, organized team documents`,
      quickTip: 'Record your meeting - HUDDLE transcribes and summarizes.',
    },
  },
  {
    id: 'cost-ctrl',
    title: 'COST CTRL',
    subtitle: 'Budgets • Financial Planning',
    imageSrc: '/assets/cards/ctrl.svg',
    outputType: 'spreadsheet',
    description: {
      title: 'Financial Control Center',
      content: `Purpose: Master your finances with precision.

Best For: Budgeting • Expense Tracking • Financial Forecasting

Outputs: Detailed financial spreadsheets`,
      quickTip: 'List your expenses - COST CTRL organizes the budget.',
    },
  },
]

export default function CreateProject() {
  const router = useRouter()
  const { error: showError } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedToolId, setSelectedToolId] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationId, setGenerationId] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [projectData, setProjectData] = useState({
    // Brief Me Data
    documentName: '',
    projectBrandName: '',
    websiteUrl: '',
    role: '',
    context: '',
    primaryObjective: '',
    successDefinition: '',
    keyMessage: '',
    primaryAudience: 'internal',
    deliverables: '',
    think: '',
    feel: '',
    do: '',
    tone: 'professional',
    structure: 'narrative',
    estimatedPageCount: '',
    wordCountPreference: '',
    budget: '',
    timeline: '',
    dependencies: '',
    approvers: '',
    documentNameNA: false,
    projectBrandNameNA: false,
    websiteUrlNA: false,
    roleNA: false,
    contextNotSure: false,
    primaryObjectiveNA: false,
    successDefinitionNA: false,
    keyMessageNA: false,
    estimatedPageCountNA: false,
    wordCountPreferenceNA: false,
    budgetAllocationNA: false,
    timelineDeadlinesNA: false,
    dependenciesNA: false,
    approversNA: false,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentStep])

  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (currentStep === 1) {
        const insideToolCard = e.target && typeof e.target.closest === 'function'
          ? e.target.closest('[data-tool-card="true"]')
          : null
        if (!insideToolCard) {
          setSelectedToolId(null)
        }
      } else if (currentStep === 2) {
        const insideDocCard = e.target && typeof e.target.closest === 'function'
          ? e.target.closest('[data-doc-card="true"]')
          : null
        if (!insideDocCard) {
          setSelectedDocument(null)
        }
      } else if (currentStep === 3) {
        const insideStyleCard = e.target && typeof e.target.closest === 'function'
          ? e.target.closest('[data-style-card="true"]')
          : null
        if (!insideStyleCard) {
          setSelectedStyle(null)
        }
      }
    }
    document.addEventListener('click', handleGlobalClick)
    return () => {
      document.removeEventListener('click', handleGlobalClick)
    }
  }, [currentStep])

  const updateProjectData = (updates) => {
    setProjectData((prev) => ({ ...prev, ...updates }))
  }

  // Get selected tool object
  const selectedTool = tools.find((tool) => tool.id === selectedToolId)

  const handleToolSelect = (toolId) => {
    setSelectedToolId(toolId)
    setSelectedDocument(null)
  }

  const handleDocumentSelect = (documentId) => {
    setSelectedDocument(documentId)
  }

  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId)
  }

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/home')
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = async () => {
    if (currentStep === 1 && selectedToolId) {
      setCurrentStep(2)
    } else if (currentStep === 2 && selectedDocument) {
      setCurrentStep(3)
    } else if (currentStep === 3 && selectedStyle) {
      setCurrentStep(4)
    } else if (currentStep === 4) {
      setIsGenerating(true)
      try {
        const response = await fetch('/api/generate-clarify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectData,
            tool: selectedTool
          })
        })

        if (response.ok) {
          const data = await response.json()
          updateProjectData(data)
        } else {
        }
      } catch (error) {
      } finally {
        setIsGenerating(false)
        setCurrentStep(5)
      }
    } else if (currentStep === 5) {
      // Step 5 -> Step 6 (Trigger Generation)
      setIsGenerating(true)

      const combinedPrompt = `${projectData.context}
      
      Specific Requirements:
      - Objective: ${projectData.primaryObjective}
      - Key Message: ${projectData.keyMessage}
      - Structure: ${projectData.structure}`

      // Sanitize output type to match backend enum
      const validOutputTypes = ['presentation', 'document', 'spreadsheet', 'image', 'chart']
      const outputType = validOutputTypes.includes(selectedTool.outputType)
        ? selectedTool.outputType
        : 'presentation'

      try {
        // 🎨 SPECIAL HANDLING FOR IMAGE GENERATION - IMMEDIATE!
        if (outputType === 'image') {
          console.log('🎨 Generating image immediately...')
          
          const imageResponse = await api.post('/image-generator/generate', {
            prompt: combinedPrompt,
            meta: {
              tone: projectData.tone,
              audience: projectData.primaryAudience,
              brand: projectData.projectBrandName
            }
          })

          if (imageResponse.data && imageResponse.data.status === 'success') {
            const jobId = imageResponse.data.data.jobId
            console.log('✅ Image generated! Job ID:', jobId)
            
            // Redirect to image editor with job ID (will be saved in vault!)
            router.push(`/image-editor?id=${jobId}`)
          } else {
            showError('Failed to generate image. Please try again.')
          }
          setIsGenerating(false)
          return
        }

        // NORMAL FLOW FOR DOCUMENTS/PRESENTATIONS/SPREADSHEETS
        const payload = {
          prompt: combinedPrompt,
          output: outputType,
          meta: {
            tone: projectData.tone,
            audience: projectData.primaryAudience,
            brand: projectData.projectBrandName,
            budget: projectData.budget,
            timeline: projectData.timeline,
            toolId: selectedTool.id,
            documentCategory: selectedDocument
          },
          // style_guide_id: null
        }

        const response = await api.post('/ai/generate', payload)

        if (response.data && response.data.status === 'success') {
          const { jobId } = response.data.data
          if (jobId) {
            setGenerationId(jobId)
            setCurrentStep(6)
          }
        } else {
        }
      } catch (err) {
        console.error('Generation error:', err)
        showError('Generation failed. Please try again.')
      } finally {
        setIsGenerating(false)
      }

    } else if (currentStep === 6) {
      // TODO: Navigate to editor or final page
    }
  }

  const validateStep4 = () => {
    if (selectedStyle === 'brief-me') {
      const hasInput =
        projectData.documentName ||
        projectData.projectBrandName ||
        projectData.websiteUrl ||
        projectData.role ||
        projectData.context ||
        projectData.primaryObjective ||
        projectData.successDefinition ||
        projectData.keyMessage ||
        projectData.deliverables ||
        projectData.think ||
        projectData.feel ||
        projectData.do

      const hasToggles =
        projectData.documentNameNA ||
        projectData.projectBrandNameNA ||
        projectData.websiteUrlNA ||
        projectData.roleNA ||
        projectData.contextNotSure ||
        projectData.primaryObjectiveNA ||
        projectData.successDefinitionNA ||
        projectData.keyMessageNA

      return hasInput || hasToggles
    }

    if (selectedStyle === 'free-style') {
      return projectData.context && projectData.context.trim().length > 0
    }

    if (selectedStyle === 'drop-zone') {
      return uploadedFiles && uploadedFiles.length > 0
    }

    return false
  }

  const handleSkipReview = () => {
    if (currentStep === 5) {
      setCurrentStep(6)
    }
  }

  const handleFilesChange = (files) => {
    setUploadedFiles(files)
  }

  const handleSaveExit = () => {
    router.push('/home')
  }

  return (
    <>
      <Head>
        <title>Create Project - Manifestr</title>
        <meta name="description" content="Create a new project in Manifestr" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white min-h-screen w-full flex flex-col">
        {/* Stepper Header */}
        <StepperHeader
          step={currentStep}
          totalSteps={6}
          onSaveExit={handleSaveExit}
          sidebarVisible={currentStep === 4 && (selectedStyle === 'talk-to-me' || selectedStyle === 'drop-zone' || selectedStyle === 'free-style')}
        />

        {/* Spacer for fixed header */}
        <div className="h-[15px]" />

        {/* Main Content */}
        <main className="flex-1 relative">
          {/* Background Watermark */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1376px] h-[155px] pointer-events-none">
            <div className="w-full h-full bg-base-muted opacity-30" />
          </div>

          {/* Content Container */}
          {currentStep === 1 ? (
            <div className="relative max-w-[1290px] mx-auto pt-4">
              {/* Heading Section */}
              <div className="text-center mb-8">
                <h1 className="font-hero font-bold text-[36px] leading-[44px] tracking-[-0.72px] text-black mb-4">
                  Select a tool<span className="font-normal"> to begin</span>
                </h1>
                <p className="text-[16px] leading-[24px] text-base-muted-foreground+">
                  Not sure where to start? Hover over a tool for more information.
                </p>
              </div>

              {/* Tools Grid - Responsive Layout */}
              <div className="relative w-full max-w-[1290px] mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                  {tools.map((tool) => (
                    <div key={tool.id} className="w-full max-w-[302px]">
                      <ToolCard
                        title={tool.title}
                        subtitle={tool.subtitle}
                        imageSrc={tool.imageSrc}
                        description={tool.description}
                        onClick={() => handleToolSelect(tool.id)}
                        isSelected={selectedToolId === tool.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : currentStep === 2 ? (
            <div className="relative max-w-[1110px] mx-auto pt-4 pb-8 px-4">
              <Step2DocumentSelection
                selectedTool={selectedTool}
                selectedDocument={selectedDocument}
                onDocumentSelect={handleDocumentSelect}
              />
            </div>
          ) : currentStep === 4 ? (
            <div className={`relative w-full pt-4 pb-8 transition-all duration-300 ${(selectedStyle === 'drop-zone' || selectedStyle === 'free-style')
              ? 'lg:pl-[348px]'
              : ''
              }`}>
              {selectedStyle === 'brief-me' && (
                <div className="max-w-[1301px] mx-auto px-4">
                  <Step4BriefMe projectData={projectData} updateProjectData={updateProjectData} />
                </div>
              )}
              {selectedStyle === 'drop-zone' && (
                <Step4DropZone onFilesChange={handleFilesChange} projectData={projectData} updateProjectData={updateProjectData} />
              )}
              {selectedStyle === 'free-style' && <Step4FreeStyle projectData={projectData} updateProjectData={updateProjectData} />}
              {/* Show sidebar for drop-zone and free-style */}
              {(selectedStyle === 'drop-zone' || selectedStyle === 'free-style') && (
                <div className="hidden lg:block">
                  <ContextSidebar />
                </div>
              )}
            </div>
          ) : currentStep === 5 ? (
            <div className="relative w-full pt-4 pb-8 px-4">
              <Step5Clarify
                onSkip={handleSkipReview}
                projectData={projectData}
                updateProjectData={updateProjectData}
                selectedTool={selectedTool}
              />
            </div>
          ) : currentStep === 6 ? (
            <div className="relative w-full pt-4 pb-8 px-4">
              <Step6Edit
                generationId={generationId}
                outputType={selectedTool?.outputType || 'presentation'}
              />
            </div>
          ) : (
            <div className="relative max-w-[1301px] mx-auto pt-4 pb-8 px-4">
              <Step3
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
              />
            </div>
          )}

          {/* Logo Footer - Show on all steps except Step 3, Step 4, and Step 6 */}
          {currentStep !== 3 && currentStep !== 4 && currentStep !== 6 ? (
            <>
              <LogoFooter gray={true} />
              <div style={{ height: '60px' }} />
            </>
          ) : <div style={{ height: '20px' }} />}

          {/* Footer Actions - Hide on Step 6 (loading screen) */}
          {currentStep !== 6 && (
            <div
              className={`fixed bottom-0 right-0 z-50 backdrop-blur-sm bg-[#ffffffd5] transition-all duration-300 w-full left-0 ${currentStep === 4 && (selectedStyle === 'drop-zone' || selectedStyle === 'free-style')
                ? 'lg:left-[348px] lg:w-auto lg:right-0'
                : ''
                }`}
            >
              <div
                className={`flex items-center justify-between gap-3 sm:gap-4 ${currentStep === 4 && (selectedStyle === 'drop-zone' || selectedStyle === 'free-style')
                  ? 'w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8'
                  : 'max-w-[1280px] mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-6'
                  }`}
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-1 py-1 text-base-secondary hover:opacity-80 transition-opacity shrink-0 min-h-[44px] min-w-[44px] sm:min-w-0 sm:min-h-0"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  <span className="text-[14px] leading-[20px] font-medium">Back</span>
                </button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !selectedToolId) ||
                    (currentStep === 2 && !selectedDocument) ||
                    (currentStep === 3 && !selectedStyle) ||
                    (currentStep === 4 && !validateStep4()) ||
                    isGenerating
                  }
                  className="h-10 sm:h-[40px] w-[min(100%,11.75rem)] sm:w-[188px] flex items-center justify-center gap-2 shrink-0 px-3 sm:px-4"
                >
                  <span className="truncate">
                    {isGenerating ? 'Clarifying...' :
                      currentStep === 1 ? 'Next Flow' :
                        currentStep === 5 ? 'Approve & Continue' :
                          'Next'}
                  </span>
                  {!isGenerating && <ArrowRight className="w-4 h-4 shrink-0" />}
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

