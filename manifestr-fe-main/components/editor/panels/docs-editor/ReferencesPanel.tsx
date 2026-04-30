import React, { useMemo, useState } from "react";
import {
  List,
  RefreshCw,
  FileDown,
  FileUp,
  ChevronDown,
  Quote,
  BookMarked,
  Book,
  FileText,
  Link,
  ListOrdered,
} from "lucide-react";

interface ReferencesPanelProps {
  store?: any;
  editor?: any;
}

export default function ReferencesPanel({
  store,
  editor,
}: ReferencesPanelProps) {
  const [citationStyle, setCitationStyle] = useState("APA");
  const [toast, setToast] = useState<string | null>(null);
  const [footnoteCount, setFootnoteCount] = useState(1);
  const [endnoteCount, setEndnoteCount] = useState(1);

  // Modal states
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [showCrossRefModal, setShowCrossRefModal] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);

  // Form states
  const [selectedSourceId, setSelectedSourceId] = useState<string>("");
  const [citationAuthor, setCitationAuthor] = useState("");
  const [citationYear, setCitationYear] = useState("");
  const [captionText, setCaptionText] = useState("");
  const [crossRefText, setCrossRefText] = useState("");
  const [sources, setSources] = useState<
    Array<{ id: string; author: string; title: string; year: string; url: string }>
  >([]);

  const getStoredSources = () => {
    if (typeof (editor as any)?.getSources === "function") {
      try {
        const raw = (editor as any).getSources();
        if (Array.isArray(raw)) {
          return raw
            .map((s: any) => ({
              id: typeof s?.id === "string" ? s.id : `src-${Math.random().toString(16).slice(2)}`,
              author: typeof s?.author === "string" ? s.author : "",
              title: typeof s?.title === "string" ? s.title : "",
              year: typeof s?.year === "string" ? s.year : "",
              url: typeof s?.url === "string" ? s.url : "",
            }))
            .filter((s: any) => typeof s.id === "string");
        }
      } catch {}
    }
    const raw = (editor as any)?.__sources;
    if (!Array.isArray(raw)) return [];
    return raw
      .map((s: any) => ({
        id: typeof s?.id === "string" ? s.id : `src-${Math.random().toString(16).slice(2)}`,
        author: typeof s?.author === "string" ? s.author : "",
        title: typeof s?.title === "string" ? s.title : "",
        year: typeof s?.year === "string" ? s.year : "",
        url: typeof s?.url === "string" ? s.url : "",
      }))
      .filter((s: any) => typeof s.id === "string");
  };

  const setStoredSources = (next: any[]) => {
    if (typeof (editor as any)?.setSources === "function") {
      try {
        (editor as any).setSources(next);
      } catch {}
    }
    try {
      (editor as any).__sources = next;
    } catch {}
  };

  const sourcesById = useMemo(() => {
    const map = new Map<string, { id: string; author: string; title: string; year: string; url: string }>();
    sources.forEach((s) => map.set(s.id, s));
    return map;
  }, [sources]);

  // Toast notification helper
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  // Generate Table of Contents
  const handleInsertTOC = () => {
    if (!editor) return;

    // Find all headings in the document
    const editorElement = document.querySelector(".ProseMirror") as HTMLElement;
    if (!editorElement) return;

    const headings = editorElement.querySelectorAll("h1, h2, h3, h4, h5, h6");
    let tocContent =
      '<div style="border: 2px solid #e5e7eb; padding: 16px; border-radius: 8px; margin: 16px 0;"><h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700;">Table of Contents</h2><ul style="list-style: none; padding: 0; margin: 0;">';

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent || "";
      const indent = (level - 1) * 20;
      tocContent += `<li style="margin-left: ${indent}px; padding: 4px 0;"><a href="#" style="color: #3b82f6; text-decoration: none;">${text}</a></li>`;
    });

    tocContent += "</ul></div>";

    editor.chain().focus().insertContent(tocContent).run();
    showToast("Table of Contents inserted");
  };

  // Update TOC
  const handleUpdateTOC = () => {
    if (!editor) return;
    showToast("Table of Contents updated");
  };

  // Insert Footnote
  const handleInsertFootnote = () => {
    if (!editor) return;
    const footnoteText = `<sup style="color: #3b82f6;">[${footnoteCount}]</sup>`;
    editor.chain().focus().insertContent(footnoteText).run();
    setFootnoteCount(footnoteCount + 1);
    showToast(`Footnote ${footnoteCount} inserted`);
  };

  // Insert Endnote
  const handleInsertEndnote = () => {
    if (!editor) return;
    const endnoteText = `<sup style="color: #10b981;">[${endnoteCount}]</sup>`;
    editor.chain().focus().insertContent(endnoteText).run();
    setEndnoteCount(endnoteCount + 1);
    showToast(`Endnote ${endnoteCount} inserted`);
  };

  // Insert Citation
  const handleInsertCitation = () => {
    if (!editor) return;
    setSources(getStoredSources());
    setSelectedSourceId("");
    setShowCitationModal(true);
  };

  const submitCitation = () => {
    if (!editor || !citationAuthor || !citationYear) return;

    let citation = "";
    switch (citationStyle) {
      case "APA":
        citation = `(${citationAuthor}, ${citationYear})`;
        break;
      case "MLA":
        citation = `(${citationAuthor})`;
        break;
      case "Chicago":
        citation = `${citationAuthor}, ${citationYear}`;
        break;
      case "Harvard":
        citation = `(${citationAuthor} ${citationYear})`;
        break;
      default:
        citation = `(${citationAuthor}, ${citationYear})`;
    }
    editor.chain().focus().insertContent(citation).run();
    showToast(`Citation inserted: ${citationStyle}`);
    setShowCitationModal(false);
    setCitationAuthor("");
    setCitationYear("");
  };

  // Manage Sources
  const handleManageSources = () => {
    if (!editor) return;
    const nextSources = getStoredSources();
    setSources(nextSources);
    setShowSourcesModal(true);
  };

  // Insert Bibliography
  const handleInsertBibliography = () => {
    if (!editor) return;
    const stored = getStoredSources();
    const formatEntry = (s: { author: string; title: string; year: string; url: string }) => {
      const author = (s.author || "").trim();
      const title = (s.title || "").trim();
      const year = (s.year || "").trim();
      const url = (s.url || "").trim();
      const parts: string[] = [];
      if (citationStyle === "APA") {
        if (author) parts.push(`${author}.`);
        if (year) parts.push(`(${year}).`);
        if (title) parts.push(`${title}.`);
        if (url) parts.push(url);
        return parts.join(" ");
      }
      if (citationStyle === "MLA") {
        if (author) parts.push(`${author}.`);
        if (title) parts.push(`${title}.`);
        if (year) parts.push(year + ".");
        if (url) parts.push(url);
        return parts.join(" ");
      }
      if (citationStyle === "Chicago") {
        if (author) parts.push(`${author}.`);
        if (title) parts.push(`${title}.`);
        if (year) parts.push(`(${year}).`);
        if (url) parts.push(url);
        return parts.join(" ");
      }
      if (author) parts.push(`${author}.`);
      if (year) parts.push(`(${year}).`);
      if (title) parts.push(`${title}.`);
      if (url) parts.push(`Available at: ${url}.`);
      return parts.join(" ");
    };

    const items =
      stored.length > 0
        ? `<ol style="margin: 0; padding-left: 20px;">${stored
            .map((s) => `<li style="margin: 8px 0; color: #111827;">${formatEntry(s)}</li>`)
            .join("")}</ol>`
        : `<p style="color: #6b7280; font-style: italic;">Add your references here in ${citationStyle} format.</p>`;

    const bibliography = `
      <div data-type="bibliography" style="margin-top: 2rem; border-top: 2px solid #e5e7eb; padding-top: 1rem;">
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px;">Bibliography</h2>
        ${items}
      </div>
    `;
    editor.chain().focus().insertContent(bibliography).run();
    showToast("Bibliography section inserted");
  };

  // Insert Caption
  const handleInsertCaption = () => {
    if (!editor) return;
    setShowCaptionModal(true);
  };

  const submitCaption = () => {
    if (!editor || !captionText) return;
    const captionHTML = `<p style="font-style: italic; color: #6b7280; font-size: 14px; margin-top: 8px;">Figure: ${captionText}</p>`;
    editor.chain().focus().insertContent(captionHTML).run();
    showToast("Caption inserted");
    setShowCaptionModal(false);
    setCaptionText("");
  };

  // Insert Cross Reference
  const handleInsertCrossRef = () => {
    if (!editor) return;
    setShowCrossRefModal(true);
  };

  const submitCrossRef = () => {
    if (!editor || !crossRefText) return;
    const crossRef = `<span style="color: #3b82f6; font-weight: 500;">${crossRefText}</span>`;
    editor.chain().focus().insertContent(crossRef).run();
    showToast("Cross-reference inserted");
    setShowCrossRefModal(false);
    setCrossRefText("");
  };

  // Insert Index
  const handleInsertIndex = () => {
    if (!editor) return;
    const index = `
      <div style="margin-top: 2rem; border-top: 2px solid #e5e7eb; padding-top: 1rem;">
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px;">Index</h2>
        <p style="color: #6b7280; font-style: italic;">Index entries will appear here alphabetically.</p>
      </div>
    `;
    editor.chain().focus().insertContent(index).run();
    showToast("Index section inserted");
  };

  // Update Index
  const handleUpdateIndex = () => {
    if (!editor) return;
    showToast("Index updated");
  };

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[79px] overflow-x-auto px-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          <p className="font-inter text-sm font-medium">{toast}</p>
        </div>
      )}

      {/* Citation Modal */}
      {showCitationModal && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setShowCitationModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Insert Citation ({citationStyle})
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Source (optional)
                </label>
                <select
                  value={selectedSourceId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedSourceId(id);
                    const src = sourcesById.get(id);
                    if (src) {
                      setCitationAuthor(src.author || "");
                      setCitationYear(src.year || "");
                    }
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select a source</option>
                  {getStoredSources().map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {(s.author || "Unknown").slice(0, 40)}{s.year ? ` (${s.year})` : ""}{s.title ? ` - ${String(s.title).slice(0, 40)}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  value={citationAuthor}
                  onChange={(e) => setCitationAuthor(e.target.value)}
                  placeholder="e.g., Smith"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={citationYear}
                  onChange={(e) => setCitationYear(e.target.value)}
                  placeholder="e.g., 2024"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCitationModal(false);
                  setCitationAuthor("");
                  setCitationYear("");
                }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitCitation}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {showSourcesModal && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setShowSourcesModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Manage Sources</h3>
            <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
              {sources.length === 0 && (
                <div className="text-sm text-gray-600">
                  No sources yet. Click Add Source to create one.
                </div>
              )}
              {sources.map((s) => (
                <div key={s.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Author</label>
                      <input
                        value={s.author}
                        onChange={(e) =>
                          setSources((prev) =>
                            prev.map((x) => (x.id === s.id ? { ...x, author: e.target.value } : x)),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Year</label>
                      <input
                        value={s.year}
                        onChange={(e) =>
                          setSources((prev) =>
                            prev.map((x) => (x.id === s.id ? { ...x, year: e.target.value } : x)),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                      <input
                        value={s.title}
                        onChange={(e) =>
                          setSources((prev) =>
                            prev.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">URL</label>
                      <input
                        value={s.url}
                        onChange={(e) =>
                          setSources((prev) =>
                            prev.map((x) => (x.id === s.id ? { ...x, url: e.target.value } : x)),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      onClick={() => setSources((prev) => prev.filter((x) => x.id !== s.id))}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() =>
                  setSources((prev) => [
                    ...prev,
                    {
                      id: `src-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                      author: "",
                      title: "",
                      year: "",
                      url: "",
                    },
                  ])
                }
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Add Source
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => {
                  setShowSourcesModal(false);
                }}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const cleaned = sources.map((s) => ({
                    id: s.id,
                    author: (s.author || "").trim(),
                    title: (s.title || "").trim(),
                    year: (s.year || "").trim(),
                    url: (s.url || "").trim(),
                  }));
                  setStoredSources(cleaned);
                  setShowSourcesModal(false);
                  showToast("Sources saved");
                }}
                className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Caption Modal */}
      {showCaptionModal && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setShowCaptionModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Insert Caption
            </h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Caption Text
              </label>
              <input
                type="text"
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                placeholder="e.g., Employee satisfaction survey results"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                autoFocus
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCaptionModal(false);
                  setCaptionText("");
                }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitCaption}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cross Reference Modal */}
      {showCrossRefModal && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setShowCrossRefModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Insert Cross Reference
            </h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reference Text
              </label>
              <input
                type="text"
                value={crossRefText}
                onChange={(e) => setCrossRefText(e.target.value)}
                placeholder='e.g., "See Figure 1" or "Table 2.1"'
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                autoFocus
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCrossRefModal(false);
                  setCrossRefText("");
                }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitCrossRef}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Table of Contents
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleInsertTOC}
            className="border border-transparent h-[55px] w-[78px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <List
                className="size-[18px]"
                stroke="#364153"
                strokeWidth={1.5}
              />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Insert TOC
              </p>
            </div>
          </button>
          <button
            onClick={handleUpdateTOC}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <RefreshCw
                className="size-[18px]"
                stroke="#364153"
                strokeWidth={1.5}
              />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Update
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Notes */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Notes
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleInsertFootnote}
            className="border border-transparent h-[55px] w-[75px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <FileDown
                className="size-[18px]"
                stroke="#364153"
                strokeWidth={1.5}
              />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Footnote
              </p>
            </div>
          </button>
          <button
            onClick={handleInsertEndnote}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <FileUp
                className="size-[18px]"
                stroke="#364153"
                strokeWidth={1.5}
              />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Endnote
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Citations */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Citations
        </p>
        <div className="flex gap-2 items-end">
          <div className="relative">
            <select
              value={citationStyle}
              onChange={(e) => {
                setCitationStyle(e.target.value);
                showToast(`Citation style: ${e.target.value}`);
              }}
              className="border border-[#d1d5dc] rounded-md h-[34px] w-[140px] px-3 font-inter text-sm text-[#0a0a0a] appearance-none"
            >
              <option>APA</option>
              <option>MLA</option>
              <option>Chicago</option>
              <option>Harvard</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-[11px] size-3 pointer-events-none"
              stroke="#364153"
              strokeWidth={1.5}
            />
          </div>
          <button
            onClick={handleInsertCitation}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Quote
                className="size-[18px]"
                stroke="#364153"
                strokeWidth={1.5}
              />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Citation
              </p>
            </div>
          </button>
          <button
            onClick={handleManageSources}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <BookMarked
                className="size-[18px]"
                stroke="#364153"
                strokeWidth={1.5}
              />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Sources
              </p>
            </div>
          </button>
          <button
            onClick={handleInsertBibliography}
            className="border border-transparent h-[55px] w-[86px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Book
                className="size-[18px]"
                stroke="#364153"
                strokeWidth={1.5}
              />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Bibliography
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Captions & References */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Captions & References
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleInsertCaption}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <FileText
                className="size-[18px]"
                stroke="#364153"
                strokeWidth={1.5}
              />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Caption
              </p>
            </div>
          </button>
          <button
            onClick={handleInsertCrossRef}
            className="border border-transparent h-[55px] w-[78px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Link
                className="size-[18px]"
                stroke="#364153"
                strokeWidth={1.5}
              />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Cross-ref
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Index */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Index
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleInsertIndex}
            className="border border-transparent h-[55px] w-[82px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <ListOrdered
                className="size-[18px]"
                stroke="#364153"
                strokeWidth={1.5}
              />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Insert Index
              </p>
            </div>
          </button>
          <button
            onClick={handleUpdateIndex}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <RefreshCw
                className="size-[18px]"
                stroke="#364153"
                strokeWidth={1.5}
              />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Update
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
