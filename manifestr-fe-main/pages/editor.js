import Head from 'next/head'
import { useState } from 'react'
import EditorHeader from '../components/editor/EditorHeader'
import EditorSidebar from '../components/editor/EditorSidebar'
import EditorCanvas from '../components/editor/EditorCanvas'
import EditorToolbar, { CollaborationToolbar } from '../components/editor/EditorToolbar'
import EditorFormattingBar from '../components/editor/EditorFormattingBar'
import EditorTopBar from '../components/editor/EditorTopBar'
import TextEditor from '../components/editor/TextEditor'
import QuickStylePanel from '../components/editor/panels/QuickStylePanel'
import ShapeFormatPanel from '../components/editor/panels/ShapeFormatPanel'
import TextEffectsPanel from '../components/editor/panels/TextEffectsPanel'
import SearchPanel from '../components/editor/panels/SearchPanel'
import FormatPanel from '../components/editor/panels/FormatPanel'
import InsertPanel from '../components/editor/panels/InsertPanel'
import LayoutPanel from '../components/editor/panels/LayoutPanel'
import ArrangePanel from '../components/editor/panels/ArrangePanel'
import TransitionsPanel from '../components/editor/panels/TransitionsPanel'
import AnimationsPanel from '../components/editor/panels/AnimationsPanel'
import AIPrompterPanel from '../components/editor/panels/AIPrompterPanel'
import ThemePanel from '../components/editor/panels/ThemePanel'
import ColorSchemePanel from '../components/editor/panels/ColorSchemePanel'
import BackgroundPanel from '../components/editor/panels/BackgroundPanel'
import EffectsPanel from '../components/editor/panels/EffectsPanel'
import WordArtPanel from '../components/editor/panels/WordArtPanel'

export default function Editor() {
  const [documentTitle, setDocumentTitle] = useState('Untitled document')
  const [status, setStatus] = useState('In Progress')
  const [editingMode, setEditingMode] = useState('Editing')
  const [version] = useState('v1.1')
  const [activeTab, setActiveTab] = useState('style')
  const [viewMode, setViewMode] = useState('page')
  const [slides, setSlides] = useState([
    { id: 1, content: [] },
    { id: 2, content: [] },
    { id: 3, content: [] },
    { id: 4, content: [] },
  ])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [editingText, setEditingText] = useState(null)
  const [activePanel, setActivePanel] = useState(null)
  const [selectedElementIndex, setSelectedElementIndex] = useState(null)

  const collaborators = [
    { name: 'Umar Islam', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  ]

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus)
  }

  const handleEditingModeChange = (newMode) => {
    setEditingMode(newMode)
  }

  const handleUndo = () => {
  }

  const handleRedo = () => {
  }

  const handleShareExport = () => {
  }

  const handleSlideSelect = (index) => {
    setCurrentSlideIndex(index)
  }

  const handleNewSlide = () => {
    const newSlide = { id: slides.length + 1, content: [] }
    setSlides([...slides, newSlide])
    setCurrentSlideIndex(slides.length)
  }

  const handleSlideUpdate = (slideIndex, updatedSlide) => {
    const updatedSlides = [...slides]
    updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], ...updatedSlide }
    setSlides(updatedSlides)
  }

  const handleAddElement = (elementType, x = 200, y = 200) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    let newElement = null

    if (elementType === 'text' || elementType === 'text-box') {
      newElement = {
        type: 'text',
        text: 'New Text',
        x: x,
        y: y,
        fontSize: 24,
        fontFamily: 'Inter',
        color: '#18181b',
        width: 200
      }
    } else if (elementType === 'shape-rect' || elementType === 'rect') {
      newElement = {
        type: 'shape',
        shape: 'rect',
        x: x,
        y: y,
        width: 100,
        height: 100,
        fill: '#e4e4e7',
        stroke: '#18181b',
        strokeWidth: 1
      }
    } else if (elementType === 'shape-circle' || elementType === 'circle') {
      newElement = {
        type: 'shape',
        shape: 'circle',
        x: x,
        y: y,
        radius: 50,
        fill: '#e4e4e7',
        stroke: '#18181b',
        strokeWidth: 1
      }
    } else if (elementType === 'image') {
      // Trigger file input for image
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*'
      fileInput.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const imageData = event.target.result
            const newImage = {
              type: 'image',
              image: imageData,
              x: x,
              y: y,
              width: 200,
              height: 200
            }
            const updatedContent = [...(currentSlide.content || []), newImage]
            handleSlideUpdate(currentSlideIndex, { ...currentSlide, content: updatedContent })
            setSelectedElementIndex(updatedContent.length - 1)
          }
          reader.readAsDataURL(file)
        }
      }
      fileInput.click()
      return
    }

    if (newElement) {
      const updatedContent = [...(currentSlide.content || []), newElement]
      handleSlideUpdate(currentSlideIndex, { ...currentSlide, content: updatedContent })
      setSelectedElementIndex(updatedContent.length - 1)
    }
  }

  const handleAddText = () => {
    handleAddElement('text', 100, 100)
  }

  const handleAddShape = (shapeType) => {
    handleAddElement(shapeType === 'rect' ? 'shape-rect' : 'shape-circle', 200, 200)
  }

  const handleTextDoubleClick = (elementIndex) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    const element = currentSlide.content[elementIndex]
    if (element && element.type === 'text') {
      setEditingText({ ...element, index: elementIndex })
    }
  }

  const handleTextUpdate = (updatedElement) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    const updatedContent = [...(currentSlide.content || [])]
    updatedContent[updatedElement.index] = updatedElement
    handleSlideUpdate(currentSlideIndex, { ...currentSlide, content: updatedContent })
    setEditingText(null)
  }

  const handleFormattingAction = (action) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    const selectedElement = selectedElementIndex !== null ? currentSlide.content[selectedElementIndex] : null

    switch (action) {
      case 'select-theme':
      case 'theme':
        setActivePanel('theme')
        break
      case 'color-scheme':
        setActivePanel('color-scheme')
        break
      case 'background':
        setActivePanel('background')
        break
      case 'quick-style':
        setActivePanel('quick-style')
        break
      case 'shape-fill':
        // Open shape format panel for fill, even if no shape selected (will show message)
        setActivePanel('shape-format-fill')
        break
      case 'outline':
        // Check if it's for shape or text
        if (selectedElement) {
          if (selectedElement.type === 'shape') {
            setActivePanel('shape-format-outline')
          } else if (selectedElement.type === 'text') {
            setActivePanel('text-effects-outline')
          } else {
            // Default to shape outline if element type is unknown
            setActivePanel('shape-format-outline')
          }
        } else {
          // Default to shape outline if no element selected
          setActivePanel('shape-format-outline')
        }
        break
      case 'effects':
        // Open effects panel, will show message if no element selected
        setActivePanel('effects')
        break
      case 'shadow':
        // Open text effects shadow panel
        setActivePanel('text-effects-shadow')
        break
      case 'outline-text':
        // Open text effects outline panel
        setActivePanel('text-effects-outline')
        break
      case 'glow':
        // Open text effects glow panel
        setActivePanel('text-effects-glow')
        break
      case 'gradient':
        // Open text effects gradient panel
        setActivePanel('text-effects-gradient')
        break
      case 'wordart':
        if (selectedElement && selectedElement.type === 'text') {
          setActivePanel('wordart')
        }
        break
      default:
        break
    }
  }

  const handleToolbarAction = (tabId) => {
    setActivePanel(tabId)
  }

  const handleInsert = (type) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    let newElement

    switch (type) {
      case 'text':
        newElement = {
          type: 'text',
          text: 'New Text',
          x: 100,
          y: 100,
          fontSize: 24,
          fontFamily: 'Inter',
          color: '#18181b',
          width: 200
        }
        break
      case 'shape-rect':
        newElement = {
          type: 'shape',
          shape: 'rect',
          x: 200,
          y: 200,
          width: 100,
          height: 100,
          fill: '#e4e4e7',
          stroke: '#18181b',
          strokeWidth: 1
        }
        break
      case 'shape-circle':
        newElement = {
          type: 'shape',
          shape: 'circle',
          x: 200,
          y: 200,
          radius: 50,
          fill: '#e4e4e7',
          stroke: '#18181b',
          strokeWidth: 1
        }
        break
      case 'slide':
        handleNewSlide()
        return
      default:
        return
    }

    const updatedContent = [...(currentSlide.content || []), newElement]
    handleSlideUpdate(currentSlideIndex, { ...currentSlide, content: updatedContent })
    setSelectedElementIndex(updatedContent.length - 1)
  }

  const handleSearch = (searchType, query) => {
    // Implement search functionality
    setActivePanel(null)
  }

  const handleQuickStyleApply = (style) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    handleSlideUpdate(currentSlideIndex, { 
      ...currentSlide, 
      backgroundColor: style.preview.includes('blue') ? '#3b82f6' : 
                      style.preview.includes('gray') ? '#374151' :
                      style.preview.includes('pink') ? '#ec4899' :
                      style.preview.includes('white') ? '#ffffff' : '#000000'
    })
    setActivePanel(null)
  }

  const handleThemeApply = (theme) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    handleSlideUpdate(currentSlideIndex, { 
      ...currentSlide, 
      theme: theme.id,
      backgroundColor: theme.colors[0]
    })
    setActivePanel(null)
  }

  const handleColorSchemeApply = (scheme) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    handleSlideUpdate(currentSlideIndex, { 
      ...currentSlide, 
      colorScheme: scheme.name,
      colorPalette: scheme.colors
    })
    setActivePanel(null)
  }

  const handleBackgroundApply = (bgData) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    handleSlideUpdate(currentSlideIndex, { 
      ...currentSlide, 
      ...bgData
    })
    setActivePanel(null)
  }

  const handleElementUpdate = (updatedElement) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    const updatedContent = [...(currentSlide.content || [])]
    if (selectedElementIndex !== null) {
      updatedContent[selectedElementIndex] = { ...updatedContent[selectedElementIndex], ...updatedElement }
      handleSlideUpdate(currentSlideIndex, { ...currentSlide, content: updatedContent })
    }
    setActivePanel(null)
  }

  const handleLayoutApply = (layout) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    // Apply layout structure
    handleSlideUpdate(currentSlideIndex, { ...currentSlide, layout: layout.id })
    setActivePanel(null)
  }

  const handleArrange = (action) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    const updatedContent = [...(currentSlide.content || [])]
    
    if (selectedElementIndex !== null && action === 'bring-forward') {
      const element = updatedContent.splice(selectedElementIndex, 1)[0]
      updatedContent.push(element)
      setSelectedElementIndex(updatedContent.length - 1)
    } else if (selectedElementIndex !== null && action === 'send-backward') {
      const element = updatedContent.splice(selectedElementIndex, 1)[0]
      updatedContent.unshift(element)
      setSelectedElementIndex(0)
    }
    
    handleSlideUpdate(currentSlideIndex, { ...currentSlide, content: updatedContent })
    setActivePanel(null)
  }

  const handleTransitionApply = (transitionData) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    handleSlideUpdate(currentSlideIndex, { ...currentSlide, ...transitionData })
    setActivePanel(null)
  }

  const handleAnimationApply = (animationData) => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    const updatedContent = [...(currentSlide.content || [])]
    if (selectedElementIndex !== null) {
      updatedContent[selectedElementIndex] = { ...updatedContent[selectedElementIndex], ...animationData }
      handleSlideUpdate(currentSlideIndex, { ...currentSlide, content: updatedContent })
    }
    setActivePanel(null)
  }

  const handleSlideShow = () => {
    // Open fullscreen presentation mode
    const presentationWindow = window.open('', '_blank', 'fullscreen=yes')
    if (presentationWindow) {
      presentationWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Presentation - ${documentTitle}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                width: 100vw; 
                height: 100vh; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                background: #000; 
                font-family: Inter, sans-serif;
              }
              .slide { 
                width: 90vw; 
                height: 90vh; 
                background: white; 
                border-radius: 8px;
                padding: 60px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              .slide h1 { font-size: 48px; margin-bottom: 20px; }
              .slide p { font-size: 24px; color: #71717a; }
              .controls {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 10px;
              }
              .controls button {
                padding: 10px 20px;
                background: rgba(255,255,255,0.9);
                border: none;
                border-radius: 6px;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <div class="slide" id="slide">
              <h1>${slides[currentSlideIndex]?.content?.find(c => c.type === 'text')?.text || 'Presentation Title'}</h1>
              <p>Slide ${currentSlideIndex + 1} of ${slides.length}</p>
            </div>
            <div class="controls">
              <button onclick="prevSlide()">Previous</button>
              <button onclick="nextSlide()">Next</button>
              <button onclick="window.close()">Close</button>
            </div>
            <script>
              let currentSlide = ${currentSlideIndex};
              const totalSlides = ${slides.length};
              function nextSlide() {
                if (currentSlide < totalSlides - 1) {
                  currentSlide++;
                  updateSlide();
                }
              }
              function prevSlide() {
                if (currentSlide > 0) {
                  currentSlide--;
                  updateSlide();
                }
              }
              function updateSlide() {
                document.getElementById('slide').innerHTML = 
                  '<h1>Slide ' + (currentSlide + 1) + '</h1><p>Slide ' + (currentSlide + 1) + ' of ' + totalSlides + '</p>';
              }
              document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') nextSlide();
                if (e.key === 'ArrowLeft') prevSlide();
                if (e.key === 'Escape') window.close();
              });
            </script>
          </body>
        </html>
      `)
      presentationWindow.document.close()
    }
  }

  const handleAIGenerate = async (prompt) => {
    // Implement AI generation logic
    // For now, just add a text element with the prompt
    const newText = {
      type: 'text',
      text: `AI Generated: ${prompt}`,
      x: 100,
      y: 200,
      fontSize: 24,
      fontFamily: 'Inter',
      color: '#18181b',
      width: 600
    }
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    const updatedContent = [...(currentSlide.content || []), newText]
    handleSlideUpdate(currentSlideIndex, { ...currentSlide, content: updatedContent })
  }

  const getSelectedElement = () => {
    const currentSlide = slides[currentSlideIndex] || { id: currentSlideIndex + 1, content: [] }
    return selectedElementIndex !== null ? currentSlide.content[selectedElementIndex] : null
  }

  return (
    <>
      <Head>
        <title>Editor - Manifestr</title>
        <meta name="description" content="Edit your presentation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#f4f4f5] flex flex-col">
        {/* Editor Header */}
        <EditorHeader
          documentTitle={documentTitle}
          status={status}
          editingMode={editingMode}
          version={version}
          onStatusChange={handleStatusChange}
          onEditingModeChange={handleEditingModeChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onShareExport={handleShareExport}
          collaborators={collaborators}
        />

        {/* Spacer for fixed header */}
        <div className="h-[72px]" />

        {/* Top Bar */}
        <EditorTopBar 
          onSearchClick={() => setActivePanel('search')} 
          onInsertClick={() => setActivePanel('insert')}
        />

        {/* Main Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <EditorSidebar
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            onSlideSelect={handleSlideSelect}
            onNewSlide={handleNewSlide}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Center Canvas Area */}
          <div className="flex-1 relative">
            <EditorCanvas
              slides={slides}
              currentSlideIndex={currentSlideIndex}
              onSlideChange={handleSlideSelect}
              onSlideUpdate={handleSlideUpdate}
              onTextDoubleClick={handleTextDoubleClick}
              onElementSelect={setSelectedElementIndex}
              onAddElement={handleAddElement}
            />
            
            {/* Text Editor Modal */}
            {editingText && (
              <TextEditor
                element={editingText}
                onUpdate={handleTextUpdate}
                onClose={() => setEditingText(null)}
              />
            )}

            {/* Panels */}
            {activePanel === 'quick-style' && (
              <QuickStylePanel
                onApply={handleQuickStyleApply}
                onClose={() => setActivePanel(null)}
              />
            )}

            {(activePanel === 'shape-format' || activePanel?.startsWith('shape-format-')) && (
              <ShapeFormatPanel
                selectedElement={getSelectedElement()}
                onUpdate={handleElementUpdate}
                onClose={() => setActivePanel(null)}
                formatType={activePanel === 'shape-format-fill' ? 'fill' :
                           activePanel === 'shape-format-outline' ? 'outline' : 'all'}
              />
            )}

            {(activePanel === 'text-effects' || activePanel?.startsWith('text-effects-')) && (
              <TextEffectsPanel
                selectedElement={getSelectedElement()}
                onUpdate={handleElementUpdate}
                onClose={() => setActivePanel(null)}
                effectType={activePanel === 'text-effects-shadow' ? 'shadow' :
                           activePanel === 'text-effects-outline' ? 'outline' :
                           activePanel === 'text-effects-glow' ? 'glow' :
                           activePanel === 'text-effects-gradient' ? 'gradient' : 'all'}
              />
            )}

            {activePanel === 'search' && (
              <SearchPanel
                onSearch={handleSearch}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'format' && (
              <FormatPanel
                selectedElement={getSelectedElement()}
                onUpdate={handleElementUpdate}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'insert' && (
              <InsertPanel
                onInsert={handleInsert}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'layout' && (
              <LayoutPanel
                onApply={handleLayoutApply}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'arrange' && (
              <ArrangePanel
                selectedElements={selectedElementIndex !== null ? [selectedElementIndex] : []}
                onArrange={handleArrange}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'transitions' && (
              <TransitionsPanel
                selectedSlide={slides[currentSlideIndex]}
                onApply={handleTransitionApply}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'animations' && (
              <AnimationsPanel
                selectedElement={getSelectedElement()}
                onApply={handleAnimationApply}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'ai' && (
              <AIPrompterPanel
                onGenerate={handleAIGenerate}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'theme' && (
              <ThemePanel
                onApply={handleThemeApply}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'color-scheme' && (
              <ColorSchemePanel
                onApply={handleColorSchemeApply}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'background' && (
              <BackgroundPanel
                selectedSlide={slides[currentSlideIndex]}
                onApply={handleBackgroundApply}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'effects' && (
              <EffectsPanel
                selectedElement={getSelectedElement()}
                onApply={handleElementUpdate}
                onClose={() => setActivePanel(null)}
              />
            )}

            {activePanel === 'wordart' && (
              <WordArtPanel
                selectedElement={getSelectedElement()}
                onApply={handleElementUpdate}
                onClose={() => setActivePanel(null)}
              />
            )}
            
            {/* Right Collaboration Toolbar */}
            <CollaborationToolbar position="right" />
            
            {/* Left Collaboration Toolbar */}
            <CollaborationToolbar position="left" />
          </div>
        </div>

        {/* Bottom Formatting Bar */}
        <EditorFormattingBar onAction={handleFormattingAction} />

        {/* Navigation Toolbar */}
        <EditorToolbar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab)
            if (tab === 'slideshow') {
              handleSlideShow()
            } else {
              handleToolbarAction(tab)
            }
          }}
          onAction={handleToolbarAction}
        />

        {/* Bottom Notes Bar */}
        <div className="bg-white border-t border-[#e4e4e7] h-[24px] flex items-center justify-between px-6">
          <span className="text-[9px] text-[#4a5565]">Add Notes</span>
          <div className="flex items-center gap-2">
            {/* Zoom controls or other bottom actions */}
          </div>
        </div>
      </div>
    </>
  )
}

