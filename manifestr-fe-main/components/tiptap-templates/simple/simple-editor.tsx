"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { Extension, Node, mergeAttributes } from "@tiptap/core";
import { NodeSelection, Plugin, PluginKey } from "@tiptap/pm/state";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Link } from "@tiptap/extension-link";
import { FontFamily } from "../../../lib/tiptap-font-family-extension";
import { Selection } from "@tiptap/extensions";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

// --- UI Primitives ---
import { Button } from "../../tiptap-ui-primitive/button";
import { Spacer } from "../../tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "../../tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "../../tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "../../tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "../../tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "../../tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "../../tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "../../tiptap-ui/blockquote-button";
import { CodeBlockButton } from "../../tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "../../tiptap-ui/color-highlight-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "../../tiptap-ui/link-popover";
import { MarkButton } from "../../tiptap-ui/mark-button";
import { TextAlignButton } from "../../tiptap-ui/text-align-button";
import { UndoRedoButton } from "../../tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "../../tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "../../tiptap-icons/highlighter-icon";
import { LinkIcon } from "../../tiptap-icons/link-icon";

// --- Hooks ---
import { useIsBreakpoint } from "../../../hooks/use-is-breakpoint";
import { useWindowSize } from "../../../hooks/use-window-size";
import { useCursorVisibility } from "../../../hooks/use-cursor-visibility";

// --- Components ---

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "../../../lib/tiptap-utils";
import { FontSize } from "../../../lib/tiptap-font-size-extension";
import { PageBreak } from "../../../lib/tiptap-page-break-extension";
import { DocumentHeader } from "../../../lib/tiptap-document-header-extension";
import { DocumentFooter } from "../../../lib/tiptap-document-footer-extension";
import { ParagraphIndent } from "../../../lib/tiptap-paragraph-indent-extension";
import { ParagraphSpacing } from "../../../lib/tiptap-paragraph-spacing-extension";
import { SearchHighlight } from "../../../lib/tiptap-search-highlight-extension";

// --- Styles ---

import content from "../../tiptap-templates/simple/data/content.json";

const CommentHighlight = Highlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      comment: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-comment"),
        renderHTML: (attributes) =>
          attributes.comment
            ? { "data-comment": attributes.comment, class: "comment-highlight" }
            : {},
      },
    };
  },
});

const TableDeleteOnBackspace = Extension.create({
  name: "tableDeleteOnBackspace",
  addKeyboardShortcuts() {
    const deleteTableIfSelected = () => {
      const { selection } = this.editor.state;
      if (selection instanceof NodeSelection && selection.node.type.name === "table") {
        return this.editor.commands.deleteSelection();
      }
      return false;
    };

    const deleteNodeBeforeIfTable = () => {
      return this.editor.commands.command(({ state, dispatch }) => {
        const { selection } = state;
        if (!selection.empty) return false;
        const $from = selection.$from;
        const before = $from.nodeBefore;
        if (!before || before.type.name !== "table") return false;
        const tr = state.tr.delete($from.pos - before.nodeSize, $from.pos);
        if (dispatch) dispatch(tr);
        return true;
      });
    };

    const deleteNodeAfterIfTable = () => {
      return this.editor.commands.command(({ state, dispatch }) => {
        const { selection } = state;
        if (!selection.empty) return false;
        const $from = selection.$from;
        const after = $from.nodeAfter;
        if (!after || after.type.name !== "table") return false;
        const tr = state.tr.delete($from.pos, $from.pos + after.nodeSize);
        if (dispatch) dispatch(tr);
        return true;
      });
    };

    return {
      Backspace: () =>
        deleteTableIfSelected() ||
        deleteNodeBeforeIfTable() ||
        false,
      Delete: () =>
        deleteTableIfSelected() ||
        deleteNodeAfterIfTable() ||
        false,
    };
  },
});

const PageNumberConfig = Node.create({
  name: "pageNumberConfig",
  group: "block",
  atom: true,
  selectable: false,
  draggable: false,
  addAttributes() {
    return {
      position: {
        default: "bottom-center",
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="page-number-config"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "page-number-config",
        class: "page-number-config",
      }),
    ];
  },
});

const PageNumber = Node.create({
  name: "pageNumber",
  group: "block",
  atom: true,
  selectable: false,
  draggable: false,
  addAttributes() {
    return {
      number: {
        default: 1,
      },
      position: {
        default: "bottom-center",
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="page-number"]' }];
  },
  renderHTML({ node, HTMLAttributes }) {
    const position = typeof node.attrs.position === "string" ? node.attrs.position : "bottom-center";
    const number = typeof node.attrs.number === "number" ? node.attrs.number : 1;
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "page-number",
        "data-position": position,
        class: `page-number page-number--${position}`,
      }),
      `Page ${number}`,
    ];
  },
});

const PAGE_NUMBER_META_KEY = "pageNumberUpdate";

const PageNumberManager = Extension.create({
  name: "pageNumberManager",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("pageNumberManager"),
        appendTransaction: (transactions, _oldState, newState) => {
          if (!transactions.some((tr) => tr.docChanged)) return null;
          if (transactions.some((tr) => tr.getMeta(PAGE_NUMBER_META_KEY))) return null;

          const configType = newState.schema.nodes.pageNumberConfig;
          const pageNumberType = newState.schema.nodes.pageNumber;
          const pageBreakType = newState.schema.nodes.pageBreak;
          if (!configType || !pageNumberType || !pageBreakType) return null;

          let configPos: number | null = null;
          let position: string | null = null;

          newState.doc.descendants((node, pos) => {
            if (node.type === configType) {
              configPos = pos;
              position = typeof node.attrs.position === "string" ? node.attrs.position : "bottom-center";
              return false;
            }
            return true;
          });

          if (!position) return null;

          const tr = newState.tr.setMeta(PAGE_NUMBER_META_KEY, true);

          const existingNumbers: Array<{ from: number; to: number }> = [];
          tr.doc.descendants((node, pos) => {
            if (node.type === pageNumberType) {
              existingNumbers.push({ from: pos, to: pos + node.nodeSize });
            }
            return true;
          });
          existingNumbers
            .sort((a, b) => b.from - a.from)
            .forEach(({ from, to }) => tr.delete(from, to));

          let configNodeSize = 0;
          let resolvedConfigPos = configPos;
          if (resolvedConfigPos != null) {
            const node = tr.doc.nodeAt(resolvedConfigPos);
            configNodeSize = node?.nodeSize ?? 0;
          }

          const breaks: Array<{ pos: number; size: number }> = [];
          tr.doc.descendants((node, pos) => {
            if (node.type === pageBreakType) breaks.push({ pos, size: node.nodeSize });
            return true;
          });

          const pageCount = breaks.length + 1;
          const insertAtStart = position.startsWith("top") || position.startsWith("middle");

          const insertions: Array<{ pos: number; number: number }> = [];
          for (let i = 0; i < pageCount; i++) {
            const start = i === 0 ? 0 : breaks[i - 1].pos + breaks[i - 1].size;
            const end = i < breaks.length ? breaks[i].pos : tr.doc.content.size;
            let insertPos = insertAtStart ? start : end;

            if (i === 0 && resolvedConfigPos === 0 && insertPos === 0) {
              insertPos = configNodeSize;
            }

            insertions.push({ pos: insertPos, number: i + 1 });
          }

          insertions
            .sort((a, b) => b.pos - a.pos)
            .forEach(({ pos, number }) => {
              tr.insert(pos, pageNumberType.create({ number, position }));
            });

          return tr.docChanged ? tr : null;
        },
      }),
    ];
  },
});

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

export function SimpleEditor({
  onUpdate,
  content: providedContent,
  onEditorReady,
}: {
  onUpdate?: (content: string) => void;
  content?: any;
  onEditorReady?: (editor: any) => void;
}) {
  const isMobile = useIsBreakpoint();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main",
  );
  const toolbarRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CommentHighlight.configure({ multicolor: true }),
      Image,
      Typography,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Underline,
      Superscript,
      Subscript,
      PageBreak,
      DocumentHeader,
      DocumentFooter,
      ParagraphIndent.configure({
        types: ['paragraph', 'heading'],
      }),
      ParagraphSpacing.configure({
        types: ['paragraph', 'heading'],
      }),
      SearchHighlight.configure({
        searchTerm: '',
        caseSensitive: false,
      }),
      Selection,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TableDeleteOnBackspace,
      PageNumberConfig,
      PageNumber,
      PageNumberManager,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (_error) => {},
      }),
    ],
    content: providedContent || content,
    onCreate({ editor }) {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
      if (onEditorReady) {
        onEditorReady(editor);
      }
    },
    onUpdate({ editor }) {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
  });

  // Update editor content if providedContent changes
  useEffect(() => {
    if (editor && providedContent) {
      // Compare to avoid resetting cursor or history purely on reference change if possible,
      // but typically setContent matches the logic needed for external load.
      // We only set it if the editor is empty or we want to force load.
      // For this showcase, simply setting it is safest to ensure it loads.
      // However, to avoid infinite loops or overwriting typing, we should clear content first or check.
      // Since this is an initial load mainly, we can trust useEditor "content" option usually.
      // DIFFERENT APPROACH: The issue might be next.js fast refresh or strict mode.
      // The 'dependencies' arg of useEditor is empty [], so it never re-initializes.
      // We must manually set content if providedContent changes.
      if (editor.isEmpty) {
        // Only set if empty or forcing? No, we want to replace default.
        editor.commands.setContent(providedContent);
      }
    }
  }, [editor, providedContent]);

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  );
}
