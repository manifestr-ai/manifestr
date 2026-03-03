import Logo from '../logo/Logo'
import Button from '../ui/Button'
import { Check } from 'lucide-react'
import { useRouter } from 'next/router'

const stepLabels = [
  'TOOLKIT',
  'DOCUMENT',
  'MODE',
  'INPUT',
  'CLARIFY',
  'EDIT',
]

function Step({ stepNumber, label, isCurrent, isCompleted }) {
  return (
    <div className="flex gap-2 items-center">
      {/* Step Circle */}
      <div className="relative shrink-0">
        <div
          className={`relative shrink-0 size-[36px] rounded-full flex items-center justify-center ${
            isCurrent
              ? 'shadow-[0_10px_15px_-3px_rgba(15,23,43,0.30),0_4px_6px_-4px_rgba(15,23,43,0.30)] border-2'
              : isCompleted
              ? 'shadow-[0_10px_15px_-3px_rgba(15,23,43,0.30),0_4px_6px_-4px_rgba(15,23,43,0.30)]'
              : 'bg-white border border-slate-200'
          }`}
          style={
            isCurrent
              ? {
                  background: 'linear-gradient(135deg, #0F172B 0%, #1D293D 50%, #0F172B 100%)',
                  borderColor: 'rgba(15, 23, 43, 0.30)',
                }
              : isCompleted
              ? {
                  background: 'linear-gradient(135deg, #0F172B 0%, #1D293D 50%, #0F172B 100%)',
                }
              : {}
          }
        >
          {isCompleted ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <p
              className={`text-[14px] leading-[20px] tracking-[-0.1504px] ${
                isCurrent
                  ? 'text-white font-normal'
                  : 'text-[#cad5e2] font-normal'
              }`}
            >
              {stepNumber}
            </p>
          )}
        </div>
      </div>
      {/* Step Label */}
      <p
        className={`text-[12px] leading-[16px] tracking-[1.44px] uppercase whitespace-nowrap ${
          isCurrent || isCompleted
            ? 'text-[#0f172b] font-normal'
            : 'text-[#8d8e8f] font-normal'
        }`}
      >
        {label}
      </p>
    </div>
  )
}

export default function StepperHeader({ step = 1, totalSteps = 6, onSaveExit, sidebarVisible = false }) {
  const router = useRouter()
  
  const handleLogoClick = () => {
    router.push('/home')
  }
  
  return (
    <div className="w-full">
      {/* Fixed Section: Header Navigation + Progress Tracker */}
      <div className={`fixed top-0 right-0 z-50 bg-white ${
        sidebarVisible ? 'left-[348px]' : 'left-0'
      }`}>
        {/* Header Navigation */}
        <div className="bg-white flex flex-col items-center overflow-hidden w-full">
          <div className="flex h-[72px] items-center justify-between max-w-[1280px] w-full px-8">
            <Logo size="md" onClick={handleLogoClick} />
            <div className="flex gap-6 items-center justify-end">
              <Button
                variant="secondary"
                size="md"
                onClick={onSaveExit}
                className="h-[40px] px-4"
              >
                Save & Exit
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex gap-1 items-center w-full">
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < step
          const isCurrent = stepNumber === step
          
          return (
            <div
              key={index}
              className="flex-1 h-2 relative rounded-sm overflow-hidden"
            >
              {/* Background */}
              <div
                className={`absolute inset-0 h-2 rounded-sm ${
                  isCompleted || isCurrent
                    ? 'bg-[rgba(24,24,27,0.5)]'
                    : 'bg-[#868687]'
                }`}
              />
              {/* Progress Fill */}
              {isCompleted && (
                <div className="absolute h-2 bg-[#18181b] rounded-bl-sm rounded-tl-sm top-0 left-0 w-full" />
              )}
              {isCurrent && (
                <div className="absolute h-2 bg-[#18181b] rounded-bl-sm rounded-tl-sm top-0 left-0 w-full" />
              )}
            </div>
          )
        })}
        </div>
      </div>

      {/* Step Indicators */}
      <div className={`flex gap-8 items-center justify-center max-w-[1280px] mx-auto px-8 pt-4 mt-[100px] ${
        sidebarVisible ? 'ml-[348px]' : ''
      }`}>
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1
          const isCurrent = stepNumber === step
          const isCompleted = stepNumber < step
          
          return (
            <Step
              key={stepNumber}
              stepNumber={stepNumber}
              label={label}
              isCurrent={isCurrent}
              isCompleted={isCompleted}
            />
          )
        })}
      </div>
    </div>
  )
}

