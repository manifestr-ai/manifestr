import { useState } from 'react'
import Input from '../forms/Input'
import Select from '../forms/Select'
import Checkbox from '../forms/Checkbox'
import RadioButton from '../forms/RadioButton'
import Button from '../ui/Button'

export default function ContextSidebar() {
  const [objective, setObjective] = useState('')
  const [audience, setAudience] = useState('')
  const [toneStyle, setToneStyle] = useState('')
  const [desiredPages, setDesiredPages] = useState('')
  const [mandatories, setMandatories] = useState('')
  const [priorityFocus, setPriorityFocus] = useState({
    dataAccuracy: false,
    visualStorytelling: false,
    persuasiveness: false,
  })
  const [sensitivityLevel, setSensitivityLevel] = useState('')

  const handleSkip = (field) => {
    switch (field) {
      case 'audience':
        setAudience('')
        break
      case 'toneStyle':
        setToneStyle('')
        break
      case 'desiredPages':
        setDesiredPages('')
        break
      case 'mandatories':
        setMandatories('')
        break
      case 'priorityFocus':
        setPriorityFocus({
          dataAccuracy: false,
          visualStorytelling: false,
          persuasiveness: false,
        })
        break
      case 'sensitivityLevel':
        setSensitivityLevel('')
        break
      default:
        break
    }
  }

  const handleSave = () => {
    // Handle save logic
  }

  const toneStyleOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
    { value: 'creative', label: 'Creative' },
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-[348px] bg-white border-r border-[#e4e4e7] overflow-y-auto z-40">
      <div className="px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h3-semibold text-base-foreground">Context Inputs</h2>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-6">
          {/* Objective - Required */}
          <div>
            <Input
              label="Objective"
              placeholder="Enter objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              required
            />
          </div>

          {/* Audience - With Skip */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-l2-medium text-base-muted-foreground+">
                Audience
              </label>
              <button
                type="button"
                onClick={() => handleSkip('audience')}
                className="text-l2-medium text-base-muted-foreground hover:text-base-foreground transition-colors"
              >
                Skip
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <RadioButton
                label="Internal Stakeholders"
                value="internal"
                checked={audience === 'internal'}
                onChange={() => setAudience('internal')}
                name="audience"
                className="w-full"
              />
              <RadioButton
                label="External Stakeholders"
                value="external"
                checked={audience === 'external'}
                onChange={() => setAudience('external')}
                name="audience"
                className="w-full"
              />
              <RadioButton
                label="Employees"
                value="employees"
                checked={audience === 'employees'}
                onChange={() => setAudience('employees')}
                name="audience"
                className="w-full"
              />
              <RadioButton
                label="Clients"
                value="clients"
                checked={audience === 'clients'}
                onChange={() => setAudience('clients')}
                name="audience"
                className="w-full"
              />
            </div>
          </div>

          {/* Tone / Style - Required with Skip */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex gap-0.5 items-start">
                <label className="text-l2-medium text-base-muted-foreground+">
                  Tone / Style
                </label>
                <span className="text-l2-medium text-[#dc2626]">*</span>
              </div>
              <button
                type="button"
                onClick={() => handleSkip('toneStyle')}
                className="text-l2-medium text-base-muted-foreground hover:text-base-foreground transition-colors"
              >
                Skip
              </button>
            </div>
            <Select
              placeholder="Select tone / style"
              value={toneStyle}
              onChange={(e) => setToneStyle(e.target.value)}
              options={toneStyleOptions}
              required
            />
          </div>

          {/* No of desired pages - With Skip */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-l2-medium text-base-muted-foreground+">
                No of desired pages
              </label>
              <button
                type="button"
                onClick={() => handleSkip('desiredPages')}
                className="text-l2-medium text-base-muted-foreground hover:text-base-foreground transition-colors"
              >
                Skip
              </button>
            </div>
            <Input
              type="number"
              placeholder="Enter number"
              value={desiredPages}
              onChange={(e) => setDesiredPages(e.target.value)}
            />
          </div>

          {/* Mandatories - With Skip */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-l2-medium text-base-muted-foreground+">
                Mandatories
              </label>
              <button
                type="button"
                onClick={() => handleSkip('mandatories')}
                className="text-l2-medium text-base-muted-foreground hover:text-base-foreground transition-colors"
              >
                Skip
              </button>
            </div>
            <textarea
              placeholder="Frameworks facts and keywords"
              value={mandatories}
              onChange={(e) => setMandatories(e.target.value)}
              className="w-full min-h-[78px] bg-base-background border border-[#e4e4e7] rounded-md px-3 py-2 text-b2-regular text-base-foreground placeholder:text-base-muted-foreground outline-none resize-y"
              rows={3}
            />
          </div>

          {/* Priority Focus - With Skip */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-l2-medium text-base-muted-foreground+">
                Priority Focus
              </label>
              <button
                type="button"
                onClick={() => handleSkip('priorityFocus')}
                className="text-l2-medium text-base-muted-foreground hover:text-base-foreground transition-colors"
              >
                Skip
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <Checkbox
                label="Data accuracy"
                checked={priorityFocus.dataAccuracy}
                onChange={(e) =>
                  setPriorityFocus({
                    ...priorityFocus,
                    dataAccuracy: e.target.checked,
                  })
                }
              />
              <Checkbox
                label="Visual storytelling"
                checked={priorityFocus.visualStorytelling}
                onChange={(e) =>
                  setPriorityFocus({
                    ...priorityFocus,
                    visualStorytelling: e.target.checked,
                  })
                }
              />
              <Checkbox
                label="Persuasiveness"
                checked={priorityFocus.persuasiveness}
                onChange={(e) =>
                  setPriorityFocus({
                    ...priorityFocus,
                    persuasiveness: e.target.checked,
                  })
                }
              />
            </div>
          </div>

          {/* Sensitivity Level - With Skip */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-l2-medium text-base-muted-foreground+">
                Sensitivity Level
              </label>
              <button
                type="button"
                onClick={() => handleSkip('sensitivityLevel')}
                className="text-l2-medium text-base-muted-foreground hover:text-base-foreground transition-colors"
              >
                Skip
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <RadioButton
                label="Standard"
                value="standard"
                checked={sensitivityLevel === 'standard'}
                onChange={() => setSensitivityLevel('standard')}
                name="sensitivityLevel"
                className="w-full"
              />
              <RadioButton
                label="Confidential"
                value="confidential"
                checked={sensitivityLevel === 'confidential'}
                onChange={() => setSensitivityLevel('confidential')}
                name="sensitivityLevel"
                className="w-full"
              />
              <RadioButton
                label="Highly Sensitive"
                value="highlySensitive"
                checked={sensitivityLevel === 'highlySensitive'}
                onChange={() => setSensitivityLevel('highlySensitive')}
                name="sensitivityLevel"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <Button
            onClick={handleSave}
            className="w-full"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

