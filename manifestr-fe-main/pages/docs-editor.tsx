import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import TopHeader from "../components/spreadsheet/TopHeader";
import TiptapEditor from "../components/docs/TiptapEditor";
import DocumentOutline from "../components/docs/DocumentOutline";
import { RightSidebar } from "../components/spreadsheet/RightSidebar";
import DocsEditorBottomToolbar from "../components/editor/DocsEditorBottomToolbar";
import { FloatingFAB } from "../components/spreadsheet/FloatingElements";

// Dynamically import collaborative editor (uses Y.js)
const CollaborativeTiptapEditor = dynamic(
  () => import("../components/docs/CollaborativeTiptapEditor"),
  { ssr: false },
);

import docsContent from "../assets/dummy/docs-content.json";
import useGenerationLoader from "../hooks/useGenerationLoader";
import GenerationLoaderUI from "../components/shared/GenerationLoaderUI";
import StyleGuideModal from "../components/editor/StyleGuideModal";
import { useToast } from "../hooks/useToast";
import api from "../lib/api";

export default function DocsEditor() {
  const router = useRouter();
  const { id: documentId } = router.query;
  const [headings, setHeadings] = useState([]);
  const [editorHTML, setEditorHTML] = useState("");
  const [editorInstance, setEditorInstance] = useState(null);
  const [zoom, setZoom] = useState(1);
  const { loading, error, status, content, id } = useGenerationLoader();
  const [showStyleGuideModal, setShowStyleGuideModal] = useState(false);
  const { showToast } = useToast();
  const [activeTool, setActiveTool] = useState<string | null>("format");
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  const extractHeadings = (html) => {
    // Store HTML for download
    setEditorHTML(html);

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const extractedHeadings = Array.from(headingElements).map((el, index) => ({
      id: `heading-${index}`,
      level: parseInt(el.tagName.substring(1)),
      text: el.textContent || "",
    }));

    setHeadings(extractedHeadings);
  };

  const clampZoom = (value: number) => Math.min(2, Math.max(0.5, value));

  const handleZoomIn = () => {
    setZoom((prev) => clampZoom(Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => clampZoom(Number((prev - 0.1).toFixed(2))));
  };

  const handleZoomReset = () => setZoom(1);

  const handleDownload = async () => {
    // Simply download the template file
    const link = document.createElement("a");
    link.href = "/Merchandise_Operations_Template.docx";
    link.download = "Merchandise_Operations_Template.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Use generated content if available, otherwise fall back to dummy
  // Note: TiptapEditor expects 'content' prop.
  // If 'content' from hook is JSON/HTML, we pass it.
  const editorContent = content || docsContent;

  // Ensure documentId is string (router.query returns string | string[])
  const docIdParam = documentId ?? id;
  const actualDocumentId =
    typeof docIdParam === "string"
      ? docIdParam
      : Array.isArray(docIdParam)
        ? docIdParam[0]
        : undefined;

  const useCollaboration = !!actualDocumentId; // Enable collaboration if we have a document ID

  // Extract saved HTML content if available
  const savedHtmlContent = content?.html || null;

  const handleSelectStyleGuide = async (styleGuide: any) => {
    setShowStyleGuideModal(false);
    showToast("Regenerating document with selected style...", "info");

    try {
      const currentContent = editorInstance?.getHTML() || editorHTML;

      if (actualDocumentId) {
        // Update existing document
        const response = await api.post("/document-generator/modify", {
          generationId: actualDocumentId,
          currentDocument: { html: currentContent },
          styleGuideId: styleGuide.id,
          styleGuide: {
            name: styleGuide.name,
            primaryColor: styleGuide.primaryColor,
            secondaryColor: styleGuide.secondaryColor,
            accentColor: styleGuide.accentColor,
            backgroundColor: styleGuide.backgroundColor,
            textColor: styleGuide.textColor,
            fontFamily: styleGuide.fontFamily,
          },
          modifyPrompt: `Regenerate this document using the "${styleGuide.name}" style guide.`,
        });

        if (response.data.success && response.data.modifiedDocument) {
          showToast("Document regenerated successfully!", "success");
          if (editorInstance?.commands?.setContent) {
            editorInstance.commands.setContent(
              response.data.modifiedDocument.html,
            );
          } else {
            window.location.reload();
          }
        }
      } else {
        // Generate new document
        const response = await api.post("/document-generator/generate", {
          prompt: `Generate a document using the "${styleGuide.name}" style guide`,
          content: { html: currentContent },
          styleGuideId: styleGuide.id,
          styleGuide: {
            name: styleGuide.name,
            primaryColor: styleGuide.primaryColor,
            secondaryColor: styleGuide.secondaryColor,
            accentColor: styleGuide.accentColor,
            backgroundColor: styleGuide.backgroundColor,
            textColor: styleGuide.textColor,
            fontFamily: styleGuide.fontFamily,
          },
        });

        if (response.data.success && response.data.generationId) {
          showToast("Document generated successfully!", "success");
          router.push(`/docs-editor?id=${response.data.generationId}`);
        }
      }
    } catch (error) {
      console.error("Error applying style guide:", error);
      showToast("Failed to apply style guide", "error");
    }
  };

  return (
    <GenerationLoaderUI loading={loading} status={status} error={error}>
      <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
        <Head>
          <title>Docs Editor | Manifestr</title>
        </Head>

        {/* Top Section */}
        <div className="flex-none z-30">
          <TopHeader
            editorType="document"
            onDownload={handleDownload}
            documentId={actualDocumentId}
            documentTitle={content?.title || "Untitled document"}
            enableCollaboration={useCollaboration}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex relative overflow-hidden">
          {/* Left Sidebar - Document Outline */}
          <div className="hidden md:block h-full">
            <DocumentOutline headings={headings} />
          </div>

          {/* Editor Container */}
          <div className="flex-grow relative" style={{ zoom } as any}>
            {/* Render DOCX as HTML */}
            <DocxViewer
              documentId={actualDocumentId}
              savedContent={savedHtmlContent}
              onEditorReady={setEditorInstance}
              onHeadingsChange={setHeadings}
              onSaveStatusChange={setSaveStatus}
            />

            {/* Save Status Indicator */}
            {actualDocumentId && (
              <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-white shadow-md rounded-lg px-4 py-2 border border-gray-200">
                {saveStatus === 'saved' && (
                  <>
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">All changes saved</span>
                  </>
                )}
                {saveStatus === 'saving' && (
                  <>
                    <svg className="animate-spin w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Saving...</span>
                  </>
                )}
                {saveStatus === 'unsaved' && (
                  <>
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">Unsaved changes</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar (Floating over editor on the right) - Hide when AI Prompter is active */}
          {activeTool !== "ai-prompt" && (
            <div className="hidden md:flex absolute right-[-12px] top-0 bottom-0 items-center z-20 pointer-events-none">
              <div className="pointer-events-auto">
                <RightSidebar
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onZoomReset={handleZoomReset}
                  documentId={actualDocumentId}
                  documentTitle={content?.title || "Untitled document"}
                  documentType="document"
                />
              </div>
            </div>
          )}

          {/* Floating FAB */}
          <FloatingFAB />
        </div>

        {/* Bottom Section */}
        <div className="flex-none z-30">
          <DocsEditorBottomToolbar
            editor={editorInstance}
            onInsertTheme={() => setShowStyleGuideModal(true)}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
          />
        </div>

        {/* Style Guide Modal */}
        <StyleGuideModal
          isOpen={showStyleGuideModal}
          onClose={() => setShowStyleGuideModal(false)}
          onSelect={handleSelectStyleGuide}
          editorType="document"
        />
      </div>
    </GenerationLoaderUI>
  );
}

// Component to render DOCX file
function DocxViewer({
  documentId,
  savedContent,
  onEditorReady,
  onHeadingsChange,
  onSaveStatusChange,
}: {
  documentId?: string;
  savedContent?: string | null;
  onEditorReady?: (editor: any) => void;
  onHeadingsChange?: (headings: any[]) => void;
  onSaveStatusChange?: (status: 'saved' | 'saving' | 'unsaved') => void;
}) {
  const [html, setHtml] = React.useState(
    '<div style="padding: 40px; text-align: center; color: #666;">Loading document...</div>',
  );
  const [error, setError] = React.useState(null);
  const contentRef = React.useRef(null);
  const saveTimeoutRef = React.useRef(null);
  const lastSavedContentRef = React.useRef('');

  // Auto-save function
  const autoSave = React.useCallback(async (content: string) => {
    if (!documentId) return;
    
    // Don't save if content hasn't changed
    if (content === lastSavedContentRef.current) return;
    
    try {
      onSaveStatusChange?.('saving');
      console.log('💾 Auto-saving document...', documentId);
      await api.patch(`/ai/generation/${documentId}`, {
        content: { html: content }
      });
      lastSavedContentRef.current = content;
      onSaveStatusChange?.('saved');
      console.log('✅ Document auto-saved successfully');
    } catch (err) {
      console.error('❌ Auto-save failed:', err);
      onSaveStatusChange?.('unsaved');
    }
  }, [documentId, onSaveStatusChange]);

  // Debounced auto-save on content change
  const handleContentChange = React.useCallback(() => {
    if (!contentRef.current) return;
    
    const currentContent = contentRef.current.innerHTML;
    
    // Mark as unsaved when content changes
    if (currentContent !== lastSavedContentRef.current) {
      onSaveStatusChange?.('unsaved');
    }
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save (2 seconds after last change)
    saveTimeoutRef.current = setTimeout(() => {
      autoSave(currentContent);
    }, 2000);
  }, [autoSave, onSaveStatusChange]);

  React.useEffect(() => {
    const loadDoc = async () => {
      try {
        // Check if we have saved content for this document ID
        if (savedContent) {
          console.log('📄 Loading saved document content');
          setHtml(savedContent);
          lastSavedContentRef.current = savedContent;
          return;
        }

        // Otherwise, load a random template as default
        const mammoth = (await import("mammoth")).default;

        // 7 available templates
        const templates = [
          "/Merchandise_Operations_Template.docx",
          "/Event_Activation_Ops_Template.docx",
          "/HR_Staffing_Ops_Template.docx",
          "/Marketing_Campaign_Ops_Template.docx",
          "/Sales_Revenue_Ops_Template.docx",
          "/Vendor_Supplier_Ops_Template.docx",
          "/Warehouse_Storage_Ops_Template.docx",
        ];

        // Randomly select one template
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        console.log('🎲 Randomly selected template:', randomTemplate);

        // Fetch the docx file
        const response = await fetch(randomTemplate);
        const arrayBuffer = await response.arrayBuffer();

        // Convert to HTML with comprehensive heading mapping
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            styleMap: [
              // Standard Word heading styles
              "p[style-name='Heading 1'] => h1:fresh",
              "p[style-name='Heading 2'] => h2:fresh",
              "p[style-name='Heading 3'] => h3:fresh",
              "p[style-name='Heading 4'] => h3:fresh",
              "p[style-name='Heading 5'] => h3:fresh",
              "p[style-name='Heading 6'] => h3:fresh",
              // Alternate naming conventions
              "p[style-name='heading 1'] => h1:fresh",
              "p[style-name='heading 2'] => h2:fresh",
              "p[style-name='heading 3'] => h3:fresh",
              // Title styles
              "p[style-name='Title'] => h1:fresh",
              "p[style-name='Subtitle'] => h2:fresh",
            ],
            includeDefaultStyleMap: true,
          },
        );
        
        console.log('📄 Mammoth conversion messages:', result.messages);

        // Add professional styling
        const styledHtml = `
          <style>
            h1 {
              color: #1F4E79;
              font-size: 24pt;
              font-weight: bold;
              margin-top: 24pt;
              margin-bottom: 12pt;
              border-bottom: 3px solid #2E75B6;
              padding-bottom: 8pt;
            }
            h2 {
              color: #2E75B6;
              font-size: 18pt;
              font-weight: bold;
              margin-top: 18pt;
              margin-bottom: 10pt;
            }
            h3 {
              color: #2E75B6;
              font-size: 14pt;
              font-weight: bold;
              margin-top: 14pt;
              margin-bottom: 8pt;
            }
            p {
              margin: 8pt 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 16pt 0;
            }
            th {
              background: linear-gradient(135deg, #1F4E79 0%, #2E75B6 100%);
              color: white;
              padding: 12pt;
              text-align: left;
              font-weight: bold;
              border: 1px solid #CCCCCC;
            }
            td {
              padding: 10pt 12pt;
              border: 1px solid #CCCCCC;
            }
            tr:nth-child(even) {
              background: #F9FAFB;
            }
            tr:hover {
              background: #F3F4F6;
            }
            strong {
              color: #1F4E79;
              font-weight: bold;
            }
            ul, ol {
              margin: 12pt 0 !important;
              padding-left: 40pt !important;
              display: block !important;
            }
            ul {
              list-style-type: disc !important;
              list-style-position: outside !important;
            }
            ol {
              list-style-type: decimal !important;
              list-style-position: outside !important;
            }
            li {
              margin: 6pt 0 !important;
              display: list-item !important;
              margin-left: 0 !important;
              padding-left: 4pt !important;
            }
            ul li::marker {
              color: #1F4E79 !important;
              font-size: 12pt !important;
            }
            ol li::marker {
              color: #1F4E79 !important;
              font-weight: bold !important;
            }
            
            /* Editable styles */
            [contenteditable="true"]:focus {
              outline: 2px solid #3B82F6;
              outline-offset: 2px;
            }
            
            [contenteditable="true"] {
              cursor: text;
            }
          </style>
          ${result.value}
        `;

        setHtml(styledHtml);
        lastSavedContentRef.current = styledHtml;

        if (result.messages.length > 0) {
          console.warn("Conversion warnings:", result.messages);
        }
      } catch (err) {
        console.error("Error loading DOCX:", err);
        setError(err.message);
        setHtml(`
          <div style="padding: 40px; text-align: center; color: #EF4444;">
            <p><strong>Error loading document:</strong></p>
            <p>${err.message}</p>
          </div>
        `);
      }
    };

    loadDoc();
  }, [documentId, savedContent]);

  // Listen for content changes and trigger auto-save
  React.useEffect(() => {
    if (!contentRef.current || !documentId) return;

    const observer = new MutationObserver(() => {
      handleContentChange();
    });

    observer.observe(contentRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    // Also listen for input events
    const handleInput = () => {
      handleContentChange();
    };

    contentRef.current.addEventListener('input', handleInput);
    const currentRef = contentRef.current;

    return () => {
      observer.disconnect();
      if (currentRef) {
        currentRef.removeEventListener('input', handleInput);
      }
      // Clear any pending save timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [documentId, handleContentChange]);

  // Save on page unload/navigation
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      if (contentRef.current && documentId) {
        const currentContent = contentRef.current.innerHTML;
        if (currentContent !== lastSavedContentRef.current) {
          // Synchronous save on unload
          navigator.sendBeacon(
            `/api/ai/generation/${documentId}`,
            JSON.stringify({ content: { html: currentContent } })
          );
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Final save when component unmounts
      if (contentRef.current && documentId) {
        const currentContent = contentRef.current.innerHTML;
        if (currentContent !== lastSavedContentRef.current) {
          autoSave(currentContent);
        }
      }
    };
  }, [documentId, autoSave]);

  // Extract headings from the rendered HTML and add IDs
  React.useEffect(() => {
    if (!contentRef.current) return;

    const extractHeadings = () => {
      let headingElements = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const headingsData = [];

      console.log('🔍 Found heading elements:', headingElements.length);

      // If no headings found, try to detect bold/large text as headings
      if (headingElements.length === 0) {
        console.log('⚠️ No h1-h6 tags found, searching for bold paragraphs as headings...');
        
        // Find all paragraphs
        const allParagraphs = contentRef.current.querySelectorAll("p");
        const potentialHeadings = [];
        
        allParagraphs.forEach((p, index) => {
          const text = p.textContent.trim();
          // Check if paragraph has bold text or is bold
          const fontWeight = parseInt(window.getComputedStyle(p).fontWeight);
          const hasBold = p.querySelector("strong, b") || 
                         fontWeight >= 600 ||
                         p.innerHTML.includes("<strong>") ||
                         p.innerHTML.includes("<b>");
          
          // If short text (< 100 chars) and bold, likely a heading
          if (text && text.length < 100 && hasBold) {
            // Convert paragraph to heading
            const h2 = document.createElement("h2");
            h2.innerHTML = p.innerHTML;
            h2.className = p.className;
            p.replaceWith(h2);
            potentialHeadings.push(h2);
          }
        });
        
        console.log('🔍 Converted', potentialHeadings.length, 'bold paragraphs to h2 headings');
        headingElements = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
      }

      headingElements.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1)); // h1 -> 1, h2 -> 2, etc.
        const text = heading.textContent.trim();
        const id = `heading-${index}`;

        // Add data-id attribute for scrolling
        heading.setAttribute("data-id", id);

        headingsData.push({
          id,
          level,
          text,
        });
      });

      console.log('📋 Extracted headings:', headingsData);

      if (onHeadingsChange) {
        onHeadingsChange(headingsData);
      }
    };

    // Extract headings after a short delay to ensure HTML is rendered
    setTimeout(extractHeadings, 100);

    // Also re-extract if content changes
    const observer = new MutationObserver(extractHeadings);
    observer.observe(contentRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [html, onHeadingsChange]);

  // Create fake Tiptap-like editor API for contentEditable
  React.useEffect(() => {
    if (!contentRef.current || !onEditorReady) return;

    // Save and restore selection helper
    let savedSelection = null;

    const saveSelection = () => {
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        savedSelection = sel.getRangeAt(0).cloneRange();
      }
    };

    const restoreSelection = () => {
      if (savedSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedSelection);
      }
    };

    const fakeEditor = {
      // Tiptap-like chainable API
      chain: () => ({
        focus: () => {
          // Focus the contentEditable element
          if (contentRef.current) {
            contentRef.current.focus();
          }
          restoreSelection();
          return {
            setBold: () => ({
              run: () => {
                document.execCommand("bold", false);
                return true;
              },
            }),
            setItalic: () => ({
              run: () => {
                document.execCommand("italic", false);
                return true;
              },
            }),
            setUnderline: () => ({
              run: () => {
                document.execCommand("underline", false);
                return true;
              },
            }),
            setStrike: () => ({
              run: () => {
                document.execCommand("strikeThrough", false);
                return true;
              },
            }),
            toggleBold: () => ({
              run: () => {
                document.execCommand("bold", false);
                return true;
              },
            }),
            toggleItalic: () => ({
              run: () => {
                document.execCommand("italic", false);
                return true;
              },
            }),
            toggleUnderline: () => ({
              run: () => {
                document.execCommand("underline", false);
                return true;
              },
            }),
            toggleStrike: () => ({
              run: () => {
                document.execCommand("strikeThrough", false);
                return true;
              },
            }),
            setHeading: ({ level }: { level: number }) => ({
              run: () => {
                document.execCommand("formatBlock", false, `h${level}`);
                return true;
              },
            }),
            setParagraph: () => ({
              run: () => {
                document.execCommand("formatBlock", false, "p");
                return true;
              },
            }),
            setTextAlign: (align: string) => ({
              run: () => {
                if (align === "left")
                  document.execCommand("justifyLeft", false);
                else if (align === "center")
                  document.execCommand("justifyCenter", false);
                else if (align === "right")
                  document.execCommand("justifyRight", false);
                else if (align === "justify")
                  document.execCommand("justifyFull", false);
                return true;
              },
            }),
            setFontFamily: (font: string) => ({
              run: () => {
                document.execCommand("fontName", false, font);
                return true;
              },
            }),
            setFontSize: (size: string) => ({
              run: () => {
                // Convert pt to size (1-7)
                const ptSize = parseInt(size);
                let fontSize = "3"; // default
                if (ptSize <= 8) fontSize = "1";
                else if (ptSize <= 10) fontSize = "2";
                else if (ptSize <= 12) fontSize = "3";
                else if (ptSize <= 14) fontSize = "4";
                else if (ptSize <= 18) fontSize = "5";
                else if (ptSize <= 24) fontSize = "6";
                else fontSize = "7";
                document.execCommand("fontSize", false, fontSize);
                return true;
              },
            }),
            setColor: (color: string) => ({
              run: () => {
                document.execCommand("foreColor", false, color);
                return true;
              },
            }),
            toggleHighlight: ({ color }: { color?: string }) => ({
              run: () => {
                document.execCommand("backColor", false, color || "#fef08a");
                return true;
              },
            }),
            setHighlight: (color: string) => ({
              run: () => {
                document.execCommand("backColor", false, color);
                return true;
              },
            }),
            toggleBulletList: () => ({
              run: () => {
                console.log("🔵 Toggling bullet list");
                const result = document.execCommand(
                  "insertUnorderedList",
                  false,
                );
                console.log("🔵 Bullet list result:", result);
                return true;
              },
            }),
            toggleOrderedList: () => ({
              run: () => {
                console.log("🔢 Toggling ordered list");
                const result = document.execCommand("insertOrderedList", false);
                console.log("🔢 Ordered list result:", result);
                return true;
              },
            }),
            indent: () => ({
              run: () => {
                document.execCommand("indent", false);
                return true;
              },
            }),
            outdent: () => ({
              run: () => {
                document.execCommand("outdent", false);
                return true;
              },
            }),
            liftListItem: () => ({
              run: () => {
                document.execCommand("outdent", false);
                return true;
              },
            }),
            sinkListItem: () => ({
              run: () => {
                document.execCommand("indent", false);
                return true;
              },
            }),
            toggleSubscript: () => ({
              run: () => {
                document.execCommand("subscript", false);
                return true;
              },
            }),
            toggleSuperscript: () => ({
              run: () => {
                document.execCommand("superscript", false);
                return true;
              },
            }),
            setSubscript: () => ({
              run: () => {
                document.execCommand("subscript", false);
                return true;
              },
            }),
            setSuperscript: () => ({
              run: () => {
                document.execCommand("superscript", false);
                return true;
              },
            }),
            unsetAllMarks: () => ({
              run: () => {
                document.execCommand("removeFormat", false);
                return true;
              },
              clearNodes: () => ({
                run: () => {
                  return true;
                },
              }),
            }),
            clearNodes: () => ({
              run: () => {
                document.execCommand("removeFormat", false);
                return true;
              },
            }),
            deleteSelection: () => ({
              run: () => {
                document.execCommand("delete", false);
                return true;
              },
            }),
            insertContent: (content: string) => ({
              run: () => {
                document.execCommand("insertHTML", false, content);
                return true;
              },
            }),
            setPageBreak: () => ({
              run: () => {
                // Insert a page break (using a div with page-break-after)
                const pageBreak = '<div style="page-break-after: always;"></div>';
                document.execCommand("insertHTML", false, pageBreak);
                return true;
              },
            }),
            setIndentLeft: (value: string) => ({
              run: () => {
                // Apply left indent to selected element INSIDE the editor
                const selection = window.getSelection();
                if (selection && selection.anchorNode) {
                  let element = selection.anchorNode.nodeType === 3 
                    ? selection.anchorNode.parentElement 
                    : selection.anchorNode as HTMLElement;
                  
                  // Make sure we're inside the contentEditable div
                  while (element && !element.classList.contains('ProseMirror')) {
                    if (element.parentElement?.classList.contains('ProseMirror')) {
                      element.style.marginLeft = value;
                      break;
                    }
                    element = element.parentElement;
                  }
                }
                return true;
              },
            }),
            setIndentRight: (value: string) => ({
              run: () => {
                // Apply right indent to selected element INSIDE the editor
                const selection = window.getSelection();
                if (selection && selection.anchorNode) {
                  let element = selection.anchorNode.nodeType === 3 
                    ? selection.anchorNode.parentElement 
                    : selection.anchorNode as HTMLElement;
                  
                  // Make sure we're inside the contentEditable div
                  while (element && !element.classList.contains('ProseMirror')) {
                    if (element.parentElement?.classList.contains('ProseMirror')) {
                      element.style.marginRight = value;
                      break;
                    }
                    element = element.parentElement;
                  }
                }
                return true;
              },
            }),
            setSpacingBefore: (value: string) => ({
              run: () => {
                // Apply spacing before INSIDE the editor
                const selection = window.getSelection();
                if (selection && selection.anchorNode) {
                  let element = selection.anchorNode.nodeType === 3 
                    ? selection.anchorNode.parentElement 
                    : selection.anchorNode as HTMLElement;
                  
                  // Make sure we're inside the contentEditable div
                  while (element && !element.classList.contains('ProseMirror')) {
                    if (element.parentElement?.classList.contains('ProseMirror')) {
                      element.style.marginTop = value;
                      break;
                    }
                    element = element.parentElement;
                  }
                }
                return true;
              },
            }),
            setSpacingAfter: (value: string) => ({
              run: () => {
                // Apply spacing after INSIDE the editor
                const selection = window.getSelection();
                if (selection && selection.anchorNode) {
                  let element = selection.anchorNode.nodeType === 3 
                    ? selection.anchorNode.parentElement 
                    : selection.anchorNode as HTMLElement;
                  
                  // Make sure we're inside the contentEditable div
                  while (element && !element.classList.contains('ProseMirror')) {
                    if (element.parentElement?.classList.contains('ProseMirror')) {
                      element.style.marginBottom = value;
                      break;
                    }
                    element = element.parentElement;
                  }
                }
                return true;
              },
            }),
            setImage: ({ src }: { src: string }) => ({
              run: () => {
                // Insert an image
                const img = `<img src="${src}" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
                document.execCommand("insertHTML", false, img);
                return true;
              },
            }),
            insertTable: ({ rows, cols, withHeaderRow }: { rows: number; cols: number; withHeaderRow?: boolean }) => ({
              run: () => {
                // Create a simple HTML table
                let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
                for (let i = 0; i < rows; i++) {
                  tableHTML += '<tr>';
                  for (let j = 0; j < cols; j++) {
                    const tag = withHeaderRow && i === 0 ? 'th' : 'td';
                    tableHTML += `<${tag} style="border: 1px solid #ccc; padding: 8px;">${tag === 'th' ? 'Header' : 'Cell'}</${tag}>`;
                  }
                  tableHTML += '</tr>';
                }
                tableHTML += '</table>';
                document.execCommand("insertHTML", false, tableHTML);
                return true;
              },
            }),
            setHorizontalRule: () => ({
              run: () => {
                // Insert a horizontal rule
                document.execCommand("insertHTML", false, '<hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />');
                return true;
              },
            }),
            setLink: ({ href }: { href: string }) => ({
              run: () => {
                // Create a link from selected text
                document.execCommand("createLink", false, href);
                return true;
              },
            }),
            setDocumentHeader: () => ({
              run: () => {
                // Insert a header placeholder
                const header = '<div style="border-bottom: 2px solid #2E75B6; padding: 10px 0; margin-bottom: 20px; color: #1F4E79; font-weight: bold;">Document Header</div>';
                document.execCommand("insertHTML", false, header);
                return true;
              },
            }),
            setDocumentFooter: () => ({
              run: () => {
                // Insert a footer placeholder
                const footer = '<div style="border-top: 2px solid #2E75B6; padding: 10px 0; margin-top: 20px; color: #1F4E79; font-size: 10pt; text-align: center;">Document Footer</div>';
                document.execCommand("insertHTML", false, footer);
                return true;
              },
            }),
          };
        },
      }),
      // Add .can() method for checking if commands are available
      can: () => ({
        setBold: () => true,
        setItalic: () => true,
        setUnderline: () => true,
        toggleBold: () => true,
        toggleItalic: () => true,
        toggleUnderline: () => true,
        liftListItem: () => {
          const selection = window.getSelection();
          if (!selection || !selection.anchorNode) return false;
          const parent = selection.anchorNode.parentElement;
          return parent?.closest("ul, ol") !== null;
        },
        sinkListItem: () => {
          const selection = window.getSelection();
          if (!selection || !selection.anchorNode) return false;
          const parent = selection.anchorNode.parentElement;
          return parent?.closest("ul, ol") !== null;
        },
      }),
      isActive: (format: string, attrs?: any) => {
        if (format === "bold") return document.queryCommandState("bold");
        if (format === "italic") return document.queryCommandState("italic");
        if (format === "underline")
          return document.queryCommandState("underline");
        if (format === "strike")
          return document.queryCommandState("strikeThrough");
        if (format === "subscript")
          return document.queryCommandState("subscript");
        if (format === "superscript")
          return document.queryCommandState("superscript");
        if (format === "bulletList")
          return document.queryCommandState("insertUnorderedList");
        if (format === "orderedList")
          return document.queryCommandState("insertOrderedList");
        if (format === "highlight") {
          const selection = window.getSelection();
          if (!selection || !selection.anchorNode) return false;
          const parent = selection.anchorNode.parentElement;
          return parent?.style?.backgroundColor !== "";
        }
        if (format === "heading" && attrs?.level) {
          const selection = window.getSelection();
          if (!selection || !selection.anchorNode) return false;
          const parent = selection.anchorNode.parentElement;
          return parent?.tagName === `H${attrs.level}`;
        }
        if (attrs?.textAlign) {
          const selection = window.getSelection();
          if (!selection || !selection.anchorNode) return false;
          const parent = selection.anchorNode.parentElement as HTMLElement;
          const align = parent?.style?.textAlign || "left";
          return align === attrs.textAlign;
        }
        return false;
      },
      // Event emitter (fake - for compatibility)
      on: () => {},
      off: () => {},
      getHTML: () => contentRef.current?.innerHTML || "",
      getText: () => contentRef.current?.textContent || "",
      setContent: (content: string) => {
        if (contentRef.current) contentRef.current.innerHTML = content;
      },
      // Commands API for compatibility
      commands: {
        setContent: (content: string) => {
          if (contentRef.current) contentRef.current.innerHTML = content;
          return true;
        },
      },
      // State API for selection (fake)
      state: {
        selection: {
          from: 0,
          to: 0,
          constructor: {
            create: () => ({}),
          },
        },
        doc: {
          content: { size: contentRef.current?.textContent?.length || 0 },
          textBetween: (from: number, to: number) => {
            const text = contentRef.current?.textContent || "";
            return text.substring(from, to);
          },
          descendants: (callback: Function) => {
            // Count paragraphs
            const paragraphs = contentRef.current?.querySelectorAll("p") || [];
            paragraphs.forEach((p) => callback({ type: { name: 'paragraph' } }));
          },
        },
        tr: {},
      },
      // View API (fake)
      view: {
        dispatch: () => {},
        focus: () => {
          if (contentRef.current) contentRef.current.focus();
        },
        updateState: () => {},
      },
      // Extension manager (fake)
      extensionManager: {
        extensions: [],
      },
      // Expose saveSelection for color pickers
      saveSelection,
    };

    // Listen to selection changes to auto-save
    const handleSelectionChange = () => {
      saveSelection();
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    onEditorReady(fakeEditor);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [onEditorReady]);

  return (
    <div
      ref={contentRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      className="ProseMirror w-full h-full overflow-auto bg-gray-100 focus:outline-none"
      style={{
        maxWidth: "8.5in",
        margin: "0 auto",
        padding: "60px 80px",
        background: "white",
        fontFamily: "Arial, sans-serif",
        fontSize: "11pt",
        lineHeight: 1.6,
        color: "#2C2C2C",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
