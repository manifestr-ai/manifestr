import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  History,
  Mic,
  FileUp,
  FileText,
  Send,
  Command,
  Upload,
  Search,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import useAiPrompter, { PromptHistoryItem } from "../../../../hooks/useAiPrompter";

interface AiPrompterPanelProps {
  store: any;
  editorType?: 'image' | 'document' | 'spreadsheet' | 'presentation' | 'chart';
  onClose?: () => void;
}

export default function AiPrompterPanel({ store, editorType = 'image', onClose }: AiPrompterPanelProps) {
  const [activeTab, setActiveTab] = useState("Freestyle");
  const [mode, setMode] = useState("Prompt Mode");
  const [isRecording, setIsRecording] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [historyFilter, setHistoryFilter] = useState("All");
  
  // Freestyle tab state
  const [freestylePrompt, setFreestylePrompt] = useState("");
  
  // Brief Me tab state
  const [briefData, setBriefData] = useState({
    whatToDo: "",
    focusArea: "",
    style: "",
    presentation: "",
    constraints: ""
  });
  
  // Voice recording state
  const recognitionRef = useRef<any>(null);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  
  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // AI Prompter hook
  const {
    isProcessing,
    error: aiError,
    history,
    modifyImage,
    modifyContent,
    generateContent,
    processVoiceInput,
    processUploadedFile,
    processBrief,
    clearHistory
  } = useAiPrompter({
    editorType,
    onSuccess: async (result) => {
      console.log('✅ AI Prompter success! Result keys:', Object.keys(result));
      console.log('📦 Result data:', result);
      console.log('📋 Editor/Store available:', !!store);
      console.log('📋 Editor type check:', editorType);

      // Update editor based on result
      if (store) {
        console.log('🔄 Calling updateEditorWithData...');
        await updateEditorWithData(result);
        console.log('✅ updateEditorWithData completed!');
        
        // Show success message to user
        setTimeout(() => {
          console.log('🎉 Document updated successfully!');
        }, 100);
      } else {
        console.error('❌ No store/editor available to update!');
        console.error('❌ This means the editor instance was not passed correctly');
        alert('Editor not available. Please refresh the page and try again.');
      }
    },
    onError: (error) => {
      console.error('❌ AI Prompter error:', error);
    }
  });
  
  // Get current editor data (image URL, spreadsheet data, or presentation data)
  const getCurrentEditorData = (): any => {
    console.log('📥 Getting current editor data for:', editorType);
    console.log('📥 Store available:', !!store);
    
    if (!store) {
      console.warn('⚠️ No store available');
      return null;
    }
    
    try {
      if (editorType === 'image') {
        // For Polotno store (image editor)
        const page = store.activePage;
        if (!page) {
          console.warn('⚠️ No active page');
          return null;
        }
        
        // Find the first image element
        const imageElement = page.children.find((child: any) => child.type === 'image');
        if (imageElement && imageElement.src) {
          console.log('✅ Got image URL:', imageElement.src);
          return imageElement.src;
        }
        
        console.warn('⚠️ No image element found');
        return null;
      } else if (editorType === 'document') {
        // For Tiptap editor (HTML content)
        // Get HTML content from editor
        if (store && store.getHTML) {
          const html = store.getHTML();
          console.log('✅ Got document HTML, length:', html?.length || 0);
          return html;
        } else if (store && store.state) {
          // Fallback: Try to get HTML from editor state
          console.log('⚠️ Using fallback method to get HTML');
          return null;
        } else {
          console.warn('⚠️ Store does not have getHTML method');
          console.log('📋 Store type:', typeof store);
          console.log('📋 Store methods:', store ? Object.keys(store).filter(k => typeof store[k] === 'function').slice(0, 10) : 'no store');
          return null;
        }
      } else if (editorType === 'presentation') {
        // For Polotno store (presentation editor)
        // Get complete presentation JSON
        if (store.toJSON) {
          const data = store.toJSON();
          console.log('✅ Got presentation data, pages:', data?.pages?.length);
          return data;
        } else {
          console.warn('⚠️ Store does not have toJSON method');
          return null;
        }
      } else if (editorType === 'spreadsheet') {
        // For Univer (spreadsheet editor)
        // Get current spreadsheet data from store (univerAPI)
        console.log('📋 Store type:', typeof store);
        console.log('📋 Store has getActiveWorkbook:', typeof store.getActiveWorkbook === 'function');
        
        try {
          // The store is the univerAPI object
          if (store.getActiveWorkbook) {
            const workbook = store.getActiveWorkbook();
            
            if (!workbook) {
              console.warn('⚠️ No active workbook found');
              return null;
            }
            
            console.log('✅ Got active workbook');
            
            // Get workbook data as JSON
            if (workbook.save) {
              const data = workbook.save();
              console.log('✅ Got workbook data via save()');
              console.log('✅ Data keys:', Object.keys(data).slice(0, 10));
              return data;
            } else if (workbook.getSnapshot) {
              const data = workbook.getSnapshot();
              console.log('✅ Got workbook data via getSnapshot()');
              return data;
            } else {
              console.error('❌ Workbook has no save() or getSnapshot() method');
              return null;
            }
          } else if (store.getData) {
            // Fallback for different API structure
            const data = store.getData();
            console.log('✅ Got data via getData()');
            return data;
          } else {
            console.error('❌ Store has no getActiveWorkbook() or getData() method');
            console.error('❌ Available methods:', Object.keys(store).filter(k => typeof store[k] === 'function').slice(0, 20));
            return null;
          }
        } catch (error) {
          console.error('❌ Error extracting workbook data:', error);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting current editor data:', error);
      return null;
    }
  };
  
  // Update editor with new data (image, spreadsheet, or presentation)
  const updateEditorWithData = async (result: any) => {
    if (!store) return;
    
    try {
      if (editorType === 'image' && result.imageUrl) {
        // Update image editor
        const page = store.activePage;
        if (!page) return;
        
        // Find existing image element or create new one
        let imageElement = page.children.find((child: any) => child.type === 'image');
        
        if (imageElement) {
          // Update existing image
          imageElement.set({ src: result.imageUrl });
          console.log('✅ Updated existing image element');
        } else {
          // Create new image element
          page.addElement({
            type: 'image',
            src: result.imageUrl,
            x: 0,
            y: 0,
            width: page.width,
            height: page.height
          });
          console.log('✅ Created new image element');
        }
      } else if (editorType === 'document' && result.documentData) {
        // Update document editor (Tiptap - HTML content)
        console.log('📝 Updating document with new HTML');
        console.log('📄 New HTML length:', result.documentData?.length || 0);
        console.log('📋 Store available:', !!store);
        console.log('📋 Store type:', typeof store);
        
        try {
          // Verify editor instance
          if (!store) {
            console.error('❌ No editor instance available');
            alert('Editor not ready. Please try again.');
            return;
          }

          // Log available methods for debugging
          if (store.commands) {
            console.log('✅ Editor has commands object');
          }
          
          // Tiptap setContent method (Primary method)
          if (store.commands && typeof store.commands.setContent === 'function') {
            console.log('🔄 Calling editor.commands.setContent()...');
            const success = store.commands.setContent(result.documentData);
            console.log('✅ setContent result:', success);
            console.log('✅ Document HTML updated successfully!');
            console.log('✅ You should see the changes in the editor now!');
          } else if (store.setContent && typeof store.setContent === 'function') {
            // Alternative method 1
            console.log('🔄 Calling editor.setContent()...');
            store.setContent(result.documentData);
            console.log('✅ Document updated successfully using setContent');
          } else if (store.setHTML && typeof store.setHTML === 'function') {
            // Alternative method 2
            console.log('🔄 Calling editor.setHTML()...');
            store.setHTML(result.documentData);
            console.log('✅ Document updated successfully using setHTML');
          } else {
            console.error('❌ Could not find method to update document HTML');
            console.log('📋 Available store properties:', Object.keys(store).slice(0, 30));
            console.log('📋 Commands available:', store.commands ? Object.keys(store.commands).slice(0, 30) : 'no commands');
            alert('Failed to update document. The editor API might have changed. Please refresh the page and try again.');
          }
        } catch (updateError) {
          console.error('❌ Error updating document HTML:', updateError);
          console.error('❌ Error details:', updateError);
          alert('Failed to update document: ' + (updateError instanceof Error ? updateError.message : String(updateError)));
        }
      } else if (editorType === 'presentation' && result.presentationData) {
        // Update presentation editor (Polotno)
        console.log('📽️  Updating presentation with new data:', result.presentationData);
        
        try {
          // Polotno loadJSON method to replace entire presentation
          if (store.loadJSON) {
            store.loadJSON(result.presentationData);
            console.log('✅ Presentation updated successfully using loadJSON');
          } else if (store.clear && store.addPage) {
            // Fallback: Clear all pages and add new ones
            store.clear();
            const pages = result.presentationData.pages || [];
            pages.forEach((pageData: any) => {
              const page = store.addPage(pageData);
              console.log('✅ Added page:', page.id);
            });
            console.log('✅ Presentation updated successfully via clear/addPage');
          } else {
            console.warn('⚠️ Could not find method to update presentation');
            console.log('💡 Try refreshing the page to see updated presentation');
          }
        } catch (loadError) {
          console.error('❌ Error loading presentation JSON:', loadError);
          console.log('💡 Consider refreshing the page to see updated presentation');
        }
      } else if (editorType === 'spreadsheet' && result.spreadsheetData) {
        // Update spreadsheet editor (Univer)
        console.log('📊 Updating spreadsheet with new data');
        console.log('📋 New data keys:', Object.keys(result.spreadsheetData).slice(0, 10));
        
        try {
          // The store is the univerAPI object
          if (store.getActiveWorkbook && store.disposeUnit && store.createWorkbook) {
            // Get current workbook to get its ID
            const currentWorkbook = store.getActiveWorkbook();
            
            if (currentWorkbook) {
              const workbookId = currentWorkbook.getUnitId();
              console.log('📋 Current workbook ID:', workbookId);
              console.log('📋 Disposing current workbook...');
              
              // Dispose current workbook
              store.disposeUnit(workbookId);
              console.log('✅ Workbook disposed');
              
              // Small delay to ensure disposal is complete
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Create new workbook with updated data
              console.log('📋 Creating new workbook with AI-modified data...');
              const newWorkbook = store.createWorkbook(result.spreadsheetData);
              
              // Verify new workbook was created
              await new Promise(resolve => setTimeout(resolve, 200));
              const verifyWorkbook = store.getActiveWorkbook();
              
              if (verifyWorkbook) {
                console.log('✅ New workbook created successfully!');
                console.log('✅ New workbook ID:', verifyWorkbook.getUnitId());
                console.log('✅ Spreadsheet updated! Changes should be visible now.');
              } else {
                console.error('❌ Failed to create new workbook');
              }
            } else {
              console.warn('⚠️ No active workbook to replace');
            }
          } else if (store.setData) {
            // Fallback 1
            store.setData(result.spreadsheetData);
            console.log('✅ Spreadsheet updated via setData()');
          } else if (store.loadData) {
            // Fallback 2
            store.loadData(result.spreadsheetData);
            console.log('✅ Spreadsheet updated via loadData()');
          } else {
            console.warn('⚠️ Could not find method to update spreadsheet data');
            console.log('💡 Available methods:', Object.keys(store).filter(k => typeof store[k] === 'function').slice(0, 20));
            console.log('💡 Consider refreshing the page to see updated spreadsheet');
          }
        } catch (updateError) {
          console.error('❌ Error updating spreadsheet:', updateError);
          console.log('💡 Consider refreshing the page to see updated spreadsheet');
        }
      }
    } catch (error) {
      console.error('❌ Error updating editor:', error);
    }
  };
  
  // Handle Freestyle prompt submission
  const handleFreestyleSubmit = async () => {
    if (!freestylePrompt.trim()) return;
    
    const currentData = getCurrentEditorData();
    
    try {
      if (currentData) {
        await modifyContent(freestylePrompt, currentData, 'Freestyle');
      } else {
        await generateContent(freestylePrompt, 'Freestyle');
      }
      
      // Clear input on success
      setFreestylePrompt("");
    } catch (error) {
      // Error is already handled by the hook
    }
  };
  
  // Handle voice recording with Web Speech API
  const startRecording = () => {
    try {
      // Check if browser supports Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        console.log('🎤 Voice recognition started');
        setIsRecording(true);
        setVoiceTranscript("");
      };
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setVoiceTranscript(prev => (prev + finalTranscript).trim());
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing...');
        } else {
          alert(`Speech recognition error: ${event.error}`);
          setIsRecording(false);
        }
      };
      
      recognition.onend = () => {
        console.log('🎤 Voice recognition ended');
        setIsRecording(false);
        
        // Process the transcript if we have one
        if (voiceTranscript.trim()) {
          handleVoiceTranscript(voiceTranscript);
        }
      };
      
      recognition.start();
      recognitionRef.current = recognition;
      
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      alert('Failed to start speech recognition. Please check microphone permissions.');
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Handle the transcribed voice input
  const handleVoiceTranscript = async (transcript: string) => {
    if (!transcript.trim()) {
      alert('No speech was detected. Please try again.');
      return;
    }
    
    console.log('🎤 Processing transcript:', transcript);
    
    const currentData = getCurrentEditorData();
    
    try {
      if (currentData) {
        await modifyContent(transcript, currentData, 'Talk To Me');
      } else {
        await generateContent(transcript, 'Talk To Me');
      }
      
      // Clear transcript on success
      setVoiceTranscript("");
    } catch (error) {
      // Error is already handled by the hook
      console.error('Failed to process voice input:', error);
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5 MB');
      return;
    }
    
    // Validate file type based on editor type
    if (editorType === 'image' && !file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    if (editorType === 'spreadsheet' && !['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)) {
      alert('Please upload a CSV or Excel file');
      return;
    }
    
    const currentData = getCurrentEditorData();
    
    try {
      await processUploadedFile(file, currentData || undefined);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Error is already handled by the hook
    }
  };
  
  // Handle Brief Me submission
  const handleBriefSubmit = async () => {
    // Validate that at least one field is filled
    const hasContent = Object.values(briefData).some(val => val.trim());
    if (!hasContent) {
      alert('Please fill in at least one field');
      return;
    }
    
    const currentData = getCurrentEditorData();
    
    try {
      await processBrief(briefData, currentData || undefined);
      
      // Clear form on success
      setBriefData({
        whatToDo: "",
        focusArea: "",
        style: "",
        presentation: "",
        constraints: ""
      });
    } catch (error) {
      // Error is already handled by the hook
    }
  };
  
  // Keyboard shortcut for Freestyle (Cmd/Ctrl + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (activeTab === 'Freestyle' && mode === 'Prompt Mode') {
          handleFreestyleSubmit();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, mode, freestylePrompt]);
  
  // Filter history based on search and filter
  const filteredHistory = history.filter(item => {
    // Apply type filter
    if (historyFilter !== 'All' && item.type !== historyFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery && !item.prompt.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const prompterTabs = [
    { name: "Freestyle", icon: Sparkles },
    { name: "Talk To Me", icon: Mic },
    { name: "Dropzone", icon: Upload },
    { name: "Brief Me", icon: FileText },
  ];
  
  // Helper function to get icon and color for history item type
  const getHistoryItemStyle = (type: PromptHistoryItem['type']) => {
    switch (type) {
      case 'Freestyle':
        return {
          icon: Sparkles,
          color: "bg-[linear-gradient(135deg,_#C27AFF_0%,_#9810FA_100%)] text-white"
        };
      case 'Talk To Me':
        return {
          icon: Mic,
          color: "bg-[linear-gradient(135deg,_#51A2FF_0%,_#155DFC_100%)] text-white"
        };
      case 'Brief Me':
        return {
          icon: FileText,
          color: "bg-[linear-gradient(135deg,_#FFB900_0%,_#E17100_100%)] text-white"
        };
      case 'Dropzone':
        return {
          icon: Upload,
          color: "bg-[linear-gradient(135deg,_#05DF72_0%,_#00A63E_100%)] text-white"
        };
      default:
        return {
          icon: Sparkles,
          color: "bg-[linear-gradient(135deg,_#C27AFF_0%,_#9810FA_100%)] text-white"
        };
    }
  };

  return (
    <div
      className="w-full border-t border-[#D1D5DB]/30 relative"
      style={{
        background:
          "linear-gradient(135deg, #E2E8F0 0%, #F3F4F6 50%, #E4E4E7 100%)",
      }}
    >
      {/* Close Button - Top Right */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group"
          title="Close AI Prompter"
        >
          <X className="w-4 h-4 text-[#6B7280] group-hover:text-[#1F2937]" />
        </button>
      )}
      
      {/* Warning if editor not ready (for document editor) */}
      {editorType === 'document' && !store && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Editor is loading...</strong> Please wait a moment for the editor to initialize, then try again.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4 sm:p-6 space-y-6 mx-auto max-w-full">
        {/* Row 1: Toggles */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div
            className="
              flex gap-1
              p-1
              w-full sm:w-[323.383px]
              h-[46px]
              rounded-[16777200px]
              border
              border-white/80
              bg-white/50
              shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)]
            "
          >
            {["Prompt Mode", "History"].map((t) => (
              <button
                key={t}
                onClick={() => setMode(t)}
                className={`flex items-center gap-[8.4px] pl-[15px] sm:pl-[25.2px] w-1/2 sm:w-[167.475px] h-[37.8px] rounded-[16777200px] text-[13px] font-semibold transition-all
                  ${
                    mode === t
                      ? "bg-gradient-to-r from-[#90A1B9] to-[#6A7282] text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]"
                      : "text-[#64748B] hover:text-[#334155] bg-white/50 border border-white/80"
                  }
                `}
                style={{
                  background:
                    mode === t
                      ? "linear-gradient(90deg, #90A1B9 0%, #6A7282 100%)"
                      : undefined,
                }}
              >
                {t === "Prompt Mode" ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : (
                  <History className="w-3.5 h-3.5" />
                )}
                {t}
                {t === "History" && (
                  <span className="bg-[#BDC5D0] text-[#475569] px-1.5 rounded-md text-[10px] font-bold">
                    {history.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
            <Loader2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 animate-spin" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">Processing your request...</p>
              <p className="text-xs text-blue-600 mt-0.5">This may take 20-30 seconds. Please wait.</p>
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {aiError && !isProcessing && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-xs text-red-600 mt-0.5">{aiError}</p>
            </div>
          </div>
        )}

        {mode === "Prompt Mode" && (
          <div>
            {/* Row 2: Tabs */}
            <div className="flex flex-wrap items-center h-auto sm:h-10 gap-2 sm:gap-0">
              {prompterTabs.map((tab, idx) => (
                <div key={tab.name} className="flex items-center">
                  <button
                    onClick={() => setActiveTab(tab.name)}
                    disabled={isProcessing}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === tab.name
                        ? "bg-white text-[#1E293B] shadow-sm border border-[#E2E8F0]"
                        : "text-[#64748B] hover:bg-slate-200/50"
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <tab.icon
                      className={`w-4 h-4 ${activeTab === tab.name ? "text-[#1E293B]" : "text-[#94A3B8]"}`}
                    />
                    <span
                      className="text-[#314158] font-inter text-[14px] not-italic font-normal leading-[20px] tracking-[-0.15px]"
                      style={{
                        color: "#314158",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "20px",
                        letterSpacing: "-0.15px",
                      }}
                    >
                      {tab.name}
                    </span>
                  </button>
                  {idx < prompterTabs.length - 1 && (
                    <div className="hidden sm:block w-[1px] h-4 bg-[#CBD5E1] mx-4" />
                  )}
                </div>
              ))}
            </div>
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #CAD5E2",
                margin: "20px 0",
              }}
            />

            {/* Row 3: Freestyle */}
            {activeTab === "Freestyle" && (
              <div
                className="self-stretch rounded-[24px] border border-white/90 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-4 sm:p-6 space-y-5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(144, 161, 185, 0.10) 0%, rgba(0, 0, 0, 0.00) 50%, rgba(159, 159, 169, 0.10) 100%)",
                }}
              >
                <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
                  <div
                    className="flex justify-center items-center rounded-[16px] w-10 h-10 mb-2 sm:mb-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #90A1B9 0%, #6A7282 100%)",
                      boxShadow:
                        "0 20px 25px -5px rgba(98, 116, 142, 0.40), 0 8px 10px -6px rgba(98, 116, 142, 0.40)",
                    }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>

                  <h2
                    className="font-inter text-base sm:text-lg"
                    style={{
                      color: "#0A0A0A",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "24px",
                      letterSpacing: "-0.312px",
                    }}
                  >
                    What would you like to change?
                  </h2>
                </div>

                <div className="relative">
                  <textarea
                    value={freestylePrompt}
                    onChange={(e) => setFreestylePrompt(e.target.value)}
                    disabled={isProcessing}
                    placeholder="Describe what you'd like to modify... For example: 'Change the header to navy blue, make the buttons larger, and add spacing between sections.'"
                    className="
                      flex
                      w-full
                      h-[110px] sm:h-[140px]
                      p-2
                      px-3
                      items-start
                      flex-shrink-0
                      self-stretch
                      rounded-[16px]
                      border
                      border-white/80
                      bg-white/50
                      shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]
                      text-[#374151]
                      resize-none
                      text-[15px]
                      leading-relaxed
                      placeholder:text-[#94A3B8]
                      font-medium
                      focus:ring-0
                      border-solid
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-[#E5E7EB] gap-3 sm:gap-0">
                  <div className="flex items-center gap-3 sm:gap-4 text-[#6B7280] font-medium mb-2 sm:mb-0">
                    <span
                      className="bg-white/80 px-3 py-1 rounded-full border border-[#E5E7EB] shadow-sm text-[#0A0A0A] text-xs sm:text-sm"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      {freestylePrompt.length} characters
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1">
                      <span className="text-[12px] sm:text-[14px]">Press</span>
                      <div className="flex items-center gap-1 border border-[#D1D5DB] rounded-md px-1.5 py-0.5 min-w-[20px] justify-center bg-[#F9FAFB] shadow-[0_1px_0_#9CA3AF]">
                        <Command className="w-3 h-3" />
                      </div>
                      <span className="text-[#9CA3AF]">+</span>
                      <div className="flex items-center gap-1 border border-[#D1D5DB] rounded-md px-2 py-0.5 bg-[#F9FAFB] shadow-[0_1px_0_#9CA3AF]">
                        <span className="text-[10px] font-bold">Enter</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleFreestyleSubmit}
                    disabled={isProcessing || !freestylePrompt.trim()}
                    className="
                      flex
                      justify-center
                      items-center
                      gap-2
                      rounded-[16px]
                      border
                      border-white/40
                      shadow-[0_25px_50px_-12px_rgba(98,116,142,0.50)]
                      transition-all
                      active:scale-95
                      bg-gradient-to-r from-[#62748E] to-[#4A5565]
                      px-[10px] sm:px-[12.93px]
                      py-[8px] sm:py-[8.5px]
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      disabled:active:scale-100
                    "
                    style={{
                      color: "#FFF",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "20px",
                      letterSpacing: "-0.15px",
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            {/* Row 3: Talk To Me */}
            {activeTab === "Talk To Me" && (
              <div
                className="flex flex-col items-center justify-center rounded-[24px] border border-white/90 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(144, 161, 185, 0.10) 0%, rgba(0, 0, 0, 0.00) 50%, rgba(159, 159, 169, 0.10) 100%)",
                }}
              >
                <div className="flex flex-col items-center gap-1 p-6 sm:p-10">
                  <div className="flex flex-col items-center gap-2 mb-8 sm:mb-10">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          display: "flex",
                          width: "40px",
                          height: "40px",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "16px",
                          background:
                            "linear-gradient(135deg, #90A1B9 0%, #6A7282 100%)",
                          boxShadow:
                            "0 20px 25px -5px rgba(98, 116, 142, 0.40), 0 8px 10px -6px rgba(98, 116, 142, 0.40)",
                          color: "#fff",
                        }}
                      >
                        <Mic className="w-5 h-5" />
                      </div>

                      <h2
                        className="text-lg sm:text-2xl"
                        style={{
                          color: "#0A0A0A",
                          textAlign: "center",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "24px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "32px",
                          letterSpacing: "0.07px",
                        }}
                      >
                        Talk To Me
                      </h2>
                    </div>
                    <p
                      style={{
                        color: "#45556C",
                        textAlign: "center",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "20px",
                        letterSpacing: "-0.15px",
                      }}
                      className="mt-2"
                    >
                      Click the microphone to start recording your prompt
                    </p>
                  </div>
                  <div className="relative">
                    {isRecording && (
                      <div className="absolute inset-0 bg-[#7C8797] rounded-full opacity-70 animate-pulse" />
                    )}
                    <button
                      onClick={toggleRecording}
                      disabled={isProcessing && !isRecording}
                      className={`relative z-10 w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                      style={{
                        borderRadius: "16777200px",
                        background:
                          "linear-gradient(135deg, #90A1B9 0%, #6A7282 100%)",
                        boxShadow: "0 25px 50px -12px rgba(98, 116, 142, 0.40)",
                        transform: isRecording ? "scale(1.10)" : "scale(1)",
                      }}
                    >
                      {isProcessing && !isRecording ? (
                        <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-spin" />
                      ) : (
                        <Mic
                          className={`w-8 h-8 sm:w-12 sm:h-12 text-white transition-all ${isRecording ? "animate-pulse" : ""}`}
                        />
                      )}
                    </button>
                  </div>

                  <p
                    style={{
                      color: "#45556C",
                      textAlign: "center",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "20px",
                      letterSpacing: "-0.15px",
                    }}
                    className="mt-8 sm:mt-10"
                  >
                    {isProcessing && !isRecording
                      ? "Processing..."
                      : isRecording
                      ? voiceTranscript || "Listening... (tap to stop and send)"
                      : "Ready to record"}
                  </p>
                  
                  {/* Show transcript while recording */}
                  {isRecording && voiceTranscript && (
                    <div className="mt-4 px-6 py-3 bg-white/80 rounded-xl border border-[#E2E8F0] max-w-md mx-auto">
                      <p className="text-sm text-[#45556C] font-medium mb-1">Transcript:</p>
                      <p className="text-sm text-[#1E293B]">{voiceTranscript}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Row 3: Dropzone */}
            {activeTab === "Dropzone" && (
              <div
                className="flex flex-col items-center justify-center rounded-[24px] border border-white/90 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(144, 161, 185, 0.10) 0%, rgba(0, 0, 0, 0.00) 50%, rgba(159, 159, 169, 0.10) 100%)",
                }}
              >
                <div className="flex flex-col items-center gap-2 sm:gap-4 p-6 sm:p-10">
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative flex items-center justify-center w-12 h-12 sm:w-[56px] sm:h-[56px] mb-2 sm:mb-3 ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                          >
                            <path
                              d="M24 6V30"
                              stroke="#45556C"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M34 16L24 6L14 16"
                              stroke="#45556C"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M42 30V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V30"
                              stroke="#45556C"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span
                          className="text-[#1D293D] text-center font-inter text-[16px] not-italic font-normal leading-6 tracking-[-0.312px] mb-1 w-full block"
                          style={{
                            color: "#1D293D",
                            textAlign: "center",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "24px",
                            letterSpacing: "-0.312px",
                          }}
                        >
                          Upload Logo
                        </span>
                      </div>
                      <span className="text-[#64748B] text-xs sm:text-sm mt-1">
                        Images must be less than{" "}
                        <span className="font-medium text-[#4B5563]">5 MB</span>{" "}
                        in size
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 w-full">
                      <button
                        type="button"
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-[14px] border border-[rgba(202,213,226,0.80)] bg-[rgba(255,255,255,0.80)] hover:bg-[#F3F4F6] text-[#0A0A0A] font-medium transition focus:outline-none shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] w-full sm:w-auto"
                      >
                        <span className="text-xl leading-none">+</span>
                        Import from drive
                      </button>
                      <label
                        htmlFor="file-upload"
                        className={`
                          flex items-center gap-2 px-3 sm:px-4 py-2 rounded-[14px]
                          border border-white/40
                          bg-gradient-to-r from-[#62748E] to-[#4A5565]
                          shadow-[0_10px_15px_-3px_rgba(98,116,142,0.30),0_4px_6px_-4px_rgba(98,116,142,0.30)]
                          text-white font-medium
                          cursor-pointer transition hover:from-[#4A5565] hover:to-[#334155]
                          w-full sm:w-auto
                          ${isProcessing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                        `}
                        tabIndex={0}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 text-white animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-1 text-white" />
                            Click to upload
                          </>
                        )}
                        <input
                          ref={fileInputRef}
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isProcessing}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Row 3: Brief Me */}
            {activeTab === "Brief Me" && (
              <div
                className="flex flex-col items-center justify-center rounded-[24px] border border-white/90 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(144, 161, 185, 0.10) 0%, rgba(0, 0, 0, 0.00) 50%, rgba(159, 159, 169, 0.10) 100%)",
                }}
              >
                <div className="w-full px-3 py-4 sm:p-8 sm:pt-5">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <div
                      style={{
                        display: "flex",
                        width: "40px",
                        height: "40px",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #90A1B9 0%, #6A7282 100%)",
                        boxShadow:
                          "0 20px 25px -5px rgba(98, 116, 142, 0.40), 0 8px 10px -6px rgba(98, 116, 142, 0.40)",
                        color: "#fff",
                      }}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    <h2
                      className="text-lg sm:text-2xl"
                      style={{
                        color: "#0A0A0A",
                        textAlign: "center",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "24px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "32px",
                        letterSpacing: "0.07px",
                      }}
                    >
                      Brief Me
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label
                        className="mb-1"
                        style={{
                          color: "#314158",
                          fontFamily: "Inter",
                          fontSize: "12px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "16px",
                        }}
                      >
                        What do you want to do?
                      </label>
                      <input
                        type="text"
                        value={briefData.whatToDo}
                        onChange={(e) => setBriefData({...briefData, whatToDo: e.target.value})}
                        disabled={isProcessing}
                        className="
                          flex
                          h-[45px]
                          p-[8px_12px]
                          items-start
                          flex-shrink-0
                          self-stretch
                          rounded-[14px]
                          border border-white/80
                          bg-white/50
                          shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]
                          text-sm
                          placeholder-[#717182]
                          focus:outline-none
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                        placeholder="Describe what you want to create or modify..."
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        className="mb-1"
                        style={{
                          color: "#314158",
                          fontFamily: "Inter",
                          fontSize: "12px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "16px",
                        }}
                      >
                        Which part should I focus on?
                      </label>
                      <input
                        type="text"
                        value={briefData.focusArea}
                        onChange={(e) => setBriefData({...briefData, focusArea: e.target.value})}
                        disabled={isProcessing}
                        className="
                          flex
                          h-[45px]
                          p-[8px_12px]
                          items-start
                          flex-shrink-0
                          self-stretch
                          rounded-[14px]
                          border border-white/80
                          bg-white/50
                          shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]
                          text-sm
                          focus:outline-none
                          placeholder-[#717182]
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                        placeholder="Specify the area or component..."
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        className="mb-1"
                        style={{
                          color: "#314158",
                          fontFamily: "Inter",
                          fontSize: "12px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "16px",
                        }}
                      >
                        How should it sound or look?
                      </label>
                      <input
                        type="text"
                        value={briefData.style}
                        onChange={(e) => setBriefData({...briefData, style: e.target.value})}
                        disabled={isProcessing}
                        className="
                          flex
                          h-[45px]
                          p-[8px_12px]
                          items-start
                          flex-shrink-0
                          self-stretch
                          rounded-[14px]
                          border border-white/80
                          bg-white/50
                          shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]
                          text-sm
                          placeholder-[#717182]
                          focus:outline-none
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                        placeholder="Describe the style, tone, or aesthetic..."
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        className="mb-1"
                        style={{
                          color: "#314158",
                          fontFamily: "Inter",
                          fontSize: "12px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "16px",
                        }}
                      >
                        How do you want it presented?
                      </label>
                      <input
                        type="text"
                        value={briefData.presentation}
                        onChange={(e) => setBriefData({...briefData, presentation: e.target.value})}
                        disabled={isProcessing}
                        className="
                          flex
                          h-[45px]
                          p-[8px_12px]
                          items-start
                          flex-shrink-0
                          self-stretch
                          rounded-[14px]
                          border border-white/80
                          bg-white/50
                          shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]
                          text-sm
                          placeholder-[#717182]
                          focus:outline-none
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                        placeholder="Specify the format or presentation..."
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mt-2 sm:mt-4">
                    <label
                      className="mb-1"
                      style={{
                        color: "#314158",
                        fontFamily: "Inter",
                        fontSize: "12px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "16px",
                      }}
                    >
                      Anything specific you want to include or avoid?
                    </label>
                    <input
                      type="text"
                      value={briefData.constraints}
                      onChange={(e) => setBriefData({...briefData, constraints: e.target.value})}
                      disabled={isProcessing}
                      className="
                        flex
                        h-[45px]
                        p-[8px_12px]
                        items-start
                        flex-shrink-0
                        self-stretch
                        rounded-[14px]
                        border border-white/80
                        bg-white/50
                        shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]
                        text-sm
                        placeholder-[#717182]
                        focus:outline-none
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                      placeholder="List any specific requirements or constraints..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleBriefSubmit}
                    disabled={isProcessing || !Object.values(briefData).some(val => val.trim())}
                    className="
                      w-full mt-4 sm:mt-8
                      flex items-center justify-center
                      text-white
                      font-semibold
                      text-base
                      py-2
                      transition
                      hover:bg-[#475569]
                      disabled:bg-[#CBD5E1]
                      disabled:cursor-not-allowed
                    "
                    style={{
                      borderRadius: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.40)",
                      background:
                        "linear-gradient(90deg, #62748E 0%, #4A5565 100%)",
                      boxShadow: "0 25px 50px -12px rgba(98, 116, 142, 0.50)",
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_10665_105076)">
                            <path
                              d="M9.68924 14.4572C9.71456 14.5203 9.75859 14.5742 9.81542 14.6116C9.87224 14.6489 9.93914 14.668 10.0071 14.6663C10.0751 14.6646 10.141 14.6421 10.1958 14.6018C10.2506 14.5616 10.2918 14.5055 10.3139 14.4412L14.6472 1.77454C14.6686 1.71547 14.6726 1.65154 14.659 1.59024C14.6453 1.52894 14.6145 1.4728 14.57 1.42839C14.5256 1.38398 14.4695 1.35314 14.4082 1.33947C14.3469 1.3258 14.283 1.32987 14.2239 1.35121L1.55723 5.68454C1.4929 5.7066 1.43685 5.74782 1.39662 5.80266C1.35638 5.85749 1.33388 5.92332 1.33214 5.99131C1.3304 6.05931 1.3495 6.1262 1.38687 6.18303C1.42425 6.23985 1.47811 6.28388 1.54123 6.30921L6.8279 8.42921C6.99503 8.49612 7.14687 8.59618 7.27428 8.72336C7.40169 8.85054 7.50202 9.0022 7.56924 9.16921L9.68924 14.4572Z"
                              stroke="white"
                              strokeWidth="1.33333"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14.5707 1.43115L7.27734 8.72382"
                              stroke="white"
                              strokeWidth="1.33333"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_10665_105076">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <span className="ml-2">Generate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {mode === "History" && (
          <div>
            {!history || history.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center w-full h-[140px] sm:h-[200px]"
                style={{
                  minHeight: "120px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.90)",
                  background: "rgba(255, 255, 255, 0.80)",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
                }}
              >
                <div
                  className="flex flex-col items-center justify-center"
                  style={{ gap: "10px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      height: "46px",
                      width: "44px",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "16777200px",
                      background: "rgba(255, 255, 255, 0.70)",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M3 12C3 13.78 3.52784 15.5201 4.51677 17.0001C5.50571 18.4802 6.91131 19.6337 8.55585 20.3149C10.2004 20.9961 12.01 21.1743 13.7558 20.8271C15.5016 20.4798 17.1053 19.6226 18.364 18.364C19.6226 17.1053 20.4798 15.5016 20.8271 13.7558C21.1743 12.01 20.9961 10.2004 20.3149 8.55585C19.6337 6.91131 18.4802 5.50571 17.0001 4.51677C15.5201 3.52784 13.78 3 12 3C9.48395 3.00947 7.06897 3.99122 5.26 5.74L3 8"
                        stroke="#90A1B9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 3V8H8"
                        stroke="#90A1B9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 7V12L16 14"
                        stroke="#90A1B9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div
                    style={{
                      color: "#45556C",
                      textAlign: "center",
                      fontFamily: "Inter",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "16px",
                    }}
                  >
                    No history yet
                  </div>

                  <div
                    style={{
                      color: "#62748E",
                      textAlign: "center",
                      fontFamily: "Inter",
                      fontSize: "10px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "15px",
                      letterSpacing: "0.117px",
                    }}
                    className="mt-1 mb-3"
                  >
                    Your prompts will appear here
                  </div>

                  <button
                    className="
                      flex items-center gap-1.5
                      text-[#0A0A0A]
                      font-inter
                      text-[14px] font-medium
                      px-4 py-[7px]
                      transition-all
                      leading-[15px]
                      tracking-[0.117px]
                    "
                    onClick={() => setMode("Prompt Mode")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_10665_106407)">
                        <path
                          d="M7.34496 1.87581C7.37353 1.72287 7.45468 1.58475 7.57436 1.48535C7.69404 1.38595 7.84472 1.33154 8.00029 1.33154C8.15587 1.33154 8.30655 1.38595 8.42623 1.48535C8.54591 1.58475 8.62706 1.72287 8.65563 1.87581L9.35629 5.58114C9.40606 5.84457 9.53408 6.08688 9.72365 6.27645C9.91322 6.46602 10.1555 6.59404 10.419 6.64381L14.1243 7.34447C14.2772 7.37304 14.4154 7.45419 14.5147 7.57387C14.6141 7.69355 14.6686 7.84423 14.6686 7.99981C14.6686 8.15538 14.6141 8.30606 14.5147 8.42574C14.4154 8.54542 14.2772 8.62657 14.1243 8.65514L10.419 9.35581C10.1555 9.40557 9.91322 9.53359 9.72365 9.72316C9.53408 9.91273 9.40606 10.155 9.35629 10.4185L8.65563 14.1238C8.62706 14.2767 8.54591 14.4149 8.42623 14.5143C8.30655 14.6137 8.15587 14.6681 8.00029 14.6681C7.84472 14.6681 7.69404 14.6137 7.57436 14.5143C7.45468 14.4149 7.37353 14.2767 7.34496 14.1238L6.64429 10.4185C6.59453 10.155 6.46651 9.91273 6.27694 9.72316C6.08737 9.53359 5.84506 9.40557 5.58163 9.35581L1.87629 8.65514C1.72336 8.62657 1.58524 8.54542 1.48584 8.42574C1.38644 8.30606 1.33203 8.15538 1.33203 7.99981C1.33203 7.84423 1.38644 7.69355 1.48584 7.57387C1.58524 7.45419 1.72336 7.37304 1.87629 7.34447L5.58163 6.64381C5.84506 6.59404 6.08737 6.46602 6.27694 6.27645C6.46651 6.08688 6.59453 5.84457 6.64429 5.58114L7.34496 1.87581Z"
                          stroke="#0A0A0A"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.332 1.3335V4.00016"
                          stroke="#0A0A0A"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.6667 2.66666H12"
                          stroke="#0A0A0A"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.66536 14.6667C3.40174 14.6667 3.9987 14.0697 3.9987 13.3333C3.9987 12.597 3.40174 12 2.66536 12C1.92898 12 1.33203 12.597 1.33203 13.3333C1.33203 14.0697 1.92898 14.6667 2.66536 14.6667Z"
                          stroke="#0A0A0A"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_10665_106407">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    Back to Prompter
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 sm:left-5 flex items-center pointer-events-none">
                    <div
                      className="flex justify-center items-center text-white"
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg, #90A1B9 0%, #99A1AF 50%, #62748E 100%)",
                        boxShadow:
                          "0 0 0 2px rgba(255, 255, 255, 0.60), 0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
                      }}
                    >
                      <Search className="w-4 h-4" />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Search your prompt history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 sm:h-14 pl-12 sm:pl-16 pr-2 sm:pr-6 outline-none transition-all"
                    style={{
                      borderRadius: "16px",
                      border: "2px solid rgba(255, 255, 255, 0.90)",
                      background:
                        "linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.90) 50%, rgba(255, 255, 255, 0.95) 100%)",
                      boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.12)",
                      color: "#90A1B9",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                      letterSpacing: "-0.15px",
                    }}
                  />
                </div>

                {/* History Filters */}
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button
                    onClick={() => setHistoryFilter("All")}
                    className={`flex justify-center items-center text-white text-[13px] font-semibold transition-all whitespace-nowrap`}
                    style={{
                      padding: "4px",
                      borderRadius: "8px",
                      background:
                        historyFilter === "All"
                          ? "linear-gradient(90deg, #62748E 0%, #4A5565 100%)"
                          : "rgba(255, 255, 255, 0.70)",
                      boxShadow:
                        historyFilter === "All"
                          ? "0 0 0 1px rgba(255, 255, 255, 0.20), 0 2px 8px -1px rgba(0, 0, 0, 0.30)"
                          : undefined,
                      color: historyFilter === "All" ? "#fff" : "#64748B",
                    }}
                  >
                    All
                  </button>
                  {prompterTabs.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => setHistoryFilter(tab.name)}
                      className={`flex justify-center items-center gap-2 text-[13px] font-semibold transition-all whitespace-nowrap`}
                      style={{
                        padding: "4px",
                        borderRadius: "8px",
                        background:
                          historyFilter === tab.name
                            ? "linear-gradient(90deg, #62748E 0%, #4A5565 100%)"
                            : "rgba(255, 255, 255, 0.70)",
                        boxShadow:
                          historyFilter === tab.name
                            ? "0 0 0 1px rgba(255, 255, 255, 0.20), 0 2px 8px -1px rgba(0, 0, 0, 0.30)"
                            : undefined,
                        color: historyFilter === tab.name ? "#fff" : "#64748B",
                      }}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.name}
                    </button>
                  ))}
                </div>

                {/* List of History Items */}
                <div
                  className="space-y-3 overflow-y-auto"
                  style={{
                    maxHeight: "280px",
                  }}
                >
                  {filteredHistory.map((item) => {
                    const itemStyle = getHistoryItemStyle(item.type);
                    const ItemIcon = itemStyle.icon;
                    
                    return (
                      <div
                        key={item.id}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-3 sm:p-4 flex gap-2 sm:gap-4 items-start shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => {
                          // Optionally, allow re-running a prompt from history
                          setActiveTab(item.type);
                          setMode("Prompt Mode");
                          if (item.type === 'Freestyle') {
                            setFreestylePrompt(item.prompt);
                          }
                        }}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${itemStyle.color} mt-2`}
                          style={{
                            boxShadow:
                              "0 0 0 1px rgba(255, 255, 255, 0.40), 0 2px 8px -1px rgba(0, 0, 0, 0.30)",
                          }}
                        >
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-1 sm:gap-2 text-[11px] font-bold">
                            <span
                              className="bg-[#F8FAFC] px-2 py-0.5"
                              style={{
                                borderRadius: "8px",
                                border: "1px solid rgba(10, 10, 10, 0.20)",
                                color: "#0A0A0A",
                                fontFamily: "Inter",
                                fontSize: "10px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "15px",
                                letterSpacing: "0.117px",
                              }}
                            >
                              {item.type}
                            </span>
                            <span
                              style={{
                                color: "#62748E",
                                fontFamily: "Inter",
                                fontSize: "9px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "13.5px",
                                letterSpacing: "0.167px",
                              }}
                            >
                              • {item.timestamp}
                            </span>
                          </div>
                          <p
                            style={{
                              color: "rgba(49, 65, 88, 0.90)",
                              fontFamily: "Inter",
                              fontSize: "14px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "15px",
                            }}
                            className="line-clamp-2"
                          >
                            {item.prompt}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
