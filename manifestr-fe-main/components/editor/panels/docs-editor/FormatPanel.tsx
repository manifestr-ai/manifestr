import React, { useState, useEffect, useRef } from "react";
import { 
  Scissors, Copy, Clipboard, Eraser, ChevronDown, Bold, Italic, Underline,
  Palette, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, IndentDecrease, IndentIncrease, Space, Strikethrough,
  Subscript, Superscript
} from "lucide-react";

interface FormatPanelProps {
  store?: any;
  editor?: any;
}

export default function FormatPanel({ store, editor }: FormatPanelProps) {
  const [style, setStyle] = useState("Normal");
  const [font, setFont] = useState("Inter");
  const [fontSize, setFontSize] = useState("12pt");
  const [textColor, setTextColor] = useState("#000000");
  const textColorInputRef = useRef<HTMLInputElement | null>(null);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const highlightMenuAnchorRef = useRef<HTMLButtonElement | null>(null);
  const highlightMenuRef = useRef<HTMLDivElement | null>(null);
  const [highlightMenuPos, setHighlightMenuPos] = useState<{ top: number; right: number } | null>(null);

  const focusEditor = () => {
    if (!editor) return;
    if (typeof editor.commands?.focus === "function") {
      editor.commands.focus();
      return;
    }
    if (typeof editor.view?.focus === "function") {
      editor.view.focus();
    }
  };

  const isEditableTarget = (target: EventTarget | null) => {
    const el = target as HTMLElement | null;
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
  };

  // Update active states based on editor state
  useEffect(() => {
    if (!editor) return;

    const updateStates = () => {
      if (editor.isActive('heading', { level: 1 })) setStyle('Heading 1');
      else if (editor.isActive('heading', { level: 2 })) setStyle('Heading 2');
      else if (editor.isActive('heading', { level: 3 })) setStyle('Heading 3');
      else setStyle('Normal');

      const activeColor = editor.getAttributes?.("textStyle")?.color;
      setTextColor(typeof activeColor === "string" ? activeColor : "#000000");
    };

    editor.on("selectionUpdate", updateStates);
    editor.on("update", updateStates);

    return () => {
      editor.off("selectionUpdate", updateStates);
      editor.off("update", updateStates);
    };
  }, [editor]);

  useEffect(() => {
    if (!showHighlightMenu) return;

    const close = (e: MouseEvent) => {
      const anchor = highlightMenuAnchorRef.current;
      const menu = highlightMenuRef.current;
      if (e.target instanceof Node) {
        if (anchor && anchor.contains(e.target)) return;
        if (menu && menu.contains(e.target)) return;
      }
      setShowHighlightMenu(false);
    };

    window.addEventListener("mousedown", close, true);
    return () => window.removeEventListener("mousedown", close, true);
  }, [showHighlightMenu]);

  useEffect(() => {
    if (!editor) return;

    const onKeyDown = async (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      if (!(e.metaKey || e.ctrlKey)) return;

      const key = e.key.toLowerCase();
      if (key !== "c" && key !== "x" && key !== "v") return;

      focusEditor();

      if (key === "c") {
        document.execCommand("copy");
        return;
      }

      if (key === "x") {
        document.execCommand("cut");
        return;
      }

      try {
        const text = await navigator.clipboard.readText();
        if (text && typeof editor.commands?.insertContent === "function") {
          editor.commands.insertContent(text);
        }
      } catch {}
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [editor]);

  const applyTextColor = (color: string) => {
    setTextColor(color);
    if (!editor) return;
    if (typeof editor.chain?.().focus?.().setColor === "function") {
      editor.chain().focus().setColor(color).run();
      return;
    }
    editor.chain().focus().setMark("textStyle", { color }).run();
  };

  const applyHighlight = (color: string | null) => {
    if (!editor) return;
    focusEditor();

    const isTiptapLike = typeof editor?.commands?.focus === "function";

    if (color == null) {
      if (isTiptapLike) {
        if (typeof editor.chain?.().focus?.().unsetHighlight === "function") {
          editor.chain().focus().unsetHighlight().run();
          return;
        }
        if (typeof editor.chain?.().focus?.().unsetMark === "function") {
          editor.chain().focus().unsetMark("highlight").run();
          return;
        }
        return;
      }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const getHighlightedAncestor = (node: Node | null): HTMLElement | null => {
        const el =
          (node &&
            (node.nodeType === Node.ELEMENT_NODE
              ? (node as HTMLElement)
              : (node as any).parentElement)) ||
          null;
        if (!el) return null;
        const highlighted = el.closest?.('[style*="background-color"]') as HTMLElement | null;
        if (highlighted?.style?.backgroundColor) return highlighted;
        if (el?.style?.backgroundColor) return el;
        return null;
      };
      const isSelectionHighlighted = () => {
        const a = getHighlightedAncestor(selection.anchorNode);
        const f = getHighlightedAncestor(selection.focusNode);
        return !!(a || f);
      };

      if (!isSelectionHighlighted()) return;
      if (typeof editor.chain?.().focus?.().toggleHighlight === "function") {
        editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run();
      }
      return;
    }

    if (isTiptapLike) {
      if (typeof editor.chain?.().focus?.().setHighlight === "function") {
        editor.chain().focus().setHighlight({ color }).run();
        return;
      }
      editor.chain().focus().toggleHighlight({ color }).run();
      return;
    }

    if (typeof editor.chain?.().focus?.().setHighlight === "function") {
      editor.chain().focus().setHighlight(color).run();
      return;
    }

    if (typeof editor.chain?.().focus?.().toggleHighlight === "function") {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
  };

  // Quick Actions
  const handleCut = async () => {
    if (!editor) return;
    focusEditor();
    const ok = document.execCommand("cut");
    if (ok) return;

    try {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, "\n");
      if (text) await navigator.clipboard.writeText(text);
      editor.commands.deleteSelection();
    } catch {}
  };

  const handleCopy = async () => {
    if (!editor) return;
    focusEditor();
    const ok = document.execCommand("copy");
    if (ok) return;

    try {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, "\n");
      if (text) await navigator.clipboard.writeText(text);
    } catch {}
  };

  const handlePaste = async () => {
    if (!editor) return;
    focusEditor();
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        editor.chain().focus().insertContent(text).run();
        return;
      }
    } catch {}
    document.execCommand("paste");
  };

  const handleClear = () => {
    if (editor) {
      // Clear all formatting and marks from selection
      editor.chain().focus().unsetAllMarks().clearNodes().run();
      // Also delete the selected content
      editor.chain().focus().deleteSelection().run();
    }
  };

  // Style changes
  const handleStyleChange = (newStyle: string) => {
    setStyle(newStyle);
    if (!editor) return;

    switch (newStyle) {
      case "Heading 1":
        editor.chain().focus().setHeading({ level: 1 }).run();
        break;
      case "Heading 2":
        editor.chain().focus().setHeading({ level: 2 }).run();
        break;
      case "Heading 3":
        editor.chain().focus().setHeading({ level: 3 }).run();
        break;
      default:
        editor.chain().focus().setParagraph().run();
    }
  };

  // Font family changes
  const handleFontChange = (newFont: string) => {
    setFont(newFont);
    if (!editor) return;

    // Apply font family using Tiptap FontFamily extension
    editor.chain().focus().setFontFamily(newFont).run();
  };

  // Font size changes
  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize);
    if (!editor) return;

    // Apply font size using custom FontSize extension
    editor.chain().focus().setFontSize(newSize).run();
  };

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-5 h-[89px] overflow-x-auto px-6">
      {/* Quick Actions */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Quick Actions
        </p>
        <div className="flex gap-2">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleCut}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
            type="button"
          >
            <Scissors className="size-4" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Cut</p>
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleCopy}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
            type="button"
          >
            <Copy className="size-4" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Copy
            </p>
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handlePaste}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
            type="button"
          >
            <Clipboard className="size-4" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Paste
            </p>
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
            type="button"
          >
            <Eraser className="size-4" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Clear
            </p>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Style */}
      <div className="h-[58px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Style
        </p>
        <div className="relative">
          <select
            value={style}
            onChange={(e) => handleStyleChange(e.target.value)}
            className="border border-[#d1d5dc] rounded-md h-[34px] w-[144px] px-3 font-inter text-sm text-[#0a0a0a] appearance-none"
          >
            <option>Normal</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
            <option>Heading 3</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-[11px] size-3 pointer-events-none"
            stroke="#364153"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Font */}
      <div className="h-[58px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Font
        </p>
        <div className="flex gap-2.5 items-center">
          <div className="relative">
            <select
              value={font}
              onChange={(e) => handleFontChange(e.target.value)}
              className="border border-[#d1d5dc] rounded-md h-[34px] w-[249px] px-3 font-inter text-sm text-[#0a0a0a] appearance-none"
            >
              <option>Inter</option>
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Courier New</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-[11px] size-3 pointer-events-none"
              stroke="#364153"
              strokeWidth={1.5}
            />
          </div>
          <div className="relative">
            <select
              value={fontSize}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              className="border border-[#d1d5dc] rounded-md h-[34px] w-[80px] px-3 font-inter text-sm text-[#0a0a0a] appearance-none"
            >
              <option>8pt</option>
              <option>10pt</option>
              <option>12pt</option>
              <option>14pt</option>
              <option>16pt</option>
              <option>18pt</option>
              <option>24pt</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-[11px] size-3 pointer-events-none"
              stroke="#364153"
              strokeWidth={1.5}
            />
          </div>
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive("bold")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Bold 
              className="size-[18px]" 
              stroke={editor?.isActive("bold") ? "#2563eb" : "#364153"} 
              strokeWidth={editor?.isActive("bold") ? 2 : 1.5} 
            />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive("italic")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Italic
              className="size-[18px]"
              stroke={editor?.isActive("italic") ? "#2563eb" : "#364153"}
              strokeWidth={editor?.isActive("italic") ? 2 : 1.5}
            />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive("underline")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Underline
              className="size-[18px]"
              stroke={editor?.isActive("underline") ? "#2563eb" : "#364153"}
              strokeWidth={editor?.isActive("underline") ? 2 : 1.5}
            />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Text & Highlight Colors */}
      <div className="h-[81px] flex gap-5 shrink-0 pt-2">
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              focusEditor();
              textColorInputRef.current?.click();
            }}
            className="border border-transparent h-[65px] w-[39px] rounded-[14px] hover:bg-gray-50 transition-colors flex flex-col items-center justify-start pt-2 gap-1"
          >
            <Palette className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
            <div className="h-1.5 w-8 rounded" style={{ backgroundColor: textColor }} />
            <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
              Text
            </p>
          </button>
          <input
            ref={textColorInputRef}
            type="color"
            value={textColor}
            onChange={(e) => applyTextColor(e.target.value)}
            className="absolute inset-0 opacity-0 pointer-events-none"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
        <div className="relative">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyHighlight("#fef08a")}
            className={`border border-transparent h-[65px] w-[47px] rounded-[14px] hover:bg-gray-50 transition-colors flex flex-col items-center justify-start pt-2 gap-1 ${
              editor?.isActive("highlight") ? "bg-gray-100" : ""
            }`}
            type="button"
          >
            <Highlighter className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
            <div className="bg-yellow-400 h-1.5 w-8 rounded" />
            <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
              Highlight
            </p>
          </button>

          <button
            ref={highlightMenuAnchorRef}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const rect = highlightMenuAnchorRef.current?.getBoundingClientRect();
              if (rect) {
                setHighlightMenuPos({
                  top: rect.bottom + 8,
                  right: Math.max(8, window.innerWidth - rect.right),
                });
              } else {
                setHighlightMenuPos({ top: 96, right: 24 });
              }
              setShowHighlightMenu((v) => !v);
            }}
            className="absolute -right-1 -top-1 rounded-md hover:bg-gray-100 p-0.5"
            aria-label="Highlight options"
          >
            <ChevronDown className="size-3" stroke="#364153" strokeWidth={1.5} />
          </button>

          {showHighlightMenu && highlightMenuPos && (
            <div
              ref={highlightMenuRef}
              className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-1 w-[160px]"
              style={{ top: highlightMenuPos.top, right: highlightMenuPos.right }}
            >
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  applyHighlight("#ffffff00");
                  setShowHighlightMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-50 text-sm text-[#0a0a0a]"
              >
                No color
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  applyHighlight("#fef08a");
                  setShowHighlightMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-50 text-sm text-[#0a0a0a] flex items-center gap-2"
              >
                <span className="inline-block h-3 w-3 rounded bg-yellow-300" />
                Yellow
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Alignment */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Alignment
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive({ textAlign: "left" })
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <AlignLeft 
              className="size-4" 
              stroke={editor?.isActive({ textAlign: "left" }) ? "#2563eb" : "#364153"} 
              strokeWidth={1.5} 
            />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive({ textAlign: "center" })
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <AlignCenter
              className="size-4"
              stroke={editor?.isActive({ textAlign: "center" }) ? "#2563eb" : "#364153"}
              strokeWidth={1.5}
            />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive({ textAlign: "right" })
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <AlignRight 
              className="size-4" 
              stroke={editor?.isActive({ textAlign: "right" }) ? "#2563eb" : "#364153"} 
              strokeWidth={1.5} 
            />
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().setTextAlign("justify").run()
            }
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive({ textAlign: "justify" })
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <AlignJustify
              className="size-4"
              stroke={editor?.isActive({ textAlign: "justify" }) ? "#2563eb" : "#364153"}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Lists & Spacing */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Lists & Spacing
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              editor?.isActive("bulletList")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <List 
              className="size-4" 
              stroke={editor?.isActive("bulletList") ? "#2563eb" : "#364153"} 
              strokeWidth={1.5} 
            />
            <p className={`font-inter font-normal text-xs ${
              editor?.isActive("bulletList") ? "text-blue-600 font-medium" : "text-[#4a5565]"
            }`}>
              Bullets
            </p>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              editor?.isActive("orderedList")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <ListOrdered
              className="size-4"
              stroke={editor?.isActive("orderedList") ? "#2563eb" : "#364153"}
              strokeWidth={1.5}
            />
            <p className={`font-inter font-normal text-xs ${
              editor?.isActive("orderedList") ? "text-blue-600 font-medium" : "text-[#4a5565]"
            }`}>
              Numbers
            </p>
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().liftListItem("listItem").run()
            }
            disabled={!editor?.can().liftListItem("listItem")}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              !editor?.can().liftListItem("listItem")
                ? "border-transparent opacity-40 cursor-not-allowed"
                : "border-transparent hover:bg-gray-100 hover:border-gray-200"
            }`}
          >
            <IndentDecrease
              className="size-4"
              stroke="#364153"
              strokeWidth={1.5}
            />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Outdent
            </p>
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().sinkListItem("listItem").run()
            }
            disabled={!editor?.can().sinkListItem("listItem")}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              !editor?.can().sinkListItem("listItem")
                ? "border-transparent opacity-40 cursor-not-allowed"
                : "border-transparent hover:bg-gray-100 hover:border-gray-200"
            }`}
          >
            <IndentIncrease
              className="size-4"
              stroke="#364153"
              strokeWidth={1.5}
            />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Indent
            </p>
          </button>
          <button 
            onClick={() => {
              // Toggle line spacing (add/remove margin)
              const selection = window.getSelection();
              if (selection && selection.anchorNode) {
                const parent = selection.anchorNode.parentElement;
                if (parent) {
                  const currentMargin = parent.style.marginBottom;
                  parent.style.marginBottom = currentMargin === '16pt' ? '8pt' : '16pt';
                }
              }
            }}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-100 hover:border-gray-200 transition-all flex items-center gap-2"
          >
            <Space className="size-4" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Spacing
            </p>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* More */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          More
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              editor?.isActive("strike")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Strikethrough
              className="size-4"
              stroke={editor?.isActive("strike") ? "#2563eb" : "#364153"}
              strokeWidth={1.5}
            />
            <p className={`font-inter font-normal text-xs ${
              editor?.isActive("strike") ? "text-blue-600 font-medium" : "text-[#4a5565]"
            }`}>
              Strike
            </p>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleSubscript().run()}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              editor?.isActive("subscript")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Subscript 
              className="size-4" 
              stroke={editor?.isActive("subscript") ? "#2563eb" : "#364153"} 
              strokeWidth={1.5} 
            />
            <p className={`font-inter font-normal text-xs ${
              editor?.isActive("subscript") ? "text-blue-600 font-medium" : "text-[#4a5565]"
            }`}>
              Subscript
            </p>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleSuperscript().run()}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              editor?.isActive("superscript")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Superscript
              className="size-4"
              stroke={editor?.isActive("superscript") ? "#2563eb" : "#364153"}
              strokeWidth={1.5}
            />
            <p className={`font-inter font-normal text-xs ${
              editor?.isActive("superscript") ? "text-blue-600 font-medium" : "text-[#4a5565]"
            }`}>
              Super
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
