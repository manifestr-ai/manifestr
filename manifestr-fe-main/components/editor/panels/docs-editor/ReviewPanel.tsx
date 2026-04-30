import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, Replace, MousePointerClick, CheckCircle, BookOpen, Hash, MessageSquarePlus, Eye, FileEdit, ChevronUp, ChevronDown, X } from "lucide-react";

interface ReviewPanelProps {
  store?: any;
  editor?: any;
}

export default function ReviewPanel({ store, editor }: ReviewPanelProps) {

  // State
  const [toast, setToast] = useState<string | null>(null);
  const [showFindModal, setShowFindModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showWordCountModal, setShowWordCountModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showThesaurusModal, setShowThesaurusModal] = useState(false);
  const [showCommentsVisible, setShowCommentsVisible] = useState(true);
  const [trackChangesEnabled, setTrackChangesEnabled] = useState(false);
  
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [replaceFindText, setReplaceFindText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedWordForThesaurus, setSelectedWordForThesaurus] = useState("");
  const [findBarOpen, setFindBarOpen] = useState(false);
  const [findActiveIndex, setFindActiveIndex] = useState(0);
  const [findMatchCount, setFindMatchCount] = useState(0);
  const findInputRef = useRef<HTMLInputElement | null>(null);
  const tiptapMatchesRef = useRef<Array<{ from: number; to: number }>>([]);

  // Toast notification helper
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // Find functionality with highlighting
  const handleFind = () => {
    setFindBarOpen(true);
    setTimeout(() => {
      findInputRef.current?.focus();
      findInputRef.current?.select();
    }, 0);
  };

  const clearHighlightsOnly = () => {
    if (!editor) return;
    if (typeof editor?.commands?.clearSearchTerm === "function") {
      editor.commands.clearSearchTerm();
      tiptapMatchesRef.current = [];
      return;
    }
    const root = document.querySelector(".ProseMirror") as HTMLElement | null;
    if (!root) return;
    const marks = Array.from(
      root.querySelectorAll('mark[data-type="search-highlight"]'),
    ) as HTMLElement[];
    marks.forEach((m) => {
      const parent = m.parentNode;
      if (!parent) return;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
    });
    root.querySelectorAll('[data-search-active="true"]').forEach((el) => {
      try {
        (el as HTMLElement).removeAttribute("data-search-active");
        (el as HTMLElement).classList.remove("search-highlight--active");
      } catch {}
    });
    root.normalize();
  };

  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const rebuildMatches = useMemo(() => {
    return (term: string) => {
      if (!editor) return { count: 0 };
      const value = (term || "").trim();
      if (!value) {
        clearHighlightsOnly();
        setFindMatchCount(0);
        setFindActiveIndex(0);
        return { count: 0 };
      }

      if (typeof editor?.commands?.setSearchTerm === "function" && editor?.state?.doc) {
        editor.commands.setSearchTerm(value);
        const regex = new RegExp(escapeRegex(value), "gi");
        const matches: Array<{ from: number; to: number }> = [];
        editor.state.doc.descendants((node: any, pos: number) => {
          if (!node.isText || !node.text) return;
          const all = Array.from(String(node.text).matchAll(regex));
          all.forEach((m: any) => {
            if (m.index == null) return;
            const from = pos + m.index;
            const to = from + String(m[0]).length;
            matches.push({ from, to });
          });
        });
        tiptapMatchesRef.current = matches;
        setFindMatchCount(matches.length);
        setFindActiveIndex(matches.length ? 0 : 0);
        return { count: matches.length };
      }

      const root = document.querySelector(".ProseMirror") as HTMLElement | null;
      if (!root) return { count: 0 };

      const clearDomHighlights = () => {
        const marks = Array.from(
          root.querySelectorAll('mark[data-type="search-highlight"]'),
        ) as HTMLElement[];
        marks.forEach((m) => {
          const parent = m.parentNode;
          if (!parent) return;
          while (m.firstChild) parent.insertBefore(m.firstChild, m);
          parent.removeChild(m);
        });
        root.querySelectorAll('[data-search-active="true"]').forEach((el) => {
          try {
            (el as HTMLElement).removeAttribute("data-search-active");
            (el as HTMLElement).classList.remove("search-highlight--active");
          } catch {}
        });
        root.normalize();
      };

      const highlightDom = (t: string) => {
        clearDomHighlights();
        const escaped = escapeRegex(t);
        if (!escaped) return 0;
        const regex = new RegExp(escaped, "gi");

        const nodes: Text[] = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode: (node: any) => {
            const text = node?.nodeValue || "";
            if (!text || !text.trim()) return NodeFilter.FILTER_REJECT;
            const el = node.parentElement as HTMLElement | null;
            if (!el) return NodeFilter.FILTER_REJECT;
            if (el.closest('mark[data-type="search-highlight"]')) return NodeFilter.FILTER_REJECT;
            if (el.closest("script, style")) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        } as any);

        let current: any;
        while ((current = walker.nextNode())) nodes.push(current as Text);

        let count = 0;
        nodes.forEach((textNode) => {
          const text = textNode.nodeValue || "";
          regex.lastIndex = 0;
          const matches = Array.from(text.matchAll(regex));
          if (matches.length === 0) return;

          const frag = document.createDocumentFragment();
          let last = 0;
          matches.forEach((m) => {
            const idx = m.index ?? -1;
            if (idx < 0) return;
            const before = text.slice(last, idx);
            if (before) frag.appendChild(document.createTextNode(before));
            const mark = document.createElement("mark");
            mark.setAttribute("data-type", "search-highlight");
            mark.className = "search-highlight";
            mark.textContent = m[0];
            frag.appendChild(mark);
            count += 1;
            last = idx + m[0].length;
          });
          const after = text.slice(last);
          if (after) frag.appendChild(document.createTextNode(after));
          try {
            textNode.parentNode?.replaceChild(frag, textNode);
          } catch {}
        });
        return count;
      };

      const count = highlightDom(value);
      setFindMatchCount(count);
      setFindActiveIndex(count ? 0 : 0);
      return { count };
    };
  }, [editor]);

  const gotoMatch = (index: number) => {
    if (!editor) return;
    if (findMatchCount <= 0) return;
    const nextIndex = ((index % findMatchCount) + findMatchCount) % findMatchCount;
    setFindActiveIndex(nextIndex);

    if (typeof editor?.commands?.setSearchTerm === "function" && tiptapMatchesRef.current.length) {
      const match = tiptapMatchesRef.current[nextIndex];
      if (!match) return;
      try {
        editor.chain().focus().setTextSelection({ from: match.from, to: match.to }).run();
      } catch {
        try {
          editor.commands.setTextSelection({ from: match.from, to: match.to });
        } catch {}
      }
      try {
        const root = document.querySelector(".ProseMirror") as HTMLElement | null;
        const coords = editor.view.coordsAtPos(match.from);
        if (root) {
          const rect = root.getBoundingClientRect();
          const delta = coords.top - rect.top;
          root.scrollTop += delta - root.clientHeight / 3;
        }
      } catch {}
      return;
    }

    const root = document.querySelector(".ProseMirror") as HTMLElement | null;
    if (!root) return;
    const marks = Array.from(
      root.querySelectorAll('mark[data-type="search-highlight"]'),
    ) as HTMLElement[];
    marks.forEach((m) => {
      m.removeAttribute("data-search-active");
      m.classList.remove("search-highlight--active");
    });
    const el = marks[nextIndex] || null;
    if (!el) return;
    el.setAttribute("data-search-active", "true");
    el.classList.add("search-highlight--active");
    try {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    } catch {}
  };

  const closeFindBar = () => {
    clearHighlightsOnly();
    setFindBarOpen(false);
    setFindMatchCount(0);
    setFindActiveIndex(0);
  };

  const executeFind = () => {
    if (!editor || !findText) return;
    setFindBarOpen(true);
    const { count } = rebuildMatches(findText);
    if (count > 0) gotoMatch(0);
    showToast(count > 0 ? `Found ${count} match(es)` : `No matches for "${findText}"`);
    setShowFindModal(false);
  };

  const clearFind = () => {
    if (!editor) return;

    clearHighlightsOnly();
    setFindText("");
  };

  useEffect(() => {
    if (!findBarOpen) return;
    const { count } = rebuildMatches(findText);
    if (count > 0) gotoMatch(findActiveIndex);
  }, [findBarOpen]);

  useEffect(() => {
    if (!findBarOpen) return;
    const id = setTimeout(() => {
      const { count } = rebuildMatches(findText);
      if (count > 0) gotoMatch(0);
    }, 120);
    return () => clearTimeout(id);
  }, [findText, findBarOpen]);

  useEffect(() => {
    if (!findBarOpen) return;
    const root = document.querySelector(".ProseMirror") as HTMLElement | null;
    if (!root) return;
    const handler = () => {
      const { count } = rebuildMatches(findText);
      if (count > 0) gotoMatch(Math.min(findActiveIndex, count - 1));
    };
    root.addEventListener("input", handler, true);
    return () => root.removeEventListener("input", handler, true);
  }, [findBarOpen, findText, findActiveIndex, rebuildMatches]);

  // Replace functionality
  const handleReplace = () => {
    setShowReplaceModal(true);
  };

  const executeReplace = () => {
    if (!editor || !replaceFindText || !replaceText) return;
    
    const content = editor.getHTML();
    const regex = new RegExp(replaceFindText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;
    
    const newContent = content.replace(regex, replaceText);
    editor.commands.setContent(newContent);
    
    showToast(`Replaced ${count} occurrence(s)`);
    setShowReplaceModal(false);
    setReplaceFindText("");
    setReplaceText("");
  };

  // Select All - FIXED!
  const handleSelectAll = () => {
    if (!editor) return;
    
    // Select all content in contentEditable div
    const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
    if (editorElement) {
      const range = document.createRange();
      range.selectNodeContents(editorElement);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      editorElement.focus();
      showToast('All text selected');
    }
  };

  // Spell Check
  const handleSpellCheck = () => {
    if (!editor) return;
    const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
    if (editorElement) {
      const next = !editorElement.spellcheck;
      editorElement.spellcheck = next;
      editorElement.setAttribute('spellcheck', next ? 'true' : 'false');
      if (!editorElement.getAttribute('lang')) {
        editorElement.setAttribute('lang', 'en');
      }
      editorElement.focus();
      showToast(next ? 'Spell check enabled' : 'Spell check disabled');
    }
  };

  // Thesaurus - FIXED!
  const handleThesaurus = () => {
    if (!editor) return;
    
    // Get selected text from window selection
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || "";
    
    if (!selectedText) {
      showToast('Select a word to find synonyms');
      return;
    }
    
    setSelectedWordForThesaurus(selectedText);
    setShowThesaurusModal(true);
  };

  // Word Count
  const handleWordCount = () => {
    setShowWordCountModal(true);
  };

  const getWordCount = () => {
    if (!editor) return { words: 0, characters: 0, charactersNoSpaces: 0, paragraphs: 0 };
    
    const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
    if (!editorElement) return { words: 0, characters: 0, charactersNoSpaces: 0, paragraphs: 0 };
    
    const text = editorElement.textContent || "";
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = editorElement.querySelectorAll('p').length || 1;
    
    return { words, characters, charactersNoSpaces, paragraphs };
  };

  // New Comment - FIXED!
  const handleNewComment = () => {
    if (!editor) return;
    
    // Check if text is selected
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === "") {
      showToast('Select text to add a comment');
      return;
    }
    
    setShowCommentModal(true);
  };

  const submitComment = () => {
    if (!editor || !commentText) return;
    
    // Wrap selection with comment mark using Tiptap highlight
    const sanitizedComment = commentText.trim().replace(/\s+/g, " ");
    editor
      .chain()
      .focus()
      .toggleHighlight({ color: "#fef3c7", comment: sanitizedComment })
      .run();
    
    showToast('Comment added (hover over yellow text)');
    setShowCommentModal(false);
    setCommentText("");
  };

  // Show/Hide Comments - FIXED!
  const handleToggleComments = () => {
    if (!editor) return;
    
    const newState = !showCommentsVisible;
    setShowCommentsVisible(newState);
    
    // Toggle comment visibility using CSS
    const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
    if (editorElement) {
      if (newState) {
        editorElement.classList.remove('hide-comments');
      } else {
        editorElement.classList.add('hide-comments');
      }
    }
    
    showToast(newState ? 'Comments shown' : 'Comments hidden');
  };

  // Track Changes
  const handleTrackChanges = () => {
    setTrackChangesEnabled(!trackChangesEnabled);
    showToast(trackChangesEnabled ? 'Track changes disabled' : 'Track changes enabled');
  };

  const stats = showWordCountModal ? getWordCount() : { words: 0, characters: 0, charactersNoSpaces: 0, paragraphs: 0 };

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[79px] overflow-x-auto px-6 relative">
      {findBarOpen && (
        <div className="fixed top-31 right-6 z-50 bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Search className="size-4" stroke="#364153" strokeWidth={1.5} />
            <input
              ref={findInputRef}
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  gotoMatch(findActiveIndex + (e.shiftKey ? -1 : 1));
                }
                if (e.key === "Escape") {
                  closeFindBar();
                }
              }}
              placeholder="Find"
              className="w-[220px] px-2 py-1 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="text-xs text-gray-600 w-[64px] text-center">
            {findMatchCount ? `${findActiveIndex + 1}/${findMatchCount}` : "0/0"}
          </div>
          <button
            type="button"
            onClick={() => gotoMatch(findActiveIndex - 1)}
            disabled={findMatchCount === 0}
            className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronUp className="size-4" stroke="#364153" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => gotoMatch(findActiveIndex + 1)}
            disabled={findMatchCount === 0}
            className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronDown className="size-4" stroke="#364153" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={closeFindBar}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="size-4" stroke="#364153" strokeWidth={1.5} />
          </button>
        </div>
      )}
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          <p className="font-inter text-sm font-medium">{toast}</p>
        </div>
      )}

      {/* Find Modal */}
      {showFindModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowFindModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Find Text</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search for:</label>
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeFind()}
                placeholder="Enter text to find"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">All matches will be highlighted in yellow</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  clearFind();
                  setShowFindModal(false);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Clear & Close
              </button>
              <button
                onClick={executeFind}
                disabled={!findText}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Highlight All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replace Modal */}
      {showReplaceModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowReplaceModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Find & Replace</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Find:</label>
                <input
                  type="text"
                  value={replaceFindText}
                  onChange={(e) => setReplaceFindText(e.target.value)}
                  placeholder="Text to find"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Replace with:</label>
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Replacement text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowReplaceModal(false);
                  setReplaceFindText("");
                  setReplaceText("");
                }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeReplace}
                disabled={!replaceFindText || !replaceText}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Replace All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Word Count Modal */}
      {showWordCountModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowWordCountModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Document Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Words:</span>
                <span className="text-2xl font-bold text-gray-900">{stats.words}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Characters (with spaces):</span>
                <span className="text-xl font-semibold text-gray-900">{stats.characters}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Characters (no spaces):</span>
                <span className="text-xl font-semibold text-gray-900">{stats.charactersNoSpaces}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Paragraphs:</span>
                <span className="text-xl font-semibold text-gray-900">{stats.paragraphs}</span>
              </div>
            </div>
            <button
              onClick={() => setShowWordCountModal(false)}
              className="w-full mt-6 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Thesaurus Modal */}
      {showThesaurusModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowThesaurusModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Thesaurus</h3>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Selected word:</p>
              <p className="text-2xl font-bold text-blue-600">"{selectedWordForThesaurus}"</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                💡 Check online thesaurus for synonyms of this word, or we can integrate an API for real-time suggestions.
              </p>
            </div>
            <button
              onClick={() => setShowThesaurusModal(false)}
              className="w-full mt-6 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowCommentModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add Comment</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Comment:</label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your comment..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">Selected text will be highlighted in yellow</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setCommentText("");
                }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitComment}
                disabled={!commentText}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Find & Replace Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Find & Replace
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleFind}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Search className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Find
              </p>
            </div>
          </button>
          <button 
            onClick={handleReplace}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Replace className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Replace
              </p>
            </div>
          </button>
          <button 
            onClick={handleSelectAll}
            className="border border-transparent h-[55px] w-[79px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <MousePointerClick className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Select All
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Proofing Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Proofing
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleSpellCheck}
            className="border border-transparent h-[55px] w-[83px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <CheckCircle className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Spell Check
              </p>
            </div>
          </button>
          <button 
            onClick={handleThesaurus}
            className="border border-transparent h-[55px] w-[76px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <BookOpen className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Thesaurus
              </p>
            </div>
          </button>
          <button 
            onClick={handleWordCount}
            className="border border-transparent h-[55px] w-[89px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Hash className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Word Count
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Comments & Tracking Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Comments & Tracking
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleNewComment}
            className="border border-transparent h-[55px] w-[97px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <MessageSquarePlus className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                New Comment
              </p>
            </div>
          </button>
          <button 
            onClick={handleToggleComments}
            className={`border border-transparent h-[55px] w-[104px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors ${
              showCommentsVisible ? 'bg-gray-100' : ''
            }`}
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Eye className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Show Comments
              </p>
            </div>
          </button>
          <button 
            onClick={handleTrackChanges}
            className={`border border-transparent h-[55px] w-[98px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors ${
              trackChangesEnabled ? 'bg-gray-100' : ''
            }`}
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <FileEdit className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Track Changes
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
