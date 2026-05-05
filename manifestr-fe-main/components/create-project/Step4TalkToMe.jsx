import { useState, useEffect, useRef } from 'react'
import { Mic, Square, X, CheckCircle2 } from 'lucide-react'
import Logo from '../logo/Logo'
import VoiceRecordingSidebar from './VoiceRecordingSidebar'

export default function Step4TalkToMe({ projectData = {}, updateProjectData }) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [hasRecorded, setHasRecorded] = useState(false) // Track if user has recorded
  const [capturedFields, setCapturedFields] = useState({
    documentType: false,
    documentName: false,
    projectName: false,
    websiteUrl: false,
    supportingLinks: false,
    deadlines: false,
    purpose: false,
    keyMessage: false,
    audience: false,
    keyImpact: false,
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const recognitionRef = useRef(null)
  const transcriptRef = useRef('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = (event) => {
          let interim = ''
          let final = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              final += transcript + ' '
            } else {
              interim += transcript
            }
          }

          if (final) {
            transcriptRef.current += final
            setTranscript(transcriptRef.current)
            analyzeTranscript(transcriptRef.current)
          }
          setInterimTranscript(interim)
        }

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'no-speech') {
            // Restart if no speech detected
            if (isRecording) {
              recognition.start()
            }
          }
        }

        recognition.onend = () => {
          if (isRecording) {
            recognition.start()
          }
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const analyzeTranscript = (text) => {
    const lowerText = text.toLowerCase()
    const newCapturedFields = { ...capturedFields }

    // Simple keyword detection for demo
    if (lowerText.includes('pitch deck') || lowerText.includes('presentation') || lowerText.includes('document')) {
      newCapturedFields.documentType = true
    }
    if (lowerText.includes('productivity') || lowerText.includes('platform') || lowerText.includes('app')) {
      newCapturedFields.projectName = true
    }
    if (lowerText.includes('investors') || lowerText.includes('audience') || lowerText.includes('target')) {
      newCapturedFields.audience = true
    }
    if (lowerText.includes('million') || lowerText.includes('raise') || lowerText.includes('funding')) {
      newCapturedFields.purpose = true
    }
    if (lowerText.includes('value') || lowerText.includes('proposition') || lowerText.includes('help')) {
      newCapturedFields.keyMessage = true
    }
    if (lowerText.includes('3x') || lowerText.includes('impact') || lowerText.includes('productive')) {
      newCapturedFields.keyImpact = true
    }

    setCapturedFields(newCapturedFields)
  }

  const handleStartRecording = () => {
    if (recognitionRef.current) {
      transcriptRef.current = ''
      setTranscript('')
      setInterimTranscript('')
      setCapturedFields({
        documentType: false,
        documentName: false,
        projectName: false,
        websiteUrl: false,
        supportingLinks: false,
        deadlines: false,
        purpose: false,
        keyMessage: false,
        audience: false,
        keyImpact: false,
      })
      recognitionRef.current.start()
      setIsRecording(true)
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
    }
  }

  const handleStopRecording = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
      setHasRecorded(true) // Mark that recording happened
      setIsProcessing(true)

      try {
        console.log('🎤 Analyzing transcript with AI...')
        
        // Call AI to analyze and extract structured data from transcript
        const response = await fetch('/api/analyze-voice-transcript', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript })
        })

        if (response.ok) {
          const extractedData = await response.json()
          console.log('✅ Extracted data:', extractedData)
          
          // Map extracted fields to captured status
          const newCapturedFields = {
            documentType: !!extractedData.documentType,
            documentName: !!extractedData.documentName,
            projectName: !!extractedData.projectName,
            websiteUrl: !!extractedData.websiteUrl,
            supportingLinks: !!extractedData.supportingLinks,
            deadlines: !!extractedData.deadlines,
            purpose: !!extractedData.purpose,
            keyMessage: !!extractedData.keyMessage,
            audience: !!extractedData.audience,
            keyImpact: !!extractedData.keyImpact,
          }
          
          setCapturedFields(newCapturedFields)

          // Save all data to projectData - NO DATA LOSS!
          if (updateProjectData) {
            updateProjectData({
              // Core transcript
              context: transcript,
              voiceTranscript: transcript,
              
              // Populate fields from AI extraction
              documentName: extractedData.documentName || projectData.documentName || '',
              projectBrandName: extractedData.projectName || projectData.projectBrandName || '',
              websiteUrl: extractedData.websiteUrl || projectData.websiteUrl || '',
              primaryObjective: extractedData.purpose || projectData.primaryObjective || '',
              primaryAudience: extractedData.audience || projectData.primaryAudience || '',
              keyMessage: extractedData.keyMessage || projectData.keyMessage || '',
              timeline: extractedData.deadlines || projectData.timeline || '',
              
              // Store raw extracted data for reference
              voiceExtractedData: extractedData,
              
              // Store document type
              voiceDocumentType: extractedData.documentType,
              
              // Additional extracted info
              voiceKeyImpact: extractedData.keyImpact,
              voiceSupportingLinks: extractedData.supportingLinks,
            })
          }
          
          console.log('✅ Data saved to projectData!')
        } else {
          console.error('❌ Failed to analyze transcript:', response.statusText)
          // Still save the transcript even if analysis fails
          if (updateProjectData) {
            updateProjectData({
              context: transcript,
              voiceTranscript: transcript,
            })
          }
        }
      } catch (error) {
        console.error('❌ Error analyzing transcript:', error)
        // Still save the transcript even if analysis fails
        if (updateProjectData) {
          updateProjectData({
            context: transcript,
            voiceTranscript: transcript,
          })
        }
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const displayTranscript = transcript + (interimTranscript ? ' ' + interimTranscript : '')
  const sentences = displayTranscript.split(/[.!?]/).filter(s => s.trim())
  const displaySentences = sentences.slice(-3)

  const progressCount = Object.values(capturedFields).filter(Boolean).length
  const totalFields = 8

  return (
    <div className="flex gap-0 items-start justify-between w-full min-h-[600px]">
      {/* Sidebar - Show during and after recording on LEFT */}
      {(isRecording || hasRecorded) && (
        <div className="hidden lg:block">
          <VoiceRecordingSidebar 
            capturedFields={capturedFields}
            progressCount={progressCount}
            totalFields={totalFields}
            transcript={transcript}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col items-center justify-center relative transition-all duration-300 ${
        (isRecording || hasRecorded) ? 'lg:ml-[344px]' : ''
      }`}>
        {!isRecording && !hasRecorded ? (
          // Initial State - Before Recording
          <div className="flex flex-col gap-[40px] items-center w-full max-w-[455px] py-10">
            {/* Manifestr Logo */}
            <div className="flex items-center justify-center shrink-0">
              <Logo size="md" />
            </div>

            {/* Heading */}
            <div className="flex flex-col gap-[8px] items-center text-center w-full">
              <h1 className="font-hero font-semibold text-[30px] leading-[38px] text-black">
                Talk to me
              </h1>
              <p className="font-normal text-[16px] leading-[24px] text-[#52525b]">
                "Speak your brief - I'll take care of the details."
              </p>
            </div>

            {/* Start Recording Button */}
            <button
              onClick={handleStartRecording}
              className="relative w-[100px] h-[100px] rounded-full bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95"
            >
              <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm" />
              <Mic className="w-12 h-12 text-gray-700 relative z-10" strokeWidth={1.5} />
            </button>

            <p className="text-[14px] leading-[20px] text-[#6b7280] text-center">
              Click the microphone to start recording
            </p>
          </div>
        ) : isRecording ? (
          // Recording State - Active Recording
          <div className="flex flex-col gap-[32px] items-center justify-center w-full py-10">
            {/* Animated Microphone */}
            <div className="relative w-[100px] h-[100px]">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-red-500/30 animate-pulse" />
              
              {/* Microphone Button */}
              <div className="relative w-full h-full rounded-full bg-gradient-radial from-white via-gray-100 to-gray-200 shadow-2xl border-4 border-white flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/50 to-transparent" />
                <Mic className="w-12 h-12 text-gray-700 relative z-10 animate-pulse" strokeWidth={2} />
              </div>
            </div>

            {/* Status Text */}
            <div className="flex flex-col gap-[63px] items-center justify-center w-full">
              <p className="font-hero font-semibold text-[24px] leading-[32px] text-[#18181b] text-center">
                I'm Listening ...
              </p>

              {/* Transcript Display */}
              <div className="flex flex-col gap-[12px] items-center justify-center w-full max-w-[676px]">
                <h3 className="font-hero font-semibold text-[30px] leading-[38px] text-black text-center">
                  {displayTranscript ? 'Keep going...' : 'Start talking'}
                </h3>
                
                <div className="flex flex-col gap-[28px] items-start w-full">
                  {displaySentences.length > 0 ? (
                    displaySentences.map((sentence, index) => (
                      <p 
                        key={index}
                        className={`font-normal text-[14px] leading-[20px] text-center w-full transition-opacity duration-300 ${
                          index === displaySentences.length - 1 && interimTranscript 
                            ? 'text-[#6b7280]' 
                            : 'text-[#6b7280]'
                        }`}
                      >
                        {sentence.trim()}
                        {index === displaySentences.length - 1 && interimTranscript ? (
                          <span className="inline-flex w-[2px] h-[16px] bg-gray-500 ml-1 animate-pulse" />
                        ) : null}
                      </p>
                    ))
                  ) : (
                    <p className="font-normal text-[14px] leading-[20px] text-[#6b7280] text-center w-full">
                      I need to create a pitch deck for our new AI-powered productivity platform.
                      <span className="inline-flex w-[2px] h-[16px] bg-gray-500 ml-1 animate-pulse" />
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Control Buttons - Mic and Close */}
            <div className="flex items-center gap-6 mt-4">
              <button
                onClick={handleStopRecording}
                disabled={isProcessing}
                className="relative w-[48px] h-[48px] bg-[#f4f4f5] hover:bg-[#e4e4e7] rounded-[28px] flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Stop Recording"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Mic className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                )}
              </button>
              
              <button
                onClick={() => {
                  if (recognitionRef.current) {
                    recognitionRef.current.stop()
                  }
                  setIsRecording(false)
                  setTranscript('')
                  setInterimTranscript('')
                  transcriptRef.current = ''
                }}
                disabled={isProcessing}
                className="relative w-[48px] h-[48px] bg-[#f4f4f5] hover:bg-[#e4e4e7] rounded-[28px] flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cancel"
              >
                <X className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ) : (
          // Post-Recording State - Show transcript summary
          <div className="flex flex-col gap-[32px] items-center justify-center w-full max-w-[676px] py-10 px-4">
            <div className="flex flex-col gap-6 items-center w-full">
              <div className="w-[80px] h-[80px] bg-green-100 rounded-full flex items-center justify-center">
                <Mic className="w-10 h-10 text-green-600" strokeWidth={1.5} />
              </div>
              
              <div className="flex flex-col gap-2 items-center">
                <h2 className="font-hero font-semibold text-[30px] leading-[38px] text-black text-center">
                  {isProcessing ? 'Analyzing your input...' : 'Recording complete!'}
                </h2>
                <p className="text-[16px] leading-[24px] text-[#52525b] text-center">
                  {isProcessing 
                    ? 'AI is extracting key information from your brief...' 
                    : `I've captured ${progressCount} of ${totalFields} key details. Review the summary on the left and click Next to continue.`
                  }
                </p>
              </div>
            </div>

            {/* Transcript Display */}
            {!isProcessing && transcript && (
              <div className="w-full bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-[14px] font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Your Brief Transcript
                </h3>
                <p className="text-[14px] leading-[22px] text-gray-600 whitespace-pre-wrap">
                  {transcript}
                </p>
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                <span className="text-[14px] text-gray-600">Processing...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
