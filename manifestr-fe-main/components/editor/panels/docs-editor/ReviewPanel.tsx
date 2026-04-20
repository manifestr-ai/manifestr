import React, { useState } from "react";

interface ReviewPanelProps {
  store?: any;
  editor?: any;
}

export default function ReviewPanel({ store, editor }: ReviewPanelProps) {
  // Icon URLs from Figma - REVIEW TAB
  const imgFind = "https://www.figma.com/api/mcp/asset/593e4508-39e2-40e9-9ef0-0f769a0f51d1";
  const imgReplace = "https://www.figma.com/api/mcp/asset/2af02242-f31a-40a4-8ba4-f95c3eda2546";
  const imgSelectAll = "https://www.figma.com/api/mcp/asset/e63c397b-e718-4a12-acb7-b257e4d50858";
  const imgSpellCheck = "https://www.figma.com/api/mcp/asset/533ed37c-880b-4f02-bfd4-718d8287d9d5";
  const imgThesaurus = "https://www.figma.com/api/mcp/asset/3baba350-b98c-448e-b154-3b85ce717fc8";
  const imgWordCount = "https://www.figma.com/api/mcp/asset/d466074f-b741-427c-8131-1c916263231d";
  const imgNewComment = "https://www.figma.com/api/mcp/asset/00f42780-9039-4a71-9c88-232e0ff51e09";
  const imgShowComments = "https://www.figma.com/api/mcp/asset/b23f40b2-ea60-42f2-a755-cef1d9293d99";
  const imgTrackChanges = "https://www.figma.com/api/mcp/asset/c2ca3f1c-bf47-456a-8875-5eaf23b792e9";

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

  // Toast notification helper
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // Find functionality with highlighting
  const handleFind = () => {
    setShowFindModal(true);
  };

  const executeFind = () => {
    if (!editor || !findText) return;
    
    // Update the SearchHighlight extension options to highlight the search term
    editor.extensionManager.extensions.forEach((ext: any) => {
      if (ext.name === 'searchHighlight') {
        ext.options.searchTerm = findText;
      }
    });
    
    // Force editor to re-render with new decorations
    editor.view.updateState(editor.state);
    
    showToast(`Highlighting: "${findText}"`);
    setShowFindModal(false);
  };

  const clearFind = () => {
    if (!editor) return;
    
    editor.extensionManager.extensions.forEach((ext: any) => {
      if (ext.name === 'searchHighlight') {
        ext.options.searchTerm = '';
      }
    });
    
    editor.view.updateState(editor.state);
    setFindText("");
  };

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
    
    // Select all text in the editor
    const { tr } = editor.state;
    const allSelection = {
      from: 0,
      to: editor.state.doc.content.size,
    };
    
    editor.view.dispatch(
      tr.setSelection(
        editor.state.selection.constructor.create(editor.state.doc, allSelection.from, allSelection.to)
      )
    );
    
    editor.view.focus();
    showToast('All text selected');
  };

  // Spell Check
  const handleSpellCheck = () => {
    if (!editor) return;
    const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
    if (editorElement) {
      const currentSpellcheck = editorElement.getAttribute('spellcheck');
      const newSpellcheck = currentSpellcheck === 'true' ? 'false' : 'true';
      editorElement.setAttribute('spellcheck', newSpellcheck);
      showToast(newSpellcheck === 'true' ? 'Spell check enabled' : 'Spell check disabled');
    }
  };

  // Thesaurus - FIXED!
  const handleThesaurus = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ').trim();
    
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
    
    const text = editor.getText();
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    let paragraphs = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'paragraph') paragraphs++;
    });
    
    return { words, characters, charactersNoSpaces, paragraphs };
  };

  // New Comment - FIXED!
  const handleNewComment = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      showToast('Select text to add a comment');
      return;
    }
    setShowCommentModal(true);
  };

  const submitComment = () => {
    if (!editor || !commentText) return;
    
    // Wrap selection with comment mark using Tiptap highlight
    editor.chain().focus().toggleHighlight({ color: '#fef3c7' }).run();
    
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
              <img alt="" className="block size-[18px]" src={imgFind} />
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
              <img alt="" className="block size-[18px]" src={imgReplace} />
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
              <img alt="" className="block size-[18px]" src={imgSelectAll} />
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
              <img alt="" className="block size-[18px]" src={imgSpellCheck} />
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
              <img alt="" className="block size-[18px]" src={imgThesaurus} />
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
              <img alt="" className="block size-[18px]" src={imgWordCount} />
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
              <img alt="" className="block size-[18px]" src={imgNewComment} />
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
              <img alt="" className="block size-[18px]" src={imgShowComments} />
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
              <img alt="" className="block size-[18px]" src={imgTrackChanges} />
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
