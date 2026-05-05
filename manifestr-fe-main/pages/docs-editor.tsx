import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import TopHeader from "../components/spreadsheet/TopHeader";
import TiptapEditor from "../components/docs/TiptapEditor";
import DocumentOutline from "../components/docs/DocumentOutline";
import { resetHeadingCounter } from "../lib/tiptap-heading-with-id-extension";
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
import { useEffect } from "react";

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
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );

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
    try {
      // Get the HTML content from the editor
      const htmlContent = editorInstance?.getHTML() || editorHTML;

      if (
        !htmlContent ||
        htmlContent.trim() === "" ||
        htmlContent === "<p></p>"
      ) {
        alert("No content to download");
        return;
      }

      // Parse HTML to extract text and basic formatting
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      // Import docx library
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } =
        await import("docx");

      // Convert HTML elements to docx paragraphs
      const paragraphs: any[] = [];

      const processNode = (node: any) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (text) {
            paragraphs.push(
              new Paragraph({
                children: [new TextRun(text)],
              }),
            );
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toLowerCase();
          const text = node.textContent?.trim();

          if (!text) return;

          if (tagName === "h1") {
            paragraphs.push(
              new Paragraph({
                text: text,
                heading: HeadingLevel.HEADING_1,
              }),
            );
          } else if (tagName === "h2") {
            paragraphs.push(
              new Paragraph({
                text: text,
                heading: HeadingLevel.HEADING_2,
              }),
            );
          } else if (tagName === "h3") {
            paragraphs.push(
              new Paragraph({
                text: text,
                heading: HeadingLevel.HEADING_3,
              }),
            );
          } else if (tagName === "p") {
            const children: any[] = [];
            node.childNodes.forEach((child: any) => {
              const childText = child.textContent?.trim();
              if (childText) {
                const bold = child.tagName === "STRONG" || child.tagName === "B";
                const italic = child.tagName === "EM" || child.tagName === "I";
                children.push(
                  new TextRun({ text: childText, bold, italics: italic }),
                );
              }
            });

            if (children.length === 0 && text) {
              children.push(new TextRun(text));
            }

            if (children.length > 0) {
              paragraphs.push(new Paragraph({ children }));
            }
          } else if (tagName === "li") {
            paragraphs.push(
              new Paragraph({
                text: `• ${text}`,
              }),
            );
          } else {
            // Process child nodes
            node.childNodes.forEach(processNode);
          }
        }
      };

      // Process all body children
      doc.body.childNodes.forEach(processNode);

      // Create document
      const docxDoc = new Document({
        sections: [
          {
            children:
              paragraphs.length > 0
                ? paragraphs
                : [
                    new Paragraph({
                      children: [new TextRun("Empty Document")],
                    }),
                  ],
          },
        ],
      });

      // Generate and download
      const blob = await Packer.toBlob(docxDoc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `document_${new Date().getTime()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document. Please try again.");
    }
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
  // For documents, content IS the HTML string directly (editorState from backend)
  // For spreadsheets/presentations, content is an object
  console.log("🔍 docs-editor: RAW content:", content);
  console.log("🔍 docs-editor: content type:", typeof content);
  if (content && typeof content === "object") {
    console.log("🔍 docs-editor: content keys:", Object.keys(content));
    console.log(
      "🔍 docs-editor: content.html:",
      content.html?.substring(0, 100),
    );
    console.log(
      "🔍 docs-editor: content.editorState:",
      typeof content.editorState,
    );
  }

  let savedHtmlContent = null;
  if (typeof content === "string") {
    savedHtmlContent = content;
  } else if (content?.html) {
    savedHtmlContent = content.html;
  } else if (content?.editorState) {
    // Backend might return editorState directly
    savedHtmlContent =
      typeof content.editorState === "string"
        ? content.editorState
        : content.editorState?.html || null;
  }

  console.log(
    "🔍 docs-editor: savedHtmlContent preview:",
    savedHtmlContent?.substring(0, 200) || "null",
  );
  console.log(
    "🔍 docs-editor: savedHtmlContent length:",
    savedHtmlContent?.length || 0,
  );

  const handleSelectStyleGuide = async (styleGuide: any) => {
    setShowStyleGuideModal(false);

    const brandName = styleGuide.brand_name || styleGuide.name;
    showToast(
      `Preparing to apply "${brandName}" theme to your document...`,
      "info",
    );

    try {
      showToast(`Capturing current document content...`, "info");
      const currentContent = editorInstance?.getHTML() || editorHTML;

      if (!currentContent || currentContent.trim() === "") {
        showToast("No document content to apply style guide", "error");
        return;
      }

      // Build payload matching the working format from InsertThemePanel
      const payload = {
        styleGuideId: styleGuide.id,
        styleGuide: {
          colors: styleGuide.colors,
          typography: styleGuide.typography,
          brandName: brandName,
          logo: styleGuide.logo,
        },
        meta: {
          editorType: "document",
          applyStyleGuide: true,
        },
        prompt: `Redesign this document with brand style guide: ${brandName}`,
        documentData: currentContent,
      };

      showToast(
        `Regenerating document with "${brandName}" theme... Please wait, this may take a moment.`,
        "info",
      );
      const response = await api.post("/document-generator/modify", payload);

      showToast(`Applying new theme to your document...`, "info");

      if (response.data?.data?.documentData) {
        if (editorInstance?.commands?.setContent) {
          editorInstance.commands.setContent(response.data.data.documentData);
        } else {
          window.location.reload();
        }
        showToast(
          `Document regenerated with "${brandName}" theme successfully!`,
          "success",
        );
      } else {
        showToast("Document regenerated successfully!", "success");
        window.location.reload();
      }
    } catch (error: any) {
      console.error("❌ Failed to apply style guide:", error);
      showToast(
        `Failed to apply style guide: ${error?.response?.data?.message || error?.message || "Unknown error"}`,
        "error",
      );
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
            {/* Render with TipTap Editor */}
            {useCollaboration && actualDocumentId ? (
              <CollaborativeTiptapEditor
                documentId={actualDocumentId}
                initialContent={content || editorContent}
                onEditorReady={(editor) => {
                  setEditorInstance(editor);
                  // Extract headings from TipTap editor (IDs are now built-in)
                  if (editor) {
                    const extractTipTapHeadings = () => {
                      console.log("🚀 [Collab] Starting heading extraction...");

                      // Reset the heading counter before extraction to ensure consistent IDs
                      resetHeadingCounter();

                      // Wait for DOM to render, then extract headings
                      setTimeout(() => {
                        const headingsData = [];
                        let headingIndex = 0;

                        editor.state.doc.descendants((node, pos) => {
                          if (node.type.name === "heading") {
                            // Use the ID from the node attributes (set by our extension)
                            const headingId =
                              node.attrs.id || `heading-${headingIndex}`;

                            headingsData.push({
                              id: headingId,
                              level: node.attrs.level || 2,
                              text: node.textContent,
                            });
                            headingIndex++;
                          }
                        });

                        console.log(
                          "📋 [Collab] Extracted TipTap headings:",
                          headingsData,
                        );
                        setHeadings(headingsData);

                        // Verify IDs are in the DOM
                        setTimeout(() => {
                          const allHeadingsInDom = document.querySelectorAll(
                            "h1, h2, h3, h4, h5, h6",
                          );
                          console.log(
                            "🔎 [Collab] Headings in DOM:",
                            Array.from(allHeadingsInDom).map((el) => ({
                              tag: el.tagName,
                              text: el.textContent?.substring(0, 30),
                              id: el.id,
                              dataId: el.getAttribute("data-id"),
                            })),
                          );
                        }, 500);
                      }, 300);
                    };

                    // Extract on mount and on updates
                    setTimeout(extractTipTapHeadings, 500);
                    editor.on("update", extractTipTapHeadings);
                  }
                }}
              />
            ) : (
              <TiptapEditor
                content={editorContent}
                onUpdate={(html) => {
                  setEditorHTML(html);
                  extractHeadings(html);
                }}
                onEditorReady={(editor) => {
                  setEditorInstance(editor);
                  // Extract headings from TipTap editor (IDs are now built-in)
                  if (editor) {
                    const extractTipTapHeadings = () => {
                      console.log("🚀 [TipTap] Starting heading extraction...");

                      // Reset the heading counter before extraction to ensure consistent IDs
                      resetHeadingCounter();

                      // Wait for DOM to render, then extract headings
                      setTimeout(() => {
                        const headingsData = [];
                        let headingIndex = 0;

                        editor.state.doc.descendants((node, pos) => {
                          if (node.type.name === "heading") {
                            // Use the ID from the node attributes (set by our extension)
                            const headingId =
                              node.attrs.id || `heading-${headingIndex}`;

                            headingsData.push({
                              id: headingId,
                              level: node.attrs.level || 2,
                              text: node.textContent,
                            });
                            headingIndex++;
                          }
                        });

                        console.log(
                          "📋 [TipTap] Extracted TipTap headings:",
                          headingsData,
                        );
                        setHeadings(headingsData);

                        // Verify IDs are in the DOM
                        setTimeout(() => {
                          const allHeadingsInDom = document.querySelectorAll(
                            "h1, h2, h3, h4, h5, h6",
                          );
                          console.log(
                            "🔎 [TipTap] Headings in DOM:",
                            Array.from(allHeadingsInDom).map((el) => ({
                              tag: el.tagName,
                              text: el.textContent?.substring(0, 30),
                              id: el.id,
                              dataId: el.getAttribute("data-id"),
                            })),
                          );
                        }, 500);
                      }, 300);
                    };

                    // Extract on mount and on updates
                    setTimeout(extractTipTapHeadings, 500);
                    editor.on("update", extractTipTapHeadings);
                  }
                }}
              />
            )}

            {/* Save Status Indicator */}
            {actualDocumentId && (
              <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-white shadow-md rounded-lg px-4 py-2 border border-gray-200">
                {saveStatus === "saved" && (
                  <>
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      All changes saved
                    </span>
                  </>
                )}
                {saveStatus === "saving" && (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-sm text-gray-600">Saving...</span>
                  </>
                )}
                {saveStatus === "unsaved" && (
                  <>
                    <svg
                      className="w-4 h-4 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Unsaved changes
                    </span>
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
  onSaveStatusChange?: (status: "saved" | "saving" | "unsaved") => void;
}) {
  const [html, setHtml] = React.useState(
    '<div style="padding: 40px; text-align: center; color: #666;">Loading document...</div>',
  );
  const [error, setError] = React.useState(null);
  const contentRef = React.useRef(null);
  const saveTimeoutRef = React.useRef(null);
  const lastSavedContentRef = React.useRef("");
  const contentLoadedRef = React.useRef(false); // Track if real content has loaded

  const sanitizeTransientMarkup = React.useCallback((raw: string) => {
    if (typeof raw !== "string") return "";
    const div = document.createElement("div");
    div.innerHTML = raw;
    const marks = Array.from(
      div.querySelectorAll('mark[data-type="search-highlight"]'),
    ) as HTMLElement[];
    marks.forEach((m) => {
      const parent = m.parentNode;
      if (!parent) return;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
    });
    div.querySelectorAll('[data-search-active="true"]').forEach((el) => {
      try {
        (el as HTMLElement).removeAttribute("data-search-active");
        (el as HTMLElement).classList.remove("search-highlight--active");
      } catch {}
    });
    return div.innerHTML;
  }, []);

  // Auto-save function
  const autoSave = React.useCallback(
    async (content: string) => {
      if (!documentId) return;

      // 🚨 CRITICAL: Don't save if content hasn't loaded yet (still showing "Loading...")
      if (!contentLoadedRef.current) {
        console.log("⚠️ Skipping auto-save: content not loaded yet");
        return;
      }

      // Don't save if content hasn't changed
      if (content === lastSavedContentRef.current) return;

      try {
        onSaveStatusChange?.("saving");
        console.log("💾 Auto-saving document...", documentId);
        await api.patch(`/ai/generation/${documentId}`, {
          content: { html: content },
        });
        lastSavedContentRef.current = content;
        onSaveStatusChange?.("saved");
        console.log("✅ Document auto-saved successfully");
      } catch (err) {
        console.error("❌ Auto-save failed:", err);
        onSaveStatusChange?.("unsaved");
      }
    },
    [documentId, onSaveStatusChange],
  );

  // Debounced auto-save on content change
  const handleContentChange = React.useCallback(() => {
    if (!contentRef.current) return;

    const currentContent = sanitizeTransientMarkup(
      contentRef.current.innerHTML,
    );

    // Mark as unsaved when content changes
    if (currentContent !== lastSavedContentRef.current) {
      onSaveStatusChange?.("unsaved");
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (2 seconds after last change)
    saveTimeoutRef.current = setTimeout(() => {
      autoSave(currentContent);
    }, 2000);
  }, [autoSave, onSaveStatusChange, sanitizeTransientMarkup]);

  React.useEffect(() => {
    const loadDoc = async () => {
      try {
        // Check if we have saved content for this document ID
        if (savedContent) {
          console.log("📄 Loading saved document content");

          // ✅ FIX: Extract body content + styles if backend sent full HTML document
          let cleanContent = savedContent;
          if (
            savedContent.includes("<!DOCTYPE html>") ||
            (savedContent.includes("<html") && savedContent.includes("<body"))
          ) {
            console.log(
              "🔧 Detecting full HTML document, extracting content...",
            );
            const parser = new DOMParser();
            const doc = parser.parseFromString(savedContent, "text/html");

            // Extract ALL <style> tags from head AND body
            const styleTags = Array.from(doc.querySelectorAll("style"));
            let allStyles = styleTags.map((tag) => tag.innerHTML).join("\n");

            // SIMPLIFIED: Don't try to remove body styles - just keep everything!
            // The inline styles on our contentRef div will override anyway
            const styles = allStyles ? `<style>${allStyles}</style>` : "";

            // Extract body innerHTML
            const bodyContent = doc.body?.innerHTML || "";

            if (bodyContent && bodyContent !== savedContent) {
              // Combine styles + body content
              cleanContent = styles + bodyContent;
              console.log("✅ Extracted full content with styles");
              console.log("   - Total length:", cleanContent.length, "chars");
              console.log("   - Styles length:", allStyles.length, "chars");
              console.log("   - Body length:", bodyContent.length, "chars");
            } else {
              console.log("⚠️ Extraction failed, using original content");
              cleanContent = savedContent;
            }
          } else {
            console.log("📄 Content is already HTML fragment (using as-is)");
          }

          setHtml(cleanContent);
          lastSavedContentRef.current = sanitizeTransientMarkup(cleanContent);
          contentLoadedRef.current = true; // ✅ Mark content as loaded
          console.log("✅ Content loaded, auto-save enabled");
          return;
        }

        // ❌ REMOVED: Template loading - NO MORE TEMPLATES!
        // All documents are now generated purely from AI via the backend

        console.log(
          "📄 Starting with blank document (AI will generate content)",
        );

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
          <h1>New Document</h1>
          <p>Start typing or use AI to generate content...</p>
        `;

        setHtml(styledHtml);
        lastSavedContentRef.current = styledHtml;
        contentLoadedRef.current = true; // ✅ Mark blank document as loaded
        console.log("✅ Blank document ready, auto-save enabled");
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
  }, [documentId, savedContent, sanitizeTransientMarkup]);

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

    contentRef.current.addEventListener("input", handleInput);
    const currentRef = contentRef.current;

    return () => {
      observer.disconnect();
      if (currentRef) {
        currentRef.removeEventListener("input", handleInput);
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
        const currentContent = sanitizeTransientMarkup(
          contentRef.current.innerHTML,
        );
        if (currentContent !== lastSavedContentRef.current) {
          // Synchronous save on unload
          navigator.sendBeacon(
            `/api/ai/generation/${documentId}`,
            JSON.stringify({ content: { html: currentContent } }),
          );
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Final save when component unmounts
      if (contentRef.current && documentId) {
        const currentContent = sanitizeTransientMarkup(
          contentRef.current.innerHTML,
        );
        if (currentContent !== lastSavedContentRef.current) {
          autoSave(currentContent);
        }
      }
    };
  }, [documentId, autoSave, sanitizeTransientMarkup]);

  // Extract headings from the rendered HTML and add IDs
  React.useEffect(() => {
    if (!contentRef.current) return;

    const extractHeadings = () => {
      console.log("🔍 Starting heading extraction...");
      console.log(
        "📄 HTML content length:",
        contentRef.current.innerHTML.length,
      );

      let headingElements = contentRef.current.querySelectorAll(
        "h1, h2, h3, h4, h5, h6",
      );
      const headingsData = [];

      console.log("🔍 Found h1-h6 elements:", headingElements.length);

      // If no headings found, try to detect bold/large text as headings
      if (headingElements.length === 0) {
        console.log("⚠️ No h1-h6 tags found, searching for bold/large text...");

        // Find ALL elements with text, not just paragraphs
        const allElements = contentRef.current.querySelectorAll("p, div, span");
        const potentialHeadings = [];

        console.log("🔍 Scanning", allElements.length, "elements for headings");

        allElements.forEach((el, index) => {
          const text = el.textContent.trim();
          if (!text) return;

          // Get computed styles
          const styles = window.getComputedStyle(el);
          const fontSize = parseFloat(styles.fontSize);
          const fontWeight = parseInt(styles.fontWeight);
          const isBold = fontWeight >= 600 || el.querySelector("strong, b");

          // Check if it looks like a heading
          const isLikelyHeading =
            (fontSize > 14 && isBold) || // Large and bold
            (text.length < 150 && isBold) || // Short and bold
            fontWeight >= 700 || // Very bold
            fontSize >= 18; // Very large

          if (isLikelyHeading) {
            console.log(
              `✅ Found potential heading: "${text.substring(0, 50)}" (size: ${fontSize}, weight: ${fontWeight})`,
            );

            // Determine heading level based on font size and weight
            let level = 2; // default to h2
            if (fontSize >= 24 || fontWeight >= 800) level = 1;
            else if (fontSize >= 18) level = 2;
            else level = 3;

            // Create heading element
            const heading = document.createElement(`h${level}`);
            heading.innerHTML = el.innerHTML;
            heading.className = el.className;
            heading.style.cssText = el.style.cssText;
            el.replaceWith(heading);
            potentialHeadings.push(heading);
          }
        });

        console.log(
          "✅ Converted",
          potentialHeadings.length,
          "elements to headings",
        );
        headingElements = contentRef.current.querySelectorAll(
          "h1, h2, h3, h4, h5, h6",
        );
      }

      headingElements.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
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

      console.log("📋 Final extracted headings:", headingsData);

      if (onHeadingsChange) {
        onHeadingsChange(headingsData);
      }
    };

    // Extract headings after a delay to ensure HTML is rendered
    setTimeout(extractHeadings, 300);

    // Also re-extract if content changes
    const observer = new MutationObserver(() => {
      console.log("🔄 Content changed, re-extracting headings...");
      extractHeadings();
    });

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
      const root = contentRef.current as HTMLElement | null;
      if (!root) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount <= 0) return;
      const range = sel.getRangeAt(0);
      const container =
        range.commonAncestorContainer.nodeType === 1
          ? (range.commonAncestorContainer as HTMLElement)
          : (range.commonAncestorContainer.parentElement as HTMLElement | null);
      if (!container || !root.contains(container)) return;
      savedSelection = range.cloneRange();
    };

    const restoreSelection = () => {
      if (savedSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedSelection);
      }
    };

    const listeners = new Map<string, Set<Function>>();
    const emit = (event: string, payload?: any) => {
      const set = listeners.get(event);
      if (!set) return;
      Array.from(set).forEach((cb) => {
        try {
          cb(payload);
        } catch {}
      });
    };

    const fakeEditor = {
      getSources: () => {
        const root = contentRef.current as HTMLElement | null;
        if (!root) return [];
        const el = root.querySelector(
          'div[data-type="sources-store"]',
        ) as HTMLElement | null;
        if (!el) return [];
        const raw = (el.textContent || "").trim();
        if (!raw) return [];
        try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      },
      setSources: (sources: any[]) => {
        const root = contentRef.current as HTMLElement | null;
        if (!root) return false;
        let el = root.querySelector(
          'div[data-type="sources-store"]',
        ) as HTMLElement | null;
        if (!el) {
          el = document.createElement("div");
          el.setAttribute("data-type", "sources-store");
          el.setAttribute("contenteditable", "false");
          (el.style as any).display = "none";
          root.insertBefore(el, root.firstChild);
        }
        try {
          el.textContent = JSON.stringify(
            Array.isArray(sources) ? sources : [],
          );
        } catch {
          el.textContent = "[]";
        }
        return true;
      },
      applyLink: ({ href, text }: { href: string; text?: string }) => {
        const root = contentRef.current as HTMLElement | null;
        if (!root) return false;
        root.focus();
        restoreSelection();
        const range: Range | null = savedSelection
          ? savedSelection.cloneRange()
          : null;
        if (!range) return false;
        const container =
          range.commonAncestorContainer.nodeType === 1
            ? (range.commonAncestorContainer as HTMLElement)
            : (range.commonAncestorContainer
                .parentElement as HTMLElement | null);
        const existingAnchor = container?.closest?.(
          "a[href]",
        ) as HTMLAnchorElement | null;
        if (existingAnchor && root.contains(existingAnchor)) {
          existingAnchor.setAttribute("href", href);
          existingAnchor.href = href;
          existingAnchor.style.color = "#3b82f6";
          existingAnchor.style.textDecoration = "underline";
          existingAnchor.rel = "noreferrer noopener";
          existingAnchor.target = "_blank";
          if (typeof text === "string" && text.length > 0) {
            existingAnchor.textContent = text;
          }
          const next = document.createRange();
          next.selectNodeContents(existingAnchor);
          next.collapse(false);
          savedSelection = next.cloneRange();
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(next);
          return true;
        }
        const a = document.createElement("a");
        a.href = href;
        a.style.color = "#3b82f6";
        a.style.textDecoration = "underline";
        a.rel = "noreferrer noopener";
        a.target = "_blank";
        if (typeof text === "string" && text.length > 0) {
          a.textContent = text;
          range.deleteContents();
          range.insertNode(a);
        } else if (range.collapsed) {
          a.textContent = href;
          range.insertNode(a);
        } else {
          const frag = range.extractContents();
          a.appendChild(frag);
          range.insertNode(a);
        }
        const next = document.createRange();
        next.setStartAfter(a);
        next.collapse(true);
        savedSelection = next.cloneRange();
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(next);
        return true;
      },
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
                const highlightColor = color || "#fef08a";
                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) return false;
                const range = selection.getRangeAt(0);

                const root = contentRef.current as HTMLElement | null;
                if (!root) return false;

                const getHighlightedAncestor = (
                  node: Node | null,
                ): HTMLElement | null => {
                  const el =
                    (node &&
                      (node.nodeType === Node.ELEMENT_NODE
                        ? (node as HTMLElement)
                        : node.parentElement)) ||
                    null;
                  if (!el) return null;
                  const highlighted = el.closest?.(
                    '[style*="background-color"]',
                  ) as HTMLElement | null;
                  if (highlighted?.style?.backgroundColor) return highlighted;
                  if (el?.style?.backgroundColor) return el;
                  return null;
                };

                const isSelectionHighlighted = () => {
                  const a = getHighlightedAncestor(selection.anchorNode);
                  const f = getHighlightedAncestor(selection.focusNode);
                  return !!(a || f);
                };

                const clearBackgroundInRange = (r: Range) => {
                  const container =
                    (r.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
                      ? (r.commonAncestorContainer as HTMLElement)
                      : r.commonAncestorContainer.parentElement) || root;

                  const walker = document.createTreeWalker(
                    container,
                    NodeFilter.SHOW_ELEMENT,
                    {
                      acceptNode: (n) => {
                        const el = n as HTMLElement;
                        if (!el?.style) return NodeFilter.FILTER_SKIP;
                        if (!el.style.backgroundColor)
                          return NodeFilter.FILTER_SKIP;
                        // Only touch elements that intersect the selection
                        try {
                          const elRange = document.createRange();
                          elRange.selectNodeContents(el);
                          const intersects =
                            r.compareBoundaryPoints(
                              Range.END_TO_START,
                              elRange,
                            ) < 0 &&
                            r.compareBoundaryPoints(
                              Range.START_TO_END,
                              elRange,
                            ) > 0;
                          return intersects
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_SKIP;
                        } catch {
                          return NodeFilter.FILTER_SKIP;
                        }
                      },
                    } as any,
                  );

                  const toClean: HTMLElement[] = [];
                  while (walker.nextNode()) {
                    toClean.push(walker.currentNode as HTMLElement);
                  }

                  toClean.forEach((el) => {
                    el.style.backgroundColor = "";
                    // If this was a pure highlight wrapper, unwrap it
                    const style = (el.getAttribute("style") || "").trim();
                    const hasOnlyEmptyStyle =
                      style === "" ||
                      style === "background-color:" ||
                      style === "background-color: ;" ||
                      style === "background-color:;";
                    const isWrapper =
                      el.tagName === "SPAN" ||
                      el.tagName === "FONT" ||
                      el.tagName === "MARK";
                    if (isWrapper && hasOnlyEmptyStyle) {
                      const parent = el.parentNode;
                      if (!parent) return;
                      while (el.firstChild)
                        parent.insertBefore(el.firstChild, el);
                      parent.removeChild(el);
                    } else {
                      // also remove now-empty style attribute
                      if (!el.getAttribute("style")?.trim())
                        el.removeAttribute("style");
                    }
                  });
                };

                // Toggle off
                if (isSelectionHighlighted()) {
                  clearBackgroundInRange(range);
                  return true;
                }

                // Toggle on
                document.execCommand("backColor", false, highlightColor);
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
                const pageBreak =
                  '<div data-type="page-break" class="page-break" style="page-break-after: always;"></div>';
                document.execCommand("insertHTML", false, pageBreak);
                return true;
              },
            }),
            setIndentLeft: (value: string) => ({
              run: () => {
                // Apply left indent to selected element INSIDE the editor
                const selection = window.getSelection();
                if (selection && selection.anchorNode) {
                  let element =
                    selection.anchorNode.nodeType === 3
                      ? selection.anchorNode.parentElement
                      : (selection.anchorNode as HTMLElement);

                  // Make sure we're inside the contentEditable div
                  while (
                    element &&
                    !element.classList.contains("ProseMirror")
                  ) {
                    if (
                      element.parentElement?.classList.contains("ProseMirror")
                    ) {
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
                  let element =
                    selection.anchorNode.nodeType === 3
                      ? selection.anchorNode.parentElement
                      : (selection.anchorNode as HTMLElement);

                  // Make sure we're inside the contentEditable div
                  while (
                    element &&
                    !element.classList.contains("ProseMirror")
                  ) {
                    if (
                      element.parentElement?.classList.contains("ProseMirror")
                    ) {
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
                  let element =
                    selection.anchorNode.nodeType === 3
                      ? selection.anchorNode.parentElement
                      : (selection.anchorNode as HTMLElement);

                  // Make sure we're inside the contentEditable div
                  while (
                    element &&
                    !element.classList.contains("ProseMirror")
                  ) {
                    if (
                      element.parentElement?.classList.contains("ProseMirror")
                    ) {
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
                  let element =
                    selection.anchorNode.nodeType === 3
                      ? selection.anchorNode.parentElement
                      : (selection.anchorNode as HTMLElement);

                  // Make sure we're inside the contentEditable div
                  while (
                    element &&
                    !element.classList.contains("ProseMirror")
                  ) {
                    if (
                      element.parentElement?.classList.contains("ProseMirror")
                    ) {
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
            insertTable: ({
              rows,
              cols,
              withHeaderRow,
            }: {
              rows: number;
              cols: number;
              withHeaderRow?: boolean;
            }) => ({
              run: () => {
                // Create a simple HTML table
                let tableHTML =
                  '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
                for (let i = 0; i < rows; i++) {
                  tableHTML += "<tr>";
                  for (let j = 0; j < cols; j++) {
                    const tag = withHeaderRow && i === 0 ? "th" : "td";
                    tableHTML += `<${tag} style="border: 1px solid #ccc; padding: 8px;">${tag === "th" ? "Header" : "Cell"}</${tag}>`;
                  }
                  tableHTML += "</tr>";
                }
                tableHTML += "</table>";
                document.execCommand("insertHTML", false, tableHTML);
                return true;
              },
            }),
            setHorizontalRule: () => ({
              run: () => {
                // Insert a horizontal rule
                document.execCommand(
                  "insertHTML",
                  false,
                  '<hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />',
                );
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
                const header =
                  '<div style="border-bottom: 2px solid #2E75B6; padding: 10px 0; margin-bottom: 20px; color: #1F4E79; font-weight: bold;">Document Header</div>';
                document.execCommand("insertHTML", false, header);
                return true;
              },
            }),
            setDocumentFooter: () => ({
              run: () => {
                // Insert a footer placeholder
                const footer =
                  '<div style="border-top: 2px solid #2E75B6; padding: 10px 0; margin-top: 20px; color: #1F4E79; font-size: 10pt; text-align: center;">Document Footer</div>';
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
      on: (event: string, cb: Function) => {
        const set = listeners.get(event) || new Set<Function>();
        set.add(cb);
        listeners.set(event, set);
      },
      off: (event: string, cb: Function) => {
        const set = listeners.get(event);
        if (!set) return;
        set.delete(cb);
        if (set.size === 0) listeners.delete(event);
      },
      getHTML: () => contentRef.current?.innerHTML || "",
      getText: () => contentRef.current?.textContent || "",
      setPageNumbers: (position: string | null) => {
        const root = contentRef.current as HTMLElement | null;
        if (!root) return false;

        const removeAll = (selector: string) => {
          root.querySelectorAll(selector).forEach((n) => {
            try {
              n.parentNode?.removeChild(n);
            } catch {}
          });
        };

        removeAll('[data-type="page-number"]');
        removeAll('[data-type="page-number-config"]');

        if (!position) return true;

        const config = document.createElement("div");
        config.setAttribute("data-type", "page-number-config");
        config.setAttribute("data-position", position);
        config.setAttribute("contenteditable", "false");
        (config as any).style.display = "none";
        root.insertBefore(config, root.firstChild);

        const breaks = Array.from(
          root.querySelectorAll(
            'div[data-type="page-break"], .page-break, div[style*="page-break-after"]',
          ),
        ) as HTMLElement[];

        const insertAtStart =
          position.startsWith("top") || position.startsWith("middle");

        const makePageEl = (num: number) => {
          const el = document.createElement("div");
          el.setAttribute("data-type", "page-number");
          el.setAttribute("data-position", position);
          el.setAttribute("contenteditable", "false");
          el.className = `page-number page-number--${position}`;
          el.textContent = `Page ${num}`;
          return el;
        };

        if (insertAtStart) {
          const first = makePageEl(1);
          const ref = config.nextSibling;
          if (ref) root.insertBefore(first, ref);
          else root.appendChild(first);

          breaks.forEach((br, idx) => {
            const el = makePageEl(idx + 2);
            const parent = br.parentNode;
            if (!parent) return;
            parent.insertBefore(el, br.nextSibling);
          });
        } else {
          breaks.forEach((br, idx) => {
            const el = makePageEl(idx + 1);
            const parent = br.parentNode;
            if (!parent) return;
            parent.insertBefore(el, br);
          });
          root.appendChild(makePageEl(breaks.length + 1));
        }

        return true;
      },
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
            paragraphs.forEach((p) =>
              callback({ type: { name: "paragraph" } }),
            );
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
    const handleClick = (e: any) => {
      const root = contentRef.current as HTMLElement | null;
      if (!root) return;
      const target = e?.target as Element | null;
      if (!target) return;
      const anchor = (target as any).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor || !root.contains(anchor)) return;
      e.preventDefault();
      e.stopPropagation();
      saveSelection();
      try {
        const r = document.createRange();
        r.selectNodeContents(anchor);
        savedSelection = r.cloneRange();
      } catch {}
      emit("linkClick", {
        href: anchor.getAttribute("href") || anchor.href,
        text: anchor.textContent || "",
      });
    };
    contentRef.current.addEventListener("click", handleClick);

    onEditorReady(fakeEditor);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (contentRef.current) {
        contentRef.current.removeEventListener("click", handleClick);
      }
    };
  }, [onEditorReady]);

  return (
    <div className="simple-editor-wrapper">
      <div className="simple-editor-content">
        <div
          ref={contentRef}
          contentEditable={true}
          spellCheck={true}
          lang="en"
          autoCorrect="on"
          autoCapitalize="sentences"
          suppressContentEditableWarning={true}
          className="tiptap ProseMirror simple-editor focus:outline-none"
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            color: "#18181b",
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
